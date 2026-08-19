#!/usr/bin/env node
/**
 * Pulls brand photos from the public GitHub repo when they are not already
 * on disk (Vercel file deploys omit large binaries).
 */
import { mkdir, writeFile, access } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const base =
  "https://raw.githubusercontent.com/treylaramore/tailgate-tribe/main";
const files = [
  "public/images/logo.png",
  "public/images/hero.jpg",
  "public/images/tent.jpg",
  "public/images/friends.jpg",
  "public/images/stadium.jpg",
  "public/images/feast.jpg",
  "public/images/morning.jpg",
  "public/og.jpg",
  "public/favicon.svg",
  "public/__grok/icon-180.png",
];

async function exists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  for (const rel of files) {
    const dest = join(root, rel);
    if (await exists(dest)) continue;
    await mkdir(dirname(dest), { recursive: true });
    const res = await fetch(`${base}/${rel}`);
    if (!res.ok) {
      console.warn(`[fetch-images] skip ${rel}: ${res.status}`);
      continue;
    }
    const buf = Buffer.from(await res.arrayBuffer());
    await writeFile(dest, buf);
    console.log(`[fetch-images] ${rel} (${buf.length} bytes)`);
  }
}

main().catch((err) => {
  console.error("[fetch-images] failed:", err);
  process.exit(1);
});
