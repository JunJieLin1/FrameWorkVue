import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import dotenv from "dotenv";

dotenv.config();

// Database connectie
const db = await open({
  filename: "./backend/users.db",
  driver: sqlite3.Database
});

const app = express();
app.use(express.json());
app.use(cors());

const SECRET_KEY = "JOUW_SECRET_KEY";

// 🔹 Registreren
app.post("/register", async (req, res) => {
  const { email, password, full_name } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await db.run(
      "INSERT INTO users (email, password, full_name) VALUES (?, ?, ?)",
      [email, hashedPassword, full_name]
    );
    res.status(201).json({ message: "Registratie succesvol" });
  } catch (err) {
    res.status(400).json({ message: "Gebruiker bestaat al" });
  }
});

// 🔹 Inloggen
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await db.get("SELECT * FROM users WHERE email = ?", [email]);

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).json({ message: "Ongeldige login" });
  }

  const token = jwt.sign({ email: user.email }, SECRET_KEY, { expiresIn: "1h" });
  res.json({ message: "Login succesvol", token });
});

// Server starten
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server draait op http://localhost:${PORT}`);
});
