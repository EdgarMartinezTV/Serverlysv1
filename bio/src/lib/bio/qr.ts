import QRCode from "qrcode";

/**
 * QR code as an SVG path, computed synchronously so the same renderer works
 * on the server (public page) and in the browser (editor preview). Error
 * correction M survives a printed code being slightly scuffed.
 */
export function qrPath(text: string): { size: number; d: string } {
  const qr = QRCode.create(text || " ", { errorCorrectionLevel: "M" });
  const size = qr.modules.size;
  const data = qr.modules.data;
  let d = "";
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (data[y * size + x]) d += `M${x} ${y}h1v1h-1z`;
    }
  }
  return { size, d };
}

export function qrSvg(text: string, opts: { fg?: string; bg?: string; margin?: number } = {}): string {
  const { size, d } = qrPath(text);
  const m = opts.margin ?? 2;
  const full = size + m * 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${-m} ${-m} ${full} ${full}" shape-rendering="crispEdges"><rect x="${-m}" y="${-m}" width="${full}" height="${full}" fill="${opts.bg ?? "#ffffff"}"/><path d="${d}" fill="${opts.fg ?? "#000000"}"/></svg>`;
}
