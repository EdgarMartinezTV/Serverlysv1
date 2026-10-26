import type { Industry } from "./types";

export const accounting: Industry = {
  slug: "accounting",
  related: ["lawyer", "consulting", "mortgage"],
  en: {
    name: "Accountants and tax firms",
    metaTitle: "Accounting & CPA Firm Website Design | Serverlys",
    metaDescription:
      "Websites for accountants and tax firms, built for you: service pages, a secure client portal link, tax-season booking and staff credentials. From $1,399.",
    h1: "Accounting firm websites that send documents to the portal, not the inbox",
    lede:
      "We design and build websites for CPA firms, tax preparers and bookkeepers: a page for each service, staff credentials, booking for tax-season appointments and a clear path to your secure client portal, so returns never arrive as email attachments. Custom design starts at $1,399, scoped in writing before you commit.",
    needs: [
      { title: "The portal, one click away", text: "A Client login button in the header that opens TaxDome, Canopy, SmartVault or whichever portal you use, plus a plain instruction on every contact page: send W-2s, 1099s and returns through the portal, never by email." },
      { title: "Services split the way clients search", text: "Individual tax returns, business returns, bookkeeping, payroll, IRS notices and advisory each get their own page, so a business owner with a payroll question does not land on a page about personal 1040s." },
      { title: "Credentials stated precisely", text: "Each person's designation as it actually stands, CPA, EA, PTIN holder or bookkeeper, with the state of licensure where it applies, because the difference matters to clients and to regulators." },
      { title: "Tax-season booking", text: "An appointment link with separate meeting types for new clients, returning clients and drop-off, so January to April scheduling does not run through your phone line." },
      { title: "Deadlines and checklists", text: "A document checklist for new clients and a page of filing deadlines and extension dates you can update each year, which answers the questions your staff otherwise answer by phone." },
      { title: "An intake form that does not ask for SSNs", text: "A new-client inquiry form that collects only the service needed, entity type and contact details; anything sensitive is collected later, inside the portal." },
    ],
    pages: ["Home", "Services (one page each)", "Who we serve", "Our team and credentials", "New client checklist", "Tax deadlines", "Client portal login", "Book an appointment", "Contact"],
    integrations: ["TaxDome", "Canopy", "SmartVault", "QuickBooks Online", "Xero", "Calendly", "Google Business Profile"],
    rules: {
      title: "Tax practitioner advertising and client data",
      text: "If you practice before the IRS, Treasury Circular 230 (§10.30) bars false, misleading or deceptive statements in your advertising and sets conditions on publishing fees, and state boards control who may use the title CPA. Client tax documents should go through a secure portal, not email or a contact form. We build to the rules you tell us apply and you approve every claim before launch; compliance stays your call.",
    },
    faq: [
      { question: "Can clients upload tax documents through the website?", answer: "We do not collect tax documents through website forms or email. We link your site to the secure portal you already use, such as TaxDome, Canopy or SmartVault, and make that link easy to find. If you do not have a portal yet, choose one first and we will connect it." },
      { question: "Can you show our fees on the site?", answer: "Yes, if you want to. Many firms publish starting fees for common returns. Circular 230 sets conditions on fee information published by IRS practitioners, so you decide what is shown and approve the wording." },
      { question: "How much does an accounting firm website cost?", answer: "Custom design starts at $1,399 for Starter, $1,899 for Plus and $2,699 for Pro, as one-time project prices scoped in writing first. Hosting is billed separately each month." },
      { question: "Can we update deadlines and checklists ourselves each year?", answer: "Yes. The site is built on WordPress and those pages are plain editable content. If you would rather we do it before each season, a site management plan covers it." },
      { question: "How long does it take?", answer: "It depends on the plan and how quickly bios, service details and portal links arrive, so we do not publish a number we would have to caveat. You get a timeline with your written scope; tell us if you need to launch before tax season." },
    ],
  },
  es: {
    name: "Contadores y oficinas de impuestos",
    metaTitle: "Diseño web para contadores y CPAs | Serverlys",
    metaDescription:
      "Sitios web para contadores y oficinas de impuestos: servicios, enlace al portal seguro de clientes y citas en temporada de impuestos. Desde $1,399.",
    h1: "Sitios web para contadores que llevan los documentos al portal, no al correo",
    lede:
      "Diseñamos y construimos sitios web para firmas de CPA, preparadores de impuestos y tenedores de libros: una página por servicio, las credenciales del equipo, citas para la temporada de impuestos y un camino claro a su portal seguro, para que las declaraciones nunca lleguen como adjuntos de correo. El diseño a medida empieza en $1,399.",
    needs: [
      { title: "El portal, a un clic", text: "Un botón de Acceso de clientes en el encabezado que abre TaxDome, Canopy, SmartVault o el portal que usted use, y una instrucción clara en cada página de contacto: los W-2, 1099 y declaraciones se envían por el portal, nunca por correo." },
      { title: "Servicios separados como los busca el cliente", text: "Impuestos personales, impuestos de negocios, contabilidad, nómina, cartas del IRS y asesoría tienen cada uno su página, para que el dueño de un negocio con una duda de nómina no termine leyendo sobre el formulario 1040." },
      { title: "Credenciales dichas con precisión", text: "La designación real de cada persona, CPA, EA, preparador con PTIN o tenedor de libros, con el estado de licencia cuando aplica, porque la diferencia les importa a los clientes y a los reguladores." },
      { title: "Citas para la temporada de impuestos", text: "Un enlace de citas con tipos distintos para clientes nuevos, clientes que regresan y entrega de documentos, para que la agenda de enero a abril no dependa del teléfono." },
      { title: "Fechas límite y listas de documentos", text: "Una lista de documentos para clientes nuevos y una página de fechas de presentación y prórrogas que puede actualizar cada año, y que responde lo que su equipo hoy contesta por teléfono." },
      { title: "Un formulario que no pide el Seguro Social", text: "Un formulario para clientes nuevos que solo pide el servicio, el tipo de entidad y los datos de contacto; todo lo sensible se recoge después, dentro del portal." },
    ],
    pages: ["Inicio", "Servicios (una página cada uno)", "A quién servimos", "Equipo y credenciales", "Lista para clientes nuevos", "Fechas límite de impuestos", "Acceso al portal de clientes", "Hacer una cita", "Contacto"],
    integrations: ["TaxDome", "Canopy", "SmartVault", "QuickBooks Online", "Xero", "Calendly", "Perfil de Empresa en Google"],
    rules: {
      title: "Publicidad de profesionales de impuestos y datos de clientes",
      text: "Si usted ejerce ante el IRS, la Circular 230 del Tesoro (§10.30) prohíbe afirmaciones falsas, engañosas o confusas en su publicidad y pone condiciones a la publicación de honorarios, y las juntas estatales controlan quién puede usar el título de CPA. Los documentos de impuestos deben ir por un portal seguro, no por correo ni por un formulario. Construimos según las reglas que usted nos indique y usted aprueba cada afirmación antes del lanzamiento; el cumplimiento sigue siendo decisión suya.",
    },
    faq: [
      { question: "¿Los clientes pueden subir sus documentos de impuestos por el sitio web?", answer: "No recogemos documentos de impuestos por formularios del sitio ni por correo. Conectamos su sitio al portal seguro que ya usa, como TaxDome, Canopy o SmartVault, y hacemos que el enlace sea fácil de encontrar. Si todavía no tiene portal, elija uno primero y lo conectamos." },
      { question: "¿Pueden mostrar nuestros honorarios en el sitio?", answer: "Sí, si usted quiere. Muchas oficinas publican precios desde para las declaraciones más comunes. La Circular 230 pone condiciones a la información de honorarios que publican quienes ejercen ante el IRS, así que usted decide qué se muestra y aprueba el texto." },
      { question: "¿Cuánto cuesta un sitio web para una oficina de contabilidad?", answer: "El diseño a medida empieza en $1,399 con Starter, $1,899 con Plus y $2,699 con Pro, como precios únicos de proyecto acordados por escrito primero. El hosting se cobra aparte cada mes." },
      { question: "¿Podemos actualizar las fechas y las listas nosotros cada año?", answer: "Sí. El sitio está hecho en WordPress y esas páginas son contenido que se edita fácilmente. Si prefiere que lo hagamos nosotros antes de cada temporada, un plan de mantenimiento lo incluye." },
      { question: "¿Cuánto tiempo tarda?", answer: "Depende del plan y de lo rápido que lleguen los perfiles, los servicios y los enlaces del portal, así que no publicamos un número con letra pequeña. Recibe un calendario con el alcance por escrito; díganos si necesita lanzar antes de la temporada de impuestos." },
    ],
  },
};
