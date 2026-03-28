const { existsSync, readFileSync } = require("node:fs");
const { resolve } = require("node:path");
const { defineConfig } = require("prisma/config");

const loadEnvFile = (filename) => {
  const filepath = resolve(process.cwd(), filename);
  if (!existsSync(filepath)) return;

  const contents = readFileSync(filepath, "utf8");

  for (const rawLine of contents.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;

    const separatorIndex = line.indexOf("=");
    if (separatorIndex <= 0) continue;

    const key = line.slice(0, separatorIndex).trim();
    if (!key || process.env[key] !== undefined) continue;

    let value = line.slice(separatorIndex + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    process.env[key] = value;
  }
};

loadEnvFile(".env");
loadEnvFile(".env.local");

const datasourceUrl = process.env.DIRECT_URL ?? process.env.DATABASE_URL;

if (!datasourceUrl) {
  throw new Error("Prisma config requires DIRECT_URL or DATABASE_URL.");
}

module.exports = defineConfig({
  schema: "prisma/schema.prisma",
  datasourceUrl,
});
