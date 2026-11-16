import express from 'express';
import cors from 'cors'
import { kastTerninger } from './Logik.js';
const app = express();

app.use(express.json());
app.use(cors());

let port = 8000;

app.get('/test', (request, response) => {
    console.log('test');
    response.sendStatus(200);
});

app.post('/terning', (request, response) => {

    const lockedDice = request.body.lockedDice;

    const result = kastTerninger(lockedDice);

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

app.listen(port);

console.log("Lytter på port: " + port);

