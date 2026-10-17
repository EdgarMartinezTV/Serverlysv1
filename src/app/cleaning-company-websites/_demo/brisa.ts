/**
 * Brisa Clean Co. — the FICTIONAL cleaning company behind
 * /cleaning-company-websites/demo. Every fact, price and contact detail here
 * is invented for the demo, and the page says so on screen. Never emit
 * LocalBusiness or review schema for it, and never give it reviews: a demo
 * with fake reviews would show clients exactly what we promise not to do.
 *
 * The estimator's numbers are ILLUSTRATIVE and labelled so. They are tuned so
 * a 3-bedroom, 2-bathroom deep clean at 1,000–2,000 sq ft comes to
 * $240–$280, the figure the landing-page hero animation shows.
 */

export type Lang = "en" | "es";
export type Bi = Record<Lang, string>;

export type ServiceId = "standard" | "deep" | "move" | "airbnb";
export type Frequency = "once" | "weekly" | "biweekly" | "monthly";
export type AddOn = "fridge" | "oven" | "windows" | "laundry";
export type SizeId = "s" | "m" | "l" | "xl";

export const PRICING = {
  base: { standard: 95, deep: 130, move: 160, airbnb: 85 } as Record<ServiceId, number>,
  perBedroom: 25,
  perBathroom: 20,
  size: { s: 0, m: 15, l: 45, xl: 85 } as Record<SizeId, number>,
  addOn: { fridge: 25, oven: 25, windows: 35, laundry: 20 } as Record<AddOn, number>,
  discount: { once: 0, weekly: 0.2, biweekly: 0.15, monthly: 0.1 } as Record<Frequency, number>,
  spread: [0.92, 1.08] as const,
};

const round5 = (n: number) => Math.round(n / 5) * 5;

export function estimate(input: {
  service: ServiceId;
  bedrooms: number;
  bathrooms: number;
  size: SizeId;
  frequency: Frequency;
  addOns: readonly AddOn[];
}): { low: number; high: number } {
  const subtotal =
    PRICING.base[input.service] +
    input.bedrooms * PRICING.perBedroom +
    input.bathrooms * PRICING.perBathroom +
    PRICING.size[input.size] +
    input.addOns.reduce((sum, a) => sum + PRICING.addOn[a], 0);
  const total = subtotal * (1 - PRICING.discount[input.frequency]);
  return { low: round5(total * PRICING.spread[0]), high: round5(total * PRICING.spread[1]) };
}

export const SERVICES: readonly { id: ServiceId | "office" | "construction"; photo: string; name: Bi; body: Bi; from: string | null }[] = [
  {
    id: "standard",
    photo: "/cleaning/living-bright.jpg",
    name: { en: "Standard home cleaning", es: "Limpieza regular de casa" },
    body: { en: "Kitchens, bathrooms, floors and dusting, weekly or every two weeks.", es: "Cocinas, baños, pisos y polvo, cada semana o cada dos semanas." },
    from: "$129",
  },
  {
    id: "deep",
    photo: "/cleaning/kitchen-bright.jpg",
    name: { en: "Deep cleaning", es: "Limpieza profunda" },
    body: { en: "Baseboards, cabinets, grout and every corner. Ideal for a first visit.", es: "Zócalos, gabinetes, juntas y cada rincón. Ideal para la primera visita." },
    from: "$199",
  },
  {
    id: "move",
    photo: "/cleaning/living-empty.jpg",
    name: { en: "Move-in / move-out", es: "Mudanzas" },
    body: { en: "Empty-home cleaning timed to your closing or lease end.", es: "Limpieza de casa vacía coordinada con su cierre o fin de contrato." },
    from: "$249",
  },
  {
    id: "airbnb",
    photo: "/cleaning/bedroom-white.jpg",
    name: { en: "Airbnb turnovers", es: "Cambios de Airbnb" },
    body: { en: "Same-day turnovers with linens, restocking and a photo report.", es: "Cambios el mismo día con ropa de cama, reposición y reporte con fotos." },
    from: "$109",
  },
  {
    id: "office",
    photo: "/cleaning/office-corridor.jpg",
    name: { en: "Office cleaning", es: "Limpieza de oficinas" },
    body: { en: "After-hours cleaning for offices and clinics, nightly or weekly.", es: "Limpieza fuera de horario para oficinas y clínicas, diaria o semanal." },
    from: null,
  },
  {
    id: "construction",
    photo: "/cleaning/white-home.jpg",
    name: { en: "Post-construction", es: "Post-construcción" },
    body: { en: "Dust, debris and final detail after a remodel or new build.", es: "Polvo, escombros y detalle final después de una remodelación u obra nueva." },
    from: null,
  },
];

export const PACKAGES: readonly { id: string; name: Bi; price: string; per: Bi; featured?: boolean; items: readonly Bi[] }[] = [
  {
    id: "essential",
    name: { en: "Essential", es: "Esencial" },
    price: "$129",
    per: { en: "per visit, from", es: "por visita, desde" },
    items: [
      { en: "Kitchen and bathrooms", es: "Cocina y baños" },
      { en: "Floors vacuumed and mopped", es: "Pisos aspirados y trapeados" },
      { en: "Dusting of reachable surfaces", es: "Polvo en superficies accesibles" },
    ],
  },
  {
    id: "signature",
    name: { en: "Signature", es: "Signature" },
    price: "$199",
    per: { en: "per visit, from", es: "por visita, desde" },
    featured: true,
    items: [
      { en: "Everything in Essential", es: "Todo lo de Esencial" },
      { en: "Baseboards and cabinet fronts", es: "Zócalos y frentes de gabinetes" },
      { en: "Inside microwave and sinks", es: "Interior de microondas y fregaderos" },
      { en: "Bed linens changed", es: "Cambio de sábanas" },
    ],
  },
  {
    id: "premium",
    name: { en: "Premium", es: "Premium" },
    price: "$289",
    per: { en: "per visit, from", es: "por visita, desde" },
    items: [
      { en: "Everything in Signature", es: "Todo lo de Signature" },
      { en: "Inside fridge and oven", es: "Interior de nevera y horno" },
      { en: "Interior windows", es: "Ventanas interiores" },
      { en: "Laundry folded", es: "Ropa doblada" },
    ],
  },
];

export const GALLERY: readonly { src: string; alt: Bi }[] = [
  { src: "/cleaning/kitchen-modern.jpg", alt: { en: "A modern kitchen after cleaning", es: "Una cocina moderna después de la limpieza" } },
  { src: "/cleaning/bathroom.jpg", alt: { en: "A bright, clean bathroom", es: "Un baño luminoso y limpio" } },
  { src: "/cleaning/dining-living.jpg", alt: { en: "A tidy dining and living area", es: "Un comedor y sala ordenados" } },
  { src: "/cleaning/hotel-room.jpg", alt: { en: "A guest room ready for check-in", es: "Una habitación lista para el huésped" } },
  { src: "/cleaning/office-open.jpg", alt: { en: "An office after nightly cleaning", es: "Una oficina después de la limpieza nocturna" } },
  { src: "/cleaning/pool-house.jpg", alt: { en: "A home exterior and patio", es: "El exterior y el patio de una casa" } },
];

/** Closed Sundays; morning, midday and afternoon arrival windows. */
export const WINDOWS: readonly { id: string; label: Bi }[] = [
  { id: "am", label: { en: "8–10 AM", es: "8–10 a. m." } },
  { id: "mid", label: { en: "11 AM–1 PM", es: "11 a. m.–1 p. m." } },
  { id: "pm", label: { en: "2–4 PM", es: "2–4 p. m." } },
];
