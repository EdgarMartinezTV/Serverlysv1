import type { Industry } from "./types";

export const roofing: Industry = {
  slug: "roofing",
  related: ["contractor", "construction", "handyman"],
  en: {
    name: "Roofing companies",
    metaTitle: "Roofing Website Design for Roofers | Serverlys",
    metaDescription:
      "Roofing websites built for you: storm-damage inspection requests, roof type pages, before-and-after photos, financing and license details. From $1,399.",
    h1: "Roofing website design for repairs, replacements and storm season",
    lede:
      "We design and build websites for roofing companies: an inspection request that still works the morning after a storm, a page for each roof type you install, before-and-after photos from your own jobs, financing information, and the license and insurance details homeowners check first. Custom design starts at $1,399, scoped in writing before you commit.",
    needs: [
      { title: "Inspection requests after a storm", text: "A short form for address, damage type (hail, wind, a leak), photos and whether a claim is already filed, plus a storm banner you can switch on after a hail or wind event." },
      { title: "Insurance claims, explained honestly", text: "A page that walks through how a claim works with you, from inspection and photo documentation to meeting the adjuster, without promising approval or offering to cover deductibles, which several states prohibit." },
      { title: "A page for each roof type", text: "Asphalt shingle, metal, tile, flat roofs such as TPO: what you install, what each costs to maintain, and the manufacturer certifications you actually hold." },
      { title: "Before-and-after from your own roofs", text: "Photos from CompanyCam or your phone, grouped by job with the street address left out, so homeowners see your crews' work rather than stock rooftops." },
      { title: "Financing shown the right way", text: "A financing page that links to your lender's application, with monthly payment examples only when the provider supplies the terms that must sit next to them." },
      { title: "Warranties people can compare", text: "Manufacturer and workmanship warranties explained side by side, with what each covers and for how long, as you offer them." },
    ],
    pages: ["Home", "Roof replacement", "Roof repair", "Storm and hail damage", "Roof types", "Insurance claims", "Financing", "Project gallery", "Request an inspection"],
    integrations: ["AccuLynx", "JobNimbus", "Roofr", "CompanyCam", "Home-improvement financing providers", "Google reviews", "Call tracking"],
    rules: {
      title: "Licensing, financing and storm-work rules",
      text: "Many states require a roofing or contractor license number on advertising, including websites, and several regulate storm-related solicitation and offers to pay or waive insurance deductibles. Financing ads must not mislead: if a monthly payment appears, the terms belong next to it. We display the license and financing details you give us, and you approve every claim before launch.",
    },
    faq: [
      { question: "Can I put up a storm-damage message quickly after a hail event?", answer: "Yes. We build a storm banner and a storm-damage page you can switch on from WordPress in a few clicks, or we switch it on for you if you are on a site management plan." },
      { question: "Can my website show an instant roof estimate?", answer: "If you subscribe to an estimating tool such as Roofr that offers a website widget, we can embed it. The numbers come from that tool and your settings in it, so you decide whether to show them." },
      { question: "Can I advertise financing on my site?", answer: "Yes. We link to your financing provider's application and show payment examples only with the terms the provider gives you, because financing advertising has disclosure rules. You approve the wording before launch." },
      { question: "How much does a roofing website cost?", answer: "Custom design starts at $1,399 for Starter, $1,899 for Plus and $2,699 for Pro, as one-time project prices scoped in writing first. Roofers with separate pages for each roof type and storm services usually fit Plus. Hosting is billed separately each month." },
      { question: "How long does it take?", answer: "It depends on the plan and how quickly your photos, roof types and license details arrive, so we do not publish a number we would have to caveat. You get a timeline with your written scope, before you commit." },
    ],
  },
  es: {
    name: "Empresas de techos",
    metaTitle: "Diseño web para empresas de techos | Serverlys",
    metaDescription:
      "Sitios web para techadores hechos por nosotros: inspecciones tras tormentas, tipos de techo, antes y después, financiamiento y licencia. Desde $1,399.",
    h1: "Diseño web para techadores: reparaciones, techos nuevos y temporada de tormentas",
    lede:
      "Diseñamos y construimos sitios web para empresas de techos: una solicitud de inspección que funciona la mañana después de una tormenta, una página por cada tipo de techo, fotos reales de antes y después, información de financiamiento y la licencia y el seguro que el propietario revisa primero. El diseño a medida empieza en $1,399, acordado por escrito.",
    needs: [
      { title: "Inspecciones después de una tormenta", text: "Un formulario corto con dirección, tipo de daño (granizo, viento, una gotera), fotos y si ya abrió un reclamo, más un aviso de tormenta que puede activar después de granizo o vientos fuertes." },
      { title: "Reclamos al seguro, explicados con honestidad", text: "Una página que explica cómo funciona un reclamo con usted, desde la inspección y las fotos hasta la reunión con el ajustador, sin prometer la aprobación ni ofrecer cubrir el deducible, algo que varios estados prohíben." },
      { title: "Una página por tipo de techo", text: "Tejas asfálticas, metal, teja, techos planos como TPO: lo que instala, el mantenimiento de cada uno y las certificaciones de fabricante que realmente tiene." },
      { title: "Antes y después de sus propios techos", text: "Fotos de CompanyCam o de su celular, agrupadas por trabajo y sin la dirección, para que el propietario vea el trabajo de sus cuadrillas y no techos de stock." },
      { title: "Financiamiento presentado como se debe", text: "Una página de financiamiento que enlaza la solicitud de su prestamista, con ejemplos de pago mensual solo cuando el proveedor entrega los términos que deben ir junto a ellos." },
      { title: "Garantías que se pueden comparar", text: "Las garantías del fabricante y de mano de obra explicadas lado a lado, con lo que cubre cada una y por cuánto tiempo, tal como usted las ofrece." },
    ],
    pages: ["Inicio", "Reemplazo de techo", "Reparación de techo", "Daños por tormenta y granizo", "Tipos de techo", "Reclamos al seguro", "Financiamiento", "Galería de proyectos", "Solicitar inspección"],
    integrations: ["AccuLynx", "JobNimbus", "Roofr", "CompanyCam", "Proveedores de financiamiento para mejoras del hogar", "Reseñas de Google", "Seguimiento de llamadas"],
    rules: {
      title: "Licencias, financiamiento y reglas para trabajos por tormenta",
      text: "Muchos estados exigen el número de licencia de techador o contratista en su publicidad, incluido el sitio web, y varios regulan la venta puerta a puerta tras tormentas y las ofertas de pagar o eliminar el deducible del seguro. La publicidad de financiamiento no debe engañar: si aparece un pago mensual, los términos van junto a él. Mostramos los datos de licencia y financiamiento que usted nos da, y usted aprueba cada afirmación antes del lanzamiento.",
    },
    faq: [
      { question: "¿Puedo publicar rápido un aviso de daños por tormenta después de una granizada?", answer: "Sí. Creamos un aviso de tormenta y una página de daños que puede activar desde WordPress en pocos clics, o la activamos nosotros si tiene un plan de mantenimiento del sitio." },
      { question: "¿Mi sitio puede mostrar un estimado de techo al instante?", answer: "Si usa una herramienta de estimados como Roofr que ofrece un widget para sitios web, podemos integrarlo. Las cifras salen de esa herramienta y de su configuración, así que usted decide si mostrarlas." },
      { question: "¿Puedo anunciar financiamiento en mi sitio?", answer: "Sí. Enlazamos la solicitud de su proveedor de financiamiento y mostramos ejemplos de pago solo con los términos que el proveedor le da, porque la publicidad de financiamiento tiene reglas de divulgación. Usted aprueba el texto antes del lanzamiento." },
      { question: "¿Cuánto cuesta un sitio web para una empresa de techos?", answer: "El diseño a medida empieza en $1,399 con Starter, $1,899 con Plus y $2,699 con Pro, como precios únicos de proyecto acordados por escrito primero. Los techadores con páginas por tipo de techo y servicios de tormenta suelen necesitar Plus. El hosting se cobra aparte cada mes." },
      { question: "¿Cuánto tiempo tarda?", answer: "Depende del plan y de lo rápido que lleguen sus fotos, los tipos de techo y los datos de licencia, así que no publicamos un número con letra pequeña. Recibe un calendario junto con el alcance por escrito, antes de comprometerse." },
    ],
  },
};
