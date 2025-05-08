"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Building } from "lucide-react"

import { Button } from "@/components/ui/button"
import api from "@/lib/api"

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Check if user is already authenticated
    if (api.isAuthenticated()) {
      router.push("/dashboard")
    }
  }, [router])

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="flex items-center gap-2">
            <Building className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">Property Management</span>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4 animate-fade-in">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Property Management Admin
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Manage your properties, tenants, and payments with our custom admin panel.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button asChild size="lg" className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
                    <Link href="/login">Login</Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="animate-slide-up"
                    style={{ animationDelay: "0.2s" }}
                  >
                    <Link href="/register">Register</Link>
                  </Button>
                </div>
              </div>
              <div className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last animate-fade-in">
                <div className="h-full w-full bg-gradient-to-br from-primary/20 via-secondary/20 to-muted rounded-xl flex items-center justify-center">
                  <Building className="h-24 w-24 text-primary" />
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/40">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Features</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our admin panel provides all the tools you need to manage your properties efficiently.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <div className="grid gap-1 animate-slide-up" style={{ animationDelay: "0.1s" }}>
                <h3 className="text-xl font-bold">Tenant Management</h3>
                <p className="text-muted-foreground">
                  Easily manage tenant information, track balances, and monitor active status.
                </p>
              </div>
              <div className="grid gap-1 animate-slide-up" style={{ animationDelay: "0.2s" }}>
                <h3 className="text-xl font-bold">Property Tracking</h3>
                <p className="text-muted-foreground">
                  Keep track of all your buildings and houses, including occupancy status.
                </p>
              </div>
              <div className="grid gap-1 animate-slide-up" style={{ animationDelay: "0.3s" }}>
                <h3 className="text-xl font-bold">Payment Processing</h3>
                <p className="text-muted-foreground">
                  Record and monitor rent payments, track outstanding balances, and generate reports.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © 2025 Property Management. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
