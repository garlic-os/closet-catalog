import Database from 'better-sqlite3';
const db = new Database('test.db');

db.exec(`DROP TABLE IF EXISTS Users;`);
db.exec('DROP TABLE IF EXISTS Closet;');
db.exec('DROP TABLE IF EXISTS Shelf;');

db.exec(`
    CREATE TABLE Users(
    id              INTEGER PRIMARY KEY,
    username        TEXT NOT NULL,
    password_hash   TEXT NOT NULL
    );

    CREATE TABLE Closet (
        Cid           INTEGER PRIMARY KEY AUTOINCREMENT,
        name          TEXT NOT NULL
    );

    CREATE TABLE Shelf (
        Sid           INTEGER PRIMARY KEY AUTOINCREMENT,
        size          INTEGER NOT NULL,
        material      TEXT NOT NULL,
        units         TEXT NOT NULL,
        value         INTEGER NOT NULL,
        name          TEXT NOT NULL
    );
`
);

db.exec(`Insert Into Users
Values (1, 'matt', 'test');
Insert Into Users
Values (2, 'john', 'test2');
`);

db.exec(`Insert Into Shelf Values (1, 10, 'plastic', 'feet', 20, 'shelf1');`);

const stmt = db.prepare(`
    SELECT username
    FROM Users
`);

// const id = stmt.get();

// console.log(id);

db.close();