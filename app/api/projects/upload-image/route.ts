import { NextRequest, NextResponse } from "next/server";
import { imagekit } from "@/lib/imagekit";
import sharp from "sharp";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("image");
    
    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "No image file provided" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Compress and convert to WebP using Sharp
    const optimizedBuffer = await sharp(buffer)
      .webp({ 
        quality: 80, // Good balance between quality and file size
        effort: 6    // Higher effort for better compression
      })
      .resize(1200, 800, { // Resize to reasonable dimensions
        fit: 'inside',
        withoutEnlargement: true
      })
      .toBuffer();

    const uploadResponse = await imagekit.upload({
      file: optimizedBuffer,
      fileName: `project-image-${Date.now()}.webp`,
      folder: "/projects",
      useUniqueFileName: true,
    });

    return NextResponse.json({ url: uploadResponse.url });
  } catch (error) {
    console.error("Upload project image error:", error);
    return NextResponse.json({ error: "Failed to upload image" }, { status: 500 });
  }
} 