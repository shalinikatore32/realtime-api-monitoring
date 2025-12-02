import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-slate-900 to-slate-700 text-white p-6">
      <h1 className="text-5xl font-bold mb-4 text-center">
        Real-Time API Monitoring System
      </h1>

      <p className="text-lg text-gray-300 max-w-xl text-center mb-8">
        Monitor API uptime, response times, and alerts — all in one smart
        dashboard. Built with Next.js, FastAPI & MongoDB.
      </p>

      <div className="flex gap-4">
        <Link href="/login">
          <Button variant="default" size="lg" className="px-8 py-6 text-lg">
            Login
          </Button>
        </Link>

        <Link href="/signup">
          <Button variant="secondary" size="lg" className="px-8 py-6 text-lg">
            Sign Up
          </Button>
        </Link>
      </div>
    </main>
  );
}
