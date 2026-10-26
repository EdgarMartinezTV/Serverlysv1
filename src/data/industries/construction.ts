import type { Industry } from "./types";

export const construction: Industry = {
  slug: "construction",
  related: ["contractor", "architect", "electrician"],
  en: {
    name: "Construction companies",
    metaTitle: "Construction Company Website Design | Serverlys",
    metaDescription:
      "Construction company websites built for you: a project portfolio by sector, capabilities, safety and a bid invitation path for owners and GCs. From $1,399.",
    h1: "Construction website design that shows what you have built",
    lede:
      "We design and build websites for construction companies and builders: a project portfolio sorted by sector, a capabilities page owners and general contractors can scan quickly, your safety program, and a clear path for bid invitations and RFPs. Custom design starts at $1,399, scoped in writing before you commit.",
    needs: [
      { title: "Projects sorted by sector", text: "Commercial, multifamily, healthcare, education, custom homes: each project shows location, scope, size, delivery method such as design-build or CM at risk, and your role on it." },
      { title: "Capabilities an owner can scan", text: "Self-perform trades, project size range and the regions you build in, stated as you give them, plus a downloadable capabilities statement for prequalification packages." },
      { title: "Bids and RFPs that reach the right inbox", text: "A bid invitation form for owners and GCs that asks project name, location, bid date and a plans link, and a separate form for subcontractors and suppliers who want on your bid list." },
      { title: "A safety record you can back up", text: "Your safety program, training and certifications, and figures such as EMR or incident rates only if you choose to publish them and supply them to us." },
      { title: "Commercial and residential kept apart", text: "Separate paths for owners and homeowners, so someone planning a custom home does not have to scroll past a parking structure to find what they need." },
      { title: "Careers for crews and project managers", text: "Open roles, what working with you looks like and an application form, because many builders use their site to recruit as much as to win work." },
    ],
    pages: ["Home", "Projects (filter by sector)", "Commercial construction", "Residential construction", "Capabilities and services", "Safety", "Bid invitations and subcontractor prequalification", "Careers", "About and contact"],
    integrations: ["BuildingConnected", "Procore", "CompanyCam", "Online job applications", "LinkedIn", "Google Business Profile"],
    rules: {
      title: "Licensing, bonding and safety claims",
      text: "Many states require a contractor's license number on advertising, including websites, and public owners often check licensing, bonding and insurance during prequalification. We display the license, bonding and insurance details you give us, and publish safety figures only as you supply them. Rules differ by state, so you confirm the requirements and approve every claim before launch.",
    },
    faq: [
      { question: "Can owners and GCs send us bid invitations through the site?", answer: "Yes. We build a bid invitation form that asks for project name, location, bid date and a link to plans, and a separate prequalification form for subcontractors and suppliers. Submissions arrive by email, and we can link to your BuildingConnected profile if you bid through it." },
      { question: "Can we show projects without naming the client?", answer: "Yes. Some contracts limit publicity, so projects can be shown by sector, size and city, with the owner named only where you have permission. You approve every project page before it goes live." },
      { question: "Should commercial and residential work be on one site?", answer: "Usually one site with two clearly separate sections works best: one domain to maintain, and each audience lands on its own pages. If the two sides run as separate brands, we can scope two sites instead." },
      { question: "How much does a construction company website cost?", answer: "Custom design starts at $1,399 for Starter, $1,899 for Plus and $2,699 for Pro, as one-time project prices scoped in writing first. A large project portfolio usually fits Plus or Pro. Hosting is billed separately each month." },
      { question: "Can the site connect to Procore?", answer: "The website does not replace your project management software. We can link to the client or partner portals you already use, such as Procore, so the people you invite know where to log in." },
    ],
  },
  es: {
    name: "Empresas de construcción",
    metaTitle: "Diseño web para empresas de construcción | Serverlys",
    metaDescription:
      "Sitios web para constructoras hechos por nosotros: portafolio de proyectos por sector, capacidades, seguridad e invitaciones a licitar. Desde $1,399.",
    h1: "Diseño web para constructoras que muestra lo que ha construido",
    lede:
      "Diseñamos y construimos sitios web para empresas de construcción y constructores: un portafolio de proyectos ordenado por sector, una página de capacidades que propietarios y contratistas generales revisan rápido, su programa de seguridad y un camino claro para invitaciones a licitar y RFP. El diseño a medida empieza en $1,399, acordado por escrito antes de comprometerse.",
    needs: [
      { title: "Proyectos ordenados por sector", text: "Comercial, multifamiliar, salud, educación, casas a medida: cada proyecto muestra ubicación, alcance, tamaño, método de entrega como diseño-construcción o CM at risk, y su papel en él." },
      { title: "Capacidades que un propietario revisa rápido", text: "Los oficios que realiza con su propio personal, el rango de tamaño de proyectos y las regiones donde construye, tal como nos los indica, más una ficha de capacidades descargable para precalificaciones." },
      { title: "Licitaciones y RFP que llegan al buzón correcto", text: "Un formulario de invitación a licitar para propietarios y contratistas generales que pide nombre del proyecto, ubicación, fecha de licitación y enlace a planos, y otro para subcontratistas y proveedores que quieren entrar en su lista." },
      { title: "Un historial de seguridad que puede respaldar", text: "Su programa de seguridad, capacitación y certificaciones, y cifras como el EMR o las tasas de incidentes solo si decide publicarlas y nos las proporciona." },
      { title: "Comercial y residencial por separado", text: "Caminos distintos para propietarios comerciales y dueños de casa, para que quien planea una casa a medida no tenga que pasar por un estacionamiento de varios pisos para encontrar lo suyo." },
      { title: "Empleo para cuadrillas y gerentes de proyecto", text: "Puestos abiertos, cómo es trabajar con usted y un formulario de solicitud, porque muchas constructoras usan su sitio tanto para reclutar como para conseguir obras." },
    ],
    pages: ["Inicio", "Proyectos (filtro por sector)", "Construcción comercial", "Construcción residencial", "Capacidades y servicios", "Seguridad", "Invitaciones a licitar y precalificación de subcontratistas", "Empleo", "Nosotros y contacto"],
    integrations: ["BuildingConnected", "Procore", "CompanyCam", "Solicitudes de empleo en línea", "LinkedIn", "Perfil de Empresa en Google"],
    rules: {
      title: "Licencias, fianzas y afirmaciones de seguridad",
      text: "Muchos estados exigen el número de licencia del contratista en su publicidad, incluido el sitio web, y los propietarios públicos suelen revisar licencias, fianzas y seguros durante la precalificación. Mostramos los datos de licencia, fianza y seguro que usted nos da, y publicamos cifras de seguridad solo tal como nos las entrega. Las reglas cambian por estado, así que usted confirma los requisitos y aprueba cada afirmación antes del lanzamiento.",
    },
    faq: [
      { question: "¿Los propietarios y contratistas generales pueden invitarnos a licitar desde el sitio?", answer: "Sí. Creamos un formulario de invitación que pide nombre del proyecto, ubicación, fecha de licitación y enlace a los planos, y otro de precalificación para subcontratistas y proveedores. Los envíos llegan por correo, y podemos enlazar su perfil de BuildingConnected si licita por ahí." },
      { question: "¿Podemos mostrar proyectos sin nombrar al cliente?", answer: "Sí. Algunos contratos limitan la publicidad, así que los proyectos pueden mostrarse por sector, tamaño y ciudad, con el nombre del propietario solo donde tenga permiso. Usted aprueba cada página de proyecto antes de publicarla." },
      { question: "¿Lo comercial y lo residencial deben ir en un mismo sitio?", answer: "Normalmente funciona mejor un solo sitio con dos secciones bien separadas: un dominio que mantener y cada público llega a sus propias páginas. Si las dos áreas funcionan como marcas distintas, podemos cotizar dos sitios." },
      { question: "¿Cuánto cuesta un sitio web para una constructora?", answer: "El diseño a medida empieza en $1,399 con Starter, $1,899 con Plus y $2,699 con Pro, como precios únicos de proyecto acordados por escrito primero. Un portafolio grande suele necesitar Plus o Pro. El hosting se cobra aparte cada mes." },
      { question: "¿El sitio se puede conectar a Procore?", answer: "El sitio web no reemplaza su software de gestión de proyectos. Podemos enlazar los portales para clientes o socios que ya usa, como Procore, para que las personas que invita sepan dónde entrar." },
    ],
  },
};
