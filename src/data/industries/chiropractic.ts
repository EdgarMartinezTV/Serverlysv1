import type { Industry } from "./types";

export const chiropractic: Industry = {
  slug: "chiropractic",
  related: ["medical", "therapist", "dental"],
  en: {
    name: "Chiropractic clinics",
    metaTitle: "Chiropractor Website Design and Booking | Serverlys",
    metaDescription:
      "Chiropractic websites built for you: online booking via Jane App or ChiroTouch, first-visit info, insurance and care-plan pages. Custom design from $1,399.",
    h1: "Chiropractor website design, with booking built in",
    lede:
      "We design and build websites for chiropractic clinics: online booking through Jane App, ChiroTouch or the system you already use, a clear first-visit page, the techniques and conditions you work with, insurance and cash-rate details, and intake routed to a compliant form. Custom design starts at $1,399, scoped in writing before you commit.",
    needs: [
      { title: "Book an adjustment from any page", text: "A Book now button linked to your Jane App or ChiroTouch schedule, with new-patient exams and returning-patient adjustments as separate options so the right time slot gets booked." },
      { title: "What happens on the first visit", text: "Consultation, exam, whether X-rays may be taken, how long it lasts and what to wear, so a first-time patient arrives knowing what to expect." },
      { title: "Techniques and who you treat", text: "Diversified, Gonstead, activator or the methods you use, plus pages for the groups you see most, such as prenatal, sports or auto-accident patients, written without promising a cure." },
      { title: "Insurance, cash rates and care plans", text: "The insurance you accept, whether you take auto-accident or personal-injury cases, single-visit cash rates and how care plans are billed, in plain words on one page." },
      { title: "Intake through the right tool", text: "Health history and pain questionnaires completed in Jane App's or ChiroTouch's own intake forms, or another HIPAA-compliant form, not a website contact form that emails health information." },
      { title: "Doctors and team, by name", text: "Each chiropractor's photo, DC degree, certifications and the patients they focus on, along with massage therapists or rehab staff if your clinic has them." },
    ],
    pages: ["Home with booking", "First visit", "Techniques", "Conditions we see", "Our chiropractors", "Insurance and pricing", "New-patient forms", "Reviews (with patient consent)", "Contact and directions"],
    integrations: ["Jane App", "ChiroTouch", "HIPAA-compliant intake forms", "Insurance accepted list", "Google Business Profile", "Google Maps"],
    rules: {
      title: "Patient privacy, claims and accessibility",
      text: "A website contact form is not the place for health information; intake that collects it should use Jane App, ChiroTouch or another HIPAA-compliant tool whose vendor signs a Business Associate Agreement (BAA) with your clinic. Serverlys connects the tool you choose and does not sign BAAs. State chiropractic boards regulate advertising, including what you may say about conditions and how free or discounted exams are offered. Accessibility expectations for healthcare websites are rising, so we design to WCAG guidelines. You approve every claim and review before launch; the final call on compliance is yours.",
    },
    faq: [
      { question: "Can patients book straight into Jane App or ChiroTouch?", answer: "Yes. We link or embed the online booking from Jane App, ChiroTouch or the scheduler you use, so appointments go straight into the calendar your front desk already manages." },
      { question: "Can we advertise a new-patient special?", answer: "We can feature one, but how free or discounted exams may be advertised depends on your state board, and offers to Medicare or other federal-program patients carry extra rules. You confirm the wording that applies to you before it goes live." },
      { question: "Is the website HIPAA compliant?", answer: "The website's general contact form is labeled not to be used for health information. Intake and health history go through Jane App, ChiroTouch or another HIPAA-compliant form whose vendor signs a BAA with you. We set up that connection; Serverlys does not sign BAAs or claim HIPAA compliance itself." },
      { question: "How much does a chiropractic website cost?", answer: "Custom design starts at $1,399 for Starter, $1,899 for Plus and $2,699 for Pro, as one-time project prices scoped in writing first. Clinics with many condition and technique pages usually fit Plus. Hosting is billed separately each month." },
      { question: "Can I add patient reviews and videos?", answer: "Yes, with each patient's written consent and without suggesting that everyone will have the same result. You approve every review and video before it is published." },
    ],
  },
  es: {
    name: "Clínicas quiroprácticas",
    metaTitle: "Diseño web para quiroprácticos con citas | Serverlys",
    metaDescription:
      "Sitios web para quiroprácticos hechos por nosotros: citas en línea con Jane App o ChiroTouch, primera visita, seguros y planes de cuidado. Desde $1,399.",
    h1: "Diseño web para quiroprácticos, con citas incluidas",
    lede:
      "Diseñamos y construimos sitios web para clínicas quiroprácticas: citas en línea con Jane App, ChiroTouch o el sistema que ya usa, una página clara sobre la primera visita, las técnicas y condiciones que atiende, seguros y tarifas en efectivo, y formularios enviados a una herramienta compatible. El diseño a medida empieza en $1,399, acordado por escrito antes de comprometerse.",
    needs: [
      { title: "Reservar un ajuste desde cualquier página", text: "Un botón de Reservar conectado a su agenda de Jane App o ChiroTouch, con el examen de paciente nuevo y los ajustes de seguimiento como opciones separadas para que se reserve el horario correcto." },
      { title: "Qué pasa en la primera visita", text: "Consulta, examen, si se pueden tomar radiografías, cuánto dura y qué ropa traer, para que el paciente nuevo llegue sabiendo qué esperar." },
      { title: "Técnicas y a quién atiende", text: "Diversified, Gonstead, Activator o los métodos que usa, con páginas para los grupos que más atiende, como embarazadas, deportistas o pacientes de accidentes de auto, escritas sin prometer curas." },
      { title: "Seguros, tarifas y planes de cuidado", text: "Los seguros que acepta, si toma casos de accidentes de auto o lesiones personales, la tarifa por visita en efectivo y cómo se cobran los planes de cuidado, en palabras sencillas y en una sola página." },
      { title: "Formularios en la herramienta correcta", text: "El historial de salud y los cuestionarios de dolor se llenan en los formularios propios de Jane App o ChiroTouch, u otro formulario compatible con HIPAA, no en un formulario de contacto que manda información de salud por correo." },
      { title: "Doctores y equipo, con nombre", text: "La foto de cada quiropráctico, su título de DC, certificaciones y los pacientes en los que se enfoca, junto con masajistas o personal de rehabilitación si su clínica los tiene." },
    ],
    pages: ["Inicio con citas", "Primera visita", "Técnicas", "Condiciones que atendemos", "Nuestros quiroprácticos", "Seguros y precios", "Formularios para pacientes nuevos", "Reseñas (con consentimiento del paciente)", "Contacto y cómo llegar"],
    integrations: ["Jane App", "ChiroTouch", "Formularios de admisión compatibles con HIPAA", "Lista de seguros aceptados", "Perfil de Empresa en Google", "Google Maps"],
    rules: {
      title: "Privacidad, afirmaciones y accesibilidad",
      text: "Un formulario de contacto del sitio no es lugar para información de salud; los formularios que la recogen deben usar Jane App, ChiroTouch u otra herramienta compatible con HIPAA cuyo proveedor firme un Acuerdo de Socio Comercial (BAA) con su clínica. Serverlys conecta la herramienta que usted elija y no firma BAA. Las juntas quiroprácticas estatales regulan la publicidad, incluido lo que puede decir sobre condiciones y cómo se ofrecen exámenes gratuitos o con descuento. Las expectativas de accesibilidad para sitios de salud van en aumento, así que diseñamos según las pautas WCAG. Usted aprueba cada afirmación y reseña antes del lanzamiento; la decisión final sobre el cumplimiento es suya.",
    },
    faq: [
      { question: "¿Los pacientes pueden reservar directo en Jane App o ChiroTouch?", answer: "Sí. Enlazamos o integramos las citas en línea de Jane App, ChiroTouch o el sistema que use, para que las citas entren directo al calendario que ya maneja su recepción." },
      { question: "¿Podemos anunciar una oferta para pacientes nuevos?", answer: "Podemos destacarla, pero cómo se anuncian los exámenes gratuitos o con descuento depende de la junta de su estado, y las ofertas a pacientes de Medicare u otros programas federales tienen reglas adicionales. Usted confirma la redacción que le aplica antes de publicarla." },
      { question: "¿El sitio web cumple con HIPAA?", answer: "El formulario de contacto general del sitio indica que no debe usarse para información de salud. Los formularios y el historial de salud pasan por Jane App, ChiroTouch u otro formulario compatible con HIPAA cuyo proveedor firma un BAA con usted. Nosotros hacemos esa conexión; Serverlys no firma BAA ni afirma cumplir con HIPAA por sí mismo." },
      { question: "¿Cuánto cuesta un sitio web para un quiropráctico?", answer: "El diseño a medida empieza en $1,399 con Starter, $1,899 con Plus y $2,699 con Pro, como precios únicos de proyecto acordados por escrito primero. Las clínicas con muchas páginas de condiciones y técnicas suelen necesitar Plus. El hosting se cobra aparte cada mes." },
      { question: "¿Puedo añadir reseñas y videos de pacientes?", answer: "Sí, con el consentimiento por escrito de cada paciente y sin dar a entender que todos tendrán el mismo resultado. Usted aprueba cada reseña y video antes de publicarlo." },
    ],
  },
};
