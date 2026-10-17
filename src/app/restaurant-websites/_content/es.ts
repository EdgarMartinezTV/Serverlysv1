import type { LandingCopy } from "../_i18n";

/**
 * /es/restaurant-websites — copia en español.
 *
 * Written for US Spanish-speaking restaurant owners (formal "usted"), not a
 * word-for-word translation of en.ts. Same claims rule: no ranking promises,
 * no turnaround times, third-party fees named as theirs.
 */
export const es: LandingCopy = {
  meta: {
    title: "Sitios web para restaurantes con pedidos | Serverlys",
    description:
      "Sitios web para restaurantes con menú digital, pedidos en línea, reservaciones, SEO local y asistente con IA bilingüe. Hechos por Serverlys. Revisión gratis.",
  },
  breadcrumb: { home: "Inicio", page: "Sitios web para restaurantes" },
  switchTo: { label: "English", aria: "View this page in English" },
  hero: {
    kicker: "Sitios web para restaurantes · Serverlys",
    title: "Sitios web que llenan mesas.",
    lede: "Un sitio web hermoso con menú digital de verdad, pedidos en línea, reservaciones y un asistente con IA que atiende a sus clientes en español e inglés. Diseñado, alojado y actualizado por un solo equipo.",
    ctaReview: "Revisión gratuita de su sitio web",
    ctaDemo: "Ver la demo en vivo",
    points: ["Menú digital", "Pedidos en línea", "Reservaciones", "SEO local", "Asistente con IA"],
    chips: {
      order: "Nuevo pedido para recoger",
      orderDetail: "2 platos · $54.00",
      booking: "Solicitud de mesa",
      bookingDetail: "4 personas · vie 8:00 PM",
      ai: "“Do you have gluten-free options?”",
    },
    mock: {
      tagline: "Cocina latina a la leña",
      headline: "Cocinado al fuego.",
      order: "Pedir para recoger",
      reserve: "Reservar",
      menu: "Menú",
      viewOrder: "Ver pedido · 2 · $54.00",
      dishes: ["Churrasco", "Pollo a la brasa", "Tartar de atún"],
    },
  },
  checks: {
    label: "Antes de venir",
    title: "Cinco cosas que todo cliente revisa antes de elegir dónde comer",
    items: [
      { title: "El menú", body: "Fácil de leer en el teléfono, con precios e información dietética." },
      { title: "Horario y ubicación", body: "¿Está abierto? ¿Qué tan lejos? ¿Dónde estaciono?" },
      { title: "Pedir", body: "Para recoger o a domicilio, sin buscar el botón." },
      { title: "Reservar", body: "Una mesa para esta noche en tres toques, aunque sea medianoche." },
      { title: "Google", body: "Fotos, horario y un sitio web que coincida." },
    ],
  },
  explorer: {
    label: "Lo que construimos",
    title: "Todo lo que su restaurante necesita en línea, funcionando en conjunto",
    intro:
      "Elija una parte del sistema para ver cómo funciona para sus clientes. Todos los planes son diseñados, construidos y alojados por Serverlys.",
    tablistLabel: "Funciones del sitio web para restaurantes",
    external: "Requiere una cuenta de terceros",
    tabs: [
      {
        id: "website",
        label: "Sitio web",
        title: "Un sitio web que se siente como su comedor",
        body: "Diseñado alrededor de su comida, sus fotos y su marca, no una plantilla con su logo encima. Pensado primero para el teléfono, porque ahí es donde casi todos sus clientes lo conocen.",
        bullets: [
          "Diseño a medida para su comida y su marca",
          "Rápido y pensado primero para el teléfono",
          "Horario, cómo llegar y llamar con un toque en cada página",
          "Hosting, SSL y copias de seguridad diarias incluidos",
        ],
      },
      {
        id: "menu",
        label: "Menú digital",
        title: "Un menú de verdad, no un PDF borroso",
        body: "Su menú como una página web: fácil de leer en cualquier teléfono, con filtros por dieta y visible para Google. Un solo código QR en cada mesa que nunca hay que volver a imprimir.",
        bullets: [
          "Legible en cualquier teléfono y visible en Google",
          "Etiquetas de dieta y alérgenos con filtros",
          "Un código QR para todas las mesas, para siempre",
          "Cambios de precios y platos hechos por nosotros cada mes",
        ],
      },
      {
        id: "ordering",
        label: "Pedidos en línea",
        title: "Reciba pedidos en su propio sitio web",
        body: "Un botón de Pedir en cada página y en Google, conectado al sistema de pedidos que ya usa o a uno que le ayudamos a elegir. Sus clientes le compran a usted, no a una plataforma intermediaria.",
        bullets: [
          "Conectado a Toast, Square, Clover, ChowNow y otros",
          "Opciones para recoger y a domicilio",
          "Botón de Pedir en su sitio y en su perfil de Google",
          "Enlaces a DoorDash o Uber Eats si los mantiene",
        ],
        note: "Requiere una cuenta con su proveedor de pedidos. Sus tarifas y el procesamiento de pagos son aparte y se pagan a ellos.",
      },
      {
        id: "reservations",
        label: "Reservaciones",
        title: "Reciba reservaciones aunque esté cerrado",
        body: "El cliente elige cuántas personas, la fecha y la hora en pocos toques. Conectamos su sistema de reservaciones, o creamos un formulario de solicitud que envía cada reservación directo a su equipo.",
        bullets: [
          "OpenTable, Resy, Tock y otros conectados",
          "O un formulario que le llega por email a su equipo",
          "Botón de Reservar en su sitio y en Google",
          "Solicitudes de eventos privados y catering en Restaurant Pro",
        ],
        note: "Los sistemas como OpenTable o Resy requieren su propia cuenta y suscripción.",
      },
      {
        id: "seo",
        label: "SEO local",
        title: "Sea el restaurante que aparece cerca",
        body: "Configuramos lo que Google lee cuando alguien cerca busca dónde cenar: su Perfil de Empresa, el marcado de restaurante y menú, y el mismo nombre, dirección y horario en todas partes.",
        bullets: [
          "Perfil de Empresa de Google configurado y optimizado",
          "Schema de restaurante, menú y horario",
          "Mismo nombre, dirección y teléfono en todas partes",
          "Reporte mensual en Growth y Restaurant Pro",
        ],
        note: "Sin garantías de posición. Nadie puede prometer honestamente un lugar en Google.",
      },
      {
        id: "ai",
        label: "Asistente con IA",
        title: "Un asistente que atiende en español e inglés",
        body: "ConvoAI, nuestro propio asistente con IA, aprende su menú, horario y políticas y responde a sus clientes en su sitio web de día y de noche. Cuando una pregunta necesita a una persona, se la pasa a su equipo.",
        bullets: [
          "Responde sobre menú, alérgenos, horario y estacionamiento",
          "Recibe solicitudes de reservación y catering",
          "Contesta en el idioma del cliente, español o inglés",
          "Usted aprueba todo lo que sabe",
        ],
        note: "Incluido en Restaurant Pro. Funciona con ConvoAI.",
      },
    ],
    ui: {
      desktop: "Escritorio",
      mobile: "Móvil",
      previewLabel: "Tamaño de la vista previa",
      allDishes: "Todo",
      vegetarian: "Vegetariano",
      glutenFree: "Sin gluten",
      scanToView: "Escanee para ver el menú",
      add: "Agregar",
      inCart: "en su pedido",
      checkout: "Pagar",
      partySize: "Personas",
      guests: "personas",
      pickTime: "Elija una hora",
      requested: "Solicitada",
      openNow: "Abierto · Cierra a las 11 PM",
      directions: "Cómo llegar",
      call: "Llamar",
      seoChecklist: [
        "Perfil de Empresa de Google verificado",
        "El horario coincide con el sitio web",
        "Enlace al menú en Google",
        "Schema de restaurante en cada página",
        "Botones de Pedir y Reservar en Google",
      ],
      chatPrompts: [
        {
          q: "¿Tienen opciones sin gluten?",
          a: "Sí. Siete platos son sin gluten, entre ellos el churrasco y el pollo a la brasa. ¿Quiere que le muestre solo esos?",
        },
        {
          q: "¿Puedo reservar para 4 el viernes?",
          a: "El viernes hay mesas a las 7:30 y a las 9:00 PM. ¿Cuál prefiere? Le envío la solicitud al anfitrión.",
        },
        {
          q: "Is there parking?",
          a: "Yes, there’s free parking in the garage next door. Anything else I can help with?",
        },
      ],
      chatHint: "Toque una pregunta",
      sample: "Conversación de ejemplo",
      menuFilterLabel: "Filtrar el menú",
      hoursDiffer: "El horario podría variar",
      fewer: "Menos personas",
      more: "Más personas",
      previewAlt: "Vista previa del sitio web del restaurante de demostración Lumbre.",
      typing: "El asistente está escribiendo",
      seoCategory: "Restaurante latino · $$$ · Doral",
    },
  },
  demoBand: {
    label: "Demo en vivo",
    title: "Pruebe un sitio web de restaurante real antes de comprar el suyo",
    body: "Lumbre es una cocina a la leña ficticia que creamos para mostrarle exactamente lo que recibirían sus clientes. Explore el menú, arme un pedido, reserve una mesa y hágale una pregunta al asistente.",
    bullets: [
      "Menú interactivo con filtros por dieta",
      "Carrito para recoger o a domicilio",
      "Reservación en tres pasos",
      "Asistente con IA de ejemplo en español e inglés",
    ],
    cta: "Ver la demo en vivo",
    disclaimer: "Restaurante ficticio. Sin pagos, pedidos ni reservaciones reales.",
  },
  steps: {
    label: "Cómo funciona",
    title: "De una revisión gratuita a un sitio que recibe pedidos, en cuatro pasos.",
    items: [
      {
        title: "Revisión gratuita",
        body: "Revisamos su sitio web y su perfil de Google en un teléfono, como lo hace un cliente con hambre, y le mostramos qué le está costando pedidos y reservaciones.",
      },
      {
        title: "Un plan y un alcance por escrito",
        body: "Usted elige un plan. Páginas, integraciones, idiomas y fecha de lanzamiento quedan por escrito antes de empezar cualquier trabajo.",
      },
      {
        title: "Diseño, desarrollo y revisión",
        body: "Diseñamos alrededor de su comida y su marca, conectamos pedidos y reservaciones, y usted revisa el sitio completo en una vista previa privada antes de publicarlo.",
      },
      {
        title: "Lanzamiento y mantenimiento",
        body: "Lanzamos, conectamos Google y nos encargamos cada mes de los cambios de menú, horario y especiales para que el sitio nunca se quede atrás.",
      },
    ],
  },
  pricing: {
    label: "Precios",
    title: "Planes de sitio web para restaurantes",
    intro:
      "Un pago único para diseñar y lanzar su sitio. Un plan mensual para hosting, actualizaciones y crecimiento.",
    setup: "pago único de inicio",
    perMonth: "/mes",
    then: "luego",
    cta: "Elegir",
    recommended: "Recomendado",
    listTitle: "Lo más importante",
    summaries: {
      starter: "Todo lo que un cliente revisa antes de venir, bien hecho y siempre al día.",
      growth:
        "Reciba pedidos y reservaciones en su propio sitio, en español e inglés, y aparezca en búsquedas locales.",
      pro: "Suma un asistente con IA que atiende de día y de noche, además de catering, eventos y hasta tres sucursales.",
    },
    highlights: {
      starter: [
        "Sitio web a medida, hasta 5 páginas",
        "Menú digital para el teléfono y código QR",
        "Hosting, SSL y copias de seguridad diarias",
        "Schema de restaurante y enlace a su perfil de Google",
        "2 cambios de menú u horario al mes",
      ],
      growth: [
        "Todo lo de Starter, hasta 10 páginas",
        "Sitio en español e inglés",
        "Pedidos en línea conectados †",
        "Reservaciones conectadas †",
        "Optimización del perfil de Google y SEO local",
        "6 cambios al mes y reporte mensual",
      ],
      pro: [
        "Todo lo de Growth, hasta 20 páginas",
        "Asistente ConvoAI bilingüe, entrenado con su menú",
        "Solicitudes de catering y eventos privados",
        "Hasta 3 sucursales",
        "4 publicaciones al mes en su perfil de Google",
        "12 cambios al mes y una llamada de estrategia trimestral",
      ],
    },
    footnote:
      "El pago de inicio es único; el plan mensual empieza con el lanzamiento. Precios en USD, más impuestos aplicables. † Requiere una cuenta con un proveedor externo, como Toast, Square, OpenTable o Resy. Sus tarifas, procesamiento de pagos y condiciones son aparte y se pagan directamente a ellos.",
  },
  compare: {
    title: "Compare todas las funciones",
    caption: "Planes de sitio web para restaurantes comparados función por función",
    feature: "Función",
    included: "Incluido",
    notIncluded: "No incluido",
    externalLegend: "† Requiere una cuenta de terceros; sus tarifas son aparte.",
    groups: [
      {
        title: "Sitio web",
        rows: [
          { label: "Páginas", values: ["Hasta 5", "Hasta 10", "Hasta 20"] },
          { label: "Diseño a medida", values: [true, true, true] },
          { label: "Pensado para el teléfono y rápido", values: [true, true, true] },
          { label: "Idiomas", values: ["Español o inglés", "Español + inglés", "Español + inglés"] },
          { label: "Hosting, SSL y copias de seguridad diarias", values: [true, true, true] },
          { label: "Sucursales", values: ["1", "1", "Hasta 3"] },
        ],
      },
      {
        title: "Menú",
        rows: [
          { label: "Menú digital (página web, no PDF)", values: [true, true, true] },
          { label: "Código QR para las mesas", values: [true, true, true] },
          { label: "Etiquetas de dieta y alérgenos", values: [true, true, true] },
          { label: "Cambios de menú, horario y especiales", values: ["2 al mes", "6 al mes", "12 al mes"] },
        ],
      },
      {
        title: "Pedidos y reservaciones",
        rows: [
          { label: "Botones de Pedir y Reservar hacia sus páginas actuales", values: [true, true, true] },
          { label: "Integración de pedidos en línea", values: [false, true, true], external: true },
          { label: "Integración del sistema de reservaciones", values: [false, true, true], external: true },
          { label: "Solicitudes de catering y eventos privados", values: [false, false, true] },
        ],
      },
      {
        title: "Google y SEO local",
        rows: [
          { label: "Schema de restaurante y menú", values: [true, true, true] },
          { label: "Perfil de Empresa de Google", values: ["Enlazado", "Optimizado", "Optimizado + 4 publicaciones al mes"] },
          { label: "Configuración de SEO local", values: [false, true, true] },
          { label: "Reporte mensual de resultados", values: [false, true, true] },
        ],
      },
      {
        title: "Asistente con IA",
        rows: [
          { label: "Asistente ConvoAI en su sitio web", values: [false, false, true] },
          { label: "Responde en español e inglés", values: [false, false, true] },
          { label: "Solicitudes de reservación y catering enviadas a su equipo", values: [false, false, true] },
        ],
      },
      {
        title: "Soporte",
        rows: [
          { label: "Soporte en español o inglés", values: [true, true, true] },
          { label: "Llamada de estrategia trimestral", values: [false, false, true] },
        ],
      },
    ],
  },
  doral: {
    kicker: "Downtown Doral",
    title: "¿Tiene un restaurante en Downtown Doral? Vamos a visitarlo.",
    body: "Visitamos en persona a los restaurantes de Downtown Doral. Nos sentamos con usted, abrimos su sitio web y su perfil de Google en un teléfono y le mostramos exactamente lo que ve un cliente, en español o en inglés. En cualquier otra parte de Estados Unidos hacemos la misma revisión por videollamada.",
    points: [
      "En persona en Downtown Doral",
      "Por videollamada en todo EE. UU.",
      "En español o en inglés",
      "Gratis y sin compromiso",
    ],
    aside: "Revisión [gratuita]. Equipo [bilingüe]. Una [demo en vivo] para probar en su propio teléfono.",
    cta: "Revisión gratuita de su sitio web",
  },
  form: {
    label: "Revisión gratuita",
    title: "Solicite una revisión gratuita de su sitio web",
    intro:
      "Cuéntenos sobre su restaurante. Revisaremos su sitio web y su perfil de Google como lo hace un cliente con hambre, en un teléfono, y le explicaremos lo que encontremos.",
    reviewTitle: "Lo que revisamos",
    reviewItems: [
      "Cómo carga y se lee su sitio en un teléfono",
      "Su menú: formato, precios e información dietética",
      "El camino desde Google hasta un pedido o una reservación",
      "Su perfil de Google, horario y fotos",
      "Qué arreglar primero, en palabras sencillas",
    ],
    contactLine: "¿Prefiere hablar? Llame al",
    fields: {
      restaurant: "Nombre del restaurante",
      contact: "Su nombre",
      website: "Sitio web actual",
      websiteHint: "Pegue la dirección de su sitio, o marque la casilla si todavía no tiene uno.",
      noWebsite: "Todavía no tenemos sitio web",
      phone: "Teléfono",
      email: "Correo electrónico",
      location: "Ciudad o zona",
      locationHint: "Por ejemplo: Downtown Doral, FL",
      services: "¿Con qué necesita ayuda?",
      servicesHint: "Elija todas las que apliquen.",
      plan: "Plan que le interesa",
      planNone: "Todavía no sé",
      language: "Idioma preferido",
      message: "¿Algo más que debamos saber?",
      messageHint: "Su sistema de pedidos actual, número de sucursales, plazos.",
      optional: "opcional",
      required: "obligatorio",
    },
    services: {
      website: "Sitio web nuevo o rediseño",
      menu: "Menú digital y código QR",
      ordering: "Pedidos en línea",
      reservations: "Reservaciones",
      seo: "Google y SEO local",
      ai: "Asistente con IA (ConvoAI)",
      unsure: "No estoy seguro, díganme qué necesito",
    },
    languages: { en: "Inglés", es: "Español" },
    submit: "Quiero mi revisión gratuita",
    sending: "Enviando…",
    privacy:
      "Usamos estos datos solo para preparar su revisión y contactarle sobre ella. Lea nuestra",
    privacyLink: "política de privacidad (en inglés)",
    errors: {
      summary: "Revise los campos marcados:",
      required: "Este campo es obligatorio.",
      email: "Escriba un correo electrónico válido.",
      phone: "Escriba un número de teléfono completo.",
      url: "Escriba una dirección web válida, o marque “Todavía no tenemos sitio web”.",
      services: "Elija al menos una opción.",
      network: "No pudimos conectar con nuestro servidor. Revise su conexión e intente de nuevo.",
      rateLimited: "Demasiadas solicitudes seguidas. Intente de nuevo en unos minutos.",
    },
    success: {
      title: "Gracias, ya la recibimos.",
      notified:
        "Su solicitud está con el equipo de Serverlys. Le contactaremos por teléfono o correo para coordinar su revisión.",
      saved:
        "Su solicitud quedó guardada, pero no pudimos confirmar que llegó a nuestra bandeja. Para no dejar nada al azar, escriba a support@serverlys.com con la referencia de abajo, o llámenos.",
      reference: "Referencia",
      again: "Enviar otra solicitud",
    },
    failure: {
      title: "No pudimos enviar su solicitud",
      body: "Sus datos siguen en el formulario. Intente de nuevo, llámenos o abra un ticket de ventas.",
      ticket: "Abrir un ticket de ventas",
    },
  },
  faq: {
    label: "Preguntas frecuentes",
    title: "Lo que nos preguntan los dueños de restaurantes",
    items: [
      {
        question: "¿Pueden mejorar el sitio web que ya tengo, o necesito uno nuevo?",
        answer:
          "Cualquiera de las dos. La revisión gratuita le dice qué conviene. Si su sitio actual está bien hecho, podemos rediseñarlo y alojarlo en Serverlys; si es lento, difícil de actualizar o no está hecho para teléfonos, un sitio nuevo suele ser el camino más rápido.",
      },
      {
        question: "¿Pueden conectar el sistema de pedidos en línea que ya uso?",
        answer:
          "Sí, en Growth y Restaurant Pro. Conectamos el proveedor de pedidos que ya tiene, como Toast, Square, Clover o ChowNow, o le ayudamos a elegir uno. Las tarifas del proveedor y el procesamiento de pagos son aparte y se pagan a ellos. Serverlys no cobra comisión por sus pedidos.",
      },
      {
        question: "¿Y DoorDash y Uber Eats?",
        answer:
          "Podemos enlazar sus perfiles en esas plataformas desde su sitio. Cuando el cliente pide directamente en su sitio web, la relación con el cliente es suya; las comisiones de las plataformas las fijan ellas.",
      },
      {
        question: "¿Mi menú va a ser un PDF?",
        answer:
          "No. Su menú es una página web de verdad: legible en cualquier teléfono, con filtros por dieta y visible para Google. Los cambios de precios y platos los hace nuestro equipo dentro de las actualizaciones mensuales de su plan.",
      },
      {
        question: "¿Mi sitio puede estar en español e inglés?",
        answer:
          "Sí. Starter se hace en un idioma, español o inglés. Growth y Restaurant Pro incluyen las dos versiones. Nuestro equipo trabaja en español e inglés, y usted aprueba cada página antes de publicarla.",
      },
      {
        question: "¿Qué hace exactamente el asistente con IA?",
        answer:
          "En Restaurant Pro, ConvoAI, nuestro propio asistente con IA, responde en su sitio web preguntas sobre su menú, alérgenos, horario, estacionamiento y políticas, en español o en inglés. Recibe solicitudes de reservación y catering y se las pasa a su equipo. No cobra pagos, y usted aprueba todo lo que sabe.",
      },
      {
        question: "¿Cuánto tiempo toma lanzar el sitio?",
        answer:
          "Depende de su menú, sus fotos y las integraciones. Acordamos la fecha de lanzamiento en el alcance por escrito antes de empezar, para que la sepa desde el principio.",
      },
      {
        question: "¿De quién son el dominio y el contenido?",
        answer:
          "Su dominio se registra a nombre de su restaurante, y su menú, sus fotos y sus textos son suyos.",
      },
      {
        question: "¿La revisión del sitio web es realmente gratis?",
        answer:
          "Sí. Revisamos su sitio web actual y su perfil de Google y le explicamos lo que encontramos, nos contrate o no.",
      },
      {
        question: "¿Solo trabajan con restaurantes en Doral?",
        answer:
          "No. Hacemos sitios web para restaurantes en cualquier parte de Estados Unidos. En Downtown Doral podemos reunirnos en persona; en el resto del país trabajamos por videollamada, correo y teléfono.",
      },
    ],
  },
  related: {
    label: "Más de Serverlys (en inglés)",
    items: [
      ["Diseño web", "/website-design"],
      ["Servicios de SEO", "/seo"],
      ["Redes sociales", "/social-media"],
      ["Correo empresarial", "/business-email"],
      ["Dominios", "/register-domain"],
      ["Hosting WordPress", "/wordpress-hosting"],
      ["Mantenimiento web", "/site-management"],
      ["Agentes de IA", "/ai-agents"],
    ],
  },
};
