import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { DEFAULT_SITE_CONFIG, SiteConfig } from "@/lib/site-config";

const CONFIG_PATH = path.join(process.cwd(), "src", "data", "site-config.json");

function readConfig(): SiteConfig {
  try {
    if (fs.existsSync(CONFIG_PATH)) {
      const data = fs.readFileSync(CONFIG_PATH, "utf-8");
      return { ...DEFAULT_SITE_CONFIG, ...JSON.parse(data) };
    }
  } catch (error) {
    console.error("Error reading site config:", error);
  }
  return DEFAULT_SITE_CONFIG;
}

function writeConfig(config: SiteConfig): boolean {
  try {
    const dir = path.dirname(CONFIG_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2), "utf-8");
    return true;
  } catch (error) {
    console.error("Error writing site config:", error);
    return false;
  }
}

export async function GET() {
  const config = readConfig();
  // Strip PIN from public GET request for security
  const { adminPin, ...safeConfig } = config;
  return NextResponse.json({ success: true, data: safeConfig });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { pin, config, resetToDefault } = body;

    const currentConfig = readConfig();

    if (pin !== currentConfig.adminPin) {
      return NextResponse.json(
        { success: false, message: "Invalid Admin PIN" },
        { status: 401 }
      );
    }

    if (resetToDefault) {
      writeConfig(DEFAULT_SITE_CONFIG);
      const { adminPin, ...safeDefault } = DEFAULT_SITE_CONFIG;
      return NextResponse.json({
        success: true,
        message: "Config reset to defaults successfully",
        data: safeDefault,
      });
    }

    if (!config) {
      return NextResponse.json(
        { success: false, message: "No config data provided" },
        { status: 400 }
      );
    }

    const updatedConfig: SiteConfig = {
      ...currentConfig,
      ...config,
      // If user requested to change PIN
      adminPin: config.adminPin || currentConfig.adminPin,
    };

    const saved = writeConfig(updatedConfig);
    if (!saved) {
      return NextResponse.json(
        { success: false, message: "Failed to write config" },
        { status: 500 }
      );
    }

    const { adminPin, ...safeUpdated } = updatedConfig;
    return NextResponse.json({
      success: true,
      message: "Configuration saved successfully",
      data: safeUpdated,
    });
  } catch (error) {
    console.error("Config API error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
