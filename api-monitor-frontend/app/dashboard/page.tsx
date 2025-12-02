import KPIStats from "@/components/custom/KPIStats";
import StatusBanner from "@/components/custom/StatusBanner";
import ResponseTimeChart from "@/components/custom/ResponseTimeChart";

export default function DashboardPage() {
  return (
    <div className="p-6 space-y-10">
      {/* System Status */}
      <StatusBanner />

      {/* KPI Summary */}
      <KPIStats />

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Response Trend */}
        <div className="col-span-1 xl:col-span-2">
          <ResponseTimeChart />
        </div>

        {/* Placeholder for future cards (optional) */}
        <div className="hidden xl:block">
          <div className="p-5 rounded-xl border shadow-sm bg-white dark:bg-neutral-900 text-sm text-neutral-500">
            <p className="font-medium mb-2 text-neutral-700 dark:text-neutral-300">
              System Insights
            </p>
            <p>
              More analytics coming soon: uptime %, worst API, consistency
              graphs, downtime history, etc.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
