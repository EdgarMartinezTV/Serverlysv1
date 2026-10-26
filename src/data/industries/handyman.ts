import type { Industry } from "./types";

export const handyman: Industry = {
  slug: "handyman",
  related: ["contractor", "landscaping", "service-business"],
  en: {
    name: "Handyman services",
    metaTitle: "Handyman Website Design with Online Booking | Serverlys",
    metaDescription:
      "Handyman websites built for you: a small-jobs menu, clear hourly or flat-rate pricing, online booking and photos of finished work. From $1,399.",
    h1: "Handyman website design for the jobs on every to-do list",
    lede:
      "We design and build websites for handyman businesses: a menu of the small jobs you take on, pricing explained the way you charge (hourly, flat rate or a minimum visit), online booking with room for photos of the job, and a clear list of the work you refer out. Custom design starts at $1,399, scoped in writing first.",
    needs: [
      { title: "A menu of small jobs", text: "TV mounting, drywall patches, sticking doors, furniture assembly, caulking, grab bars: grouped by room or task, so a homeowner finds their exact job instead of a vague 'home repairs'." },
      { title: "Pricing in the format you use", text: "Hourly with a minimum, flat rates per task, or both, with your trip charge and how materials are billed explained before anyone books." },
      { title: "Booking with photos attached", text: "A booking form that asks for photos and rough measurements, so you can confirm the price or bring the right anchors and hinges on the first visit." },
      { title: "To-do list visits", text: "Half-day and full-day blocks for customers with several small tasks, with a place to list them all when they book." },
      { title: "A clear list of what you refer out", text: "Many states limit unlicensed electrical, plumbing and HVAC work or cap job size, so the site says plainly which jobs you hand to a licensed trade." },
      { title: "The neighborhoods you cover", text: "A ZIP code list or map of where you work, with any extra trip charge for the edges of your area." },
    ],
    pages: ["Home", "Services menu", "Pricing", "Book a visit", "Before-and-after photos", "Service area", "About", "Reviews", "FAQ"],
    integrations: ["Housecall Pro", "Jobber", "Calendly", "Google reviews", "Google Business Profile", "Call tracking"],
    rules: {
      title: "Handyman licensing limits",
      text: "Many states and cities limit what work can be done without a contractor license, often by job value or by trade such as electrical, plumbing or HVAC, and some require a registration or license number on advertising. We list only the services you tell us you take on, display any registration details you give us, and you approve the services list before launch.",
    },
    faq: [
      { question: "Should I show hourly rates or flat prices?", answer: "Whichever matches how you actually charge. We can show an hourly rate with a minimum, flat 'from' prices for common jobs, or both, with trip charges and materials explained so the invoice is not a surprise." },
      { question: "Can customers send photos when they book?", answer: "Yes. The booking form takes photos and a description of each task. If you book through Housecall Pro or Jobber, we connect their online booking and keep the photo request where it fits your workflow." },
      { question: "How much does a handyman website cost?", answer: "Custom design starts at $1,399 for Starter, $1,899 for Plus and $2,699 for Pro, as one-time project prices scoped in writing first. Many handyman sites fit Starter, whose five subpages cover services, pricing, booking, photos and about. Hosting is billed separately each month." },
      { question: "Can I change my prices and services myself?", answer: "Yes. The site is built on WordPress and we show you how to edit the services menu and prices. If you would rather not, site management plans cover changes for you." },
      { question: "How long does it take?", answer: "It depends on the plan and how quickly your job list, prices and photos arrive, so we do not publish a number we would have to caveat. You get a timeline with your written scope, before you commit." },
    ],
  },
  es: {
    name: "Servicios de handyman",
    metaTitle: "Diseño web para handyman con citas en línea | Serverlys",
    metaDescription:
      "Sitios web para handyman hechos por nosotros: menú de trabajos pequeños, precio por hora o fijo, citas en línea y fotos de su trabajo. Desde $1,399.",
    h1: "Diseño web para handyman, para cada pendiente de la casa",
    lede:
      "Diseñamos y construimos sitios web para negocios de handyman: un menú de los trabajos pequeños que acepta, precios explicados como usted cobra (por hora, tarifa fija o visita mínima), citas en línea con espacio para fotos del trabajo y una lista clara de lo que pasa a otros profesionales. El diseño a medida empieza en $1,399, acordado por escrito.",
    needs: [
      { title: "Un menú de trabajos pequeños", text: "Montar televisores, parchar drywall, puertas que se atoran, armar muebles, sellar con silicón, barras de apoyo: agrupados por cuarto o tarea, para que el cliente encuentre su trabajo exacto y no un vago 'reparaciones del hogar'." },
      { title: "Precios en el formato que usa", text: "Por hora con un mínimo, tarifa fija por tarea, o ambos, con su cargo por traslado y cómo se cobran los materiales explicados antes de reservar." },
      { title: "Citas con fotos adjuntas", text: "Un formulario de reserva que pide fotos y medidas aproximadas, para que pueda confirmar el precio o llevar los anclajes y bisagras correctos en la primera visita." },
      { title: "Visitas para la lista de pendientes", text: "Bloques de medio día y día completo para clientes con varias tareas pequeñas, con un espacio para anotarlas todas al reservar." },
      { title: "Una lista clara de lo que no hace", text: "Muchos estados limitan el trabajo eléctrico, de plomería y de aire acondicionado sin licencia o ponen un tope al tamaño del trabajo, así que el sitio dice con claridad qué trabajos pasa a un profesional con licencia." },
      { title: "Las zonas que cubre", text: "Una lista de códigos postales o un mapa de donde trabaja, con cualquier cargo extra por traslado en los límites de su zona." },
    ],
    pages: ["Inicio", "Menú de servicios", "Precios", "Reservar visita", "Fotos de antes y después", "Área de servicio", "Nosotros", "Reseñas", "Preguntas frecuentes"],
    integrations: ["Housecall Pro", "Jobber", "Calendly", "Reseñas de Google", "Perfil de Empresa en Google", "Seguimiento de llamadas"],
    rules: {
      title: "Límites de licencia para handyman",
      text: "Muchos estados y ciudades limitan qué trabajos se pueden hacer sin licencia de contratista, a menudo por el valor del trabajo o por oficio, como electricidad, plomería o aire acondicionado, y algunos exigen un número de registro o licencia en la publicidad. Solo incluimos los servicios que usted nos dice que hace, mostramos los datos de registro que nos da, y usted aprueba la lista de servicios antes del lanzamiento.",
    },
    faq: [
      { question: "¿Debo mostrar tarifa por hora o precios fijos?", answer: "La que corresponda a cómo cobra en realidad. Podemos mostrar una tarifa por hora con un mínimo, precios fijos 'desde' para los trabajos comunes, o ambos, con el traslado y los materiales explicados para que la factura no sorprenda." },
      { question: "¿Los clientes pueden enviar fotos al reservar?", answer: "Sí. El formulario de reserva recibe fotos y una descripción de cada tarea. Si reserva con Housecall Pro o Jobber, conectamos sus citas en línea y dejamos la solicitud de fotos donde encaje en su forma de trabajar." },
      { question: "¿Cuánto cuesta un sitio web para un handyman?", answer: "El diseño a medida empieza en $1,399 con Starter, $1,899 con Plus y $2,699 con Pro, como precios únicos de proyecto acordados por escrito primero. Muchos sitios de handyman caben en Starter, cuyas cinco subpáginas cubren servicios, precios, reservas, fotos y nosotros. El hosting se cobra aparte cada mes." },
      { question: "¿Puedo cambiar mis precios y servicios yo mismo?", answer: "Sí. El sitio está hecho en WordPress y le enseñamos a editar el menú de servicios y los precios. Si prefiere no hacerlo, los planes de mantenimiento incluyen los cambios." },
      { question: "¿Cuánto tiempo tarda?", answer: "Depende del plan y de lo rápido que lleguen su lista de trabajos, sus precios y sus fotos, así que no publicamos un número con letra pequeña. Recibe un calendario junto con el alcance por escrito, antes de comprometerse." },
    ],
  },
};
