"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Loader2, Save } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarTrigger } from "@/components/sidebar-provider"
import api from "@/lib/api"

interface FlatBuilding {
  id: string
  name: string
  address: string
}

export default function NewHousePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [buildings, setBuildings] = useState<FlatBuilding[]>([])
  const [selectedBuildingName, setSelectedBuildingName] = useState<string>("")
  const [formData, setFormData] = useState({
    house_num: "",
    house_size: "",
    house_rent_amount: "",
    flat_building: "",
  })

  useEffect(() => {
    const checkAuth = async () => {
      if (!api.isAuthenticated()) {
        router.push("/login")
        return
      }

      try {
        const buildingsData = await api.getFlats()
        setBuildings(buildingsData)
      } catch (error) {
        console.error("Error fetching buildings:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value: string) => {
    // Find the building name for the selected ID
    const building = buildings.find((b) => b.id === value)
    if (building) {
      setSelectedBuildingName(building.name)
    }
    setFormData((prev) => ({ ...prev, flat_building: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const houseData = {
        ...formData,
        house_rent_amount: Number.parseFloat(formData.house_rent_amount),
      }

      await api.createHouse(houseData)
      router.push("/houses")
    } catch (error) {
      console.error("Error creating house:", error)
      alert("Failed to create house. Please try again.")
    } finally {
      setIsSaving(false)
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
              <h1 className="text-lg font-semibold">Add New House</h1>
            </div>
          </header>
          <main className="flex-1 p-4 md:p-6 animate-fade-in">
            <Button variant="ghost" className="mb-4 gap-1" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>

            <Card>
              <CardHeader>
                <CardTitle>House Information</CardTitle>
                <CardDescription>Add a new house to the system. All fields marked with * are required.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="house_num">
                        House Number <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="house_num"
                        name="house_num"
                        placeholder="Enter house number"
                        value={formData.house_num}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="house_size">
                        House Size <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="house_size"
                        name="house_size"
                        placeholder="Enter house size (e.g., 2BR, 100sqm)"
                        value={formData.house_size}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="house_rent_amount">
                        Rent Amount <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="house_rent_amount"
                        name="house_rent_amount"
                        type="number"
                        step="0.01"
                        placeholder="Enter rent amount"
                        value={formData.house_rent_amount}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="flat_building">
                        Building <span className="text-destructive">*</span>
                      </Label>
                      <Select value={formData.flat_building} onValueChange={handleSelectChange}>
                        <SelectTrigger>{selectedBuildingName || "Select a building"}</SelectTrigger>
                        <SelectContent>
                          {buildings.map((building) => (
                            <SelectItem key={building.id} value={building.id}>
                              {building.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit" disabled={isSaving} className="gap-1">
                      {isSaving ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4" />
                          Save House
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </main>
        </div>
      </SidebarInset>
    </>
  )
}
