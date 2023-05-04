import express from 'express';
import Database from 'better-sqlite3';
import multer from "multer";
import cors from "cors";
import '../database.js';

const app = express();
const port = 3001;
const db = new Database("database.db");
const upload = multer({ dest: "public/usercontent/" });

app.use(express.static("build"));
app.use(express.static("public"));
app.use(cors());


// Get a username and password combination from the database;
// generate and return a session token if valid
app.post("/api/login", express.json(), (req, res) => {
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


const generateTokenChars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_";
const tokenLength = 32;
function generateToken() {
	let token = "";
	for (let i = tokenLength; i > 0; --i) {
		token += generateTokenChars[Math.floor(Math.random() * generateTokenChars.length)];
	}
	return token;
}


function validateToken(token) {
	// const row = db.prepare(`
	// 	SELECT user_id
	// 	FROM sessions
	// 	WHERE token = ?
	// `).get(token);
	// return row !== undefined;
	return true;  // TODO: undo when login is implemented
}


app.listen(port, () => {
	console.log(`Closet Catalog running on port ${port}`);
});
