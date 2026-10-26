import type { Industry } from "./types";

export const contractor: Industry = {
  slug: "contractor",
  related: ["construction", "roofing", "architect"],
  en: {
    name: "General contractors and remodelers",
    metaTitle: "Contractor Website Design for Remodelers | Serverlys",
    metaDescription:
      "Websites for contractors and remodelers, built for you: remodel pages, project galleries, a quote form with photos and license details. From $1,399.",
    h1: "Contractor website design built around the quote request",
    lede:
      "We design and build websites for general contractors and remodelers: a page for each kind of job you take on, a quote request form that collects photos and project details, the towns you actually serve, and your license and insurance details in plain view. Custom design starts at $1,399, scoped in writing before you commit.",
    needs: [
      { title: "A page for each kind of remodel", text: "Kitchens, bathrooms, basements, additions: each gets its own page explaining what you handle, from demolition to permits and trade subs, with photos of that kind of job." },
      { title: "Quote requests with the details you need", text: "A form that asks the project type, ZIP code, rough budget range and timing, and lets the homeowner attach photos, so the first call is about the job, not the basics." },
      { title: "The service area you really cover", text: "The cities and counties you work in, with a line about what falls outside them, so you stop getting requests from two hours away." },
      { title: "Galleries sorted by project", text: "Photos grouped by job with a short note on what was done, taken from your phone or CompanyCam, instead of one long scroll of mixed pictures." },
      { title: "License, insurance and warranty up front", text: "Your license or registration number, insurance status and the workmanship warranty you offer, shown in the footer and again on the quote page where homeowners look for them." },
      { title: "How a remodel works with you", text: "A plain step-by-step page, from walkthrough and estimate to contract, permits, build and final walkthrough, that explains deposits and change orders before anyone signs." },
    ],
    pages: ["Home", "Services (one page per remodel type)", "Project gallery", "Our process", "Service area", "About, license and insurance", "Reviews", "Request a quote"],
    integrations: ["Jobber", "Buildertrend", "Houzz Pro", "CompanyCam", "Google reviews", "Google Business Profile", "Call tracking"],
    rules: {
      title: "License numbers in contractor advertising",
      text: "Many states require a contractor's license or registration number on advertising, and some treat a website as advertising. We display the license, registration and insurance details you give us where you want them, usually the footer and the quote page. Requirements differ by state and city, so you confirm what yours asks for and approve every claim before launch.",
    },
    faq: [
      { question: "Can the quote form collect photos of the project?", answer: "Yes. Homeowners can attach photos and describe the job, and requests arrive by email or, where your plan accepts web requests, in the software you already use, such as Jobber or Buildertrend." },
      { question: "Should I have a separate page for every town I work in?", answer: "Only where you have something real to say about work there, such as projects you have finished in that town. Near-identical town pages can be treated by Google as doorway pages, so we usually build one service-area page and add town pages only when they have their own content." },
      { question: "How much does a contractor website cost?", answer: "Custom design starts at $1,399 for Starter, $1,899 for Plus and $2,699 for Pro, as one-time project prices scoped in writing first. Contractors with many remodel types usually fit Plus or Pro because of the page count. Hosting is billed separately each month." },
      { question: "Do I need professional photos of my jobs?", answer: "No. Clear jobsite photos from your phone or CompanyCam work well; we pick, crop and group them by project. We do not fill your gallery with stock photos of someone else's kitchen." },
      { question: "How long does it take?", answer: "It depends on the plan and how quickly your photos, service list and license details arrive, so we do not publish a number we would have to caveat. You get a timeline with your written scope, before you commit." },
    ],
  },
  es: {
    name: "Contratistas generales y remodeladores",
    metaTitle: "Diseño web para contratistas y remodelación | Serverlys",
    metaDescription:
      "Sitios web para contratistas y remodeladores hechos por nosotros: páginas por tipo de obra, galerías, formulario de cotización y licencia. Desde $1,399.",
    h1: "Diseño web para contratistas, pensado para la solicitud de cotización",
    lede:
      "Diseñamos y construimos sitios web para contratistas generales y remodeladores: una página por cada tipo de trabajo que hace, un formulario de cotización que recibe fotos y detalles del proyecto, las ciudades donde realmente trabaja y sus datos de licencia y seguro a la vista. El diseño a medida empieza en $1,399, acordado por escrito antes de comprometerse.",
    needs: [
      { title: "Una página por cada tipo de remodelación", text: "Cocinas, baños, sótanos, ampliaciones: cada uno tiene su propia página que explica de qué se encarga usted, desde la demolición hasta los permisos y los subcontratistas, con fotos de ese tipo de trabajo." },
      { title: "Cotizaciones con los datos que necesita", text: "Un formulario que pregunta el tipo de proyecto, el código postal, un rango de presupuesto y las fechas, y permite adjuntar fotos, para que la primera llamada sea sobre la obra y no sobre lo básico." },
      { title: "El área que de verdad cubre", text: "Las ciudades y condados donde trabaja, con una línea sobre lo que queda fuera, para dejar de recibir solicitudes de dos horas de distancia." },
      { title: "Galerías ordenadas por proyecto", text: "Fotos agrupadas por obra con una nota breve sobre lo que se hizo, tomadas de su celular o de CompanyCam, en lugar de una lista larga de fotos mezcladas." },
      { title: "Licencia, seguro y garantía a la vista", text: "Su número de licencia o registro, su seguro y la garantía de mano de obra que ofrece, en el pie de página y otra vez en la página de cotización, donde el propietario los busca." },
      { title: "Cómo es una remodelación con usted", text: "Una página paso a paso, desde la visita y el estimado hasta el contrato, los permisos, la obra y la revisión final, que explica depósitos y órdenes de cambio antes de firmar." },
    ],
    pages: ["Inicio", "Servicios (una página por tipo de remodelación)", "Galería de proyectos", "Nuestro proceso", "Área de servicio", "Nosotros, licencia y seguro", "Reseñas", "Solicitar cotización"],
    integrations: ["Jobber", "Buildertrend", "Houzz Pro", "CompanyCam", "Reseñas de Google", "Perfil de Empresa en Google", "Seguimiento de llamadas"],
    rules: {
      title: "Número de licencia en la publicidad de contratistas",
      text: "Muchos estados exigen que el número de licencia o registro del contratista aparezca en su publicidad, y algunos consideran publicidad el sitio web. Mostramos los datos de licencia, registro y seguro que usted nos da donde los quiera, normalmente en el pie de página y en la página de cotización. Los requisitos cambian por estado y ciudad, así que usted confirma lo que exige el suyo y aprueba cada afirmación antes del lanzamiento.",
    },
    faq: [
      { question: "¿El formulario de cotización puede recibir fotos del proyecto?", answer: "Sí. El propietario puede adjuntar fotos y describir el trabajo, y las solicitudes llegan por correo o, si su plan acepta solicitudes desde la web, al software que ya usa, como Jobber o Buildertrend." },
      { question: "¿Debo tener una página para cada ciudad donde trabajo?", answer: "Solo donde tenga algo real que contar, como proyectos terminados en esa ciudad. Google puede tratar las páginas casi idénticas por ciudad como páginas puerta, así que normalmente hacemos una página de área de servicio y añadimos páginas por ciudad solo cuando tienen contenido propio." },
      { question: "¿Cuánto cuesta un sitio web para un contratista?", answer: "El diseño a medida empieza en $1,399 con Starter, $1,899 con Plus y $2,699 con Pro, como precios únicos de proyecto acordados por escrito primero. Los contratistas con muchos tipos de remodelación suelen necesitar Plus o Pro por el número de páginas. El hosting se cobra aparte cada mes." },
      { question: "¿Necesito fotos profesionales de mis obras?", answer: "No. Las fotos claras de la obra tomadas con su celular o con CompanyCam funcionan bien; nosotros las elegimos, recortamos y agrupamos por proyecto. No llenamos su galería con fotos de stock de la cocina de otra persona." },
      { question: "¿Cuánto tiempo tarda?", answer: "Depende del plan y de lo rápido que lleguen sus fotos, su lista de servicios y los datos de su licencia, así que no publicamos un número con letra pequeña. Recibe un calendario junto con el alcance por escrito, antes de comprometerse." },
    ],
  },
};
