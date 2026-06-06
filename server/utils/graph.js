import sqlite from 'sqlite3';

const db = new sqlite.Database("game.sqlite", err => {
    if (err) throw err;
});

let graph;

export const buildGraph = () => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT station_a_id, station_b_id FROM segments`;
        db.all(sql, [], (err, rows) => {
            if (err) reject(err);
            const curGraph = {};
            rows.forEach(element => {
                const stationA = element.station_a_id;
                const stationB = element.station_b_id;
                if (!curGraph[stationA]) {
                    curGraph[stationA] = [];
                }
                if (!curGraph[stationB]) {
                    curGraph[stationB] = [];
                }

                curGraph[stationA].push(stationB);
                curGraph[stationB].push(stationA);
            });
            graph = curGraph;
            resolve(graph);
        })
    })
}

export const getGraph = () => graph;

export const generateRandomRoute = () => {
    const allStations = Object.keys(graph);
    const startStation = allStations[Math.floor(Math.random() * allStations.length)];

    const queue = [startStation];
    const visited = new Set([startStation]);
    const distances = { [startStation]: 0 };
    
    while (queue.length > 0) { 
        const current = queue.shift();
        const curDistance = distances[current];

        const neighbors = graph[current] || [];

        for (const neighbor of neighbors) {
            const neighborStr = neighbor.toString();
            if (!visited.has(neighborStr)) {
                visited.add(neighborStr);
                distances[neighborStr] = curDistance + 1;
                queue.push(neighborStr);
            }
        }
    }

    const valid = Object.keys(distances).filter(
        station => distances[station] >= 3
    )
    if (valid.length === 0) {
        generateRandomRoute();
    }

    const desStation = valid[Math.floor(Math.random() * valid.length)];

    return {
        startStation: startStation,
        desStation: desStation
    };
}
