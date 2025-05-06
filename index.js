const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const initializeDB = require("./config/database"); // Asegúrate de que la ruta de la base de datos sea correcta

// Inicializar la base de datos
initializeDB(); // Aquí se llama la función que crea las tablas en la base de datos

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// // Importar las rutas (definidas en los archivos correspondientes)
// const userRoutes = require("./routes/users");
// const companyRoutes = require("./routes/companies");
// const courtRoutes = require("./routes/courts");
// const reservationRoutes = require("./routes/reservations");
// const serviceRoutes = require("./routes/services");

// // Usar las rutas
// app.use("/users", userRoutes);
// app.use("/companies", companyRoutes);
// app.use("/courts", courtRoutes);
// app.use("/reservations", reservationRoutes);
// app.use("/services", serviceRoutes);

// Configuración del puerto
const PORT = 5003;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
