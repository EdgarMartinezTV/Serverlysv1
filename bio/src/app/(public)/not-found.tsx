import Link from "next/link";

export default function NotFound() {
  return (
    <main style={{ margin: "auto", padding: 24, textAlign: "center", fontFamily: "system-ui, sans-serif", color: "#36363b" }}>
      <p style={{ fontSize: 12, letterSpacing: ".08em", fontWeight: 600, color: "#0000ff" }}>404</p>
      <h1 style={{ fontSize: 24, margin: "8px 0", color: "#101011" }}>This bio page isn&apos;t available</h1>
      <p style={{ maxWidth: 380, margin: "0 auto 24px" }}>It may have been renamed, unpublished, or never existed.</p>
      <Link href="/signup" style={{ display: "inline-block", background: "#0000ff", color: "#fff", padding: "12px 20px", borderRadius: 12, fontWeight: 600, textDecoration: "none" }}>
        Create your own free bio
      </Link>
    </main>
  );
}
