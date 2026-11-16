import express, { request, response } from 'express';
const app = express();

app.use(express.json());

let port = 8000;

app.listen(port);
console.log("Lytter på port: " + port);

async function get(url) {
    const respons = await fetch(url);
    if (respons.status !== 200) // OK
        throw new Error(respons.status);
    return await respons.json();
}

async function post(url, objekt) {
    const respons = await fetch(url, {
        method: "POST",
        body: JSON.stringify(objekt),
        headers: { 'Content-Type': 'application/json' }
    });

    if (respons.status !== 201)
        throw new Error(respons.status);

    return true;
}

app.post('/terning', (request, response) => {

    const lockedDice = request.body.lockedDice;

    const result = kastTerninger(lockedDice);

    if (result === null) {
        return response.status(400).json({
            error: "Ingen kast tilbage"
        });
    }

    response.status(200).json({
        turn: result.turn,
        terninger: result.terninger.map(t => t.getEyes()),
        scores: Object.fromEntries(result.scores)
    });
});



