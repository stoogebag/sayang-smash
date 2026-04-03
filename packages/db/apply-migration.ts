import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import postgres from "postgres";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const POSTGRES_URL = process.env.POSTGRES_URL;
if (!POSTGRES_URL) {
  console.error("Missing POSTGRES_URL");
  process.exit(1);
}

// Use non-pooling port
const url = POSTGRES_URL.replace(":6543", ":5432");

const migrationFile = path.join(
  __dirname,
  "drizzle/0001_special_weapon_omega.sql",
);
const sqlContent = fs.readFileSync(migrationFile, "utf-8");

// Split by the drizzle statement-breakpoint marker
const statements = sqlContent
  .split("--> statement-breakpoint")
  .map((s) => s.trim())
  .filter((s) => s.length > 0);

const sql = postgres(url, { prepare: false });

console.log(`Running ${statements.length} migration statements...`);

for (let i = 0; i < statements.length; i++) {
  const stmt = statements[i];
  try {
    await sql.unsafe(stmt);
    // Print first 80 chars of each statement for visibility
    const preview = stmt.substring(0, 80).replace(/\n/g, " ");
    console.log(`  ✓ ${preview}${stmt.length > 80 ? "..." : ""}`);
  } catch (err: any) {
    const preview = stmt.substring(0, 80).replace(/\n/g, " ");
    // DROP TABLE may fail if table doesn't exist (DB was already nuked)
    if (
      stmt.startsWith("DROP TABLE") &&
      err.message.includes("does not exist")
    ) {
      console.log(`  ⊘ skipped (table already gone): ${preview}`);
    }
    // CREATE SCHEMA may fail if already exists (partial previous run)
    else if (
      stmt.startsWith("CREATE SCHEMA") &&
      err.message.includes("already exists")
    ) {
      console.log(`  ⊘ skipped (schema already exists): ${preview}`);
    }
    // CREATE TABLE may fail if already exists (partial previous run)
    else if (
      stmt.startsWith("CREATE TABLE") &&
      err.message.includes("already exists")
    ) {
      console.log(`  ⊘ skipped (table already exists): ${preview}`);
    } else {
      console.error(`  ✗ FAILED: ${preview}`);
      console.error(`  Error: ${err.message}`);
      await sql.end();
      process.exit(1);
    }
  }
}

await sql.end();
console.log("Migration applied successfully!");
