// imports
import express from "express";
import cors from "cors";
import {addRecords, getSetup, getNetwork, getRecords, getUser } from "./dao.js";
import passport from "passport";
import LocalStrategy from "passport-local";
import session from "express-session";

// init express
const app = new express();
const port = 3001;

app.use(express.json());

const corsOptions = {
  origin: "http://localhost:5173",
  optionSuccessState: 200,
  credentials: true,
};
app.use(cors(corsOptions))

passport.use(new LocalStrategy(async function verify(username, password, cb) {
  const user = await getUser(username, password);
  if (!user) {
    return cb(null, false, { message: "Incorrect username or password." });
  }
  return cb(null, user)
}))

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (user, cb) {
  return cb(null, user);
});

const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ message: "Not authenticated" });
}

app.use(session({
  secret: "ding! it's a secret!",
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.authenticate("session"));


// POST /api/sessions
app.post("/api/sessions", passport.authenticate("local"), (req, res) => {
  return res.status(201).json(req.user);
});

// GET /api/sessions/current
app.get("/api/sessions/current", (req, res) => {
  if (req.isAuthenticated()) {
    res.json(req.user);
  } else {
    res.status(401).json({ error: "Not authenticated" });
  }
});

// DELETE /api/sessions/current
app.delete("/api/sessions/current", (req, res) => {
  req.logout(() => {
    res.end();
  })
});
app.use(isLoggedIn)

// GET /api/network
app.get("/api/network", async (req, res) => {
  try {
    const network = await getNetwork();
    res.json(network)
  } catch {
    res.status(500).end();
  }
})

//GET /api/games/records
app.get("/api/games/records", async (req, res) => { 
  try {
    const records = await getRecords();
    res.json(records)
  } catch {
    res.status(500).end();
  }
})

// GET /api/games/setup
app.get("/api/games/setup", async (req, res) => {
  try {
    const setup = await getSetup();
    req.session.gameTask = setup;
    res.json(setup);
  } catch {
    res.status(500).end();
  }
})

// POST /api/games/submit
app.post("/api/games/submit", isLoggedIn, async (req, res) => {
  const { segments } = req.body;
  if (!Array.isArray(segments)) return res.status(422).json({ error: "paramater error" })
  if (segments.length === 0) return res.status(201).json({ score: 0, results: [], reason: "no route" })
  
  const expectedTask = req.session.gameTask;
  
  const newSubmit = {
    userId: req.user.user_id,
    startStationId: expectedTask.startStation.station_id,
    destStationId: expectedTask.destStation.station_id,
    ...req.body,
  };
  try {
    const result = await addRecords(newSubmit);
    res.status(201).json(result);
  } catch(e) {
    res.status(503).json({error: "Impossible to create the record."});
  }
})

// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});