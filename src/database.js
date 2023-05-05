import Database from 'better-sqlite3';
const db = new Database('database.db');

db.pragma("foreign_keys = ON");

db.exec(`
    CREATE TABLE IF NOT EXISTS users (
        user_id       INTEGER PRIMARY KEY AUTOINCREMENT,
        username      TEXT NOT NULL,
        password_hash TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS sessions (
        token         TEXT    PRIMARY KEY,
        user_id       INTEGER REFERENCES users(user_id)
    );

    CREATE TABLE IF NOT EXISTS closets (
        closet_id     INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id       INTEGER REFERENCES users(user_id),
        name          TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS shelves (
        shelf_id      INTEGER PRIMARY KEY AUTOINCREMENT,
        size          INTEGER NOT NULL DEFAULT 0,
        units         TEXT    NOT NULL DEFAULT "",
        material      TEXT,
        value         INTEGER,
        name          TEXT    NOT NULL
    );

    CREATE TABLE IF NOT EXISTS containers (
        container_id  INTEGER PRIMARY KEY AUTOINCREMENT,
        size          INTEGER NOT NULL DEFAULT 0,
        units         TEXT    NOT NULL DEFAULT "",
        material      TEXT,
        value         INTEGER,
        name          TEXT    NOT NULL
    );

    CREATE TABLE IF NOT EXISTS items (
        item_id         INTEGER PRIMARY KEY AUTOINCREMENT,
        description     TEXT,
        photo_url       TEXT,
        type            TEXT,
        count           INTEGER NOT NULL DEFAULT 1,
        expiration_date TEXT,
        name            TEXT    NOT NULL
    );

    CREATE TABLE IF NOT EXISTS Belongs_To (
        closet_id       INTEGER REFERENCES closets(closet_id),
        shelf_id        INTEGER REFERENCES shelves(shelf_id),
        container_id    INTEGER REFERENCES containers(container_id),
        PRIMARY KEY     (closet_id, shelf_id, container_id)
    );

    CREATE TABLE IF NOT EXISTS Contains_Item (
        item_id         INTEGER REFERENCES items(item_id),
        container_id    INTEGER REFERENCES containers(container_id),
        shelf_id        INTEGER REFERENCES shelves(shelf_id),
        PRIMARY KEY     (item_id, container_id, shelf_id)
    );
`);