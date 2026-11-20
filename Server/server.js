import express from 'express';
import cors from 'cors'
import { kastTerninger, setLockedDice,isScoreLocked } from './Logik.js';
const app = express();

app.use(express.json());
app.use(cors());

let port = 8000;

app.get('/score/locked/:scoreId', (request, response) => {

    const scoreId = request.params.scoreId;

    const locked = isScoreLocked(scoreId);

    response.status(200).json({
        locked: locked
    });
});

app.post('/terning', (request, response) => {

    const result = kastTerninger();

    if (result === null) {
        return response.status(400).json({
            error: "Ingen kast tilbage"
        });
    }

    response.status(201).json({
        turn: result.turn,
        terninger: result.terninger.map(t => t.getEyes()),
        scores: Object.fromEntries(result.scores)
    });
});

app.post('/terning/lock', (request, response) => {

    const { index, locked } = request.body;

    if (!Number.isInteger(index) || index < 0 || index >= 5 ||
        typeof locked !== "boolean") {
        return response.status(400).json({
            error: "Ugyldig låsning"
        });
    }

    setLockedDice(index, locked);

    response.status(201).json({
        success: true
    });
});



app.listen(port);

console.log("Lytter på port: " + port);

