require("dotenv").config();
const express = require("express");
const { prisma } = require("./database/pg");
const cors = require("cors");
const path = require("path");
const routes = require("./route/index");
const queries = require("./database/queries");
const scripts = require("./public/scripts");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  }),
);

app.use("/", routes);

app.listen(PORT, (err) => {
  if (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }

  console.log("Server is running on http://localhost:3000");
});
