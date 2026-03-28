const express = require("express");
const client = require("prom-client");
const morgan = require("morgan");
const app = express();
const port = process.env.PORT || 3000;

// ── Prometheus Setup ──────────────────────────────────────
const register = new client.Registry();
client.collectDefaultMetrics({ register });

const httpRequestCounter = new client.Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "status"],  // ← added labels
});
register.registerMetric(httpRequestCounter);

// ── Request Logging (Loki will capture these) ─────────────
app.use(morgan("combined"));  // ← adds a log line for EVERY request

// ── Routes ────────────────────────────────────────────────
app.get("/", (req, res) => {
  httpRequestCounter.inc({ method: "GET", route: "/", status: 200 });
  res.send("hello world! , developed by tanzimul");
});

app.get("/dashboard", (req, res) => {
  httpRequestCounter.inc({ method: "GET", route: "/dashboard", status: 200 });
  res.send("dashboard is cool");
});

app.get("/info", (req, res) => {
  httpRequestCounter.inc({ method: "GET", route: "/info", status: 200 });
  res.send("demo node app info , made for testing");
});

app.get("/metrics", async (req, res) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});