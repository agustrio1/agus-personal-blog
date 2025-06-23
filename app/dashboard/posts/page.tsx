import { AuthGuard } from "@/components/auth/auth-guard"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { PostsClient } from "@/components/dashboard/posts/posts-client"

export default function DashboardPostsPage() {
  return (
    <AuthGuard>
      <DashboardLayout>
        <div className="p-4 sm:p-6 lg:p-8">
            <PostsClient />
        </div>
      </DashboardLayout>
    </AuthGuard>
  )
} 