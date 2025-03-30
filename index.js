const express = require("express");
const dotenv = require("dotenv");
const swagger = require("swagger-ui-express");
const cors = require("cors"); // Importa cors
const { sequelize } = require("./db/db");

dotenv.config();

const app = express();

// Configuración de CORS
const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// Usar CORS con las opciones definidas
app.use(cors(corsOptions));

// Middleware para parsear JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Welcome to the server");
});

app.on("error", (err) => {
  console.log("Server error: ", err);
});

// Rutas
app.use("/api", require("./routes/login"));
app.use("/api/user", require("./routes/users"));
app.use("/api/project", require("./routes/project"));
app.use("/api/ticket", require("./routes/ticket"));
app.use("/api/notify", require("./routes/notify"));

// Swagger Docs
app.use("/api-docs", swagger.serve, swagger.setup(require("./swagger.json")));

// Iniciar servidor
app.listen(process.env.PORT || 3000, () => {
  console.log(`Server started on port ${process.env.PORT || 3000}`);
});

// Conexión con la base de datos
sequelize
  .authenticate()
  .then(() => {
    console.log("Database connection established!");
  })
  .catch((err) => {
    console.log("Error: ", err);
  });
