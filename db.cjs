const Database = require("better-sqlite3");

const db = new Database("student-planer.db")

const defaultSubjects = [
  { name: "Mathematik",id: 1},
  { name: "Deutsch",id: 2},
  { name: "Informatik",id: 3},
  { name: "Sozialkunde",id: 4},
  { name: "Ethik",id: 5},
  { name: "Englisch",id: 6},
  { name: "Physik",id: 7},
]

db.exec(`CREATE TABLE IF NOT EXISTS subjects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL
)`);

db.exec(`CREATE TABLE IF NOT EXISTS homework (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  due_date INTEGER,
  completed BOOLEAN,
  fk_subject INTEGER REFERENCES subjects(id) ON DELETE SET NULL,
  name TEXT NOT NULL
)`);

function resetHomeworkTable() {
  db.exec("DROP TABLE homework")
}

function createTestHomeworkData() {
  db.run("INSERT INTO homework (name,fk_subject,due_date) VALUES ('Nullstellen berechnen',1,1789141406837)")
  db.run("INSERT INTO homework (name,fk_subject,due_date) VALUES ('Nullstellen berechnen',1,1789141406837)")
  db.run("INSERT INTO homework (name,fk_subject,due_date) VALUES ('Nullstellen berechnen',1,1789141406837)")
  db.run("INSERT INTO homework (name,fk_subject,due_date) VALUES ('Nullstellen berechnen',1,1789141406837)")
}


function initDefaultSubjects() {
  for (const s of defaultSubjects) {
    db.prepare("INSERT INTO subjects (name,id) VALUES(?,?)")
      .run(s.name,s.id)
  }
}

function initDefaultData() {
  if (!db.prepare("SELECT 1 FROM subjects WHERE 1=1").get()) {
    initDefaultSubjects();
  }
}
initDefaultData();

function listSubjects() {
  return db.prepare("SELECT * FROM subjects").all();
}

function listHomework() {
  return db.prepare("SELECT * FROM homework").all();
}


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



module.exports = {
  listHomework
}
