"use client"

import { AuthGuard } from "@/components/auth/auth-guard"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { SettingsTabs } from "@/components/settings/settings-tabs"

function SettingsContent() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pengaturan</h1>
          <p className="text-gray-600 mt-1">
            Kelola profil, situs, dan pengaturan keamanan Anda.
          </p>
        </div>
        <SettingsTabs />
      </div>
    </DashboardLayout>
  )
}

export default function SettingsPage() {
  return (
    <AuthGuard>
      <SettingsContent />
    </AuthGuard>
  )
} 