/**
 * Lumbre — the FICTIONAL restaurant behind /restaurant-websites/demo.
 *
 * Every fact here is invented for the demo and the page says so on screen.
 * Never emit Restaurant/Menu schema for it: structured data about a business
 * that does not exist is a fabricated entity, whatever the page disclaims.
 *
 * ⚠ The landing page's sample chat says "seven dishes are gluten-free,
 * including the churrasco and the pollo a la brasa" (explorer.ui.chatPrompts
 * in _content/*.ts). Keep the `gf` count at 7 or change both.
 */

export type Bilingual = { en: string; es: string };

export type CategoryId = "starters" | "fire" | "garden" | "desserts" | "drinks";

export type Tag = "veg" | "gf" | "spicy";

export type MenuItem = {
  id: string;
  category: CategoryId;
  name: Bilingual;
  description: Bilingual;
  price: number;
  photo: string;
  tags: readonly Tag[];
  popular?: boolean;
  /** One required choice, e.g. steak temperature. */
  options?: { label: Bilingual; choices: readonly Bilingual[] };
};

export const CATEGORIES: readonly { id: CategoryId; label: Bilingual }[] = [
  { id: "starters", label: { en: "To start", es: "Para empezar" } },
  { id: "fire", label: { en: "From the fire", es: "Del fuego" } },
  { id: "garden", label: { en: "Sea & garden", es: "Mar y huerta" } },
  { id: "desserts", label: { en: "Desserts", es: "Postres" } },
  { id: "drinks", label: { en: "Drinks", es: "Bebidas" } },
];

const TEMPS: readonly Bilingual[] = [
  { en: "Rare", es: "Término rojo" },
  { en: "Medium rare", es: "Término medio rojo" },
  { en: "Medium", es: "Término medio" },
  { en: "Well done", es: "Bien cocido" },
];

export const MENU: readonly MenuItem[] = [
  {
    id: "rolls",
    category: "starters",
    name: { en: "House rolls", es: "Pan de la casa" },
    description: {
      en: "Warm garlic-herb rolls, guava butter",
      es: "Panecillos tibios de ajo y hierbas, mantequilla de guayaba",
    },
    price: 9,
    photo: "/restaurant/rolls.jpg",
    tags: ["veg"],
  },
  {
    id: "tartare",
    category: "starters",
    name: { en: "Tuna tartare", es: "Tartar de atún" },
    description: {
      en: "Ahi tuna, avocado, citrus soy, crispy plantain",
      es: "Atún ahi, aguacate, soya cítrica, plátano crujiente",
    },
    price: 19,
    photo: "/restaurant/tartare.jpg",
    tags: [],
  },
  {
    id: "skewers",
    category: "starters",
    name: { en: "Charcoal skewers", es: "Brochetas al carbón" },
    description: {
      en: "Chicken and chorizo skewers, green chimichurri",
      es: "Brochetas de pollo y chorizo, chimichurri verde",
    },
    price: 17,
    photo: "/restaurant/skewers.jpg",
    tags: ["gf"],
  },
  {
    id: "tacos",
    category: "starters",
    name: { en: "Asada tacos", es: "Tacos de asada" },
    description: {
      en: "Three corn tacos, flank steak, pickled onion, salsa macha",
      es: "Tres tacos de maíz, falda de res, cebolla encurtida, salsa macha",
    },
    price: 16,
    photo: "/restaurant/tacos.jpg",
    tags: ["gf", "spicy"],
  },
  {
    id: "churrasco",
    category: "fire",
    name: { en: "Churrasco", es: "Churrasco" },
    description: {
      en: "10 oz skirt steak off the wood fire, chimichurri, yuca fries",
      es: "Entraña de 10 oz a la leña, chimichurri, yuca frita",
    },
    price: 38,
    photo: "/restaurant/churrasco.jpg",
    tags: ["gf"],
    popular: true,
    options: { label: { en: "Temperature", es: "Término" }, choices: TEMPS },
  },
  {
    id: "ribs",
    category: "fire",
    name: { en: "Tamarind short ribs", es: "Costillas al tamarindo" },
    description: {
      en: "Slow-smoked short ribs, tamarind-soy glaze, charred tomato",
      es: "Costillas ahumadas lentamente, glaseado de tamarindo y soya, tomate asado",
    },
    price: 34,
    photo: "/restaurant/short-ribs.jpg",
    tags: [],
  },
  {
    id: "chicken",
    category: "fire",
    name: { en: "Pollo a la brasa", es: "Pollo a la brasa" },
    description: {
      en: "Half chicken, pineapple salsa, charred broccolini",
      es: "Medio pollo, salsa de piña, brócoli tierno asado",
    },
    price: 27,
    photo: "/restaurant/chicken.jpg",
    tags: ["gf"],
    popular: true,
  },
  {
    id: "salmon",
    category: "fire",
    name: { en: "Ember salmon", es: "Salmón a las brasas" },
    description: {
      en: "Salmon, coconut-lime sauce, crispy capers",
      es: "Salmón, salsa de coco y limón, alcaparras crujientes",
    },
    price: 31,
    photo: "/restaurant/salmon.jpg",
    tags: ["gf"],
  },
  {
    id: "shrimp",
    category: "garden",
    name: { en: "Shrimp criollo", es: "Camarones a la criolla" },
    description: {
      en: "Gulf shrimp, criollo sauce, white rice, cilantro",
      es: "Camarones del Golfo, salsa criolla, arroz blanco, cilantro",
    },
    price: 29,
    photo: "/restaurant/shrimp-rice.jpg",
    tags: ["gf", "spicy"],
  },
  {
    id: "pasta",
    category: "garden",
    name: { en: "Seafood linguine", es: "Linguine de mariscos" },
    description: {
      en: "Shrimp, cherry tomato, garlic, white wine, chili",
      es: "Camarones, tomate cherry, ajo, vino blanco, ají",
    },
    price: 28,
    photo: "/restaurant/shrimp-pasta.jpg",
    tags: [],
    popular: true,
  },
  {
    id: "bowl",
    category: "garden",
    name: { en: "Garden bowl", es: "Bowl de la huerta" },
    description: {
      en: "Quinoa, roasted vegetables, avocado, pickled red onion. Vegan",
      es: "Quinoa, vegetales asados, aguacate, cebolla morada encurtida. Vegano",
    },
    price: 18,
    photo: "/restaurant/bowl.jpg",
    tags: ["veg", "gf"],
  },
  {
    id: "cake",
    category: "desserts",
    name: { en: "Strawberry tres leches", es: "Tres leches de fresa" },
    description: {
      en: "Three-milk sponge, fresh strawberries, whipped cream",
      es: "Bizcocho de tres leches, fresas frescas, crema batida",
    },
    price: 12,
    photo: "/restaurant/cake.jpg",
    tags: ["veg"],
  },
  {
    id: "pannacotta",
    category: "desserts",
    name: { en: "Passion fruit panna cotta", es: "Panna cotta de maracuyá" },
    description: {
      en: "Vanilla panna cotta, passion fruit, cookie crumble",
      es: "Panna cotta de vainilla, maracuyá, galleta triturada",
    },
    price: 11,
    photo: "/restaurant/panna-cotta.jpg",
    tags: ["veg"],
  },
  {
    id: "oldfashioned",
    category: "drinks",
    name: { en: "Coffee old fashioned", es: "Old fashioned de café" },
    description: {
      en: "Bourbon, Cuban coffee, demerara, orange",
      es: "Bourbon, café cubano, azúcar demerara, naranja",
    },
    price: 16,
    photo: "/restaurant/old-fashioned.jpg",
    tags: [],
  },
  {
    id: "margarita",
    category: "drinks",
    name: { en: "Tamarind margarita", es: "Margarita de tamarindo" },
    description: {
      en: "Tequila blanco, tamarind, lime, chili-salt rim",
      es: "Tequila blanco, tamarindo, limón, escarchado de sal y chile",
    },
    price: 15,
    photo: "/restaurant/margaritas.jpg",
    tags: ["spicy"],
  },
  {
    id: "mocktails",
    category: "drinks",
    name: { en: "Zero-proof flight", es: "Trío sin alcohol" },
    description: {
      en: "Three small mocktails: guava, mint-lime, hibiscus",
      es: "Tres cocteles sin alcohol: guayaba, menta y limón, flor de Jamaica",
    },
    price: 14,
    photo: "/restaurant/cocktails.jpg",
    tags: [],
  },
];

/** Florida 6% + Miami-Dade 1% surtax. Shown as an estimate in the demo cart. */
export const TAX_RATE = 0.07;
export const DELIVERY_FEE = 4.99;

/**
 * Opening hours by weekday (0 = Sunday). Null is closed. Times are minutes
 * after midnight so slot maths stays integer.
 */
export const HOURS: readonly ({ open: number; close: number } | null)[] = [
  { open: 12 * 60, close: 21 * 60 }, // Sun
  null, // Mon
  { open: 17 * 60, close: 22 * 60 }, // Tue
  { open: 17 * 60, close: 22 * 60 }, // Wed
  { open: 17 * 60, close: 22 * 60 }, // Thu
  { open: 17 * 60, close: 23 * 60 }, // Fri
  { open: 17 * 60, close: 23 * 60 }, // Sat
];

export const money = (n: number) => `$${n.toFixed(2)}`;

export const glutenFreeCount = MENU.filter((m) => m.tags.includes("gf")).length;
