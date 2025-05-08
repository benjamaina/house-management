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
import api from "@/lib/api"

interface FlatBuilding {
  id: string
  name: string
  address: string
  number_of_houses: number
  how_many_occupied: number
  vacant_houses: number
}

export default function BuildingsPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [buildings, setBuildings] = useState<FlatBuilding[]>([])
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const checkAuth = async () => {
      if (!api.isAuthenticated()) {
        router.push("/login")
        return
      }

      try {
        const data = await api.getFlats()
        setBuildings(data)
      } catch (error) {
        console.error("Error fetching buildings:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router])

  const filteredBuildings = buildings.filter((building) =>
    building.address.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this building?")) {
      try {
        const success = await api.deleteFlat(id)
        if (success) {
          setBuildings(buildings.filter((building) => building.id !== id))
        } else {
          alert("Failed to delete building. It may be in use by houses.")
        }
      } catch (error) {
        console.error("Error deleting building:", error)
        alert("Failed to delete building. It may be in use by houses or there was a server error.")
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
              <h1 className="text-lg font-semibold">Buildings</h1>
            </div>
          </header>
          <main className="flex-1 p-4 md:p-6 animate-fade-in">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="relative w-full md:w-72">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search buildings..."
                  className="w-full pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button onClick={() => router.push("/flats/new")} className="gap-1">
                <Plus className="h-4 w-4" />
                Add Building
              </Button>
            </div>

            <Card className="mt-6">
              <CardHeader className="pb-1">
                <CardTitle>All Buildings</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Address</TableHead>
                      <TableHead className="text-right">Total Houses</TableHead>
                      <TableHead className="text-right">Occupied</TableHead>
                      <TableHead className="text-right">Vacant</TableHead>
                      <TableHead className="text-right">Occupancy Rate</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBuildings.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center">
                          {searchQuery ? "No buildings found matching your search" : "No buildings found"}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredBuildings.map((building) => (
                        <TableRow key={building.id} className="animate-slide-up">
                          <TableCell className="font-medium">{building.name}</TableCell>
                          <TableCell>{building.address}</TableCell>
                          <TableCell className="text-right">{building.number_of_houses}</TableCell>
                          <TableCell className="text-right">{building.how_many_occupied}</TableCell>
                          <TableCell className="text-right">{building.vacant_houses}</TableCell>
                          <TableCell className="text-right">
                            {building.number_of_houses > 0
                              ? `${Math.round((building.how_many_occupied / building.number_of_houses) * 100)}%`
                              : "N/A"}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="icon" onClick={() => router.push(`/flats/${building.id}`)}>
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handleDelete(building.id)}>
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
