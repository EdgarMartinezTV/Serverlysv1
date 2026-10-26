import type { Industry } from "./types";

export const mortgage: Industry = {
  slug: "mortgage",
  related: ["accounting", "lawyer", "consulting"],
  en: {
    name: "Mortgage brokers and loan officers",
    metaTitle: "Mortgage Broker Website Design | Serverlys",
    metaDescription:
      "Mortgage websites built for you: loan program pages, an apply-now link to your application system, NMLS IDs and Equal Housing notice shown. From $1,399.",
    h1: "Mortgage websites with the application one tap away",
    lede:
      "We design and build websites for mortgage brokers, loan officers and small lenders: a page for each loan program, an Apply now button that opens your application system, loan officer profiles with NMLS IDs, and the licensing and Equal Housing notices placed in the footer. Custom design starts at $1,399, scoped in writing first.",
    needs: [
      { title: "Apply now goes to your real application", text: "Every Apply button opens the borrower application in the point-of-sale system you already use, so applications land in your pipeline instead of a contact form you have to retype." },
      { title: "One page per loan program", text: "Conventional, FHA, VA, USDA, jumbo, refinance, first-time buyer and non-QM where you offer them, each explaining who it suits and what documents to gather, written for a borrower rather than an underwriter." },
      { title: "NMLS IDs where borrowers can check them", text: "The company NMLS ID and each loan officer's individual NMLS ID, linked to NMLS Consumer Access, along with the states you are licensed in." },
      { title: "Loan officer pages that convert referrals", text: "Each officer's photo, NMLS ID, languages, licensed states and personal application link, so a realtor can send a buyer straight to the right person." },
      { title: "Calculators without promises", text: "Payment and affordability calculators labelled as estimates, with no rates displayed unless they come with the disclosures advertising rules require." },
      { title: "Bilingual borrower guides", text: "Program pages and the pre-approval checklist in English and Spanish when your borrowers need them, each linked to its translation." },
    ],
    pages: ["Home", "Loan programs (one page each)", "Apply now", "Loan officers", "Pre-approval checklist", "Mortgage calculators", "Licensing and NMLS", "Realtor partners", "Contact"],
    integrations: ["Loan application / point-of-sale system", "Encompass", "Floify", "Arive", "Mortgage calculators", "Rate table from your pricing engine", "Calendly", "Google Business Profile"],
    rules: {
      title: "Licensing and fair lending notices",
      text: "Mortgage loan originators are licensed or registered through NMLS under the SAFE Act, and many states expect the company and individual NMLS IDs on the website. Lenders typically display an Equal Housing Lender or Equal Housing Opportunity notice. Federal rules (Regulation Z) also require extra disclosures when an ad states a rate or payment terms, so we leave rates off unless you supply compliant wording. We build to the rules you tell us apply, and you or your compliance contact approve the site before launch.",
    },
    faq: [
      { question: "Can the Apply button go to Encompass, Floify or Arive?", answer: "Yes. We link each Apply button to the application URL your system gives you, including per-officer links, so borrowers start in the system you already use. We do not build a separate application form that collects financial details on the website." },
      { question: "Can you show today's rates on the site?", answer: "Only if they come from your pricing engine or rate provider with the required APR and disclosure wording. Hand-typed rates go stale and stating a rate triggers advertising disclosures, so by default we leave rates off and point borrowers to a quote." },
      { question: "Where do the NMLS and Equal Housing notices go?", answer: "The company NMLS ID, licensed states and the Equal Housing notice go in the site-wide footer, and each officer's NMLS ID goes on their profile. If your state or company compliance team asks for specific wording or placement, we follow it." },
      { question: "How much does a mortgage website cost?", answer: "Custom design starts at $1,399 for Starter, $1,899 for Plus and $2,699 for Pro, as one-time project prices. Teams with several loan officers or many loan program pages usually fit Plus or Pro." },
      { question: "How long does it take?", answer: "It depends on the plan and on compliance review on your side, so we do not publish a number we would have to caveat. You get a timeline with your written scope, before you commit." },
    ],
  },
  es: {
    name: "Corredores hipotecarios y oficiales de préstamos",
    metaTitle: "Diseño web para corredores hipotecarios | Serverlys",
    metaDescription:
      "Sitios web hipotecarios a medida: una página por programa, botón de solicitud a su sistema, números NMLS y aviso de Equal Housing. Desde $1,399.",
    h1: "Sitios web hipotecarios con la solicitud a un toque",
    lede:
      "Diseñamos y construimos sitios web para corredores hipotecarios, oficiales de préstamos y prestamistas pequeños: una página por programa de préstamo, un botón de Solicitar que abre su sistema de solicitudes, perfiles con número NMLS y los avisos de licencia y Equal Housing en el pie de página. El diseño a medida empieza en $1,399.",
    needs: [
      { title: "Solicitar lleva a su solicitud real", text: "Cada botón de Solicitar abre la solicitud del prestatario en el sistema que ya usa, para que las solicitudes lleguen a su pipeline y no a un formulario que tiene que volver a escribir." },
      { title: "Una página por programa de préstamo", text: "Convencional, FHA, VA, USDA, jumbo, refinanciamiento, primer comprador y non-QM si los ofrece, cada uno explicando para quién es y qué documentos reunir, escrito para el comprador y no para el suscriptor." },
      { title: "Números NMLS que se pueden verificar", text: "El número NMLS de la compañía y el de cada oficial de préstamos, enlazados a NMLS Consumer Access, junto con los estados donde tiene licencia." },
      { title: "Perfiles que aprovechan los referidos", text: "La foto, el número NMLS, los idiomas, los estados con licencia y el enlace personal de solicitud de cada oficial, para que un realtor mande al comprador directo a la persona correcta." },
      { title: "Calculadoras sin promesas", text: "Calculadoras de pago y de capacidad de compra marcadas como estimados, sin tasas publicadas a menos que vayan con las divulgaciones que exigen las reglas de publicidad." },
      { title: "Guías bilingües para el comprador", text: "Páginas de programas y la lista para la preaprobación en inglés y español cuando sus clientes lo necesitan, cada una enlazada a su traducción." },
    ],
    pages: ["Inicio", "Programas de préstamo (una página cada uno)", "Solicitar", "Oficiales de préstamos", "Lista para la preaprobación", "Calculadoras hipotecarias", "Licencias y NMLS", "Para realtors", "Contacto"],
    integrations: ["Sistema de solicitud de préstamos (POS)", "Encompass", "Floify", "Arive", "Calculadoras hipotecarias", "Tabla de tasas de su motor de precios", "Calendly", "Perfil de Empresa en Google"],
    rules: {
      title: "Avisos de licencia y de préstamo justo",
      text: "Los originadores de préstamos hipotecarios tienen licencia o registro en NMLS según la Ley SAFE, y muchos estados esperan ver en el sitio los números NMLS de la compañía y de cada oficial. Los prestamistas suelen mostrar el aviso Equal Housing Lender o Equal Housing Opportunity. Las reglas federales (Regulación Z) exigen divulgaciones adicionales cuando un anuncio menciona una tasa o condiciones de pago, así que no publicamos tasas a menos que usted nos dé el texto correcto. Construimos según las reglas que usted nos indique, y usted o su responsable de cumplimiento aprueba el sitio antes del lanzamiento.",
    },
    faq: [
      { question: "¿El botón de Solicitar puede ir a Encompass, Floify o Arive?", answer: "Sí. Enlazamos cada botón a la dirección de solicitud que le da su sistema, incluidos los enlaces de cada oficial, para que el comprador empiece en el sistema que ya usa. No construimos un formulario aparte que recoja datos financieros en el sitio." },
      { question: "¿Pueden mostrar las tasas del día en el sitio?", answer: "Solo si vienen de su motor de precios o proveedor de tasas con el APR y las divulgaciones requeridas. Las tasas escritas a mano se quedan viejas y publicar una tasa activa requisitos de divulgación, así que por defecto no las mostramos y llevamos al comprador a pedir una cotización." },
      { question: "¿Dónde van los avisos de NMLS y Equal Housing?", answer: "El número NMLS de la compañía, los estados con licencia y el aviso de Equal Housing van en el pie de página de todo el sitio, y el número NMLS de cada oficial va en su perfil. Si su estado o su equipo de cumplimiento pide un texto o lugar específico, lo seguimos." },
      { question: "¿Cuánto cuesta un sitio web hipotecario?", answer: "El diseño a medida empieza en $1,399 con Starter, $1,899 con Plus y $2,699 con Pro, como precios únicos de proyecto. Los equipos con varios oficiales o muchos programas de préstamo suelen necesitar Plus o Pro." },
      { question: "¿Cuánto tiempo tarda?", answer: "Depende del plan y de la revisión de cumplimiento de su lado, así que no publicamos un número con letra pequeña. Recibe un calendario con el alcance por escrito, antes de comprometerse." },
    ],
  },
};
