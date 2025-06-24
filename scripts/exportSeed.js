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
  // Exportar solo INSERTs, redirigiendo salida a archivo para evitar ENOBUFS
  console.log('Generando dump SQL (solo datos)...');

  const outFile = path.join(seedsDir, `seed_${timestamp}_data.sql`);
  
  try {
    // Este comando ejecuta el dump y filtra solo los INSERT INTO directamente con shell
    execSync(`sqlite3 "${dbPath}" ".dump" | grep '^INSERT INTO' > "${outFile}"`, {
      stdio: 'inherit',
      shell: '/bin/bash' // asegúrate que bash esté disponible (en macOS lo está)
    });

    console.log(`Dump de datos exportado: seeds/${path.basename(outFile)}`);
  } catch (err) {
    console.error('Error al exportar solo datos:', err.message);
    process.exit(1);
  }

} else {
  // Copia binaria completa
  const fileName = `seed_${timestamp}.db`;
  const dest     = path.join(seedsDir, fileName);
  try {
    fs.copyFileSync(dbPath, dest);
    console.log(`Base completa exportada: seeds/${fileName}`);
  } catch (err) {
    console.error('Error al copiar base de datos:', err.message);
    process.exit(1);
  }
}
