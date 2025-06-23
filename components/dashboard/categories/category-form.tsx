"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Save } from "lucide-react"

const formSchema = z.object({
  name: z.string().min(3, {
    message: "Nama kategori harus memiliki setidaknya 3 karakter.",
  }),
})

type CategoryFormValues = z.infer<typeof formSchema>

interface CategoryFormProps {
  initialData?: { id: string; name: string } | null
}

export function CategoryForm({ initialData }: CategoryFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
    },
  })

  const onSubmit = async (values: CategoryFormValues) => {
    try {
      setLoading(true)
      setError("")
      
      const url = initialData ? `/api/categories/${initialData.id}` : "/api/categories"
      const method = initialData ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Terjadi kesalahan")
      }

      router.push("/dashboard/categories")
      router.refresh()
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("Terjadi kesalahan")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{initialData ? "Edit Kategori" : "Buat Kategori Baru"}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Kategori</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Teknologi Web"
                      {...field}
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/dashboard/categories")}
                disabled={loading}
              >
                Batal
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                {initialData ? "Simpan Perubahan" : "Buat Kategori"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
} 