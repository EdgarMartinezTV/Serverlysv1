"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { formatTime } from "./availability";
import { DELIVERY_FEE, MENU, TAX_RATE, money } from "./menu";
import { fill, useLumbre, useNow } from "./state";
import { CHAR, CREAM, EMBER, RUST } from "./theme";
import { Stepper } from "./lumbre-menu";

/**
 * Floating "View order" button + the order drawer (a native modal <dialog>,
 * so focus is trapped, Escape closes it and the page behind is inert).
 *
 * ⚠ NO PAYMENT, NO NETWORK. "Place demo order" validates the form and shows a
 * confirmation generated in the browser. The drawer says so twice, because a
 * demo checkout that looks real is exactly the screen someone might trust.
 */
export function CartButton() {
  const { copy, count, subtotal, setCartOpen } = useLumbre();
  if (count === 0) return null;
  return (
    <button
      type="button"
      onClick={() => setCartOpen(true)}
      className="fixed right-[88px] bottom-4 left-4 z-40 flex h-14 items-center justify-between gap-3 rounded-full px-5 text-[15px] font-semibold shadow-[0_18px_40px_-10px_rgb(0_0_0/0.55)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:right-8 sm:left-auto sm:min-w-[300px]"
      style={{ background: EMBER, color: CHAR }}
    >
      <span className="flex items-center gap-2.5">
        <span className="flex size-7 items-center justify-center rounded-full text-[13px] tabular-nums" style={{ background: CHAR, color: CREAM }}>
          {count}
        </span>
        {copy.cart.open}
      </span>
      <span className="tabular-nums">{money(subtotal)}</span>
    </button>
  );
}

type Done = { number: string; ready: number; method: "pickup" | "delivery"; total: number };

export function CartDrawer() {
  const { copy, locale, lines, setQty, count, subtotal, cartOpen, setCartOpen, clear, goTo } = useLumbre();
  const c = copy.cart;
  const now = useNow();
  const ref = useRef<HTMLDialogElement>(null);
  const [method, setMethod] = useState<"pickup" | "delivery">("pickup");
  const [when, setWhen] = useState("asap");
  const [tip, setTip] = useState(0.18);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState<Done | null>(null);
  const doneRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (cartOpen && !d.open) d.showModal();
    if (!cartOpen && d.open) d.close();
  }, [cartOpen]);

  useEffect(() => {
    if (done) doneRef.current?.focus();
  }, [done]);

  const tax = subtotal * TAX_RATE;
  const fee = method === "delivery" ? DELIVERY_FEE : 0;
  const tipAmount = subtotal * tip;
  const total = subtotal + tax + fee + tipAmount;

  const place = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || phone.replace(/\D/g, "").length < 7) return setError(c.required);
    if (method === "delivery" && !address.trim()) return setError(c.addressRequired);
    setError("");
    const base = now ? now.getHours() * 60 + now.getMinutes() : 18 * 60;
    const offset = when === "asap" ? (method === "pickup" ? 25 : 45) : Number(when);
    setDone({
      number: String(1000 + Math.floor(Math.random() * 9000)),
      ready: Math.ceil((base + offset) / 5) * 5,
      method,
      total,
    });
    clear();
  };

  const close = () => setCartOpen(false);
  const input =
    "mt-1.5 block h-12 w-full rounded-xl bg-white px-4 text-[16px] text-[#14100d] ring-1 ring-inset ring-[#14100d]/15 focus:outline-none focus:ring-2 focus:ring-[#a4431a]";

  return (
    <dialog
      ref={ref}
      aria-labelledby="lumbre-cart-title"
      onClose={() => {
        setCartOpen(false);
        if (done) setDone(null);
      }}
      onClick={(e) => {
        if (e.target === ref.current) close();
      }}
      className="fixed inset-y-0 right-0 left-auto m-0 h-dvh max-h-dvh w-full max-w-[460px] bg-[#f6efe6] p-0 text-[#14100d] shadow-2xl backdrop:bg-[#14100d]/60 backdrop:backdrop-blur-sm"
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b border-[#14100d]/10 px-5 py-4">
          <h2 id="lumbre-cart-title" className="text-[20px] font-semibold">
            {done ? c.confirmedTitle : c.title}
          </h2>
          <button
            type="button"
            onClick={close}
            aria-label={c.close}
            className="flex size-10 items-center justify-center rounded-full hover:bg-[#14100d]/5 focus-visible:outline-2 focus-visible:outline-[#a4431a]"
          >
            <svg viewBox="0 0 20 20" aria-hidden="true" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="m5 5 10 10M15 5 5 15" />
            </svg>
          </button>
        </div>

        {done ? (
          <div className="flex-1 overflow-y-auto px-5 py-8">
            <span className="flex size-14 items-center justify-center rounded-full bg-[#dcfce7] text-[#15803d]">
              <svg viewBox="0 0 24 24" aria-hidden="true" className="size-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m5 12.5 4.5 4.5L19 7.5" />
              </svg>
            </span>
            <h3 ref={doneRef} tabIndex={-1} className="mt-5 text-[26px] font-semibold outline-none">
              {c.orderNumber} #{done.number}
            </h3>
            <dl className="mt-4 grid grid-cols-2 gap-3 text-[14px]">
              <div className="rounded-xl bg-white p-4">
                <dt className="text-[#5c5047]">{c.readyAt}</dt>
                <dd className="mt-1 text-[18px] font-semibold">{formatTime(done.ready % (24 * 60))}</dd>
              </div>
              <div className="rounded-xl bg-white p-4">
                <dt className="text-[#5c5047]">{c.total}</dt>
                <dd className="mt-1 text-[18px] font-semibold tabular-nums">{money(done.total)}</dd>
              </div>
            </dl>
            <p className="mt-6 rounded-xl bg-[#fff7ed] p-4 text-[14px] leading-[1.55] text-[#7c2d12] ring-1 ring-[#fed7aa]">
              {c.confirmedBody}
            </p>
            <button
              type="button"
              onClick={() => {
                setDone(null);
                close();
                goTo("menu");
              }}
              className="mt-6 h-12 w-full rounded-full text-[15px] font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a4431a]"
              style={{ background: CHAR, color: CREAM }}
            >
              {c.newOrder}
            </button>
          </div>
        ) : count === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-5 text-center">
            <p className="text-[16px] text-[#5c5047]">{c.empty}</p>
            <button
              type="button"
              onClick={() => {
                close();
                goTo("menu");
              }}
              className="mt-4 h-11 rounded-full px-5 text-[14px] font-semibold"
              style={{ background: CHAR, color: CREAM }}
            >
              {c.emptyCta}
            </button>
          </div>
        ) : (
          <form onSubmit={place} noValidate className="flex min-h-0 flex-1 flex-col">
            <div className="flex-1 overflow-y-auto px-5 py-5">
              <ul className="flex flex-col gap-4">
                {lines.map((l) => {
                  const item = MENU.find((m) => m.id === l.itemId)!;
                  const option = l.option !== null && item.options ? item.options.choices[l.option][locale] : null;
                  return (
                    <li key={l.key} className="flex gap-3 rounded-2xl bg-white p-3">
                      <span className="relative size-16 shrink-0 overflow-hidden rounded-xl">
                        <Image src={item.photo} alt="" fill sizes="64px" className="object-cover" />
                      </span>
                      <span className="flex min-w-0 flex-1 flex-col">
                        <span className="flex justify-between gap-2">
                          <span className="truncate text-[15px] font-semibold">{item.name[locale]}</span>
                          <span className="text-[15px] font-semibold tabular-nums">{money(item.price * l.qty)}</span>
                        </span>
                        {option && <span className="text-[13px] text-[#5c5047]">{option}</span>}
                        <span className="mt-2 flex items-center justify-between">
                          <Stepper
                            value={l.qty}
                            min={0}
                            onChange={(n) => setQty(l.key, n)}
                            decreaseLabel={fill(c.decrease, { item: item.name[locale] })}
                            increaseLabel={fill(c.increase, { item: item.name[locale] })}
                          />
                          <button type="button" onClick={() => setQty(l.key, 0)} className="text-[13px] font-semibold underline-offset-4 hover:underline" style={{ color: RUST }}>
                            {c.remove}
                            <span className="sr-only"> {item.name[locale]}</span>
                          </button>
                        </span>
                      </span>
                    </li>
                  );
                })}
              </ul>

              <fieldset className="mt-7">
                <legend className="text-[14px] font-semibold">{c.method}</legend>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {(["pickup", "delivery"] as const).map((m) => (
                    <label key={m} className="relative">
                      <input type="radio" name="method" checked={method === m} onChange={() => setMethod(m)} className="peer sr-only" />
                      <span className="flex h-12 cursor-pointer items-center justify-center rounded-xl bg-white text-[14px] font-semibold ring-1 ring-[#14100d]/15 peer-checked:bg-[#14100d] peer-checked:text-[#f6efe6] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#a4431a]">
                        {m === "pickup" ? c.pickup : c.delivery}
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>

              {method === "delivery" && (
                <div className="mt-4">
                  <label htmlFor="lumbre-address" className="text-[14px] font-semibold">
                    {c.address}
                  </label>
                  <input
                    id="lumbre-address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder={c.addressPlaceholder}
                    autoComplete="street-address"
                    className={input}
                  />
                </div>
              )}

              <div className="mt-4">
                <label htmlFor="lumbre-when" className="text-[14px] font-semibold">
                  {c.when}
                </label>
                <select id="lumbre-when" value={when} onChange={(e) => setWhen(e.target.value)} className={input}>
                  <option value="asap">{c.asap}</option>
                  {[45, 60, 90].map((m) => (
                    <option key={m} value={m}>
                      {locale === "es" ? `En ${m} ${c.minutes}` : `In ${m} ${c.minutes}`}
                    </option>
                  ))}
                </select>
              </div>

              <fieldset className="mt-5">
                <legend className="text-[14px] font-semibold">{c.tip}</legend>
                <div className="mt-2 grid grid-cols-4 gap-2">
                  {[0, 0.15, 0.18, 0.2].map((t) => (
                    <label key={t} className="relative">
                      <input type="radio" name="tip" checked={tip === t} onChange={() => setTip(t)} className="peer sr-only" />
                      <span className="flex h-11 cursor-pointer items-center justify-center rounded-xl bg-white text-[13px] font-semibold ring-1 ring-[#14100d]/15 peer-checked:bg-[#14100d] peer-checked:text-[#f6efe6] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#a4431a]">
                        {t === 0 ? c.noTip : `${Math.round(t * 100)}%`}
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="lumbre-name" className="text-[14px] font-semibold">
                    {c.name}
                  </label>
                  <input id="lumbre-name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="given-name" className={input} />
                </div>
                <div>
                  <label htmlFor="lumbre-phone" className="text-[14px] font-semibold">
                    {c.phone}
                  </label>
                  <input id="lumbre-phone" type="tel" inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" className={input} />
                </div>
              </div>

              <div className="mt-5 rounded-xl bg-white p-4">
                <p className="flex items-center gap-2 text-[14px] font-semibold">
                  <svg viewBox="0 0 20 20" aria-hidden="true" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.7">
                    <rect x="4" y="9" width="12" height="8" rx="1.5" />
                    <path d="M7 9V7a3 3 0 0 1 6 0v2" />
                  </svg>
                  {c.payment}
                </p>
                <p className="mt-1.5 text-[13px] leading-[1.5] text-[#5c5047]">{c.paymentNote}</p>
              </div>
            </div>

            <div className="border-t border-[#14100d]/10 bg-white px-5 pt-4 pb-5">
              <dl className="grid grid-cols-[1fr_auto] gap-y-1 text-[14px] text-[#4a3f36]">
                <dt>{c.subtotal}</dt>
                <dd className="tabular-nums">{money(subtotal)}</dd>
                <dt>{c.tax}</dt>
                <dd className="tabular-nums">{money(tax)}</dd>
                {fee > 0 && (
                  <>
                    <dt>{c.deliveryFee}</dt>
                    <dd className="tabular-nums">{money(fee)}</dd>
                  </>
                )}
                <dt>{c.tipLine}</dt>
                <dd className="tabular-nums">{money(tipAmount)}</dd>
                <dt className="mt-1 text-[16px] font-semibold text-[#14100d]">{c.total}</dt>
                <dd className="mt-1 text-[16px] font-semibold text-[#14100d] tabular-nums">{money(total)}</dd>
              </dl>
              {error && (
                <p role="alert" className="mt-3 text-[13px] font-medium text-[#b91c1c]">
                  {error}
                </p>
              )}
              <button
                type="submit"
                className={cn("mt-4 h-13 w-full rounded-full py-3.5 text-[15px] font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a4431a]")}
                style={{ background: EMBER, color: CHAR }}
              >
                {c.place} · {money(total)}
              </button>
              <p className="mt-2 text-center text-[12px] text-[#5c5047]">{c.demoNote}</p>
            </div>
          </form>
        )}
      </div>
    </dialog>
  );
}
