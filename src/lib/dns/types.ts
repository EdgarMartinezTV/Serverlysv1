/** Record types the propagation checker offers. Shared by the API and the page. */
export const RECORD_TYPES = ["A", "AAAA", "CNAME", "MX", "NS", "SRV", "TXT", "CAA", "SOA"] as const;
export type RecordType = (typeof RECORD_TYPES)[number];
