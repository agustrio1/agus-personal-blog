"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ProfileSettings } from "./profile-settings"
import { GeneralSettings } from "./general-settings"

export function SettingsTabs() {
  return (
    <Tabs defaultValue="profile" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="profile">Profil</TabsTrigger>
        <TabsTrigger value="general">Umum</TabsTrigger>
      </TabsList>

      {/* Profile Tab */}
      <TabsContent value="profile">
        <Card>
          <CardHeader>
            <CardTitle>Profil Pengguna</CardTitle>
            <CardDescription>
              Perbarui informasi profil dan password Anda.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <ProfileSettings />
          </CardContent>
        </Card>
      </TabsContent>

      {/* General Tab */}
      <TabsContent value="general">
        <Card>
          <CardHeader>
            <CardTitle>Pengaturan Umum</CardTitle>
            <CardDescription>
              Kelola pengaturan dasar untuk situs blog Anda.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <GeneralSettings />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
} 