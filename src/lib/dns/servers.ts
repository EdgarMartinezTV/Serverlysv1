/**
 * The 28 DNS resolvers the propagation checker asks.
 *
 * SAME SET AS THE REFERENCE (2026-11-24). hostinger.com/dns-propagation-checker
 * asks 28 resolvers (read from its API in a real browser). 18 of them are
 * public ISP/registry resolvers, and we ask exactly those, at the locations
 * the reference gives. The other 10 are Hostinger's own resolvers, which are
 * not ours to use; each is replaced by a verified resolver of our own in or
 * near the same place (Frankfurt, UK, Lithuania→Poland, US east and west,
 * two in Brazil, Mumbai, Singapore, Indonesia).
 *
 * HOW THIS LIST WAS MADE (2026-11-24). Candidates came from public-dns.info's
 * list of open resolvers (reliability 1.00, no error), one or two per country,
 * plus the big public services. Each one was then queried from this Mac AND
 * from inside a container on the production server (72.61.9.224); only those
 * that answered from both made the cut. City and coordinates are where the
 * resolver's IP is located (ipinfo / public-dns.info), not a guess.
 *
 * The four big public services (Google, Cloudflare, Quad9, OpenDNS) are
 * anycast: they answer from whichever of their sites is nearest to our server.
 * Their location is the operator's home, which is the usual convention for
 * these tools.
 *
 * A resolver that starts timing out on every check should be replaced, not
 * kept: the page reports timeouts honestly, but a dead one adds nothing.
 * Re-run scripts/test-dns-servers.mjs to see which still answer.
 */

export type DnsServer = {
  id: string;
  ip: string;
  provider: string;
  city: string;
  country: string;
  /** ISO 3166-1 alpha-2, for the flag. */
  cc: string;
  lat: number;
  lon: number;
};

export const DNS_SERVERS: readonly DnsServer[] = [
  // Europe
  { id: "de-telekom", ip: "194.25.0.68", provider: "Deutsche Telekom", city: "Frankfurt", country: "Germany", cc: "DE", lat: 50.1109, lon: 8.6821 },
  { id: "gb-expe", ip: "167.98.174.81", provider: "Exponential-E", city: "London, England", country: "UK", cc: "GB", lat: 51.5072, lon: -0.1276 },
  { id: "pl-play", ip: "94.75.110.66", provider: "Play", city: "Warsaw", country: "Poland", cc: "PL", lat: 52.2297, lon: 21.0122 },
  { id: "es-ionos", ip: "82.223.43.222", provider: "IONOS", city: "Madrid", country: "Spain", cc: "ES", lat: 40.4168, lon: -3.7038 },
  { id: "rs-telekom", ip: "91.150.92.232", provider: "Telekom Srbija", city: "Belgrade", country: "Serbia", cc: "RS", lat: 44.7866, lon: 20.4489 },
  { id: "tr-teknet", ip: "31.7.37.37", provider: "Teknet", city: "Antalya", country: "Turkey", cc: "TR", lat: 36.8969, lon: 30.7133 },
  // North America
  { id: "us-vt", ip: "198.82.247.34", provider: "Virginia Tech", city: "Christiansburg, Virginia", country: "USA", cc: "US", lat: 37.1299, lon: -80.4089 },
  { id: "us-he", ip: "74.82.42.42", provider: "Hurricane Electric", city: "Fremont, California", country: "USA", cc: "US", lat: 37.5485, lon: -121.9886 },
  { id: "us-att", ip: "12.171.191.58", provider: "AT&T", city: "Fort Worth, Texas", country: "USA", cc: "US", lat: 32.7555, lon: -97.3308 },
  { id: "us-gorge", ip: "209.216.160.2", provider: "Gorge Networks", city: "Hood River, Oregon", country: "USA", cc: "US", lat: 45.7054, lon: -121.5215 },
  { id: "ca-wolfpaw", ip: "204.209.20.154", provider: "Wolfpaw", city: "Edmonton, Alberta", country: "Canada", cc: "CA", lat: 53.5461, lon: -113.4938 },
  { id: "mx-alestra", ip: "200.76.5.147", provider: "Alestra", city: "San Luis Potosi", country: "Mexico", cc: "MX", lat: 22.1565, lon: -100.9855 },
  // South America
  { id: "br-uol", ip: "200.221.11.100", provider: "UOL", city: "Sao Paulo", country: "Brazil", cc: "BR", lat: -23.5505, lon: -46.6333 },
  { id: "br-delta", ip: "168.195.135.67", provider: "Delta Fibra", city: "Goiania", country: "Brazil", cc: "BR", lat: -16.6869, lon: -49.2648 },
  { id: "co-claro", ip: "181.49.39.14", provider: "Claro", city: "Bogota", country: "Colombia", cc: "CO", lat: 4.711, lon: -74.0721 },
  { id: "ar-telecom", ip: "200.89.142.74", provider: "Telecom Argentina", city: "Buenos Aires", country: "Argentina", cc: "AR", lat: -34.6037, lon: -58.3816 },
  // Asia & Oceania
  { id: "in-bharat", ip: "1.10.10.10", provider: "Bharat Public DNS", city: "Mumbai", country: "India", cc: "IN", lat: 19.076, lon: 72.8777 },
  { id: "sg-singnet", ip: "118.201.56.26", provider: "SingNet", city: "Singapore", country: "Singapore", cc: "SG", lat: 1.3521, lon: 103.8198 },
  { id: "id-dewata", ip: "27.54.117.113", provider: "Dewata Telematika", city: "Denpasar", country: "Indonesia", cc: "ID", lat: -8.6705, lon: 115.2126 },
  { id: "tw-hinet", ip: "168.95.1.1", provider: "Chunghwa Telecom HiNet", city: "Taipei", country: "Taiwan", cc: "TW", lat: 25.033, lon: 121.5654 },
  { id: "jp-wide", ip: "203.178.136.36", provider: "WIDE Project", city: "Tokyo", country: "Japan", cc: "JP", lat: 35.6762, lon: 139.6503 },
  { id: "kr-lgu", ip: "164.124.107.9", provider: "LG Uplus", city: "Seoul", country: "South Korea", cc: "KR", lat: 37.5665, lon: 126.978 },
  { id: "au-telstra", ip: "203.50.2.71", provider: "Telstra", city: "Sydney", country: "Australia", cc: "AU", lat: -33.8688, lon: 151.2093 },
  { id: "nz-voyager", ip: "49.50.244.107", provider: "Voyager Internet", city: "Auckland", country: "New Zealand", cc: "NZ", lat: -36.8485, lon: 174.7633 },
  // Middle East & Africa
  { id: "ae-iptp", ip: "185.65.175.161", provider: "IPTP", city: "Dubai", country: "United Arab Emirates", cc: "AE", lat: 25.2048, lon: 55.2708 },
  { id: "za-liquid", ip: "77.246.57.132", provider: "Liquid Telecom", city: "Johannesburg", country: "South Africa", cc: "ZA", lat: -26.2041, lon: 28.0473 },
  { id: "ke-liquid", ip: "197.155.92.21", provider: "Liquid Telecom", city: "Nairobi", country: "Kenya", cc: "KE", lat: -1.2921, lon: 36.8219 },
  { id: "mr-mauritel", ip: "82.151.90.1", provider: "Mauritel", city: "Nouakchott", country: "Mauritania", cc: "MR", lat: 18.0735, lon: -15.9582 },
];
