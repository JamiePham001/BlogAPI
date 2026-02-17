require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const routes = require("./route/index");

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || "development";

const getCorsOrigins = () => {
  if (process.env.CORS_ORIGINS) {
    return process.env.CORS_ORIGINS.split(",").map((url) => url.trim());
  }
  // Development defaults
  return ["http://localhost:5173", "http://localhost:5174"];
};

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
// connection to frontend servers with CORS, origins are set in .env file and parsed into an array for use in the cors middleware. This allows for flexibility in development and production environments without hardcoding URLs.
app.use(
  cors({
    origin: getCorsOrigins(),
    credentials: true,
  }),
);

app.use("/", routes);

app.listen(PORT, (err) => {
  if (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }

  const envMsg =
    NODE_ENV === "production"
      ? "Server started in production mode"
      : `Server is running on http://localhost:${PORT}`;
  console.log(envMsg);
});
