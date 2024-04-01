import express from "express";
import dotenv from "dotenv";
import logToFile from "log-to-file";

const app = express();

dotenv.config();

const port = process.env.SERVER_PORT || 5000;

// Middleware for logging status code and elapsed time
app.use((req, res, next) => {
  const startTime = Date.now(); // Start time when request is received

  res.on('finish', () => {
    const elapsedTime = Date.now() - startTime; // Elapsed time between request and response
    const statusCode = res.statusCode; // Status code of the response
    const logMessage = `${req.method} ${req.url} responded with status ${statusCode} in ${elapsedTime} ms`;
    logToFile(logMessage,"auth_logs.txt");
  });

  next();
});

app.get("/", (req, res) => {
  try {
    logToFile(`Accessing root endpoint`, "auth_logs.txt");
    res.json({ message: `You are using AUTH Service! PORT:${port}` });
  } catch (error) {
    console.error("Error:", error);
    logToFile("Internal Server Error","auth_logs.txt");
    res.status(502).json({ message: "Internal Server Error" });
  }
});

app.get("/auth", (req, res) => {
  try {
    logToFile(`Accessing /auth endpoint`, "auth_logs.txt");
    res.json({ message: `You Hit /auth api of AUTH Service PORT:${port}` });
  } catch (error) {
    console.error("Error:", error);
    logToFile("Internal Server Error","auth_logs.txt");
    res.status(502).json({ message: "Internal Server Error" });
  }
});

// Catch all other routes
app.use((req, res) => {
  try {
    logToFile(`Unknown endpoint: ${req.method} ${req.url}`, "auth_logs.txt");
    res.status(404).json({ message: "Not Found" });
  } catch (error) {
    console.error("Error:", error);
    logToFile("Internal Server Error","auth_logs.txt");
    res.status(502).json({ message: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`AUTH app listening at http://localhost:${port}`);
  logToFile(`AUTH app listening at http://localhost:${port}`, "auth_logs.txt");
});
