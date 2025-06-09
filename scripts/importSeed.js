// scripts/importSeed.js
const fs   = require('fs');
const path = require('path');

const seedsDir = path.resolve(__dirname, '../seeds');
const dbPath   = path.resolve(__dirname, '../playbooker.db');

const specified = process.argv[2];
let fileToImport;

if (specified) {
  fileToImport = path.join(seedsDir, specified);
  if (!fs.existsSync(fileToImport)) {
    console.error(` No existe "${specified}" en seeds/`);
    process.exit(1);
  }
} else {
  const all = fs
    .readdirSync(seedsDir)
    .filter(f => f.startsWith('seed_') && (f.endsWith('.db') || f.endsWith('.sql')));
  if (all.length === 0) {
    console.error(' No hay seeds en la carpeta seeds/');
    process.exit(1);
  }
  all.sort((a,b) => {
    const ta = fs.statSync(path.join(seedsDir,a)).mtime.getTime();
    const tb = fs.statSync(path.join(seedsDir,b)).mtime.getTime();
    return tb - ta;
  });
  fileToImport = path.join(seedsDir, all[0]);
}

// Si es un .db, lo copiamos.
// Si es un .sql, abrimos sqlite3 y lo ejecutamos.
if (fileToImport.endsWith('.db')) {
  fs.copyFileSync(fileToImport, dbPath);
  console.log(`Base importada desde: ${path.basename(fileToImport)}`);
} else {
  // .sql data-only; volcamos los INSERTs sobre la DB existente
  const sql = fs.readFileSync(fileToImport, 'utf8');
  const { execSync } = require('child_process');
  console.log(`🔧 Importando datos desde ${path.basename(fileToImport)}...`);
  execSync(`sqlite3 ${dbPath}`, { input: sql });
  console.log(`Datos importados desde: ${path.basename(fileToImport)}`);
}
