import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import pool from "../config/database.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigrations() {
  const migrationsDir = path.join(__dirname, "migrations");
  const files = fs
    .readdirSync(migrationsDir)
    .filter((file) => file.endsWith(".sql"))
    .sort();
  console.log("Iniciando migrações...");
  for (const file of files) {
    const filePath = path.join(migrationsDir, file);
    const sql = fs.readFileSync(filePath, "utf8");
    console.log(`Executando: ${file}`);
    try {
      await pool.query(sql);
      console.log(`✓ ${file} executado com sucesso`);
    } catch (error) {
      console.error(`✗ Erro ao executar ${file}:`, error.message);
      throw error;
    }
  }
  console.log("Todas as migrações foram executadas com sucesso!");
  await pool.end();
}

runMigrations().catch((error) => {
  console.error("Erro nas migrações:", error);
  process.exit(1);
});
