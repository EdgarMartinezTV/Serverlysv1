"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";
import { track } from "@/lib/analytics";
import { GALLERY, PACKAGES, SERVICES, WINDOWS, estimate, type AddOn, type Frequency, type Lang, type ServiceId, type SizeId } from "./brisa";

/**
 * Brisa Clean Co. — a complete, fictional cleaning-company website, the live
 * demo for /cleaning-company-websites. One page with its own header, mobile
 * menu (native <dialog>), estimator, appointment request, gallery and contact
 * form, switchable between English and Spanish in place.
 *
 * ⚠ NOTHING LEAVES THE BROWSER. Every form validates and shows a demo
 * confirmation. Prices are illustrative and labelled so.
 */

const TEAL = "#0f766e";
const MINT = "#ecfdf5";

const T = {
  en: {
    nav: { services: "Services", pricing: "Pricing", estimate: "Estimate", book: "Book", gallery: "Gallery", contact: "Contact" },
    navLabel: "Brisa Clean Co.",
    open: "Open menu",
    close: "Close menu",
    quote: "Get a quote",
    switch: "Español",
    switchAria: "Cambiar el sitio a español",
    heroKicker: "Home and office cleaning · Miami-Dade",
    heroTitle: "Spotless homes. Zero hassle.",
    heroBody: "Trusted cleaners for homes, rentals and offices from Miami Beach to Homestead. Get an instant estimate and book in two minutes.",
    heroEstimate: "Get an instant estimate",
    heroBook: "Book a cleaning",
    trust: ["Sample: licensed and insured", "Sample: eco-friendly products", "Sample: background-checked team"],
    servicesTitle: "Our services",
    servicesIntro: "From weekly upkeep to the deep clean before a big event.",
    from: "from",
    requestQuote: "Request a quote",
    pricingTitle: "Cleaning packages",
    pricingNote: "Illustrative prices for this demo. Your site shows your own.",
    choose: "Choose {name}",
    estTitle: "Instant estimate",
    estIntro: "Tell us about your home and see a price range right away.",
    service: "Service",
    serviceNames: { standard: "Standard cleaning", deep: "Deep cleaning", move: "Move-in / move-out", airbnb: "Airbnb turnover" },
    bedrooms: "Bedrooms",
    bathrooms: "Bathrooms",
    size: "Home size",
    sizes: { s: "Under 1,000 sq ft", m: "1,000–2,000 sq ft", l: "2,000–3,000 sq ft", xl: "Over 3,000 sq ft" },
    frequency: "How often",
    frequencies: { once: "One time", weekly: "Weekly (save 20%)", biweekly: "Every 2 weeks (save 15%)", monthly: "Monthly (save 10%)" },
    addOns: "Add-ons",
    addOnNames: { fridge: "Inside fridge", oven: "Inside oven", windows: "Interior windows", laundry: "Laundry" },
    estimate: "Your estimate",
    perVisit: "per visit",
    illustrative: "Illustrative estimate for this demo. A real site uses your own pricing.",
    estRequest: "Request this quote",
    estName: "Name",
    estContact: "Phone or email",
    zip: "ZIP code",
    estSend: "Send quote request",
    estRequired: "Please add your name, a phone or email, and a 5-digit ZIP code.",
    estDoneTitle: "Demo quote request received",
    estDoneBody: "On a live site, this request reaches the cleaning company by email or CRM with the estimate attached. This is a demo, so nothing was sent.",
    another: "Start over",
    bookTitle: "Request an appointment",
    bookIntro: "Pick a day and an arrival window. We confirm by text.",
    date: "Day",
    closed: "Closed",
    window: "Arrival window",
    address: "Street address",
    bookSend: "Request appointment",
    bookRequired: "Please choose a day and window, and add your name, a phone or email, your address and ZIP code.",
    bookDoneTitle: "Demo appointment requested",
    bookDoneBody: "On a live site, this request goes to the company’s calendar or booking software for confirmation. This is a demo, so no appointment was made.",
    galleryTitle: "Recent work",
    galleryNote: "Sample photos for the demo. Your site shows your own jobs.",
    galleryOpen: "Open photo: {alt}",
    galleryClose: "Close photo",
    contactTitle: "Contact us",
    contactIntro: "Questions about a job, a contract or a quote? Send a message.",
    message: "Message",
    contactSend: "Send message",
    contactRequired: "Please add your name, a phone or email, and a message.",
    contactDoneTitle: "Demo message received",
    contactDoneBody: "On a live site, your message goes to the team’s inbox. This is a demo, so nothing was sent.",
    hours: "Hours",
    hoursValue: "Mon–Sat, 8 AM–6 PM",
    areas: "Service area",
    areasValue: "Miami-Dade County",
    phone: "Phone",
    footer: "Brisa Clean Co. is a fictional company created by Serverlys to demonstrate a cleaning company website. Its prices, phone number and claims are examples. Photos: Unsplash.",
  },
  es: {
    nav: { services: "Servicios", pricing: "Precios", estimate: "Estimado", book: "Reservar", gallery: "Galería", contact: "Contacto" },
    navLabel: "Brisa Clean Co.",
    open: "Abrir menú",
    close: "Cerrar menú",
    quote: "Cotizar",
    switch: "English",
    switchAria: "Switch the site to English",
    heroKicker: "Limpieza de casas y oficinas · Miami-Dade",
    heroTitle: "Casas impecables. Cero estrés.",
    heroBody: "Personal de limpieza de confianza para casas, alquileres y oficinas, de Miami Beach a Homestead. Obtenga un estimado al instante y reserve en dos minutos.",
    heroEstimate: "Obtener un estimado",
    heroBook: "Reservar una limpieza",
    trust: ["Ejemplo: con licencia y seguro", "Ejemplo: productos ecológicos", "Ejemplo: personal verificado"],
    servicesTitle: "Nuestros servicios",
    servicesIntro: "Desde el mantenimiento semanal hasta la limpieza profunda antes de un gran evento.",
    from: "desde",
    requestQuote: "Pedir cotización",
    pricingTitle: "Paquetes de limpieza",
    pricingNote: "Precios ilustrativos para esta demo. Su sitio muestra los suyos.",
    choose: "Elegir {name}",
    estTitle: "Estimado al instante",
    estIntro: "Cuéntenos sobre su casa y vea un rango de precio enseguida.",
    service: "Servicio",
    serviceNames: { standard: "Limpieza regular", deep: "Limpieza profunda", move: "Mudanza", airbnb: "Cambio de Airbnb" },
    bedrooms: "Habitaciones",
    bathrooms: "Baños",
    size: "Tamaño de la casa",
    sizes: { s: "Menos de 1,000 pies²", m: "1,000–2,000 pies²", l: "2,000–3,000 pies²", xl: "Más de 3,000 pies²" },
    frequency: "Frecuencia",
    frequencies: { once: "Una vez", weekly: "Semanal (ahorre 20%)", biweekly: "Cada 2 semanas (ahorre 15%)", monthly: "Mensual (ahorre 10%)" },
    addOns: "Extras",
    addOnNames: { fridge: "Interior de nevera", oven: "Interior de horno", windows: "Ventanas interiores", laundry: "Lavandería" },
    estimate: "Su estimado",
    perVisit: "por visita",
    illustrative: "Estimado ilustrativo para esta demo. Un sitio real usa sus propios precios.",
    estRequest: "Pedir esta cotización",
    estName: "Nombre",
    estContact: "Teléfono o correo",
    zip: "Código postal",
    estSend: "Enviar solicitud",
    estRequired: "Escriba su nombre, un teléfono o correo y un código postal de 5 dígitos.",
    estDoneTitle: "Solicitud de cotización de demo recibida",
    estDoneBody: "En un sitio real, esta solicitud llega a la empresa por correo o CRM con el estimado adjunto. Es una demo, así que no se envió nada.",
    another: "Empezar de nuevo",
    bookTitle: "Pedir una cita",
    bookIntro: "Elija un día y un horario de llegada. Confirmamos por texto.",
    date: "Día",
    closed: "Cerrado",
    window: "Horario de llegada",
    address: "Dirección",
    bookSend: "Pedir cita",
    bookRequired: "Elija un día y un horario, y escriba su nombre, un teléfono o correo, su dirección y su código postal.",
    bookDoneTitle: "Cita de demo solicitada",
    bookDoneBody: "En un sitio real, esta solicitud va al calendario o al software de reservas de la empresa para confirmarla. Es una demo, así que no se hizo ninguna cita.",
    galleryTitle: "Trabajos recientes",
    galleryNote: "Fotos de ejemplo para la demo. Su sitio muestra sus propios trabajos.",
    galleryOpen: "Abrir foto: {alt}",
    galleryClose: "Cerrar foto",
    contactTitle: "Contáctenos",
    contactIntro: "¿Preguntas sobre un trabajo, un contrato o una cotización? Envíe un mensaje.",
    message: "Mensaje",
    contactSend: "Enviar mensaje",
    contactRequired: "Escriba su nombre, un teléfono o correo y un mensaje.",
    contactDoneTitle: "Mensaje de demo recibido",
    contactDoneBody: "En un sitio real, su mensaje llega al correo del equipo. Es una demo, así que no se envió nada.",
    hours: "Horario",
    hoursValue: "Lun–sáb, 8 a. m.–6 p. m.",
    areas: "Zona de servicio",
    areasValue: "Condado de Miami-Dade",
    phone: "Teléfono",
    footer: "Brisa Clean Co. es una empresa ficticia creada por Serverlys para demostrar un sitio web de limpieza. Sus precios, teléfono y afirmaciones son ejemplos. Fotos: Unsplash.",
  },
};

type Copy = (typeof T)["en"];

/** Today at midnight on the client, null during SSR (no hydration mismatch). */
let todayCache: Date | null = null;
function getToday(): Date {
  const now = new Date();
  if (!todayCache || todayCache.getDate() !== now.getDate()) todayCache = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return todayCache;
}
const noSubscribe = () => () => {};
const useToday = () => useSyncExternalStore(noSubscribe, getToday, () => null);

const fill = (s: string, v: Record<string, string>) => s.replace(/\{(\w+)\}/g, (_, k) => v[k] ?? "");
const contactOk = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) || v.replace(/\D/g, "").length >= 7;

const input =
  "mt-1.5 block h-12 w-full rounded-xl bg-white px-4 text-[16px] text-[#0b1530] ring-1 ring-inset ring-black/15 focus:outline-none focus:ring-2 focus:ring-[#0f766e] aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-[#dc2626]";
const label = "text-[14px] font-semibold text-[#0b1530]";
// cn() does not resolve Tailwind conflicts (lib/utils.ts), so size lives
// outside the base and each button names exactly one.
const btnBase = "inline-flex items-center justify-center rounded-full font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0f766e]";
const btn = `${btnBase} h-12 px-6 text-[15px]`;

export function BrisaSite() {
  const [lang, setLang] = useState<Lang>("en");
  const t = T[lang];

  useEffect(() => {
    track("demo_view", { demo: "cleaning" });
  }, []);

  return (
    <div lang={lang} className="bg-white text-[#0b1530]">
      <Header t={t} lang={lang} onSwitch={() => setLang(lang === "en" ? "es" : "en")} />
      <Hero t={t} />
      <Services t={t} lang={lang} />
      <Packages t={t} lang={lang} />
      <Estimator t={t} lang={lang} />
      <Booking t={t} lang={lang} />
      <Gallery t={t} lang={lang} />
      <Contact t={t} />
      <footer className="bg-[#0b1530] px-5 py-10 text-[13px] leading-[1.6] text-white/70 sm:px-8">
        <div className="mx-auto max-w-[1200px]">
          <p className="flex items-center gap-2 text-[18px] font-bold text-white">
            <span className="size-4 rounded-full" style={{ background: "#34d399" }} />
            Brisa Clean Co.
          </p>
          <p className="mt-3 max-w-[760px]">{t.footer}</p>
        </div>
      </footer>
    </div>
  );
}

function Header({ t, lang, onSwitch }: { t: Copy; lang: Lang; onSwitch: () => void }) {
  const menu = useRef<HTMLDialogElement>(null);
  const links = Object.entries(t.nav) as [keyof Copy["nav"], string][];
  const href = (k: string) => `#brisa-${k}`;
  return (
    <header className="sticky top-18 z-30 border-b border-black/[0.06] bg-white/95 backdrop-blur">
      <nav aria-label={t.navLabel} className="mx-auto flex h-16 max-w-[1200px] items-center gap-3 px-5 sm:px-8">
        <a href="#brisa-top" className="flex items-center gap-2 text-[18px] font-bold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0f766e]">
          <span className="size-4 rounded-full" style={{ background: TEAL }} />
          <span className="whitespace-nowrap">
            Brisa<span className="font-normal text-[#5b6472] max-[400px]:sr-only"> Clean Co.</span>
          </span>
        </a>
        <ul className="ml-auto hidden items-center gap-1 lg:flex">
          {links.map(([k, v]) => (
            <li key={k}>
              <a href={href(k)} className="rounded-full px-3 py-2 text-[14px] font-medium text-[#2b3442] hover:bg-[#f1f5f4] focus-visible:outline-2 focus-visible:outline-[#0f766e]">
                {v}
              </a>
            </li>
          ))}
        </ul>
        <button type="button" onClick={onSwitch} aria-label={t.switchAria} lang={lang === "en" ? "es" : "en"} className="ml-auto rounded-full px-3 py-2 text-[14px] font-semibold text-[#0f766e] ring-1 ring-[#0f766e]/30 hover:bg-[#ecfdf5] focus-visible:outline-2 focus-visible:outline-[#0f766e] lg:ml-2">
          {t.switch}
        </button>
        <a href="#brisa-estimate" className="hidden h-10 items-center justify-center rounded-full px-5 text-[14px] font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0f766e] sm:inline-flex" style={{ background: TEAL }}>
          {t.quote}
        </a>
        <button type="button" onClick={() => menu.current?.showModal()} aria-label={t.open} aria-haspopup="dialog" className="flex size-10 items-center justify-center rounded-full ring-1 ring-black/10 focus-visible:outline-2 focus-visible:outline-[#0f766e] lg:hidden">
          <svg viewBox="0 0 24 24" aria-hidden="true" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>
      </nav>
      <dialog
        ref={menu}
        aria-label={t.navLabel}
        onClick={(e) => {
          if ((e.target as HTMLElement).closest("a") || e.target === menu.current) menu.current?.close();
        }}
        className="m-0 ml-auto h-dvh max-h-none w-[min(360px,100vw)] bg-white p-0 text-[#0b1530] shadow-2xl backdrop:bg-[#0b1530]/50"
      >
        <div className="flex h-full flex-col p-6">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-[18px] font-bold">
              <span className="size-4 rounded-full" style={{ background: TEAL }} />
              Brisa Clean Co.
            </span>
            <button type="button" onClick={() => menu.current?.close()} aria-label={t.close} className="flex size-10 items-center justify-center rounded-full ring-1 ring-black/10 focus-visible:outline-2 focus-visible:outline-[#0f766e]">
              <svg viewBox="0 0 20 20" aria-hidden="true" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="m5 5 10 10M15 5 5 15" />
              </svg>
            </button>
          </div>
          <ul className="mt-8 flex flex-col">
            {links.map(([k, v]) => (
              <li key={k}>
                <a href={href(k)} className="block border-b border-black/[0.06] py-4 text-[20px] font-semibold">
                  {v}
                </a>
              </li>
            ))}
          </ul>
          <a href="#brisa-estimate" className={cn(btn, "mt-auto")} style={{ background: TEAL }}>
            {t.quote}
          </a>
        </div>
      </dialog>
    </header>
  );
}

function Hero({ t }: { t: Copy }) {
  return (
    <section id="brisa-top" aria-labelledby="brisa-hero-heading" className="relative isolate overflow-hidden">
      <Image src="/cleaning/white-home.jpg" alt="" fill sizes="100vw" loading="eager" fetchPriority="high" className="-z-20 object-cover" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgb(255_255_255/0.97)_0%,rgb(255_255_255/0.9)_45%,rgb(255_255_255/0.2)_100%)]" />
      <div className="mx-auto max-w-[1200px] px-5 py-20 sm:px-8 lg:py-28">
        <p className="text-[13px] font-semibold tracking-[0.08em] uppercase" style={{ color: TEAL }}>
          {t.heroKicker}
        </p>
        <h1 id="brisa-hero-heading" className="mt-4 max-w-[640px] text-[44px] leading-[1.03] font-bold tracking-[-0.03em] text-[#0b1530] sm:text-[64px]">
          {t.heroTitle}
        </h1>
        <p className="mt-5 max-w-[520px] text-[17px] leading-[1.65] text-[#3b4452]">{t.heroBody}</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <a href="#brisa-estimate" className={cn(btnBase, "h-14 px-7 text-[16px]")} style={{ background: TEAL }}>
            {t.heroEstimate}
          </a>
          <a href="#brisa-book" className="inline-flex h-14 items-center justify-center rounded-full bg-white px-7 text-[16px] font-semibold text-[#0b1530] ring-1 ring-black/15 hover:ring-black/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0f766e]">
            {t.heroBook}
          </a>
        </div>
        <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-[14px] text-[#2b3442]">
          {t.trust.map((x) => (
            <li key={x} className="flex items-center gap-2">
              <svg viewBox="0 0 20 20" aria-hidden="true" className="size-4" fill="none" stroke={TEAL} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m5 10.5 3 3 7-7" />
              </svg>
              {x}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Section({ id, title, intro, tone = "white", children }: { id: string; title: string; intro?: string; tone?: "white" | "mint"; children: React.ReactNode }) {
  return (
    <section id={`brisa-${id}`} aria-labelledby={`brisa-${id}-heading`} className="scroll-mt-36 py-16 lg:py-24" style={{ background: tone === "mint" ? MINT : "#fff" }}>
      <div className="mx-auto max-w-[1200px] px-5 sm:px-8">
        <h2 id={`brisa-${id}-heading`} tabIndex={-1} className="text-[32px] leading-[1.1] font-bold tracking-[-0.02em] text-[#0b1530] outline-none sm:text-[40px]">
          {title}
        </h2>
        {intro && <p className="mt-3 max-w-[560px] text-[16px] leading-[1.6] text-[#5b6472]">{intro}</p>}
        {children}
      </div>
    </section>
  );
}

function Services({ t, lang }: { t: Copy; lang: Lang }) {
  return (
    <Section id="services" title={t.servicesTitle} intro={t.servicesIntro}>
      <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SERVICES.map((s) => (
          <li key={s.id} className="group overflow-hidden rounded-[20px] bg-[#f6f8f8] ring-1 ring-black/[0.05]">
            <div className="relative aspect-[16/10] overflow-hidden">
              <Image src={s.photo} alt="" fill sizes="(min-width: 1024px) 380px, (min-width: 640px) 45vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
            </div>
            <div className="p-5">
              <h3 className="flex items-baseline justify-between gap-3 text-[18px] font-semibold text-[#0b1530]">
                {s.name[lang]}
                {s.from && (
                  <span className="shrink-0 text-[14px] font-medium text-[#5b6472]">
                    {t.from} <strong style={{ color: TEAL }}>{s.from}</strong>
                  </span>
                )}
              </h3>
              <p className="mt-2 text-[14px] leading-[1.6] text-[#5b6472]">{s.body[lang]}</p>
              {!s.from && (
                <a href="#brisa-contact" className="mt-2 inline-flex min-h-6 items-center text-[14px] font-semibold underline-offset-4 hover:underline" style={{ color: TEAL }}>
                  {t.requestQuote} →
                </a>
              )}
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}

function Packages({ t, lang }: { t: Copy; lang: Lang }) {
  return (
    <Section id="pricing" title={t.pricingTitle} intro={t.pricingNote} tone="mint">
      <ul className="mt-10 grid gap-4 lg:grid-cols-3">
        {PACKAGES.map((p) => (
          <li key={p.id} className={cn("flex flex-col rounded-[22px] p-7", p.featured ? "text-white shadow-[0_24px_50px_-20px_rgb(15_118_110/0.6)]" : "bg-white ring-1 ring-black/[0.06]")} style={p.featured ? { background: TEAL } : undefined}>
            <h3 className="text-[20px] font-bold text-current">{p.name[lang]}</h3>
            <p className="mt-4 flex items-baseline gap-2">
              <span className="text-[40px] leading-none font-bold tracking-[-0.03em]">{p.price}</span>
              <span className={cn("text-[13px]", p.featured ? "text-white" : "text-[#5b6472]")}>{p.per[lang]}</span>
            </p>
            <ul className="mt-6 flex flex-col gap-2.5 text-[15px]">
              {p.items.map((it) => (
                <li key={it.en} className="flex gap-2.5">
                  <svg viewBox="0 0 20 20" aria-hidden="true" className="mt-0.5 size-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m5 10.5 3 3 7-7" />
                  </svg>
                  {it[lang]}
                </li>
              ))}
            </ul>
            <div className="mt-auto pt-8">
              <a
                href="#brisa-estimate"
                className={cn("flex h-12 items-center justify-center rounded-full text-[15px] font-semibold focus-visible:outline-2 focus-visible:outline-offset-2", p.featured ? "bg-white text-[#0f766e] focus-visible:outline-white" : "text-white focus-visible:outline-[#0f766e]")}
                style={p.featured ? undefined : { background: TEAL }}
              >
                {fill(t.choose, { name: p.name[lang] })}
              </a>
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}

function Counter({ id, label: text, value, onChange, min, max }: { id: string; label: string; value: number; onChange: (n: number) => void; min: number; max: number }) {
  const b = "flex size-11 items-center justify-center rounded-full text-[20px] ring-1 ring-black/15 hover:bg-black/[0.03] disabled:opacity-35 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0f766e]";
  return (
    <div role="group" aria-labelledby={id} className="flex items-center justify-between gap-4 rounded-xl bg-white px-4 py-2 ring-1 ring-black/10">
      <span id={id} className={label}>
        {text}
      </span>
      <span className="flex items-center gap-3">
        <button type="button" className={b} onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min} aria-label={`${text} −1`}>
          −
        </button>
        <output aria-live="polite" className="w-5 text-center text-[17px] font-bold tabular-nums">
          {value}
        </output>
        <button type="button" className={b} onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max} aria-label={`${text} +1`}>
          +
        </button>
      </span>
    </div>
  );
}

function Done({ title, body, onReset, again }: { title: string; body: string; onReset: () => void; again: string }) {
  const ref = useRef<HTMLHeadingElement>(null);
  useEffect(() => ref.current?.focus(), []);
  return (
    <div role="status" className="rounded-[20px] bg-white p-6 ring-1 ring-black/[0.06]">
      <span className="flex size-11 items-center justify-center rounded-full bg-[#dcfce7] text-[#15803d]">
        <svg viewBox="0 0 24 24" aria-hidden="true" className="size-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m5 12.5 4.5 4.5L19 7.5" />
        </svg>
      </span>
      <h3 ref={ref} tabIndex={-1} className="mt-4 text-[20px] font-bold text-[#0b1530] outline-none">
        {title}
      </h3>
      <p className="mt-2 text-[14px] leading-[1.6] text-[#5b6472]">{body}</p>
      <button type="button" onClick={onReset} className="mt-4 text-[14px] font-semibold underline underline-offset-4" style={{ color: TEAL }}>
        {again}
      </button>
    </div>
  );
}

function Estimator({ t, lang }: { t: Copy; lang: Lang }) {
  const [service, setService] = useState<ServiceId>("deep");
  const [bedrooms, setBedrooms] = useState(3);
  const [bathrooms, setBathrooms] = useState(2);
  const [size, setSize] = useState<SizeId>("m");
  const [frequency, setFrequency] = useState<Frequency>("once");
  const [addOns, setAddOns] = useState<AddOn[]>([]);
  const [requesting, setRequesting] = useState(false);
  const [form, setForm] = useState({ name: "", contact: "", zip: "" });
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const range = useMemo(() => estimate({ service, bedrooms, bathrooms, size, frequency, addOns }), [service, bedrooms, bathrooms, size, frequency, addOns]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !contactOk(form.contact) || !/^\d{5}$/.test(form.zip.trim())) return setError(t.estRequired);
    setError("");
    setDone(true);
    track("quote_request", { demo: "cleaning", service, frequency, low: range.low, high: range.high, lang });
  };

  return (
    <Section id="estimate" title={t.estTitle} intro={t.estIntro}>
      <div className="mt-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="grid gap-5 rounded-[22px] bg-[#f6f8f8] p-5 sm:p-7">
          <div>
            <label htmlFor="brisa-service" className={label}>
              {t.service}
            </label>
            <select id="brisa-service" value={service} onChange={(e) => setService(e.target.value as ServiceId)} className={input}>
              {(Object.keys(t.serviceNames) as ServiceId[]).map((k) => (
                <option key={k} value={k}>
                  {t.serviceNames[k]}
                </option>
              ))}
            </select>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Counter id="brisa-bedrooms" label={t.bedrooms} value={bedrooms} onChange={setBedrooms} min={1} max={6} />
            <Counter id="brisa-bathrooms" label={t.bathrooms} value={bathrooms} onChange={setBathrooms} min={1} max={5} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="brisa-size" className={label}>
                {t.size}
              </label>
              <select id="brisa-size" value={size} onChange={(e) => setSize(e.target.value as SizeId)} className={input}>
                {(Object.keys(t.sizes) as SizeId[]).map((k) => (
                  <option key={k} value={k}>
                    {t.sizes[k]}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="brisa-frequency" className={label}>
                {t.frequency}
              </label>
              <select id="brisa-frequency" value={frequency} onChange={(e) => setFrequency(e.target.value as Frequency)} className={input}>
                {(Object.keys(t.frequencies) as Frequency[]).map((k) => (
                  <option key={k} value={k}>
                    {t.frequencies[k]}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <fieldset>
            <legend className={label}>{t.addOns}</legend>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {(Object.keys(t.addOnNames) as AddOn[]).map((k) => {
                const on = addOns.includes(k);
                return (
                  <label key={k} className={cn("flex min-h-12 cursor-pointer items-center gap-2.5 rounded-xl bg-white px-3.5 text-[14px] ring-1 ring-inset has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-[#0f766e]", on ? "ring-2 ring-[#0f766e]" : "ring-black/15")}>
                    <input type="checkbox" checked={on} onChange={() => setAddOns((cur) => (on ? cur.filter((x) => x !== k) : [...cur, k]))} className="size-[18px] accent-[#0f766e]" />
                    {t.addOnNames[k]}
                  </label>
                );
              })}
            </div>
          </fieldset>
        </div>

        <div className="lg:sticky lg:top-40 lg:self-start">
          <div className="rounded-[22px] p-7 text-white" style={{ background: "#0b1530" }}>
            <p className="text-[14px] text-white/70">{t.estimate}</p>
            <p aria-live="polite" className="mt-2 text-[44px] leading-none font-bold tracking-[-0.03em] tabular-nums" data-estimate={`${range.low}-${range.high}`}>
              ${range.low} – ${range.high}
            </p>
            <p className="mt-2 text-[14px] text-white/70">{t.perVisit}</p>
            <p className="mt-5 rounded-xl bg-white/10 px-4 py-3 text-[13px] leading-[1.5] text-white/85">{t.illustrative}</p>
            {!requesting && !done && (
              <button type="button" onClick={() => setRequesting(true)} className={cn(btn, "mt-6 w-full")} style={{ background: "#34d399", color: "#0b1530" }}>
                {t.estRequest}
              </button>
            )}
          </div>
          {requesting && !done && (
            <form onSubmit={submit} noValidate className="mt-4 grid gap-4 rounded-[22px] bg-white p-6 ring-1 ring-black/[0.08]">
              {(
                [
                  ["name", t.estName, "name", "text"],
                  ["contact", t.estContact, "tel", "text"],
                  ["zip", t.zip, "postal-code", "text"],
                ] as const
              ).map(([k, text, ac, type]) => (
                <div key={k}>
                  <label htmlFor={`brisa-est-${k}`} className={label}>
                    {text}
                  </label>
                  <input id={`brisa-est-${k}`} type={type} autoComplete={ac} inputMode={k === "zip" ? "numeric" : undefined} value={form[k]} onChange={(e) => setForm((f) => ({ ...f, [k]: e.target.value }))} className={input} />
                </div>
              ))}
              {error && (
                <p role="alert" className="text-[14px] font-medium text-[#b91c1c]">
                  {error}
                </p>
              )}
              <button type="submit" className={btn} style={{ background: TEAL }}>
                {t.estSend}
              </button>
            </form>
          )}
          {done && (
            <div className="mt-4">
              <Done
                title={t.estDoneTitle}
                body={t.estDoneBody}
                again={t.another}
                onReset={() => {
                  setDone(false);
                  setRequesting(false);
                  setForm({ name: "", contact: "", zip: "" });
                }}
              />
            </div>
          )}
        </div>
      </div>
    </Section>
  );
}

function Booking({ t, lang }: { t: Copy; lang: Lang }) {
  const today = useToday();
  const days = today ? Array.from({ length: 12 }, (_, i) => new Date(today.getFullYear(), today.getMonth(), today.getDate() + i + 1)) : [];
  const [day, setDay] = useState<number | null>(null);
  const [win, setWin] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", contact: "", address: "", zip: "" });
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const fmt = (d: Date) => d.toLocaleDateString(lang === "es" ? "es-US" : "en-US", { weekday: "short", month: "short", day: "numeric" });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (day === null || !win || !form.name.trim() || !contactOk(form.contact) || !form.address.trim() || !/^\d{5}$/.test(form.zip.trim())) return setError(t.bookRequired);
    setError("");
    setDone(true);
  };

  return (
    <Section id="book" title={t.bookTitle} intro={t.bookIntro} tone="mint">
      <div className="mt-10 max-w-[860px]">
        {done ? (
          <Done
            title={t.bookDoneTitle}
            body={t.bookDoneBody}
            again={t.another}
            onReset={() => {
              setDone(false);
              setDay(null);
              setWin(null);
              setForm({ name: "", contact: "", address: "", zip: "" });
            }}
          />
        ) : (
          <form onSubmit={submit} noValidate className="grid gap-6 rounded-[22px] bg-white p-5 ring-1 ring-black/[0.06] sm:p-7">
            <fieldset className="min-w-0">
              <legend className={label}>{t.date}</legend>
              <div className="-mx-5 mt-2 flex gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:grid sm:grid-cols-6 sm:overflow-visible sm:px-0">
                {days.map((d, i) => {
                  const closed = d.getDay() === 0;
                  return (
                    <label key={i} className="relative shrink-0">
                      <input type="radio" name="brisa-day" checked={day === i} disabled={closed} onChange={() => setDay(i)} className="peer sr-only" />
                      <span className="flex h-16 w-[84px] cursor-pointer flex-col items-center justify-center rounded-xl text-center text-[13px] font-semibold ring-1 ring-black/15 peer-checked:bg-[#0f766e] peer-checked:text-white peer-checked:ring-[#0f766e] peer-disabled:cursor-not-allowed peer-disabled:opacity-40 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#0f766e] sm:w-auto">
                        {fmt(d)}
                        {closed && <span className="text-[11px] font-normal">{t.closed}</span>}
                      </span>
                    </label>
                  );
                })}
              </div>
            </fieldset>
            <fieldset>
              <legend className={label}>{t.window}</legend>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {WINDOWS.map((w) => (
                  <label key={w.id} className="relative">
                    <input type="radio" name="brisa-window" checked={win === w.id} onChange={() => setWin(w.id)} className="peer sr-only" />
                    <span className="flex h-12 cursor-pointer items-center justify-center rounded-xl text-center text-[14px] font-semibold ring-1 ring-black/15 peer-checked:bg-[#0f766e] peer-checked:text-white peer-checked:ring-[#0f766e] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#0f766e]">
                      {w.label[lang]}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
            <div className="grid gap-4 sm:grid-cols-2">
              {(
                [
                  ["name", t.estName, "name"],
                  ["contact", t.estContact, "tel"],
                  ["address", t.address, "street-address"],
                  ["zip", t.zip, "postal-code"],
                ] as const
              ).map(([k, text, ac]) => (
                <div key={k}>
                  <label htmlFor={`brisa-book-${k}`} className={label}>
                    {text}
                  </label>
                  <input id={`brisa-book-${k}`} autoComplete={ac} inputMode={k === "zip" ? "numeric" : undefined} value={form[k]} onChange={(e) => setForm((f) => ({ ...f, [k]: e.target.value }))} className={input} />
                </div>
              ))}
            </div>
            {error && (
              <p role="alert" className="text-[14px] font-medium text-[#b91c1c]">
                {error}
              </p>
            )}
            <button type="submit" className={cn(btn, "sm:justify-self-start")} style={{ background: TEAL }}>
              {t.bookSend}
            </button>
          </form>
        )}
      </div>
    </Section>
  );
}

function Gallery({ t, lang }: { t: Copy; lang: Lang }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const triggers = useRef<(HTMLButtonElement | null)[]>([]);
  const [open, setOpen] = useState<number | null>(null);
  useEffect(() => {
    if (open !== null && !dialog.current?.open) dialog.current?.showModal();
  }, [open]);
  return (
    <Section id="gallery" title={t.galleryTitle} intro={t.galleryNote}>
      <ul className="mt-10 grid grid-cols-2 gap-3 lg:grid-cols-3">
        {GALLERY.map((g, i) => (
          <li key={g.src} className="relative aspect-[4/3] overflow-hidden rounded-[16px]">
            <button
              ref={(el) => {
                triggers.current[i] = el;
              }}
              type="button"
              onClick={() => setOpen(i)}
              aria-label={fill(t.galleryOpen, { alt: g.alt[lang] })}
              className="group absolute inset-0 focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-[#0f766e]"
            >
              <Image src={g.src} alt="" fill sizes="(min-width: 1024px) 380px, 50vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
            </button>
          </li>
        ))}
      </ul>
      <dialog
        ref={dialog}
        aria-label={t.galleryTitle}
        onClose={() => {
          const last = open;
          setOpen(null);
          if (last !== null) triggers.current[last]?.focus();
        }}
        onClick={(e) => {
          if (e.target === dialog.current) dialog.current?.close();
        }}
        className="m-auto w-[min(1000px,calc(100vw-24px))] bg-transparent p-0 backdrop:bg-[#0b1530]/85"
      >
        {open !== null && (
          <figure className="relative">
            <div className="relative aspect-[3/2] overflow-hidden rounded-[16px] bg-black">
              <Image src={GALLERY[open].src} alt={GALLERY[open].alt[lang]} fill sizes="1000px" className="object-cover" />
            </div>
            <figcaption className="mt-3 text-center text-[15px] text-white">{GALLERY[open].alt[lang]}</figcaption>
            <button type="button" autoFocus onClick={() => dialog.current?.close()} aria-label={t.galleryClose} className="absolute top-3 right-3 flex size-11 items-center justify-center rounded-full bg-white text-[#0b1530] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
              <svg viewBox="0 0 20 20" aria-hidden="true" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="m5 5 10 10M15 5 5 15" />
              </svg>
            </button>
          </figure>
        )}
      </dialog>
    </Section>
  );
}

function Contact({ t }: { t: Copy }) {
  const [form, setForm] = useState({ name: "", contact: "", message: "" });
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !contactOk(form.contact) || !form.message.trim()) return setError(t.contactRequired);
    setError("");
    setDone(true);
  };
  return (
    <Section id="contact" title={t.contactTitle} intro={t.contactIntro} tone="mint">
      <div className="mt-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        {done ? (
          <Done title={t.contactDoneTitle} body={t.contactDoneBody} again={t.another} onReset={() => { setDone(false); setForm({ name: "", contact: "", message: "" }); }} />
        ) : (
          <form onSubmit={submit} noValidate className="grid gap-4 rounded-[22px] bg-white p-5 ring-1 ring-black/[0.06] sm:p-7">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="brisa-c-name" className={label}>
                  {t.estName}
                </label>
                <input id="brisa-c-name" autoComplete="name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className={input} />
              </div>
              <div>
                <label htmlFor="brisa-c-contact" className={label}>
                  {t.estContact}
                </label>
                <input id="brisa-c-contact" autoComplete="email" value={form.contact} onChange={(e) => setForm((f) => ({ ...f, contact: e.target.value }))} className={input} />
              </div>
            </div>
            <div>
              <label htmlFor="brisa-c-message" className={label}>
                {t.message}
              </label>
              <textarea id="brisa-c-message" rows={4} value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))} className={cn(input, "h-auto py-3")} />
            </div>
            {error && (
              <p role="alert" className="text-[14px] font-medium text-[#b91c1c]">
                {error}
              </p>
            )}
            <button type="submit" className={cn(btn, "sm:justify-self-start")} style={{ background: TEAL }}>
              {t.contactSend}
            </button>
          </form>
        )}
        <dl className="grid content-start gap-5 rounded-[22px] bg-white p-6 ring-1 ring-black/[0.06]">
          <div>
            <dt className="text-[13px] font-semibold tracking-[0.06em] text-[#5b6472] uppercase">{t.phone}</dt>
            <dd className="mt-1 text-[17px] font-semibold">
              <a href="tel:+13055550188" className="underline-offset-4 hover:underline">
                (305) 555-0188
              </a>
            </dd>
          </div>
          <div>
            <dt className="text-[13px] font-semibold tracking-[0.06em] text-[#5b6472] uppercase">{t.hours}</dt>
            <dd className="mt-1 text-[17px] font-semibold">{t.hoursValue}</dd>
          </div>
          <div>
            <dt className="text-[13px] font-semibold tracking-[0.06em] text-[#5b6472] uppercase">{t.areas}</dt>
            <dd className="mt-1 text-[17px] font-semibold">{t.areasValue}</dd>
          </div>
        </dl>
      </div>
    </Section>
  );
}
