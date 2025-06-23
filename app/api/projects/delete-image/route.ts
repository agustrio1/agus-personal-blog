import { NextRequest, NextResponse } from "next/server";
import { imagekit } from "@/lib/imagekit";

export async function POST(req: NextRequest) {
  try {
    const { imageUrl } = await req.json();
    
    if (!imageUrl) {
      return NextResponse.json({ error: "Image URL is required" }, { status: 400 });
    }

    // Extract file ID from ImageKit URL
    // ImageKit URLs are in format: https://ik.imagekit.io/endpoint/folder/filename
    const urlParts = imageUrl.split('/');
    const fileName = urlParts[urlParts.length - 1];
    
    if (!fileName) {
      return NextResponse.json({ error: "Invalid image URL" }, { status: 400 });
    }

    // Remove query parameters if any
    const cleanFileName = fileName.split('?')[0];

    try {
      // Delete file from ImageKit using file name
      await imagekit.deleteFile(cleanFileName);
      return NextResponse.json({ message: "Image deleted successfully" });
    } catch (deleteError) {
      console.error("ImageKit delete error:", deleteError);
      // If deletion fails, return success anyway to avoid blocking the process
      return NextResponse.json({ message: "Image deletion attempted" });
    }
  } catch (error) {
    console.error("Delete image error:", error);
    return NextResponse.json({ error: "Failed to delete image" }, { status: 500 });
  }
} 