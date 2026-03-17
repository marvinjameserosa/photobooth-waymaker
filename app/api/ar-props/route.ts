import { NextResponse } from "next/server";
import { promises as fs } from "node:fs";
import path from "node:path";

const PROPS_DIR = path.join(process.cwd(), "public", "ar-props", "props");
const IMAGE_EXTENSIONS = new Set([".png", ".jpg", ".jpeg", ".webp"]);

export async function GET() {
  try {
    const entries = await fs.readdir(PROPS_DIR, { withFileTypes: true });
    const files = entries
      .filter((entry) => entry.isFile())
      .map((entry) => entry.name)
      .filter((name) => IMAGE_EXTENSIONS.has(path.extname(name).toLowerCase()))
      .sort((a, b) => a.localeCompare(b));

    return NextResponse.json({ files });
  } catch (error) {
    console.error("Failed to list AR props folder:", error);
    return NextResponse.json({ files: [] }, { status: 200 });
  }
}
