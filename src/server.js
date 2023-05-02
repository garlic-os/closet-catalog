const express = require("express");
const Database = require("better-sqlite3");

const app = express();
const port = 3000;
const db = new Database("database.db");

app.use(express.static("build"));
const api = app.route("/api");


// Get username by session token stored in Authorization header
api.get("/username", (req, res) => {
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


app.listen(port, () => {
	console.log(`Closet Catalog running on port ${port}`);
});
