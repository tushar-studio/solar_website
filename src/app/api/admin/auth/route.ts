import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import os from "os";
import { DEFAULT_SITE_CONFIG } from "@/lib/site-config";

const CONFIG_PATH = path.join(process.cwd(), "src", "data", "site-config.json");
const TMP_CONFIG_PATH = path.join(os.tmpdir(), "sundeya_site_config.json");

function getAdminPin(): string {
  if (process.env.ADMIN_PIN) {
    return process.env.ADMIN_PIN;
  }
  try {
    if (fs.existsSync(CONFIG_PATH)) {
      const data = fs.readFileSync(CONFIG_PATH, "utf-8");
      const parsed = JSON.parse(data);
      if (parsed.adminPin) return parsed.adminPin;
    }
  } catch {}
  try {
    if (fs.existsSync(TMP_CONFIG_PATH)) {
      const data = fs.readFileSync(TMP_CONFIG_PATH, "utf-8");
      const parsed = JSON.parse(data);
      if (parsed.adminPin) return parsed.adminPin;
    }
  } catch {}
  if (globalThis.__sundeya_site_config?.adminPin) {
    return globalThis.__sundeya_site_config.adminPin;
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
