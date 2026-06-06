import sqlite from 'sqlite3';

const db = new sqlite.Database("game.sqlite", err => {
    if (err) throw err;
});

let events;

export const buildEvents = () => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM events`;
        db.all(sql, [], (err, rows) => {
            if (err) reject(err);
            events = rows;
            resolve(rows);
        })
    })
}

export const getEvents = () => events