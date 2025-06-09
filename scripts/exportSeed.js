// scripts/exportSeed.js
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const dbPath   = path.resolve(__dirname, '../playbooker.db');
const seedsDir = path.resolve(__dirname, '../seeds');

// Asegurarse de que exista la carpeta seeds/
if (!fs.existsSync(seedsDir)) {
  fs.mkdirSync(seedsDir, { recursive: true });
}

// Generar nombre con fecha M_DD_YY
const now   = new Date();
const month = now.getMonth() + 1;
const day   = String(now.getDate()).padStart(2, '0');
const year  = String(now.getFullYear()).slice(-2);

const args       = process.argv.slice(2);
const dataOnly   = args.includes('--data-only');
const timestamp  = `${month}_${day}_${year}`;

if (dataOnly) {
  // Dump SQL solo con INSERTs
  console.log('🔧 Generando dump SQL (solo datos)...');
  const rawDump = execSync(`sqlite3 ${dbPath} ".dump"`, { encoding: 'utf8' });
  const inserts  = rawDump
    .split('\n')
    .filter(line => line.startsWith('INSERT INTO'))
    .join('\n');

  const outFile = path.join(seedsDir, `seed_${timestamp}_data.sql`);
  fs.writeFileSync(outFile, inserts);
  console.log(`Dump de datos exportado: seeds/${path.basename(outFile)}`);
} else {
  // Copia binaria completa
  const fileName = `seed_${timestamp}.db`;
  const dest     = path.join(seedsDir, fileName);
  fs.copyFileSync(dbPath, dest);
  console.log(`Base completa exportada: seeds/${fileName}`);
}
