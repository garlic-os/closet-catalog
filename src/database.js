const Database = require('better-sqlite3');
const db = new Database('database.db');

db.exec(`
    CREATE TABLE IF NOT EXISTS users (
        id            INTEGER PRIMARY KEY AUTOINCREMENT,
        name          TEXT NOT NULL,
        password_hash TEXT NOT NULL
    );

    CREATE TABLE closet (
        Cid           INTEGER PRIMARY KEY AUTOINCREMENT,
        name          TEXT NOT NULL
    );

    CREATE TABLE shelf (
        Sid           INTEGER PRIMARY KEY AUTOINCREMENT,
        size          INTEGER NOT NULL,
        material      INTEGER NOT NULL,
        units         TEXT NOT NULL,
        value         INTEGER NOT NULL,
        name          TEXT NOT NULL
    );

`);