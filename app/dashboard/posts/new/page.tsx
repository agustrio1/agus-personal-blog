import { AuthGuard } from "@/components/auth/auth-guard"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { PostForm } from "@/components/dashboard/posts/post-form"

export default function NewPostPage() {
  return (
    <AuthGuard>
      <DashboardLayout>
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="space-y-4 mb-8">
                <h1 className="text-3xl font-bold">Buat Post Baru</h1>
                <p className="text-gray-500">Isi form di bawah ini untuk membuat artikel baru.</p>
            </div>
            <PostForm />
        </div>
      </DashboardLayout>
    </AuthGuard>
  )
} 