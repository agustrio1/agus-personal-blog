"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LogoutButton } from "@/components/auth/logout-button"
import {
  LayoutDashboard,
  FolderOpen,
  FileText,
  Briefcase,
  Settings,
  Home,
  Menu,
  X,
  User,
  Bell,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

interface DashboardLayoutProps {
  children: React.ReactNode
}

const menuItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    color: "from-blue-500 to-cyan-500",
  },
  {
    title: "Kategori",
    href: "/dashboard/categories",
    icon: FolderOpen,
    color: "from-emerald-500 to-teal-500",
  },
  {
    title: "Post",
    href: "/dashboard/posts",
    icon: FileText,
    color: "from-purple-500 to-pink-500",
  },
  {
    title: "Project",
    href: "/dashboard/projects",
    icon: Briefcase,
    color: "from-orange-500 to-red-500",
  },
  {
    title: "Pengaturan",
    href: "/dashboard/settings",
    icon: Settings,
    color: "from-gray-500 to-slate-500",
  },
]

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const pathname = usePathname()

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false)
  }, [pathname])

  // Handle responsive sidebar collapse
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarCollapsed(false)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 bg-white/90 backdrop-blur-xl border-r border-gray-200/50 shadow-2xl transform transition-all duration-300 ease-in-out lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
          sidebarCollapsed ? "lg:w-20" : "lg:w-72",
          "w-72"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200/50">
            <div
              className={cn(
                "flex items-center transition-all duration-300",
                sidebarCollapsed ? "lg:justify-center" : "space-x-3",
              )}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                <User className="w-6 h-6 text-white" />
              </div>
              {!sidebarCollapsed && (
                <div>
                  <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                    Blog Admin
                  </span>
                  <p className="text-xs text-gray-500 mt-0.5">Personal Dashboard</p>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2">
              {/* Collapse button for desktop */}
              <Button
                variant="ghost"
                size="sm"
                className="hidden lg:flex"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              >
                {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              </Button>

              {/* Close button for mobile */}
              <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setSidebarOpen(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group flex items-center px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 relative overflow-hidden",
                    isActive
                      ? "bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 shadow-lg shadow-indigo-100/50"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:shadow-md",
                    sidebarCollapsed ? "lg:justify-center lg:px-2" : "space-x-3",
                  )}
                  onClick={() => setSidebarOpen(false)}
                >
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-xl" />
                  )}
                  <div
                    className={cn(
                      "relative z-10 p-2 rounded-lg transition-all duration-200",
                      isActive ? `bg-gradient-to-r ${item.color} text-white shadow-lg` : "group-hover:bg-gray-100",
                    )}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  {!sidebarCollapsed && <span className="relative z-10">{item.title}</span>}
                  {isActive && (
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-l-full" />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200/50 space-y-2">
            <Link
              href="/"
              className={cn(
                "flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200 group",
                sidebarCollapsed && "lg:justify-center lg:space-x-0",
              )}
            >
              <div className="p-2 rounded-lg group-hover:bg-gray-100 transition-all duration-200">
                <Home className="w-5 h-5" />
              </div>
              {!sidebarCollapsed && <span>Kembali ke Home</span>}
            </Link>
            <div className={cn(sidebarCollapsed && "lg:flex lg:justify-center")}>
              <LogoutButton />
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div
        className={cn(
          "transition-all duration-300",
          sidebarCollapsed ? "lg:ml-20" : "lg:ml-72"
        )}
      >
        {/* Top bar */}
        <div className="bg-white/80 backdrop-blur-xl shadow-sm border-b border-gray-200/50 sticky top-0 z-30">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
                <Menu className="w-5 h-5" />
              </Button>

              {/* Search bar */}
              <div className="hidden md:flex items-center space-x-2 bg-gray-50 rounded-xl px-4 py-2 min-w-[300px]">
                <Search className="w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari konten, kategori, atau project..."
                  className="bg-transparent border-none outline-none text-sm text-gray-600 placeholder-gray-400 flex-1"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Mobile search button */}
              <Button variant="ghost" size="sm" className="md:hidden">
                <Search className="w-5 h-5" />
              </Button>

              {/* Notifications */}
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs"></span>
              </Button>

              {/* User profile */}
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">Admin</p>
                  <p className="text-xs text-gray-500">Online</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
 