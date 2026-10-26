import type { Industry } from "./types";

export const coaching: Industry = {
  slug: "coaching",
  related: ["consulting", "life-coach", "therapist"],
  en: {
    name: "Business and executive coaches",
    metaTitle: "Website Design for Business Coaches | Serverlys",
    metaDescription:
      "Coaching websites built for you: programs with clear outcomes, discovery-call booking, payments and a home for your course or group program. From $1,399.",
    h1: "Websites for business and executive coaches",
    lede:
      "We design and build websites for business, executive, leadership and career coaches: a page for each program with who it is for and how it runs, discovery-call booking, checkout for packages, and links into your course or group-program platform. Custom design starts at $1,399, scoped in writing before you commit.",
    needs: [
      { title: "Programs, not just 'coaching'", text: "One-to-one executive coaching, leadership programs for teams, group cohorts and VIP days each get a page with the format, length, number of sessions and who it suits, so a buyer can tell them apart." },
      { title: "A discovery call with a filter", text: "A booking link that asks role, company size and what they want to change before the call, so you spend free calls on people who could become clients." },
      { title: "Corporate buyers and individuals", text: "Separate paths for an HR or L&D lead buying for a team and for an individual paying their own way, because they ask different questions and approve spend differently." },
      { title: "Packages people can pay for", text: "Checkout or invoicing for coaching packages through Stripe or your coaching platform, with your refund and rescheduling policy on the same page." },
      { title: "Your course and community, linked", text: "Clear links into Kajabi, Thinkific, Teachable or Circle for courses and group programs, so the website sells them and the platform delivers them." },
      { title: "Credentials and method", text: "Your coaching certifications (such as ICF credentials, if you hold them), background and the framework you use, stated accurately, since titles in coaching are not standardized." },
    ],
    pages: ["Home", "Programs (one page each)", "For organizations", "About and credentials", "Approach", "Client stories (with permission)", "Speaking and workshops", "Book a discovery call", "Contact"],
    integrations: ["Calendly", "Stripe", "Kajabi", "Thinkific", "Teachable", "Circle", "Zoom", "Kit (ConvertKit)"],
    rules: {
      title: "Testimonials and results claims",
      text: "Under the FTC's Endorsement Guides, testimonials must be genuine and must not suggest results most clients do not get; claims about income or promotions need real support. Business coaching is also not legal, financial or mental-health advice, and the site should not present it that way. We build to the rules you tell us apply, and you approve every claim and testimonial before launch.",
    },
    faq: [
      { question: "Can the site sell my packages and take payment?", answer: "Yes. We connect Stripe checkout or the payment links from your coaching platform, so clients can buy a package or pay a deposit from the program page. Your terms and refund policy sit on the same page." },
      { question: "Can you connect my course on Kajabi or Thinkific?", answer: "Yes. Your website describes and sells the course or group program, and the enroll and login buttons go to your platform, where the content and community already live." },
      { question: "Can I put client results and testimonials on the site?", answer: "Yes, with the client's permission and kept accurate. We present stories as individual experiences rather than typical results, and you approve each one before launch." },
      { question: "How much does a coaching website cost?", answer: "Custom design starts at $1,399 for Starter, $1,899 for Plus and $2,699 for Pro, as one-time project prices scoped in writing first. Hosting is billed separately each month." },
      { question: "How long does it take?", answer: "It depends on the plan and how quickly your program details, photos and copy arrive, so we do not publish a number we would have to caveat. You get a timeline with your written scope, before you commit." },
    ],
  },
  es: {
    name: "Coaches de negocios y ejecutivos",
    metaTitle: "Diseño web para coaches de negocios | Serverlys",
    metaDescription:
      "Sitios web para coaches hechos por nosotros: programas claros, citas de diagnóstico, pagos de paquetes y enlace a su curso o programa grupal. Desde $1,399.",
    h1: "Sitios web para coaches de negocios y ejecutivos",
    lede:
      "Diseñamos y construimos sitios web para coaches de negocios, ejecutivos, de liderazgo y de carrera: una página por programa con para quién es y cómo funciona, citas para una llamada de diagnóstico, pago de paquetes y enlaces a su plataforma de cursos o programas grupales. El diseño a medida empieza en $1,399, acordado por escrito.",
    needs: [
      { title: "Programas, no solo 'coaching'", text: "El coaching ejecutivo individual, los programas de liderazgo para equipos, los grupos y los días intensivos tienen cada uno una página con el formato, la duración, el número de sesiones y para quién es, para que el cliente los distinga." },
      { title: "Una llamada de diagnóstico con filtro", text: "Un enlace de citas que pregunta el cargo, el tamaño de la empresa y qué quiere cambiar antes de la llamada, para que sus llamadas gratuitas sean con personas que pueden llegar a ser clientes." },
      { title: "Empresas y personas", text: "Caminos separados para el responsable de recursos humanos o capacitación que compra para un equipo y para la persona que paga por su cuenta, porque hacen preguntas distintas y aprueban el gasto de otra forma." },
      { title: "Paquetes que se pueden pagar", text: "Pago o facturación de paquetes por Stripe o por su plataforma de coaching, con su política de reembolsos y cambios de cita en la misma página." },
      { title: "Su curso y su comunidad, conectados", text: "Enlaces claros a Kajabi, Thinkific, Teachable o Circle para cursos y programas grupales, para que el sitio los venda y la plataforma los entregue." },
      { title: "Credenciales y método", text: "Sus certificaciones de coaching (como las credenciales de la ICF, si las tiene), su trayectoria y el método que usa, dichos con precisión, ya que los títulos en coaching no están estandarizados." },
    ],
    pages: ["Inicio", "Programas (una página cada uno)", "Para empresas", "Sobre mí y credenciales", "Método", "Historias de clientes (con permiso)", "Conferencias y talleres", "Agendar una llamada de diagnóstico", "Contacto"],
    integrations: ["Calendly", "Stripe", "Kajabi", "Thinkific", "Teachable", "Circle", "Zoom", "Kit (ConvertKit)"],
    rules: {
      title: "Testimonios y afirmaciones de resultados",
      text: "Según las Guías de Respaldos de la FTC, los testimonios deben ser reales y no pueden sugerir resultados que la mayoría de los clientes no obtiene; las afirmaciones sobre ingresos o ascensos necesitan respaldo real. El coaching de negocios tampoco es asesoría legal, financiera ni de salud mental, y el sitio no debe presentarlo así. Construimos según las reglas que usted nos indique, y usted aprueba cada afirmación y testimonio antes del lanzamiento.",
    },
    faq: [
      { question: "¿El sitio puede vender mis paquetes y cobrar?", answer: "Sí. Conectamos el pago de Stripe o los enlaces de pago de su plataforma de coaching, para que el cliente compre un paquete o pague un depósito desde la página del programa. Sus condiciones y política de reembolso quedan en la misma página." },
      { question: "¿Pueden conectar mi curso de Kajabi o Thinkific?", answer: "Sí. Su sitio describe y vende el curso o el programa grupal, y los botones de inscripción y acceso llevan a su plataforma, donde ya están el contenido y la comunidad." },
      { question: "¿Puedo poner resultados y testimonios de clientes?", answer: "Sí, con el permiso del cliente y con exactitud. Presentamos las historias como experiencias individuales y no como resultados típicos, y usted aprueba cada una antes del lanzamiento." },
      { question: "¿Cuánto cuesta un sitio web para un coach?", answer: "El diseño a medida empieza en $1,399 con Starter, $1,899 con Plus y $2,699 con Pro, como precios únicos de proyecto acordados por escrito primero. El hosting se cobra aparte cada mes." },
      { question: "¿Cuánto tiempo tarda?", answer: "Depende del plan y de lo rápido que lleguen los detalles de sus programas, las fotos y los textos, así que no publicamos un número con letra pequeña. Recibe un calendario con el alcance por escrito, antes de comprometerse." },
    ],
  },
};
