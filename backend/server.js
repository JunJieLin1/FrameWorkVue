import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import dotenv from "dotenv";
import multer from "multer";
import path from "path";
import fs from "fs";

dotenv.config();

// ✅ Database connectie met SQLite
const db = await open({
  filename: "./backend/users.db",
  driver: sqlite3.Database
});

// ✅ Zorg dat de `uploads` map bestaat voor profielfoto's
const uploadDir = "./uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// ✅ Multer configuratie voor het uploaden van profielfoto's
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Slaat bestanden op in /uploads
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Unieke bestandsnaam
  }
});
const upload = multer({ storage });

const app = express();
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads")); // ✅ Zorg dat geüploade foto's toegankelijk zijn

const SECRET_KEY = "JOUW_SECRET_KEY"; // 🔒 Zorg dat je dit verandert!



// ✅ Registreren met profielfoto
app.post("/register", upload.single("profile_image"), async (req, res) => {
  try {
    const { first_name, last_name, email, password, phone, address, dob } = req.body;

    if (!first_name || !last_name || !email || !password || !phone || !address || !dob) {
      return res.status(400).json({ message: "Vul alle velden in!" });
    }

    // ✅ Controleer of de e-mail al bestaat
    const existingUser = await db.get("SELECT email FROM users WHERE email = ?", [email]);
    if (existingUser) {
      return res.status(400).json({ message: "E-mailadres is al in gebruik!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const profileImage = req.file ? `/uploads/${req.file.filename}` : null;

    await db.run(
      "INSERT INTO users (first_name, last_name, email, password, phone, address, dob, profile_image) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [first_name, last_name, email, hashedPassword, phone, address, dob, profileImage]
    );

    res.status(201).json({ message: "Registratie succesvol" });

  } catch (error) {
    console.error("❌ Fout bij registratie:", error);
    res.status(500).json({ message: "Er ging iets mis bij registratie", error: error.message });
  }
});



// ✅ Inloggen en JWT-token genereren
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Vul alle velden in!" });
  }

  const user = await db.get("SELECT * FROM users WHERE email = ?", [email]);

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "Ongeldige login gegevens!" });
  }

  // ✅ Gebruik `first_name` en `last_name` in plaats van `full_name`
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      phone: user.phone,
      address: user.address,
      dob: user.dob,
      profile_image: user.profile_image
    },
    SECRET_KEY,
    { expiresIn: "1h" }
  );

  res.json({ message: "Login succesvol", token });
});

// ✅ Haal gebruikersinformatie op
app.get("/user/:email", async (req, res) => {
  const user = await db.get("SELECT first_name, last_name, email, phone, address, dob, profile_image FROM users WHERE email = ?", [req.params.email]);
  if (!user) return res.status(404).json({ message: "Gebruiker niet gevonden" });
  res.json(user);
});

// ✅ Profiel afbeelding uploaden (optioneel apart endpoint)
app.post("/upload", upload.single("profile_image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "Geen afbeelding geüpload!" });
  }
  res.json({ message: "Upload gelukt!", filePath: `/uploads/${req.file.filename}` });
});

// ✅ Start de server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server draait op http://localhost:${PORT}`);
});
