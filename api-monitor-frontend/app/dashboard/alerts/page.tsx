"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import useSWR from "swr";
import Cookies from "js-cookie";

const fetcher = async (url: string) => {
  const token = Cookies.get("token");
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
};

export default function AlertsTable() {
  const { data } = useSWR("http://localhost:8000/api/alerts", fetcher, {
    refreshInterval: 2000,
  });

  const [selectedAlert, setSelectedAlert] = useState<any>(null);

  const getSeverityColor = (sev: string) => {
    switch (sev?.toUpperCase()) {
      case "CRITICAL":
        return "bg-red-100 text-red-700 border border-red-300";
      case "WARNING":
        return "bg-yellow-100 text-yellow-700 border border-yellow-300";
      default:
        return "bg-green-100 text-green-700 border border-green-300";
    }
  };

  const alerts = Array.isArray(data) ? data : [];

  return (
    <>
      <Card className="shadow-lg border rounded-xl">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold tracking-tight">
            Alerts History
          </CardTitle>
        </CardHeader>

        <CardContent className="overflow-y-auto max-h-[400px]">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50 dark:bg-gray-900 text-left">
                <th className="py-2 px-3">Time</th>
                <th className="py-2 px-3">API Name</th>
                <th className="py-2 px-3">Severity</th>
                <th className="py-2 px-3">State</th>
                <th className="py-2 px-3">Message</th>
              </tr>
            </thead>

            <tbody>
              {alerts.map((alert: any) => {
                const timestamp = new Date(alert.timestamp).toLocaleString();
                const msgPreview =
                  alert.message.length > 40
                    ? alert.message.slice(0, 40) + "..."
                    : alert.message;

                return (
                  <tr
                    key={alert._id}
                    onClick={() => setSelectedAlert(alert)}
                    className="border-b hover:bg-gray-50 dark:hover:bg-gray-900 transition cursor-pointer"
                  >
                    <td className="py-2 px-3">{timestamp}</td>
                    <td className="py-2 px-3 font-medium">{alert.name}</td>

                    <td className="py-2 px-3">
                      <span
                        className={`text-xs px-2 py-1 rounded-md font-semibold ${getSeverityColor(
                          alert.severity
                        )}`}
                      >
                        {alert.severity}
                      </span>
                    </td>

                    <td className="py-2 px-3 font-semibold">
                      {alert.current_state}
                    </td>

                    <td className="py-2 px-3 text-gray-700 dark:text-gray-300">
                      {msgPreview}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Modal */}
      <Dialog
        open={!!selectedAlert}
        onOpenChange={() => setSelectedAlert(null)}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Alert Details</DialogTitle>
            <DialogDescription>
              Full details of the selected alert.
            </DialogDescription>
          </DialogHeader>

          {selectedAlert && (
            <div className="space-y-4 text-sm">
              <div>
                <p className="font-semibold">API Name:</p>
                <p>{selectedAlert.name}</p>
              </div>

              <div>
                <p className="font-semibold">Timestamp:</p>
                <p>{new Date(selectedAlert.timestamp).toLocaleString()}</p>
              </div>

              <div>
                <p className="font-semibold">Severity:</p>
                <Badge className={getSeverityColor(selectedAlert.severity)}>
                  {selectedAlert.severity}
                </Badge>
              </div>

              <div>
                <p className="font-semibold">State Change:</p>
                <p>
                  {selectedAlert.previous_state} →{" "}
                  <strong>{selectedAlert.current_state}</strong>
                </p>
              </div>

              <div>
                <p className="font-semibold">Message:</p>
                <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md whitespace-pre-wrap">
                  {selectedAlert.message}
                </pre>
              </div>

              <div className="flex justify-end">
                <Button onClick={() => setSelectedAlert(null)}>Close</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
