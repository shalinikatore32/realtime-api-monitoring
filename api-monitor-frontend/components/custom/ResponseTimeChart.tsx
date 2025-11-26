"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function ResponseTimeChart() {
  const { data } = useSWR("http://localhost:8000/api/response-trend", fetcher, {
    refreshInterval: 4000,
  });

  const chartData = Array.isArray(data)
    ? data
    : data?.trend || data?.data || [];

  // Format timestamps for X-axis
  const formattedData = chartData.map((d: any) => ({
    ...d,
    timestamp: new Date(d.timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }),
  }));

  return (
    <Card className="shadow-lg border rounded-xl">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold tracking-tight">
          Response Time Trend
        </CardTitle>
      </CardHeader>

      <CardContent className="h-80">
        {!Array.isArray(chartData) || chartData.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            No data available...
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={formattedData}>
              {/* Grid for readability */}
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />

              {/* X axis */}
              <XAxis
                dataKey="timestamp"
                tick={{ fontSize: 12 }}
                stroke="#888"
              />

              {/* Y axis */}
              <YAxis
                tick={{ fontSize: 12 }}
                stroke="#888"
                label={{
                  value: "ms",
                  angle: -90,
                  position: "insideLeft",
                  offset: -5,
                }}
              />

              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                }}
                labelStyle={{ fontWeight: "bold" }}
                formatter={(value: any) => [`${value} ms`, "Response Time"]}
              />

              <Legend verticalAlign="top" height={36} />

              {/* Clean blue gradient */}
              <defs>
                <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563eb" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#2563eb" stopOpacity={0.3} />
                </linearGradient>
              </defs>

              <Line
                type="monotone"
                dataKey="response_time"
                stroke="url(#lineGradient)"
                strokeWidth={3}
                dot={{ r: 3, strokeWidth: 1 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
