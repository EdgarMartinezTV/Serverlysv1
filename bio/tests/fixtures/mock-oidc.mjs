// Minimal OpenID Connect provider for the SSO e2e test. NOT for production.
// Usage: node tests/fixtures/mock-oidc.mjs  (listens on :3299)
import http from "node:http";
const PORT = 3299, ISS = `http://localhost:${PORT}`;
const codes = new Map();
http
  .createServer(async (req, res) => {
    const url = new URL(req.url, ISS);
    const json = (o, s = 200) => { res.writeHead(s, { "content-type": "application/json" }); res.end(JSON.stringify(o)); };
    if (url.pathname === "/.well-known/openid-configuration")
      return json({ issuer: ISS, authorization_endpoint: `${ISS}/authorize`, token_endpoint: `${ISS}/token`, userinfo_endpoint: `${ISS}/userinfo` });
    if (url.pathname === "/authorize") {
      // Auto-approve as the account named in ?login_hint or a default.
      const email = url.searchParams.get("login_hint") || "sso-user@example.com";
      const code = Math.random().toString(36).slice(2);
      codes.set(code, { email, challenge: url.searchParams.get("code_challenge") });
      const back = new URL(url.searchParams.get("redirect_uri"));
      back.searchParams.set("code", code);
      back.searchParams.set("state", url.searchParams.get("state"));
      res.writeHead(302, { location: back.toString() });
      return res.end();
    }
    if (url.pathname === "/token") {
      let body = "";
      for await (const c of req) body += c;
      const p = new URLSearchParams(body);
      const c = codes.get(p.get("code"));
      if (!c || p.get("client_secret") !== "mock-secret") return json({ error: "invalid_grant" }, 400);
      const { createHash } = await import("node:crypto");
      if (createHash("sha256").update(p.get("code_verifier")).digest("base64url") !== c.challenge) return json({ error: "pkce" }, 400);
      return json({ access_token: `tok-${c.email}`, token_type: "Bearer" });
    }
    if (url.pathname === "/userinfo") {
      const email = (req.headers.authorization ?? "").replace("Bearer tok-", "");
      return json({ sub: `whmcs-${email}`, email, email_verified: true, name: "SSO Person" });
    }
    res.writeHead(404).end();
  })
  .listen(PORT, () => console.log(`mock OIDC on ${ISS}`));
