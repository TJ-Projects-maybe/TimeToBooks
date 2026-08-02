"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../lib/auth";

export const dynamic = 'force-dynamic';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [timeoutReached, setTimeoutReached] = useState(false);

  useEffect(() => {
    // Set a timeout to prevent infinite loading
    const timer = setTimeout(() => {
      setTimeoutReached(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!loading || timeoutReached) {
      if (user) {
        router.push("/dashboard");
      } else {
        router.push("/login");
      }
    }
  }, [user, loading, router, timeoutReached]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">TimeToBooks</h1>
        <p className="text-gray-600">Chargement...</p>
      </div>
    </div>
  );
}
