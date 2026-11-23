import express from "express";
import cors from "cors";
import session from "express-session";

import Spil from "./Logik.js";

const spilSessions = new Map();

const app = express();

app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(session({
  secret: "hemmelig",
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000*60*3,
    httpOnly: true,
    sameSite: "lax"
  }
}));

let port = 8000;

app.get("/score/locked/:scoreId", findSpil, (request, response) => {
  const scoreId = request.params.scoreId;

  const locked = request.spil.isScoreLocked(scoreId);

  response.status(200).json({
    locked: locked,
  });
});

app.post("/terning", findSpil, (request, response) => {
  const result = request.spil.kastTerninger();

  if (result === null) {
    return response.status(400).json({
      error: "Ingen kast tilbage",
    });
  }

  response.status(201).json({
    turn: result.turn,
    terninger: result.terninger.map((t) => t.getEyes()),
    scores: Object.fromEntries(result.scores),
  });
});

app.post("/terning/lock", findSpil, (request, response) => {
  const {
    index,
    locked
  } = request.body;

  if (
    !Number.isInteger(index) ||
    index < 0 ||
    index >= 5 ||
    typeof locked !== "boolean"
  ) {
    return response.status(400).json({
      error: "Ugyldig låsning",
    });
  }

  request.spil.setLockedDice(index, locked);

  response.status(201).json({
    success: true,
  });
});

app.post("/score/locked", findSpil, (request, response) => {

  const {
    scoreId,
    scoreValue
  } = request.body;

  const success = request.spil.lockScore(scoreId, scoreValue);

  if (!success) {
    return response.status(400).json({
      error: "Pointfeltet kunne ikke låses"
    });
  }

  response.status(201).json({
    success: true
  });
});

app.get("/score/gameover", findSpil, (request, response) => {
  const gameover = request.spil.isGameOver();

  response.status(200).json({
    gameover: gameover,
  });
});

app.get("/score/turn", findSpil, (request, response) => {
  const turn = request.spil.getTurn();
  response.status(200).json({
    turn: turn,
  });
});

app.get("/score/summary", findSpil, (req, res) => {
  const summary = req.spil.getScoreSummary();
  res.status(200).json({
    summary: summary,
  });
});

app.post("/login", (req, res) => {

  const navn = req.body.navn?.trim();

  if (!navn) {
    return res.status(400).json({
      error: "Navn mangler"
    });
  }

  req.session.regenerate((err) => {
    if (err) {
      return res.status(500).json({
        error: "Kunne ikke oprette session"
      });
    }

    req.session.spiller = {
      navn: navn,
      point: 0
    };

    spilSessions.set(req.sessionID, {
    navn: navn,
    spil: new Spil(),
    sidstAktiv: Date.now()
});

    res.status(200).json({
      message: "Spiller oprettet",
      spiller: req.session.spiller
    });
  });
});

app.get("/mig", findSpil, (req, res) => { //Hjælpe metode til luge at tjkekke at vi kunne få spilleren fra sessionen 

  if (!req.session.spiller) {
    return res.status(401).json({
      error: "Ingen spiller logget ind"
    });
  }
  res.json(req.session.spiller);
});

app.get("/spillere", findSpil, (req, res) => {

    const spillere = [];
    const nu = Date.now();

    for (const spiller of spilSessions.values()) {

        if (nu - spiller.sidstAktiv < 15000) {

            spillere.push({
                navn: spiller.navn,
                point: spiller.spil.getScoreSummary().total
            });
        }
    }

    res.status(200).json(spillere);
});

app.post("/aktiv", findSpil, (req, res) => {

    const spiller = spilSessions.get(req.sessionID);

    spiller.sidstAktiv = Date.now();

    res.status(201).json({
        success: true
    });
});

function findSpil(req, res, next) { //Middelware tilknytter spillet sammen med sessionen for at kunne arbejde med REST-points

    if (!req.session.spiller) {
        return res.status(401).json({
            error: "Du er ikke logget ind"
        });
    }

    const spiller = spilSessions.get(req.sessionID);

    if (!spiller) {
        return res.status(404).json({
            error: "Spil blev ikke fundet"
        });
    }

    req.spil = spiller.spil;

    next();
}

app.listen(port);

console.log("Lytter på port: " + port);