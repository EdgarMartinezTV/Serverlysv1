# Serverlys Spanish style guide (es-419, decided by Edgar 2026-11-01)

- Neutral **Latin American Spanish**, informal **tú** everywhere (tu cuenta, ingresa, elige, haz clic).
  Never usted/su/sus for the reader, never vosotros, no Spain-only words (ordenador → computadora,
  móvil → celular, coger → tomar, vale → de acuerdo).
- Tone: clear, friendly, direct, short. Like a helpful hosting company, not a bank.
- Use the same terms everywhere:
  hosting (not "alojamiento"); dominio; área de cliente; carrito; pedido; factura; pago; renovación;
  ticket de soporte; correo electrónico (email is fine in buttons/labels when short); contraseña;
  iniciar sesión / cerrar sesión; registrarse / crear cuenta; servicio; producto; plan; complemento (addon);
  servidor; panel de control; certificado SSL; transferencia de dominio; nombre de dominio;
  periodo de facturación; mensual / trimestral / semestral / anual / bienal / trienal;
  reembolso; crédito; impuestos; código promocional (promo code); cupón.
- NEVER translate: Serverlys, ConvoAI, Sera, WHMCS, cPanel, WordPress, WooCommerce, Black Friday,
  plan names (Starter Cloud, Plus Cloud, Turbo Cloud, Business Cloud, WordPress Start/Grow/Pro/Powerhouse,
  WooCommerce Starter/Growth/Pro/Enterprise), ResellerClub, PayPal, Stripe, LiteSpeed, Cloudflare, NVMe,
  DNS, SSL, IP, FTP, SSH, API, URL, WHOIS, EPP, TLD names (.com etc.).
- Keep EXACTLY, unchanged and the same number of times: placeholders (:name, %s, %1$s, %d, {$var},
  {var}, [TAG]), HTML tags and attributes, HTML entities (&nbsp; &amp; ...), line breaks, leading/trailing
  spaces and punctuation like ":" at the end.
- Prices/currency stay as given ($, USD). Dates/numbers inside placeholders are formatted by WHMCS.
- Capitalisation: Spanish sentence case for titles and buttons ("Área de cliente", "Agregar al carrito"),
  not English Title Case.
- Use ¿…? and ¡…! correctly. Keep it concise — UI strings should not get much longer than the English.

## Website-specific (serverlys.com marketing pages)
- Product names stay English: AI Employee(s), ServerCare, Cloud Hosting product names, plan names.
- "hosting" stays "hosting". "website" → "sitio web". "small business" → "pequeño negocio".
- Strings are JSX fragments: a string may start/end mid-sentence (e.g. ", email" or "Behind the"),
  because it sits next to a link or a variable. Translate the fragment so it reads naturally when
  joined with its neighbours; keep leading/trailing spaces and punctuation exactly.
- Legal pages: courtesy translation, accurate, keep statute citations (17 U.S.C. § 512(f)) as is.
- Leave unchanged (map to itself) anything that must not be translated: code, URLs, emails, domain
  names, file paths, CSS classes, pure numbers/prices, brand-only strings.
- Prices: "$129/hr" → "$129/hora", "/mo" → "/mes", "/yr" → "/año".
