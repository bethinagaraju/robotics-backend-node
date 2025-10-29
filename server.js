// import express from "express";
// import mysql from "mysql2";
// import cors from "cors";
// import dotenv from "dotenv";
// import multer from "multer";
// import { Client } from "basic-ftp";
// import { Readable } from "stream"; 

// dotenv.config();

// const app = express();
// app.use(cors());
// app.use(express.json());

// // 👇 STEP 2: Change multer to use memoryStorage
// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });

// // MySQL connection
// const db = mysql.createConnection({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASS,
//   database: process.env.DB_NAME,
// });

// db.connect((err) => {
//   if (err) console.error("❌ Database connection failed:", err);
//   else console.log("✅ Connected to MySQL database!");
// });

// // Create table if not exists (no changes here)
// const createTableQuery = `
//   CREATE TABLE IF NOT EXISTS Biotech_Abstractforms (
//     id INT AUTO_INCREMENT PRIMARY KEY,
//     title VARCHAR(255),
//     fullName VARCHAR(255) NOT NULL,
//     phoneNumber VARCHAR(20),
//     emailAddress VARCHAR(255),
//     organization VARCHAR(255),
//     country VARCHAR(100),
//     document_url VARCHAR(500),
//     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//   );
// `;
// db.query(createTableQuery, (err) => {
//   if (err) console.error("❌ Error creating table:", err);
//   else console.log("✅ Table ready!");
// });

// // 👇 STEP 3: Update the FTP function to accept a buffer
// // async function uploadToFTP(fileBuffer, originalName) {
// //   const client = new Client();
// //   try {
// //     await client.access({
// //       host: process.env.HOSTINGER_FTP_HOST,
// //       port: parseInt(process.env.HOSTINGER_FTP_PORT) || 21,
// //       user: process.env.HOSTINGER_FTP_USERNAME,
// //       password: process.env.HOSTINGER_FTP_PASSWORD,
// //       secure: false,
// //     });

// //     await client.ensureDir(process.env.HOSTINGER_FTP_UPLOAD_PATH);

// //     const fileName = `robotics_${Date.now()}_${originalName}`;
    
// //     // Create a readable stream from the buffer and upload it
// //     const readableStream = Readable.from(fileBuffer);
// //     await client.uploadFrom(readableStream, fileName);

// //     return `${process.env.HOSTINGER_PUBLIC_URL}/${fileName}`;
// //   } catch (err) {
// //     console.error("❌ FTP upload failed:", err);
// //     throw err;
// //   } finally {
// //     client.close();
// //     // No temporary file to delete, so the fs.unlinkSync is removed
// //   }
// // }

// // async function uploadToFTP(fileBuffer, originalName) {
// //   const client = new Client();
// //   try {
// //     await client.access({
// //       host: process.env.HOSTINGER_FTP_HOST,
// //       port: parseInt(process.env.HOSTINGER_FTP_PORT) || 21,
// //       user: process.env.HOSTINGER_FTP_USERNAME,
// //       password: process.env.HOSTINGER_FTP_PASSWORD,
// //       secure: false,
// //     });

// //     // ✅ No need to ensure directory since FTP root is already in robotics_uploads
// //     // await client.ensureDir(process.env.HOSTINGER_FTP_UPLOAD_PATH);

// //     const fileName = `robotics_${Date.now()}_${originalName}`;
// //     const readableStream = Readable.from(fileBuffer);

// //     await client.uploadFrom(readableStream, fileName);

// //     // ✅ Correct public URL
// //     return `${process.env.HOSTINGER_PUBLIC_URL}/${fileName}`;
// //   } catch (err) {
// //     console.error("❌ FTP upload failed:", err);
// //     throw err;
// //   } finally {
// //     client.close();
// //   }
// // }


// // async function uploadToFTP(fileBuffer, originalName) {
// //   const client = new Client();
// //   try {
// //     console.log("📂 Connecting to FTP...");
// //     await client.access({
// //       host: process.env.HOSTINGER_FTP_HOST,
// //       port: parseInt(process.env.HOSTINGER_FTP_PORT) || 21,
// //       user: process.env.HOSTINGER_FTP_USERNAME,
// //       password: process.env.HOSTINGER_FTP_PASSWORD,
// //       secure: false,
// //       passive: true,
// //     });
// //     console.log("✅ FTP connected!");

// //     // ✅ Ensure we are in robotics_uploads directory
// //     await client.cd("/public_html/robotics_uploads");

// //     const fileName = `robotics_${Date.now()}_${originalName}`;
// //     console.log("⬆️ Uploading file:", fileName);

// //     const readableStream = Readable.from(fileBuffer);
// //     await client.uploadFrom(readableStream, fileName);

// //     console.log("✅ File uploaded successfully!");
// //     const fileUrl = `${process.env.HOSTINGER_PUBLIC_URL}/${fileName}`;
// //     console.log("🌐 File URL:", fileUrl);

// //     return fileUrl;
// //   } catch (err) {
// //     console.error("❌ FTP upload failed:", err);
// //     return null; // avoid breaking the API
// //   } finally {
// //     client.close();
// //   }
// // }


// async function uploadToFTP(fileBuffer, originalName) {
//   const client = new Client();
//   try {
//     console.log("📂 Connecting to FTP...");
//     await client.access({
//       host: process.env.HOSTINGER_FTP_HOST,
//       port: parseInt(process.env.HOSTINGER_FTP_PORT) || 21,
//       user: process.env.HOSTINGER_FTP_USERNAME,
//       password: process.env.HOSTINGER_FTP_PASSWORD,
//       secure: false,
//       passive: true,
//     });
//     console.log("✅ FTP connected!");

//     // ⚠️ DO NOT CHANGE DIRECTORY (you’re already in robotics_uploads)
//     const fileName = `robotics_${Date.now()}_${originalName}`;
//     console.log("⬆️ Uploading file:", fileName);

//     const readableStream = Readable.from(fileBuffer);
//     await client.uploadFrom(readableStream, fileName);

//     console.log("✅ File uploaded successfully!");
//     const fileUrl = `${process.env.HOSTINGER_PUBLIC_URL}/${fileName}`;
//     console.log("🌐 File URL:", fileUrl);

//     return fileUrl;
//   } catch (err) {
//     console.error("❌ FTP upload failed:", err);
//     return null;
//   } finally {
//     client.close();
//   }
// }




// // GET API - Retrieve abstracts (no changes here)
// app.get("/api/abstracts", (req, res) => {
//   const query = "SELECT * FROM Biotech_Abstractforms ORDER BY created_at DESC";
//   db.query(query, (err, results) => {
//     if (err) {
//       console.error("❌ Error retrieving abstracts:", err);
//       return res.status(500).json({ error: "Database error." });
//     }
//     res.status(200).json(results);
//   });
// });

// // POST API - Abstract submission
// app.post("/api/abstracts", upload.single('document'), async (req, res) => {
//   const { title, fullName, phoneNumber, emailAddress, organization, country } = req.body;
//   const file = req.file;

//   if (!fullName || !emailAddress) {
//     return res.status(400).json({ error: "Full Name and Email are required." });
//   }

//   let documentUrl = null;
//   if (file) {
//     try {
//       // 👇 STEP 4: Pass the file buffer instead of the file path
//       documentUrl = await uploadToFTP(file.buffer, file.originalname);
//     } catch (err) {
//       return res.status(500).json({ error: "File upload failed." });
//     }
//   }

//   const query = `
//     INSERT INTO Biotech_Abstractforms
//     (title, fullName, phoneNumber, emailAddress, organization, country, document_url)
//     VALUES (?, ?, ?, ?, ?, ?, ?)
//   `;
//   db.query(
//     query,
//     [title, fullName, phoneNumber, emailAddress, organization, country, documentUrl],
//     (err) => {
//       if (err) {
//         console.error("❌ Error inserting data:", err);
//         return res.status(500).json({ error: "Database error." });
//       }
//       res.status(200).json({ message: "Abstract submitted successfully!", documentUrl });
//     }
//   );
// });

// // Test route (no changes here)
// app.get("/", (req, res) => {
//   res.send("Abstract Submission API is running...");
// });

// // 👇 Always start on port 5000
// const PORT = 5000;
// app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));

// // Export the app for Vercel
// export default app;






import express from "express";
import mysql from "mysql2";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import { Client } from "basic-ftp";
import { Readable } from "stream";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Multer: Store file in memory (no disk usage)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// MySQL Connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
    process.exit(1);
  }
  console.log("Connected to MySQL database!");
});

// Create table if not exists
// CREATE TABLE IF NOT EXISTS Biotech_Abstractforms (
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
  if (err) console.error("Error creating table:", err);
  else console.log("Table 'Robotics_Abstractforms' is ready!");
});

// FTP Upload Function (Fixed & Final)
async function uploadToFTP(fileBuffer, originalName) {
  const client = new Client();
  client.ftp.verbose = true; // Enable detailed FTP logs

  try {
    console.log("Connecting to FTP server...");
    await client.access({
      host: process.env.HOSTINGER_FTP_HOST,
      port: parseInt(process.env.HOSTINGER_FTP_PORT) || 21,
      user: process.env.HOSTINGER_FTP_USERNAME,
      password: process.env.HOSTINGER_FTP_PASSWORD,
      secure: false,
    });
    console.log("FTP connected!");

    // Critical: Navigate to the correct public folder
    const uploadDir = "/public_html/robotics_uploads";
    await client.ensureDir(uploadDir);
    await client.cd(uploadDir);
    console.log(`Changed to directory: ${uploadDir}`);

    // Generate unique filename
    const fileName = `robotics_${Date.now()}_${originalName}`;
    console.log(`Uploading file: ${fileName}`);

    // Stream buffer to FTP
    const stream = Readable.from(fileBuffer);
    await client.uploadFrom(stream, fileName);

    console.log("File uploaded successfully!");

    // Return correct public URL
    const publicUrl = `${process.env.HOSTINGER_PUBLIC_URL}/${fileName}`;
    console.log("Public URL:", publicUrl);

    return publicUrl;
  } catch (err) {
    console.error("FTP upload failed:", err.message || err);
    return null;
  } finally {
    client.close();
  }
}

// GET: Fetch all abstracts
app.get("/api/abstracts", (req, res) => {
  const query = "SELECT * FROM Robotics_Abstractforms ORDER BY created_at DESC";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error retrieving abstracts:", err);
      return res.status(500).json({ error: "Database error." });
    }
    res.status(200).json(results);
  });
});

// POST: Submit new abstract + file
app.post("/api/abstracts", upload.single("document"), async (req, res) => {
  const { title, fullName, phoneNumber, emailAddress, organization, country } = req.body;
  const file = req.file;

  // Validation
  if (!fullName || !emailAddress) {
    return res.status(400).json({ error: "Full Name and Email are required." });
  }

  let documentUrl = null;

  // Handle file upload
  if (file) {
    documentUrl = await uploadToFTP(file.buffer, file.originalname);
    if (!documentUrl) {
      return res.status(500).json({ error: "Failed to upload file to server." });
    }
  }

  // Insert into database
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
        console.error("Error inserting data:", err);
        return res.status(500).json({ error: "Database error." });
      }
      res.status(200).json({
        message: "Abstract submitted successfullys!",
        documentUrl,
      });
    }
  );
});

// Health check
app.get("/", (req, res) => {
  res.send("Abstract Submission API is running...");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;