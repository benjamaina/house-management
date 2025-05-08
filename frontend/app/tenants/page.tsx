"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Edit, Loader2, Plus, Search, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarTrigger } from "@/components/sidebar-provider"
import { Badge } from "@/components/ui/badge"
import api from "@/lib/api"

interface Tenant {
  id: string
  name: string
  phone: string
  balance: number
  id_number: string
  house: string
  is_active: boolean
  outstanding_rent: number
}

export default function TenantsPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const checkAuth = async () => {
      if (!api.isAuthenticated()) {
        router.push("/login")
        return
      }

      try {
        const data = await api.getTenants()
        setTenants(data)
      } catch (error) {
        console.error("Error fetching tenants:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router])

  const filteredTenants = tenants.filter(
    (tenant) =>
      tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tenant.phone.includes(searchQuery) ||
      tenant.id_number.includes(searchQuery),
  )

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this tenant?")) {
      try {
        await api.deleteTenant(id)
        setTenants(tenants.filter((tenant) => tenant.id !== id))
      } catch (error) {
        console.error("Error deleting tenant:", error)
      }
    }
  }

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
              <h1 className="text-lg font-semibold">Tenants</h1>
            </div>
          </header>
          <main className="flex-1 p-4 md:p-6 animate-fade-in">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="relative w-full md:w-72">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search tenants..."
                  className="w-full pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button onClick={() => router.push("/tenants/new")} className="gap-1">
                <Plus className="h-4 w-4" />
                Add Tenant
              </Button>
            </div>

            <Card className="mt-6">
              <CardHeader className="pb-1">
                <CardTitle>All Tenants</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>ID Number</TableHead>
                      <TableHead>House</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Balance</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTenants.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center">
                          {searchQuery ? "No tenants found matching your search" : "No tenants found"}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredTenants.map((tenant) => (
                        <TableRow key={tenant.id} className="animate-slide-up">
                          <TableCell className="font-medium">{tenant.name}</TableCell>
                          <TableCell>{tenant.phone}</TableCell>
                          <TableCell>{tenant.id_number}</TableCell>
                          <TableCell>{tenant.house}</TableCell>
                          <TableCell>
                            <Badge variant={tenant.is_active ? "default" : "secondary"}>
                              {tenant.is_active ? "Active" : "Inactive"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">${tenant.outstanding_rent.toFixed(2)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="icon" onClick={() => router.push(`/tenants/${tenant.id}`)}>
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handleDelete(tenant.id)}>
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </main>
        </div>
      </SidebarInset>
    </>
  )
}
