import express from 'express';
import Database from 'better-sqlite3';
import multer from "multer";
import cors from "cors";
import crypto from "node:crypto";
import bcrypt from "bcrypt";
import * as config from "../config.js";
import '../database.js';

const app = express();
const port = config.port;
const db = new Database("database.db");
const upload = multer({ dest: "public/usercontent/" });

app.use(express.static("build"));
app.use(express.static("public"));
app.use(cors());


// Create an account
app.post("/api/register", upload.none(), async (req, res) => {
	const { username, password } = req.body;

	if (username.length === 0) {
		res.status(400).json({ error: "Username cannot be empty" });
		return;
	}

	// Check if username is already taken
	const row = db.prepare(`
		SELECT user_id
		FROM users
		WHERE username = ?
	`).get(username);
	if (row) {
		res.status(409).json({ error: "Username already taken" });
		return;
	}

	const stmt = db.prepare(`
		INSERT INTO users (username, password_hash)
		VALUES (?, ?)
	`);
	const info = stmt.run(username, await bcrypt.hash(password, 10));
	res.send({ user_id: info.lastInsertRowid });
});


// Get a username and password combination from the database;
// generate and return a session token if valid
app.post("/api/login", upload.none(), async (req, res) => {
	const { username, password } = req.body;
	const row = db.prepare(`
		SELECT user_id, password_hash
		FROM users
		WHERE username = ?
	`).get(username);
	if (!row || !(await bcrypt.compare(password, row.password_hash))) {
		res.status(401).json({ error: "Invalid credentials" });
		return;
	}
	const token = crypto.randomUUID();
	const stmt = db.prepare(`
		INSERT INTO sessions (user_id, token)
		VALUES (?, ?)
	`);
	stmt.run(row.user_id, token);
	res.send({ token });
});


// Get username by session token stored in Authorization header
app.get("/api/username", (req, res) => {
	const token = req.headers.authorization;
	const username = db.prepare(`
		SELECT username
		FROM users
		WHERE user_id = (SELECT user_id FROM sessions WHERE token = ?)
	`).pluck().get(token);
	if (!username) {
		res.status(401).json({ error: "Invalid token" });
		return;
	}
	res.send(username);
});


/**
 * Create an item and add it to a shelf or container.
 * Accesses the “items” and “contains_item” tables.
 * @param {string} shelfOrContainerID
 * @param {string} itemTypeName - name of the item type
 * @param {number} initialCount (default: 1)
 * @param {string} description (default: NULL)
 * @param {string} photoURL (default: NULL) URL to a photo of the item
 * @param {?number} expirationDate (UNIX timestamp); signifies the item is a Perishable type item if not null; default null
 * If this item exists in the specified container or shelf already, increment the existing item’s count and return.
 * Generate a new item ID.
 * Insert this item into the database.
 * Insert the shelf or container ID into a new CONTAINS_ITEM relation:
 * If a shelf ID was provided, the container ID will be NULL, and vice versa.
 * Insert the item ID, shelf ID, and container ID into the relation.
 */
app.post("/api/add-item", upload.single("photo"), (req, res) => {
	if (!validateToken(req.headers.authorization)) {
		res.status(401).json({ error: "Invalid session token" });
		return;
	}

	const photoURL = req?.file?.path;
	const {
		shelfOrContainerID,
		itemTypeName,
		initialCount,
		description,
		name,
		expirationDate
	} = req.body;

	const result = db.prepare(`
		INSERT INTO items
		(type, count, description, photo_url, name, expiration_date, description)
		VALUES (?, ?, ?, ?, ?, ?, ?)
	`).run(itemTypeName, initialCount, description, photoURL, name, expirationDate, description);

	db.prepare(`
		INSERT INTO contains_item (item_id, shelf_id, container_id)
		VALUES (?, ?, ?)
	`).run(result.lastInsertRowid, shelfOrContainerID, shelfOrContainerID);

	res.send({
		item_id: result.lastInsertRowid
	});
});


app.post("/api/add-shelf", upload.none(), (req, res) => {
	if (!validateToken(req.headers.authorization)) {
		res.status(401).json({ error: "Invalid session token" });
		return;
	}

	const { name, description } = req.body;

});


function validateToken(token) {
	const row = db.prepare(`
		SELECT user_id
		FROM sessions
		WHERE token = ?
	`).get(token);
	return row !== undefined;
}

(async () => {
	if (config.port === 443) {
		console.log("Using HTTPS");
		const fs = await import("fs/promises");
		const https = await import("node:https");
		https.createServer({
			// Provide the private and public key to the server by reading each
			// file's content with the readFileSync() method.
			key: await fs.readFile(config.sslKeyPath),
			cert: await fs.readFile(config.sslCertPath),
		}, app)
		.listen(config.port, () => {
			console.log(`Closet Catalog running at ${config.url}`);
		});
	} else {
		app.listen(port, () => {
			console.log(`Closet Catalog running at ${config.url}`);
		});
	}
})();
