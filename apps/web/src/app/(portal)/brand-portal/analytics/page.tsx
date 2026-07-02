import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Skeleton,
  Badge,
} from "@hu-partner/ui"
import { BarChart3, Clock, CheckCircle2, FileEdit, Archive, CalendarClock, Tag } from "lucide-react"
import { cookies } from "next/headers"
import { Suspense } from "react"

import type * as React from "react"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

interface AnalyticsData {
  summary: {
    total: number
    active: number
    draft: number
    review: number
    archived: number
    expired: number
    upcoming: number
  }
  categories: {
    category: string
    count: number
  }[]
  recentActivity: {
    id: string
    title: string
    status: string
    createdAt: string
    expiresAt: string | null
  }[]
  monthlyTrend: {
    month: string
    count: number
  }[]
}

async function getAnalytics(): Promise<AnalyticsData> {
  const cookieStore = await cookies()
  const token = cookieStore.get("accessToken")?.value

  const res = await fetch(`${API_URL}/api/v1/portal/analytics`, {
    cache: "no-store",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  })

  if (!res.ok) {
    throw new Error("Failed to fetch analytics")
  }

  const json = (await res.json()) as AnalyticsData
  return json
}

function AnalyticsSkeleton(): React.JSX.Element {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-1/2 mb-2" />
              <Skeleton className="h-3 w-3/4" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-1/3 mb-2" />
            <Skeleton className="h-4 w-2/3" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[200px] w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-1/3 mb-2" />
            <Skeleton className="h-4 w-2/3" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[200px] w-full" />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

async function AnalyticsDashboard(): Promise<React.JSX.Element> {
  const data = await getAnalytics()

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Offers</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.summary.total}</div>
            <p className="text-xs text-muted-foreground">
              All offers created
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Offers</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.summary.active}</div>
            <p className="text-xs text-muted-foreground">
              Currently available to users
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Review</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.summary.review}</div>
            <p className="text-xs text-muted-foreground">
              Waiting for admin approval
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Drafts</CardTitle>
            <FileEdit className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.summary.draft}</div>
            <p className="text-xs text-muted-foreground">
              Not yet submitted
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Archived</CardTitle>
            <Archive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.summary.archived}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expired</CardTitle>
            <Clock className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.summary.expired}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
            <CalendarClock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.summary.upcoming}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Offer Activity</CardTitle>
            <CardDescription>
              Your latest submitted and drafted offers
            </CardDescription>
          </CardHeader>
          <CardContent>
            {data.recentActivity.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Expires</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.recentActivity.map((offer) => (
                    <TableRow key={offer.id}>
                      <TableCell className="font-medium">{offer.title}</TableCell>
                      <TableCell>
                        <Badge variant={
                          offer.status === "PUBLISHED" ? "default" :
                          offer.status === "REVIEW" ? "secondary" :
                          offer.status === "ARCHIVED" ? "destructive" :
                          "outline"
                        }>{offer.status}</Badge>
                      </TableCell>
                      <TableCell>{new Date(offer.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        {offer.expiresAt ? new Date(offer.expiresAt).toLocaleDateString() : "Never"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <p className="text-sm text-muted-foreground">No recent offers found.</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        <div className="col-span-3 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Categories Breakdown</CardTitle>
              <CardDescription>
                Your offers grouped by discount type
              </CardDescription>
            </CardHeader>
            <CardContent>
              {data.categories.length > 0 ? (
                <div className="space-y-4">
                  {data.categories.map((c) => (
                    <div key={c.category} className="flex items-center">
                      <div className="ml-4 space-y-1 w-full">
                        <p className="text-sm font-medium leading-none flex justify-between">
                          {c.category}
                          <span>{c.count}</span>
                        </p>
                        <div className="h-2 w-full bg-secondary rounded-full overflow-hidden mt-2">
                          <div 
                            className="h-full bg-primary" 
                            style={{ width: `${Math.max(5, (c.count / data.summary.total) * 100)}%` }} 
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-4 text-center">
                  <p className="text-sm text-muted-foreground">No category data.</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Monthly Trend</CardTitle>
              <CardDescription>
                Offers created per month
              </CardDescription>
            </CardHeader>
            <CardContent>
              {data.monthlyTrend.length > 0 ? (
                <div className="space-y-4">
                  {data.monthlyTrend.map((m) => (
                    <div key={m.month} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{m.month}</span>
                      <div className="flex items-center space-x-2">
                        <BarChart3 className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-bold">{m.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-4 text-center">
                  <p className="text-sm text-muted-foreground">No trend data yet.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default function AnalyticsPage(): React.JSX.Element {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
      </div>
      
      <Suspense fallback={<AnalyticsSkeleton />}>
        <AnalyticsDashboard />
      </Suspense>
    </div>
  )
}
