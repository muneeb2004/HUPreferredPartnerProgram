import { Badge, Card, CardContent, CardDescription, CardHeader, CardTitle, Skeleton } from "@hu-partner/ui"
import { AlertCircle, ArrowRight, BarChart3, CheckCircle2, Clock, Settings, Store, Tag } from "lucide-react"
import { cookies } from "next/headers"
import Link from "next/link"
import { Suspense } from "react"

import type * as React from "react"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

// ─── TYPES ─────────────────────────────────────────────────────────

interface DashboardMetrics {
  totalOffers: number
  activeOffers: number
  expiredOffers: number
  upcomingOffers: number
}

interface Offer {
  id: string
  title: string
  status: string
  discountValue: number
  discountType: string
  updatedAt: string
}

interface DashboardData {
  companyName: string
  tier: string
  status: string
  profileCompletionPercentage: number
  lastUpdated: string
  metrics: DashboardMetrics
  recentActivity: Offer[]
}

// ─── DATA FETCHING ─────────────────────────────────────────────────

async function getDashboardData(): Promise<DashboardData | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get("accessToken")?.value
  
  if (!token) return null

  const res = await fetch(`${API_URL}/api/v1/portal/dashboard`, { 
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store' 
  })
  
  if (!res.ok) {
    if (res.status === 404) return null
    throw new Error("Failed to fetch dashboard data")
  }

  const json = (await res.json()) as { data: DashboardData }
  return json.data
}

// ─── COMPONENTS ────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }): React.JSX.Element {
  switch (status) {
    case "PUBLISHED":
    case "ACTIVE":
      return <Badge variant="default" className="bg-green-600 hover:bg-green-700">Active</Badge>
    case "REVIEW":
      return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">In Review</Badge>
    case "DRAFT":
      return <Badge variant="outline" className="text-muted-foreground">Draft</Badge>
    case "ARCHIVED":
      return <Badge variant="destructive">Archived</Badge>
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

async function DashboardOverview(): Promise<React.JSX.Element> {
  const data = await getDashboardData()

  if (!data) {
    return (
      <div className="p-8 text-center border rounded-lg bg-card text-card-foreground">
        <AlertCircle className="mx-auto h-12 w-12 text-destructive mb-4" />
        <h3 className="text-lg font-semibold">Profile Not Found</h3>
        <p className="text-muted-foreground mt-2">
          Your brand profile could not be located. Please contact support.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* LEFT COLUMN - Metrics & Activity */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Offers</CardTitle>
              <Tag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.metrics.totalOffers}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Offers</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.metrics.activeOffers}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
              <Clock className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.metrics.upcomingOffers}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Expired</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.metrics.expiredOffers}</div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Your most recently updated offers and campaigns.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {data.recentActivity.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground border border-dashed rounded-md">
                No recent activity. Create your first offer to get started.
              </div>
            ) : (
              <div className="space-y-4">
                {data.recentActivity.map((offer) => (
                  <div key={offer.id} className="flex items-center justify-between border-b last:border-0 pb-4 last:pb-0">
                    <div className="flex items-center gap-4">
                      <div className="bg-primary/10 p-2 rounded-full text-primary">
                        <Tag className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium text-sm leading-none">{offer.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {offer.discountValue}{offer.discountType === 'PERCENTAGE' ? '%' : ' off'} • Updated {new Date(offer.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <StatusBadge status={offer.status} />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* RIGHT COLUMN - Profile Summary & Actions */}
      <div className="space-y-6">
        
        {/* Profile Card */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Company Name</p>
              <p className="font-semibold text-lg">{data.companyName}</p>
            </div>
            
            <div className="flex justify-between items-center border-t pt-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Status</p>
                <div className="mt-1"><StatusBadge status={data.status} /></div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-muted-foreground">Tier</p>
                <Badge variant="outline" className="mt-1">{data.tier}</Badge>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-medium text-muted-foreground">Profile Completion</p>
                <span className="text-sm font-bold">{data.profileCompletionPercentage}%</span>
              </div>
              <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-primary h-full rounded-full" 
                  style={{ width: `${data.profileCompletionPercentage}%` }} 
                />
              </div>
              {data.profileCompletionPercentage < 100 && (
                <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  Complete your profile to attract more students.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-2">
            <Link 
              href="/brand-portal/profile" 
              className="flex items-center justify-between p-3 rounded-md hover:bg-muted transition-colors border"
            >
              <div className="flex items-center gap-3">
                <Store className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Edit Profile</span>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </Link>
            
            <Link 
              href="/brand-portal/offers" 
              className="flex items-center justify-between p-3 rounded-md hover:bg-muted transition-colors border"
            >
              <div className="flex items-center gap-3">
                <Tag className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Manage Offers</span>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </Link>

            <Link 
              href="/brand-portal/analytics" 
              className="flex items-center justify-between p-3 rounded-md hover:bg-muted transition-colors border"
            >
              <div className="flex items-center gap-3">
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">View Analytics</span>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </Link>

            <Link 
              href="/brand-portal/settings" 
              className="flex items-center justify-between p-3 rounded-md hover:bg-muted transition-colors border"
            >
              <div className="flex items-center gap-3">
                <Settings className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Account Settings</span>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </Link>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}

function DashboardSkeleton(): React.JSX.Element {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2"><Skeleton className="h-4 w-20" /></CardHeader>
              <CardContent><Skeleton className="h-8 w-12" /></CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardHeader><Skeleton className="h-6 w-32" /></CardHeader>
          <CardContent className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex justify-between border-b pb-4 last:border-0"><Skeleton className="h-8 w-48" /><Skeleton className="h-6 w-16" /></div>
            ))}
          </CardContent>
        </Card>
      </div>
      <div className="space-y-6">
        <Card>
          <CardHeader><Skeleton className="h-6 w-32" /></CardHeader>
          <CardContent className="space-y-4"><Skeleton className="h-16 w-full" /><Skeleton className="h-16 w-full" /></CardContent>
        </Card>
        <Card>
          <CardHeader><Skeleton className="h-6 w-32" /></CardHeader>
          <CardContent className="space-y-2">
             {Array.from({ length: 4 }).map((_, i) => (
               <Skeleton key={i} className="h-12 w-full" />
             ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// ─── MAIN PAGE ─────────────────────────────────────────────────────

export default function BrandPortalPage(): React.JSX.Element {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold">Brand Dashboard</h1>
        <p className="text-muted-foreground mt-1">Overview of your brand&apos;s performance and offers.</p>
      </div>
      
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardOverview />
      </Suspense>
    </div>
  )
}
