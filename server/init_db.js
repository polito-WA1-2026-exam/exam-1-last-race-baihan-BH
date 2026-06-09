import sqlite from 'sqlite3';
import crypto from 'crypto';

const db = new sqlite.Database('./game.sqlite');

db.serialize(() => {
  db.run(`DROP TABLE IF EXISTS segments`);
  db.run(`DROP TABLE IF EXISTS lines`);
  db.run(`DROP TABLE IF EXISTS stations`);
  db.run(`DROP TABLE IF EXISTS events`);
  db.run(`DROP TABLE IF EXISTS users`);
  db.run(`DROP TABLE IF EXISTS records`);

  // create tables

  db.run(`CREATE TABLE segments (
    seg_id INTEGER PRIMARY KEY AUTOINCREMENT,
    station_a_id INTEGER NOT NULL,
    station_b_id INTEGER NOT NULL,
    line_id INTEGER NOT NULL,
    FOREIGN KEY (station_a_id) REFERENCES stations(station_id),
    FOREIGN KEY (station_b_id) REFERENCES stations(station_id),
    FOREIGN KEY (line_id) REFERENCES lines(line_id)
  )`);

  db.run(`CREATE TABLE users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    hashedPassword TEXT NOT NULL,
    salt TEXT NOT NULL
  )`);

  db.run(`CREATE TABLE events (
    event_id INTEGER PRIMARY KEY AUTOINCREMENT,
    description TEXT NOT NULL,
    effect INTEGER NOT NULL
  )`);

  db.run(`CREATE TABLE stations (
    station_id INTEGER PRIMARY KEY AUTOINCREMENT,
    station_name TEXT UNIQUE NOT NULL,
    is_interchange BOOLEAN DEFAULT 0,
    position_x INTEGER NOT NULL,
    position_y INTEGER NOT NULL
  )`);

  db.run(`CREATE TABLE lines (
    line_id INTEGER PRIMARY KEY AUTOINCREMENT,
    line_name TEXT UNIQUE NOT NULL
  )`);

  db.run(`CREATE TABLE records (
    record_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    score INTEGER NOT NULL,
    start_station_id INTEGER NOT NULL,
    dest_station_id INTEGER NOT NULL,
    path_taken TEXT,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
  )`);

  // seeding
  
  const insertEvent = db.prepare(`INSERT INTO events (description, effect) VALUES (?, ?)`);
  insertEvent.run("Station jackpot, +4 coins", 4);
  insertEvent.run("Lucky dog, +3 coins", 3);
  insertEvent.run("Midnight train, +2 coin", 2);
  insertEvent.run("Found coins, +1 coins", 1);
  insertEvent.run("Quiet journey, 0 coin", 0);
  insertEvent.run("Lost umbrella, -1 coins", -1);
  insertEvent.run("Broken turnstile, -1 coin", -1);
  insertEvent.run("Wrong platform, -2 coins", -2);
  insertEvent.run("Active pickpocket, -4 coins", -4);
  insertEvent.finalize();

  const insertLine = db.prepare(`INSERT INTO lines (line_name) VALUES (?)`);
  insertLine.run("Red Line");
  insertLine.run("Blue Line");
  insertLine.run("Green Line");
  insertLine.run("Yellow Line");
  insertLine.finalize();

  const insertStation = db.prepare(`INSERT INTO stations (station_name, is_interchange, position_x, position_y) VALUES (?, ?, ?, ?)`);
  insertStation.run("Gucun Park", 0, 250, 200); 
  insertStation.run("Jing'an Temple", 1, 250, 300);
  insertStation.run("Dong'an Road", 0, 250, 500);
  insertStation.run("Longyang Road", 0, 750, 500);
  insertStation.run("Hongqiao Railway Station", 0, 80, 300);
  insertStation.run("West Nanjing Road", 1, 400, 300);
  insertStation.run("People's Square ", 1, 550, 300);
  insertStation.run("Lujiazui", 0, 700, 350);
  insertStation.run("Fujin Road", 0, 550, 100);
  insertStation.run("Shanghai Railway Station", 1, 550, 200);
  insertStation.run("Lujiabang Road", 0, 550, 450);
  insertStation.run("Middle Huaihai Road", 0, 400, 400);
  insertStation.run("Zhenping Road", 0, 375, 200);
  insertStation.run("Hailun Road", 0, 750, 200);
  insertStation.finalize();

  const insertSegment = db.prepare(`INSERT INTO segments (station_a_id, station_b_id, line_id) VALUES (?, ?, ?)`);
  insertSegment.run(1, 2, 1); 
  insertSegment.run(2, 3, 1); 
  insertSegment.run(3, 4, 1); 
  insertSegment.run(5, 2, 2); 
  insertSegment.run(2, 6, 2); 
  insertSegment.run(6, 7, 2); 
  insertSegment.run(7, 8, 2); 
  insertSegment.run(9, 10, 3); 
  insertSegment.run(10, 7, 3); 
  insertSegment.run(7, 11, 3); 
  insertSegment.run(12, 6, 4); 
  insertSegment.run(6, 13, 4); 
  insertSegment.run(13, 10, 4); 
  insertSegment.run(10, 14, 4); 
  insertSegment.finalize();

  const insertRecord = db.prepare(
    "INSERT INTO records (user_id, score, start_station_id, dest_station_id) VALUES (?, ?, ?, ?)"
  );
  insertRecord.run(1, 20, 1, 14);
  insertRecord.finalize();

  // insert users
  function createHashedUser(username, plainPassword) {
    const salt = crypto.randomBytes(16).toString('hex');
    const hashedPassword = crypto.scryptSync(plainPassword, salt, 16).toString('hex');
    return { username: username, hashedPassword: hashedPassword, salt: salt };
  }
  
  const users = [
    createHashedUser("player1", "12345678"),
    createHashedUser("player2", "qwertyui"),
    createHashedUser("player3", "asdf5678")
  ];
  
  const insertUser = db.prepare(`INSERT INTO users (username, hashedPassword, salt) VALUES (?, ?, ?)`);
  users.forEach(user => insertUser.run(user.username, user.hashedPassword, user.salt))
  insertUser.finalize();

});

db.close();