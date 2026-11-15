
import {
    kastTerninger,
    getTurn,
    resetTurn,
    lockScore,
    isScoreLocked,
    isGameOver,
    getScoreSummary
} from "./Logik.js";

let rollButton = document.querySelector("#rollKnap");
let turNummer = document.querySelector("#turNummer");

const scoreViews = document.querySelectorAll(".scoreView, .scoreView2");

checkboxDisable();

// Event listener til kast-knappen.
rollButton.addEventListener("click", () => {

    // Stop hvis spilleren har brugt sine tre kast.
    if (getTurn() >= 3) {
        return;
    }

    // Hent information om hvilke terninger der er låst.
    let lockedDice = [];

    for (let index = 0; index < 5; index++) {

        const checkbox = document.querySelector(
            "#box" + (index + 1) + " input"
        );

        lockedDice.push(checkbox.checked);
    }

    // Bed logikken om at kaste terningerne.
    const result = kastTerninger(lockedDice);

    if (result === null) {
        return;
    }

    // Vis terningerne.
    updateTerninger(result.terninger);

    // Vis de mulige point.
    updateScores(result.scores);

    // Efter første kast kan spilleren låse terninger.
    if (getTurn() === 1) {
        checkboxEnable();
    }

    // Opdater visning af antal kast.
    turNummer.innerHTML =
        "<label>Turn " + result.turn + " / 3</label>";
});


// Event listeners til pointfelterne.
scoreViews.forEach(scoreView => {

    scoreView.addEventListener("click", () => {

        // Hent pointværdien fra HTML.
        const scoreValue = scoreView.textContent.trim();

        // Stop hvis der ikke er kastet, feltet allerede er valgt,
        // eller feltet ikke indeholder en pointværdi.
        if (
            getTurn() === 0 ||
            isScoreLocked(scoreView.id) ||
            scoreValue === ""
        ) {
            return;
        }

        // Bed logikken om at registrere det valgte pointfelt.
        const success = lockScore(
            scoreView.id,
            Number(scoreValue)
        );

        if (!success) {
            return;
        }

        // Vis at pointfeltet er låst.
        scoreView.classList.add("locked");

        // Nulstil checkboxes.
        checkboxDisable();

        // Opdater sum, bonus og total.
        updateScore();

        // Vis at en ny tur starter.
        turNummer.innerHTML = "<label>Turn 0 / 3</label>";

        // Nulstil terningbillederne.
        for (let index = 0; index < 5; index++) {

            const felt = document.querySelector(
                "#terning" + (index + 1)
            );

            felt.innerHTML =
                '<p><img src="/images/startTerning.png" ' +
                'alt="Terning med ? øjne" ' +
                'class="terningBillede"></p>';
        }

        // Ryd de pointfelter, der endnu ikke er låst.
        scoreViews.forEach(felt => {

            if (!isScoreLocked(felt.id)) {
                felt.textContent = "";
            }
        });

        // Stop spillet hvis alle pointfelter er valgt.
        if (isGameOver()) {
            document.querySelector("#rollKnap button").disabled = true;
        }

    });
});


// Opdater terningbillederne i HTML.
function updateTerninger(terninger) {

    for (let index = 0; index < terninger.length; index++) {

        const felt = document.querySelector(
            "#terning" + (index + 1)
        );

        const eyes = terninger[index].getEyes();

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

        // Opdater kun pointfelter, der ikke allerede er låst.
        if (!isScoreLocked(id)) {

            document.querySelector("#" + id).textContent =
                scores.get(scoreName);
        }
    }
}


// Opdater sum, bonus og total.
function updateScore() {

    const summary = getScoreSummary();

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
