"use client"

import { AuthGuard } from "@/components/auth/auth-guard"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { ProjectForm } from "@/components/projects/project-form"

export default function NewProjectPage() {
  return (
    <AuthGuard>
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tambah Project Baru</h1>
            <p className="text-gray-600 mt-1">
              Buat project baru untuk portfolio Anda
            </p>
          </div>
          <ProjectForm />
        </div>
      </DashboardLayout>
    </AuthGuard>
  )
} 