import { MockPhoto } from "@/components/ui/mock-photo";

/*
 * Real-looking product shots for the services pages (website-design, seo,
 * social-media, marketing). They replace `SitePreviewMock`, whose product
 * tiles were flat gradient blocks. Photography from /public/mock (see
 * CREDITS.md); every number shown is example data inside an obvious mockup.
 */

/** Hartley Bakery's site: banner photo, three products with photos and prices. */
export function BakerySite() {
  return (
    <div aria-hidden="true" className="overflow-hidden rounded-2xl bg-white shadow-e4 ring-1 ring-black/5">
      <div className="flex items-center gap-2 border-b border-line-subtle bg-canvas-secondary px-3 py-2">
        <span className="size-2.5 rounded-full bg-[#ff5f57]" />
        <span className="size-2.5 rounded-full bg-[#febc2e]" />
        <span className="size-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-2 flex-1 rounded-md bg-white px-2.5 py-1 text-[11px] text-fg-secondary ring-1 ring-line-subtle">
          hartleybakery.com
        </span>
      </div>
      <div className="flex items-center justify-between px-5 py-3 text-[11px]">
        <span className="text-small font-semibold tracking-[0.18em] text-fg">HARTLEY</span>
        <span className="hidden gap-4 text-fg-secondary sm:flex">
          <span>Menu</span>
          <span>Order</span>
          <span>Visit</span>
        </span>
        <span className="rounded-full bg-fg px-2.5 py-1 font-semibold text-white">Order ahead</span>
      </div>
      <div className="relative mx-3 h-40 overflow-hidden rounded-xl">
        <div className="absolute inset-0">
          <MockPhoto src="bread" className="h-full" sizes="560px" eager />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/65 to-transparent" />
        <div className="absolute top-1/2 left-5 -translate-y-1/2 text-white">
          <p className="text-[22px] leading-tight font-semibold tracking-[-0.02em]">
            Bread, cakes and
            <br />
            very good coffee.
          </p>
          <p className="mt-1 text-[11px] opacity-85">Baked on site every morning since 2011.</p>
          <span className="mt-2 inline-block rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-fg">See the menu</span>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2.5 p-3">
        {(
          [
            ["bread-sliced", "Country sourdough", "$8.50"],
            ["coffee", "Flat white", "$4.25"],
            ["mug", "Hartley mug", "$16.00"],
          ] as const
        ).map(([src, name, price]) => (
          <div key={src}>
            <MockPhoto src={src} className="aspect-[4/3] rounded-lg" eager />
            <p className="mt-1.5 truncate text-[11px] font-medium text-fg">{name}</p>
            <p className="text-[11px] text-fg-secondary">{price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/** A week of scheduled posts with real photos, for /social-media. */
export function SocialPlanner() {
  const posts = [
    { day: "Mon", src: "bread", text: "Sourdough is back this Saturday.", status: "Posted" },
    { day: "Wed", src: "coffee", text: "New autumn latte, all week.", status: "Scheduled" },
    { day: "Fri", src: "bread-sliced", text: "Behind the bench at 5am.", status: "Scheduled" },
  ] as const;
  return (
    <div aria-hidden="true" className="overflow-hidden rounded-2xl bg-white p-4 shadow-e4 ring-1 ring-black/5">
      <div className="flex items-center justify-between">
        <span className="text-small font-semibold text-fg">This week · Hartley Bakery</span>
        <span className="rounded-md bg-brand-50 px-2 py-0.5 text-[11px] font-semibold text-primary">3 posts</span>
      </div>
      <ul className="mt-3 grid grid-cols-3 gap-2.5">
        {posts.map((p) => (
          <li key={p.day} className="overflow-hidden rounded-xl ring-1 ring-line-subtle">
            <p className="bg-canvas-secondary px-2.5 py-1 text-[10px] font-semibold text-fg-secondary">{p.day}</p>
            <MockPhoto src={p.src} className="aspect-square" eager />
            <div className="p-2">
              <p className="line-clamp-2 text-[10px] leading-snug text-fg">{p.text}</p>
              <p className={`mt-1.5 text-[10px] font-semibold ${p.status === "Posted" ? "text-success" : "text-primary"}`}>{p.status}</p>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-3 flex items-center justify-between rounded-lg bg-canvas-secondary px-3 py-2 text-[11px]">
        <span className="text-fg-secondary">Link clicks to the order page</span>
        <span className="font-semibold text-fg">
          212 <span className="text-success">+18%</span>
        </span>
      </div>
    </div>
  );
}

/** A campaign report: spend, clicks, enquiries, with the landing page shown. */
export function CampaignBoard() {
  return (
    <div aria-hidden="true" className="overflow-hidden rounded-2xl bg-white shadow-e4 ring-1 ring-black/5">
      <div className="flex items-center justify-between border-b border-line-subtle px-4 py-3">
        <span className="text-small font-semibold text-fg">Autumn menu campaign</span>
        <span className="flex items-center gap-1.5 text-[11px] font-semibold text-success">
          <span className="size-1.5 rounded-full bg-success-fill" />
          Running
        </span>
      </div>
      <div className="grid grid-cols-3 divide-x divide-line-subtle text-center">
        {[
          ["Spend", "$420"],
          ["Clicks", "1,318"],
          ["Enquiries", "46"],
        ].map(([k, v]) => (
          <div key={k} className="py-3">
            <p className="text-[10px] text-fg-muted">{k}</p>
            <p className="text-[20px] font-semibold tracking-[-0.02em] text-fg">{v}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-[1fr_1.1fr] gap-3 border-t border-line-subtle p-4">
        <div>
          <p className="text-[10px] font-semibold text-fg-secondary">Landing page</p>
          <div className="mt-1.5 overflow-hidden rounded-lg ring-1 ring-line-subtle">
            <MockPhoto src="coffee" className="h-24" eager />
            <p className="px-2 py-1.5 text-[10px] font-medium text-fg">Autumn menu · Book a table</p>
          </div>
        </div>
        <div>
          <p className="text-[10px] font-semibold text-fg-secondary">Enquiries per week</p>
          <div className="mt-2 flex h-24 items-end gap-1.5">
            {[6, 9, 8, 12, 11].map((h, i) => (
              <span key={i} style={{ height: `${h * 7}px` }} className={`flex-1 rounded-sm ${i === 4 ? "bg-primary" : "bg-brand-200"}`} />
            ))}
          </div>
          <p className="mt-1 flex justify-between text-[9px] text-fg-muted">
            <span>Wk 1</span>
            <span>Wk 5</span>
          </p>
        </div>
      </div>
    </div>
  );
}
