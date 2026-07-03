import type * as React from "react";
import { type Metadata } from "next";
import { cookies } from "next/headers";
import { MetricGrid, AnalyticsCard } from "@/components/admin/analytics/MetricGrid";

export const metadata: Metadata = {
  title: "Admin Analytics",
};

async function getAnalyticsData() {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  
  if (!token) return null;
  
  try {
    // Ideally this URL comes from env
    const res = await fetch('http://localhost:3000/api/v1/admin/analytics', {
      headers: {
        Authorization: `Bearer ${token}`
      },
      next: { revalidate: 60 } // Cache for 60 seconds matching our architecture
    });
    
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    return null;
  }
}

export default async function AdminAnalyticsPage(): Promise<React.JSX.Element> {
  const data = await getAnalyticsData();
  
  if (!data) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-display font-bold mb-8">Platform Analytics</h1>
        <p className="text-muted-foreground">Unable to load analytics data at this time.</p>
      </div>
    );
  }

  const { metrics, search, topPartners } = data;

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-display font-bold">Platform Analytics</h1>
      
      <section>
        <h2 className="text-xl font-bold mb-4">Traffic Overview</h2>
        <MetricGrid>
          <AnalyticsCard title="Total Platform Views" value={metrics?.totalViews || 0} />
          <AnalyticsCard title="Total Platform Clicks" value={metrics?.totalClicks || 0} />
        </MetricGrid>
      </section>
      
      <section>
        <h2 className="text-xl font-bold mb-4">Search Health</h2>
        <MetricGrid>
          <AnalyticsCard title="Total Searches" value={search?.totalSearches || 0} />
          <AnalyticsCard 
            title="Zero-Result Rate" 
            value={`${search?.zeroResultRate || 0}%`}
            trend={search?.zeroResultRate > 10 ? "High" : "Good"}
            trendUp={search?.zeroResultRate <= 10}
          />
        </MetricGrid>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-4">Top Performing Partners</h2>
        <div className="border border-border rounded-xl bg-surface-card overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="p-4 font-medium text-muted-foreground">Partner</th>
                <th className="p-4 font-medium text-muted-foreground text-right">Views</th>
                <th className="p-4 font-medium text-muted-foreground text-right">Clicks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {(topPartners || []).map((p: any) => (
                <tr key={p.partnerId} className="hover:bg-muted/30 transition-colors">
                  <td className="p-4 font-medium">{p.name}</td>
                  <td className="p-4 text-right">{p.views}</td>
                  <td className="p-4 text-right">{p.clicks}</td>
                </tr>
              ))}
              {(!topPartners || topPartners.length === 0) && (
                <tr>
                  <td colSpan={3} className="p-8 text-center text-muted-foreground italic">No data available.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
