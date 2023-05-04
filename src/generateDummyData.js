/**
 * @file generateDummyData.js
 * Populates the database with two example users.
 * Each user has two closets.
 * Each closet has one shelf.
 * Each shelf has two container and one item directly on the shelf.
 * Each container has two more items.
 */

import Database from 'better-sqlite3';
import './database.js';
import bcrypt from 'bcrypt';
const db = new Database("database.db");

console.log("Generating dummy data...");

const createUserStmt = db.prepare(`
    INSERT INTO users (username, password_hash)
    VALUES (?, ?)
`);
const createClosetStmt = db.prepare(`
    INSERT INTO closets (user_id, name)
    VALUES (?, ?)
`);
const createShelfStmt = db.prepare(`
    INSERT INTO shelves (size, material, units, value, name)
    VALUES (?, ?, ?, ?, ?)
`);
const createContainerStmt = db.prepare(`
    INSERT INTO containers (size, material, units, value, name)
    VALUES (?, ?, ?, ?, ?)
`);
const createItemStmt = db.prepare(`
    INSERT INTO items (description, photo_url, type, count, expiration_date, name)
    VALUES (?, ?, ?, ?, ?, ?)
`);
const createBelongsToStmt = db.prepare(`
    INSERT INTO Belongs_To (closet_id, shelf_id, container_id)
    VALUES (?, ?, ?)
`);
const createContainsItemStmt = db.prepare(`
    INSERT INTO Contains_Item (item_id, container_id)
    VALUES (?, ?)
`);

// Creating user 1's data
{
    const user1_id = createUserStmt.run("user1", bcrypt.hashSync("password1", 10)).lastInsertRowid;
    const closet1_id = createClosetStmt.run(user1_id, "User 1's Pantry").lastInsertRowid;
    const shelf1_id = createShelfStmt.run(10, "Wood", "inches", 100, "Shelf 1").lastInsertRowid;
    const container1_id = createContainerStmt.run(10, "Plastic", "inches", 100, "Container 1").lastInsertRowid;
    const item1_id = createItemStmt.run("Dummy data placeholder description", "https://via.placeholder.com/150", "Food", 4, "2021-12-31", "Apple").lastInsertRowid;
    const item2_id = createItemStmt.run("Dummy data placeholder description", "https://via.placeholder.com/150", "Food", 3, "2021-12-31", "Orange").lastInsertRowid;
    const item3_id = createItemStmt.run("Dummy data placeholder description", "https://via.placeholder.com/150", "Food", 5, "2021-12-31", "Banana").lastInsertRowid;
    createBelongsToStmt.run(closet1_id, shelf1_id, null);  // shelf1 belongs to closet1
    createBelongsToStmt.run(closet1_id, shelf1_id, container1_id);  // shelf1, which is in closet1, contains container1
    createContainsItemStmt.run(item1_id, shelf1_id);
    createContainsItemStmt.run(item2_id, container1_id);
    createContainsItemStmt.run(item3_id, container1_id);

    const closet2_id = createClosetStmt.run(user1_id, "User 1's Hall Closet").lastInsertRowid;
    const shelf2_id = createShelfStmt.run(10, "Wood", "inches", 100, "Shelf 2").lastInsertRowid;
    const container2_id = createContainerStmt.run(10, "Plastic", "inches", 100, "Container 2").lastInsertRowid;
    const item4_id = createItemStmt.run("Dummy data placeholder description", "https://via.placeholder.com/150", "Battery", 12, "2021-12-31", "AA Battery").lastInsertRowid;
    const item5_id = createItemStmt.run("Dummy data placeholder description", "https://via.placeholder.com/150", "Battery", 3, "2021-12-31", "AAA Battery").lastInsertRowid;
    const item6_id = createItemStmt.run("Dummy data placeholder description", "https://via.placeholder.com/150", "Tool", 1, "2021-12-31", "Hammer").lastInsertRowid;
    createBelongsToStmt.run(closet2_id, shelf2_id, null);  // shelf2 belongs to closet2
    createBelongsToStmt.run(closet2_id, shelf2_id, container2_id);  // shelf2, which is in closet2, contains container2
    createContainsItemStmt.run(item4_id, shelf2_id);
    createContainsItemStmt.run(item5_id, container2_id);
    createContainsItemStmt.run(item6_id, container2_id);
}

// Creating user 2's data
{
    const user2_id = createUserStmt.run("user2", bcrypt.hashSync("password2", 10)).lastInsertRowid;
    const closet3_id = createClosetStmt.run(user2_id, "User 2's Fridge").lastInsertRowid;
    const shelf3_id = createShelfStmt.run(10, "Plastic", "inches", 100, "Shelf 3").lastInsertRowid;
    const container3_id = createContainerStmt.run(10, "Plastic", "inches", 100, "Container 3").lastInsertRowid;
    const item7_id = createItemStmt.run("Dummy data placeholder description", "https://via.placeholder.com/150", "Food", 2, "2021-12-31", "Bread").lastInsertRowid;
    const item8_id = createItemStmt.run("Dummy data placeholder description", "https://via.placeholder.com/150", "Food", 1, "2021-12-31", "Milk Jug").lastInsertRowid;
    const item9_id = createItemStmt.run("Dummy data placeholder description", "https://via.placeholder.com/150", "Food", 12, "2021-12-31", "Eggs").lastInsertRowid;
    createBelongsToStmt.run(closet3_id, shelf3_id, null);  // shelf3 belongs to closet3
    createBelongsToStmt.run(closet3_id, shelf3_id, container3_id);  // shelf3, which is in closet3, contains container3
    createContainsItemStmt.run(item7_id, shelf3_id);
    createContainsItemStmt.run(item8_id, container3_id);
    createContainsItemStmt.run(item9_id, container3_id);

    const closet4_id = createClosetStmt.run(user2_id, "User 2's Garage").lastInsertRowid;
    const shelf4_id = createShelfStmt.run(10, "Wood", "inches", 100, "Shelf 4").lastInsertRowid;
    const container4_id = createContainerStmt.run(10, "Plastic", "inches", 100, "Container 4").lastInsertRowid;
    const item10_id = createItemStmt.run("Dummy data placeholder description", "https://via.placeholder.com/150", "Tool", 1, "2021-12-31", "Screwdriver").lastInsertRowid;
    const item11_id = createItemStmt.run("Dummy data placeholder description", "https://via.placeholder.com/150", "Tool", 1, "2021-12-31", "Wrench").lastInsertRowid;
    const item12_id = createItemStmt.run("Dummy data placeholder description", "https://via.placeholder.com/150", "Tool", 1, "2021-12-31", "Pliers").lastInsertRowid;
    createBelongsToStmt.run(closet4_id, shelf4_id, null);  // shelf4 belongs to closet4
    createBelongsToStmt.run(closet4_id, shelf4_id, container4_id);  // shelf4, which is in closet4, contains container4
    createContainsItemStmt.run(item10_id, shelf4_id);
    createContainsItemStmt.run(item11_id, container4_id);
    createContainsItemStmt.run(item12_id, container4_id);
}

console.log("Dummy data created successfully!");
