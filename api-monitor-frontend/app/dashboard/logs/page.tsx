"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function LogsTable() {
  const { data } = useSWR("http://localhost:8000/api/logs", fetcher);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Logs</CardTitle>
      </CardHeader>
      <CardContent className="overflow-y-auto max-h-[350px]">
        <table className="w-full text-sm">
          <thead>
            <tr className="font-semibold border-b">
              <th>Time</th>
              <th>Endpoint</th>
              <th>Status</th>
              <th>Response</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((log: any, idx: number) => (
              <tr key={idx} className="border-b">
                <td>{log.timestamp}</td>
                <td>{log.url}</td>
                <td>{log.status}</td>
                <td>{log.response_time} ms</td>
              </tr>
            )) ?? (
              <tr>
                <td colSpan={4}>Loading...</td>
              </tr>
            )}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
