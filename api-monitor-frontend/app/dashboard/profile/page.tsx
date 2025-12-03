"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, User, LogOut, ArrowLeft, UserCircle } from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    const storedUserId = localStorage.getItem("user_id");
    const token = localStorage.getItem("token");

    if (!storedEmail || !storedUserId || !token) {
      router.push("/login");
      return;
    }

    setEmail(storedEmail);
    setUserId(storedUserId);
  }, [router]);

  return (
    <div className="w-full flex justify-center px-4 py-10 bg-gradient-to-br from-background to-muted/30 min-h-screen">
      <Card className="w-full max-w-2xl shadow-xl border rounded-2xl backdrop-blur-lg bg-background/80">
        {/* HEADER WITH GRADIENT */}
        <div className="rounded-t-2xl bg-gradient-to-r from-primary to-primary/60 p-6 text-white flex items-center gap-4">
          <UserCircle className="w-14 h-14 drop-shadow-md" />
          <div>
            <h1 className="text-2xl font-bold">Profile Overview</h1>
            <p className="text-sm text-white/80">Manage your account details</p>
          </div>
        </div>

        <CardContent className="space-y-8 mt-6">
          {/* USER INFO SECTION */}
          <div className="space-y-4">
            <h2 className="font-semibold text-lg text-foreground">
              Account Details
            </h2>

            {/* USER ID BOX */}
            <div className="p-4 rounded-lg border bg-muted/50 flex items-center gap-3 hover:bg-muted transition">
              <User className="w-6 h-6 text-primary" />
              <div>
                <h3 className="font-medium">User ID</h3>
                <p className="text-sm text-muted-foreground break-all">
                  {userId}
                </p>
              </div>
            </div>

            {/* EMAIL BOX */}
            <div className="p-4 rounded-lg border bg-muted/50 flex items-center gap-3 hover:bg-muted transition">
              <Mail className="w-6 h-6 text-primary" />
              <div>
                <h3 className="font-medium">Email</h3>
                <p className="text-sm text-muted-foreground">{email}</p>
              </div>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex flex-col sm:flex-row justify-between gap-4 mt-6">
            <Button
              variant="outline"
              className="flex items-center gap-2 w-full sm:w-1/2"
              onClick={() => router.push("/dashboard")}
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>

            <Button
              variant="destructive"
              className="flex items-center gap-2 w-full sm:w-1/2"
              onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("user_id");
                localStorage.removeItem("email");
                router.push("/login");
              }}
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
