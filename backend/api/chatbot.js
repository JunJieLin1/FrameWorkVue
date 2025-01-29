import express from "express";
import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// ✅ Controleer of API Key bestaat
if (!process.env.GROQ_API_KEY) {
    console.error("❌ FOUT: API Key niet ingesteld in .env bestand!");
    process.exit(1);
}

// ✅ Correcte initialisatie van Groq SDK
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

router.post("/", async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) {
            return res.status(400).json({ error: "Geen bericht ontvangen" });
        }

        // ✅ Correcte API-aanroep
        const response = await groq.chat.completions.create({
            model: "llama3-8b-8192",
            messages: [{ role: "user", content: message }],
        });

        res.json({ response: response.choices[0]?.message?.content || "Geen antwoord ontvangen" });
    } catch (error) {
        console.error("❌ Fout bij AI-verzoek:", error);
        res.status(500).json({ error: "Kan geen antwoord ophalen" });
    }
});

export default router;
