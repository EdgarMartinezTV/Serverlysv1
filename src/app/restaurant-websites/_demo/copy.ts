import type { Locale } from "../_i18n";

/**
 * Copy for the Lumbre demo. Lumbre is fictional: every screen that could be
 * mistaken for a real transaction says "demo" on it, and nothing here sends
 * data anywhere — orders, bookings and chat all stay in the browser tab.
 */
export type DemoCopy = {
  meta: { title: string; description: string };
  breadcrumb: { home: string; landing: string; page: string };
  menu: {
    label: string;
    title: string;
    intro: string;
    categoriesLabel: string;
    filtersLabel: string;
    all: string;
    veg: string;
    gf: string;
    spicy: string;
    popular: string;
    add: string;
    addAria: string;
    empty: string;
    clear: string;
  };
  options: { title: string; required: string; add: string; cancel: string; quantity: string };
  cart: {
    open: string;
    title: string;
    close: string;
    empty: string;
    emptyCta: string;
    remove: string;
    decrease: string;
    increase: string;
    pickup: string;
    delivery: string;
    method: string;
    when: string;
    asap: string;
    address: string;
    addressPlaceholder: string;
    tip: string;
    noTip: string;
    subtotal: string;
    tax: string;
    deliveryFee: string;
    tipLine: string;
    total: string;
    name: string;
    phone: string;
    payment: string;
    paymentNote: string;
    place: string;
    demoNote: string;
    required: string;
    addressRequired: string;
    added: string;
    confirmedTitle: string;
    confirmedBody: string;
    orderNumber: string;
    readyAt: string;
    newOrder: string;
    minutes: string;
  };
  reserve: {
    label: string;
    title: string;
    intro: string;
    steps: readonly [string, string, string];
    stepOf: string;
    party: string;
    guests: string;
    largeParty: string;
    date: string;
    time: string;
    closed: string;
    unavailable: string;
    noSlots: string;
    next: string;
    back: string;
    name: string;
    contact: string;
    occasion: string;
    occasions: readonly string[];
    notes: string;
    notesPlaceholder: string;
    confirm: string;
    required: string;
    confirmedTitle: string;
    confirmedBody: string;
    code: string;
    another: string;
  };
  assistant: {
    label: string;
    title: string;
    intro: string;
    name: string;
    status: string;
    badge: string;
    placeholder: string;
    send: string;
    suggestions: readonly string[];
    typing: string;
    logLabel: string;
    disclaimer: string;
    you: string;
  };
  pitch: { label: string; title: string; body: string; review: string; plans: string };
};

export const DEMO_COPY: Record<Locale, DemoCopy> = {
  en: {
    meta: {
      title: "Live Restaurant Website Demo | Serverlys",
      description:
        "Try a restaurant website built by Serverlys: an interactive digital menu, online ordering cart, reservation flow and sample AI assistant. Fictional restaurant, no real orders.",
    },
    breadcrumb: { home: "Home", landing: "Restaurant websites", page: "Live demo" },
    menu: {
      label: "Menu",
      title: "The menu",
      intro: "Filter by what you eat, then add dishes to a pickup or delivery order.",
      categoriesLabel: "Menu sections",
      filtersLabel: "Dietary filters",
      all: "All",
      veg: "Vegetarian",
      gf: "Gluten-free",
      spicy: "Spicy",
      popular: "Popular",
      add: "Add",
      addAria: "Add {item} to order",
      empty: "No dishes in this section match your filters.",
      clear: "Clear filters",
    },
    options: { title: "Choose an option", required: "Required", add: "Add to order", cancel: "Cancel", quantity: "Quantity" },
    cart: {
      open: "View order",
      title: "Your order",
      close: "Close order",
      empty: "Your order is empty.",
      emptyCta: "Browse the menu",
      remove: "Remove",
      decrease: "Decrease quantity of {item}",
      increase: "Increase quantity of {item}",
      pickup: "Pickup",
      delivery: "Delivery",
      method: "How would you like it?",
      when: "When",
      asap: "As soon as possible",
      address: "Delivery address",
      addressPlaceholder: "Street, apartment, city",
      tip: "Tip for the team",
      noTip: "No tip",
      subtotal: "Subtotal",
      tax: "Estimated tax (7%)",
      deliveryFee: "Delivery fee",
      tipLine: "Tip",
      total: "Total",
      name: "Name for the order",
      phone: "Mobile number",
      payment: "Payment",
      paymentNote:
        "On a real site, payment is handled by your ordering provider, such as Square or Toast. This demo takes no payment.",
      place: "Place demo order",
      demoNote: "Demo only. No order is sent and no card is charged.",
      required: "Please fill in your name and number.",
      addressRequired: "Please add a delivery address.",
      added: "{item} added to your order",
      confirmedTitle: "Demo order received",
      confirmedBody:
        "On a live site, this order would go to the kitchen through your ordering system and the guest would get a text when it is ready. Nothing was sent and nothing was charged.",
      orderNumber: "Order",
      readyAt: "Estimated ready time",
      newOrder: "Start a new order",
      minutes: "min",
    },
    reserve: {
      label: "Reservations",
      title: "Reserve a table",
      intro: "Choose your party size, date and time. A real site would connect this to your reservation system.",
      steps: ["Party & date", "Time", "Details"],
      stepOf: "Step {n} of 3",
      party: "Party size",
      guests: "guests",
      largeParty: "More than 10 guests? Ask us about private events.",
      date: "Date",
      time: "Available times",
      closed: "Closed",
      unavailable: "Fully booked",
      noSlots: "We’re closed that day. Please pick another date.",
      next: "Continue",
      back: "Back",
      name: "Full name",
      contact: "Mobile or email",
      occasion: "Occasion",
      occasions: ["None", "Birthday", "Anniversary", "Business dinner", "Date night"],
      notes: "Special requests",
      notesPlaceholder: "Allergies, high chair, terrace…",
      confirm: "Request demo reservation",
      required: "Please enter your name and a way to reach you.",
      confirmedTitle: "Demo reservation requested",
      confirmedBody:
        "On a live site, this request would land in your reservation system and the guest would get a confirmation. This is a demo, so no table was booked.",
      code: "Confirmation",
      another: "Make another reservation",
    },
    assistant: {
      label: "AI assistant",
      title: "Ask Lumbre anything",
      intro: "This is a sample of the ConvoAI assistant on Restaurant Pro. Try a question, in English or Spanish.",
      name: "Lumbre assistant",
      status: "Replies in English and Spanish",
      badge: "Sample, scripted answers",
      placeholder: "Ask about the menu, hours, parking…",
      send: "Send",
      suggestions: [
        "What’s popular?",
        "Do you have gluten-free options?",
        "Book a table for 4 on Friday",
        "Are you open tonight?",
        "¿Tienen estacionamiento?",
        "Do you do private events?",
      ],
      typing: "Lumbre assistant is typing",
      logLabel: "Conversation",
      disclaimer:
        "Demo: answers are scripted from this page’s menu. The real ConvoAI assistant is trained on your restaurant’s own information and hands anything it can’t answer to your team.",
      you: "You",
    },
    pitch: {
      label: "Built by Serverlys",
      title: "Want this for your restaurant?",
      body: "Everything you just tried, designed around your food, your brand and your menu, in English and Spanish.",
      review: "Get a Free Restaurant Website Review",
      plans: "See plans and pricing",
    },
  },
  es: {
    meta: {
      title: "Demo en vivo de sitio web para restaurantes | Serverlys",
      description:
        "Pruebe un sitio web para restaurantes hecho por Serverlys: menú digital interactivo, carrito de pedidos, reservaciones y un asistente con IA de ejemplo. Restaurante ficticio, sin pedidos reales.",
    },
    breadcrumb: { home: "Inicio", landing: "Sitios web para restaurantes", page: "Demo en vivo" },
    menu: {
      label: "Menú",
      title: "El menú",
      intro: "Filtre según lo que come y agregue platos a un pedido para recoger o a domicilio.",
      categoriesLabel: "Secciones del menú",
      filtersLabel: "Filtros por dieta",
      all: "Todo",
      veg: "Vegetariano",
      gf: "Sin gluten",
      spicy: "Picante",
      popular: "Popular",
      add: "Agregar",
      addAria: "Agregar {item} al pedido",
      empty: "Ningún plato de esta sección coincide con sus filtros.",
      clear: "Quitar filtros",
    },
    options: { title: "Elija una opción", required: "Obligatorio", add: "Agregar al pedido", cancel: "Cancelar", quantity: "Cantidad" },
    cart: {
      open: "Ver pedido",
      title: "Su pedido",
      close: "Cerrar pedido",
      empty: "Su pedido está vacío.",
      emptyCta: "Ver el menú",
      remove: "Quitar",
      decrease: "Reducir la cantidad de {item}",
      increase: "Aumentar la cantidad de {item}",
      pickup: "Para recoger",
      delivery: "A domicilio",
      method: "¿Cómo lo quiere?",
      when: "Cuándo",
      asap: "Lo antes posible",
      address: "Dirección de entrega",
      addressPlaceholder: "Calle, apartamento, ciudad",
      tip: "Propina para el equipo",
      noTip: "Sin propina",
      subtotal: "Subtotal",
      tax: "Impuesto estimado (7%)",
      deliveryFee: "Cargo de entrega",
      tipLine: "Propina",
      total: "Total",
      name: "Nombre para el pedido",
      phone: "Número de celular",
      payment: "Pago",
      paymentNote:
        "En un sitio real, el pago lo procesa su proveedor de pedidos, como Square o Toast. Esta demo no cobra nada.",
      place: "Hacer pedido de prueba",
      demoNote: "Solo es una demo. No se envía ningún pedido ni se cobra ninguna tarjeta.",
      required: "Escriba su nombre y su número.",
      addressRequired: "Agregue una dirección de entrega.",
      added: "{item} agregado a su pedido",
      confirmedTitle: "Pedido de prueba recibido",
      confirmedBody:
        "En un sitio real, este pedido llegaría a la cocina a través de su sistema de pedidos y el cliente recibiría un mensaje cuando esté listo. No se envió nada ni se cobró nada.",
      orderNumber: "Pedido",
      readyAt: "Hora estimada",
      newOrder: "Empezar otro pedido",
      minutes: "min",
    },
    reserve: {
      label: "Reservaciones",
      title: "Reserve una mesa",
      intro: "Elija cuántas personas, la fecha y la hora. Un sitio real lo conectaría a su sistema de reservaciones.",
      steps: ["Personas y fecha", "Hora", "Datos"],
      stepOf: "Paso {n} de 3",
      party: "Personas",
      guests: "personas",
      largeParty: "¿Más de 10 personas? Pregúntenos por eventos privados.",
      date: "Fecha",
      time: "Horas disponibles",
      closed: "Cerrado",
      unavailable: "Lleno",
      noSlots: "Ese día está cerrado. Elija otra fecha.",
      next: "Continuar",
      back: "Atrás",
      name: "Nombre completo",
      contact: "Celular o correo",
      occasion: "Ocasión",
      occasions: ["Ninguna", "Cumpleaños", "Aniversario", "Cena de negocios", "Cita"],
      notes: "Peticiones especiales",
      notesPlaceholder: "Alergias, silla para bebé, terraza…",
      confirm: "Solicitar reservación de prueba",
      required: "Escriba su nombre y cómo contactarle.",
      confirmedTitle: "Reservación de prueba solicitada",
      confirmedBody:
        "En un sitio real, esta solicitud llegaría a su sistema de reservaciones y el cliente recibiría una confirmación. Es una demo, así que no se reservó ninguna mesa.",
      code: "Confirmación",
      another: "Hacer otra reservación",
    },
    assistant: {
      label: "Asistente con IA",
      title: "Pregúntele a Lumbre",
      intro: "Esta es una muestra del asistente ConvoAI de Restaurant Pro. Haga una pregunta, en español o en inglés.",
      name: "Asistente de Lumbre",
      status: "Responde en español e inglés",
      badge: "Ejemplo, respuestas programadas",
      placeholder: "Pregunte por el menú, el horario, el estacionamiento…",
      send: "Enviar",
      suggestions: [
        "¿Qué es lo más pedido?",
        "¿Tienen opciones sin gluten?",
        "Reservar para 4 el viernes",
        "¿Abren esta noche?",
        "Is there parking?",
        "¿Hacen eventos privados?",
      ],
      typing: "El asistente de Lumbre está escribiendo",
      logLabel: "Conversación",
      disclaimer:
        "Demo: las respuestas están programadas a partir del menú de esta página. El asistente ConvoAI real se entrena con la información de su restaurante y le pasa a su equipo lo que no puede responder.",
      you: "Usted",
    },
    pitch: {
      label: "Hecho por Serverlys",
      title: "¿Quiere esto para su restaurante?",
      body: "Todo lo que acaba de probar, diseñado para su comida, su marca y su menú, en español e inglés.",
      review: "Revisión gratuita de su sitio web",
      plans: "Ver planes y precios",
    },
  },
};
