


import express from "express";
import mysql from "mysql2";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import { Client } from "basic-ftp";
import fs from "fs";
import path from "path";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Multer setup for temporary file storage
const upload = multer({ dest: 'temp/' });

// MySQL connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) console.error("❌ Database connection failed:", err);
  else console.log("✅ Connected to MySQL database!");
});

// Create table if not exists
const createTableQuery = `
  CREATE TABLE IF NOT EXISTS Robotics_Abstractforms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    fullName VARCHAR(255) NOT NULL,
    phoneNumber VARCHAR(20),
    emailAddress VARCHAR(255),
    organization VARCHAR(255),
    country VARCHAR(100),
    document_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`;
db.query(createTableQuery, (err) => {
  if (err) console.error("❌ Error creating table:", err);
  else console.log("✅ Table ready!");
});

// FTP upload helper
async function uploadToFTP(filePath, originalName) {
  const client = new Client();
  try {
    await client.access({
      host: process.env.HOSTINGER_FTP_HOST,
      port: parseInt(process.env.HOSTINGER_FTP_PORT) || 21,
      user: process.env.HOSTINGER_FTP_USERNAME,
      password: process.env.HOSTINGER_FTP_PASSWORD,
      secure: false,
    });

    // Navigate to the FTP upload path
    await client.ensureDir(process.env.HOSTINGER_FTP_UPLOAD_PATH);

    const fileName = `robotics_${Date.now()}_${originalName}`;
    await client.uploadFrom(filePath, fileName);

    return `${process.env.HOSTINGER_PUBLIC_URL}/${fileName}`;
  } catch (err) {
    console.error("❌ FTP upload failed:", err);
    throw err;
  } finally {
    client.close();
    // Delete temp file
    fs.unlinkSync(filePath);
  }
}

// GET API - Retrieve abstracts
app.get("/api/abstracts", (req, res) => {
  const query = "SELECT * FROM Robotics_Abstractforms ORDER BY created_at DESC";

  db.query(query, (err, results) => {
    if (err) {
      console.error("❌ Error retrieving abstracts:", err);
      return res.status(500).json({ error: "Database error." });
    }
    res.status(200).json(results);
  });
});

// POST API - Abstract submission
app.post("/api/abstracts", upload.single('document'), async (req, res) => {
  const { title, fullName, phoneNumber, emailAddress, organization, country } = req.body;
  const file = req.file;

  if (!fullName || !emailAddress) {
    return res.status(400).json({ error: "Full Name and Email are required." });
  }

  let documentUrl = null;
  if (file) {
    try {
      documentUrl = await uploadToFTP(file.path, file.originalname);
    } catch (err) {
      return res.status(500).json({ error: "File upload failed." });
    }
  }

  const query = `
    INSERT INTO Robotics_Abstractforms
    (title, fullName, phoneNumber, emailAddress, organization, country, document_url)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [title, fullName, phoneNumber, emailAddress, organization, country, documentUrl],
    (err) => {
      if (err) {
        console.error("❌ Error inserting data:", err);
        return res.status(500).json({ error: "Database error." });
      }
      res.status(200).json({ message: "Abstract submitted successfully!", documentUrl });
    }
  );
});

// Test route
app.get("/", (req, res) => {
  res.send("Abstract Submission API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server started on http://localhost:${PORT}`);
});
