import type { Industry } from "./types";

export const consulting: Industry = {
  slug: "consulting",
  related: ["accounting", "coaching", "lawyer"],
  en: {
    name: "Consultants and consulting firms",
    metaTitle: "Consulting Firm Website Design | Serverlys",
    metaDescription:
      "Consulting websites built for you: clear service offers, case studies cleared with clients, consultant bios and discovery-call booking. From $1,399.",
    h1: "Consulting websites that explain what you actually fix",
    lede:
      "We design and build websites for independent consultants and small consulting firms: service pages that name the problem you solve and how an engagement runs, case studies your clients have cleared, consultant bios, and a discovery-call booking link. Custom design starts at $1,399, scoped in writing before you commit.",
    needs: [
      { title: "Offers a buyer can picture", text: "Each service described as an engagement: the problem, who it is for, what you deliver, how long it usually runs and how it is priced (project, retainer or day rate), so a prospect knows what they are booking a call about." },
      { title: "Case studies without breaking an NDA", text: "A case study format that works named or anonymized: industry, starting situation, what you did and what changed, with numbers only where the client has agreed to them being published." },
      { title: "Bios that show the expertise", text: "Each consultant's background, industries, certifications and prior roles, written for the executive who has to justify hiring you to someone else." },
      { title: "Discovery calls, pre-qualified", text: "A booking link with a few short questions first, company size, the problem and the timeframe, so the first call starts with context instead of introductions." },
      { title: "Thinking you can point people to", text: "A home for articles, frameworks, talks and downloadable guides, tagged by topic, so the site does the explaining before a proposal does." },
      { title: "Proposal-ready credibility", text: "A clean page with your methodology, the industries you serve and how you work with in-house teams, which a champion inside the client can forward to a decision-maker." },
    ],
    pages: ["Home", "Services or engagements (one page each)", "Industries served", "Case studies", "About and team", "Insights or articles", "Speaking", "Book a discovery call", "Contact"],
    integrations: ["Calendly", "HubSpot CRM", "Zoom", "PandaDoc", "DocuSign", "LinkedIn", "Kit (ConvertKit) or Mailchimp", "Google Business Profile"],
    rules: {
      title: "Case studies, logos and testimonials",
      text: "Client names, logos and results usually need the client's written permission, and many consulting contracts restrict them. Under the FTC's Endorsement Guides, testimonials must reflect real experience and must not imply typical results that are not typical. We publish only what you confirm you are allowed to, and you approve every claim before launch.",
    },
    faq: [
      { question: "Can you build case studies if our clients are under NDA?", answer: "Yes. We use an anonymized format, for example a regional healthcare network, with the problem, the approach and the outcome described in words. Named clients, logos and figures go on only once you confirm the client has agreed." },
      { question: "Should we publish our prices?", answer: "That is your call. Some consultants publish starting prices or fixed-scope packages; others explain how pricing works (project, retainer or day rate) without figures. We design the service pages for either." },
      { question: "Can discovery calls feed into our CRM?", answer: "Yes. Calendly and HubSpot both connect to a website booking link or form, so new inquiries appear as contacts in your CRM with the answers they gave." },
      { question: "How much does a consulting website cost?", answer: "Custom design starts at $1,399 for Starter, $1,899 for Plus and $2,699 for Pro, as one-time project prices scoped in writing first. Firms with many service lines or a large article library usually fit Plus or Pro." },
      { question: "How long does it take?", answer: "It depends on the plan and how quickly bios, case studies and approvals come back, so we do not publish a number we would have to caveat. You get a timeline with your written scope." },
    ],
  },
  es: {
    name: "Consultores y firmas de consultoría",
    metaTitle: "Diseño web para consultores | Serverlys",
    metaDescription:
      "Sitios web para consultores: servicios claros, casos de éxito aprobados por el cliente, perfiles del equipo y llamadas iniciales. Desde $1,399.",
    h1: "Sitios web para consultores que explican qué problema resuelven",
    lede:
      "Diseñamos y construimos sitios web para consultores independientes y firmas pequeñas: páginas de servicios que nombran el problema que resuelve y cómo funciona un proyecto, casos de éxito aprobados por sus clientes, perfiles del equipo y un enlace para agendar una llamada inicial. El diseño a medida empieza en $1,399, acordado por escrito.",
    needs: [
      { title: "Servicios que el cliente puede imaginar", text: "Cada servicio descrito como un proyecto: el problema, para quién es, qué entrega, cuánto suele durar y cómo se cobra (por proyecto, por iguala mensual o por día), para que el prospecto sepa de qué trata la llamada." },
      { title: "Casos de éxito sin romper un NDA", text: "Un formato de caso que funciona con nombre o anónimo: sector, situación inicial, lo que usted hizo y lo que cambió, con cifras solo cuando el cliente aceptó que se publiquen." },
      { title: "Perfiles que muestran la experiencia", text: "La trayectoria, los sectores, las certificaciones y los cargos anteriores de cada consultor, escritos para el ejecutivo que tiene que justificar ante otros por qué lo contrata." },
      { title: "Llamadas iniciales con contexto", text: "Un enlace para agendar con unas preguntas breves antes, tamaño de la empresa, el problema y el plazo, para que la primera llamada empiece con contexto y no con presentaciones." },
      { title: "Ideas a las que puede remitir", text: "Un lugar para artículos, metodologías, charlas y guías descargables, organizados por tema, para que el sitio explique antes de que lo haga una propuesta." },
      { title: "Credibilidad lista para la propuesta", text: "Una página con su metodología, los sectores que atiende y cómo trabaja con los equipos internos, que su contacto dentro del cliente puede reenviar a quien decide." },
    ],
    pages: ["Inicio", "Servicios o proyectos (una página cada uno)", "Sectores", "Casos de éxito", "Nosotros y equipo", "Artículos", "Conferencias", "Agendar una llamada inicial", "Contacto"],
    integrations: ["Calendly", "HubSpot CRM", "Zoom", "PandaDoc", "DocuSign", "LinkedIn", "Kit (ConvertKit) o Mailchimp", "Perfil de Empresa en Google"],
    rules: {
      title: "Casos de éxito, logotipos y testimonios",
      text: "Los nombres, logotipos y resultados de sus clientes normalmente requieren permiso por escrito, y muchos contratos de consultoría los limitan. Según las Guías de Respaldos de la FTC, los testimonios deben reflejar experiencias reales y no pueden dar a entender resultados típicos que no lo son. Publicamos solo lo que usted confirma que tiene permitido, y usted aprueba cada afirmación antes del lanzamiento.",
    },
    faq: [
      { question: "¿Pueden hacer casos de éxito si nuestros clientes tienen NDA?", answer: "Sí. Usamos un formato anónimo, por ejemplo una red regional de clínicas, con el problema, el enfoque y el resultado descritos en palabras. Los nombres, logotipos y cifras se publican solo cuando usted confirma que el cliente lo aceptó." },
      { question: "¿Debemos publicar nuestros precios?", answer: "Es decisión suya. Algunos consultores publican precios desde o paquetes de alcance fijo; otros explican cómo cobran (por proyecto, iguala o día) sin cifras. Diseñamos las páginas de servicios para cualquiera de los dos casos." },
      { question: "¿Las llamadas iniciales pueden llegar a nuestro CRM?", answer: "Sí. Calendly y HubSpot se conectan a un enlace de citas o formulario del sitio, para que las consultas nuevas aparezcan como contactos en su CRM con las respuestas que dieron." },
      { question: "¿Cuánto cuesta un sitio web para una consultora?", answer: "El diseño a medida empieza en $1,399 con Starter, $1,899 con Plus y $2,699 con Pro, como precios únicos de proyecto acordados por escrito primero. Las firmas con muchas líneas de servicio o muchos artículos suelen necesitar Plus o Pro." },
      { question: "¿Cuánto tiempo tarda?", answer: "Depende del plan y de lo rápido que lleguen los perfiles, los casos y las aprobaciones, así que no publicamos un número con letra pequeña. Recibe un calendario con el alcance por escrito." },
    ],
  },
};
