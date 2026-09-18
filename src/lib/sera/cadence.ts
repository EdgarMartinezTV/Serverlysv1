/**
 * Response cadence — how Sera's answers arrive on screen.
 *
 * THE PROBLEM THIS SOLVES. A raw streamed completion is jarring in two
 * opposite directions at once. When the model is fast, the first words land
 * ~200ms after the visitor hits Enter, which reads as a lookup table rather
 * than an assistant and makes people distrust the answer. When the model is
 * quick AND the answer is long, the whole paragraph materialises in a couple
 * of frames, which is worse: it is a wall of text, not a reply.
 *
 * ⚠ THE FIX IS NOT `setTimeout(respond, 2000)`. A fixed delay taxes every
 * answer equally, which means the slow ones — the ones that already made
 * someone wait — get punished twice. What this module does instead:
 *
 *   FLOOR, NEVER ADDITION. There is a minimum time between "sent" and "first
 *   word", and it is measured from the moment the message was sent. If the
 *   model takes longer than the floor, NOTHING is added — the answer appears
 *   the instant it exists. The delay only ever fills a gap that was there.
 *
 *   THE FLOOR RESPONDS TO WHAT IS ACTUALLY HAPPENING. A plain answer waits
 *   ~650ms. A turn that genuinely ran a server-side tool waits ~1250ms,
 *   because real work is being done and the tool's own label is on screen
 *   saying so. Nothing here invents work that did not occur.
 *
 *   REVEAL IS PACED IN WORDS. Not characters — a character typewriter is a
 *   gimmick that makes people wait to read something already downloaded. Words
 *   arrive in small groups, and the pace ACCELERATES when the buffer is deep,
 *   so a long answer never takes longer to display than it took to generate.
 *
 * Pure functions and one timing class, deliberately free of React: this is the
 * part worth reasoning about on its own, and it should be testable without
 * rendering anything.
 */

export const CADENCE = {
  /**
   * Minimum time from send to first visible word, for a plain answer.
   *
   * ⚠ RAISED FROM 650ms ON EDGAR'S REPORT THAT REPLIES FELT RUSHED. 650ms is
   * long enough that the answer is not literally instant and short enough that
   * the typing dots register as a flicker rather than as an assistant
   * thinking — which is the specific complaint. At ~1.1s the indicator is a
   * thing the eye actually settles on, and the reply that follows reads as
   * considered.
   *
   * Still a FLOOR measured from send, not a delay: a model that takes 2s adds
   * nothing. This only ever fills a gap that was already there.
   *
   * ⚠ AND THIS DOUBLES AS THE ANTI-FLICKER RULE, so there is no second
   * constant for it. The reveal loop holds EVERYTHING until `mayReveal`, and
   * the widget shows the typing indicator from the moment the message is sent
   * until the first word is revealed — so the indicator is on screen for at
   * least this long by construction. A separate "minimum indicator visibility"
   * value would be unreachable code that looked load-bearing.
   */
  floorMs: 1_100,

  /**
   * Raised floor once a real tool has run. Applies only when one actually did.
   * The extra time is not theatre — the tool's label is on screen for it,
   * naming work that genuinely happened.
   */
  toolFloorMs: 1_800,

  /**
   * Hard cap on artificial waiting, whatever else is true. A turn that somehow
   * accumulates floors must never leave a finished answer sitting unseen.
   *
   * ⚠ IT HAS TO EXCEED `toolFloorMs` OR IT SILENTLY OVERRIDES IT. At the old
   * 1500 against a 1250 tool floor this was nearly a no-op; raising the tool
   * floor without raising this would have made `toolRan()` do nothing, which is
   * the kind of change that looks applied and is not.
   */
  maxHoldMs: 2_400,


  /** Reveal tick. ~31fps — smooth enough to read, cheap enough to not thrash. */
  tickMs: 32,

  /** Words released per tick when the buffer is shallow (i.e. keeping pace). */
  baseWordsPerTick: 2,

  /** Buffer depth past which the reveal accelerates to catch up. */
  deepBufferWords: 40,

  /** Ceiling on the accelerated pace, so a long answer still reads as typed. */
  maxWordsPerTick: 9,
} as const;

/**
 * How many words to release this tick.
 *
 * Shallow buffer → a steady two words, which is the readable cruise pace.
 * Deep buffer → proportional catch-up, capped. The proportional term is what
 * keeps total reveal time roughly constant regardless of answer length: a
 * 40-word reply and a 400-word reply both finish in well under a second of
 * reveal, rather than the long one taking ten times as long to appear.
 */
export function wordsThisTick(pendingWords: number, streamFinished: boolean): number {
  if (pendingWords <= 0) return 0;

  if (pendingWords > CADENCE.deepBufferWords) {
    return Math.min(
      CADENCE.maxWordsPerTick,
      Math.max(CADENCE.baseWordsPerTick, Math.ceil(pendingWords / 20)),
    );
  }

  /*
   * The stream has ended and only a few words remain. Releasing them two at a
   * time would leave the last fragment trailing after the model already
   * finished, which reads as a stall right at the end of the answer.
   */
  if (streamFinished && pendingWords <= CADENCE.baseWordsPerTick * 2) {
    return pendingWords;
  }

  return CADENCE.baseWordsPerTick;
}

/**
 * Split off the next `count` words, preserving the whitespace that binds them.
 *
 * Splitting on word BOUNDARIES rather than on characters is the whole point,
 * but the separators have to travel with the words or the reveal re-flows the
 * paragraph on every tick — a visible judder as trailing spaces appear late.
 * Capturing the delimiter keeps the revealed prefix byte-identical to the
 * final text at every step.
 */
export function takeWords(buffer: string, count: number): { taken: string; rest: string } {
  if (count <= 0 || buffer.length === 0) return { taken: "", rest: buffer };

  let index = 0;
  let found = 0;

  while (index < buffer.length && found < count) {
    // Skip leading whitespace, then consume one word.
    while (index < buffer.length && /\s/.test(buffer[index])) index += 1;
    while (index < buffer.length && !/\s/.test(buffer[index])) index += 1;
    found += 1;
  }

  /*
   * Carry the whitespace that FOLLOWS the last word too. Without it the next
   * tick opens with a space, and a line break arrives one tick after the word
   * it should have followed — which shows up as a paragraph visibly snapping
   * into place.
   */
  while (index < buffer.length && /\s/.test(buffer[index])) index += 1;

  return { taken: buffer.slice(0, index), rest: buffer.slice(index) };
}

/** Whitespace-separated word count. Cheap; called once per tick. */
export function countWords(text: string): number {
  const trimmed = text.trim();
  return trimmed ? trimmed.split(/\s+/).length : 0;
}

/**
 * The floor for this turn, given what has happened so far.
 *
 * Takes the turn's own start time so the answer to "may I reveal yet?" is
 * always measured from the send, never from the arrival of the first token.
 * That distinction is the difference between a floor and an added delay.
 */
export class CadenceGate {
  private readonly startedAt: number;
  private floor: number;

  constructor(now: number) {
    this.startedAt = now;
    this.floor = CADENCE.floorMs;
  }

  /** A real server-side tool ran. Raise the floor once; never lower it. */
  toolRan(): void {
    this.floor = Math.min(CADENCE.maxHoldMs, Math.max(this.floor, CADENCE.toolFloorMs));
  }

  /** True once the perceived-processing floor has elapsed. */
  mayReveal(now: number): boolean {
    return now - this.startedAt >= this.floor;
  }


  /** Milliseconds still to wait, for scheduling rather than polling. */
  remaining(now: number): number {
    return Math.max(0, this.floor - (now - this.startedAt));
  }
}
