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
import { Switch } from "@/components/ui/switch"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarTrigger } from "@/components/sidebar-provider"
import api from "@/lib/api"

interface House {
  id: string
  house_num: string
  flat_building: string
  occupation: boolean
}

export default function NewTenantPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [houses, setHouses] = useState<House[]>([])
  const [selectedHouseLabel, setSelectedHouseLabel] = useState<string>("")
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    id_number: "",
    house: "",
    is_active: true,
  })

  useEffect(() => {
    const checkAuth = async () => {
      if (!api.isAuthenticated()) {
        router.push("/login")
        return
      }

      try {
        const housesData = await api.getHouses()
        // Filter to only show vacant houses
        const vacantHouses = housesData.filter((house: House) => !house.occupation)
        setHouses(vacantHouses)
      } catch (error) {
        console.error("Error fetching houses:", error)
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

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, is_active: checked }))
  }

  const handleSelectChange = (value: string) => {
    // Find the house label for the selected ID
    const house = houses.find((h) => h.id === value)
    if (house) {
      setSelectedHouseLabel(`${house.house_num} (${house.flat_building})`)
    }
    setFormData((prev) => ({ ...prev, house: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      await api.createTenant(formData)
      router.push("/tenants")
    } catch (error) {
      console.error("Error creating tenant:", error)
      alert("Failed to create tenant. Please try again.")
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
              <h1 className="text-lg font-semibold">Add New Tenant</h1>
            </div>
          </header>
          <main className="flex-1 p-4 md:p-6 animate-fade-in">
            <Button variant="ghost" className="mb-4 gap-1" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>

            <Card>
              <CardHeader>
                <CardTitle>Tenant Information</CardTitle>
                <CardDescription>
                  Add a new tenant to the system. All fields marked with * are required.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">
                        Name <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="Enter tenant name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">
                        Phone <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        placeholder="Enter phone number"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="id_number">
                        ID Number <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="id_number"
                        name="id_number"
                        placeholder="Enter ID number"
                        value={formData.id_number}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="house">
                        House <span className="text-destructive">*</span>
                      </Label>
                      <Select value={formData.house} onValueChange={handleSelectChange}>
                        <SelectTrigger>{selectedHouseLabel || "Select a vacant house"}</SelectTrigger>
                        <SelectContent>
                          {houses.length === 0 ? (
                            <SelectItem value="no-houses" disabled>
                              No vacant houses available
                            </SelectItem>
                          ) : (
                            houses.map((house) => (
                              <SelectItem key={house.id} value={house.id}>
                                {house.house_num} ({house.flat_building})
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      {houses.length === 0 && (
                        <p className="mt-2 text-xs text-destructive">
                          No vacant houses available. Please add a house first.
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch id="is_active" checked={formData.is_active} onCheckedChange={handleSwitchChange} />
                    <Label htmlFor="is_active">Active Tenant</Label>
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit" disabled={isSaving || houses.length === 0} className="gap-1">
                      {isSaving ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4" />
                          Save Tenant
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
