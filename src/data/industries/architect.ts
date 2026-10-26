import type { Industry } from "./types";

export const architect: Industry = {
  slug: "architect",
  related: ["construction", "contractor", "landscaping"],
  en: {
    name: "Architects and architecture firms",
    metaTitle: "Architecture Firm Website Design | Serverlys",
    metaDescription:
      "Architecture websites built for you: large-image project pages, a filterable portfolio, team licensure and a project inquiry form. From $1,399.",
    h1: "Architecture websites where the projects do the talking",
    lede:
      "We design and build websites for architects and architecture firms: a portfolio of full-width project pages you can filter by type, the story and drawings behind each building, team pages with licensure stated accurately, and a project inquiry form that asks the right first questions. Custom design starts at $1,399, scoped in writing first.",
    needs: [
      { title: "Project pages built around photography", text: "Full-width images that load fast on any screen, plus room for plans, sections, sketches and a short narrative of the brief, the site and the decisions, because a gallery of thumbnails undersells built work." },
      { title: "A portfolio people can filter", text: "Projects sorted by type, such as residential, multifamily, commercial, hospitality or interiors, and by status, built or in design, so a developer and a homeowner each find relevant work quickly." },
      { title: "Photo credits and image rights", text: "A credit line for the photographer on every project, and a structure that respects the license you have for each image, since architectural photography is usually licensed rather than owned outright." },
      { title: "Licensure stated precisely", text: "Who on the team is a licensed architect and in which states, alongside designers and associates with their own titles, written the way your board expects." },
      { title: "An inquiry form for real projects", text: "Project type, location, approximate size, stage (site found, design, permitting) and timeline, so you can tell a fit from a mismatch before the first meeting." },
      { title: "Recognition and press", text: "Awards, publications and talks in one place, linked from the projects they relate to, kept to what you can show and verify." },
    ],
    pages: ["Home", "Projects (one page each)", "Portfolio by type", "Services and process", "Studio and team", "Awards and press", "Journal or news", "Start a project", "Contact"],
    integrations: ["Calendly", "HubSpot CRM", "Instagram feed", "Houzz profile", "Matterport 3D tours", "Vimeo for walkthroughs", "LinkedIn", "Google Business Profile"],
    rules: {
      title: "Who can be called an architect",
      text: "In the US, use of the title architect and the offer of architectural services are regulated by each state's licensing board: only licensed architects, and firms registered or permitted where required, may use them. Boards differ on firm names, out-of-state practice and how unlicensed staff are described. We build to the rules you tell us apply to your firm, and you approve every title and claim before launch.",
    },
    faq: [
      { question: "Can we add new projects ourselves?", answer: "Yes. Each project is a WordPress entry with its images, drawings, type and status, so adding one is filling in a template rather than designing a page. A site management plan can handle it for you instead." },
      { question: "Will large photos slow the site down?", answer: "Not if they are handled properly. Images are resized and served in modern formats for each screen size, and only the images in view load first, so full-width photography stays sharp without a slow first screen." },
      { question: "Can you show 3D tours or walkthrough videos?", answer: "Yes. Matterport tours and Vimeo or YouTube walkthroughs embed on the project page. We keep them below the main image so the page still opens quickly." },
      { question: "How much does an architecture firm website cost?", answer: "Custom design starts at $1,399 for Starter, $1,899 for Plus and $2,699 for Pro, as one-time project prices scoped in writing first. Firms with a large portfolio usually fit Plus or Pro because each project is its own page." },
      { question: "How long does it take?", answer: "It depends on the plan and how quickly project photography, drawings and team details arrive, so we do not publish a number we would have to caveat. You get a timeline with your written scope, before you commit." },
    ],
  },
  es: {
    name: "Arquitectos y estudios de arquitectura",
    metaTitle: "Diseño web para arquitectos | Serverlys",
    metaDescription:
      "Sitios web para arquitectos: proyectos con imágenes grandes, portafolio con filtros, licencias del equipo y formulario de proyecto. Desde $1,399.",
    h1: "Sitios web para arquitectos donde hablan los proyectos",
    lede:
      "Diseñamos y construimos sitios web para arquitectos y estudios de arquitectura: un portafolio con páginas de proyecto a pantalla completa que se puede filtrar por tipo, la historia y los planos detrás de cada obra, perfiles del equipo con su licencia indicada con precisión y un formulario de proyecto con las preguntas correctas. El diseño a medida empieza en $1,399.",
    needs: [
      { title: "Páginas de proyecto pensadas para la fotografía", text: "Imágenes a pantalla completa que cargan rápido en cualquier pantalla, con espacio para plantas, cortes, bocetos y un relato breve del encargo, el terreno y las decisiones, porque una galería de miniaturas no le hace justicia a la obra construida." },
      { title: "Un portafolio con filtros", text: "Proyectos por tipo, como residencial, multifamiliar, comercial, hotelero o interiores, y por estado, construido o en diseño, para que un desarrollador y un propietario encuentren rápido lo que les interesa." },
      { title: "Créditos y derechos de las fotos", text: "El crédito del fotógrafo en cada proyecto y una estructura que respeta la licencia de cada imagen, ya que la fotografía de arquitectura normalmente se licencia y no se compra." },
      { title: "Licencias indicadas con precisión", text: "Quién en el equipo es arquitecto con licencia y en qué estados, junto a diseñadores y asociados con sus propios títulos, escrito como lo espera su junta estatal." },
      { title: "Un formulario para proyectos reales", text: "Tipo de proyecto, ubicación, tamaño aproximado, etapa (terreno, diseño, permisos) y plazo, para distinguir un buen proyecto de uno que no encaja antes de la primera reunión." },
      { title: "Premios y prensa", text: "Premios, publicaciones y conferencias en un solo lugar, enlazados desde los proyectos correspondientes, limitados a lo que puede mostrar y comprobar." },
    ],
    pages: ["Inicio", "Proyectos (una página cada uno)", "Portafolio por tipo", "Servicios y proceso", "Estudio y equipo", "Premios y prensa", "Noticias", "Iniciar un proyecto", "Contacto"],
    integrations: ["Calendly", "HubSpot CRM", "Feed de Instagram", "Perfil de Houzz", "Recorridos 3D de Matterport", "Vimeo para recorridos en video", "LinkedIn", "Perfil de Empresa en Google"],
    rules: {
      title: "Quién puede llamarse arquitecto",
      text: "En EE. UU., el uso del título de arquitecto y la oferta de servicios de arquitectura están regulados por la junta de licencias de cada estado: solo pueden usarlos los arquitectos con licencia y las firmas registradas o autorizadas donde se exige. Las juntas difieren en nombres de firmas, ejercicio en otros estados y cómo se describe al personal sin licencia. Construimos según las reglas que usted nos indique, y usted aprueba cada título y afirmación antes del lanzamiento.",
    },
    faq: [
      { question: "¿Podemos agregar proyectos nuevos nosotros mismos?", answer: "Sí. Cada proyecto es una entrada de WordPress con sus imágenes, planos, tipo y estado, así que agregar uno es llenar una plantilla, no diseñar una página. Si prefiere, un plan de mantenimiento lo hace por usted." },
      { question: "¿Las fotos grandes harán lento el sitio?", answer: "No, si se manejan bien. Las imágenes se redimensionan y se sirven en formatos modernos para cada tamaño de pantalla, y primero cargan solo las que están a la vista, así que la fotografía a pantalla completa se ve nítida sin una primera pantalla lenta." },
      { question: "¿Pueden mostrar recorridos 3D o videos?", answer: "Sí. Los recorridos de Matterport y los videos de Vimeo o YouTube se integran en la página del proyecto. Los colocamos debajo de la imagen principal para que la página siga abriendo rápido." },
      { question: "¿Cuánto cuesta un sitio web para un estudio de arquitectura?", answer: "El diseño a medida empieza en $1,399 con Starter, $1,899 con Plus y $2,699 con Pro, como precios únicos de proyecto acordados por escrito primero. Los estudios con un portafolio grande suelen necesitar Plus o Pro porque cada proyecto es una página." },
      { question: "¿Cuánto tiempo tarda?", answer: "Depende del plan y de lo rápido que lleguen las fotos, los planos y los datos del equipo, así que no publicamos un número con letra pequeña. Recibe un calendario con el alcance por escrito, antes de comprometerse." },
    ],
  },
};
