import type { Industry } from "./types";

export const salon: Industry = {
  slug: "salon",
  related: ["artist", "coaching", "service-business"],
  en: {
    name: "Salons and barbershops",
    metaTitle: "Salon Website Design with Online Booking | Serverlys",
    metaDescription:
      "Salon and barbershop websites built for you: online booking, a service menu with prices, stylist profiles and your gallery. Custom design from $1,399.",
    h1: "Salon website design, with booking built in",
    lede:
      "We design and build websites for salons and barbershops: online booking connected to the system you already use, a clear service menu with prices, stylist profiles and a gallery of your work. Custom design starts at $1,399, and hosting, updates and changes can be handled by us after launch.",
    needs: [
      { title: "Book from the first screen", text: "A Book now button in the header and on every service, linked to your booking system, so a client on their phone can pick a stylist and a time in under a minute." },
      { title: "A service menu people can read", text: "Cuts, color, treatments and add-ons with prices or 'from' prices and durations, grouped the way your clients think about them, not the way your POS lists them." },
      { title: "Stylist and barber profiles", text: "Each person's photo, specialties and booking link, because clients book people, not chairs." },
      { title: "Your work, not stock photos", text: "A before-and-after gallery you can add to yourself, or pulled from your Instagram, so the site looks like your chairs this month." },
      { title: "Policies that prevent no-shows", text: "Cancellation, late-arrival and deposit policies on the page clients see before they book, written in plain language." },
      { title: "Gift cards and products", text: "Sell gift cards and retail products online if your booking or POS system supports it, linked from the menu instead of a separate store." },
    ],
    pages: ["Home with booking", "Services and prices", "Team", "Gallery", "Gift cards", "Policies", "About the salon", "Contact and directions"],
    integrations: ["Square Appointments", "Fresha", "Vagaro", "GlossGenius", "Instagram feed", "Google Business Profile", "Google Maps"],
    faq: [
      { question: "Can my website use the booking system I already have?", answer: "Yes. We link or embed the booking system you already use, so appointments keep landing in the calendar your team works from. We do not move you to a new system unless you ask." },
      { question: "Can I update prices and photos myself?", answer: "Yes. The site is built on WordPress and we show you how to edit services, prices and the gallery. If you would rather not, site management plans cover changes for you." },
      { question: "How much does a salon website cost?", answer: "Custom design starts at $1,399 for the Starter plan, $1,899 for Plus and $2,699 for Pro, as one-time project prices scoped in writing first. Hosting is billed separately each month." },
      { question: "How long does it take?", answer: "It depends on the plan and how quickly photos, prices and team details arrive, so we do not publish a number we would have to caveat. You get a timeline with your written scope, before you commit." },
      { question: "Will it work on phones?", answer: "Yes. Most salon clients book on a phone, so the site is designed for small screens first and tested on them before launch." },
    ],
  },
  es: {
    name: "Salones de belleza y barberías",
    metaTitle: "Diseño web para salones con reservas | Serverlys",
    metaDescription:
      "Sitios web para salones y barberías hechos por nosotros: reservas en línea, menú de servicios con precios, perfiles del equipo y galería. Desde $1,399.",
    h1: "Diseño web para salones, con reservas incluidas",
    lede:
      "Diseñamos y construimos sitios web para salones de belleza y barberías: reservas en línea conectadas al sistema que ya usa, un menú de servicios claro con precios, perfiles del equipo y una galería de su trabajo. El diseño a medida empieza en $1,399, y después del lanzamiento podemos encargarnos del hosting, las actualizaciones y los cambios.",
    needs: [
      { title: "Reservar desde la primera pantalla", text: "Un botón de Reservar en el encabezado y en cada servicio, conectado a su sistema de citas, para que un cliente en el celular elija estilista y hora en menos de un minuto." },
      { title: "Un menú de servicios que se entienda", text: "Cortes, color, tratamientos y extras con precios o precios 'desde' y su duración, agrupados como piensan sus clientes, no como los lista su caja." },
      { title: "Perfiles de estilistas y barberos", text: "La foto, las especialidades y el enlace de reserva de cada persona, porque los clientes reservan con personas, no con sillas." },
      { title: "Su trabajo, no fotos de stock", text: "Una galería de antes y después que usted mismo puede actualizar, o tomada de su Instagram, para que el sitio se vea como su salón este mes." },
      { title: "Políticas que evitan ausencias", text: "Políticas de cancelación, llegada tarde y depósito en la página que el cliente ve antes de reservar, escritas en lenguaje sencillo." },
      { title: "Tarjetas de regalo y productos", text: "Venda tarjetas de regalo y productos en línea si su sistema de reservas o de caja lo permite, enlazados desde el menú en lugar de una tienda aparte." },
    ],
    pages: ["Inicio con reservas", "Servicios y precios", "Equipo", "Galería", "Tarjetas de regalo", "Políticas", "Sobre el salón", "Contacto y cómo llegar"],
    integrations: ["Square Appointments", "Fresha", "Vagaro", "GlossGenius", "Feed de Instagram", "Perfil de Empresa en Google", "Google Maps"],
    faq: [
      { question: "¿Mi sitio puede usar el sistema de reservas que ya tengo?", answer: "Sí. Enlazamos o integramos el sistema de reservas que ya usa, para que las citas sigan llegando al calendario con el que trabaja su equipo. No le cambiamos de sistema a menos que lo pida." },
      { question: "¿Puedo actualizar precios y fotos yo mismo?", answer: "Sí. El sitio está hecho en WordPress y le enseñamos a editar servicios, precios y la galería. Si prefiere no hacerlo, los planes de mantenimiento incluyen los cambios." },
      { question: "¿Cuánto cuesta un sitio web para un salón?", answer: "El diseño a medida empieza en $1,399 con el plan Starter, $1,899 con Plus y $2,699 con Pro, como precios únicos de proyecto acordados por escrito primero. El hosting se cobra aparte cada mes." },
      { question: "¿Cuánto tiempo tarda?", answer: "Depende del plan y de lo rápido que lleguen las fotos, los precios y los datos del equipo, así que no publicamos un número con letra pequeña. Recibe un calendario junto con el alcance por escrito, antes de comprometerse." },
      { question: "¿Funciona en celulares?", answer: "Sí. La mayoría de los clientes de un salón reservan desde el celular, así que el sitio se diseña primero para pantallas pequeñas y se prueba en ellas antes del lanzamiento." },
    ],
  },
};
