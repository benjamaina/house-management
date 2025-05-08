"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Building, Home, Loader2, Users, Wallet } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarTrigger } from "@/components/sidebar-provider"
import api from "@/lib/api"

interface DashboardStats {
  totalTenants: number
  totalHouses: number
  occupiedHouses: number
  totalBuildings: number
  totalPayments: number
}

export default function DashboardPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState<DashboardStats>({
    totalTenants: 0,
    totalHouses: 0,
    occupiedHouses: 0,
    totalBuildings: 0,
    totalPayments: 0,
  })

  useEffect(() => {
    const checkAuth = async () => {
      if (!api.isAuthenticated()) {
        router.push("/login")
        return
      }

      try {
        // Fetch dashboard data
        const [tenants, houses, flats, payments] = await Promise.all([
          api.getTenants(),
          api.getHouses(),
          api.getFlats(),
          api.getPayments(),
        ])

        setStats({
          totalTenants: tenants.length,
          totalHouses: houses.length,
          occupiedHouses: houses.filter((house: any) => house.occupation).length,
          totalBuildings: flats.length,
          totalPayments: payments.length,
        })
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router])

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <>
      <AppSidebar />
      <SidebarInset>
        <div className="flex flex-col">
          <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 sm:px-6">
            <SidebarTrigger />
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold">Dashboard</h1>
            </div>
          </header>
          <main className="flex-1 p-4 md:p-6 animate-fade-in">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Tenants</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalTenants}</div>
                  <p className="text-xs text-muted-foreground">Active tenants in your properties</p>
                </CardContent>
              </Card>
              <Card className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Houses</CardTitle>
                  <Home className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalHouses}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.occupiedHouses} occupied, {stats.totalHouses - stats.occupiedHouses} vacant
                  </p>
                </CardContent>
              </Card>
              <Card className="animate-slide-up" style={{ animationDelay: "0.3s" }}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Buildings</CardTitle>
                  <Building className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalBuildings}</div>
                  <p className="text-xs text-muted-foreground">Total flat buildings managed</p>
                </CardContent>
              </Card>
              <Card className="animate-slide-up" style={{ animationDelay: "0.4s" }}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Payments</CardTitle>
                  <Wallet className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalPayments}</div>
                  <p className="text-xs text-muted-foreground">Total rent payments recorded</p>
                </CardContent>
              </Card>
            </div>

            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <Card className="animate-slide-up" style={{ animationDelay: "0.5s" }}>
                <CardHeader>
                  <CardTitle>Occupancy Overview</CardTitle>
                  <CardDescription>Current occupancy status of your properties</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-primary"></div>
                        <span>Occupied</span>
                      </div>
                      <span className="font-medium">{stats.occupiedHouses} houses</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-muted"></div>
                        <span>Vacant</span>
                      </div>
                      <span className="font-medium">{stats.totalHouses - stats.occupiedHouses} houses</span>
                    </div>
                    <div className="h-4 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full bg-primary transition-all"
                        style={{
                          width: `${stats.totalHouses ? (stats.occupiedHouses / stats.totalHouses) * 100 : 0}%`,
                        }}
                      ></div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {stats.totalHouses ? Math.round((stats.occupiedHouses / stats.totalHouses) * 100) : 0}% occupancy
                      rate
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="animate-slide-up" style={{ animationDelay: "0.6s" }}>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common tasks and operations</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-2">
                  <div
                    className="flex cursor-pointer items-center gap-3 rounded-md border p-3 transition-colors hover:bg-muted"
                    onClick={() => router.push("/tenants/new")}
                  >
                    <Users className="h-5 w-5 text-primary" />
                    <div>
                      <div className="font-medium">Add New Tenant</div>
                      <div className="text-sm text-muted-foreground">Register a new tenant in the system</div>
                    </div>
                  </div>
                  <div
                    className="flex cursor-pointer items-center gap-3 rounded-md border p-3 transition-colors hover:bg-muted"
                    onClick={() => router.push("/houses/new")}
                  >
                    <Home className="h-5 w-5 text-primary" />
                    <div>
                      <div className="font-medium">Add New House</div>
                      <div className="text-sm text-muted-foreground">Register a new house in the system</div>
                    </div>
                  </div>
                  <div
                    className="flex cursor-pointer items-center gap-3 rounded-md border p-3 transition-colors hover:bg-muted"
                    onClick={() => router.push("/flats/new")}
                  >
                    <Building className="h-5 w-5 text-primary" />
                    <div>
                      <div className="font-medium">Add New Building</div>
                      <div className="text-sm text-muted-foreground">Register a new building in the system</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </SidebarInset>
    </>
  )
}
