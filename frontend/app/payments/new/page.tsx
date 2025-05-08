"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Calendar, Loader2, Save } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarTrigger } from "@/components/sidebar-provider"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import api from "@/lib/api"

interface Tenant {
  id: string
  name: string
}

export default function NewPaymentPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [formData, setFormData] = useState({
    tenant: "",
    amount: "",
    rent_month: format(new Date(), "MMMM yyyy"),
  })

  useEffect(() => {
    const checkAuth = async () => {
      if (!api.isAuthenticated()) {
        router.push("/login")
        return
      }

      try {
        const tenantsData = await api.getTenants()
        setTenants(tenantsData)
      } catch (error) {
        console.error("Error fetching tenants:", error)
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
    setFormData((prev) => ({ ...prev, tenant: value }))
  }

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setDate(date)
      setFormData((prev) => ({ ...prev, rent_month: format(date, "MMMM yyyy") }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const paymentData = {
        ...formData,
        amount: Number.parseFloat(formData.amount),
        payment_date: new Date().toISOString(),
      }

      await api.createPayment(paymentData)
      router.push("/payments")
    } catch (error) {
      console.error("Error creating payment:", error)
      alert("Failed to record payment. Please try again.")
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
              <h1 className="text-lg font-semibold">Record Payment</h1>
            </div>
          </header>
          <main className="flex-1 p-4 md:p-6 animate-fade-in">
            <Button variant="ghost" className="mb-4 gap-1" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>

            <Card>
              <CardHeader>
                <CardTitle>Payment Information</CardTitle>
                <CardDescription>Record a new rent payment. All fields marked with * are required.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="tenant">
                      Tenant <span className="text-destructive">*</span>
                    </Label>
                    <Select value={formData.tenant} onValueChange={handleSelectChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a tenant" />
                      </SelectTrigger>
                      <SelectContent>
                        {tenants.map((tenant) => (
                          <SelectItem key={tenant.id} value={tenant.id}>
                            {tenant.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="amount">
                      Amount <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="amount"
                      name="amount"
                      type="number"
                      step="0.01"
                      placeholder="Enter payment amount"
                      value={formData.amount}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="rent_month">
                      Rent Month <span className="text-destructive">*</span>
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          <Calendar className="mr-2 h-4 w-4" />
                          {formData.rent_month}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <CalendarComponent mode="single" selected={date} onSelect={handleDateSelect} initialFocus />
                      </PopoverContent>
                    </Popover>
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
                          Record Payment
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
