import { AuthGuard } from "@/components/auth/auth-guard"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { CategoryForm } from "@/components/dashboard/categories/category-form"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

function NewCategoryContent() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <Link
            href="/dashboard/categories"
            className="flex items-center text-sm text-gray-500 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Daftar Kategori
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Buat Kategori Baru</h1>
          <p className="text-gray-600 mt-1">
            Isi formulir di bawah untuk menambahkan kategori baru.
          </p>
        </div>
        
        <CategoryForm />
      </div>
    </DashboardLayout>
  )
}

export default function NewCategoryPage() {
  return (
    <AuthGuard>
      <NewCategoryContent />
    </AuthGuard>
  )
} 