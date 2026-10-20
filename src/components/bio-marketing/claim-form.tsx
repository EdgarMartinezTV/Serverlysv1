"use client";

import { useId, useState } from "react";

/**
 * "Claim your name" — the bio.serverlys.com/ prefix + username box from the
 * reference hero. It doesn't check availability (that needs a signed-in
 * session on the app); it carries the name into sign-up, where the publish
 * step checks it live.
 */
export function ClaimForm({
  appUrl,
  tone = "light",
  cta = "Get started for free",
}: {
  appUrl: string;
  tone?: "light" | "dark";
  cta?: string;
}) {
  const id = useId();
  const [name, setName] = useState("");
  const host = appUrl.replace(/^https?:\/\//, "");
  return (
    <form
      action={`${appUrl}/signup`}
      method="get"
      className="flex w-full max-w-[520px] flex-col gap-3 sm:flex-row"
      onSubmit={(e) => {
        const clean = name
          .trim()
          .toLowerCase()
          .replace(/^@/, "")
          .replace(/[^a-z0-9._-]/g, "");
        if (!clean) {
          e.preventDefault();
          window.location.href = `${appUrl}/signup`;
        }
      }}
    >
      <label
        htmlFor={id}
        className="flex h-14 min-w-0 flex-1 items-center rounded-[10px] bg-white px-4 text-[16px] text-[#5b6472] ring-2 ring-transparent focus-within:ring-[#ccff00]"
      >
        <span className="shrink-0">{host}/</span>
        <input
          id={id}
          name="username"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="yourname"
          autoComplete="off"
          spellCheck={false}
          maxLength={30}
          aria-label={`Your username on ${host}`}
          className="min-w-0 flex-1 bg-transparent text-[#101011] outline-none placeholder:text-[#9d9ea4]"
        />
      </label>
      <button
        type="submit"
        className={`h-14 shrink-0 rounded-full px-7 text-[16px] font-semibold transition-transform hover:scale-[1.03] ${tone === "light" ? "bg-[#ccff00] text-[#101011]" : "bg-[#101011] text-white"}`}
      >
        {cta}
      </button>
    </form>
  );
}
