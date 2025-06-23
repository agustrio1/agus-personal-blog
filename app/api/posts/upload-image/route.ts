import { NextRequest, NextResponse } from "next/server";
import { imagekit } from "@/lib/imagekit";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("image");
    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "No image file provided" }, { status: 400 });
    }
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const uploadResponse = await imagekit.upload({
      file: buffer,
      fileName: `post-image-${Date.now()}`,
      folder: "/posts",
      useUniqueFileName: true,
    });
    return NextResponse.json({ url: uploadResponse.url });
  } catch (error) {
    console.error("Upload image error:", error);
    return NextResponse.json({ error: "Failed to upload image" }, { status: 500 });
  }
} 