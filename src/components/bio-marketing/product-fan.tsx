import Image from "next/image";

/**
 * Bento card art for "Show products and services": real product cards —
 * photo, name, price and the external checkout each one links to. Serverlys
 * Bio shows the product; the sale happens on the owner's checkout, which is
 * why every button names one. A 2×2 grid on phones (names stay readable), a
 * fan from `sm` up.
 */
const PRODUCTS = [
  { img: "watch", name: "Field watch", price: "$129", via: "Shopify" },
  { img: "headphones", name: "Headphones", price: "$89", via: "Stripe" },
  { img: "candle", name: "Cedar candle", price: "$34", via: "Square" },
  { img: "mug", name: "Stoneware mug", price: "$22", via: "Etsy" },
] as const;

const FAN = [
  "rotate(-6deg) translateY(8px)",
  "rotate(-2deg)",
  "rotate(2deg)",
  "rotate(6deg) translateY(8px)",
];

export function ProductFan() {
  return (
    <div
      aria-hidden="true"
      className="flex flex-wrap justify-center gap-2 sm:flex-nowrap sm:items-end sm:gap-1.5"
    >
      {PRODUCTS.map((p, i) => (
        <div
          key={p.img}
          className="w-[47%] shrink-0 rounded-[18px] bg-white p-2.5 text-[#101011] shadow-[0_14px_30px_-14px_rgb(0_0_0/0.45)] sm:w-[24%] sm:max-w-[150px] sm:[transform:var(--fan)]"
          style={{ "--fan": FAN[i], zIndex: i + 1 } as React.CSSProperties}
        >
          <Image
            src={`/bio/products/${p.img}.webp`}
            alt=""
            width={240}
            height={240}
            className="aspect-square w-full rounded-[12px] object-cover"
          />
          <p className="mt-2 truncate text-[13px] font-semibold">{p.name}</p>
          <p className="text-[13px] font-bold text-[#0000ff]">{p.price}</p>
          <span className="mt-1.5 block truncate rounded-full bg-[#101011] px-2 py-1 text-center text-[11px] font-semibold text-white">
            Buy · {p.via}
          </span>
        </div>
      ))}
    </div>
  );
}
