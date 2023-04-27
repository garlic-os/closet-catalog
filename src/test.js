import Database from 'better-sqlite3';
const db = new Database('test.db');

db.exec(`DROP TABLE IF EXISTS Users;`);
db.exec(`CREATE TABLE Users(
    id              INTEGER PRIMARY KEY,
    username        TEXT,
    password_hash   TEXT
    );
`
);

db.exec(`Insert Into Users
Values (1, 'matt', 'test');
Insert Into Users
Values (2, 'john', 'test2');
`);
const stmt = db.prepare(`
    SELECT username
    FROM Users
`);
const id = stmt.get();

console.log(id);