"use client";

import { useId, useState } from "react";

/**
 * First-year earnings calculator for /affiliates.
 *
 * Arithmetic on our own prices, labelled as an example — never a claim about
 * what affiliates typically earn. It assumes the conservative case for
 * hosting (the cheapest first payment) and the optimistic one for ConvoAI
 * (every customer stays), and says both out loud under the result.
 *
 * ConvoAI: a customer referred in month k of the year pays 13 − k times
 * inside that year, so m referrals a month give m × (12 + 11 + … + 1) = 78m
 * payments. The 12-payment cap never bites inside one year.
 */
export function EarningsCalculator({
  hostingFirstPayment,
  convoPerPayment,
}: {
  /** Commission on the cheapest hosting plan's first invoice, in dollars. */
  hostingFirstPayment: number;
  /** Commission on one ConvoAI Pro payment, in dollars. */
  convoPerPayment: number;
}) {
  const [hosting, setHosting] = useState(4);
  const [convo, setConvo] = useState(2);
  const hostingId = useId();
  const convoId = useId();

  const hostingTotal = hosting * 12 * hostingFirstPayment;
  const convoTotal = convo * 78 * convoPerPayment;
  const total = hostingTotal + convoTotal;
  const money = (n: number) =>
    n.toLocaleString("en-US", { style: "currency", currency: "USD" });

  return (
    <div className="grid gap-2 lg:grid-cols-[1.1fr_1fr]">
      <div className="rounded-[calc(2rem-0.5rem)] bg-white p-7 shadow-[inset_0_1px_1px_rgb(255_255_255/0.9),0_1px_2px_rgb(11_21_48/0.04)] sm:p-10">
        <Slider
          id={hostingId}
          label="Hosting customers you refer each month"
          value={hosting}
          max={20}
          onChange={setHosting}
          note={`${money(hostingFirstPayment)} each, once`}
        />
        <div className="my-9 h-px bg-[#0b1530]/[0.06]" />
        <Slider
          id={convoId}
          label="ConvoAI Pro customers you refer each month"
          value={convo}
          max={10}
          onChange={setConvo}
          note={`${money(convoPerPayment)} on each of their first 12 payments`}
        />
      </div>

      <div className="relative isolate flex flex-col justify-between overflow-hidden rounded-[calc(2rem-0.5rem)] bg-[#060b1f] p-7 text-white sm:p-10">
        <div
          aria-hidden="true"
          className="absolute -top-24 -right-16 -z-10 size-72 rounded-full bg-[radial-gradient(circle,rgb(31_85_255/0.55),transparent_70%)]"
        />
        <p className="inline-flex w-max rounded-full bg-white/[0.08] px-3 py-1 text-[10px] font-medium tracking-[0.2em] text-white/70 uppercase ring-1 ring-white/10">
          An example, not a promise
        </p>
        <div className="mt-10">
          <p className="text-[14px] text-white/60">Your first 12 months</p>
          <output
            htmlFor={`${hostingId} ${convoId}`}
            aria-live="polite"
            className="mt-2 block font-display text-[56px] leading-none font-semibold tracking-[-0.04em] tabular-nums sm:text-[72px]"
          >
            {money(total)}
          </output>
          <dl className="mt-8 grid grid-cols-2 gap-4 border-t border-white/10 pt-6 text-[13px]">
            <div>
              <dt className="text-white/55">From hosting</dt>
              <dd className="mt-1 text-[17px] font-medium tabular-nums">
                {money(hostingTotal)}
              </dd>
            </div>
            <div>
              <dt className="text-white/55">From ConvoAI Pro</dt>
              <dd className="mt-1 text-[17px] font-medium tabular-nums">
                {money(convoTotal)}
              </dd>
            </div>
          </dl>
        </div>
        <p className="mt-8 text-[12.5px] leading-[1.6] text-white/55">
          Hosting at our lowest first payment. ConvoAI assumes every customer you refer
          stays. Your real numbers depend on who you know and what they buy.
        </p>
      </div>
    </div>
  );
}

function Slider({
  id,
  label,
  value,
  max,
  onChange,
  note,
}: {
  id: string;
  label: string;
  value: number;
  max: number;
  onChange: (n: number) => void;
  note: string;
}) {
  const pct = (value / max) * 100;
  return (
    <div>
      <div className="flex items-end justify-between gap-6">
        <label
          htmlFor={id}
          className="max-w-[260px] text-[15px] leading-snug text-[#0b1530]"
        >
          {label}
        </label>
        <span className="font-display text-[40px] leading-none font-semibold tracking-[-0.03em] text-[#0b1530] tabular-nums">
          {value}
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={0}
        max={max}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="plan-range mt-5 w-full"
        style={{ "--fill": `${pct}%` } as React.CSSProperties}
      />
      <p className="mt-3 text-[13px] text-[#5b6472]">{note}</p>
    </div>
  );
}
