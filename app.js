const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;
const path = require("path");
const cors = require("cors");
const Dbconnection = require("./config/db.js");

// DB
Dbconnection();


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/auth", require("./Routes/auth"));
app.use("/post", require("./Routes/createPost"));
app.use("/user", require("./Routes/user"));




if (process.env.NODE_ENV === "production") {
  const frontendPath = path.join(__dirname, "Frontend", "dist");

  app.use(express.static(frontendPath));

  app.get("/*", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });
}

// server
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
