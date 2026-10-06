import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { DEFAULT_SITE_CONFIG } from "@/lib/site-config";

const CONFIG_PATH = path.join(process.cwd(), "src", "data", "site-config.json");

function getAdminPin(): string {
  try {
    if (fs.existsSync(CONFIG_PATH)) {
      const data = fs.readFileSync(CONFIG_PATH, "utf-8");
      const parsed = JSON.parse(data);
      return parsed.adminPin || DEFAULT_SITE_CONFIG.adminPin;
    }
  } catch (error) {
    console.error("Error reading admin PIN:", error);
  }
  return DEFAULT_SITE_CONFIG.adminPin;
}

export async function POST(request: Request) {
  try {
    const { pin } = await request.json();
    const currentPin = getAdminPin();

    if (pin && pin === currentPin) {
      return NextResponse.json({ success: true, message: "Authentication successful" });
    }

    return NextResponse.json(
      { success: false, message: "Incorrect PIN. Please try again." },
      { status: 401 }
    );
  } catch {
    return NextResponse.json(
      { success: false, message: "Authentication failed" },
      { status: 500 }
    );
  }
}
