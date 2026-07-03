import type * as React from "react";
import { type Metadata } from "next";
import { cookies } from "next/headers";
import { MetricGrid, AnalyticsCard } from "@/components/admin/analytics/MetricGrid";

export const metadata: Metadata = {
  title: "Brand Analytics",
};

async function getPartnerAnalyticsData() {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  
  if (!token) return null;
  
  try {
    const res = await fetch('http://localhost:3000/api/v1/portal/analytics', {
      headers: {
        Authorization: `Bearer ${token}`
      },
      next: { revalidate: 60 }
    });
    
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    return null;
  }
}

export default async function BrandAnalyticsPage(): Promise<React.JSX.Element> {
  const data = await getPartnerAnalyticsData();
  
  if (!data) {
    return (
      <div className="p-8 max-w-5xl mx-auto">
        <h1 className="text-3xl font-display font-bold mb-8">Analytics Dashboard</h1>
        <p className="text-muted-foreground">Unable to load analytics data or you do not have permission.</p>
      </div>
    );
  }

  const { metrics, topOffers } = data;

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-12">
      <div>
        <h1 className="text-3xl font-display font-bold mb-2">Analytics Dashboard</h1>
        <p className="text-muted-foreground">Performance overview for the last 30 days.</p>
      </div>
      
      <section>
        <MetricGrid>
          <AnalyticsCard title="Profile Views" value={metrics?.totalViews || 0} />
          <AnalyticsCard title="Offer Clicks" value={metrics?.totalClicks || 0} />
          <AnalyticsCard 
            title="Click-Through Rate" 
            value={`${metrics?.ctr || 0}%`} 
          />
        </MetricGrid>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-6">Top Performing Offers</h2>
        <div className="grid gap-4">
          {(topOffers || []).map((offer: any) => (
            <div key={offer.offerId} className="flex items-center justify-between p-6 bg-surface-card border border-border rounded-xl shadow-sm">
              <div>
                <h3 className="font-semibold">{offer.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">ID: {offer.offerId}</p>
              </div>
              <div className="flex gap-8 text-right">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Views</p>
                  <p className="font-medium">{offer.views}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Clicks</p>
                  <p className="font-medium">{offer.clicks}</p>
                </div>
              </div>
            </div>
          ))}
          {(!topOffers || topOffers.length === 0) && (
            <div className="p-8 text-center border border-border border-dashed rounded-xl text-muted-foreground italic">
              Not enough data yet.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
