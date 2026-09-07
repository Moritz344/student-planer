const { Database } = require("bun:sqlite");


const db = new Database("student-planer.db")

db.exec(`CREATE TABLE IF NOT EXISTS subjects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL
)`);

db.exec(`CREATE TABLE IF NOT EXISTS homework (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  fk_subject INTEGER REFERENCES subjects(id) ON DELETE SET NULL,
  name TEXT NOT NULL
)`);

db.exec(`CREATE TABLE IF NOT EXISTS grades (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    fk_subject INTEGER REFERENCES subjects(id) ON DELETE CASCADE,
    grade REAL NOT NULL,
    name TEXT,
    date TEXT DEFAULT CURRENT_TIMESTAMP
  );
`);

db.exec(`CREATE TABLE IF NOT EXISTS exams (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    fk_subject INTEGER REFERENCES subjects(id) ON DELETE CASCADE,
    description TEXT,
    date TEXT DEFAULT CURRENT_TIMESTAMP
  );
`);

db.exec(`CREATE TABLE IF NOT EXISTS timetable (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    fk_subject INTEGER REFERENCES subjects(id) ON DELETE CASCADE,
    day INTEGER NOT NULL,
    start_time TEXT NOT NULL,
    end_time TEXT NOT NULL,
    room TEXT
  );
`);




