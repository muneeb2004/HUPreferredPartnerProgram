import { Store, Tag, Users, Mail } from "lucide-react";
import { cookies } from "next/headers";

import { MetricCard } from "@/components/layout/admin/metric-card";

import type * as React from "react";

interface DashboardStats {
  partners: number;
  offers: number;
  users: number;
  activeSubscriptions: number;
}

async function getDashboardStats(): Promise<DashboardStats | null> {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;
    
    // Fallback headers for server-to-server request
    const headers: HeadersInit = {
      "Content-Type": "application/json"
    };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
      // Some backends might just read from cookie header
      headers.Cookie = `accessToken=${token}`;
    }

    const res = await fetch(`${API_URL}/api/v1/admin/stats`, {
      headers,
      cache: "no-store", // Dashboard should always be fresh
    });
    
    if (!res.ok) {
      console.error(`Admin stats fetch failed with status: ${res.status}`);
      return null;
    }
    
    const json = (await res.json()) as { data: DashboardStats };
    return json.data;
  } catch (error: unknown) {
    console.error("Failed to fetch admin stats:", error);
    return null;
  }
}

export default async function AdminDashboardPage(): React.JSX.Element {
  const stats = await getDashboardStats();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Overview of your platform activity.</p>
      </div>

      {!stats ? (
        <div className="p-12 text-center bg-surface-card border border-border rounded-xl">
          <p className="text-muted-foreground">Unable to load dashboard statistics at this time.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Total Partners"
            value={stats.partners}
            icon={Store}
            description="Active brand partners"
          />
          <MetricCard
            title="Total Offers"
            value={stats.offers}
            icon={Tag}
            description="Active deals and discounts"
          />
          <MetricCard
            title="Total Users"
            value={stats.users}
            icon={Users}
            description="Registered students"
          />
          <MetricCard
            title="Active Subscriptions"
            value={stats.activeSubscriptions}
            icon={Mail}
            description="Newsletter subscribers"
          />
        </div>
      )}
    </div>
  );
}
