"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Edit, Loader2, Plus, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarTrigger } from "@/components/sidebar-provider"
import { Badge } from "@/components/ui/badge"
import api from "@/lib/api"

interface Payment {
  id: string
  tenant: string
  tenant_name: string
  amount: number
  payment_date: string
  rent_month: string
  is_paid: boolean
}

export default function PaymentsPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [payments, setPayments] = useState<Payment[]>([])
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const checkAuth = async () => {
      if (!api.isAuthenticated()) {
        router.push("/login")
        return
      }

      try {
        const data = await api.getPayments()
        setPayments(data)
      } catch (error) {
        console.error("Error fetching payments:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router])

  const filteredPayments = payments.filter(
    (payment) =>
      payment.tenant_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.rent_month?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString()
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
              <h1 className="text-lg font-semibold">Payments</h1>
            </div>
          </header>
          <main className="flex-1 p-4 md:p-6 animate-fade-in">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="relative w-full md:w-72">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search payments..."
                  className="w-full pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button onClick={() => router.push("/payments/new")} className="gap-1">
                <Plus className="h-4 w-4" />
                Record Payment
              </Button>
            </div>

            <Card className="mt-6">
              <CardHeader className="pb-1">
                <CardTitle>All Payments</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tenant</TableHead>
                      <TableHead>Payment Date</TableHead>
                      <TableHead>Rent Month</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPayments.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center">
                          {searchQuery ? "No payments found matching your search" : "No payments found"}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredPayments.map((payment) => (
                        <TableRow key={payment.id} className="animate-slide-up">
                          <TableCell className="font-medium">{payment.tenant_name}</TableCell>
                          <TableCell>{formatDate(payment.payment_date)}</TableCell>
                          <TableCell>{payment.rent_month}</TableCell>
                          <TableCell>
                            <Badge variant={payment.is_paid ? "default" : "secondary"}>
                              {payment.is_paid ? "Paid" : "Pending"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">${payment.amount.toFixed(2)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => router.push(`/payments/${payment.id}`)}
                              >
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">View Details</span>
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
