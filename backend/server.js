import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import dotenv from "dotenv";
import multer from "multer";
import fs from "fs";
import path from "path";

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
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage });

const app = express();
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static(uploadDir));

const SECRET_KEY = process.env.SECRET_KEY || "JOUW_SECRET_KEY";

// ✅ **Registreren**
app.post("/register", upload.single("profile_image"), async (req, res) => {
  try {
    const { first_name, last_name, email, password, phone, address, dob } = req.body;

    if (!first_name || !last_name || !email || !password || !phone || !address || !dob) {
      return res.status(400).json({ message: "Vul alle velden in!" });
    }

    const existingUser = await db.get("SELECT email FROM users WHERE email = ?", [email]);
    if (existingUser) {
      return res.status(400).json({ message: "E-mailadres is al in gebruik!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const profileImage = req.file ? `/uploads/${req.file.filename}` : "/uploads/default-avatar.png";

    await db.run(
      "INSERT INTO users (first_name, last_name, email, password, phone, address, dob, profile_image, theme) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [first_name, last_name, email, hashedPassword, phone, address, dob, profileImage, "light"]
    );

    res.status(201).json({ message: "Registratie succesvol" });

  } catch (error) {
    console.error("❌ Fout bij registratie:", error);
    res.status(500).json({ message: "Er ging iets mis bij registratie", error: error.message });
  }
});

// ✅ **Inloggen en JWT-token genereren**
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Vul alle velden in!" });
  }

  const user = await db.get("SELECT * FROM users WHERE email = ?", [email]);

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "Ongeldige login gegevens!" });
  }

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      phone: user.phone,
      address: user.address,
      dob: user.dob,
      profile_image: user.profile_image,
      theme: user.theme
    },
    SECRET_KEY,
    { expiresIn: "1h" }
  );

  res.json({ message: "Login succesvol", token });
});

// ✅ **Haal gebruikersinformatie op**
app.get("/user/:email", async (req, res) => {
  try {
    const user = await db.get("SELECT * FROM users WHERE email = ?", [req.params.email]);
    if (!user) return res.status(404).json({ message: "Gebruiker niet gevonden" });

    res.json(user);
  } catch (error) {
    console.error("❌ Fout bij ophalen gebruiker:", error);
    res.status(500).json({ message: "Fout bij ophalen gebruiker" });
  }
});

// ✅ **Profielfoto uploaden en opslaan**
app.post("/upload", upload.single("profile_image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "Geen afbeelding geüpload!" });
  }

  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "E-mail is vereist!" });
  }

  try {
    const profileImagePath = `/uploads/${req.file.filename}`;
    await db.run("UPDATE users SET profile_image = ? WHERE email = ?", [profileImagePath, email]);

    res.json({ message: "Profielfoto succesvol geüpdatet!", filePath: profileImagePath });
  } catch (error) {
    console.error("❌ Kan profielfoto niet bijwerken:", error);
    res.status(500).json({ message: "Fout bij het updaten van profielfoto" });
  }
});

// ✅ **Gebruikersgegevens bijwerken**
app.put("/user/update", async (req, res) => {
  const { email, newEmail, password, theme } = req.body;
  
  try {
    let hashedPassword;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    if (newEmail) {
      const existingUser = await db.get("SELECT email FROM users WHERE email = ?", [newEmail]);
      if (existingUser) {
        return res.status(400).json({ message: "E-mailadres is al in gebruik!" });
      }
    }

    await db.run(
      "UPDATE users SET email = COALESCE(?, email), password = COALESCE(?, password), theme = COALESCE(?, theme) WHERE email = ?",
      [newEmail || email, hashedPassword || undefined, theme, email]
    );

    res.json({ message: "Gegevens succesvol bijgewerkt!" });
  } catch (error) {
    console.error("❌ Kan gegevens niet bijwerken:", error);
    res.status(500).json({ message: "Fout bij het bijwerken van gegevens" });
  }
});

// ✅ **Account verwijderen**
app.delete("/user/delete", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await db.get("SELECT password FROM users WHERE email = ?", [email]);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Onjuist wachtwoord!" });
    }

    await db.run("DELETE FROM users WHERE email = ?", [email]);

    res.json({ message: "Account succesvol verwijderd!" });
  } catch (error) {
    console.error("❌ Kan account niet verwijderen:", error);
    res.status(500).json({ message: "Fout bij verwijderen" });
  }
});

// ✅ **Start de server**
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server draait op http://localhost:${PORT}`);
});
