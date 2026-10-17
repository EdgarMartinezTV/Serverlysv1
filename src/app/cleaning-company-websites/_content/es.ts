import type { CleaningCopy } from "./en";

/**
 * Spanish copy for /es/cleaning-company-websites. Same facts, prices and
 * sources as en.ts; written for Spanish speakers in the US ("usted").
 */
export const es: CleaningCopy = {
  meta: {
    title: "Diseño web para empresas de limpieza en Miami | Serverlys",
    description:
      "Diseño web profesional para empresas de limpieza en Miami: solicitudes de cotización, reservas en línea, diseño para celular y SEO local. Consulta gratis.",
  },
  breadcrumb: { home: "Inicio", page: "Sitios web para empresas de limpieza" },
  switchTo: { label: "English", aria: "View this page in English" },

  hero: {
    kicker: "Diseño web para empresas de limpieza · Miami-Dade",
    title: "Sitios web profesionales para empresas de limpieza, hechos para ganar más clientes",
    lede: "Diseñamos sitios web de alto rendimiento para negocios de limpieza que le ayudan a recibir solicitudes de cotización, mostrar sus servicios y convertir las búsquedas locales en oportunidades reales de negocio.",
    ctaPrimary: "Quiero mi consulta gratis",
    ctaDemo: "Ver la demo en vivo",
    points: ["Cotizaciones al instante", "Integración de reservas", "Inglés + español", "Hecho para Google"],
    mock: {
      brand: "Brisa Clean Co.",
      nav: ["Servicios", "Precios", "Zonas"],
      headline: "Casas impecables. Cero estrés.",
      sub: "Limpieza de casas y oficinas en Miami-Dade.",
      cta: "Cotizar ahora",
      quoteTitle: "Cotización al instante",
      bedrooms: "Habitaciones",
      baths: "Baños",
      service: "Servicio",
      zip: "Código postal",
      bedroomsValue: "3",
      bathsValue: "2",
      serviceValue: "Limpieza profunda",
      zipValue: "33178",
      estimateLabel: "Estimado",
      estimate: "$240 – $280",
      button: "Pedir mi cotización",
      toastTitle: "Solicitud recibida",
      toastBody: "Brisa le confirmará por texto.",
      notif: "Nueva solicitud de cotización",
      notifDetail: "Limpieza profunda · 3 hab. · Doral",
      sample: "Sitio de ejemplo · precios ilustrativos",
      chips: { mobile: "Para celular", seo: "Listo para SEO", booking: "Reservas en línea", leads: "Más clientes" },
    },
  },

  why: {
    label: "Por qué importa",
    title: "Su próximo cliente revisa su sitio web antes de llamar.",
    intro:
      "La mayoría elige una empresa de limpieza en pocos minutos desde el celular: busca, compara dos o tres sitios y contacta al que inspira confianza y le facilita pedir un precio.",
    items: [
      {
        title: "Confianza a primera vista",
        body: "Un sitio limpio y profesional, con su equipo real, sus servicios y sus datos de licencia y seguro, tranquiliza a quien va a dejarle entrar a su casa u oficina.",
      },
      {
        title: "Visibilidad en Google",
        body: "Páginas de servicios, páginas de zonas y un SEO técnico correcto le explican a Google qué limpia y dónde, para que aparezca cuando busquen cerca de usted.",
      },
      {
        title: "Solicitudes mientras trabaja",
        body: "Un formulario de cotización, un enlace de reservas y botones para llamar reciben pedidos un domingo a las 9 de la noche, cuando su teléfono está apagado.",
      },
      {
        title: "Visitantes que se vuelven clientes",
        body: "Precios o estimados claros, reseñas honestas y un solo paso siguiente en cada página convierten más de sus visitas en trabajos reservados.",
      },
    ],
  },

  features: {
    label: "Funciones",
    title: "Todo lo que necesita el sitio web de su empresa de limpieza",
    intro: "Pensado en cómo compran de verdad los clientes de limpieza. Elija un objetivo para ver las funciones detrás.",
    filterLabel: "Mostrar funciones para",
    groups: { all: "Todo", win: "Ganar el trabajo", show: "Mostrar su trabajo", found: "Que lo encuentren", run: "Operar sin problemas" },
    items: [
      { id: "services", group: "show", title: "Servicios residenciales y comerciales", body: "Secciones claras para casas y para negocios, para que un propietario y un administrador de edificio encuentren su camino en un clic." },
      { id: "quote", group: "win", title: "Solicitudes de cotización al instante", body: "Un formulario corto o un estimador por habitaciones, baños, metros cuadrados y tipo de servicio, que llega directo a su correo o CRM." },
      { id: "booking", group: "win", title: "Citas en línea", body: "Conectamos la herramienta de reservas que ya usa, como Jobber, Housecall Pro, BookingKoala o ZenMaid, o empezamos con un formulario." },
      { id: "pages", group: "found", title: "Una página por servicio", body: "Limpieza profunda, mudanzas, post-construcción, oficinas: cada una con su página, que responde preguntas y posiciona por sí sola." },
      { id: "areas", group: "found", title: "Zonas de servicio", body: "Muestre exactamente dónde trabaja, con páginas de zonas útiles donde tenga información local real, no páginas de ciudades copiadas." },
      { id: "gallery", group: "show", title: "Galerías de antes y después", body: "Sus propias fotos de antes y después, organizadas por servicio, con un comparador que el cliente puede deslizar." },
      { id: "reviews", group: "show", title: "Testimonios verificados", body: "Reseñas reales de sus clientes, enlazadas a su fuente, como su perfil de Google. Nunca escribimos ni inventamos reseñas." },
      { id: "maps", group: "found", title: "Integración con Google Maps", body: "Su zona de servicio y su Perfil de Empresa de Google conectados al sitio, con el mismo nombre, teléfono y horario en todas partes." },
      { id: "call", group: "win", title: "WhatsApp y llamada con un toque", body: "Un toque para llamarle o escribirle desde cualquier celular, en el encabezado y en cada momento de decisión." },
      { id: "bilingual", group: "win", title: "Inglés y español", body: "Un sitio bilingüe completo, escrito por personas, para que sus clientes hispanohablantes tengan la misma experiencia, no un botón de traducir." },
      { id: "ai", group: "run", title: "Chatbot ConvoAI opcional", body: "Nuestro asistente de IA responde sobre servicios, zonas y disponibilidad a toda hora y pasa las solicitudes de cotización a su equipo." },
      { id: "hosting", group: "run", title: "Hosting seguro y mantenimiento", body: "Hosting rápido, SSL, copias de seguridad y actualizaciones a cargo del mismo equipo que hizo el sitio, para que siga seguro y al día." },
    ],
  },

  demo: {
    label: "Demo en vivo",
    title: "Pruebe un sitio web de limpieza antes de comprar uno.",
    body: "Brisa Clean Co. es una empresa de limpieza ficticia de Miami-Dade que creamos para mostrar lo que su sitio puede hacer. Obtenga un estimado, pida una cita, cambie a español y ábralo en su celular.",
    points: ["Estimador de cotización", "Solicitud de cita", "Menú para celular", "Inglés y español"],
    cta: "Ver la demo en vivo",
    note: "Solo demo: no se envían reservas, pagos ni mensajes.",
  },

  industries: {
    label: "Para quién trabajamos",
    title: "Sitios web para todo tipo de empresa de limpieza",
    intro: "Cada tipo de empresa de limpieza vende de forma distinta. El sitio se construye según cómo eligen sus clientes.",
    note: "Estos son los negocios de limpieza para los que Serverlys hace sitios web. Serverlys es una empresa de diseño web y no ofrece servicios de limpieza.",
    items: [
      { id: "residential", title: "Limpieza residencial", body: "Limpieza recurrente que se vende con confianza: fotos del equipo, rangos de precio claros y reservas semanales o quincenales fáciles.", photo: "/cleaning/living-bright.jpg", alt: "Una sala luminosa y ordenada" },
      { id: "commercial", title: "Limpieza comercial", body: "Propuestas, no compras impulsivas: capacidades, seguros, industrias atendidas y un formulario para pedir una visita.", photo: "/cleaning/office-open.jpg", alt: "Una oficina abierta con ventanales" },
      { id: "janitorial", title: "Limpieza de oficinas (janitorial)", body: "Contratos nocturnos y semanales para oficinas, clínicas y almacenes, con una página por tipo de instalación y solicitud de oferta.", photo: "/cleaning/office-mopping.jpg", alt: "Una persona trapeando el lobby de una oficina de noche" },
      { id: "airbnb", title: "Limpieza de Airbnb", body: "Cambios rápidos para anfitriones: listas de chequeo, servicio de ropa de cama, reportes con fotos y horarios según las salidas.", photo: "/cleaning/bedroom-crisp.jpg", alt: "Una cama recién tendida en un cuarto de huéspedes" },
      { id: "deep", title: "Limpieza profunda", body: "Trabajos únicos que necesitan un alcance claro: qué incluye cada cuarto, cuánto tarda y un estimado al instante.", photo: "/cleaning/kitchen-bright.jpg", alt: "Una cocina luminosa e impecable" },
      { id: "move", title: "Limpieza de mudanza", body: "Coordinada con cierres y fines de contrato, con listas aptas para el arrendador y cotizaciones por tamaño de vivienda.", photo: "/cleaning/living-empty.jpg", alt: "Una sala vacía recién limpiada" },
      { id: "construction", title: "Limpieza post-construcción", body: "Para constructores y remodeladores: fases de limpieza gruesa, final y retoques, prácticas de seguridad y un formulario rápido.", photo: "/cleaning/construction.jpg", alt: "Una obra en construcción vista desde arriba" },
      { id: "carpet", title: "Alfombras y limpiezas especiales", body: "Alfombras, tapicería, ventanas y pisos, con galerías de antes y después y precios por cuarto.", photo: "/cleaning/vacuum-carpet.jpg", alt: "Una aspiradora limpiando una alfombra" },
    ],
  },

  local: {
    label: "SEO local en Miami-Dade",
    title: "Hecho para que lo encuentren en Miami-Dade",
    intro:
      "Los clientes buscan limpieza cerca de ellos, muchas veces en español, y Google responde con negocios que entiende. Construimos su sitio para que explique con claridad qué limpia y dónde trabaja.",
    pillars: [
      { title: "Páginas con relevancia local", body: "Páginas de zonas solo donde tenga algo real que decir: los vecindarios que atiende, trabajos locales y lo que preguntan los clientes de allí." },
      { title: "Páginas de servicios", body: "Una página enfocada por servicio, que responde las preguntas que deciden la reserva, con enlaces entre servicios relacionados." },
      { title: "SEO técnico", body: "Páginas rápidas, URLs limpias, títulos, descripciones, datos estructurados, sitemap XML e indexación correcta, configurados y revisados antes del lanzamiento." },
      { title: "Enlaces internos", body: "Una estructura clara desde la página principal a los servicios y las zonas, para que visitantes y Google siempre encuentren la siguiente página relevante." },
      { title: "Perfil de Empresa de Google", body: "Su perfil y su sitio enlazados y coherentes: mismo nombre, teléfono, horario, zona de servicio y categorías." },
    ],
    areasTitle: "Dónde trabajan nuestros clientes",
    areasIntro: "Hacemos sitios web para empresas de limpieza en todo el condado de Miami-Dade y en cualquier parte de Estados Unidos.",
    areas: [
      "Miami",
      "Doral",
      "Downtown Doral",
      "Hialeah",
      "Hialeah Gardens",
      "Coral Gables",
      "Miami Beach",
      "Miami Lakes",
      "Miami Gardens",
      "North Miami",
      "North Miami Beach",
      "Aventura",
      "South Miami",
      "Miami Springs",
      "Sweetwater",
      "Homestead",
      "Cutler Bay",
      "Pinecrest",
      "Palmetto Bay",
      "Kendall",
      "Brickell",
      "Wynwood",
      "Downtown Miami",
      "Little Havana",
      "Westchester",
    ],
    insightsTitle: "Lo que debe tener en cuenta un sitio de limpieza en Miami-Dade",
    insights: [
      {
        title: "Clientes bilingües",
        body: "En buena parte del condado, muchos hogares hablan español en casa. Una versión completa en español de su sitio, no un widget, les llega directamente.",
      },
      {
        title: "Demanda comercial en Doral",
        body: "La Ciudad de Doral reporta más de 2.600 empresas de comercio y logística y más de 250 sedes corporativas: un gran mercado para contratos de limpieza de oficinas y almacenes.",
        source: { label: "Ciudad de Doral, perfil económico (en inglés)", href: "https://www.cityofdoral.com/businesses/economic-snapshot/" },
      },
      {
        title: "Licencias a la vista",
        body: "Los negocios de Miami-Dade necesitan un recibo de impuesto local de negocios, y los que están dentro de una ciudad también el de la ciudad. Mostrar sus licencias y seguros genera confianza con los clientes comerciales.",
        source: { label: "Recaudador de Impuestos de Miami-Dade (en inglés)", href: "https://www.mdctaxcollector.gov/en/services/local-business-tax-receipt" },
      },
    ],
    visitTitle: "Nos reunimos en persona en Downtown Doral",
    visitBody: "Para empresas de limpieza en Miami-Dade, podemos sentarnos con usted, abrir su sitio actual y su ficha de Google en un celular y mostrarle lo que ven sus clientes, en inglés o en español.",
  },

  pricing: {
    label: "Precios",
    title: "Precios iniciales transparentes",
    intro:
      "Los sitios para empresas de limpieza se construyen sobre nuestros planes estándar de diseño web. Las funciones propias de limpieza, como un estimador de cotización o la integración de reservas, se definen y cotizan para su empresa.",
    from: "Desde",
    oneTime: "pago único",
    subpages: "{n} subpáginas",
    includesTitle: "Todos los planes incluyen",
    includeLabels: {
      "100% custom homepage": "Página principal 100% a medida",
      "WordPress implementation": "Implementación en WordPress",
      "Web style guide": "Guía de estilo web",
      "SEO-friendly blog": "Blog optimizado para SEO",
      "Analytics setup": "Configuración de analítica",
    },
    fit: {
      starter: "Ideal para una empresa de limpieza nueva o pequeña con pocos servicios principales.",
      plus: "Ideal para empresas establecidas con más servicios y páginas de zonas.",
      pro: "Ideal para empresas comerciales y de muchos servicios, con muchas páginas.",
    },
    order: "Pedir {plan}",
    consult: "Preguntar por {plan}",
    addonsTitle: "Funciones para empresas de limpieza",
    addonsIntro: "Se cotizan para su negocio después de la consulta gratuita. Usted aprueba el precio antes de empezar.",
    addons: [
      { name: "Estimador de cotización interactivo", detail: "Estimados por tamaño de vivienda, servicio y frecuencia" },
      { name: "Integración con software de reservas", detail: "Jobber, Housecall Pro, BookingKoala, ZenMaid y otros" },
      { name: "Versión completa en español", detail: "Cada página, escrita en español" },
      { name: "Galerías de antes y después", detail: "Con comparador deslizable" },
      { name: "Chatbot ConvoAI", detail: "Responde preguntas y recibe solicitudes de cotización" },
      { name: "Páginas de zonas de servicio", detail: "Solo donde haya contenido local real" },
    ],
    quote: "Pedir cotización",
    careTitle: "Hosting y mantenimiento",
    careBody: "Los planes de mantenimiento ServerCare empiezan en {price} al mes e incluyen actualizaciones, copias de seguridad, monitoreo de seguridad y cambios de contenido.",
    careCta: "Ver planes de mantenimiento",
    perMonth: "/mes",
    footnote: "Precios en USD, más impuestos aplicables. El software de terceros, como las herramientas de reservas, lo factura su proveedor.",
  },

  process: {
    label: "Cómo trabajamos",
    title: "De la primera llamada al lanzamiento, en cinco pasos",
    steps: [
      { title: "Descubrimiento", body: "Conocemos sus servicios, zonas, clientes y metas, y revisamos su sitio actual y su ficha de Google." },
      { title: "Diseño", body: "Un diseño a medida con su marca y sus fotos, que usted revisa en una vista previa privada antes de construir." },
      { title: "Desarrollo", body: "Construimos el sitio, los formularios de cotización y las integraciones, pensado para celular y rápido, en nuestro propio hosting." },
      { title: "Configuración SEO", body: "Títulos, descripciones, datos estructurados, sitemap, Perfil de Empresa de Google y analítica, configurados y revisados." },
      { title: "Lanzamiento y soporte", body: "Lanzamos, monitoreamos y seguimos mejorando, con actualizaciones y cambios a cargo del mismo equipo." },
    ],
  },

  portfolio: {
    label: "Nuestro trabajo",
    title: "Vea el trabajo antes de comprometerse",
    intro:
      "Solo mostramos proyectos de clientes con su permiso. Mientras tanto, la mejor forma de juzgar nuestro trabajo es probarlo: la demo es un sitio completo de empresa de limpieza, hecho como haríamos el suyo.",
    demoTitle: "Brisa Clean Co. — demo en vivo",
    demoBody: "Empresa de limpieza ficticia de Miami-Dade. Estimador de cotización, solicitud de cita, galería, menú para celular e inglés/español.",
    demoCta: "Abrir la demo",
    more: "Más de nuestro trabajo (en inglés)",
    moreHref: "/website-design",
  },

  faq: {
    label: "Preguntas frecuentes",
    title: "Lo que nos preguntan los dueños de empresas de limpieza",
    items: [
      {
        question: "¿Cuánto cuesta un sitio web para una empresa de limpieza?",
        answer:
          "Nuestros planes de diseño web empiezan en $1,399 (Starter), $1,899 (Plus) y $2,699 (Pro), en un solo pago. Las funciones propias de limpieza, como un estimador de cotización, la integración de reservas o una versión completa en español, se cotizan para su negocio después de una consulta gratuita, y usted aprueba el precio antes de empezar.",
      },
      {
        question: "¿Cuánto tarda el desarrollo del sitio?",
        answer:
          "Depende de la cantidad de páginas, su contenido y las integraciones que necesite. Acordamos los plazos en un alcance escrito antes de empezar, para que conozca la fecha de lanzamiento desde el principio.",
      },
      {
        question: "¿Los clientes pueden pedir cotizaciones en línea?",
        answer:
          "Sí. Podemos agregar un formulario sencillo o un estimador interactivo por tamaño de vivienda, servicio y frecuencia. Las solicitudes llegan a su correo o CRM, y los estimados se muestran como rangos que usted controla.",
      },
      {
        question: "¿Mi sitio se puede conectar a un software de reservas?",
        answer:
          "Sí. Si usa una herramienta como Jobber, Housecall Pro, BookingKoala o ZenMaid, conectamos su formulario de reservas o solicitudes a su sitio. Ese software tiene su propia suscripción con su proveedor.",
      },
      {
        question: "¿El sitio funcionará en celulares?",
        answer: "Sí. Todos los sitios se diseñan primero para celular, porque la mayoría de los clientes de limpieza le encuentran y le contactan desde un teléfono.",
      },
      {
        question: "¿Pueden rediseñar mi sitio web actual?",
        answer:
          "Sí. Revisamos lo que tiene, conservamos lo que funciona y reconstruimos el resto, cuidando las páginas que ya le traen clientes desde Google.",
      },
      {
        question: "¿Ofrecen hosting y mantenimiento?",
        answer:
          "Sí. Alojamos los sitios que construimos, y nuestros planes de mantenimiento ServerCare empiezan en $149.95 al mes, con actualizaciones, copias de seguridad, monitoreo de seguridad y cambios de contenido.",
      },
      {
        question: "¿Serverlys puede ayudar con el SEO local?",
        answer:
          "Sí. Cada sitio se lanza con SEO técnico y la configuración de su Perfil de Empresa de Google, y ofrecemos servicios de SEO continuos. No prometemos posiciones; nadie puede garantizar honestamente un lugar en Google.",
      },
      {
        question: "¿Hacen sitios bilingües para empresas de limpieza?",
        answer: "Sí. Hacemos sitios completos en inglés y en español, escritos por personas, y nuestro equipo trabaja en ambos idiomas.",
      },
      {
        question: "¿Trabajan con empresas de limpieza fuera de Miami?",
        answer:
          "Sí. Hacemos sitios web para empresas de limpieza en cualquier parte de Estados Unidos. En Miami-Dade podemos reunirnos en persona; en otros lugares trabajamos por videollamada, correo y teléfono.",
      },
    ],
  },

  cta: {
    label: "Consulta gratis",
    title: "¿Listo para hacer crecer su empresa de limpieza en línea?",
    body: "Cuéntenos sobre su empresa. Revisaremos su sitio actual y su presencia en Google y le recomendaremos el plan adecuado, nos contrate o no.",
    bullets: ["Una revisión real de su sitio actual", "Una recomendación y un precio claros", "En inglés o en español"],
    call: "¿Prefiere hablar? Llame al",
  },

  form: {
    title: "Pida su consulta gratis",
    required: "obligatorio",
    optional: "opcional",
    fields: {
      name: "Nombre completo",
      company: "Nombre de la empresa",
      email: "Correo electrónico",
      phone: "Teléfono",
      city: "Ciudad",
      cityHint: "Por ejemplo: Doral, FL",
      website: "Sitio web actual",
      websiteHint: "Déjelo vacío si aún no tiene uno",
      type: "Tipo de empresa de limpieza",
      services: "Servicios que le interesan",
      servicesHint: "Elija todos los que apliquen",
      budget: "Presupuesto del proyecto",
      notes: "Notas del proyecto",
      notesHint: "Lo que debamos saber: servicios, zonas, metas, plazos.",
    },
    types: {
      residential: "Residencial / servicio de limpieza de casas",
      commercial: "Comercial / janitorial",
      both: "Residencial y comercial",
      specialty: "Especializada (alfombras, post-construcción, Airbnb)",
      other: "Otro",
    },
    choose: "Elija una opción",
    services: {
      website: "Sitio web nuevo",
      redesign: "Rediseño de mi sitio actual",
      quote: "Cotizaciones o estimador",
      booking: "Integración de reservas",
      seo: "SEO local",
      bilingual: "Inglés y español",
      hosting: "Hosting y mantenimiento",
      ai: "Chatbot ConvoAI",
    },
    budgets: {
      under1500: "Menos de $1,500",
      b1500: "$1,500 – $2,500",
      b2500: "$2,500 – $5,000",
      over5000: "Más de $5,000",
      unsure: "Aún no lo sé",
    },
    submit: "Quiero mi consulta gratis",
    sending: "Enviando…",
    privacy: "Usamos estos datos solo para preparar su consulta y contactarle sobre ella. Lea nuestra",
    privacyLink: "política de privacidad",
    errors: {
      summary: "Por favor, corrija lo siguiente:",
      required: "Este campo es obligatorio.",
      email: "Escriba un correo electrónico válido.",
      phone: "Escriba un número de teléfono completo.",
      url: "Escriba una dirección web válida, como ejemplo.com.",
      services: "Elija al menos un servicio.",
      choose: "Por favor, elija una opción.",
      rateLimited: "Demasiadas solicitudes desde esta conexión. Espere unos minutos o llámenos.",
      network: "No pudimos conectar con nuestro servidor. Revise su conexión e intente de nuevo, o llámenos.",
    },
    success: {
      title: "Gracias. Recibimos su solicitud.",
      notified: "Su solicitud ya está con el equipo de Serverlys. Le contactaremos por teléfono o correo para agendar su consulta.",
      saved: "Su solicitud quedó guardada. Si no sabe de nosotros en un día hábil, por favor llámenos.",
      reference: "Su referencia",
      again: "Enviar otra solicitud",
    },
    failure: { title: "Algo salió mal", body: "Su solicitud no se envió. Intente de nuevo o llámenos.", ticket: "Abrir un ticket de ventas" },
  },

  related: {
    label: "Más de Serverlys (en inglés)",
    items: [
      ["Diseño web", "/website-design"],
      ["Servicios de SEO", "/seo"],
      ["Mantenimiento web", "/site-management"],
      ["Sitios para restaurantes", "/es/restaurant-websites"],
      ["Correo empresarial", "/business-email"],
      ["Agentes de IA", "/ai-agents"],
    ],
  },

  mobileBar: { consult: "Consulta gratis", call: "Llamar" },
};
