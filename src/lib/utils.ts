/**
 * Conditional className composition.
 *
 * Deliberately dependency-free: components in this system expose typed
 * `variant`/`size` props rather than accepting arbitrary class overrides, so
 * conflict resolution (tailwind-merge) is not needed. If you find yourself
 * fighting a class here, add a variant instead of an override.
 */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}
