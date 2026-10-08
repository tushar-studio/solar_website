import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import os from "os";
import { DEFAULT_SITE_CONFIG, SiteConfig } from "@/lib/site-config";

const CONFIG_PATH = path.join(process.cwd(), "src", "data", "site-config.json");
const TMP_CONFIG_PATH = path.join(os.tmpdir(), "sundeya_site_config.json");

// In-memory cache for serverless environments (e.g. Vercel)
declare global {
  // eslint-disable-next-line no-var
  var __sundeya_site_config: SiteConfig | undefined;
}

function readConfig(): SiteConfig {
  if (globalThis.__sundeya_site_config) {
    return globalThis.__sundeya_site_config;
  }

  // 1. Try reading from project filesystem (local dev & persistent VPS)
  try {
    if (fs.existsSync(CONFIG_PATH)) {
      const data = fs.readFileSync(CONFIG_PATH, "utf-8");
      const parsed = JSON.parse(data);
      const conf: SiteConfig = { ...DEFAULT_SITE_CONFIG, ...parsed };
      globalThis.__sundeya_site_config = conf;
      return conf;
    }
  } catch (error) {
    console.warn("Error reading site config from disk:", error);
  }

  // 2. Try reading from /tmp (persists during container lifetime on Vercel/Lambda)
  try {
    if (fs.existsSync(TMP_CONFIG_PATH)) {
      const data = fs.readFileSync(TMP_CONFIG_PATH, "utf-8");
      const parsed = JSON.parse(data);
      const conf: SiteConfig = { ...DEFAULT_SITE_CONFIG, ...parsed };
      globalThis.__sundeya_site_config = conf;
      return conf;
    }
  } catch (e) {
    console.warn("Could not read from /tmp config:", e);
  }

  return DEFAULT_SITE_CONFIG;
}

async function syncToGitHubIfConfigured(config: SiteConfig): Promise<boolean> {
  const token = process.env.GITHUB_TOKEN || process.env.GITHUB_PAT || process.env.GH_TOKEN;
  if (!token) return false;

  try {
    const repo = process.env.GITHUB_REPO || "tushar-studio/solar_website";
    const filePath = "src/data/site-config.json";
    const url = `https://api.github.com/repos/${repo}/contents/${filePath}`;

    // Get current file sha
    const getRes = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
      },
      cache: "no-store",
    });

    let sha: string | undefined;
    if (getRes.ok) {
      const fileData = await getRes.json();
      sha = fileData.sha;
    }

    // Commit updated content to GitHub repo
    const contentBase64 = Buffer.from(JSON.stringify(config, null, 2)).toString("base64");
    const putRes = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: "admin: update site-config from live website",
        content: contentBase64,
        sha,
        branch: "main",
      }),
    });

    return putRes.ok;
  } catch (err) {
    console.warn("Could not sync config to GitHub:", err);
    return false;
  }
}

function writeConfig(config: SiteConfig): boolean {
  // Always update in-memory cache
  globalThis.__sundeya_site_config = config;

  // 1. Attempt writing to local disk (succeeds on local dev & VPS)
  try {
    const dir = path.dirname(CONFIG_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2), "utf-8");
  } catch (error) {
    // Expected on Vercel / read-only serverless containers
    console.warn("[Notice] Serverless read-only filesystem (Vercel). Storing in /tmp and memory cache:", error);
  }

  // 2. Write to /tmp (always writable in AWS Lambda / Vercel Serverless)
  try {
    fs.writeFileSync(TMP_CONFIG_PATH, JSON.stringify(config, null, 2), "utf-8");
  } catch (tmpError) {
    console.warn("Could not write to tmpdir:", tmpError);
  }

  // 3. Trigger optional GitHub commit in background
  syncToGitHubIfConfigured(config).catch(() => {});

  return true;
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
    const effectivePin = process.env.ADMIN_PIN || currentConfig.adminPin || DEFAULT_SITE_CONFIG.adminPin;

    if (pin !== effectivePin) {
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
      adminPin: config.adminPin || currentConfig.adminPin || effectivePin,
    };

    writeConfig(updatedConfig);

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

