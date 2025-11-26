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

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function AlertsTable() {
  const { data } = useSWR("http://localhost:8000/api/alerts", fetcher, {
    refreshInterval: 2000,
  });

  const [selectedAlert, setSelectedAlert] = useState<any>(null);

  const getSeverityColor = (sev: string) => {
    if (!sev) return "bg-gray-200 text-gray-800";
    switch (sev.toUpperCase()) {
      case "CRITICAL":
        return "bg-red-100 text-red-700 border border-red-300";
      case "WARNING":
        return "bg-yellow-100 text-yellow-700 border border-yellow-300";
      default:
        return "bg-green-100 text-green-700 border border-green-300";
    }
  };

  return (
    <>
      {/* Main Alerts Card */}
      <Card className="shadow-lg border rounded-xl">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold tracking-tight">
            Alerts & Notifications
          </CardTitle>
        </CardHeader>

        <CardContent className="overflow-y-auto max-h-[400px]">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50 dark:bg-gray-900 text-left">
                <th className="py-2 px-3 font-medium">Time</th>
                <th className="py-2 px-3 font-medium">API Name</th>
                <th className="py-2 px-3 font-medium">Severity</th>
                <th className="py-2 px-3 font-medium">State</th>
                <th className="py-2 px-3 font-medium">Message</th>
              </tr>
            </thead>

            <tbody>
              {!Array.isArray(data) && (
                <tr>
                  <td colSpan={5} className="py-4 text-center">
                    Loading alerts...
                  </td>
                </tr>
              )}

              {Array.isArray(data) &&
                data.map((alert: any, idx: number) => {
                  const ts = new Date(alert.timestamp).toLocaleString();
                  const messagePreview =
                    alert.message.length > 40
                      ? alert.message.substring(0, 40) + "..."
                      : alert.message;

                  return (
                    <tr
                      key={idx}
                      className="border-b hover:bg-gray-50 dark:hover:bg-gray-900 transition cursor-pointer"
                      onClick={() => setSelectedAlert(alert)}
                    >
                      <td className="py-2 px-3">{ts}</td>
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
                        {messagePreview}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Modal for Alert Details */}
      <Dialog
        open={!!selectedAlert}
        onOpenChange={() => setSelectedAlert(null)}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              Alert Details
            </DialogTitle>
            <DialogDescription>
              Detailed alert information for debugging.
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
