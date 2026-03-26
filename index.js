const express = require("express");
const client = require("prom-client");

const app = express();
const port = process.env.PORT || 3000;

// Create a Registry and collect default metrics
const register = new client.Registry();
client.collectDefaultMetrics({ register });

// Example custom metric
const httpRequestCounter = new client.Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
});

register.registerMetric(httpRequestCounter);

// Routes
app.get("/", (req, res) => {
  httpRequestCounter.inc();
  res.send("hello world!");
});

app.get("/dashboard", (req,res) => {
  res.send("hello from dashboard");
})

app.get("/metrics", async (req, res) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});