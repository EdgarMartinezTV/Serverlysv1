import type { Industry } from "./types";

export const medical: Industry = {
  slug: "medical",
  related: ["dental", "chiropractic", "therapist"],
  en: {
    name: "Medical practices and clinics",
    metaTitle: "Medical Practice Website Design | Serverlys",
    metaDescription:
      "Medical practice websites built for you: scheduling, patient portal and telehealth links, provider bios and insurance accepted. Custom design from $1,399.",
    h1: "Medical practice website design patients can use",
    lede:
      "We design and build websites for medical practices and clinics: online scheduling, clear links to your patient portal and telehealth visits, provider bios with credentials, the insurance you accept, and intake routed to the compliant tools you already use. Custom design starts at $1,399, scoped in writing before you commit.",
    needs: [
      { title: "Scheduling and the portal, one tap away", text: "Book appointment, Patient portal and Telehealth visit buttons in the header, each going to the system you already run, so patients stop calling the front desk for a login link." },
      { title: "Provider pages with real credentials", text: "Each physician, NP and PA with board certification, training, languages spoken, the locations they see patients at and whether they are accepting new patients." },
      { title: "Services written for patients", text: "Primary care, annual physicals, chronic-condition visits, vaccines or the specialties you offer, each explained in plain language and reviewed by your clinicians before it goes live." },
      { title: "Insurance and self-pay, answered up front", text: "The plans you accept, how to check coverage before a visit, and self-pay or cash prices where you publish them, so fewer calls are about billing." },
      { title: "Intake that stays out of email", text: "New-patient forms and medical history collected inside your patient portal or a HIPAA-compliant form vendor that signs a BAA, never a general website form that sends health information to an inbox." },
      { title: "Urgent and after-hours guidance", text: "A clear 'If this is an emergency, call 911' notice, after-hours phone instructions and the nearest urgent-care option you recommend, visible without searching." },
    ],
    pages: ["Home with scheduling", "Services or specialties", "Providers", "New patients", "Insurance and billing", "Patient portal and telehealth", "Patient forms", "Locations and hours", "Contact"],
    integrations: ["Patient portal link (from your EHR)", "Telehealth visit links", "Online scheduling such as Zocdoc", "HIPAA-compliant intake forms", "Insurance accepted list", "Google Business Profile", "Google Maps"],
    rules: {
      title: "Patient privacy and accessibility",
      text: "A website contact form is not the place for health information. Intake that collects it should use your patient portal or a HIPAA-compliant form from a vendor that signs a Business Associate Agreement (BAA) with your practice. We connect the compliant tool you choose; Serverlys itself does not sign BAAs. Accessibility expectations for healthcare websites are rising, so we design to WCAG guidelines. Your clinicians approve every medical statement and testimonial before launch; the final call on compliance is yours.",
    },
    faq: [
      { question: "Can the website connect to our patient portal and EHR?", answer: "We link patients to the portal, scheduling and telehealth pages your EHR or vendor already provides, and embed them where the vendor allows. Patient records stay in those systems; the website itself does not store them." },
      { question: "Is the website HIPAA compliant?", answer: "The website's general contact form is labeled not to be used for health information. Intake that needs it goes through your portal or a HIPAA-compliant form from a vendor that signs a BAA with you. We set up that connection; Serverlys does not sign BAAs or claim HIPAA compliance itself." },
      { question: "Can we list on Zocdoc and still take bookings on our own site?", answer: "Yes. We can add a Zocdoc booking widget or link alongside your own scheduling, so patients who find you either way can book. Which one leads is your choice." },
      { question: "Do you write the medical content?", answer: "We structure each service page and can draft it from your notes, but anything medical needs a clinician's review. Nothing goes live without your approval, and we do not write outcome claims." },
      { question: "How much does a medical practice website cost?", answer: "Custom design starts at $1,399 for Starter, $1,899 for Plus and $2,699 for Pro, as one-time project prices scoped in writing first. Multi-provider or multi-location practices usually fit Plus or Pro. Hosting is billed separately each month." },
    ],
  },
  es: {
    name: "Consultorios médicos y clínicas",
    metaTitle: "Diseño web para consultorios médicos | Serverlys",
    metaDescription:
      "Sitios web para consultorios médicos hechos por nosotros: citas en línea, enlaces al portal del paciente y telemedicina, médicos y seguros. Desde $1,399.",
    h1: "Diseño web para consultorios médicos fácil de usar",
    lede:
      "Diseñamos y construimos sitios web para consultorios médicos y clínicas: citas en línea, enlaces claros a su portal del paciente y a las consultas de telemedicina, perfiles de proveedores con credenciales, los seguros que acepta y formularios enviados a las herramientas compatibles que ya usa. El diseño a medida empieza en $1,399, acordado por escrito antes de comprometerse.",
    needs: [
      { title: "Citas y portal, a un toque", text: "Botones de Pedir cita, Portal del paciente y Consulta por telemedicina en el encabezado, cada uno hacia el sistema que ya usa, para que los pacientes dejen de llamar a recepción por el enlace de acceso." },
      { title: "Perfiles con credenciales reales", text: "Cada médico, enfermero practicante y asistente médico con su certificación, formación, idiomas, las sedes donde atiende y si acepta pacientes nuevos." },
      { title: "Servicios explicados para pacientes", text: "Medicina general, chequeos anuales, control de enfermedades crónicas, vacunas o sus especialidades, cada uno explicado en lenguaje sencillo y revisado por sus médicos antes de publicarse." },
      { title: "Seguros y pago directo, claros desde el inicio", text: "Los planes que acepta, cómo verificar la cobertura antes de la visita y los precios de pago directo si los publica, para que haya menos llamadas sobre facturación." },
      { title: "Formularios fuera del correo", text: "Los formularios de paciente nuevo y el historial médico se recogen en su portal del paciente o con un proveedor de formularios compatible con HIPAA que firme un BAA, nunca con un formulario web común que manda información de salud a un buzón." },
      { title: "Indicaciones para urgencias y fuera de horario", text: "Un aviso claro de 'Si es una emergencia, llame al 911', instrucciones telefónicas fuera de horario y la clínica de atención urgente que usted recomienda, visibles sin tener que buscarlos." },
    ],
    pages: ["Inicio con citas", "Servicios o especialidades", "Proveedores", "Pacientes nuevos", "Seguros y facturación", "Portal del paciente y telemedicina", "Formularios para pacientes", "Sedes y horarios", "Contacto"],
    integrations: ["Enlace al portal del paciente (de su EHR)", "Enlaces a consultas de telemedicina", "Citas en línea como Zocdoc", "Formularios de admisión compatibles con HIPAA", "Lista de seguros aceptados", "Perfil de Empresa en Google", "Google Maps"],
    rules: {
      title: "Privacidad del paciente y accesibilidad",
      text: "Un formulario de contacto del sitio no es lugar para información de salud. Los formularios que la recogen deben usar su portal del paciente o un formulario compatible con HIPAA de un proveedor que firme un Acuerdo de Socio Comercial (BAA) con su consultorio. Conectamos la herramienta compatible que usted elija; Serverlys no firma BAA. Las expectativas de accesibilidad para sitios de salud van en aumento, así que diseñamos según las pautas WCAG. Sus médicos aprueban cada afirmación médica y cada testimonio antes del lanzamiento; la decisión final sobre el cumplimiento es suya.",
    },
    faq: [
      { question: "¿El sitio se puede conectar a nuestro portal del paciente y EHR?", answer: "Enlazamos a los pacientes al portal, las citas y la telemedicina que ya ofrece su EHR o proveedor, y los integramos donde el proveedor lo permite. Los expedientes se quedan en esos sistemas; el sitio web no los guarda." },
      { question: "¿El sitio web cumple con HIPAA?", answer: "El formulario de contacto general del sitio indica que no debe usarse para información de salud. Lo que sí la necesita pasa por su portal o por un formulario compatible con HIPAA de un proveedor que firma un BAA con usted. Nosotros hacemos esa conexión; Serverlys no firma BAA ni afirma cumplir con HIPAA por sí mismo." },
      { question: "¿Podemos estar en Zocdoc y también recibir citas en nuestro sitio?", answer: "Sí. Podemos añadir el widget o enlace de Zocdoc junto a su propio sistema de citas, para que el paciente reserve por donde lo haya encontrado. Cuál va primero lo decide usted." },
      { question: "¿Ustedes escriben el contenido médico?", answer: "Estructuramos cada página de servicio y podemos redactarla a partir de sus notas, pero todo lo médico necesita la revisión de un profesional. Nada se publica sin su aprobación y no escribimos promesas de resultados." },
      { question: "¿Cuánto cuesta un sitio web para un consultorio médico?", answer: "El diseño a medida empieza en $1,399 con Starter, $1,899 con Plus y $2,699 con Pro, como precios únicos de proyecto acordados por escrito primero. Los consultorios con varios proveedores o sedes suelen necesitar Plus o Pro. El hosting se cobra aparte cada mes." },
    ],
  },
};
