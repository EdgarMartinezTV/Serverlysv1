import type { Industry } from "./types";

export const dental: Industry = {
  slug: "dental",
  related: ["medical", "chiropractic", "therapist"],
  en: {
    name: "Dental practices",
    metaTitle: "Dental Website Design for Practices | Serverlys",
    metaDescription:
      "Dental websites built for you: online scheduling, treatment pages, insurance accepted, dentist bios and new-patient forms. Custom design from $1,399.",
    h1: "Dental website design that fills the new-patient slot",
    lede:
      "We design and build websites for dental practices: online scheduling linked to the tool you already use, a page for each treatment, the insurance plans you accept, dentist and hygienist bios, and new-patient forms routed to a compliant intake tool. Custom design starts at $1,399, scoped in writing before you commit.",
    needs: [
      { title: "Request an appointment in a tap", text: "A Book or Request appointment button in the header and on every treatment page, linked to your online scheduling tool, plus tap-to-call for patients with a toothache who would rather phone." },
      { title: "A page for each treatment", text: "Cleanings, fillings, crowns, implants, Invisalign, whitening and emergency visits each get a page that explains what the visit involves, written plainly and approved by your dentists." },
      { title: "Insurance and payment, answered up front", text: "The PPO plans you are in network with, whether you file out-of-network claims, any in-house membership plan and the financing you offer, such as CareCredit, so patients know before they call." },
      { title: "New-patient forms that stay out of email", text: "Medical history and insurance details collected through the HIPAA-compliant forms in your scheduling or practice-management tool, not a plain website form that sends health information to an inbox." },
      { title: "Dentists and team people recognize", text: "Real photos of each dentist and hygienist with degrees, special training and languages spoken, so a nervous patient knows who will be in the chair." },
      { title: "An office patients can find", text: "Address, parking, hours, after-hours emergency instructions and an accessibility note for the office, plus a page per location if you run more than one." },
    ],
    pages: ["Home with appointment request", "Treatments (one page each)", "New patients", "Insurance and financing", "Our dentists and team", "Emergency dental care", "Patient forms", "Smile gallery (with patient consent)", "Contact and directions"],
    integrations: ["Practice-management systems such as Dentrix or Open Dental", "Online scheduling such as NexHealth, Weave or LocalMed", "HIPAA-compliant patient forms", "CareCredit or other patient financing", "Insurance accepted list", "Google Business Profile", "Google Maps"],
    rules: {
      title: "Patient privacy and accessibility",
      text: "A website contact form is not the place for health information. Medical history and insurance intake should run through a HIPAA-compliant form or portal from a vendor that signs a Business Associate Agreement (BAA) with your practice. We connect the compliant tool you choose; Serverlys itself does not sign BAAs. Accessibility expectations for healthcare websites are rising, so we design to WCAG guidelines. You approve every claim, before-and-after photo and review before launch; the final call on compliance is yours.",
    },
    faq: [
      { question: "Can patients book through the scheduling tool we already use?", answer: "Yes. We link or embed the online scheduling you already have, whether that is NexHealth, Weave, LocalMed or the tool built into your practice-management system, so requests land where your front desk already works." },
      { question: "Is the website HIPAA compliant?", answer: "The website's general contact form should not collect health information, and we label it that way. Anything that does, such as new-patient medical history, goes through a HIPAA-compliant form or portal from a vendor that signs a BAA with you. We set up that connection; Serverlys does not sign BAAs or claim HIPAA compliance itself." },
      { question: "Can we show before-and-after photos and patient reviews?", answer: "Yes, with each patient's written consent on file and without implying every patient will get the same result. You approve every photo and review, and your state dental board's advertising rules apply, so the final call is yours." },
      { question: "How much does a dental website cost?", answer: "Custom design starts at $1,399 for Starter, $1,899 for Plus and $2,699 for Pro, as one-time project prices scoped in writing first. Practices with many treatment pages or several locations usually fit Plus or Pro. Hosting is billed separately each month." },
      { question: "How long does it take?", answer: "It depends on the plan and how quickly bios, photos and treatment approvals arrive, so we do not publish a number we would have to caveat. You get a timeline with your written scope, before you commit." },
    ],
  },
  es: {
    name: "Consultorios dentales",
    metaTitle: "Diseño web para dentistas y clínicas | Serverlys",
    metaDescription:
      "Sitios web para consultorios dentales hechos por nosotros: citas en línea, páginas por tratamiento, seguros aceptados y formularios. Desde $1,399.",
    h1: "Diseño web para dentistas que atrae pacientes nuevos",
    lede:
      "Diseñamos y construimos sitios web para consultorios dentales: citas en línea conectadas a la herramienta que ya usa, una página por tratamiento, los seguros que acepta, perfiles de dentistas e higienistas y formularios de paciente nuevo enviados a una herramienta compatible. El diseño a medida empieza en $1,399, acordado por escrito antes de comprometerse.",
    needs: [
      { title: "Pedir cita con un toque", text: "Un botón de Pedir cita en el encabezado y en cada página de tratamiento, conectado a su herramienta de citas en línea, y llamada con un toque para el paciente con dolor de muela que prefiere hablar." },
      { title: "Una página por tratamiento", text: "Limpiezas, empastes, coronas, implantes, Invisalign, blanqueamiento y urgencias tienen cada uno su página, que explica en qué consiste la visita en lenguaje sencillo y aprobada por sus dentistas." },
      { title: "Seguros y pagos, claros desde el inicio", text: "Los planes PPO con los que trabaja en red, si tramita reclamos fuera de red, su plan de membresía propio y el financiamiento que ofrece, como CareCredit, para que el paciente lo sepa antes de llamar." },
      { title: "Formularios de paciente nuevo fuera del correo", text: "El historial médico y los datos del seguro se recogen con los formularios compatibles con HIPAA de su herramienta de citas o de gestión, no con un formulario web común que manda información de salud a un buzón." },
      { title: "Dentistas y equipo con cara conocida", text: "Fotos reales de cada dentista e higienista con sus títulos, formación especial e idiomas, para que un paciente nervioso sepa quién lo va a atender." },
      { title: "Un consultorio fácil de encontrar", text: "Dirección, estacionamiento, horario, instrucciones para urgencias fuera de horario y una nota de accesibilidad del consultorio, con una página por sede si tiene más de una." },
    ],
    pages: ["Inicio con solicitud de cita", "Tratamientos (una página cada uno)", "Pacientes nuevos", "Seguros y financiamiento", "Nuestros dentistas y equipo", "Urgencias dentales", "Formularios para pacientes", "Galería de sonrisas (con consentimiento del paciente)", "Contacto y cómo llegar"],
    integrations: ["Sistemas de gestión como Dentrix u Open Dental", "Citas en línea como NexHealth, Weave o LocalMed", "Formularios de pacientes compatibles con HIPAA", "CareCredit u otro financiamiento para pacientes", "Lista de seguros aceptados", "Perfil de Empresa en Google", "Google Maps"],
    rules: {
      title: "Privacidad del paciente y accesibilidad",
      text: "Un formulario de contacto del sitio no es lugar para información de salud. El historial médico y los datos del seguro deben pasar por un formulario o portal compatible con HIPAA de un proveedor que firme un Acuerdo de Socio Comercial (BAA) con su consultorio. Conectamos la herramienta compatible que usted elija; Serverlys no firma BAA. Las expectativas de accesibilidad para sitios de salud van en aumento, así que diseñamos según las pautas WCAG. Usted aprueba cada afirmación, foto de antes y después y reseña antes del lanzamiento; la decisión final sobre el cumplimiento es suya.",
    },
    faq: [
      { question: "¿Los pacientes pueden reservar con la herramienta de citas que ya usamos?", answer: "Sí. Enlazamos o integramos la herramienta de citas que ya tiene, sea NexHealth, Weave, LocalMed o la que trae su sistema de gestión, para que las solicitudes lleguen donde ya trabaja su recepción." },
      { question: "¿El sitio web cumple con HIPAA?", answer: "El formulario de contacto general del sitio no debe recoger información de salud, y lo indicamos así. Lo que sí la recoge, como el historial médico del paciente nuevo, pasa por un formulario o portal compatible con HIPAA de un proveedor que firma un BAA con usted. Nosotros hacemos esa conexión; Serverlys no firma BAA ni afirma cumplir con HIPAA por sí mismo." },
      { question: "¿Podemos mostrar fotos de antes y después y reseñas de pacientes?", answer: "Sí, con el consentimiento por escrito de cada paciente y sin dar a entender que todos tendrán el mismo resultado. Usted aprueba cada foto y reseña, y aplican las reglas de publicidad de la junta dental de su estado, así que la decisión final es suya." },
      { question: "¿Cuánto cuesta un sitio web para un consultorio dental?", answer: "El diseño a medida empieza en $1,399 con Starter, $1,899 con Plus y $2,699 con Pro, como precios únicos de proyecto acordados por escrito primero. Los consultorios con muchos tratamientos o varias sedes suelen necesitar Plus o Pro. El hosting se cobra aparte cada mes." },
      { question: "¿Cuánto tiempo tarda?", answer: "Depende del plan y de lo rápido que lleguen los perfiles, las fotos y la aprobación de los tratamientos, así que no publicamos un número con letra pequeña. Recibe un calendario junto con el alcance por escrito, antes de comprometerse." },
    ],
  },
};
