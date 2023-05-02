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
app.post("/api/add-item", (req, res) => {
	const { shelfOrContainerID, itemTypeName, initialCount=1, description=null, photoURL=null, expirationDate=null } = req.body;
	const stmt = db.prepare(`
		SELECT id
		FROM items
		WHERE item_type_name = ?
	`);
	const row = stmt.get(itemTypeName);
	if (row) {
		const stmt = db.prepare(`
			SELECT item_id, shelf_id, container_id
			FROM contains_item
			WHERE item_id = ? AND (shelf_id = ? OR container_id = ?)
		`);
		const row = stmt.get(row.id, shelfOrContainerID, shelfOrContainerID);
		if (row) {
			const stmt = db.prepare(`
				UPDATE items
				SET count = count + ?
				WHERE id = ?
			`);
			stmt.run(initialCount, row.item_id);
			res.send({ item_id: row.item_id });
		} else {
			const item_id = generateToken();
			const stmt1 = db.prepare(`
				INSERT INTO items (id, item_type_name, count, description, photo_url, expiration_date)
				VALUES (?, ?, ?, ?, ?, ?)
			`);
			stmt1.run(item_id, itemTypeName, initialCount, description, photoURL, expirationDate);
			const stmt2 = db.prepare(`
				INSERT INTO contains_item (item_id, shelf_id, container_id)
				VALUES (?, ?, ?)
			`);
			stmt2.run(item_id, shelfOrContainerID, shelfOrContainerID);
			res.send({ item_id });
		}
	} else {
		res.status(400).json({ error: "Invalid item type name" });
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
