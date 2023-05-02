const express = require("express");
const Database = require("better-sqlite3");

const app = express();
const port = 3000;
const db = new Database("database.db");

app.use(express.static("build"));


// Get a username and password combination from the database;
// generate and return a session token if valid
app.post("/api/login", (req, res) => {
	const { username, password } = req.body;
	const stmt = db.prepare(`
		SELECT id, password_hash
		FROM users
		WHERE username = ?
	`);
	const row = stmt.get(username);
	if (row) {
		if (row.password_hash === password) {
			const token = generateToken();
			const stmt = db.prepare(`
				INSERT INTO sessions (user_id, token)
				VALUES (?, ?)
			`);
			stmt.run(row.id, token);
			res.send({ token });
		} else {
			res.status(401).json({ error: "Invalid password" });
		}
	} else {
		res.status(401).json({ error: "Invalid username" });
	}
});


// Get username by session token stored in Authorization header
app.get("/api/username", (req, res) => {
	const token = req.headers.authorization;
	const stmt = db.prepare(`
		SELECT username
		FROM users
		WHERE id = (SELECT user_id FROM sessions WHERE token = ?)
	`);
	const row = stmt.get(token);
	if (row) {
		res.send(row.username);
	} else {
		res.status(401).json({ error: "Invalid token" });
	}
});


const generateTokenChars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_";
const tokenLength = 32;
function generateToken() {
	let token = "";
	for (let i = tokenLength; i > 0; --i) {
		token += generateTokenChars[Math.floor(Math.random() * generateTokenChars.length)];
	}
	return token;
}


app.listen(port, () => {
	console.log(`Closet Catalog running on port ${port}`);
});
