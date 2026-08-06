"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

// Placeholder series — wire this up to a /api/admin/analytics/revenue
// endpoint that groups Order.total by day for the last 30 days.
const data = Array.from({ length: 14 }, (_, i) => ({
  day: `Day ${i + 1}`,
  revenue: Math.round(2000 + Math.random() * 4000),
}));

export function RevenueChart() {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(201,162,39,0.1)" />
        <XAxis dataKey="day" stroke="#C9A227" fontSize={11} />
        <YAxis stroke="#C9A227" fontSize={11} />
        <Tooltip
          contentStyle={{ background: "#0B0B0C", border: "1px solid #C9A227", borderRadius: 8 }}
          labelStyle={{ color: "#F6F1E7" }}
        />
        <Line type="monotone" dataKey="revenue" stroke="#C9A227" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}
