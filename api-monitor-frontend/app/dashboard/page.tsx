import KPIStats from "@/components/custom/KPIStats";
import StatusBanner from "@/components/custom/StatusBanner";
import ResponseTimeChart from "@/components/custom/ResponseTimeChart";

export default function DashboardPage() {
  return (
    <div className="p-6 space-y-8 animate-fade-in">
      {/* Status Banner */}
      <div className="animate-slide-up">
        <StatusBanner />
      </div>

      {/* KPI Cards */}
      <div className="animate-slide-up delay-100">
        <KPIStats />
      </div>

      {/* Charts + Alerts */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 animate-slide-up delay-200">
        {/* Response Time Chart */}
        <div className="col-span-1 xl:col-span-2">
          <ResponseTimeChart />
        </div>
      </div>
    </div>
  );
}
