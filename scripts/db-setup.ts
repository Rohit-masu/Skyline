// npm run db:setup — creates the enquiries table and indexes from scripts/db-setup.sql.
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { neon } from "@neondatabase/serverless";

process.loadEnvFile?.(".env.local");

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is not set. Add it to .env.local first.");
  process.exit(1);
}

const sql = neon(url);
const statements = readFileSync(join(process.cwd(), "scripts", "db-setup.sql"), "utf8")
  .split(";")
  .map((statement) => statement.replace(/--.*$/gm, "").trim())
  .filter(Boolean);

async function main() {
  for (const statement of statements) {
    await sql.query(statement);
    console.log("ok:", statement.split("\n")[0]);
  }
  console.log("Database ready.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
