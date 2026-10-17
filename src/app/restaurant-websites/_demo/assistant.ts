import type { Locale } from "../_i18n";
import { HOURS, MENU, money, type MenuItem, type Tag } from "./menu";
import { addDays, formatTime, nextWeekday, sameDate, slotsFor } from "./availability";

/**
 * The demo assistant's "brain": keyword intents over the demo menu.
 *
 * ⚠ THIS IS NOT AN AI and the chat says so on screen. It exists so a
 * restaurant owner can feel the interaction on the demo without the page
 * calling a model, and every answer is derived from the same data the menu
 * and reservation form render — so it can never recommend a dish that is not
 * on the menu or a time the form shows as booked.
 */

export type AssistantAction =
  | { kind: "filter"; tag: Tag; label: string }
  | { kind: "add"; itemId: string; label: string }
  | { kind: "reserve"; party: number; date: Date; minutes?: number; label: string }
  | { kind: "go"; target: "menu" | "reserve" | "visit"; label: string };

export type AssistantReply = { lang: Locale; text: string; actions: AssistantAction[] };

const SPANISH_HINT =
  /[¿¡ñáéíóú]|\b(hola|que|qué|tienen|hay|para|mesa|reservar|reservaci[oó]n|horario|abren|abierto|puedo|donde|dónde|estacionamiento|comida|sin|gracias|eventos?|cu[aá]nto|recomienda|platos?|domicilio|pedido|personas|hoy|mañana|viernes|s[aá]bado|domingo|precio|picante|vegetarian[oa]|vegan[oa]|buenas|quiero|ustedes)\b/i;

export function detectLanguage(text: string, fallback: Locale): Locale {
  if (SPANISH_HINT.test(text)) return "es";
  if (/\b(the|you|do|have|is|are|what|can|book|table|open|parking|hours|menu|for|any|how)\b/i.test(text)) return "en";
  return fallback;
}

const NUMBER_WORDS: Record<string, number> = {
  one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12,
  uno: 1, una: 1, dos: 2, tres: 3, cuatro: 4, cinco: 5, seis: 6, siete: 7, ocho: 8, nueve: 9, diez: 10, once: 11, doce: 12,
};

const DAY_WORDS: [RegExp, number][] = [
  [/\b(sunday|domingo)\b/i, 0],
  [/\b(monday|lunes)\b/i, 1],
  [/\b(tuesday|martes)\b/i, 2],
  [/\b(wednesday|mi[eé]rcoles)\b/i, 3],
  [/\b(thursday|jueves)\b/i, 4],
  [/\b(friday|viernes)\b/i, 5],
  [/\b(saturday|s[aá]bado)\b/i, 6],
];

const DAY_NAMES: Record<Locale, readonly string[]> = {
  en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  es: ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"],
};

function partySize(text: string): number | null {
  const digits = text.match(/\b(\d{1,2})\b/);
  if (digits) return Number(digits[1]);
  for (const [word, n] of Object.entries(NUMBER_WORDS)) {
    if (new RegExp(`\\b${word}\\b`, "i").test(text)) return n;
  }
  return null;
}

function requestedDate(text: string, now: Date): Date | null {
  if (/\b(today|tonight|hoy|esta noche)\b/i.test(text)) return nextWeekday(now, now.getDay());
  if (/\b(tomorrow|mañana)\b/i.test(text)) return nextWeekday(now, (now.getDay() + 1) % 7);
  for (const [re, day] of DAY_WORDS) if (re.test(text)) return nextWeekday(now, day);
  return null;
}

const listNames = (items: readonly MenuItem[], lang: Locale) => {
  const names = items.map((i) => i.name[lang]);
  if (names.length <= 1) return names.join("");
  const and = lang === "es" ? " y " : " and ";
  return `${names.slice(0, -1).join(", ")}${and}${names[names.length - 1]}`;
};

const norm = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

function hoursLine(day: number, lang: Locale): string {
  const h = HOURS[day];
  if (!h) return lang === "es" ? "cerrado" : "closed";
  return `${formatTime(h.open)} – ${formatTime(h.close)}`;
}

export function reply(message: string, pageLocale: Locale, now: Date): AssistantReply {
  const lang = detectLanguage(message, pageLocale);
  const es = lang === "es";
  const t = norm(message);
  const r = (text: string, actions: AssistantAction[] = []): AssistantReply => ({ lang, text, actions });

  const dishes = MENU.filter((m) => m.category !== "drinks");

  // Allergies first: "gluten" alone is the dietary filter, but "allergy" should
  // never be answered with a list that implies a guarantee.
  if (/\b(allerg\w*|alerg\w*|celiac\w*|nuts?|nueces|nuez|mani|peanuts?|shellfish)\b/.test(t)) {
    return r(
      es
        ? "Nuestra cocina maneja gluten, nueces, mariscos y lácteos, así que no podemos garantizar que un plato esté libre de trazas. Indique su alergia al hacer el pedido o en las notas de la reservación y el equipo de cocina le orientará."
        : "Our kitchen handles gluten, nuts, shellfish and dairy, so we can’t guarantee any dish is free of traces. Tell us about the allergy when you order or in your reservation notes and the kitchen team will guide you.",
      [{ kind: "go", target: "menu", label: es ? "Ver el menú" : "See the menu" }],
    );
  }

  if (/gluten/.test(t)) {
    const gf = dishes.filter((m) => m.tags.includes("gf"));
    return r(
      es
        ? `Sí. ${gf.length} platos son sin gluten: ${listNames(gf, lang)}. ¿Quiere que filtre el menú?`
        : `Yes. ${gf.length} dishes are gluten-free: ${listNames(gf, lang)}. Want me to filter the menu?`,
      [{ kind: "filter", tag: "gf", label: es ? "Mostrar solo sin gluten" : "Show gluten-free only" }],
    );
  }

  if (/vegan|vegetarian|veggie|meatless|sin carne/.test(t)) {
    const veg = dishes.filter((m) => m.tags.includes("veg"));
    return r(
      es
        ? `Tenemos ${veg.length} opciones vegetarianas: ${listNames(veg, lang)}. El bowl de la huerta es completamente vegano.`
        : `We have ${veg.length} vegetarian options: ${listNames(veg, lang)}. The garden bowl is fully vegan.`,
      [{ kind: "filter", tag: "veg", label: es ? "Mostrar vegetariano" : "Show vegetarian" }],
    );
  }

  if (/spic|picante|hot sauce|chile/.test(t)) {
    const hot = MENU.filter((m) => m.tags.includes("spicy"));
    return r(
      es ? `Para los que les gusta el picante: ${listNames(hot, lang)}.` : `For heat lovers: ${listNames(hot, lang)}.`,
      [{ kind: "filter", tag: "spicy", label: es ? "Mostrar picante" : "Show spicy" }],
    );
  }

  if (/event|private|privad|catering|banquet|cumplean|birthday party|fiesta|group/.test(t) || (partySize(t) ?? 0) > 10) {
    return r(
      es
        ? "Sí. Nuestro salón privado recibe grupos de hasta 40 personas, y hacemos catering. En un sitio real, le paso su solicitud al encargado de eventos con la fecha y el número de personas."
        : "Yes. Our private room seats groups of up to 40, and we cater off-site. On a real site I’d pass your request to the events manager with your date and headcount.",
    );
  }

  if (/reserv|book|table|mesa|reservar/.test(t)) {
    const party = Math.max(1, Math.min(10, partySize(t) ?? 2));
    let date = requestedDate(t, now) ?? nextWeekday(now, 5);
    let open = slotsFor(date, party, now).filter((s) => s.available);
    // "Friday" asked on a Friday night after the last seating means next Friday,
    // unless the guest explicitly said tonight.
    if (open.length === 0 && sameDate(date, now) && !/\b(today|tonight|hoy|esta noche)\b/i.test(t)) {
      date = addDays(date, 7);
      open = slotsFor(date, party, now).filter((s) => s.available);
    }
    const day = DAY_NAMES[lang][date.getDay()];
    if (open.length === 0) {
      return r(
        es
          ? `El ${day} no tenemos mesas disponibles para ${party}. ¿Le busco otro día?`
          : `${day} has no open tables for ${party}. Shall I look at another day?`,
        [{ kind: "go", target: "reserve", label: es ? "Ver otras fechas" : "See other dates" }],
      );
    }
    const picks = [open[Math.floor(open.length / 2)], open[open.length - 1]].filter(
      (s, i, a) => a.indexOf(s) === i,
    );
    const times = picks.map((s) => formatTime(s.minutes)).join(es ? " y " : " and ");
    return r(
      es
        ? `El ${day} hay mesa para ${party} a las ${times}. ¿Abro la reservación con esos datos?`
        : `${day} has a table for ${party} at ${times}. Shall I open the reservation with that filled in?`,
      picks.map((s) => ({
        kind: "reserve" as const,
        party,
        date,
        minutes: s.minutes,
        label: es ? `Reservar ${formatTime(s.minutes)}` : `Book ${formatTime(s.minutes)}`,
      })),
    );
  }

  if (/popular|recommend|recomien|best|favorite|favorit|mas pedido|signature|especialidad|que me recomiendas/.test(t)) {
    const pop = MENU.filter((m) => m.popular);
    return r(
      es
        ? `Los favoritos de la casa: ${listNames(pop, lang)}. El churrasco sale directo de la parrilla de leña.`
        : `House favorites: ${listNames(pop, lang)}. The churrasco comes straight off the wood fire.`,
      [{ kind: "add", itemId: "churrasco", label: es ? "Agregar churrasco" : "Add the churrasco" }],
    );
  }

  if (/happy hour|hora feliz/.test(t)) {
    return r(
      es
        ? "La hora feliz es de martes a viernes, de 5:00 a 7:00 PM, en la barra."
        : "Happy hour runs Tuesday to Friday, 5:00 to 7:00 PM, at the bar.",
    );
  }

  if (/park|estacion|where|address|located|location|direcci|donde|ubica|llegar/.test(t)) {
    return r(
      es
        ? "Hay estacionamiento gratuito en el garaje de al lado. Lumbre es un restaurante ficticio, así que no tiene dirección real; en su sitio aquí aparecería su mapa."
        : "There’s free parking in the garage next door. Lumbre is a fictional restaurant, so there’s no real address; on your site this would be your map.",
      [{ kind: "go", target: "visit", label: es ? "Ver horario y ubicación" : "See hours and location" }],
    );
  }

  if (/open|close|hour|tonight|today|horario|abren|abierto|cierran|cierra|hoy/.test(t)) {
    const today = now.getDay();
    const h = HOURS[today];
    const minutes = now.getHours() * 60 + now.getMinutes();
    let status: string;
    if (!h) status = es ? "Hoy estamos cerrados." : "We’re closed today.";
    else if (minutes < h.open) status = es ? `Hoy abrimos a las ${formatTime(h.open)}.` : `We open today at ${formatTime(h.open)}.`;
    else if (minutes < h.close) status = es ? `Sí, estamos abiertos hasta las ${formatTime(h.close)}.` : `Yes, we’re open until ${formatTime(h.close)}.`;
    else status = es ? "Ya cerramos por hoy." : "We’ve closed for today.";
    return r(
      es
        ? `${status} Mañana: ${hoursLine((today + 1) % 7, lang)}. Los lunes cerramos.`
        : `${status} Tomorrow: ${hoursLine((today + 1) % 7, lang)}. We’re closed on Mondays.`,
      [{ kind: "go", target: "visit", label: es ? "Ver todo el horario" : "See all hours" }],
    );
  }

  if (/deliver|pickup|pick up|takeout|take out|to go|order|domicilio|recoger|para llevar|pedido|pedir/.test(t)) {
    return r(
      es
        ? "Puede pedir para recoger o a domicilio aquí mismo: agregue platos del menú y elija cómo lo quiere al finalizar."
        : "You can order pickup or delivery right here: add dishes from the menu and choose how you want it at checkout.",
      [{ kind: "go", target: "menu", label: es ? "Ir al menú" : "Go to the menu" }],
    );
  }

  if (/price|cost|how much|expensive|precio|cuanto|caro/.test(t)) {
    const prices = dishes.map((m) => m.price);
    return r(
      es
        ? `Los platos van de ${money(Math.min(...prices))} a ${money(Math.max(...prices))}. Los platos fuertes a la leña cuestan entre $27 y $38.`
        : `Dishes range from ${money(Math.min(...prices))} to ${money(Math.max(...prices))}. Mains from the wood fire are $27 to $38.`,
      [{ kind: "go", target: "menu", label: es ? "Ver el menú" : "See the menu" }],
    );
  }

  const item = MENU.find((m) => t.includes(norm(m.name.en)) || t.includes(norm(m.name.es)));
  if (item) {
    return r(
      `${item.name[lang]} — ${item.description[lang]}. ${money(item.price)}.`,
      [{ kind: "add", itemId: item.id, label: es ? `Agregar ${item.name[lang]}` : `Add ${item.name[lang]}` }],
    );
  }

  if (/^(hi|hello|hey|hola|buenas|buenos dias|buenas noches|good (morning|evening))\b/.test(t)) {
    return r(
      es
        ? "¡Hola! Puedo ayudarle con el menú, opciones sin gluten o vegetarianas, el horario, el estacionamiento o una reservación."
        : "Hi! I can help with the menu, gluten-free or vegetarian options, hours, parking or a reservation.",
    );
  }

  if (/thank|gracias/.test(t)) {
    return r(es ? "¡Con gusto! Buen provecho." : "My pleasure. Enjoy your meal!");
  }

  return r(
    es
      ? "Esa no la tengo en esta demo: mis respuestas están programadas. Pruebe con el menú, el horario, el estacionamiento o una reservación. El asistente real se entrena con la información de su restaurante y le pasa a su equipo lo que no sabe."
      : "That one isn’t in this demo: my answers are scripted. Try the menu, hours, parking or a reservation. The real assistant is trained on your restaurant’s information and hands anything it doesn’t know to your team.",
  );
}
