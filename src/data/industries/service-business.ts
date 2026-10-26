import type { Industry } from "./types";

export const serviceBusiness: Industry = {
  slug: "service-business",
  related: ["contractor", "handyman", "landscaping"],
  en: {
    name: "Local service businesses",
    metaTitle: "Service Business Website Design | Serverlys",
    metaDescription:
      "Local service business websites built for you: service-area pages, quote requests, online booking, Square or Stripe payments. Custom design from $1,399.",
    h1: "Service business website design that books the job",
    lede:
      "We design and build websites for local service businesses such as cleaning, pest control, mobile detailing, pool care and moving: a page per service, the towns you cover, a quote form or online booking, deposits and payments through Square or Stripe, and your Google reviews. Custom design starts at $1,399, scoped in writing first.",
    needs: [
      { title: "Quote or book, depending on the job", text: "Online booking for fixed-price visits like a standard clean or a detail package, and a quote form for jobs that need sizing first, each asking the questions your crew needs, such as square footage, address and photos." },
      { title: "The towns and ZIP codes you cover", text: "A clear service-area page, and separate pages for the main towns where you really work, so a customer knows before they ask whether you come to them." },
      { title: "One page per service", text: "Each service with what is included, what is not, how pricing works and how to prepare, so the customer who books a move-out clean or a monthly pest plan gets what they expected." },
      { title: "Deposits and payment online", text: "Deposits at booking and invoices paid by card through Square or Stripe, linked from the site, so you are not chasing payment at the door." },
      { title: "Proof you show up", text: "Before-and-after photos from your own jobs, your Google reviews, and the licenses and insurance you actually carry, shown where a first-time customer decides." },
      { title: "Calls and texts first on mobile", text: "Tap-to-call and tap-to-text in the header, with your hours and how fast you usually reply, because most customers look you up on a phone." },
    ],
    pages: ["Home with quote or booking", "Services (one page each)", "Service area", "Pricing or how quotes work", "Before and after", "Reviews", "About the team", "FAQ", "Contact"],
    integrations: ["Square", "Stripe", "Online booking such as Square Appointments or Calendly", "Field-service software such as Jobber or Housecall Pro", "Quote request form", "Google Business Profile", "Google reviews"],
    rules: {
      title: "Reviews and credentials",
      text: "The FTC's rule on consumer reviews and testimonials bans fake reviews, buying reviews and hiding negative ones, so we show only real reviews from real customers. If your trade or city requires a license, the number shown should be your own and current. You approve every claim before launch; the final call on compliance is yours.",
    },
    faq: [
      { question: "Can customers book and pay online?", answer: "Yes. We connect the booking tool you use, or set one up, and link deposits and invoice payments through Square or Stripe. If you already run Jobber or Housecall Pro, we link its booking and quote forms so jobs land in your schedule." },
      { question: "Should I show prices on my site?", answer: "Where a job has a set price, showing it or a 'from' price answers the first question customers ask. Where it depends on size or condition, we explain how quotes work instead. You choose what is published." },
      { question: "Do I need a page for every town I serve?", answer: "Only for towns you really work in and have something specific to say about. Thin copies of the same page with the town name swapped help no one, so we build a service-area page and add town pages where they earn their place." },
      { question: "How much does a service business website cost?", answer: "Custom design starts at $1,399 for Starter, $1,899 for Plus and $2,699 for Pro, as one-time project prices scoped in writing first. A business with many services or towns usually fits Plus or Pro. Hosting is billed separately each month." },
      { question: "Will my Google Business Profile and website match?", answer: "We keep your business name, phone, hours and services consistent between the two and link your profile from the site. We do not promise rankings, but mismatched details are an avoidable problem." },
    ],
  },
  es: {
    name: "Negocios de servicios locales",
    metaTitle: "Diseño web para negocios de servicios | Serverlys",
    metaDescription:
      "Sitios web para negocios de servicios hechos por nosotros: zonas de servicio, cotizaciones, citas en línea y pagos con Square o Stripe. Desde $1,399.",
    h1: "Diseño web para negocios de servicios que cierra el trabajo",
    lede:
      "Diseñamos y construimos sitios web para negocios de servicios locales como limpieza, control de plagas, detallado de autos, mantenimiento de piscinas y mudanzas: una página por servicio, los pueblos que cubre, cotización o citas en línea, depósitos y pagos con Square o Stripe y sus reseñas de Google. El diseño a medida empieza en $1,399, acordado por escrito primero.",
    needs: [
      { title: "Cotizar o reservar, según el trabajo", text: "Citas en línea para visitas de precio fijo, como una limpieza estándar o un paquete de detallado, y un formulario de cotización para trabajos que hay que medir primero, con las preguntas que necesita su equipo, como pies cuadrados, dirección y fotos." },
      { title: "Los pueblos y códigos postales que cubre", text: "Una página clara de zona de servicio, y páginas aparte para los pueblos principales donde realmente trabaja, para que el cliente sepa antes de preguntar si usted llega hasta él." },
      { title: "Una página por servicio", text: "Cada servicio con lo que incluye, lo que no, cómo se calcula el precio y cómo prepararse, para que quien reserva una limpieza de mudanza o un plan mensual contra plagas reciba lo que esperaba." },
      { title: "Depósitos y pagos en línea", text: "Depósitos al reservar y facturas pagadas con tarjeta por Square o Stripe, enlazados desde el sitio, para no tener que cobrar en la puerta." },
      { title: "Pruebas de que cumple", text: "Fotos de antes y después de sus propios trabajos, sus reseñas de Google y las licencias y seguros que realmente tiene, mostrados donde el cliente nuevo decide." },
      { title: "Primero llamadas y mensajes en el celular", text: "Llamar y enviar mensaje con un toque desde el encabezado, con su horario y lo rápido que suele responder, porque la mayoría de los clientes lo buscan desde el teléfono." },
    ],
    pages: ["Inicio con cotización o citas", "Servicios (una página cada uno)", "Zona de servicio", "Precios o cómo cotizamos", "Antes y después", "Reseñas", "Sobre el equipo", "Preguntas frecuentes", "Contacto"],
    integrations: ["Square", "Stripe", "Citas en línea como Square Appointments o Calendly", "Software de servicio en campo como Jobber o Housecall Pro", "Formulario de cotización", "Perfil de Empresa en Google", "Reseñas de Google"],
    rules: {
      title: "Reseñas y credenciales",
      text: "La regla de la FTC sobre reseñas y testimonios de consumidores prohíbe las reseñas falsas, comprar reseñas y ocultar las negativas, así que solo mostramos reseñas reales de clientes reales. Si su oficio o ciudad exige una licencia, el número que se muestre debe ser el suyo y estar vigente. Usted aprueba cada afirmación antes del lanzamiento; la decisión final sobre el cumplimiento es suya.",
    },
    faq: [
      { question: "¿Los clientes pueden reservar y pagar en línea?", answer: "Sí. Conectamos la herramienta de citas que usa, o le configuramos una, y enlazamos los depósitos y el pago de facturas con Square o Stripe. Si ya usa Jobber o Housecall Pro, enlazamos sus formularios de citas y cotización para que los trabajos entren a su agenda." },
      { question: "¿Debo mostrar precios en mi sitio?", answer: "Cuando un trabajo tiene precio fijo, mostrarlo o mostrar un precio 'desde' responde la primera pregunta del cliente. Cuando depende del tamaño o del estado, explicamos cómo funciona la cotización. Usted decide qué se publica." },
      { question: "¿Necesito una página por cada pueblo que atiendo?", answer: "Solo para los pueblos donde realmente trabaja y de los que hay algo específico que decir. Copias de la misma página con el nombre del pueblo cambiado no ayudan a nadie, así que hacemos una página de zona de servicio y añadimos páginas de pueblos donde se justifican." },
      { question: "¿Cuánto cuesta un sitio web para un negocio de servicios?", answer: "El diseño a medida empieza en $1,399 con Starter, $1,899 con Plus y $2,699 con Pro, como precios únicos de proyecto acordados por escrito primero. Un negocio con muchos servicios o pueblos suele necesitar Plus o Pro. El hosting se cobra aparte cada mes." },
      { question: "¿Mi Perfil de Empresa en Google y mi sitio coincidirán?", answer: "Mantenemos iguales en ambos el nombre del negocio, el teléfono, el horario y los servicios, y enlazamos su perfil desde el sitio. No prometemos posiciones en Google, pero los datos que no coinciden son un problema evitable." },
    ],
  },
};
