const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Import route files
const userRoutes = require("./routes/users");
const companyRoutes = require("./routes/companies");
const courtRoutes = require("./routes/courts");
const reservationRoutes = require("./routes/reservations");
const serviceRoutes = require("./routes/services");

// Use route files
app.use("/users", userRoutes);
app.use("/companies", companyRoutes);
app.use("/courts", courtRoutes);
app.use("/reservations", reservationRoutes);
app.use("/services", serviceRoutes);

const PORT = 5001;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
