// // import express from "express";
// // import mysql from "mysql2";
// // import cors from "cors";
// // import dotenv from "dotenv";
// // import multer from "multer";
// // import { Client } from "basic-ftp";
// // import { Readable } from "stream";

// // dotenv.config();

// // const app = express();
// // app.use(cors());
// // app.use(express.json());

// // // Multer: Store file in memory (no disk usage)
// // const storage = multer.memoryStorage();
// // const upload = multer({ storage });

// // // MySQL Connection
// // const db = mysql.createConnection({
// //   host: process.env.DB_HOST,
// //   user: process.env.DB_USER,
// //   password: process.env.DB_PASS,
// //   database: process.env.DB_NAME,
// // });

// // db.connect((err) => {
// //   if (err) {
// //     console.error("Database connection failed:", err);
// //     process.exit(1);
// //   }
// //   console.log("Connected to MySQL database!");
// // });

// // // Create table if not exists
// // // CREATE TABLE IF NOT EXISTS Biotech_Abstractforms (
// // const createTableQuery = `
// //     CREATE TABLE IF NOT EXISTS Robotics_Abstractforms (
// //     id INT AUTO_INCREMENT PRIMARY KEY,
// //     title VARCHAR(255),
// //     fullName VARCHAR(255) NOT NULL,
// //     phoneNumber VARCHAR(20),
// //     emailAddress VARCHAR(255),
// //     organization VARCHAR(255),
// //     country VARCHAR(100),
// //     document_url VARCHAR(500),
// //     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
// //   );
// // `;

// // db.query(createTableQuery, (err) => {
// //   if (err) console.error("Error creating table:", err);
// //   else console.log("Table 'Robotics_Abstractforms' is ready!");
// // });

// // // FTP Upload Function (Fixed & Final)
// // async function uploadToFTP(fileBuffer, originalName) {
// //   const client = new Client();
// //   client.ftp.verbose = true; // Enable detailed FTP logs

// //   try {
// //     console.log("Connecting to FTP server...");
// //     await client.access({
// //       host: process.env.HOSTINGER_FTP_HOST,
// //       port: parseInt(process.env.HOSTINGER_FTP_PORT) || 21,
// //       user: process.env.HOSTINGER_FTP_USERNAME,
// //       password: process.env.HOSTINGER_FTP_PASSWORD,
// //       secure: false,
// //     });
// //     console.log("FTP connected!");

// //     // Critical: Navigate to the correct public folder
// //     const uploadDir = "/public_html/robotics_uploads";
// //     await client.ensureDir(uploadDir);
// //     await client.cd(uploadDir);
// //     console.log(`Changed to directory: ${uploadDir}`);

// //     // Generate unique filename
// //     const fileName = `robotics_${Date.now()}_${originalName}`;
// //     console.log(`Uploading file: ${fileName}`);

// //     // Stream buffer to FTP
// //     const stream = Readable.from(fileBuffer);
// //     await client.uploadFrom(stream, fileName);

// //     console.log("File uploaded successfully!");

// //     // Return correct public URL
// //     const publicUrl = `${process.env.HOSTINGER_PUBLIC_URL}/${fileName}`;
// //     console.log("Public URL:", publicUrl);

// //     return publicUrl;
// //   } catch (err) {
// //     console.error("FTP upload failed:", err.message || err);
// //     return null;
// //   } finally {
// //     client.close();
// //   }
// // }

// // // GET: Fetch all abstracts
// // app.get("/api/abstracts", (req, res) => {
// //   const query = "SELECT * FROM Robotics_Abstractforms ORDER BY created_at DESC";
// //   db.query(query, (err, results) => {
// //     if (err) {
// //       console.error("Error retrieving abstracts:", err);
// //       return res.status(500).json({ error: "Database error." });
// //     }
// //     res.status(200).json(results);
// //   });
// // });

// // // POST: Submit new abstract + file
// // app.post("/api/abstracts", upload.single("document"), async (req, res) => {
// //   const { title, fullName, phoneNumber, emailAddress, organization, country } = req.body;
// //   const file = req.file;

// //   // Validation
// //   if (!fullName || !emailAddress) {
// //     return res.status(400).json({ error: "Full Name and Email are required." });
// //   }

// //   let documentUrl = null;

// //   // Handle file upload
// //   if (file) {
// //     documentUrl = await uploadToFTP(file.buffer, file.originalname);
// //     if (!documentUrl) {
// //       return res.status(500).json({ error: "Failed to upload file to server." });
// //     }
// //   }

// //   // Insert into database
// //   const query = `
// //     INSERT INTO Robotics_Abstractforms 
// //     (title, fullName, phoneNumber, emailAddress, organization, country, document_url)
// //     VALUES (?, ?, ?, ?, ?, ?, ?)
// //   `;

// //   db.query(
// //     query,
// //     [title, fullName, phoneNumber, emailAddress, organization, country, documentUrl],
// //     (err) => {
// //       if (err) {
// //         console.error("Error inserting data:", err);
// //         return res.status(500).json({ error: "Database error." });
// //       }
// //       res.status(200).json({
// //         message: "Abstract submitted successfullys!",
// //         documentUrl,
// //       });
// //     }
// //   );
// // });

// // // Health check
// // app.get("/", (req, res) => {
// //   res.send("Abstract Submission API is running...");
// // });

// // // Start server
// // const PORT = process.env.PORT || 5000;
// // app.listen(PORT, () => {
// //   console.log(`Server running on http://localhost:${PORT}`);
// // });

// // export default app;


// import express from "express";
// import mysql from "mysql2";
// import cors from "cors";
// import dotenv from "dotenv";
// import multer from "multer";
// import { Client } from "basic-ftp";
// import { Readable } from "stream";
// import nodemailer from "nodemailer";

// dotenv.config();

// const app = express();
// app.use(cors());
// app.use(express.json());

// // Multer: Store file in memory (no disk usage)
// const storage = multer.memoryStorage();
// const upload = multer({ storage });

// // MySQL Connection
// const db = mysql.createConnection({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASS,
//   database: process.env.DB_NAME,
// });

// db.connect((err) => {
//   if (err) {
//     console.error("Database connection failed:", err);
//     process.exit(1);
//   }
//   console.log("Connected to MySQL database!");
// });

// // Create table if not exists
// const createTableQuery = `
//     CREATE TABLE IF NOT EXISTS Robotics_Abstractforms (
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
//   if (err) console.error("Error creating table:", err);
//   else console.log("Table 'Robotics_Abstractforms' is ready!");
// });

// // FTP Upload Function
// async function uploadToFTP(fileBuffer, originalName) {
//   const client = new Client();
//   client.ftp.verbose = true; 

//   try {
//     console.log("Connecting to FTP server...");
//     await client.access({
//       host: process.env.HOSTINGER_FTP_HOST,
//       port: parseInt(process.env.HOSTINGER_FTP_PORT) || 21,
//       user: process.env.HOSTINGER_FTP_USERNAME,
//       password: process.env.HOSTINGER_FTP_PASSWORD,
//       secure: false,
//     });
//     console.log("FTP connected!");

//     const uploadDir = "/public_html/robotics_uploads";
//     await client.ensureDir(uploadDir);
//     await client.cd(uploadDir);

//     const fileName = `robotics_${Date.now()}_${originalName}`;
//     const stream = Readable.from(fileBuffer);

//     await client.uploadFrom(stream, fileName);

//     const publicUrl = `${process.env.HOSTINGER_PUBLIC_URL}/${fileName}`;
//     return publicUrl;
//   } catch (err) {
//     console.error("FTP upload failed:", err.message || err);
//     return null;
//   } finally {
//     client.close();
//   }
// }

// // GET: Fetch all abstracts
// app.get("/api/abstracts", (req, res) => {
//   const query = "SELECT * FROM Robotics_Abstractforms ORDER BY created_at DESC";
//   db.query(query, (err, results) => {
//     if (err) {
//       console.error("Error retrieving abstracts:", err);
//       return res.status(500).json({ error: "Database error." });
//     }
//     res.status(200).json(results);
//   });
// });

// // POST: Submit new abstract + file + send email
// app.post("/api/abstracts", upload.single("document"), async (req, res) => {
//   const { title, fullName, phoneNumber, emailAddress, organization, country } = req.body;
//   const file = req.file;

//   if (!fullName || !emailAddress) {
//     return res.status(400).json({ error: "Full Name and Email are required." });
//   }

//   let documentUrl = null;

//   if (file) {
//     documentUrl = await uploadToFTP(file.buffer, file.originalname);
//     if (!documentUrl) {
//       return res.status(500).json({ error: "Failed to upload file to server." });
//     }
//   }

//   const query = `
//     INSERT INTO Robotics_Abstractforms 
//     (title, fullName, phoneNumber, emailAddress, organization, country, document_url)
//     VALUES (?, ?, ?, ?, ?, ?, ?)
//   `;

//   db.query(
//     query,
//     [title, fullName, phoneNumber, emailAddress, organization, country, documentUrl],
//     async (err) => {
//       if (err) {
//         console.error("Error inserting data:", err);
//         return res.status(500).json({ error: "Database error." });
//       }

//       // ============================
//       // 📧 SEND EMAIL — HOSTINGER SMTP
//       // ============================
//       try {
//         const transporter = nodemailer.createTransport({
//           host: "smtp.hostinger.com",
//           port: 465,
//           secure: true,
//           auth: {
//             user: "smtp@roboticsaisummit.com",
//             pass: "Zynlogic@123",
//           },
//         });

//         const mailOptions = {
//           // from: "smtp@roboticsaisummit.com",
//           from: "smtp@roboticsaisummit.com",
//           to: "bethinagaraju04@gmail.com",
//           subject: "New Abstract Received",
//           html: `
//             <h2>Abstract Submission Details</h2>
//             <p><b>Title:</b> ${title}</p>
//             <p><b>Full Name:</b> ${fullName}</p>
//             <p><b>Phone Number:</b> ${phoneNumber}</p>
//             <p><b>Email:</b> ${emailAddress}</p>
//             <p><b>Organization:</b> ${organization}</p>
//             <p><b>Country:</b> ${country}</p>
//             <p><b>Submitted Document URL:</b> <a href="${documentUrl}" target="_blank">${documentUrl}</a></p>
//           `,
//         };

//         await transporter.sendMail(mailOptions);
//         console.log("Email sent successfully!");

//       } catch (emailErr) {
//         console.error("Email sending failed:", emailErr);
//       }

//       res.status(200).json({
//         message: "Abstract submitted successfully!",
//         documentUrl,
//       });
//     }
//   );
// });

// // Health check
// app.get("/", (req, res) => {
//   res.send("Abstract Submission API is running...");
// });

// // Start server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });

// export default app;








import express from "express";
import mysql from "mysql2";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import { Client } from "basic-ftp";
import { Readable } from "stream";
import nodemailer from "nodemailer";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Multer: Memory storage
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

// Create table
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
db.query(createTableQuery);

// FTP Upload Function
async function uploadToFTP(fileBuffer, originalName) {
  const client = new Client();
  client.ftp.verbose = true;

  try {
    await client.access({
      host: process.env.HOSTINGER_FTP_HOST,
      port: parseInt(process.env.HOSTINGER_FTP_PORT) || 21,
      user: process.env.HOSTINGER_FTP_USERNAME,
      password: process.env.HOSTINGER_FTP_PASSWORD,
      secure: false,
    });

    const uploadDir = "/public_html/robotics_uploads";
    await client.ensureDir(uploadDir);
    await client.cd(uploadDir);

    const fileName = `robotics_${Date.now()}_${originalName}`;
    const stream = Readable.from(fileBuffer);

    await client.uploadFrom(stream, fileName);

    return `${process.env.HOSTINGER_PUBLIC_URL}/${fileName}`;
  } catch (err) {
    console.error("FTP upload failed:", err);
    return null;
  } finally {
    client.close();
  }
}

// GET: Fetch abstracts
app.get("/api/abstracts", (req, res) => {
  const query = "SELECT * FROM Robotics_Abstractforms ORDER BY created_at DESC";
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: "Database error." });
    res.status(200).json(results);
  });
});

// POST: Abstract submit
app.post("/api/abstracts", upload.single("document"), async (req, res) => {
  const { title, fullName, phoneNumber, emailAddress, organization, country } = req.body;
  const file = req.file;

  if (!fullName || !emailAddress) {
    return res.status(400).json({ error: "Full Name and Email are required." });
  }

  let documentUrl = null;

  if (file) {
    documentUrl = await uploadToFTP(file.buffer, file.originalname);
    if (!documentUrl)
      return res.status(500).json({ error: "Failed to upload file." });
  }

  const query = `
    INSERT INTO Robotics_Abstractforms 
    (title, fullName, phoneNumber, emailAddress, organization, country, document_url)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [title, fullName, phoneNumber, emailAddress, organization, country, documentUrl],
    async (err) => {
      if (err) return res.status(500).json({ error: "Database error." });

      // Send Email
      try {
        const transporter = nodemailer.createTransport({
          host: process.env.MAIL_HOST,
          port: process.env.MAIL_PORT,
          secure: true,
          auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
          },
        });

        await transporter.sendMail({
          from: process.env.MAIL_USER,
          to: process.env.ADMIN_EMAIL,
          subject: "New Abstract Submitted",
          html: `
            <h2>Abstract Details</h2>
            <p><b>Title:</b> ${title}</p>
            <p><b>Name:</b> ${fullName}</p>
            <p><b>Phone:</b> ${phoneNumber}</p>
            <p><b>Email:</b> ${emailAddress}</p>
            <p><b>Organization:</b> ${organization}</p>
            <p><b>Country:</b> ${country}</p>
            <p><b>Document:</b> <a href="${documentUrl}">${documentUrl}</a></p>
          `,
        });

        console.log("Email sent successfully!");
      } catch (emailErr) {
        console.error("Email sending failed:", emailErr);
      }

      res.status(200).json({
        message: "Abstract submitted successfully!",
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
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);

export default app;
