const Database = require('better-sqlite3');
const db = new Database('database.db');

db.exec(`
    CREATE TABLE IF NOT EXISTS users (
        id            INTEGER PRIMARY KEY AUTOINCREMENT,
        name          TEXT NOT NULL,
        password_hash TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS closet (
        Cid           INTEGER PRIMARY KEY AUTOINCREMENT,
        name          TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS shelf (
        Sid           INTEGER PRIMARY KEY AUTOINCREMENT,
        size          INTEGER NOT NULL,
        material      TEXT NOT NULL,
        units         TEXT NOT NULL,
        value         INTEGER NOT NULL,
        name          TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS shelf (
        container_id  INTEGER PRIMARY KEY AUTOINCREMENT,
        type          TEXT,
        name          TEXT NOT NULL,
    );

    CREATE TABLE IF NOT EXISTS item(
        itemID          INTEGER PRIMARY KEY AUTOINCREMENT,
        custom_desc     TEXT,
        photoURL        TEXT,
        type            TEXT,
        count           INTEGER NOT NULL,
        is_perishable   BOOLEAN NOT NULL,
        expiration_date TEXT,
        name            TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS Owns(
        user_id         INTEGER FOREIGNKEY,//is this how you denote a foreign key in SQL?
        closet_id       INTEGER FOREIGNKEY,
        PRIMARY KEY (user_id, closet_id)//I don't think this is the right syntax... can't use PRIMARY KEY constraint as normal tho since there are two
        //to be finished
    );

    CREATE TABLE IF NOT EXISTS Belongs_To(
        closet_id       INTEGER, //still don't know if thats the right syntax...
        shelf_id        INTEGER,
        container_id    INTEGER,
        PRIMARY KEY (closet_id, shelf_id, container_id) //still don't know if this is the right syntax either...
        FOREIGN KEY (closet_id) REFERENCES closet(Cid)
        FOREIGN KEY (shelf_id) REFERENCES shelf(Sid)
        FOREIGN KEY (container_id) REFERENCES (//fill this in once container has been made)
        //to be finished
    );

    CREATE TABLE IF NOT EXISTS Contains_Item(
        container_id    
        shelf_id        
        item_id     
        //to be finished
    );

`);