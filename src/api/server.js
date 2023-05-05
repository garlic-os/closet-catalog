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


// Get all closets belonging to the user
app.get("/api/closets", (req, res) => {
	if (!validateToken(req.headers.authorization)) {
		res.status(401).json({ error: "Invalid session token" });
		return;
	}
	const closets = db.prepare(`
		SELECT closet_id, name
		FROM closets
		WHERE user_id = (SELECT user_id FROM sessions WHERE token = ?)
	`).all(req.headers.authorization);
	res.send(closets);
});




/**
 * @typedef {Object} DashboardCloset
 * @property {number} closet_id
 * @property {string} name
 * @property {DashboardShelf[]} shelves
 */
/**
 * @typedef {Object} DashboardShelf
 * @property {number} shelf_id
 * @property {string} name
 * @property {number} size
 * @property {string} units
 * @property {DashboardContainer[]} containers
 * @property {DashboardItem[]} items
 */
/**
 * @typedef {Object} DashboardContainer
 * @property {number} container_id
 * @property {string} name
 * @property {number} size
 * @property {string} units
 * @property {DashboardItem[]} items
 */
/**
 * @typedef {Object} DashboardItem
 * @property {number} item_id
 * @property {string} name
 * @property {number} count
 * @property {string} description
 * @property {string} photo_url
 * @property {number} expiration_date
 */


// Get the shelves, containers, and items in a closet
// Sends back a DashboardCloset object
app.get("/api/closet/:closetID", (req, res) => {
	if (!validateToken(req.headers.authorization)) {
		res.status(401).json({ error: "Invalid session token" });
		return;
	}
	const closetID = req.params.closetID;
	const belongsToRelations = db.prepare(`
		SELECT shelf_id, container_id
		FROM belongs_to
		WHERE closet_id = ?
	`).all(closetID);
	const shelves = db.prepare(`
		SELECT shelf_id, name, size, units
		FROM shelves
		WHERE closet_id = ?
	`).all(closetID);
	const containers = db.prepare(`
		SELECT container_id, name, size, units
		FROM containers
		WHERE closet_id = ?
	`).all(closetID);
	const items = db.prepare(`
		SELECT item_id, name, count, description, photo_url, expiration_date
		FROM items
		WHERE item_id IN (
			SELECT item_id
			FROM contains_item
			WHERE shelf_id IN (
				SELECT shelf_id
				FROM shelves
				WHERE closet_id = ?
			)
		)
	`).all(closetID);
	const closet = {
		closet_id: closetID,
		name: db.prepare("SELECT name FROM closets WHERE closet_id = ?").pluck().get(closetID),
		shelves: shelves.map(shelf => ({
			...shelf,
			containers: containers.filter(container => container.shelf_id === shelf.shelf_id),
			items: items.filter(item => belongsToRelations.find(relation => relation.shelf_id === shelf.shelf_id && relation.container_id === null).item_id === item.item_id)
		}))
	};
	res.send(closet);
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

/* retrieves item data and sends back to frontend in a formdata object
	request must be made with at least the itemid supplied
*/
app.get("/api/item-display", upload.none(), async (req, res) => {
	const item_id = req.query.item_id;
	console.log(item_id);
	const shelf_id = req.query.shelf_id;
	const container_id = req.query.container_id;
	// if (shelf_id != null)//look for item on given shelf
	// {

	// }
	// if (c_id != null)//look for item in given container
	// {

	// }
	// else{//look through list of all items
		
	// }//implement this after I know this works lol
	const stmt = db.prepare(`
			SELECT *
			FROM items
			WHERE item_id = ?
		`);
	const result = stmt.get(item_id);
	console.log(result);
	res.send({
		itemid: result.item_id,
		description: result.description,
		photoURL: result.photo_url,
		type: result.type,
		expirationDate: result.expiration_date,
		name: result.name
	});
});


app.post("/api/add-shelf", upload.none(), (req, res) => {
	if (!validateToken(req.headers.authorization)) {
		res.status(401).json({ error: "Invalid session token" });
		return;
	}

	const { name, size, units, closet_id } = req.body;
	const result = db.prepare(`
		INSERT INTO shelves (name, size, units)
		VALUES (?, ?, ?)
	`).run(name, size, units);

	db.prepare(`
		INSERT INTO Belongs_To (closet_id, shelf_id, container_id)
		VALUES (?, ?, NULL)
	`).run(closet_id, result.lastInsertRowid);

	res.sendStatus(201);
});


app.post("/api/add-container", upload.none(), (req, res) => {
	if (!validateToken(req.headers.authorization)) {
		res.status(401).json({ error: "Invalid session token" });
		return;
	}

	const { name, size, units, closet_id, shelf_id } = req.body;
	const result = db.prepare(`
		INSERT INTO containers (name, size, units)
		VALUES (?, ?, ?)
	`).run(name, size, units);

	db.prepare(`
		INSERT INTO Belongs_To (closet_id, shelf_id, container_id)
		VALUES (?, ?, ?)
	`).run(closet_id, shelf_id, result.lastInsertRowid);

	res.sendStatus(201);
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
