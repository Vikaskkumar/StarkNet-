const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;
const path = require("path");

try {
  process.loadEnvFile(path.join(__dirname, ".env"));
} catch (error) {
  if (error.code !== "ENOENT") throw error;
}

const cors = require('cors');
const Dbconnection = require('./config/db.js');

// middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(require('./Routes/auth'));
app.use(require('./Routes/createPost'));
app.use(require('./Routes/user'));

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use(express.static(path.join(__dirname, "./Frontend/dist")));

app.use((req, res, next) => {
  if (req.method !== "GET") return next();
  res.sendFile(path.join(__dirname, "./Frontend/dist/index.html"));
});

async function startServer() {
  const missingConfiguration = ["MONGODB_URI", "JWT_SECRET"].filter(
    (name) => !process.env[name]
  );
  if (missingConfiguration.length) {
    throw new Error(
      `Missing ${missingConfiguration.join(", ")}. Add them to .env (see .env.example) or your deployment environment.`
    );
  }

  await Dbconnection();
  app.listen(PORT, () => {
    console.log('Server is running on port ' + PORT);
  });
}

startServer().catch((error) => {
  console.error("Unable to start server:", error.message);
  process.exit(1);
});
