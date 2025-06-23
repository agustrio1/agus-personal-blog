"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"

export function ProfileSettings() {
  const { data: session, update: updateSession } = useSession()

  // State for name form
  const [name, setName] = useState(session?.user?.name || "")
  const [nameSaving, setNameSaving] = useState(false)
  const [nameError, setNameError] = useState<string | null>(null)
  const [nameSuccess, setNameSuccess] = useState<string | null>(null)

  // State for password form
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [passwordSaving, setPasswordSaving] = useState(false)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null)

  const handleNameSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setNameSaving(true)
    setNameError(null)
    setNameSuccess(null)

    try {
      const res = await fetch("/api/settings/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Gagal memperbarui nama.")

      setNameSuccess(data.message)
      await updateSession({ name }) // Update session with new name
    } catch (err) {
      setNameError(err instanceof Error ? err.message : "Terjadi kesalahan.")
    } finally {
      setNameSaving(false)
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("Password baru tidak cocok.")
      return
    }

    setPasswordSaving(true)
    setPasswordError(null)
    setPasswordSuccess(null)

    try {
      const res = await fetch("/api/settings/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Gagal memperbarui password.")

      setPasswordSuccess(data.message)
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
    } catch (err) {
      setPasswordError(err instanceof Error ? err.message : "Terjadi kesalahan.")
    } finally {
      setPasswordSaving(false)
    }
  }

  return (
    <div className="space-y-12">
      {/* Form Ganti Nama */}
      <form onSubmit={handleNameSubmit} className="space-y-4">
        <div>
          <h3 className="text-lg font-medium">Nama Tampilan</h3>
          <p className="text-sm text-muted-foreground">
            Nama ini akan ditampilkan secara publik di post Anda.
          </p>
        </div>
        <div className="space-y-2 max-w-lg">
          <Label htmlFor="name">Nama</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <Button type="submit" disabled={nameSaving}>
          {nameSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Menyimpan...
            </>
          ) : (
            "Simpan Nama"
          )}
        </Button>
        {nameSuccess && <p className="text-sm text-green-600 mt-2">{nameSuccess}</p>}
        {nameError && <p className="text-sm text-red-600 mt-2">{nameError}</p>}
      </form>

      {/* Form Ganti Password */}
      <form onSubmit={handlePasswordSubmit} className="space-y-4">
        <div>
          <h3 className="text-lg font-medium">Ganti Password</h3>
          <p className="text-sm text-muted-foreground">
            Pastikan Anda menggunakan password yang kuat dan unik.
          </p>
        </div>
        <div className="space-y-2 max-w-lg">
          <Label htmlFor="currentPassword">Password Saat Ini</Label>
          <Input
            id="currentPassword"
            type="password"
            value={passwordData.currentPassword}
            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
          />
        </div>
        <div className="space-y-2 max-w-lg">
          <Label htmlFor="newPassword">Password Baru</Label>
          <Input
            id="newPassword"
            type="password"
            value={passwordData.newPassword}
            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
          />
        </div>
        <div className="space-y-2 max-w-lg">
          <Label htmlFor="confirmPassword">Konfirmasi Password Baru</Label>
          <Input
            id="confirmPassword"
            type="password"
            value={passwordData.confirmPassword}
            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
          />
        </div>
        <Button type="submit" disabled={passwordSaving}>
          {passwordSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Menyimpan...
            </>
          ) : (
            "Ganti Password"
          )}
        </Button>
        {passwordSuccess && <p className="text-sm text-green-600 mt-2">{passwordSuccess}</p>}
        {passwordError && <p className="text-sm text-red-600 mt-2">{passwordError}</p>}
      </form>
    </div>
  )
}