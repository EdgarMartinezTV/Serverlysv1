/**
 * The DNS resolvers the propagation checker asks.
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
  // North America
  { id: "us-google", ip: "8.8.8.8", provider: "Google", city: "Mountain View", country: "United States", cc: "US", lat: 37.39, lon: -122.08 },
  { id: "us-cloudflare", ip: "1.1.1.1", provider: "Cloudflare", city: "San Francisco", country: "United States", cc: "US", lat: 37.77, lon: -122.42 },
  { id: "us-quad9", ip: "9.9.9.9", provider: "Quad9", city: "Berkeley", country: "United States", cc: "US", lat: 37.87, lon: -122.27 },
  { id: "us-opendns", ip: "208.67.222.222", provider: "OpenDNS (Cisco)", city: "San Francisco", country: "United States", cc: "US", lat: 37.79, lon: -122.4 },
  { id: "us-he", ip: "74.82.42.42", provider: "Hurricane Electric", city: "Fremont", country: "United States", cc: "US", lat: 37.55, lon: -121.99 },
  { id: "us-wow", ip: "64.233.217.2", provider: "WOW! Internet", city: "Troy", country: "United States", cc: "US", lat: 42.61, lon: -83.15 },
  { id: "us-windstream", ip: "216.199.46.11", provider: "Windstream", city: "Palm Beach Gardens", country: "United States", cc: "US", lat: 26.82, lon: -80.14 },
  { id: "us-vt", ip: "198.82.247.34", provider: "Virginia Tech", city: "Christiansburg", country: "United States", cc: "US", lat: 37.13, lon: -80.41 },
  { id: "ca-goco", ip: "66.163.0.161", provider: "GoCo Technology", city: "Whitby", country: "Canada", cc: "CA", lat: 43.9, lon: -78.94 },
  { id: "ca-fortinet", ip: "208.91.112.220", provider: "Fortinet", city: "Burnaby", country: "Canada", cc: "CA", lat: 49.25, lon: -122.98 },
  { id: "mx-alestra", ip: "200.76.5.147", provider: "Alestra", city: "Mexico City", country: "Mexico", cc: "MX", lat: 19.43, lon: -99.2 },
  { id: "mx-alestra-mty", ip: "207.248.224.71", provider: "Alestra", city: "Monterrey", country: "Mexico", cc: "MX", lat: 25.74, lon: -100.3 },
  // South America
  { id: "co-claro", ip: "190.85.62.74", provider: "Claro (Telmex Colombia)", city: "Bogotá", country: "Colombia", cc: "CO", lat: 4.71, lon: -74.07 },
  { id: "pe-claro", ip: "200.62.147.66", provider: "Claro Perú", city: "Lima", country: "Peru", cc: "PE", lat: -12.05, lon: -77.04 },
  { id: "br-uol", ip: "200.221.11.100", provider: "UOL", city: "São Paulo", country: "Brazil", cc: "BR", lat: -23.55, lon: -46.63 },
  { id: "br-delta", ip: "168.195.135.67", provider: "Delta Fibra", city: "Goiânia", country: "Brazil", cc: "BR", lat: -16.68, lon: -49.25 },
  { id: "cl-entel", ip: "186.67.172.51", provider: "Entel", city: "Santiago", country: "Chile", cc: "CL", lat: -33.45, lon: -70.67 },
  { id: "ar-telecom", ip: "200.89.142.74", provider: "Telecom Argentina", city: "Buenos Aires", country: "Argentina", cc: "AR", lat: -34.6, lon: -58.38 },
  // Europe
  { id: "gb-expe", ip: "167.98.174.81", provider: "Exponential-E", city: "London", country: "United Kingdom", cc: "GB", lat: 51.55, lon: -0.06 },
  { id: "es-xtra", ip: "212.230.255.1", provider: "Xtra Telecom", city: "Madrid", country: "Spain", cc: "ES", lat: 40.42, lon: -3.7 },
  { id: "fr-scaleway", ip: "62.210.136.158", provider: "Scaleway", city: "Paris", country: "France", cc: "FR", lat: 48.86, lon: 2.35 },
  { id: "nl-vultr", ip: "136.244.97.119", provider: "Vultr", city: "Amsterdam", country: "Netherlands", cc: "NL", lat: 52.37, lon: 4.9 },
  { id: "de-telekom", ip: "194.25.0.68", provider: "Deutsche Telekom", city: "Frankfurt", country: "Germany", cc: "DE", lat: 50.11, lon: 8.68 },
  { id: "it-aruba", ip: "77.81.231.73", provider: "Aruba", city: "Arezzo", country: "Italy", cc: "IT", lat: 43.46, lon: 11.88 },
  { id: "se-tele2", ip: "212.247.176.202", provider: "Tele2", city: "Sundsvall", country: "Sweden", cc: "SE", lat: 62.39, lon: 17.31 },
  { id: "pl-play", ip: "94.75.110.66", provider: "Play", city: "Warsaw", country: "Poland", cc: "PL", lat: 52.23, lon: 21.01 },
  { id: "ru-yandex", ip: "77.88.8.8", provider: "Yandex", city: "Moscow", country: "Russia", cc: "RU", lat: 55.76, lon: 37.62 },
  { id: "tr-teknet", ip: "31.7.37.37", provider: "Teknet", city: "Antalya", country: "Turkey", cc: "TR", lat: 36.9, lon: 30.7 },
  // Middle East & Africa
  { id: "il-omc", ip: "91.223.106.229", provider: "O.M.C. Computers", city: "Tel Aviv", country: "Israel", cc: "IL", lat: 32.09, lon: 34.78 },
  { id: "ae-iptp", ip: "185.65.175.161", provider: "IPTP Networks", city: "Dubai", country: "United Arab Emirates", cc: "AE", lat: 25.2, lon: 55.27 },
  { id: "sa-mobily", ip: "85.194.70.174", provider: "Mobily", city: "Riyadh", country: "Saudi Arabia", cc: "SA", lat: 24.71, lon: 46.68 },
  { id: "eg-citystars", ip: "84.205.101.37", provider: "City Stars", city: "Cairo", country: "Egypt", cc: "EG", lat: 30.06, lon: 31.25 },
  { id: "ng-mtn", ip: "197.210.211.1", provider: "MTN Nigeria", city: "Lagos", country: "Nigeria", cc: "NG", lat: 6.45, lon: 3.39 },
  { id: "ke-liquid", ip: "197.155.92.20", provider: "Liquid Telecom", city: "Nairobi", country: "Kenya", cc: "KE", lat: -1.29, lon: 36.82 },
  { id: "za-gijima", ip: "196.13.141.10", provider: "Gijima", city: "Johannesburg", country: "South Africa", cc: "ZA", lat: -26.2, lon: 28.04 },
  // Asia & Oceania
  { id: "pk-taiztel", ip: "203.170.69.34", provider: "Taiztel", city: "Lahore", country: "Pakistan", cc: "PK", lat: 31.56, lon: 74.35 },
  { id: "in-bharat", ip: "1.10.10.10", provider: "Bharat Public DNS", city: "Mumbai", country: "India", cc: "IN", lat: 18.98, lon: 72.83 },
  { id: "in-tata", ip: "182.156.93.102", provider: "Tata Teleservices", city: "Bengaluru", country: "India", cc: "IN", lat: 12.97, lon: 77.59 },
  { id: "sg-singnet", ip: "118.201.56.26", provider: "SingNet", city: "Singapore", country: "Singapore", cc: "SG", lat: 1.35, lon: 103.82 },
  { id: "th-tot", ip: "1.0.175.163", provider: "TOT", city: "Bangkok", country: "Thailand", cc: "TH", lat: 13.76, lon: 100.5 },
  { id: "vn-fpt", ip: "118.69.197.82", provider: "FPT Telecom", city: "Ho Chi Minh City", country: "Vietnam", cc: "VN", lat: 10.82, lon: 106.63 },
  { id: "id-dewata", ip: "27.54.117.113", provider: "Dewata Telematika", city: "Denpasar", country: "Indonesia", cc: "ID", lat: -8.65, lon: 115.22 },
  { id: "ph-pldt", ip: "210.1.86.1", provider: "PLDT", city: "Pasig", country: "Philippines", cc: "PH", lat: 14.58, lon: 121.08 },
  { id: "hk-hgc", ip: "210.0.128.250", provider: "HGC Global", city: "Hong Kong", country: "Hong Kong", cc: "HK", lat: 22.32, lon: 114.17 },
  { id: "cn-ali", ip: "223.5.5.5", provider: "AliDNS", city: "Hangzhou", country: "China", cc: "CN", lat: 30.27, lon: 120.16 },
  { id: "cn-dnspod", ip: "119.29.29.29", provider: "DNSPod (Tencent)", city: "Guangzhou", country: "China", cc: "CN", lat: 23.13, lon: 113.26 },
  { id: "tw-cht", ip: "60.248.27.64", provider: "Chunghwa Telecom", city: "Taoyuan", country: "Taiwan", cc: "TW", lat: 24.99, lon: 121.3 },
  { id: "kr-kt", ip: "168.126.63.1", provider: "KT", city: "Seoul", country: "South Korea", cc: "KR", lat: 37.57, lon: 126.98 },
  { id: "jp-ntt", ip: "60.32.149.50", provider: "NTT", city: "Tokyo", country: "Japan", cc: "JP", lat: 35.68, lon: 139.86 },
  { id: "jp-sonet", ip: "92.203.123.235", provider: "So-net", city: "Osaka", country: "Japan", cc: "JP", lat: 34.69, lon: 135.5 },
  { id: "au-vocus", ip: "49.255.4.22", provider: "Vocus", city: "Sydney", country: "Australia", cc: "AU", lat: -33.87, lon: 151.21 },
  { id: "au-telstra", ip: "203.47.150.176", provider: "Telstra", city: "Melbourne", country: "Australia", cc: "AU", lat: -37.81, lon: 144.96 },
];
