import type { Industry } from "./types";

export const lifeCoach: Industry = {
  slug: "life-coach",
  related: ["coaching", "therapist", "consulting"],
  en: {
    name: "Life coaches",
    metaTitle: "Life Coach Website Design | Serverlys",
    metaDescription:
      "Life coach websites built for you: your story, clear packages, free-call booking and a plain note that coaching is not therapy. From $1,399.",
    h1: "Life coach websites that feel like a first conversation",
    lede:
      "We design and build websites for life coaches: an about page that tells your story, coaching packages with session counts and prices, a booking link for a free first call, intake through your coaching platform, and a clear note that coaching is not therapy. Custom design starts at $1,399, scoped in writing before you commit.",
    needs: [
      { title: "Your story up front", text: "Life coaching is chosen on fit, so the about page carries real weight: why you coach, who you work with and what a session with you is like, with your own photos rather than stock smiles." },
      { title: "Who you help, named plainly", text: "Pages for the transitions you focus on, such as divorce, career change, confidence or life after kids leave home, so a visitor recognizes themselves within a few lines." },
      { title: "Packages with the details", text: "Number of sessions, length, format (video, phone or in person), what happens between sessions and the price or starting price, so nobody books a call just to ask what it costs." },
      { title: "A gentle free-call booking", text: "A booking link for a complimentary first call with two or three short questions, and a reminder email, set up in Calendly, Paperbell or Practice." },
      { title: "Coaching, not therapy", text: "A short, kind note on the site that coaching is not counseling or medical care and is not for crisis, with a pointer to the 988 Suicide and Crisis Lifeline for anyone who needs urgent help." },
      { title: "Somewhere to keep in touch", text: "An email sign-up with a free guide or reflection worksheet, connected to Kit or Mailchimp, for visitors who are not ready to book yet." },
    ],
    pages: ["Home", "About me", "Who I work with", "Coaching packages", "How coaching works", "Free resources or blog", "Book a free call", "Contact"],
    integrations: ["Calendly", "Paperbell", "Practice", "Dubsado", "Stripe", "Zoom", "Kit (ConvertKit) or Mailchimp", "Instagram feed"],
    rules: {
      title: "Not therapy, and honest testimonials",
      text: "Titles such as psychologist and licensed professional counselor are restricted to licensed professionals, and states regulate the practice of therapy, so a life coaching site should not describe its services as therapy or treatment. Under the FTC's Endorsement Guides, testimonials must be genuine and must not imply results most clients do not get. We build to the rules you tell us apply, and you approve every claim before launch.",
    },
    faq: [
      { question: "Should I show my prices?", answer: "Many life coaches do, at least as a starting price, because it saves both of you a call that was only about cost. If you prefer to discuss pricing on the free call, we design the packages page to explain the format without figures." },
      { question: "Can clients book and pay on the site?", answer: "Yes. Paperbell, Practice and Dubsado handle booking, contracts and payment for coaching packages, and Calendly with Stripe works for simpler setups. We connect whichever you use so clients can go from the packages page to a booked, paid session." },
      { question: "Do I need a disclaimer that I am not a therapist?", answer: "It is a good idea, and we include a short one by default along with crisis resources. Wording that fits your situation, and any requirements in your state, are for you to confirm; we place whatever you approve." },
      { question: "How much does a life coach website cost?", answer: "Custom design starts at $1,399 for Starter, $1,899 for Plus and $2,699 for Pro, as one-time project prices scoped in writing first. Most solo coaches start with Starter." },
      { question: "How long does it take?", answer: "It depends on the plan and how quickly your story, photos and package details arrive, so we do not publish a number we would have to caveat. You get a timeline with your written scope, before you commit." },
    ],
  },
  es: {
    name: "Coaches de vida",
    metaTitle: "Diseño web para coaches de vida | Serverlys",
    metaDescription:
      "Sitios web para coaches de vida: su historia, paquetes claros, llamada gratuita y un aviso de que el coaching no es terapia. Desde $1,399.",
    h1: "Sitios web para coaches de vida que se sienten como una primera conversación",
    lede:
      "Diseñamos y construimos sitios web para coaches de vida: una página que cuenta su historia, paquetes con número de sesiones y precios, un enlace para agendar una primera llamada gratuita, la admisión por su plataforma de coaching y un aviso claro de que el coaching no es terapia. El diseño a medida empieza en $1,399, acordado por escrito.",
    needs: [
      { title: "Su historia primero", text: "Al coach de vida se le elige por afinidad, así que la página sobre usted pesa mucho: por qué hace coaching, con quién trabaja y cómo es una sesión con usted, con sus propias fotos y no sonrisas de stock." },
      { title: "A quién ayuda, dicho con claridad", text: "Páginas para las etapas en las que se enfoca, como un divorcio, un cambio de carrera, la confianza o la vida cuando los hijos se van de casa, para que el visitante se reconozca en pocas líneas." },
      { title: "Paquetes con todos los detalles", text: "Número de sesiones, duración, formato (video, teléfono o en persona), qué pasa entre sesiones y el precio o precio desde, para que nadie tenga que agendar una llamada solo para preguntar cuánto cuesta." },
      { title: "Una llamada gratuita sin presión", text: "Un enlace para una primera llamada sin costo con dos o tres preguntas breves y un correo de recordatorio, configurado en Calendly, Paperbell o Practice." },
      { title: "Coaching, no terapia", text: "Un aviso breve y amable de que el coaching no es consejería ni atención médica y no es para crisis, con la Línea 988 de Prevención del Suicidio y Crisis para quien necesite ayuda urgente." },
      { title: "Una forma de seguir en contacto", text: "Un registro de correo con una guía gratuita o una hoja de reflexión, conectado a Kit o Mailchimp, para quien todavía no está listo para agendar." },
    ],
    pages: ["Inicio", "Sobre mí", "Con quién trabajo", "Paquetes de coaching", "Cómo funciona el coaching", "Recursos gratuitos o blog", "Agendar una llamada gratuita", "Contacto"],
    integrations: ["Calendly", "Paperbell", "Practice", "Dubsado", "Stripe", "Zoom", "Kit (ConvertKit) o Mailchimp", "Feed de Instagram"],
    rules: {
      title: "No es terapia, y testimonios honestos",
      text: "Títulos como psicólogo y consejero profesional con licencia están reservados para profesionales con licencia, y los estados regulan la práctica de la terapia, así que un sitio de coaching de vida no debe describir sus servicios como terapia o tratamiento. Según las Guías de Respaldos de la FTC, los testimonios deben ser reales y no pueden dar a entender resultados que la mayoría no obtiene. Construimos según las reglas que usted nos indique, y usted aprueba cada afirmación antes del lanzamiento.",
    },
    faq: [
      { question: "¿Debo mostrar mis precios?", answer: "Muchos coaches de vida lo hacen, al menos con un precio desde, porque les ahorra a los dos una llamada que solo era para hablar de costo. Si prefiere hablar de precios en la llamada gratuita, diseñamos la página de paquetes para explicar el formato sin cifras." },
      { question: "¿Los clientes pueden agendar y pagar en el sitio?", answer: "Sí. Paperbell, Practice y Dubsado manejan citas, contratos y pagos de paquetes de coaching, y Calendly con Stripe sirve para algo más sencillo. Conectamos el que usted use para que el cliente pase de la página de paquetes a una sesión agendada y pagada." },
      { question: "¿Necesito un aviso de que no soy terapeuta?", answer: "Es buena idea, y por defecto incluimos uno breve junto con recursos de crisis. El texto que mejor se ajusta a su caso y cualquier requisito de su estado los confirma usted; nosotros colocamos lo que usted apruebe." },
      { question: "¿Cuánto cuesta un sitio web para un coach de vida?", answer: "El diseño a medida empieza en $1,399 con Starter, $1,899 con Plus y $2,699 con Pro, como precios únicos de proyecto acordados por escrito primero. La mayoría de los coaches independientes empiezan con Starter." },
      { question: "¿Cuánto tiempo tarda?", answer: "Depende del plan y de lo rápido que lleguen su historia, sus fotos y los detalles de los paquetes, así que no publicamos un número con letra pequeña. Recibe un calendario con el alcance por escrito, antes de comprometerse." },
    ],
  },
};
