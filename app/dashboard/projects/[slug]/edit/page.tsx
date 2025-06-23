"use client"

import { use } from "react"
import { AuthGuard } from "@/components/auth/auth-guard"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { ProjectEditForm } from "@/components/projects/project-edit-form"

interface EditProjectPageProps {
  params: Promise<{
    slug: string
  }>
}

export default function EditProjectPage({ params }: EditProjectPageProps) {
  const { slug } = use(params)
  
  return (
    <AuthGuard>
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Project</h1>
            <p className="text-gray-600 mt-1">
              Edit informasi project Anda
            </p>
          </div>
          <ProjectEditForm slug={slug} />
        </div>
      </DashboardLayout>
    </AuthGuard>
  )
} 