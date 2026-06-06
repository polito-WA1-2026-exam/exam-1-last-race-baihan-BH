import sqlite from 'sqlite3';
import crypto from 'crypto';
import { buildGraph, getGraph, generateRandomRoute } from "./utils/graph.js";
import { generateRecord } from "./utils/record.js";

const db = new sqlite.Database("game.sqlite", err => {
    if (err) throw err;
});


/* USERS */
export const getUser = (username, password) => {
    return new Promise((resolve, reject) => {
      const sql = "SELECT * FROM users WHERE username = ?";
      db.get(sql, [username], (err, row) => {
        if (err) { 
          reject(err); 
        }
        else if (row === undefined) { 
          resolve(false); 
        }
        else {
          const user = {user_id: row.user_id, username: row.username};
          
          crypto.scrypt(password, row.salt, 16, function(err, hashedPassword) {
            if (err) reject(err);
            if(!crypto.timingSafeEqual(Buffer.from(row.hashedPassword, "hex"), hashedPassword))
              resolve(false);
            else
              resolve(user);
          });
        }
      });
    });
};

export const getRecords = () => { 
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT 
        u.username AS username,
        r.score AS score
      FROM records r, users u
      WHERE r.user_id = u.user_id
      ORDER BY r.score DESC
      LIMIT 10;
    `;
    db.all(sql, [], (err, rows) => {
      if (err) reject(err);
      const records = rows.map((row) => ({
        username: row.username,
        score: row.score,
      }));
      resolve(records);
    });
  });
};

export const getNetwork = () => {
  return new Promise((resolve, reject) => {
    const sqlStations = `SELECT * FROM stations`;
    const sqlSegments = `
      SELECT 
        s.station_a_id AS source, 
        s.station_b_id AS target, 
        l.line_name AS lineName 
      FROM segments s, lines l
      WHERE s.line_id = l.line_id
    `
    db.all(sqlStations, [], (err1, stations) => {
      if (err1) reject(err1);
      db.all(sqlSegments, [], (err2, segments) => {
        if (err2) reject(err2);
        resolve({ stations: stations, segments: segments });
      })
    });
  });
};
  
export const getSetup = () => {
  return new Promise((resolve, reject) => { 
    buildGraph().then(
      () => {
        let graph = getGraph();
        if (!graph || Object.keys(graph).length === 0) {
          reject("no graph");
          return;
        }
        const routeData = generateRandomRoute();
        const sql = `SELECT * FROM stations WHERE station_id = ?`;
        db.all(sql, [routeData.startStation], (err1, row1) => {
          if (err1) reject(err1);
          db.all(sql, [routeData.desStation], (err2, row2) => {
            if (err2) reject(err2);
            resolve({
              startStation: row1[0],
              destStation: row2[0],
            });
          });
        });
      },
      () => {
        reject("failed to build graph")
      }
    )
  });
}

export const addRecords = (para) => {
  return new Promise((resolve, reject) => { 
    generateRecord(para).then((res) => {
      const segmentsJSON = JSON.stringify(para.segments)
      const sql = "INSERT INTO records (user_id, score, start_station_id, dest_station_id, path_taken) VALUES (?, ?, ?, ?, ?)"
      db.run(sql, [para.userId, res.score, para.startStationId, para.destStationId, segmentsJSON], function (err) {
        if (err)
          reject(err);
        else
          resolve(res);
      });
    }, (err) => {
      reject(err);
    })
  });
}