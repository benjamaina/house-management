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

interface House {
  id: string
  house_num: string
  house_size: string
  house_rent_amount: number
  occupation: boolean
  flat_building: string
  flat_building_name: string
}

export default function HousesPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [houses, setHouses] = useState<House[]>([])
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const checkAuth = async () => {
      if (!api.isAuthenticated()) {
        router.push("/login")
        return
      }

      try {
        const data = await api.getHouses()
        setHouses(data)
      } catch (error) {
        console.error("Error fetching houses:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router])

  const filteredHouses = houses.filter(
    (house) =>
      house.house_num.toLowerCase().includes(searchQuery.toLowerCase()) ||
      house.flat_building.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this house?")) {
      try {
        await api.deleteHouse(id)
        setHouses(houses.filter((house) => house.id !== id))
      } catch (error) {
        console.error("Error deleting house:", error)
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
              <h1 className="text-lg font-semibold">Houses</h1>
            </div>
          </header>
          <main className="flex-1 p-4 md:p-6 animate-fade-in">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="relative w-full md:w-72">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search houses..."
                  className="w-full pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button onClick={() => router.push("/houses/new")} className="gap-1">
                <Plus className="h-4 w-4" />
                Add House
              </Button>
            </div>

            <Card className="mt-6">
              <CardHeader className="pb-1">
                <CardTitle>All Houses</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>House Number</TableHead>
                      <TableHead>Building</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Rent Amount</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredHouses.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center">
                          {searchQuery ? "No houses found matching your search" : "No houses found"}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredHouses.map((house) => (
                        <TableRow key={house.id} className="animate-slide-up">
                          <TableCell className="font-medium">{house.house_num}</TableCell>
                          <TableCell>{house.flat_building_name}</TableCell>
                          <TableCell>{house.house_size}</TableCell>
                          <TableCell>
                            <Badge variant={house.occupation ? "default" : "secondary"}>
                              {house.occupation ? "Occupied" : "Vacant"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            $
                            {typeof house.house_rent_amount === "number"
                              ? house.house_rent_amount.toFixed(2)
                              : Number(house.house_rent_amount).toFixed(2)}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="icon" onClick={() => router.push(`/houses/${house.id}`)}>
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handleDelete(house.id)}>
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
