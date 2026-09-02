const express = require("express");
const path = require("path");

try {
  process.loadEnvFile(path.join(__dirname, ".env"));
} catch (error) {
  if (error.code !== "ENOENT") throw error;
}

const cors = require("cors");
const Dbconnection = require("./config/db.js");

const app = express();
const PORT = process.env.PORT || 5000;
const staticDirectory = path.join(__dirname, "../public");

function missingConfiguration() {
  return ["MONGODB_URI"].filter((name) => !process.env[name]);
}

app.use(async (req, res, next) => {
  const missing = missingConfiguration();
  if (missing.length) {
    return res.status(500).json({ error: `Missing server configuration: ${missing.join(", ")}` });
  }

  try {
    await Dbconnection();
    next();
  } catch (error) {
    console.error("Database connection error:", error.message);
    return res.status(503).json({ error: "Database is temporarily unavailable" });
  }
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(require("./Routes/auth"));
app.use(require("./Routes/createPost"));
app.use(require("./Routes/user"));

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use(express.static(staticDirectory));

app.use((req, res, next) => {
  if (req.method !== "GET") return next();
  res.sendFile(path.join(staticDirectory, "index.html"), (error) => {
    if (error) next(error);
  });
});

if (require.main === module) {
  const missing = missingConfiguration();
  if (missing.length) {
    console.error(`Unable to start server: Missing ${missing.join(", ")}. Add them to .env (see .env.example) or your deployment environment.`);
    process.exit(1);
  }

  Dbconnection()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
      });
    })
    .catch((error) => {
      console.error("Unable to start server:", error.message);
      process.exit(1);
    });
}

// 404 handler for unknown API routes
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: "API route not found" });
  }
  next();
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Express Error:", err);
  res.status(err.status || 500).json({ error: err.message || "Internal Server Error" });
});

module.exports = app;
