"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import useSWR from "swr";
import { TrendingUp, BarChart2, Clock } from "lucide-react";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function KPIStats() {
  const { data } = useSWR("http://localhost:8000/api/metrics", fetcher, {
    refreshInterval: 4000,
  });

  const loading = !data;

  const metrics = [
    {
      label: "Total Requests",
      value: data?.total_requests,
      icon: BarChart2,
      color: "text-blue-600",
    },
    {
      label: "Success Rate",
      value: `${data?.success_rate}%`,
      icon: TrendingUp,
      color: "text-green-600",
    },
    {
      label: "Avg. Response Time",
      value: `${data?.avg_response} ms`,
      icon: Clock,
      color: "text-orange-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {metrics.map((item, idx) => {
        const Icon = item.icon;

        return (
          <Card
            key={idx}
            className="rounded-xl shadow-md border transition hover:shadow-lg hover:scale-[1.01] duration-200"
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">
                {item.label}
              </CardTitle>

              <Icon className={`w-5 h-5 ${item.color}`} />
            </CardHeader>

            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-24 rounded-md" />
              ) : (
                <p className="text-3xl font-bold tracking-tight">
                  {item.value}
                </p>
              )}

              {!loading && (
                <p className="text-xs text-gray-500 mt-1">Updated live</p>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
