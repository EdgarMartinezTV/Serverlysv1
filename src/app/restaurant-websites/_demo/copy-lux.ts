import type { Locale } from "../_i18n";

/**
 * Copy for the editorial sections of the Lumbre demo (hero, story, signature,
 * the fire, chef, private dining, gallery, finale, footer, Serverlys frame).
 * The working features — menu, order, reservation, assistant — keep their
 * strings in copy.ts.
 *
 * ⚠ LUMBRE IS FICTIONAL. The chef, the address, the phone (555-01xx is the
 * range reserved for fiction) and the email (.example is a reserved domain)
 * are invented and the page says so wherever someone might act on them.
 * Never give the chef a real person's name and face together.
 */
export type LuxCopy = {
  frame: {
    strip: string;
    stripCta: string;
    pillLabel: string;
    pillTitle: string;
    pillBody: string;
    pillCta: string;
    pillBack: string;
    pillOpen: string;
    pillClose: string;
  };
  nav: {
    label: string;
    story: string;
    menu: string;
    fire: string;
    privateDining: string;
    gallery: string;
    reserve: string;
    order: string;
    open: string;
    close: string;
    home: string;
    switchLabel: string;
    switchAria: string;
  };
  hero: {
    eyebrow: string;
    lines: readonly [string, string];
    sub: string;
    reserve: string;
    explore: string;
    scroll: string;
    pause: string;
    play: string;
  };
  story: {
    label: string;
    title: string;
    lead: string;
    body: string;
    facts: readonly { k: string; v: string }[];
    photoAlt: string;
    insetAlt: string;
  };
  signature: {
    label: string;
    title: string;
    intro: string;
    view: string;
    all: string;
    notes: Record<string, string>;
  };
  fire: { label: string; lines: readonly [string, string]; body: string };
  chef: {
    label: string;
    sample: string;
    name: string;
    role: string;
    quote: string;
    bio: string;
    principles: readonly { k: string; v: string }[];
    photoAlt: string;
  };
  privateDining: {
    label: string;
    title: string;
    body: string;
    rooms: readonly { name: string; detail: string }[];
    photoAlt: string;
    form: {
      title: string;
      name: string;
      email: string;
      date: string;
      guests: string;
      guestOptions: readonly string[];
      occasion: string;
      occasions: readonly string[];
      message: string;
      messagePlaceholder: string;
      submit: string;
      note: string;
      errors: { name: string; email: string; date: string };
      summary: string;
      doneTitle: string;
      doneBody: string;
      again: string;
    };
  };
  concierge: { label: string; title: string };
  gallery: {
    label: string;
    title: string;
    open: string;
    close: string;
    prev: string;
    next: string;
    counter: string;
    items: readonly { src: string; alt: string }[];
  };
  finale: { label: string; lines: readonly [string, string]; body: string; reserve: string; call: string };
  footer: {
    tagline: string;
    explore: string;
    visitTitle: string;
    hours: string;
    days: readonly string[];
    closed: string;
    today: string;
    contact: string;
    address: string;
    addressNote: string;
    phone: string;
    email: string;
    follow: string;
    socialNote: string;
    newsletterTitle: string;
    newsletterBody: string;
    emailLabel: string;
    subscribe: string;
    subscribed: string;
    invalidEmail: string;
    mapLabel: string;
    legal: string;
    credits: string;
  };
};

export const LUX_COPY: Record<Locale, LuxCopy> = {
  en: {
    frame: {
      strip: "Restaurant Website Experience — Demo by Serverlys. Lumbre is a fictional restaurant.",
      stripCta: "Get a website like this",
      pillLabel: "Demo by Serverlys",
      pillTitle: "Want a website like this for your restaurant?",
      pillBody: "Everything here — the film, the menu, ordering, reservations and the assistant — can be built around your food and your brand.",
      pillCta: "Get a Free Consultation",
      pillBack: "Restaurant websites by Serverlys",
      pillOpen: "About this demo",
      pillClose: "Hide",
    },
    nav: {
      label: "Lumbre",
      story: "Story",
      menu: "Menu",
      fire: "The fire",
      privateDining: "Private dining",
      gallery: "Gallery",
      reserve: "Reserve",
      order: "Order",
      open: "Open menu",
      close: "Close menu",
      home: "Lumbre, back to top",
      switchLabel: "ES",
      switchAria: "Ver la demo en español",
    },
    hero: {
      eyebrow: "Wood-fire Latin cuisine · Downtown Doral",
      lines: ["An experience", "beyond dining."],
      sub: "Where exceptional cuisine meets unforgettable moments: one open fire, a tasting kitchen and a room made for long evenings.",
      reserve: "Reserve a table",
      explore: "Explore the menu",
      scroll: "Scroll to discover",
      pause: "Pause the film",
      play: "Play the film",
    },
    story: {
      label: "Our story",
      title: "One fire. Every plate.",
      lead: "Lumbre began with a single hearth of Florida oak and citrus wood, and a promise to cook nothing that hadn’t met the flame.",
      body: "Our kitchen is open to the room, so you see the fire, smell the smoke and hear the steaks land on the grate. The menu follows the coast and the market: Gulf seafood, heritage beef and vegetables from farms within a day’s drive, finished with the techniques of the Latin American grill.",
      facts: [
        { k: "The hearth", v: "Florida oak and citrus wood" },
        { k: "The room", v: "Sixty seats and a chef’s counter" },
        { k: "The cellar", v: "Wines of Argentina, Chile and Spain" },
      ],
      photoAlt: "Lumbre’s dining room at night, low lights over dark tables",
      insetAlt: "A plated dish on a set table",
    },
    signature: {
      label: "Signature",
      title: "Plates the fire is known for",
      intro: "Four dishes that tell you who we are. The full menu follows, ready to order for pickup or delivery.",
      view: "See it on the menu",
      all: "Explore the full menu",
      notes: {
        churrasco: "Grass-fed skirt steak, rested over embers",
        ribs: "Twelve hours in tamarind, finished on the grate",
        salmon: "Glazed in guava, smoked on citrus wood",
        pannacotta: "Passion fruit, toasted coconut, sea salt",
      },
    },
    fire: {
      label: "The fire",
      lines: ["Fire is our", "first ingredient."],
      body: "Every service starts the same way: the hearth is lit at three, the coals are ready by five, and nothing leaves the kitchen without touching the flame.",
    },
    chef: {
      label: "Chef & philosophy",
      sample: "Sample content: a fictional chef, written for this demo.",
      name: "Chef Inés Arroyo",
      role: "Executive chef",
      quote: "“The fire decides when a dish is ready. My job is to listen.”",
      bio: "Raised between Bogotá and Miami, Inés cooked in grill houses across South America before opening Lumbre. Her menu changes with the coast and the season; the fire never does.",
      principles: [
        { k: "Patience", v: "Wood takes two hours to become coals. We start early." },
        { k: "Provenance", v: "We know the boat, the farm and the ranch by name." },
        { k: "Restraint", v: "Smoke, salt and citrus. Rarely more than three things on a plate." },
      ],
      photoAlt: "A chef’s hand finishing a dish with fresh herbs at the pass",
    },
    privateDining: {
      label: "Private dining",
      title: "Evenings worth gathering for",
      body: "Birthdays, rehearsal dinners, client nights and the occasional proposal. Our private rooms come with their own menu, sommelier and a view of the fire.",
      rooms: [
        { name: "The Cellar Room", detail: "Up to 14 guests · among the wine" },
        { name: "The Hearth Table", detail: "Up to 10 guests · beside the fire" },
        { name: "Full buyout", detail: "Up to 80 guests · the whole restaurant" },
      ],
      photoAlt: "Wine poured at a candlelit table beside a fireplace",
      form: {
        title: "Plan a private event",
        name: "Your name",
        email: "Email",
        date: "Preferred date",
        guests: "Guests",
        guestOptions: ["8–14", "15–30", "31–80"],
        occasion: "Occasion",
        occasions: ["Celebration", "Business dinner", "Rehearsal dinner", "Something else"],
        message: "Tell us about the evening",
        messagePlaceholder: "Menu ideas, timing, dietary needs…",
        submit: "Send demo inquiry",
        note: "Demo only. Nothing is sent; on a live site this goes to your events team.",
        errors: {
          name: "Please tell us your name.",
          email: "Please enter a valid email address.",
          date: "Please choose a date from tomorrow onwards.",
        },
        summary: "Please check the highlighted fields.",
        doneTitle: "Demo inquiry received",
        doneBody: "On a live site, your events team would get this request by email and reply with menus and availability. This is a demo, so nothing was sent.",
        again: "Start another inquiry",
      },
    },
    concierge: { label: "Concierge", title: "Questions before you come?" },
    gallery: {
      label: "Gallery",
      title: "An evening at Lumbre",
      open: "Open photo: {alt}",
      close: "Close gallery",
      prev: "Previous photo",
      next: "Next photo",
      counter: "{n} of {total}",
      items: [
        { src: "/restaurant/room-moody.jpg", alt: "The dining room at night" },
        { src: "/restaurant/churrasco.jpg", alt: "Churrasco sliced over chimichurri" },
        { src: "/restaurant/still-fireside-pour.jpg", alt: "Wine poured beside the fireplace" },
        { src: "/restaurant/old-fashioned.jpg", alt: "A coffee old fashioned at the bar" },
        { src: "/restaurant/fine-table.jpg", alt: "A plated course on a set table" },
        { src: "/restaurant/still-wine-glasses.jpg", alt: "Red wine poured into a line of glasses" },
        { src: "/restaurant/salmon.jpg", alt: "Ember salmon with citrus" },
        { src: "/restaurant/still-steak-wine.jpg", alt: "Sliced steak with a glass of red wine" },
      ],
    },
    finale: {
      label: "Reservations",
      lines: ["Your table", "is waiting."],
      body: "Dinner Tuesday to Sunday, from five. Sunday lunch from noon.",
      reserve: "Reserve your evening",
      call: "Or call (305) 555-0142",
    },
    footer: {
      tagline: "Wood-fire Latin cuisine",
      explore: "Explore",
      visitTitle: "Visit Lumbre",
      hours: "Hours",
      days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      closed: "Closed",
      today: "Today",
      contact: "Contact",
      address: "Downtown Doral, Florida",
      addressNote: "Illustrative location. Lumbre is fictional, so there is no address to visit; on a real site this is a live map with directions.",
      phone: "(305) 555-0142",
      email: "hello@lumbre.example",
      follow: "Follow",
      socialNote: "Social profiles are illustrative in this demo.",
      newsletterTitle: "The Lumbre letter",
      newsletterBody: "New menus, winemaker dinners and the occasional recipe. Once a month.",
      emailLabel: "Email address",
      subscribe: "Subscribe",
      subscribed: "Demo: you would now be subscribed. No email was saved.",
      invalidEmail: "Please enter a valid email address.",
      mapLabel: "Illustrative map of Downtown Doral",
      legal: "Lumbre is a fictional restaurant created by Serverlys to demonstrate a restaurant website. No orders, payments, bookings or messages leave this page.",
      credits: "Photography: Unsplash and Coverr. Film: Coverr.",
    },
  },
  es: {
    frame: {
      strip: "Experiencia de sitio web para restaurantes — Demo de Serverlys. Lumbre es un restaurante ficticio.",
      stripCta: "Quiero un sitio así",
      pillLabel: "Demo de Serverlys",
      pillTitle: "¿Quiere un sitio web así para su restaurante?",
      pillBody: "Todo lo que ve aquí — el video, el menú, los pedidos, las reservaciones y el asistente — se puede construir alrededor de su cocina y su marca.",
      pillCta: "Consulta gratis",
      pillBack: "Sitios web para restaurantes de Serverlys",
      pillOpen: "Sobre esta demo",
      pillClose: "Ocultar",
    },
    nav: {
      label: "Lumbre",
      story: "Historia",
      menu: "Menú",
      fire: "El fuego",
      privateDining: "Eventos privados",
      gallery: "Galería",
      reserve: "Reservar",
      order: "Pedir",
      open: "Abrir menú",
      close: "Cerrar menú",
      home: "Lumbre, volver arriba",
      switchLabel: "EN",
      switchAria: "View the demo in English",
    },
    hero: {
      eyebrow: "Cocina latina a la leña · Downtown Doral",
      lines: ["Una experiencia", "más allá de la mesa."],
      sub: "Donde la cocina excepcional se encuentra con momentos inolvidables: un solo fuego abierto, una cocina de autor y un salón hecho para noches largas.",
      reserve: "Reservar una mesa",
      explore: "Ver el menú",
      scroll: "Desplácese para descubrir",
      pause: "Pausar el video",
      play: "Reproducir el video",
    },
    story: {
      label: "Nuestra historia",
      title: "Un fuego. Cada plato.",
      lead: "Lumbre nació de un solo fogón de roble y madera de cítricos de Florida, y de una promesa: no cocinar nada que no haya pasado por la llama.",
      body: "Nuestra cocina está abierta al salón: usted ve el fuego, huele el humo y escucha la carne caer sobre la parrilla. El menú sigue la costa y el mercado: mariscos del Golfo, carnes de herencia y verduras de granjas cercanas, terminados con las técnicas de la parrilla latinoamericana.",
      facts: [
        { k: "El fogón", v: "Roble y madera de cítricos de Florida" },
        { k: "El salón", v: "Sesenta puestos y una barra del chef" },
        { k: "La cava", v: "Vinos de Argentina, Chile y España" },
      ],
      photoAlt: "El salón de Lumbre de noche, luces bajas sobre mesas oscuras",
      insetAlt: "Un plato servido en una mesa puesta",
    },
    signature: {
      label: "De la casa",
      title: "Los platos por los que nos conocen",
      intro: "Cuatro platos que dicen quiénes somos. Después, el menú completo, listo para pedir para recoger o a domicilio.",
      view: "Ver en el menú",
      all: "Ver el menú completo",
      notes: {
        churrasco: "Entraña de res de pastoreo, reposada sobre las brasas",
        ribs: "Doce horas en tamarindo, terminadas en la parrilla",
        salmon: "Glaseado en guayaba, ahumado con madera de cítricos",
        pannacotta: "Maracuyá, coco tostado, sal de mar",
      },
    },
    fire: {
      label: "El fuego",
      lines: ["El fuego es nuestro", "primer ingrediente."],
      body: "Cada servicio empieza igual: el fogón se enciende a las tres, las brasas están listas a las cinco y nada sale de la cocina sin tocar la llama.",
    },
    chef: {
      label: "Chef y filosofía",
      sample: "Contenido de ejemplo: una chef ficticia, escrita para esta demo.",
      name: "Chef Inés Arroyo",
      role: "Chef ejecutiva",
      quote: "«El fuego decide cuándo un plato está listo. Mi trabajo es escucharlo».",
      bio: "Criada entre Bogotá y Miami, Inés cocinó en parrillas de toda Sudamérica antes de abrir Lumbre. Su menú cambia con la costa y la temporada; el fuego nunca.",
      principles: [
        { k: "Paciencia", v: "La leña tarda dos horas en hacerse brasa. Empezamos temprano." },
        { k: "Origen", v: "Conocemos el barco, la granja y el rancho por su nombre." },
        { k: "Mesura", v: "Humo, sal y cítricos. Rara vez más de tres cosas en un plato." },
      ],
      photoAlt: "La mano de una chef terminando un plato con hierbas frescas",
    },
    privateDining: {
      label: "Eventos privados",
      title: "Noches que vale la pena reunir",
      body: "Cumpleaños, cenas de ensayo, noches con clientes y alguna que otra propuesta. Nuestros salones privados tienen su propio menú, sommelier y vista al fuego.",
      rooms: [
        { name: "La Cava", detail: "Hasta 14 invitados · entre los vinos" },
        { name: "La Mesa del Fogón", detail: "Hasta 10 invitados · junto al fuego" },
        { name: "Restaurante completo", detail: "Hasta 80 invitados · todo el salón" },
      ],
      photoAlt: "Vino servido en una mesa a la luz de las velas junto a una chimenea",
      form: {
        title: "Planee un evento privado",
        name: "Su nombre",
        email: "Correo electrónico",
        date: "Fecha preferida",
        guests: "Invitados",
        guestOptions: ["8–14", "15–30", "31–80"],
        occasion: "Ocasión",
        occasions: ["Celebración", "Cena de negocios", "Cena de ensayo", "Otra"],
        message: "Cuéntenos sobre la noche",
        messagePlaceholder: "Ideas de menú, horario, necesidades alimentarias…",
        submit: "Enviar solicitud de demo",
        note: "Solo demo. No se envía nada; en un sitio real esto llega a su equipo de eventos.",
        errors: {
          name: "Por favor, díganos su nombre.",
          email: "Por favor, escriba un correo electrónico válido.",
          date: "Por favor, elija una fecha a partir de mañana.",
        },
        summary: "Por favor, revise los campos marcados.",
        doneTitle: "Solicitud de demo recibida",
        doneBody: "En un sitio real, su equipo de eventos recibiría esta solicitud por correo y respondería con menús y disponibilidad. Es una demo, así que no se envió nada.",
        again: "Empezar otra solicitud",
      },
    },
    concierge: { label: "Conserje", title: "¿Preguntas antes de venir?" },
    gallery: {
      label: "Galería",
      title: "Una noche en Lumbre",
      open: "Abrir foto: {alt}",
      close: "Cerrar galería",
      prev: "Foto anterior",
      next: "Foto siguiente",
      counter: "{n} de {total}",
      items: [
        { src: "/restaurant/room-moody.jpg", alt: "El salón de noche" },
        { src: "/restaurant/churrasco.jpg", alt: "Churrasco en lonjas sobre chimichurri" },
        { src: "/restaurant/still-fireside-pour.jpg", alt: "Vino servido junto a la chimenea" },
        { src: "/restaurant/old-fashioned.jpg", alt: "Un old fashioned de café en la barra" },
        { src: "/restaurant/fine-table.jpg", alt: "Un plato servido en una mesa puesta" },
        { src: "/restaurant/still-wine-glasses.jpg", alt: "Vino tinto servido en una fila de copas" },
        { src: "/restaurant/salmon.jpg", alt: "Salmón a la brasa con cítricos" },
        { src: "/restaurant/still-steak-wine.jpg", alt: "Carne en lonjas con una copa de vino tinto" },
      ],
    },
    finale: {
      label: "Reservaciones",
      lines: ["Su mesa", "le espera."],
      body: "Cena de martes a domingo, desde las cinco. Almuerzo los domingos desde el mediodía.",
      reserve: "Reservar su noche",
      call: "O llame al (305) 555-0142",
    },
    footer: {
      tagline: "Cocina latina a la leña",
      explore: "Explorar",
      visitTitle: "Visite Lumbre",
      hours: "Horario",
      days: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
      closed: "Cerrado",
      today: "Hoy",
      contact: "Contacto",
      address: "Downtown Doral, Florida",
      addressNote: "Ubicación ilustrativa. Lumbre es ficticio, así que no hay dirección que visitar; en un sitio real aquí va un mapa con indicaciones.",
      phone: "(305) 555-0142",
      email: "hola@lumbre.example",
      follow: "Síganos",
      socialNote: "Los perfiles sociales son ilustrativos en esta demo.",
      newsletterTitle: "La carta de Lumbre",
      newsletterBody: "Menús nuevos, cenas con enólogos y alguna receta. Una vez al mes.",
      emailLabel: "Correo electrónico",
      subscribe: "Suscribirme",
      subscribed: "Demo: ya estaría suscrito. No se guardó ningún correo.",
      invalidEmail: "Por favor, escriba un correo electrónico válido.",
      mapLabel: "Mapa ilustrativo de Downtown Doral",
      legal: "Lumbre es un restaurante ficticio creado por Serverlys para demostrar un sitio web de restaurante. Ningún pedido, pago, reservación ni mensaje sale de esta página.",
      credits: "Fotografía: Unsplash y Coverr. Video: Coverr.",
    },
  },
};

export const fillLux = (template: string, values: Record<string, string | number>) =>
  template.replace(/\{(\w+)\}/g, (_, k) => String(values[k] ?? ""));
