"use client";

import { Area, AreaChart, Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

/* Brand blue for the primary series, ink for the secondary; both pass 3:1 on white. */
const BLUE = "#0000ff";
const INK = "#55555c";
const TEAL = "#00897b";

export function TrafficChart({ data }: { data: Array<{ date: string; views: number; uniques: number; clicks: number }> }) {
  const fmt = (d: string) => new Date(d + "T00:00:00Z").toLocaleDateString(undefined, { month: "short", day: "numeric", timeZone: "UTC" });
  return (
    <div className="h-72 w-full" role="img" aria-label={`Views, unique visitors and clicks per day, ${data.length} days`}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
          <defs>
            <linearGradient id="gv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={BLUE} stopOpacity={0.18} />
              <stop offset="100%" stopColor={BLUE} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#ececef" vertical={false} />
          <XAxis dataKey="date" tickFormatter={fmt} tick={{ fontSize: 12, fill: "#6f6f78" }} tickLine={false} axisLine={false} minTickGap={24} />
          <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "#6f6f78" }} tickLine={false} axisLine={false} />
          <Tooltip labelFormatter={(l) => fmt(String(l))} contentStyle={{ borderRadius: 12, border: "1px solid #dedee2", fontSize: 13 }} />
          <Legend wrapperStyle={{ fontSize: 13 }} />
          <Area type="monotone" dataKey="views" name="Views" stroke={BLUE} strokeWidth={2} fill="url(#gv)" />
          <Area type="monotone" dataKey="uniques" name="Unique visitors" stroke={INK} strokeWidth={1.5} fill="none" strokeDasharray="4 3" />
          <Area type="monotone" dataKey="clicks" name="Clicks" stroke={TEAL} strokeWidth={2} fill="none" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function BreakdownBars({ data, label }: { data: Array<{ key: string; count: number }>; label: string }) {
  if (!data.length) return <p className="py-6 text-center text-small text-fg-muted">No data in this period.</p>;
  return (
    <div style={{ height: Math.max(120, data.length * 34) }} role="img" aria-label={`${label}: ${data.map((d) => `${d.key} ${d.count}`).join(", ")}`}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 0, right: 16, left: 0, bottom: 0 }}>
          <XAxis type="number" hide allowDecimals={false} />
          <YAxis type="category" dataKey="key" width={96} tick={{ fontSize: 12, fill: "#36363b" }} tickLine={false} axisLine={false} />
          <Tooltip cursor={{ fill: "#f1f1f3" }} contentStyle={{ borderRadius: 12, border: "1px solid #dedee2", fontSize: 13 }} />
          <Bar dataKey="count" name="Views" fill={BLUE} radius={[0, 6, 6, 0]} barSize={18} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
