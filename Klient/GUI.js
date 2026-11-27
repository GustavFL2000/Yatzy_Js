
import {
    kastTerninger,
    setLockedDice,
    isScoreLocked,
    lockScore,
    isGameOver,
    getTurn,
    getScoreSummary,
    getSpillere,
    sendAktiv,
    restartGame
} from "./Facade.js";

let rollButton = document.querySelector("#rollKnap");
let genstartButton = document.querySelector("#genstart");
let turNummer = document.querySelector("#turNummer");

const scoreViews = document.querySelectorAll(".scoreView, .scoreView2");

let currentTurn = 0;
let pendingLocks = 0;
let rolling = false;

checkboxDisable();

// Event listener til kast-knappen.
rollButton.addEventListener("click", async () => {

    // Stop hvis spilleren har brugt sine tre kast,
    // eller hvis serveren stadig behandler en request.
    if (currentTurn >= 3 || rolling || pendingLocks > 0) {
        return;
    }

    rolling = true;
    document.querySelector("#rollKnap button").disabled = true;

    try {
        // Bed serveren om at kaste terningerne.
        const result = await kastTerninger();

        currentTurn = result.turn;

        // Vis terningerne.
        updateTerninger(result.terninger);

        // Vis de mulige point.
        updateScores(result.scores);

        // Efter første kast kan spilleren låse terninger.
        if (result.turn === 1) {
            checkboxEnable();
        }

        // Opdater visning af antal kast.
        turNummer.innerHTML =
            "<label>Turn " + result.turn + " / 3</label>";

    } catch (error) {
        console.error("Fejl ved kast:", error);

    } finally {
        rolling = false;

        if (currentTurn < 3 && pendingLocks === 0) {
            document.querySelector("#rollKnap button").disabled = false;
        }
    }
});

// Event listener til genstartknap
genstartButton.addEventListener("click", async () => {
    try {
        await restartGame();

        resetTurnGUI();

        // Ryd og lås alle pointfelter op.
        scoreViews.forEach(felt => {
            felt.classList.remove("locked");
            felt.textContent = "";
        });

        await updateScore();

        document.querySelector("#rollKnap button").disabled = false;
        document.querySelector("#genstart button").disabled = true;

    } catch (error) {
        console.error("Fejl ved restart:", error);
    }
});

// Event listeners til checkboxene.
for (let index = 0; index < 5; index++) {

    const checkbox = document.querySelector(
        "#box" + (index + 1) + " input"
    );

    checkbox.addEventListener("change", async () => {

        const locked = checkbox.checked;

        pendingLocks++;
        checkbox.disabled = true;
        document.querySelector("#rollKnap button").disabled = true;

        try {
            // Send låsningen gennem facaden til serveren.
            await setLockedDice(index, locked);

        } catch (error) {
            // Gendan checkboxen, hvis serveren afviser.
            checkbox.checked = !locked;
            console.error("Fejl ved låsning:", error);

        } finally {
            pendingLocks--;

            if (currentTurn > 0 && currentTurn < 3) {
                checkbox.disabled = false;
            }

            if (pendingLocks === 0 && !rolling && currentTurn < 3) {
                document.querySelector("#rollKnap button").disabled = false;
            }
        }
    });
}

function resetTurnGUI() {
    currentTurn = 0;

    checkboxDisable();

    turNummer.innerHTML = "<label>Turn 0 / 3</label>";

    for (let index = 0; index < 5; index++) {
        const felt = document.querySelector(
            "#terning" + (index + 1)
        );

        felt.innerHTML =
            '<p><img src="/images/startTerning.png" ' +
            'alt="Terning med ? øjne" ' +
            'class="terningBillede"></p>';
    }
}

// Event listeners til pointfelterne.
// Mangler endpoints til lockScore,,
// getScoreSummary og isGameOver.

scoreViews.forEach(scoreView => {

    scoreView.addEventListener("click", async () => {

        const scoreValue = scoreView.textContent.trim();

        if (
            await getTurn() === 0 ||
            await isScoreLocked(scoreView.id) ||
            scoreValue === ""
        ) {
            return;
        }

        const success = await lockScore(
            scoreView.id,
            Number(scoreValue)
        );

        if (!success) {
            return;
        }

        scoreView.classList.add("locked");

        resetTurnGUI();

        await updateScore();

        // Ryd kun pointfelter, der ikke er låst.
        scoreViews.forEach(felt => {
            if (!felt.classList.contains("locked")) {
                felt.textContent = "";
            }
        });

        const gameover = await isGameOver();

        document.querySelector("#rollKnap button").disabled = gameover;
        document.querySelector("#genstart button").disabled = !gameover;
    });
});

// Opdater terningbillederne i HTML.
function updateTerninger(terninger) {

    for (let index = 0; index < terninger.length; index++) {

        const felt = document.querySelector(
            "#terning" + (index + 1)
        );

        // Serveren returnerer tal, ikke Terning-objekter.
        const eyes = terninger[index];

        felt.innerHTML =
            '<img src="/images/terning ' + eyes + '.png" ' +
            'alt="Terning med ' + eyes + ' øjne" ' +
            'class="terningBillede">';
    }
}

// Opdater de mulige point i HTML.
function updateScores(scores) {

    const scoreMapping = {
        ones: "1'ere",
        twos: "2'ere",
        threes: "3'ere",
        fours: "4'ere",
        fives: "5'ere",
        sixes: "6'ere",
        onePair: "Et par",
        twoPairs: "To par",
        threeSame: "3 ens",
        fourSame: "4 ens",
        fullHouse: "Fuldt hus",
        smallStraight: "Lille straight",
        largeStraight: "Store straight",
        chance: "Chance",
        yatzy: "Yatzy"
    };

    for (const [id, scoreName] of Object.entries(scoreMapping)) {

        const felt = document.querySelector("#" + id);

        // Opdater kun pointfelter, der ikke allerede er låst.
        // Tidligere: if (!isScoreLocked(id))
        if (!felt.classList.contains("locked")) {

            // Serveren returnerer et JSON-objekt, ikke et Map.
            felt.textContent = scores[scoreName];
        }
    }
}

// Opdater sum, bonus og total.
// Mangler endpoint til getScoreSummary.

async function updateScore(){

    const summary = await getScoreSummary();

    document.querySelector("#sum").textContent = summary.sum;

    document.querySelector("#bonus").textContent = summary.bonus;

    document.querySelector("#total").textContent = summary.total;
}

// Deaktiver checkboxes og fjern deres markering.
function checkboxDisable() {

    for (let index = 0; index < 5; index++) {

        const checkbox = document.querySelector(
            "#box" + (index + 1) + " input"
        );

        checkbox.checked = false;
        checkbox.disabled = true;
    }
}

// Aktiver checkboxes efter første kast.
function checkboxEnable() {

    for (let index = 0; index < 5; index++) {

        const checkbox = document.querySelector(
            "#box" + (index + 1) + " input"
        );

        checkbox.disabled = false;
    }
}

const spillerListe = document.querySelector("#spillerListe");

async function opdaterSpillerListe() {

    try {
        const spillere = await getSpillere();

        spillerListe.innerHTML = "";

        for (const spiller of spillere) {

            const række = document.createElement("tr");

            const navn = document.createElement("td");
            navn.textContent = spiller.navn;

            const point = document.createElement("td");
            point.textContent = spiller.point;

            række.appendChild(navn);
            række.appendChild(point);

            spillerListe.appendChild(række);
        }

    } catch (error) {
        console.error("Kunne ikke hente spillere:", error);
    }
}

async function aktivitet() { //Bruger send aktiv fra facade
    try {
        await sendAktiv(); //Kalder denne fra facade
    } catch (error) {
        console.error("Aktivitet fejlede", error);
    }
}

aktivitet(); //Vi kalder den lokale funktion 

setInterval(aktivitet, 5000); //Vi kalder aktivitet fucktionen en gang hver 5 sekund

opdaterSpillerListe(); //Vi kalder den lokal funktion 

setInterval(opdaterSpillerListe, 2000); //Vi kalder opdadetspilerliste hver 2 sekund
