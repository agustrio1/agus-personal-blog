import { AuthGuard } from "@/components/auth/auth-guard"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { CategoryForm } from "@/components/dashboard/categories/category-form"
import { prisma } from "@/lib/db"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

async function UpdateCategoryContent({ categoryId }: { categoryId: string }) {
  const category = await prisma.category.findUnique({
    where: { id: categoryId },
  })

  if (!category) {
    notFound()
  }

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
          <h1 className="text-3xl font-bold text-gray-900">Edit Kategori</h1>
          <p className="text-gray-600 mt-1">
            Ubah nama kategori: <span className="font-semibold">{category.name}</span>
          </p>
        </div>
        
        <CategoryForm initialData={category} />
      </div>
    </DashboardLayout>
  )
}

export default async function Page( { params }: { params: Promise<{ id: string }> }) {
  return (
    <AuthGuard>
      <UpdateCategoryContent categoryId={(await params).id} />
    </AuthGuard>
  )
} 