const app = require("../Backend/app.js");

module.exports = async (req, res) => {
  try {
    return app(req, res);
  } catch (error) {
    console.error("Vercel API Error:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
};
