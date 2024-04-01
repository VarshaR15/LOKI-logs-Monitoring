import express from "express";
import dotenv from "dotenv";
import logToFile from "log-to-file";

const app = express();

dotenv.config();

const port = process.env.SERVER_PORT || 7000;

// Middleware for response time, status code, and elapsed time logging
app.use((req, res, next) => {
  const startTime = Date.now(); // Start time when request is received

  res.on('finish', () => {
    const elapsedTime = Date.now() - startTime; // Elapsed time between request and response
    const statusCode = res.statusCode; // Status code of the response
    const logMessage = `${req.method} ${req.url} responded with status ${statusCode} in ${elapsedTime} ms`;
    logToFile(logMessage, "ecommerce_logs.txt");
  });

  next();
});

app.get("/", (req, res) => {
  try {
    logToFile(`You are using ECOMMERCE Service! PORT:${port}`, "ecommerce_logs.txt");
    res.json({ message: `You are using ECOMMERCE Service! PORT:${port}` });
  } catch (error) {
    console.error("Error:", error);
    logToFile("Internal Server Error","ecommerce_logs.txt");
    res.status(502).json({ message: "Internal Server Error" });
  }
});

app.get("/ecommerce", (req, res) => {
  try {
    logToFile(`Accessing /ecommerce endpoint`, "ecommerce_logs.txt");
    res.json({ message: `You Hit /ecommerce api of Ecommerce Service PORT:${port}` });
  } catch (error) {
    console.error("Error:", error);
    logToFile("Internal Server Error","ecommerce_logs.txt");
    res.status(502).json({ message: "Internal Server Error" });
  }
});

// Handling unknown routes
app.use((req, res) => {
  try {
    logToFile(`Unknown endpoint: ${req.method} ${req.url}`, "ecommerce_logs.txt");
    res.status(404).json({ message: "Not Found" });
  } catch (error) {
    console.error("Error:", error);
    logToFile("Internal Server Error","ecommerce_logs.txt");
    res.status(502).json({ message: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`ECOMMERCE app listening at http://localhost:${port}`);
  logToFile(`ECOMMERCE app listening at http://localhost:${port}`, "ecommerce_logs.txt");
});
