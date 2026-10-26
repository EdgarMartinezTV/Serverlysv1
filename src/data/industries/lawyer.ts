import type { Industry } from "./types";

export const lawyer: Industry = {
  slug: "lawyer",
  related: ["accounting", "consulting", "mortgage"],
  en: {
    name: "Law firms and attorneys",
    metaTitle: "Law Firm Website Design for Attorneys | Serverlys",
    metaDescription:
      "Law firm websites built for you: practice-area pages, attorney bios, secure intake forms and advertising disclaimers handled. Custom design from $1,399.",
    h1: "Law firm website design that earns the first call",
    lede:
      "We design and build websites for law firms and solo attorneys: a page for each practice area, attorney bios with bar admissions, an intake form that asks the right questions, and the disclaimers attorney advertising rules expect. Custom design starts at $1,399, scoped in writing before you commit.",
    needs: [
      { title: "A page for every practice area", text: "Personal injury, family, immigration, estate planning: each area gets its own page explaining who you help and what happens next, because that is what people search for." },
      { title: "Attorney bios that build trust", text: "Each attorney's photo, bar admissions, education, languages spoken and areas of practice, written to be read by a worried client, not a hiring committee." },
      { title: "Intake that screens for you", text: "A consultation form that asks the case type, dates and contact preferences up front, with a clear note not to send confidential details before an attorney-client relationship exists." },
      { title: "Disclaimers in the right places", text: "'No attorney-client relationship', 'past results do not guarantee future outcomes' and any 'Attorney Advertising' label your state requires, placed where the rules expect them." },
      { title: "Bilingual from the start", text: "Practice-area and intake pages in English and Spanish when your clients need them, with each language reachable from the other." },
      { title: "Calls first on mobile", text: "Tap-to-call in the header and on every practice-area page, because many legal clients would rather talk than type." },
    ],
    pages: ["Home", "Practice areas (one page each)", "Attorneys", "Case results or testimonials (where your state allows)", "Free consultation", "FAQ", "Blog or legal guides", "Contact and office locations"],
    integrations: ["Clio Grow", "MyCase", "Lawmatics", "Calendly", "Google Business Profile", "Call tracking"],
    rules: {
      title: "Attorney advertising rules",
      text: "Law firm websites are attorney advertising. Most US states follow ABA Model Rules 7.1–7.3: no false or misleading statements, care with case results and testimonials, and some states require an 'Attorney Advertising' label or a responsible attorney's name. Rules differ by state, so we build to your bar's requirements and you approve every claim before launch.",
    },
    faq: [
      { question: "Will my website follow my state bar's advertising rules?", answer: "We build in the standard disclaimers and place them where the rules expect, and we follow your bar's specific requirements once you tell us your state. You review and approve every claim, result and testimonial before the site goes live; the final call on compliance is yours." },
      { question: "Can the intake form connect to my practice management software?", answer: "Yes, where the software accepts web leads. Clio Grow, MyCase and Lawmatics all have intake forms or integrations we can connect, so new inquiries arrive where you already work." },
      { question: "How much does a law firm website cost?", answer: "Custom design starts at $1,399 for Starter, $1,899 for Plus and $2,699 for Pro, as one-time project prices. Firms with many practice areas usually fit Plus or Pro because of the page count." },
      { question: "Do you write the practice-area content?", answer: "We structure each page and can draft it from your notes, but legal content needs your review. Nothing goes live without an attorney approving it." },
      { question: "Can you build the site in English and Spanish?", answer: "Yes. We build bilingual sites with each page linked to its translation, which also tells Google which version to show to which searcher." },
    ],
  },
  es: {
    name: "Bufetes y abogados",
    metaTitle: "Diseño web para abogados y bufetes | Serverlys",
    metaDescription:
      "Sitios web para bufetes hechos por nosotros: páginas por área de práctica, perfiles de abogados, formularios de consulta y avisos legales. Desde $1,399.",
    h1: "Diseño web para abogados que gana la primera llamada",
    lede:
      "Diseñamos y construimos sitios web para bufetes y abogados independientes: una página por área de práctica, perfiles con admisiones al colegio de abogados, un formulario de consulta con las preguntas correctas y los avisos que exigen las reglas de publicidad. El diseño a medida empieza en $1,399, acordado por escrito antes de comprometerse.",
    needs: [
      { title: "Una página por área de práctica", text: "Lesiones personales, familia, inmigración, herencias: cada área tiene su propia página que explica a quién ayuda y qué pasa después, porque eso es lo que la gente busca." },
      { title: "Perfiles que generan confianza", text: "La foto de cada abogado, sus admisiones, estudios, idiomas y áreas de práctica, escritos para un cliente preocupado, no para un comité de contratación." },
      { title: "Un formulario que filtra por usted", text: "Un formulario de consulta que pregunta el tipo de caso, las fechas y cómo contactar, con un aviso claro de no enviar información confidencial antes de que exista una relación abogado-cliente." },
      { title: "Avisos en el lugar correcto", text: "'No se crea una relación abogado-cliente', 'resultados anteriores no garantizan resultados futuros' y la etiqueta de 'Publicidad de abogados' si su estado la exige, colocados donde las reglas los esperan." },
      { title: "Bilingüe desde el principio", text: "Páginas de áreas de práctica y de consulta en inglés y español cuando sus clientes lo necesitan, con cada idioma enlazado al otro." },
      { title: "Primero la llamada en el celular", text: "Llamar con un toque en el encabezado y en cada página de práctica, porque muchos clientes prefieren hablar a escribir." },
    ],
    pages: ["Inicio", "Áreas de práctica (una página cada una)", "Abogados", "Resultados o testimonios (donde su estado lo permita)", "Consulta gratuita", "Preguntas frecuentes", "Blog o guías legales", "Contacto y oficinas"],
    integrations: ["Clio Grow", "MyCase", "Lawmatics", "Calendly", "Perfil de Empresa en Google", "Seguimiento de llamadas"],
    rules: {
      title: "Reglas de publicidad para abogados",
      text: "El sitio web de un bufete es publicidad de abogados. La mayoría de los estados de EE. UU. siguen las Reglas Modelo 7.1–7.3 de la ABA: nada falso ni engañoso, cuidado con resultados y testimonios, y algunos estados exigen la etiqueta 'Publicidad de abogados' o el nombre del abogado responsable. Las reglas cambian por estado, así que construimos según su colegio y usted aprueba cada afirmación antes del lanzamiento.",
    },
    faq: [
      { question: "¿Mi sitio seguirá las reglas de publicidad de mi estado?", answer: "Incluimos los avisos habituales en los lugares que las reglas esperan y seguimos los requisitos específicos de su colegio cuando nos indica su estado. Usted revisa y aprueba cada afirmación, resultado y testimonio antes de publicar; la decisión final sobre el cumplimiento es suya." },
      { question: "¿El formulario se puede conectar a mi software de gestión?", answer: "Sí, si el software acepta contactos desde la web. Clio Grow, MyCase y Lawmatics tienen formularios o integraciones que podemos conectar, para que las consultas lleguen donde ya trabaja." },
      { question: "¿Cuánto cuesta un sitio web para un bufete?", answer: "El diseño a medida empieza en $1,399 con Starter, $1,899 con Plus y $2,699 con Pro, como precios únicos de proyecto. Los bufetes con muchas áreas de práctica suelen necesitar Plus o Pro por el número de páginas." },
      { question: "¿Ustedes escriben el contenido de las áreas de práctica?", answer: "Estructuramos cada página y podemos redactarla a partir de sus notas, pero el contenido legal necesita su revisión. Nada se publica sin la aprobación de un abogado." },
      { question: "¿Pueden hacer el sitio en inglés y español?", answer: "Sí. Construimos sitios bilingües con cada página enlazada a su traducción, lo que además le indica a Google qué versión mostrar a cada persona." },
    ],
  },
};
