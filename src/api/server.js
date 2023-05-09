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

	// Create the user
	const user_id = db.prepare(`
		INSERT INTO users (username, password_hash)
		VALUES (?, ?)
	`).run(username, await bcrypt.hash(password, 10)).lastInsertRowid;


	// Create a closet for the user
	db.prepare(`
		INSERT INTO closets (user_id, name)
		VALUES (?, ?)
	`).run(user_id, "My Closet");

	// Sign the user in
	const token = crypto.randomUUID();
	db.prepare(`
		INSERT INTO sessions (user_id, token)
		VALUES (?, ?)
	`).run(user_id, token);

	const closetID = db.prepare(`
		SELECT closet_id
		FROM closets
		Where user_id = ?
	`).get(user_id);
	console.log(closetID);

	db.prepare(`
		INSERT INTO Owns (user_id, closet_id)
		VALUES (?, ?)
	`).run(user_id, closetID.closet_id);
	
	const firstShelf = db.prepare(`
		INSERT INTO shelves (name, material)
		VALUES (?, ?)
	`).run("floor", "floor-tile");
	
	const firstConatiner = db.prepare(`
		INSERT INTO containers (name, material)
		VALUES (?, ?)
	`).run("no container", "air");

	db.prepare(`
		INSERT INTO belongsTo (closet_id, shelf_id)
		Values (?, ?)
	`).run(closetID.closet_id, firstShelf.lastInsertRowid);

	db.prepare(`
	INSERT INTO belongsTo (closet_id, container_id)
	Values (?, ?)
	`).run(closetID.closet_id, firstConatiner.lastInsertRowid);

	res.send({ token });
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
	db.prepare(`
		INSERT INTO sessions (user_id, token)
		VALUES (?, ?)
	`).run(row.user_id, token);
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
 * @typedef {Object} DashboardItem
 * @property {number} item_id
 * @property {string} name
 * @property {number} count
 * @property {string} description
 * @property {string} photo_url
 * @property {number} expiration_date
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
 * @typedef {Object} DashboardShelf
 * @property {number} shelf_id
 * @property {string} name
 * @property {number} size
 * @property {string} units
 * @property {DashboardContainer[]} containers
 * @property {DashboardItem[]} items
 */
/**
 * @typedef {Object} DashboardCloset
 * @property {number} closet_id
 * @property {string} name
 * @property {DashboardShelf[]} shelves
 */

/**
 * Consolidate a user's closet data into a single object
 * @param {string} token
 * @returns {DashboardCloset}
 */
app.get("/api/closet/:closetID", (req, res) => {
	// if (!validateToken(req.headers.authorization)) {
	// 	res.status(401).json({ error: "Invalid session token" });
	// 	return;
	// }
	console.log("test");
	const closetID = req.params.closetID;
	const closetName = db.prepare(`
		SELECT name
		FROM closets
		WHERE closet_id = ?
	`).pluck().get(closetID);
	const shelves = db.prepare(`
		SELECT *
		FROM shelves
		WHERE shelf_id IN (
			SELECT shelf_id
			FROM belongsTo
			Where closet_id = ?
			)
	`).all(closetID);
	console.log(shelves);
	for (const shelf of shelves) {
		shelf.containers = db.prepare(`
			SELECT container_id, name, size, units
			FROM containers
			WHERE container_id IN (
				SELECT container_id
				FROM belongsTo
				where shelf_id = ?
			)
		`).all(shelf.shelf_id);
		// Get shelf's items from its Contains_Item table
		shelf.items = db.prepare(`
			SELECT item_id, name, count, description, photo_url, expiration_date
			FROM items
			WHERE item_id IN (
				SELECT item_id
				FROM Contains_Item
				WHERE shelf_id = ?
			)
		`).all(shelf.shelf_id);
	}
	const containers = db.prepare(`
		SELECT *
		FROM containers
		WHERE container_id IN (
			SELECT container_id
			FROM belongsTo
			WHERE closet_id = ?
		)
	`).all(closetID);//unfinished

	for (const container of containers)
	{
		container.items = db.prepare(`
			SELECT item_id, name, count, description, photo_url, expiration_date
			FROM items
			WHERE item_id IN (
				SELECT item_id
				FROM Contains_Item
				WHERE container_id = ?
			)
		`).all(container.container_id);
	}

	const closet = {
		closet_id: closetID,
		name: closetName,
		shelves,
		containers
	};
	console.log(closet);
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
		itemTypeName,
		initialCount,
		description,
		name,
		expirationDate,
		shelf_id,
		container_id
	} = req.body;

	const result = db.prepare(`
		INSERT INTO items
		(type, count, description, photo_url, name, expiration_date, description)
		VALUES (?, ?, ?, ?, ?, ?, ?)
	`).run(itemTypeName, initialCount, description, photoURL, name, expirationDate, description);

	db.prepare(`
		INSERT INTO contains_item (item_id, shelf_id, container_id)
		VALUES (?, ?, ?)
	`).run(result.lastInsertRowid, shelf_id, container_id);

	res.send({
		item_id: result.lastInsertRowid
	});
});


app.post("/api/add-shelf/:closetID", upload.none(), (req, res) => {
	if (!validateToken(req.headers.authorization)) {
		res.status(401).json({ error: "Invalid session token" });
		return;
	}
	const closetID = req.params.closetID;
	console.log(closetID);
	const { name, size, units } = req.body;
	//add shelf into shelves table
	db.prepare(`
		INSERT INTO shelves (name, size, units)
		VALUES (?, ?, ?)
	`).run(name, size, units);
	console.log("test");
	//add shelf to user's closet
	const shelf = db.prepare(`
		SELECT shelf_id
		FROM shelves
		WHERE name = ? AND size = ? AND units = ?
	`).get(name, size, units);
	console.log(shelf);
	db.prepare(`
		INSERT INTO belongsTo (closet_id, shelf_id)
		VALUES (?, ?)
	`).run(closetID, shelf.shelf_id);

	res.sendStatus(201);
});


app.post("/api/delete-shelf", upload.none(), (req, res) => {
	// if (!validateToken(req.headers.authorization)) {
	// 	res.status(401).json({ error: "Invalid session token" });
	// 	return;
	// }
	const shelf_id = req.body.shelf_id;
	const stmt = db.prepare(`
		SELECT *
		FROM shelves
		WHERE shelf_id = ?
	`);
	const stmt2 = db.prepare(`
		DELETE 
		FROM shelves
		WHERE shelf_id = ?
	`);
	
	const result = stmt.get(shelf_id);
	if(result === undefined)
	{
		res.sendStatus(400);
	}
	else{
		stmt2.run(shelf_id);
		res.sendStatus(200);
	}
});

app.post("/api/edit-item", upload.none(), (req, res) =>{
	
});

app.post("/api/delete-container", upload.none(), (req, res) => {
	// if (!validateToken(req.headers.authorization)) {
	// 	res.status(401).json({ error: "Invalid session token" });
	// 	return;
	// }
	const container_id = req.body.container_id;
	const stmt = db.prepare(`
		SELECT *
		FROM containers
		WHERE container_id = ?
	`);
	const stmt2 = db.prepare(`
		DELETE 
		FROM containers
		WHERE container_id = ?
	`);
	
	const result = stmt.get(container_id);
	if(result === undefined)
	{
		res.sendStatus(400);
	}
	else{
		stmt2.run(container_id);
		res.sendStatus(200);
	}
});

app.post("/api/delete-item", upload.none(), (req, res) => {
	const item_id = req.body.item_id;
	const stmt = db.prepare(`
		SELECT *
		FROM items
		WHERE item_id = ?
	`);
	const stmt2 = db.prepare(`
		DELETE 
		FROM items
		WHERE item_id = ?
	`);
	console.log(item_id);
	
	const result = stmt.get(item_id);
	if(result === undefined)
	{
		res.sendStatus(400);
	}
	else{
		stmt2.run(item_id);
		res.sendStatus(200);
	}
});

app.post("/api/add-container/:closetID", upload.none(), (req, res) => {
	if (!validateToken(req.headers.authorization)) {
		res.status(401).json({ error: "Invalid session token" });
		return;
	}

	const closetID = req.params.closetID;

	const { name, size, units, shelf_id } = req.body;
	db.prepare(`
		INSERT INTO containers (name, size, units)
		VALUES (?, ?, ?)
	`).run(name, size, units);

	const container = db.prepare(`
		SELECT container_id
		FROM containers
		WHERE name = ? AND size = ? AND units = ?
	`).get(name, size, units);

	console.log(closetID);
	console.log(container.container_id);
	console.log(shelf_id);
	db.prepare(`
		INSERT INTO belongsTo (closet_id, container_id, shelf_id)
		VALUES (?, ?, ?)
	`).run(closetID, container.container_id, shelf_id);

	res.sendStatus(201);
});

app.get("/api/total-items/:closetID", upload.none(), (req, res) => {
	// if (!validateToken(req.headers.authorization)) {
	// 	res.status(401).json({ error: "Invalid session token" });
	// 	return;
	// }

	const closetID = req.params.closetID;

	const shelves = db.prepare(`
		SELECT shelf_id
		FROM shelves
		WHERE EXISTS (
			SELECT shelf_id
			FROM belongsTo
			WHERE closet_id = ?
		)
	`).all(closetID);

	let shelfCount;
	let total = 0;
	for (const shelf of shelves)
	{
		shelfCount = db.prepare(`
			SELECT COUNT(item_id)
			FROM items
			WHERE item_id IN (
				SELECT item_id
				FROM Contains_Item
				WHERE shelf_id = ?
			)
		`).all(shelf.shelf_id);
		total += shelfCount[0]["COUNT(item_id)"];
	}
	let response = {
		total: total
	};
	res.send(response);
})

app.get("/api/total-containers/:closetID", upload.none(), (req, res) => {
	const closetID = req.params.closetID;
	const containers = db.prepare(`
		SELECT COUNT(container_id)
		FROM containers
		WHERE EXISTS (
			SELECT container_id  
			FROM belongsTo
			WHERE closet_id = ?
		)
	`).all(closetID);

	const total = containers[0]["COUNT(container_id)"]- 1;//subtracting for the "no container" container
	let response = {
		total: total
	};
	res.send(response);
});

app.get("/api/total-shelves/:closetID", upload.none(), (req, res) => {
	const closetID = req.params.closetID;
	const shelves = db.prepare(`
		SELECT COUNT(shelf_id)
		FROM shelves
		WHERE EXISTS (
			SELECT shelf_id  
			FROM belongsTo
			WHERE closet_id = ?
		)
	`).all(closetID);

	const total = shelves[0]["COUNT(shelf_id)"] - 1;//subtracting for the "floor" shelf
	let response = {
		total: total
	};
	res.send(response);
});

app.get("/api/search", (req, res) => {
	if (!validateToken(req.headers.authorization)) {
		res.status(401).json({ error: "Invalid session token" });
		return;
	}
	const query = parseInt(req.query.q);
	const matches = [];
	matches.concat(
		db.prepare(`
			SELECT file_id
			FROM files
			WHERE name LIKE ?
		`).all(`%${query}%`)
	);
	matches.concat(
		db.prepare(`
			SELECT container_id
			FROM containers
			WHERE name LIKE ?
		`).all(`%${query}%`)
	);
	matches.concat(
		db.prepare(`
			SELECT shelf_id
			FROM shelves
			WHERE name LIKE ?
		`).all(`%${query}%`)
	);
	res.send(matches);
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
