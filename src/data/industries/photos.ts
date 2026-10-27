import type { Locale } from "./types";

/**
 * Photography for the industry pages (/website-design/<slug>), and the credits
 * record for every image. GENERATED from an Unsplash selection — edit the alt
 * text here freely, but keep the credit fields matching the file.
 *
 * Source and licence: every photo is from Unsplash under the Unsplash License
 * (https://unsplash.com/license: free for commercial use, attribution not
 * required). None is Unsplash+ / premium (checked: `premium` and `plus` false,
 * served from images.unsplash.com, never plus.unsplash.com). Real photographs
 * only, all uploaded before 2024; no AI-generated imagery. Images with visible
 * brand logos were rejected. Downloaded 2026-10-26 and re-encoded to WebP
 * (q75; hero 1600px wide, others 1200px) into public/industries/<slug>/.
 *
 * The photos are representative of the trade. None shows a Serverlys client,
 * and the page copy must never present them as one.
 *
 * Slot order per industry: [0] hero, [1..3] gallery.
 */
export const PHOTO_LICENSE = "Unsplash License" as const;

export type IndustryPhoto = {
  src: string;
  width: number;
  height: number;
  alt: Record<Locale, string>;
  credit: {
    unsplashId: string;
    photographer: string;
    profileUrl: string;
    pageUrl: string;
  };
};

export const industryPhotos: Readonly<Record<string, readonly IndustryPhoto[]>> = {
  "accounting": [
    {
      src: "/industries/accounting/hero.webp",
      width: 1600,
      height: 1067,
      alt: { en: "Hands entering figures on a calculator at an office desk", es: "Manos introduciendo cifras en una calculadora en un escritorio" },
      credit: {
        unsplashId: "JhevWHCbVyw",
        photographer: "Towfiqu barbhuiya",
        profileUrl: "https://unsplash.com/@towfiqu999999",
        pageUrl: "https://unsplash.com/photos/person-using-calculator-at-desk-with-coffee-mug-JhevWHCbVyw",
      },
    },
    {
      src: "/industries/accounting/photo-1.webp",
      width: 1200,
      height: 689,
      alt: { en: "Tax forms, receipts and a phone calculator spread on a desk", es: "Formularios de impuestos, recibos y una calculadora en un escritorio" },
      credit: {
        unsplashId: "xoU52jUVUXA",
        photographer: "Kelly Sikkema",
        profileUrl: "https://unsplash.com/@kellysikkema",
        pageUrl: "https://unsplash.com/photos/person-holding-paper-near-pen-and-calculator-xoU52jUVUXA",
      },
    },
    {
      src: "/industries/accounting/photo-2.webp",
      width: 1200,
      height: 800,
      alt: { en: "A calculator and pen resting on handwritten working notes", es: "Una calculadora y un bolígrafo sobre notas de trabajo escritas a mano" },
      credit: {
        unsplashId: "Vs6ip7fsld8",
        photographer: "Aaron Lefler",
        profileUrl: "https://unsplash.com/@alefler",
        pageUrl: "https://unsplash.com/photos/a-calculator-and-a-pen-sitting-on-top-of-a-piece-of-paper-Vs6ip7fsld8",
      },
    },
    {
      src: "/industries/accounting/photo-3.webp",
      width: 1200,
      height: 801,
      alt: { en: "A pen on tax statements and a mileage log", es: "Un bolígrafo sobre declaraciones de impuestos y un registro de kilometraje" },
      credit: {
        unsplashId: "5616whx5NdQ",
        photographer: "Olga DeLawrence",
        profileUrl: "https://unsplash.com/@walkingondream",
        pageUrl: "https://unsplash.com/photos/tax-forms-and-mileage-log-book-5616whx5NdQ",
      },
    },
  ],
  "architect": [
    {
      src: "/industries/architect/hero.webp",
      width: 1600,
      height: 900,
      alt: { en: "An architect drafting a plan by hand with pencil and scale ruler", es: "Un arquitecto dibujando un plano a mano con lápiz y escalímetro" },
      credit: {
        unsplashId: "HtBlQdxfG9k",
        photographer: "Daniel McCullough",
        profileUrl: "https://unsplash.com/@d_mccullough",
        pageUrl: "https://unsplash.com/photos/an-architect-working-on-a-draft-with-a-pencil-and-ruler-HtBlQdxfG9k",
      },
    },
    {
      src: "/industries/architect/photo-1.webp",
      width: 1200,
      height: 800,
      alt: { en: "A measured floor plan on a cutting mat with pencils", es: "Un plano de planta acotado sobre una base de corte con lápices" },
      credit: {
        unsplashId: "SAFF_1rWBqE",
        photographer: "SOHAM BANERJEE",
        profileUrl: "https://unsplash.com/@its__strange__",
        pageUrl: "https://unsplash.com/photos/white-printer-paper-with-black-pencil-SAFF_1rWBqE",
      },
    },
    {
      src: "/industries/architect/photo-2.webp",
      width: 1200,
      height: 800,
      alt: { en: "A white architectural model of a small house", es: "Una maqueta arquitectónica blanca de una casa pequeña" },
      credit: {
        unsplashId: "UW4_FYJ_jRc",
        photographer: "Fernando Andrade",
        profileUrl: "https://unsplash.com/@thisisnando",
        pageUrl: "https://unsplash.com/photos/a-model-of-a-house-sitting-on-top-of-a-book-UW4_FYJ_jRc",
      },
    },
    {
      src: "/industries/architect/photo-3.webp",
      width: 1200,
      height: 945,
      alt: { en: "A modern two-storey house with a pergola at dusk", es: "Una casa moderna de dos plantas con pérgola al anochecer" },
      credit: {
        unsplashId: "0n94KqRz6rQ",
        photographer: "juan verdaguer aguerrebehere",
        profileUrl: "https://unsplash.com/@urbanrival",
        pageUrl: "https://unsplash.com/photos/a-modern-house-with-a-pergolated-roof-0n94KqRz6rQ",
      },
    },
  ],
  "artist": [
    {
      src: "/industries/artist/hero.webp",
      width: 1600,
      height: 1059,
      alt: { en: "A painter at work in a studio full of paint jars and canvases", es: "Una pintora trabajando en un estudio lleno de pinturas y lienzos" },
      credit: {
        unsplashId: "Yhsdub0hV1A",
        photographer: "Bárbara Fróes",
        profileUrl: "https://unsplash.com/@barbarafroes",
        pageUrl: "https://unsplash.com/photos/a-woman-standing-in-front-of-a-store-Yhsdub0hV1A",
      },
    },
    {
      src: "/industries/artist/photo-1.webp",
      width: 1200,
      height: 800,
      alt: { en: "An artist in silhouette painting a large canvas", es: "Un artista a contraluz pintando un lienzo grande" },
      credit: {
        unsplashId: "CJH3pS1qA7E",
        photographer: "Mario La Pergola",
        profileUrl: "https://unsplash.com/@mlapergolaphoto",
        pageUrl: "https://unsplash.com/photos/a-person-painting-on-a-wall-CJH3pS1qA7E",
      },
    },
    {
      src: "/industries/artist/photo-2.webp",
      width: 1200,
      height: 629,
      alt: { en: "A studio workbench crowded with brushes and paint tins", es: "Un banco de estudio repleto de pinceles y latas de pintura" },
      credit: {
        unsplashId: "coZ2i9LblM8",
        photographer: "Jorge Zapata",
        profileUrl: "https://unsplash.com/@jorgezapatag",
        pageUrl: "https://unsplash.com/photos/landscape-photography-of-painting-mediums-on-workbench-coZ2i9LblM8",
      },
    },
    {
      src: "/industries/artist/photo-3.webp",
      width: 1200,
      height: 900,
      alt: { en: "Framed works hung on the white walls of a gallery", es: "Obras enmarcadas colgadas en las paredes blancas de una galería" },
      credit: {
        unsplashId: "3GZlhROZIQg",
        photographer: "Dannie Jing",
        profileUrl: "https://unsplash.com/@dannie_jing",
        pageUrl: "https://unsplash.com/photos/assorted-paintings-on-white-painted-wall-3GZlhROZIQg",
      },
    },
  ],
  "chiropractic": [
    {
      src: "/industries/chiropractic/hero.webp",
      width: 1600,
      height: 1067,
      alt: { en: "A practitioner treating a patient lying on a treatment table", es: "Un profesional tratando a un paciente acostado en una camilla" },
      credit: {
        unsplashId: "UNRW1dD2xjI",
        photographer: "yury kirillov",
        profileUrl: "https://unsplash.com/@relievemassage",
        pageUrl: "https://unsplash.com/photos/a-man-getting-a-back-massage-from-a-woman-UNRW1dD2xjI",
      },
    },
    {
      src: "/industries/chiropractic/photo-1.webp",
      width: 1200,
      height: 799,
      alt: { en: "An anatomical model of the lower spine", es: "Un modelo anatómico de la columna lumbar" },
      credit: {
        unsplashId: "OijVdM3Zx4I",
        photographer: "CHUTTERSNAP",
        profileUrl: "https://unsplash.com/@chuttersnap",
        pageUrl: "https://unsplash.com/photos/white-pasta-on-white-paper-OijVdM3Zx4I",
      },
    },
    {
      src: "/industries/chiropractic/photo-2.webp",
      width: 1200,
      height: 800,
      alt: { en: "A clinician guiding a patient through a resistance-band exercise", es: "Un profesional guiando a una paciente en un ejercicio con banda elástica" },
      credit: {
        unsplashId: "mvHuY-t4QII",
        photographer: "Sincerely Media",
        profileUrl: "https://unsplash.com/@sincerelymedia",
        pageUrl: "https://unsplash.com/photos/a-person-holding-a-green-object-in-their-hand-mvHuY-t4QII",
      },
    },
    {
      src: "/industries/chiropractic/photo-3.webp",
      width: 1200,
      height: 801,
      alt: { en: "Hands applying pressure to a patient’s upper back", es: "Manos aplicando presión en la parte alta de la espalda de un paciente" },
      credit: {
        unsplashId: "8qwYA4INVCk",
        photographer: "Edward Muntinga",
        profileUrl: "https://unsplash.com/@edwardmuntinga",
        pageUrl: "https://unsplash.com/photos/hands-pressing-back-in-massage-8qwYA4INVCk",
      },
    },
  ],
  "coaching": [
    {
      src: "/industries/coaching/hero.webp",
      width: 1600,
      height: 1200,
      alt: { en: "A coach leading a small group session at a whiteboard", es: "Un coach dirigiendo una sesión de grupo frente a una pizarra" },
      credit: {
        unsplashId: "wD1LRb9OeEo",
        photographer: "Austin Distel",
        profileUrl: "https://unsplash.com/@austindistel",
        pageUrl: "https://unsplash.com/photos/three-men-sitting-while-using-laptops-and-watching-man-beside-whiteboard-wD1LRb9OeEo",
      },
    },
    {
      src: "/industries/coaching/photo-1.webp",
      width: 1200,
      height: 900,
      alt: { en: "Two people working through sketches pinned across a whiteboard wall", es: "Dos personas trabajando con bocetos en una pared de pizarra" },
      credit: {
        unsplashId: "QPRd_UC3nE4",
        photographer: "Álvaro Bernal",
        profileUrl: "https://unsplash.com/@abn",
        pageUrl: "https://unsplash.com/photos/man-in-gray-sweater-standing-beside-wall-QPRd_UC3nE4",
      },
    },
    {
      src: "/industries/coaching/photo-2.webp",
      width: 1200,
      height: 800,
      alt: { en: "A hand pointing to quarterly goals drawn on a whiteboard", es: "Una mano señalando objetivos trimestrales dibujados en una pizarra" },
      credit: {
        unsplashId: "iW9oP7Ljkbg",
        photographer: "Slidebean",
        profileUrl: "https://unsplash.com/@slidebean",
        pageUrl: "https://unsplash.com/photos/person-writing-on-white-board-iW9oP7Ljkbg",
      },
    },
    {
      src: "/industries/coaching/photo-3.webp",
      width: 1200,
      height: 795,
      alt: { en: "A plan laid out in sticky notes on a whiteboard", es: "Un plan organizado con notas adhesivas en una pizarra" },
      credit: {
        unsplashId: "JXyY3jRV9oI",
        photographer: "Paymo",
        profileUrl: "https://unsplash.com/@paymo",
        pageUrl: "https://unsplash.com/photos/a-white-board-with-sticky-notes-attached-to-it-JXyY3jRV9oI",
      },
    },
  ],
  "construction": [
    {
      src: "/industries/construction/hero.webp",
      width: 1600,
      height: 1067,
      alt: { en: "A crew in hard hats standing on a large construction site", es: "Una cuadrilla con cascos de pie en una gran obra" },
      credit: {
        unsplashId: "x-ghf9LjrVg",
        photographer: "Scott Blake",
        profileUrl: "https://unsplash.com/@sunburned_surveyor",
        pageUrl: "https://unsplash.com/photos/seven-construction-workers-standing-on-white-field-x-ghf9LjrVg",
      },
    },
    {
      src: "/industries/construction/photo-1.webp",
      width: 1200,
      height: 934,
      alt: { en: "Two site supervisors in safety vests reviewing the work ahead", es: "Dos supervisores con chalecos de seguridad revisando la obra" },
      credit: {
        unsplashId: "80zZ1s24Nag",
        photographer: "Joe Holland",
        profileUrl: "https://unsplash.com/@jos_holland111",
        pageUrl: "https://unsplash.com/photos/two-construction-workers-in-safety-vests-at-site-80zZ1s24Nag",
      },
    },
    {
      src: "/industries/construction/photo-2.webp",
      width: 1200,
      height: 800,
      alt: { en: "A worker cutting concrete with an angle grinder", es: "Un trabajador cortando hormigón con una amoladora" },
      credit: {
        unsplashId: "t9eQm2y1tn8",
        photographer: "Glenov Brankovic",
        profileUrl: "https://unsplash.com/@glenovbrankovic",
        pageUrl: "https://unsplash.com/photos/a-man-using-a-grinder-on-a-piece-of-concrete-t9eQm2y1tn8",
      },
    },
    {
      src: "/industries/construction/photo-3.webp",
      width: 1200,
      height: 800,
      alt: { en: "Tower cranes above a building frame under construction", es: "Grúas torre sobre la estructura de un edificio en construcción" },
      credit: {
        unsplashId: "8Gg2Ne_uTcM",
        photographer: "Danist Soh",
        profileUrl: "https://unsplash.com/@danist07",
        pageUrl: "https://unsplash.com/photos/low-angle-photography-of-cranes-on-top-of-building-8Gg2Ne_uTcM",
      },
    },
  ],
  "consulting": [
    {
      src: "/industries/consulting/hero.webp",
      width: 1600,
      height: 1068,
      alt: { en: "A team meeting around a conference table with laptops", es: "Un equipo reunido alrededor de una mesa de juntas con portátiles" },
      credit: {
        unsplashId: "rg1y72eKw6o",
        photographer: "Christina @ wocintechchat.com M",
        profileUrl: "https://unsplash.com/@wocintechchat",
        pageUrl: "https://unsplash.com/photos/photography-of-people-inside-room-during-daytime-rg1y72eKw6o",
      },
    },
    {
      src: "/industries/consulting/photo-1.webp",
      width: 1200,
      height: 800,
      alt: { en: "Colleagues reviewing work on a laptop and taking notes", es: "Colegas revisando trabajo en un portátil y tomando notas" },
      credit: {
        unsplashId: "MnPWB-ybjHQ",
        photographer: "Fatemeh Rezvani",
        profileUrl: "https://unsplash.com/@irzvn_",
        pageUrl: "https://unsplash.com/photos/a-group-of-people-sitting-around-a-laptop-computer-MnPWB-ybjHQ",
      },
    },
    {
      src: "/industries/consulting/photo-2.webp",
      width: 1200,
      height: 800,
      alt: { en: "People taking notes along a wooden meeting table", es: "Personas tomando notas en una mesa de reuniones de madera" },
      credit: {
        unsplashId: "KdeqA3aTnBY",
        photographer: "Dylan Gillis",
        profileUrl: "https://unsplash.com/@mainermedia",
        pageUrl: "https://unsplash.com/photos/people-sitting-on-chair-in-front-of-table-while-holding-pens-during-daytime-KdeqA3aTnBY",
      },
    },
    {
      src: "/industries/consulting/photo-3.webp",
      width: 1200,
      height: 796,
      alt: { en: "A glass-walled meeting room during a client session", es: "Una sala de reuniones acristalada durante una sesión con un cliente" },
      credit: {
        unsplashId: "qCi_MzVODoU",
        photographer: "Campaign Creators",
        profileUrl: "https://unsplash.com/@campaign_creators",
        pageUrl: "https://unsplash.com/photos/people-sitting-near-table-with-laptop-computer-qCi_MzVODoU",
      },
    },
  ],
  "contractor": [
    {
      src: "/industries/contractor/hero.webp",
      width: 1600,
      height: 1067,
      alt: { en: "A remodelled kitchen with white cabinets and a dark island", es: "Una cocina reformada con armarios blancos e isla oscura" },
      credit: {
        unsplashId: "I_QC1JICzA0",
        photographer: "Lotus Design N Print",
        profileUrl: "https://unsplash.com/@lotusdnp",
        pageUrl: "https://unsplash.com/photos/modern-kitchen-with-white-cabinets-I_QC1JICzA0",
      },
    },
    {
      src: "/industries/contractor/photo-1.webp",
      width: 1200,
      height: 800,
      alt: { en: "A room stripped back mid-renovation with temporary supports", es: "Una habitación en plena reforma con puntales provisionales" },
      credit: {
        unsplashId: "biRt6RXejuk",
        photographer: "Stefan Lehner",
        profileUrl: "https://unsplash.com/@st_lehner",
        pageUrl: "https://unsplash.com/photos/room-renovation-with-metal-support-poles-biRt6RXejuk",
      },
    },
    {
      src: "/industries/contractor/photo-2.webp",
      width: 1200,
      height: 800,
      alt: { en: "A finished bathroom with a glass shower and new vanity", es: "Un baño terminado con ducha de vidrio y mueble de lavabo nuevo" },
      credit: {
        unsplashId: "g51F6-WYzyU",
        photographer: "Lotus Design N Print",
        profileUrl: "https://unsplash.com/@lotusdnp",
        pageUrl: "https://unsplash.com/photos/modern-bathroom-with-shower-and-vanity-g51F6-WYzyU",
      },
    },
    {
      src: "/industries/contractor/photo-3.webp",
      width: 1200,
      height: 800,
      alt: { en: "A tradesman on a ladder working on a ceiling", es: "Un operario en una escalera trabajando en el techo" },
      credit: {
        unsplashId: "3coKbdfnAFg",
        photographer: "H&CO",
        profileUrl: "https://unsplash.com/@hngstrm",
        pageUrl: "https://unsplash.com/photos/man-on-white-ladder-3coKbdfnAFg",
      },
    },
  ],
  "dental": [
    {
      src: "/industries/dental/hero.webp",
      width: 1600,
      height: 1067,
      alt: { en: "A dental treatment room with an orange patient chair", es: "Un gabinete dental con un sillón de paciente naranja" },
      credit: {
        unsplashId: "XJptUS8nbhs",
        photographer: "Atikah Akhtar",
        profileUrl: "https://unsplash.com/@atikahakhtar",
        pageUrl: "https://unsplash.com/photos/dental-chair-in-clinical-office-XJptUS8nbhs",
      },
    },
    {
      src: "/industries/dental/photo-1.webp",
      width: 1200,
      height: 800,
      alt: { en: "A gloved hand pointing at a dental scan on a tablet", es: "Una mano con guante señalando una imagen dental en una tableta" },
      credit: {
        unsplashId: "VckdJzo7ig0",
        photographer: "Quang Tri NGUYEN",
        profileUrl: "https://unsplash.com/@quangtri",
        pageUrl: "https://unsplash.com/photos/dentist-pointing-at-dental-scan-VckdJzo7ig0",
      },
    },
    {
      src: "/industries/dental/photo-2.webp",
      width: 1200,
      height: 800,
      alt: { en: "Sterile dental instruments laid out on a tray", es: "Instrumental dental esterilizado sobre una bandeja" },
      credit: {
        unsplashId: "y8fWicGsv4g",
        photographer: "Quilia",
        profileUrl: "https://unsplash.com/@heyquilia",
        pageUrl: "https://unsplash.com/photos/stainless-steel-fork-and-bread-knife-on-white-ceramic-plate-y8fWicGsv4g",
      },
    },
    {
      src: "/industries/dental/photo-3.webp",
      width: 1200,
      height: 800,
      alt: { en: "Dental implant and tooth models on a table", es: "Modelos de implantes y dientes sobre una mesa" },
      credit: {
        unsplashId: "W9YEY6G8LVM",
        photographer: "Jonathan Borba",
        profileUrl: "https://unsplash.com/@jonathanborba",
        pageUrl: "https://unsplash.com/photos/dental-implant-model-with-teeth-W9YEY6G8LVM",
      },
    },
  ],
  "electrician": [
    {
      src: "/industries/electrician/hero.webp",
      width: 1600,
      height: 1200,
      alt: { en: "A wired breaker panel being assembled on a workbench", es: "Un cuadro de interruptores cableado montándose en un banco de trabajo" },
      credit: {
        unsplashId: "kXC6XhVL1e4",
        photographer: "Troy Bridges",
        profileUrl: "https://unsplash.com/@esptroy",
        pageUrl: "https://unsplash.com/photos/black-and-gray-audio-mixer-kXC6XhVL1e4",
      },
    },
    {
      src: "/industries/electrician/photo-1.webp",
      width: 1200,
      height: 800,
      alt: { en: "A clamp meter, pliers and cable on a job-site floor", es: "Una pinza amperimétrica, alicates y cable en el suelo de una obra" },
      credit: {
        unsplashId: "NLBJ2I0lNr4",
        photographer: "Hobi industri",
        profileUrl: "https://unsplash.com/@hobiindustri",
        pageUrl: "https://unsplash.com/photos/black-and-yellow-clamp-meter-NLBJ2I0lNr4",
      },
    },
    {
      src: "/industries/electrician/photo-2.webp",
      width: 1200,
      height: 900,
      alt: { en: "A row of circuit breakers in a distribution board", es: "Una fila de interruptores automáticos en un cuadro de distribución" },
      credit: {
        unsplashId: "oj1zW_PNI4k",
        photographer: "Mark Kats",
        profileUrl: "https://unsplash.com/@bulava92",
        pageUrl: "https://unsplash.com/photos/white-circuit-breakers-oj1zW_PNI4k",
      },
    },
    {
      src: "/industries/electrician/photo-3.webp",
      width: 1200,
      height: 800,
      alt: { en: "Neatly wired breakers inside an electrical cabinet", es: "Interruptores bien cableados dentro de un armario eléctrico" },
      credit: {
        unsplashId: "47jO5Y8nsYo",
        photographer: "mostafa mahmoudi",
        profileUrl: "https://unsplash.com/@mostafa_mahmoudi24",
        pageUrl: "https://unsplash.com/photos/a-bunch-of-wires-are-plugged-into-a-switch-box-47jO5Y8nsYo",
      },
    },
  ],
  "handyman": [
    {
      src: "/industries/handyman/hero.webp",
      width: 1600,
      height: 1067,
      alt: { en: "A handyman on a step ladder fixing a door frame", es: "Un manitas en una escalera arreglando el marco de una puerta" },
      credit: {
        unsplashId: "4hcTkOw-EKE",
        photographer: "Saemi Kim",
        profileUrl: "https://unsplash.com/@saemi_kim",
        pageUrl: "https://unsplash.com/photos/man-in-red-shirt-and-blue-denim-jeans-standing-on-white-wooden-door-4hcTkOw-EKE",
      },
    },
    {
      src: "/industries/handyman/photo-1.webp",
      width: 1200,
      height: 800,
      alt: { en: "A workshop wall of hand tools above a workbench", es: "Una pared de taller con herramientas sobre un banco de trabajo" },
      credit: {
        unsplashId: "0CCVIuAjORE",
        photographer: "Jeff Caron-Robert",
        profileUrl: "https://unsplash.com/@jeffcaron",
        pageUrl: "https://unsplash.com/photos/a-wall-full-of-knives-0CCVIuAjORE",
      },
    },
    {
      src: "/industries/handyman/photo-2.webp",
      width: 1200,
      height: 800,
      alt: { en: "A drill, wrench, pliers and tape measure on a work surface", es: "Un taladro, una llave, alicates y una cinta métrica sobre una superficie" },
      credit: {
        unsplashId: "iwz5tmhjl7o",
        photographer: "Bermix Studio",
        profileUrl: "https://unsplash.com/@bermixstudio",
        pageUrl: "https://unsplash.com/photos/a-variety-of-tools-are-sitting-on-a-table-iwz5tmhjl7o",
      },
    },
    {
      src: "/industries/handyman/photo-3.webp",
      width: 1200,
      height: 807,
      alt: { en: "Two well-used metal toolboxes", es: "Dos cajas de herramientas metálicas muy usadas" },
      credit: {
        unsplashId: "2nSdQEd-Exc",
        photographer: "Susan Holt Simpson",
        profileUrl: "https://unsplash.com/@shs521",
        pageUrl: "https://unsplash.com/photos/two-rectangular-green-and-red-tool-cases-on-white-surface-2nSdQEd-Exc",
      },
    },
  ],
  "landscaping": [
    {
      src: "/industries/landscaping/hero.webp",
      width: 1600,
      height: 1067,
      alt: { en: "Landscaped flower beds and clipped shrubs in a large garden", es: "Parterres de flores y arbustos podados en un gran jardín" },
      credit: {
        unsplashId: "KcQuXaHCSPE",
        photographer: "Jan Canty",
        profileUrl: "https://unsplash.com/@jcanty123",
        pageUrl: "https://unsplash.com/photos/flower-beds-in-the-butchart-gardens-KcQuXaHCSPE",
      },
    },
    {
      src: "/industries/landscaping/photo-1.webp",
      width: 1200,
      height: 800,
      alt: { en: "A push mower cutting a lawn", es: "Un cortacésped cortando el césped" },
      credit: {
        unsplashId: "YhxOrHGrQQc",
        photographer: "Carl Tronders",
        profileUrl: "https://unsplash.com/@allvar",
        pageUrl: "https://unsplash.com/photos/a-person-mowing-the-grass-with-a-lawn-mower-YhxOrHGrQQc",
      },
    },
    {
      src: "/industries/landscaping/photo-2.webp",
      width: 1200,
      height: 800,
      alt: { en: "A planted garden path lined with flowering perennials", es: "Un sendero de jardín bordeado de plantas perennes en flor" },
      credit: {
        unsplashId: "NkPdYb8ZMig",
        photographer: "Martina Jorden",
        profileUrl: "https://unsplash.com/@martinaj",
        pageUrl: "https://unsplash.com/photos/a-garden-filled-with-lots-of-different-types-of-flowers-NkPdYb8ZMig",
      },
    },
    {
      src: "/industries/landscaping/photo-3.webp",
      width: 1200,
      height: 900,
      alt: { en: "A wooden deck with outdoor seating and potted plants, seen from above", es: "Una terraza de madera con asientos y macetas, vista desde arriba" },
      credit: {
        unsplashId: "28c3pajQlyI",
        photographer: "Cameron Smith",
        profileUrl: "https://unsplash.com/@cameronsmith",
        pageUrl: "https://unsplash.com/photos/wooden-deck-with-outdoor-furniture-28c3pajQlyI",
      },
    },
  ],
  "lawyer": [
    {
      src: "/industries/lawyer/hero.webp",
      width: 1600,
      height: 1067,
      alt: { en: "Shelves of bound law volumes in a library", es: "Estanterías con volúmenes de derecho encuadernados en una biblioteca" },
      credit: {
        unsplashId: "OPzWvgL-upY",
        photographer: "Giammarco Boscaro",
        profileUrl: "https://unsplash.com/@giamboscaro",
        pageUrl: "https://unsplash.com/photos/black-wooden-d-and-c-bookshelf-OPzWvgL-upY",
      },
    },
    {
      src: "/industries/lawyer/photo-1.webp",
      width: 1200,
      height: 900,
      alt: { en: "Two people signing documents at a table", es: "Dos personas firmando documentos en una mesa" },
      credit: {
        unsplashId: "doplSDELX7E",
        photographer: "Romain Dancre",
        profileUrl: "https://unsplash.com/@romaindancre",
        pageUrl: "https://unsplash.com/photos/person-in-orange-long-sleeve-shirt-writing-on-white-paper-doplSDELX7E",
      },
    },
    {
      src: "/industries/lawyer/photo-2.webp",
      width: 1200,
      height: 800,
      alt: { en: "A statue of Lady Justice holding scales", es: "Una estatua de la Justicia sosteniendo la balanza" },
      credit: {
        unsplashId: "DZpc4UY8ZtY",
        photographer: "Tingey Injury Law Firm",
        profileUrl: "https://unsplash.com/@tingeyinjurylawfirm",
        pageUrl: "https://unsplash.com/photos/woman-holding-sword-statue-during-daytime-DZpc4UY8ZtY",
      },
    },
    {
      src: "/industries/lawyer/photo-3.webp",
      width: 1200,
      height: 800,
      alt: { en: "A client and adviser reviewing paperwork together", es: "Una clienta y una asesora revisando documentos juntas" },
      credit: {
        unsplashId: "HJckKnwCXxQ",
        photographer: "Gabrielle Henderson",
        profileUrl: "https://unsplash.com/@gabriellefaithhenderson",
        pageUrl: "https://unsplash.com/photos/woman-signing-on-white-printer-paper-beside-woman-about-to-touch-the-documents-HJckKnwCXxQ",
      },
    },
  ],
  "life-coach": [
    {
      src: "/industries/life-coach/hero.webp",
      width: 1600,
      height: 1067,
      alt: { en: "Two people talking over coffee at a wooden table", es: "Dos personas conversando con un café en una mesa de madera" },
      credit: {
        unsplashId: "g86airJZ4Gs",
        photographer: "Priscilla Du Preez 🇨🇦",
        profileUrl: "https://unsplash.com/@priscilladupreez",
        pageUrl: "https://unsplash.com/photos/two-mugs-with-coffee-on-table-g86airJZ4Gs",
      },
    },
    {
      src: "/industries/life-coach/photo-1.webp",
      width: 1200,
      height: 800,
      alt: { en: "A hand writing in a journal with a red pen", es: "Una mano escribiendo en un diario con un bolígrafo rojo" },
      credit: {
        unsplashId: "333oj7zFsdg",
        photographer: "lilartsy",
        profileUrl: "https://unsplash.com/@lilartsy",
        pageUrl: "https://unsplash.com/photos/person-holding-on-red-pen-while-writing-on-book-333oj7zFsdg",
      },
    },
    {
      src: "/industries/life-coach/photo-2.webp",
      width: 1200,
      height: 800,
      alt: { en: "A person walking down a country lane in morning light", es: "Una persona caminando por un camino rural con luz de mañana" },
      credit: {
        unsplashId: "mNGaaLeWEp0",
        photographer: "Emma Simpson",
        profileUrl: "https://unsplash.com/@esdesignisms",
        pageUrl: "https://unsplash.com/photos/woman-walking-on-pathway-during-daytime-mNGaaLeWEp0",
      },
    },
    {
      src: "/industries/life-coach/photo-3.webp",
      width: 1200,
      height: 800,
      alt: { en: "A monthly planner open with two pens", es: "Una agenda mensual abierta con dos bolígrafos" },
      credit: {
        unsplashId: "cdDDWLezAJ0",
        photographer: "2H Media",
        profileUrl: "https://unsplash.com/@2hmedia",
        pageUrl: "https://unsplash.com/photos/a-planner-with-two-pens-sitting-on-top-of-it-cdDDWLezAJ0",
      },
    },
  ],
  "medical": [
    {
      src: "/industries/medical/hero.webp",
      width: 1600,
      height: 1078,
      alt: { en: "A bright, modern clinic waiting area with plants", es: "Una sala de espera de clínica moderna y luminosa con plantas" },
      credit: {
        unsplashId: "HuWm7malJ18",
        photographer: "Petr",
        profileUrl: "https://unsplash.com/@mpetrucho",
        pageUrl: "https://unsplash.com/photos/green-potted-plant-on-white-ceramic-floor-tiles-HuWm7malJ18",
      },
    },
    {
      src: "/industries/medical/photo-1.webp",
      width: 1200,
      height: 675,
      alt: { en: "A doctor in a white coat holding a stethoscope", es: "Un médico con bata blanca sosteniendo un estetoscopio" },
      credit: {
        unsplashId: "hIgeoQjS_iE",
        photographer: "Online Marketing",
        profileUrl: "https://unsplash.com/@impulsq",
        pageUrl: "https://unsplash.com/photos/doctor-holding-red-stethoscope-hIgeoQjS_iE",
      },
    },
    {
      src: "/industries/medical/photo-2.webp",
      width: 1200,
      height: 779,
      alt: { en: "A clinic waiting room with turquoise seating", es: "Una sala de espera de clínica con asientos turquesa" },
      credit: {
        unsplashId: "B_sK_xgzwVA",
        photographer: "Benyamin Bohlouli",
        profileUrl: "https://unsplash.com/@benyamin_bohlouli",
        pageUrl: "https://unsplash.com/photos/blue-couch-beside-green-potted-plant-B_sK_xgzwVA",
      },
    },
    {
      src: "/industries/medical/photo-3.webp",
      width: 1200,
      height: 822,
      alt: { en: "Clinical staff in scrubs walking down a hospital corridor", es: "Personal clínico con uniforme caminando por un pasillo de hospital" },
      credit: {
        unsplashId: "Pd4lRfKo16U",
        photographer: "Luis Melendez",
        profileUrl: "https://unsplash.com/@lcma1028",
        pageUrl: "https://unsplash.com/photos/group-of-doctors-walking-on-hospital-hallway-Pd4lRfKo16U",
      },
    },
  ],
  "mortgage": [
    {
      src: "/industries/mortgage/hero.webp",
      width: 1600,
      height: 1067,
      alt: { en: "A large family home with a wraparound porch", es: "Una casa familiar grande con porche alrededor" },
      credit: {
        unsplashId: "178j8tJrNlc",
        photographer: "todd kent",
        profileUrl: "https://unsplash.com/@churchoftodd",
        pageUrl: "https://unsplash.com/photos/gray-wooden-house-178j8tJrNlc",
      },
    },
    {
      src: "/industries/mortgage/photo-1.webp",
      width: 1200,
      height: 901,
      alt: { en: "House keys next to a small model house", es: "Llaves de casa junto a una pequeña maqueta de vivienda" },
      credit: {
        unsplashId: "rgJ1J8SDEAY",
        photographer: "Tierra Mallorca",
        profileUrl: "https://unsplash.com/@tierramallorca",
        pageUrl: "https://unsplash.com/photos/white-and-red-wooden-house-miniature-on-brown-table-rgJ1J8SDEAY",
      },
    },
    {
      src: "/industries/mortgage/photo-2.webp",
      width: 1200,
      height: 801,
      alt: { en: "A hand signing a printed agreement", es: "Una mano firmando un contrato impreso" },
      credit: {
        unsplashId: "GJao3ZTX9gU",
        photographer: "Cytonn Photography",
        profileUrl: "https://unsplash.com/@cytonn_photography",
        pageUrl: "https://unsplash.com/photos/person-writing-on-white-paper-GJao3ZTX9gU",
      },
    },
    {
      src: "/industries/mortgage/photo-3.webp",
      width: 1200,
      height: 800,
      alt: { en: "An aerial view of a suburban neighbourhood", es: "Vista aérea de un barrio residencial" },
      credit: {
        unsplashId: "r3WAWU5Fi5Q",
        photographer: "Breno Assis",
        profileUrl: "https://unsplash.com/@brenoassis",
        pageUrl: "https://unsplash.com/photos/aerial-view-of-suburban-neighborhood-houses-r3WAWU5Fi5Q",
      },
    },
  ],
  "roofing": [
    {
      src: "/industries/roofing/hero.webp",
      width: 1600,
      height: 1067,
      alt: { en: "Two roofers in safety harnesses measuring a shingle roof", es: "Dos techadores con arnés midiendo un tejado de tejas asfálticas" },
      credit: {
        unsplashId: "MyBBMM317A4",
        photographer: "Raze Solar",
        profileUrl: "https://unsplash.com/@razesolar",
        pageUrl: "https://unsplash.com/photos/a-couple-of-people-that-are-on-a-roof-MyBBMM317A4",
      },
    },
    {
      src: "/industries/roofing/photo-1.webp",
      width: 1200,
      height: 800,
      alt: { en: "A roofer carrying a bundle of shingles across a roof", es: "Un techador cargando un paquete de tejas por el tejado" },
      credit: {
        unsplashId: "4XMHsy4Rvi8",
        photographer: "Zohair Mirza",
        profileUrl: "https://unsplash.com/@zamclicks",
        pageUrl: "https://unsplash.com/photos/person-carrying-shingles-on-roof-4XMHsy4Rvi8",
      },
    },
    {
      src: "/industries/roofing/photo-2.webp",
      width: 1200,
      height: 800,
      alt: { en: "A crew stripping and re-roofing a house", es: "Una cuadrilla retirando y renovando el tejado de una casa" },
      credit: {
        unsplashId: "dRXYCE5eQpk",
        photographer: "Compagnons",
        profileUrl: "https://unsplash.com/@sigmund",
        pageUrl: "https://unsplash.com/photos/a-couple-of-men-standing-on-top-of-a-roof-dRXYCE5eQpk",
      },
    },
    {
      src: "/industries/roofing/photo-3.webp",
      width: 1200,
      height: 800,
      alt: { en: "Close-up of clay roof tiles", es: "Primer plano de tejas de barro" },
      credit: {
        unsplashId: "Jii1bSg3Q_I",
        photographer: "Peter Muscutt",
        profileUrl: "https://unsplash.com/@peterm4988372",
        pageUrl: "https://unsplash.com/photos/brown-roof-tiles-in-close-up-photography-Jii1bSg3Q_I",
      },
    },
  ],
  "salon": [
    {
      src: "/industries/salon/hero.webp",
      width: 1600,
      height: 1067,
      alt: { en: "A modern hair salon with styling chairs and round mirrors", es: "Un salón de peluquería moderno con sillones y espejos redondos" },
      credit: {
        unsplashId: "LGXN4OSQSa4",
        photographer: "Benyamin Bohlouli",
        profileUrl: "https://unsplash.com/@benyamin_bohlouli",
        pageUrl: "https://unsplash.com/photos/modern-hair-salon-with-black-chairs-LGXN4OSQSa4",
      },
    },
    {
      src: "/industries/salon/photo-1.webp",
      width: 1200,
      height: 801,
      alt: { en: "A stylist blow-drying a client’s hair with a round brush", es: "Una estilista secando el pelo de una clienta con cepillo redondo" },
      credit: {
        unsplashId: "FkAZqQJTbXM",
        photographer: "Adam Winger",
        profileUrl: "https://unsplash.com/@awcreativeut",
        pageUrl: "https://unsplash.com/photos/hairstylist-blow-drying-client-hair-FkAZqQJTbXM",
      },
    },
    {
      src: "/industries/salon/photo-2.webp",
      width: 1200,
      height: 800,
      alt: { en: "A barber cutting a client’s fade with clippers", es: "Un barbero haciendo un degradado con máquina" },
      credit: {
        unsplashId: "Q82AM6BWBPM",
        photographer: "Michael DeMoya",
        profileUrl: "https://unsplash.com/@demoya",
        pageUrl: "https://unsplash.com/photos/man-in-white-dress-shirt-cutting-hair-of-man-Q82AM6BWBPM",
      },
    },
    {
      src: "/industries/salon/photo-3.webp",
      width: 1200,
      height: 800,
      alt: { en: "Scissors and combs laid out on a towel at a barber station", es: "Tijeras y peines sobre una toalla en un puesto de barbería" },
      credit: {
        unsplashId: "pu20JkUx--A",
        photographer: "Arthur Humeau",
        profileUrl: "https://unsplash.com/@_aaarthy",
        pageUrl: "https://unsplash.com/photos/gray-stainless-steel-scissors-on-towel-pu20JkUx--A",
      },
    },
  ],
  "service-business": [
    {
      src: "/industries/service-business/hero.webp",
      width: 1600,
      height: 1200,
      alt: { en: "A plumber repairing pipework under a sink", es: "Un fontanero reparando tuberías bajo un fregadero" },
      credit: {
        unsplashId: "c314Gh8dXAo",
        photographer: "Timur Shakerzianov",
        profileUrl: "https://unsplash.com/@shaker_jpg",
        pageUrl: "https://unsplash.com/photos/a-man-working-on-a-pipe-in-a-wall-c314Gh8dXAo",
      },
    },
    {
      src: "/industries/service-business/photo-1.webp",
      width: 1200,
      height: 800,
      alt: { en: "A cleaner vacuuming an upholstered ottoman", es: "Una limpiadora aspirando un puf tapizado" },
      credit: {
        unsplashId: "5TXz228u4eo",
        photographer: "Giorgio Trovato",
        profileUrl: "https://unsplash.com/@giorgiotrovato",
        pageUrl: "https://unsplash.com/photos/a-woman-in-a-green-shirt-and-black-gloves-vacuuming-a-gray-ottoman-5TXz228u4eo",
      },
    },
    {
      src: "/industries/service-business/photo-2.webp",
      width: 1200,
      height: 800,
      alt: { en: "A pest-control technician treating the garden beds around a house", es: "Un técnico de control de plagas tratando los parterres de una casa" },
      credit: {
        unsplashId: "UjGSnzfDUl8",
        photographer: "Pro Pest Control Canberra",
        profileUrl: "https://unsplash.com/@propestcanberra",
        pageUrl: "https://unsplash.com/photos/a-man-with-a-vacuum-in-front-of-a-house-UjGSnzfDUl8",
      },
    },
    {
      src: "/industries/service-business/photo-3.webp",
      width: 1200,
      height: 1080,
      alt: { en: "A pipe wrench tightening a fitting on a water heater", es: "Una llave de tubo apretando una conexión de un calentador de agua" },
      credit: {
        unsplashId: "C-oYJoIfgCs",
        photographer: "Marian Florinel Condruz",
        profileUrl: "https://unsplash.com/@gottapics",
        pageUrl: "https://unsplash.com/photos/person-holding-yellow-and-gray-hand-tool-C-oYJoIfgCs",
      },
    },
  ],
  "therapist": [
    {
      src: "/industries/therapist/hero.webp",
      width: 1600,
      height: 1054,
      alt: { en: "A calm therapy office with a sofa and armchairs", es: "Una consulta de terapia tranquila con sofá y sillones" },
      credit: {
        unsplashId: "hAh4Unn50gk",
        photographer: "MINDY JACOBS",
        profileUrl: "https://unsplash.com/@mindyj",
        pageUrl: "https://unsplash.com/photos/two-white-throw-pillows-on-top-of-grey-sofa-hAh4Unn50gk",
      },
    },
    {
      src: "/industries/therapist/photo-1.webp",
      width: 1200,
      height: 800,
      alt: { en: "Clasped hands of two people sitting in conversation", es: "Manos entrelazadas de dos personas sentadas conversando" },
      credit: {
        unsplashId: "F9DFuJoS9EU",
        photographer: "Priscilla Du Preez 🇨🇦",
        profileUrl: "https://unsplash.com/@priscilladupreez",
        pageUrl: "https://unsplash.com/photos/woman-in-denim-jacket-sitting-F9DFuJoS9EU",
      },
    },
    {
      src: "/industries/therapist/photo-2.webp",
      width: 1200,
      height: 893,
      alt: { en: "A bright room with a sofa, plants and bookshelves", es: "Una sala luminosa con sofá, plantas y estanterías" },
      credit: {
        unsplashId: "3wylDrjxH-E",
        photographer: "Patrick Perkins",
        profileUrl: "https://unsplash.com/@patrickperkins",
        pageUrl: "https://unsplash.com/photos/gray-fabric-loveseat-near-brown-wooden-table-3wylDrjxH-E",
      },
    },
    {
      src: "/industries/therapist/photo-3.webp",
      width: 1200,
      height: 800,
      alt: { en: "An armchair and sofa by a window with a city view", es: "Un sillón y un sofá junto a una ventana con vistas a la ciudad" },
      credit: {
        unsplashId: "skLqGtLrYKc",
        photographer: "Alexander Pemberton",
        profileUrl: "https://unsplash.com/@socios",
        pageUrl: "https://unsplash.com/photos/orange-fabric-padded-armchair-with-black-metal-base-near-round-clear-glass-top-table-and-gray-sofa-skLqGtLrYKc",
      },
    },
  ],
};

export function photosFor(slug: string): readonly IndustryPhoto[] {
  return industryPhotos[slug] ?? [];
}
