import type { Industry } from "./types";

export const electrician: Industry = {
  slug: "electrician",
  related: ["contractor", "construction", "handyman"],
  en: {
    name: "Electricians and electrical contractors",
    metaTitle: "Electrician Website Design | Serverlys",
    metaDescription:
      "Electrician websites built for you: emergency call buttons, panel upgrade and EV charger pages, license display and service-call booking. From $1,399.",
    h1: "Electrician website design for emergency calls and planned work",
    lede:
      "We design and build websites for electricians and electrical contractors: a tap-to-call button for outages and emergencies, pages for panel upgrades, EV charger installs and rewiring, online booking for service calls, and your license number where many states expect it. Custom design starts at $1,399, scoped in writing before you commit.",
    needs: [
      { title: "Emergency calls come first", text: "A call button that stays on screen, after-hours details only if you really answer after hours, and a short list of what counts as an emergency, with a reminder to call the utility for downed lines." },
      { title: "Panel upgrades and EV chargers", text: "Separate pages explaining when a home needs a panel or service upgrade for a Level 2 charger, how permits and utility coordination work, and which charger brands you install." },
      { title: "Your license number on every page", text: "The electrical contractor license number in the footer and on the About page, so it appears wherever your site advertises your work." },
      { title: "Book a service call online", text: "Booking through ServiceTitan, Housecall Pro or Jobber, with the service-call or diagnostic fee shown up front if you charge one." },
      { title: "Residential, commercial and generators", text: "Distinct sections for homeowners, businesses and standby generator installs, so a property manager does not land on a page about ceiling fans." },
      { title: "Rebates linked, not guessed", text: "Utility and government incentives for EV chargers and panel upgrades change often, so we link to the official program pages instead of quoting amounts that go out of date." },
    ],
    pages: ["Home", "Emergency service", "Panel upgrades", "EV charger installation", "Lighting and rewiring", "Generators", "Commercial services", "Book a service call", "About and licensing"],
    integrations: ["ServiceTitan", "Housecall Pro", "Jobber", "Home-improvement financing providers", "Google reviews", "Google Business Profile", "Call tracking"],
    rules: {
      title: "License display for electricians",
      text: "Many states require an electrical contractor's license number on advertising, and some extend that to websites and service vehicles. We display the license details you give us in the footer and on service pages, and describe permits and inspections the way your local authority handles them. Rules differ by state and city, so you confirm what yours requires and approve every claim before launch.",
    },
    faq: [
      { question: "Should my website advertise 24/7 emergency service?", answer: "Only if someone answers the phone at 2 a.m. If you do, we make the emergency number the most visible thing on every page. If you do not, we show your hours clearly and what to do in the meantime." },
      { question: "Can customers book a service call and see my fee first?", answer: "Yes. We connect the online booking in ServiceTitan, Housecall Pro or Jobber, and show your service-call or diagnostic fee next to the booking button if you want customers to see it before they book." },
      { question: "Where does my license number go?", answer: "We put it in the footer of every page and on the About page by default, and anywhere else you tell us. Your state board's rules are the reference, so you confirm the placement before launch." },
      { question: "How much does an electrician website cost?", answer: "Custom design starts at $1,399 for Starter, $1,899 for Plus and $2,699 for Pro, as one-time project prices scoped in writing first. Electricians with separate pages for EV chargers, panels, generators and commercial work usually fit Plus. Hosting is billed separately each month." },
      { question: "Can you write the EV charger and panel upgrade pages?", answer: "We can draft them from your notes, but technical details such as amperage, permit steps and the charger brands you install come from you. Nothing goes live until you have checked it." },
    ],
  },
  es: {
    name: "Electricistas y contratistas eléctricos",
    metaTitle: "Diseño web para electricistas | Serverlys",
    metaDescription:
      "Sitios web para electricistas hechos por nosotros: botón de emergencias, paneles y cargadores para autos eléctricos, licencia y citas. Desde $1,399.",
    h1: "Diseño web para electricistas: emergencias y trabajos programados",
    lede:
      "Diseñamos y construimos sitios web para electricistas y contratistas eléctricos: un botón para llamar con un toque en apagones y emergencias, páginas de cambio de panel, cargadores para autos eléctricos y recableado, citas en línea para visitas de servicio y su número de licencia donde muchos estados lo exigen. El diseño a medida empieza en $1,399, acordado por escrito.",
    needs: [
      { title: "Primero las emergencias", text: "Un botón de llamada siempre visible, horario fuera de oficina solo si de verdad contesta a esas horas, y una lista corta de qué cuenta como emergencia, con el aviso de llamar a la compañía eléctrica si hay cables caídos." },
      { title: "Paneles y cargadores para autos eléctricos", text: "Páginas separadas que explican cuándo una casa necesita ampliar el panel o el servicio para un cargador de nivel 2, cómo funcionan los permisos y la coordinación con la compañía eléctrica, y qué marcas de cargadores instala." },
      { title: "Su número de licencia en cada página", text: "El número de licencia de contratista eléctrico en el pie de página y en la página Nosotros, para que aparezca donde su sitio anuncia su trabajo." },
      { title: "Citas de servicio en línea", text: "Reservas a través de ServiceTitan, Housecall Pro o Jobber, con la tarifa de visita o de diagnóstico a la vista si la cobra." },
      { title: "Residencial, comercial y generadores", text: "Secciones distintas para propietarios, negocios e instalación de generadores de respaldo, para que un administrador de propiedades no termine en una página sobre ventiladores de techo." },
      { title: "Incentivos enlazados, no adivinados", text: "Los incentivos de la compañía eléctrica y del gobierno para cargadores y paneles cambian a menudo, así que enlazamos las páginas oficiales de cada programa en lugar de citar montos que quedan desactualizados." },
    ],
    pages: ["Inicio", "Servicio de emergencia", "Cambio de panel eléctrico", "Instalación de cargadores para autos eléctricos", "Iluminación y recableado", "Generadores", "Servicios comerciales", "Reservar visita de servicio", "Nosotros y licencia"],
    integrations: ["ServiceTitan", "Housecall Pro", "Jobber", "Proveedores de financiamiento para mejoras del hogar", "Reseñas de Google", "Perfil de Empresa en Google", "Seguimiento de llamadas"],
    rules: {
      title: "Licencia visible para electricistas",
      text: "Muchos estados exigen el número de licencia del contratista eléctrico en su publicidad, y algunos lo extienden al sitio web y a los vehículos de servicio. Mostramos los datos de licencia que usted nos da en el pie de página y en las páginas de servicios, y describimos permisos e inspecciones como los maneja su autoridad local. Las reglas cambian por estado y ciudad, así que usted confirma lo que exige el suyo y aprueba cada afirmación antes del lanzamiento.",
    },
    faq: [
      { question: "¿Mi sitio debe anunciar servicio de emergencia 24/7?", answer: "Solo si alguien contesta el teléfono a las 2 de la mañana. Si es así, hacemos que el número de emergencias sea lo más visible de cada página. Si no, mostramos su horario con claridad y qué hacer mientras tanto." },
      { question: "¿Los clientes pueden reservar una visita y ver mi tarifa antes?", answer: "Sí. Conectamos las reservas en línea de ServiceTitan, Housecall Pro o Jobber, y mostramos su tarifa de visita o de diagnóstico junto al botón de reservar si quiere que el cliente la vea antes." },
      { question: "¿Dónde va mi número de licencia?", answer: "Por defecto lo ponemos en el pie de todas las páginas y en la página Nosotros, y en cualquier otro lugar que nos indique. La referencia son las reglas de la junta de su estado, así que usted confirma la ubicación antes del lanzamiento." },
      { question: "¿Cuánto cuesta un sitio web para un electricista?", answer: "El diseño a medida empieza en $1,399 con Starter, $1,899 con Plus y $2,699 con Pro, como precios únicos de proyecto acordados por escrito primero. Los electricistas con páginas separadas para cargadores, paneles, generadores y trabajo comercial suelen necesitar Plus. El hosting se cobra aparte cada mes." },
      { question: "¿Ustedes escriben las páginas de cargadores y cambio de panel?", answer: "Podemos redactarlas a partir de sus notas, pero los detalles técnicos como el amperaje, los pasos del permiso y las marcas de cargadores que instala vienen de usted. Nada se publica hasta que usted lo revise." },
    ],
  },
};
