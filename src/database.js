import Database from 'better-sqlite3';
const db = new Database('database.db');

db.exec(`
    CREATE TABLE IF NOT EXISTS users (
        user_id       INTEGER PRIMARY KEY AUTOINCREMENT,
        name          TEXT NOT NULL,
        password_hash TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS sessions (
        user_id       INTEGER REFERENCES users(id),
        token         TEXT NOT NULL,
        PRIMARY KEY (user_id, token)
    );

    CREATE TABLE IF NOT EXISTS closets (
        closet_id     INTEGER PRIMARY KEY AUTOINCREMENT,
        name          TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS shelves (
        shelf_id      INTEGER PRIMARY KEY AUTOINCREMENT,
        size          INTEGER NOT NULL,
        material      TEXT NOT NULL,
        units         TEXT NOT NULL,
        value         INTEGER NOT NULL,
        name          TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS containers (
        container_id  INTEGER PRIMARY KEY AUTOINCREMENT,
        size          INTEGER NOT NULL,
        material      TEXT NOT NULL,
        units         TEXT NOT NULL,
        value         INTEGER NOT NULL,
        name          TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS items (
        item_id         INTEGER PRIMARY KEY AUTOINCREMENT,
        description     TEXT,
        photo_url       TEXT,
        type            TEXT,
        count           INTEGER NOT NULL,
        expiration_date TEXT,
        name            TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS Owns (
        user_id         INTEGER REFERENCES users(id),
        closet_id       INTEGER REFERENCES closets(closet_id),
        PRIMARY KEY     (user_id, closet_id)
        --to be finished
    );

    CREATE TABLE IF NOT EXISTS Belongs_To (
        closet_id       INTEGER REFERENCES closets(closet_id),
        shelf_id        INTEGER REFERENCES shelves(shelf_id),
        container_id    INTEGER REFERENCES containers(container_id),
        PRIMARY KEY     (closet_id, shelf_id, container_id)
        --to be finished
    );

    CREATE TABLE IF NOT EXISTS Contains_Item (
        item_id         INTEGER REFERENCES items(item_id),
        container_id    INTEGER REFERENCES containers(container_id),
        shelf_id        INTEGER REFERENCES shelves(shelf_id),
        PRIMARY KEY     (item_id, container_id, shelf_id)
        --to be finished
    );

`);