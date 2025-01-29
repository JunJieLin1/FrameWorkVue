const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./users.db");
const bcrypt = require("bcryptjs");

// ✅ Gebruiker registreren
const registerUser = async (email, password, fullName, callback) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    db.run(
        "INSERT INTO users (email, password, full_name) VALUES (?, ?, ?)",
        [email, hashedPassword, fullName],
        callback
    );
};

// ✅ Gebruiker ophalen voor login
const getUserByEmail = (email, callback) => {
    db.get("SELECT * FROM users WHERE email = ?", [email], callback);
};

// ✅ Wachtwoord updaten
const updatePassword = async (email, newPassword, callback) => {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    db.run("UPDATE users SET password = ? WHERE email = ?", [hashedPassword, email], callback);
};

// ✅ Sessie toevoegen
const addSession = (userId, token, callback) => {
    db.run(
        "INSERT INTO sessions (user_id, token, expires_at) VALUES (?, ?, DATETIME('now', '+1 hour'))",
        [userId, token],
        callback
    );
};

// ✅ Controleren of sessie geldig is
const checkSession = (token, callback) => {
    db.get(
        "SELECT * FROM sessions WHERE token = ? AND expires_at > CURRENT_TIMESTAMP",
        [token],
        callback
    );
};

// ✅ Log activiteit toevoegen
const logAction = (userId, action) => {
    db.run("INSERT INTO logs (user_id, action) VALUES (?, ?)", [userId, action]);
};

module.exports = {
    registerUser,
    getUserByEmail,
    updatePassword,
    addSession,
    checkSession,
    logAction
};
