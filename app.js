const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;
const path = require("path");

const cors = require('cors');
const Dbconnection = require('./config/db.js');

Dbconnection();

// middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(require('./Routes/auth'));
app.use(require('./Routes/createPost'));
app.use(require('./Routes/user'));

app.use(express.static(path.join(__dirname, "./Frontend/dist")));

app.use((req, res, next) => {
  if (req.method !== "GET") return next();
  res.sendFile(path.join(__dirname, "./Frontend/dist/index.html"));
});

app.listen(PORT, () => {
  console.log('server is running on port ' + PORT);
});
