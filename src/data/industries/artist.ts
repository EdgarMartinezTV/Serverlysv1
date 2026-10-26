import type { Industry } from "./types";

export const artist: Industry = {
  slug: "artist",
  related: ["salon", "architect", "service-business"],
  en: {
    name: "Artists and illustrators",
    metaTitle: "Artist Portfolio Website Design with a Shop | Serverlys",
    metaDescription:
      "Artist websites built for you: a fast portfolio, a shop for originals and prints, a commissions form and your Instagram. Custom design from $1,399.",
    h1: "Artist website design that lets the work lead",
    lede:
      "We design and build websites for painters, illustrators, photographers and makers: a portfolio organized by series that loads fast at full quality, a shop for originals and prints through WooCommerce or Shopify, a commissions form that asks the right questions, and your Instagram. Custom design starts at $1,399, scoped in writing first.",
    needs: [
      { title: "A portfolio that stays out of the way", text: "Work grouped by series, medium or year, with title, size, medium and availability under each piece, on a quiet layout that does not compete with the art." },
      { title: "Images that load fast and look right", text: "Each piece exported in web sizes so pages load quickly on a phone, with a zoomable view for detail and colors kept true to the original." },
      { title: "A shop for originals and prints", text: "Originals marked sold or available, limited editions with their edition size, and open prints, sold through WooCommerce on your site or a Shopify store, with shipping and framing options spelled out." },
      { title: "Commissions without the back-and-forth", text: "A commissions page with your process, starting prices or price ranges, and a form that asks for size, subject, reference images, deadline and budget before the first email." },
      { title: "Shows, press and an artist statement", text: "An exhibitions and press list, your CV and statement, and a downloadable press kit for galleries and curators who need it in one place." },
      { title: "Instagram and a mailing list", text: "Your Instagram feed on the site and a newsletter signup for new work and drops, so followers have a way to hear from you that no algorithm controls." },
    ],
    pages: ["Home", "Portfolio (by series)", "Shop", "Commissions", "About and artist statement", "Exhibitions and press", "Newsletter", "Contact"],
    integrations: ["WooCommerce", "Shopify", "Stripe or PayPal checkout", "Print-on-demand such as Printful", "Commissions form", "Instagram feed", "Mailchimp or another newsletter tool"],
    rules: {
      title: "Your images, your rights",
      text: "In the US, you own the copyright in your artwork from the moment you create it, and selling an original does not transfer reproduction rights unless you put that in writing. Your site can state how images may be shared and how licensing requests reach you. We use only images you supply or approve, and show web-sized files rather than print-resolution originals.",
    },
    faq: [
      { question: "Can I sell originals and prints on the same site?", answer: "Yes. We set up WooCommerce on your WordPress site, or connect a Shopify store, with originals as one-of-one items that mark themselves sold and prints with sizes and editions. Print-on-demand services such as Printful can fulfill prints for you if you prefer not to ship them yourself." },
      { question: "Will my images look good and still load fast?", answer: "Yes. We export each piece in several web sizes and let the browser pick the right one, so the portfolio loads quickly on a phone and still looks sharp on a large screen." },
      { question: "Can I update the portfolio myself?", answer: "Yes. The site is built on WordPress and we show you how to add new pieces, series and shop listings. If you would rather spend the time in the studio, site management plans cover updates for you." },
      { question: "How much does an artist website cost?", answer: "Custom design starts at $1,399 for Starter, $1,899 for Plus and $2,699 for Pro, as one-time project prices scoped in writing first. A portfolio with a shop of many prints usually fits Plus or Pro. Hosting is billed separately each month." },
      { question: "How long does it take?", answer: "It depends on the plan and how quickly images, titles and shop details arrive, so we do not publish a number we would have to caveat. You get a timeline with your written scope, before you commit." },
    ],
  },
  es: {
    name: "Artistas e ilustradores",
    metaTitle: "Diseño web para artistas con portafolio | Serverlys",
    metaDescription:
      "Sitios web para artistas hechos por nosotros: un portafolio rápido, tienda de originales y láminas, formulario de encargos y su Instagram. Desde $1,399.",
    h1: "Diseño web para artistas donde la obra manda",
    lede:
      "Diseñamos y construimos sitios web para pintores, ilustradores, fotógrafos y artesanos: un portafolio organizado por series que carga rápido y con calidad, una tienda de originales y láminas con WooCommerce o Shopify, un formulario de encargos con las preguntas correctas y su Instagram. El diseño a medida empieza en $1,399, acordado por escrito primero.",
    needs: [
      { title: "Un portafolio que no estorba", text: "Obras agrupadas por serie, técnica o año, con título, medidas, técnica y disponibilidad bajo cada pieza, en un diseño sobrio que no compite con el arte." },
      { title: "Imágenes que cargan rápido y se ven bien", text: "Cada pieza exportada en tamaños para web para que las páginas carguen rápido en el celular, con vista ampliable para los detalles y colores fieles al original." },
      { title: "Una tienda de originales y láminas", text: "Originales marcados como vendidos o disponibles, ediciones limitadas con su tiraje y láminas abiertas, vendidos con WooCommerce en su sitio o con una tienda Shopify, con envío y opciones de marco bien explicados." },
      { title: "Encargos sin ir y venir de correos", text: "Una página de encargos con su proceso, precios iniciales o rangos de precio, y un formulario que pide medidas, tema, imágenes de referencia, fecha límite y presupuesto antes del primer correo." },
      { title: "Exposiciones, prensa y declaración artística", text: "Una lista de exposiciones y prensa, su CV y su declaración artística, y un dossier de prensa descargable para galerías y curadores que lo necesitan en un solo lugar." },
      { title: "Instagram y una lista de correo", text: "Su feed de Instagram en el sitio y un registro al boletín para obra nueva y lanzamientos, para que sus seguidores tengan una forma de saber de usted que ningún algoritmo controla." },
    ],
    pages: ["Inicio", "Portafolio (por series)", "Tienda", "Encargos", "Sobre mí y declaración artística", "Exposiciones y prensa", "Boletín", "Contacto"],
    integrations: ["WooCommerce", "Shopify", "Pago con Stripe o PayPal", "Impresión bajo demanda como Printful", "Formulario de encargos", "Feed de Instagram", "Mailchimp u otra herramienta de boletines"],
    rules: {
      title: "Sus imágenes, sus derechos",
      text: "En EE. UU., usted es dueño de los derechos de autor de su obra desde el momento en que la crea, y vender un original no transfiere los derechos de reproducción a menos que lo ponga por escrito. Su sitio puede indicar cómo se pueden compartir las imágenes y cómo le llegan las solicitudes de licencia. Usamos solo imágenes que usted entrega o aprueba, y mostramos archivos en tamaño web en lugar de originales en resolución de impresión.",
    },
    faq: [
      { question: "¿Puedo vender originales y láminas en el mismo sitio?", answer: "Sí. Configuramos WooCommerce en su sitio de WordPress, o conectamos una tienda Shopify, con los originales como piezas únicas que se marcan como vendidas y las láminas con medidas y ediciones. Servicios de impresión bajo demanda como Printful pueden enviar las láminas por usted si prefiere no hacerlo." },
      { question: "¿Mis imágenes se verán bien y cargarán rápido?", answer: "Sí. Exportamos cada pieza en varios tamaños para web y el navegador elige el adecuado, así el portafolio carga rápido en el celular y se ve nítido en una pantalla grande." },
      { question: "¿Puedo actualizar el portafolio yo mismo?", answer: "Sí. El sitio está hecho en WordPress y le enseñamos a añadir obras nuevas, series y productos de la tienda. Si prefiere pasar ese tiempo en el taller, los planes de mantenimiento incluyen las actualizaciones." },
      { question: "¿Cuánto cuesta un sitio web para un artista?", answer: "El diseño a medida empieza en $1,399 con Starter, $1,899 con Plus y $2,699 con Pro, como precios únicos de proyecto acordados por escrito primero. Un portafolio con una tienda de muchas láminas suele necesitar Plus o Pro. El hosting se cobra aparte cada mes." },
      { question: "¿Cuánto tiempo tarda?", answer: "Depende del plan y de lo rápido que lleguen las imágenes, los títulos y los datos de la tienda, así que no publicamos un número con letra pequeña. Recibe un calendario junto con el alcance por escrito, antes de comprometerse." },
    ],
  },
};
