"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  children: React.ReactNode;
};

export default function ProtectedRoute({ children }: Props) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/login");
    } else {
      setIsAuthorized(true);
    }

    setLoading(false);
  }, [router]);

  if (loading) return null;

  return isAuthorized ? <>{children}</> : null;
}
