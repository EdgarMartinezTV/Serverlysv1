import type { Industry } from "./types";

export const therapist: Industry = {
  slug: "therapist",
  related: ["life-coach", "coaching", "medical"],
  en: {
    name: "Therapists and counselors",
    metaTitle: "Therapist Website Design for Private Practice | Serverlys",
    metaDescription:
      "Therapist websites built for you: specialties, fees and insurance, consultation requests via SimplePractice or TherapyNotes, a crisis notice. From $1,399.",
    h1: "Therapist website design for a calm first step",
    lede:
      "We design and build websites for therapists, counselors and group practices: pages for your specialties and approach, fees and insurance in plain terms, a consultation request through SimplePractice, TherapyNotes or your client portal, and the crisis notice a therapy site should carry. Custom design starts at $1,399, scoped in writing before you commit.",
    needs: [
      { title: "A first step that feels safe", text: "A Request a free consultation button linked to your SimplePractice or TherapyNotes request form, so a nervous client can reach out without writing their story into a website form." },
      { title: "Specialties and approach, in your voice", text: "Anxiety, trauma, couples, teens or grief, and the methods you use, such as CBT, EMDR or DBT, each explained in your words so the right clients recognize themselves." },
      { title: "Fees, insurance and the Good Faith Estimate", text: "Session fees, sliding-scale spots, the insurance panels you are on, superbills for out-of-network clients, and the Good Faith Estimate notice self-pay clients are entitled to under the No Surprises Act." },
      { title: "License and where you can see clients", text: "Your license type and number, the states you are licensed in for telehealth, and whether you see clients in person, online or both, stated before anyone books." },
      { title: "A crisis notice on every page", text: "A short, visible line saying the practice is not for emergencies and pointing to 911 or the 988 Suicide & Crisis Lifeline in the US, kept in the footer and on the contact page." },
      { title: "Discretion by design", text: "No client photos, no stories that could identify anyone, and a contact form that asks only for a name, a way to reach them and a good time to call." },
    ],
    pages: ["Home", "About me (or Our clinicians)", "Specialties (one page each)", "Approach", "Fees and insurance", "Free consultation", "FAQ", "Client portal", "Contact"],
    integrations: ["SimplePractice", "TherapyNotes", "Client portal link", "Psychology Today profile link", "Telehealth through your EHR", "Google Business Profile"],
    rules: {
      title: "Client privacy, crisis notice and ethics",
      text: "A website contact form is not the place for clinical details; intake, consent forms and anything about a client's health should run through SimplePractice, TherapyNotes or another HIPAA-compliant portal whose vendor signs a Business Associate Agreement (BAA) with you. Serverlys connects that tool and does not sign BAAs. A crisis notice pointing to 911 or the 988 Suicide & Crisis Lifeline is expected on therapy sites. Many licensing boards and professional ethics codes restrict client testimonials, so we leave them out unless you confirm they are allowed. Accessibility expectations for healthcare websites are rising, so we design to WCAG guidelines. You approve every word before launch; the final call on compliance is yours.",
    },
    faq: [
      { question: "Can the site connect to SimplePractice or TherapyNotes?", answer: "Yes. We add the appointment request or contact widget from SimplePractice, or the request link from TherapyNotes, and a Client portal link in the menu, so intake and paperwork stay inside the system that holds your records." },
      { question: "Is the website HIPAA compliant?", answer: "The website's general contact form is labeled not to be used for clinical details and asks only how to reach the person. Anything clinical goes through your EHR's HIPAA-compliant portal, whose vendor signs a BAA with you. We set up that connection; Serverlys does not sign BAAs or claim HIPAA compliance itself." },
      { question: "Will the site work alongside my Psychology Today profile?", answer: "Yes. We link to your Psychology Today profile and keep your specialties, fees and insurance consistent between the two, so a client who reads both gets the same answers." },
      { question: "Can I have client testimonials?", answer: "Many licensing boards and professional ethics codes restrict or prohibit soliciting testimonials from clients, so we do not add them by default. If your board allows them, you decide what is published." },
      { question: "How much does a therapist website cost?", answer: "Custom design starts at $1,399 for Starter, $1,899 for Plus and $2,699 for Pro, as one-time project prices scoped in writing first. Solo practices often fit Starter; group practices with several clinician pages usually need Plus. Hosting is billed separately each month." },
    ],
  },
  es: {
    name: "Terapeutas y consejeros",
    metaTitle: "Diseño web para terapeutas y psicólogos | Serverlys",
    metaDescription:
      "Sitios web para terapeutas hechos por nosotros: especialidades, tarifas, seguros, citas por SimplePractice o TherapyNotes y aviso de crisis. Desde $1,399.",
    h1: "Diseño web para terapeutas, un primer paso tranquilo",
    lede:
      "Diseñamos y construimos sitios web para terapeutas, consejeros y prácticas grupales: páginas sobre sus especialidades y su enfoque, tarifas y seguros claros, una solicitud de consulta por SimplePractice, TherapyNotes o su portal del cliente, y el aviso de crisis que un sitio de terapia debe tener. El diseño a medida empieza en $1,399, acordado por escrito antes de comprometerse.",
    needs: [
      { title: "Un primer paso que se sienta seguro", text: "Un botón de Solicitar consulta gratuita conectado a su formulario de SimplePractice o TherapyNotes, para que un cliente nervioso pueda escribir sin contar su historia en un formulario web." },
      { title: "Especialidades y enfoque, con su voz", text: "Ansiedad, trauma, parejas, adolescentes o duelo, y los métodos que usa, como TCC, EMDR o DBT, cada uno explicado con sus palabras para que los clientes adecuados se reconozcan." },
      { title: "Tarifas, seguros y el Estimado de Buena Fe", text: "El costo por sesión, cupos con tarifa escalonada, los seguros con los que trabaja, superbills para clientes fuera de red y el aviso del Estimado de Buena Fe al que tienen derecho los clientes que pagan por su cuenta según la ley No Surprises Act." },
      { title: "Licencia y dónde puede atender", text: "Su tipo y número de licencia, los estados donde tiene licencia para telesalud y si atiende en persona, en línea o ambos, indicado antes de que alguien reserve." },
      { title: "Un aviso de crisis en cada página", text: "Una línea corta y visible que dice que la práctica no atiende emergencias y remite al 911 o a la 988 Línea de Prevención del Suicidio y Crisis en EE. UU., en el pie de página y en la página de contacto." },
      { title: "Discreción desde el diseño", text: "Sin fotos de clientes, sin historias que puedan identificar a nadie y con un formulario que solo pide el nombre, cómo contactar y la mejor hora para llamar." },
    ],
    pages: ["Inicio", "Sobre mí (o Nuestros terapeutas)", "Especialidades (una página cada una)", "Enfoque", "Tarifas y seguros", "Consulta gratuita", "Preguntas frecuentes", "Portal del cliente", "Contacto"],
    integrations: ["SimplePractice", "TherapyNotes", "Enlace al portal del cliente", "Enlace a su perfil de Psychology Today", "Telesalud a través de su EHR", "Perfil de Empresa en Google"],
    rules: {
      title: "Privacidad, aviso de crisis y ética",
      text: "Un formulario de contacto del sitio no es lugar para detalles clínicos; los formularios de admisión, los consentimientos y todo lo relacionado con la salud del cliente deben pasar por SimplePractice, TherapyNotes u otro portal compatible con HIPAA cuyo proveedor firme un Acuerdo de Socio Comercial (BAA) con usted. Serverlys conecta esa herramienta y no firma BAA. En los sitios de terapia se espera un aviso de crisis que remita al 911 o a la 988 Línea de Prevención del Suicidio y Crisis. Muchas juntas de licencias y códigos de ética profesional restringen los testimonios de clientes, así que no los incluimos a menos que usted confirme que están permitidos. Las expectativas de accesibilidad para sitios de salud van en aumento, así que diseñamos según las pautas WCAG. Usted aprueba cada palabra antes del lanzamiento; la decisión final sobre el cumplimiento es suya.",
    },
    faq: [
      { question: "¿El sitio se puede conectar a SimplePractice o TherapyNotes?", answer: "Sí. Añadimos el widget de solicitud de cita o de contacto de SimplePractice, o el enlace de solicitud de TherapyNotes, y un enlace al Portal del cliente en el menú, para que la admisión y los documentos se queden en el sistema que guarda sus expedientes." },
      { question: "¿El sitio web cumple con HIPAA?", answer: "El formulario de contacto general del sitio indica que no debe usarse para detalles clínicos y solo pide cómo contactar a la persona. Todo lo clínico pasa por el portal compatible con HIPAA de su EHR, cuyo proveedor firma un BAA con usted. Nosotros hacemos esa conexión; Serverlys no firma BAA ni afirma cumplir con HIPAA por sí mismo." },
      { question: "¿El sitio funciona junto con mi perfil de Psychology Today?", answer: "Sí. Enlazamos su perfil de Psychology Today y mantenemos iguales en ambos sus especialidades, tarifas y seguros, para que un cliente que lea los dos reciba las mismas respuestas." },
      { question: "¿Puedo tener testimonios de clientes?", answer: "Muchas juntas de licencias y códigos de ética profesional restringen o prohíben pedir testimonios a los clientes, así que no los añadimos por defecto. Si su junta los permite, usted decide qué se publica." },
      { question: "¿Cuánto cuesta un sitio web para un terapeuta?", answer: "El diseño a medida empieza en $1,399 con Starter, $1,899 con Plus y $2,699 con Pro, como precios únicos de proyecto acordados por escrito primero. Las prácticas individuales suelen caber en Starter; las grupales con varios perfiles suelen necesitar Plus. El hosting se cobra aparte cada mes." },
    ],
  },
};
