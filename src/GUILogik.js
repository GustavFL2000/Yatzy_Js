import Rafflekop from "./Rafflekop.js";
import { tælØjne, getPossibleScores } from "./Logik.js";

let rafflekop = new Rafflekop();
let lockedScores = new Set();

let rollButton = document.querySelector("#rollKnap");
let turn = 0;

const scoreViews = document.querySelectorAll(".scoreView, .scoreView2");

checkboxDisable();

rollButton.addEventListener("click", () => {
    // Stop funktionen, hvis de tre kast er brugt.
    if (turn >= 3) {
        return;
    }

    updateTerninger();
    turn++;

    // Efter forste kast m spilleren holde terninger.
    if (turn === 1) {
        checkboxEnable();
    }

    let turNummer = document.querySelector("#turNummer");
    turNummer.innerHTML =
        "<label>Turn " + turn + " / 3</label>";
});

scoreViews.forEach(scoreView => {
    scoreView.addEventListener("click", () => {


        if (turn === 0 || lockedScores.has(scoreView.id) || scoreView.textContent.trim === "") {
            return;
        }

        lockedScores.add(scoreView.id);
        scoreView.classList.add("locked");

        //console.log(scoreView.id + " er låst med værdien " + scoreView.textContent);
        checkboxDisable();
        updateScore();

        turn = 0;
        turNummer.innerHTML = "<label>Turn " + turn + " / 3</label>";

        for (let index = 0; index < 5; index++) {
            const felt = document.querySelector("#terning" + (index + 1));
            felt.innerHTML = '<p><img src="./images/startTerning.png" alt="Terning med ? øjne" class="terningBillede"></p>'
        }

        scoreViews.forEach((felt) => {
            if (!lockedScores.has(felt.id)) {
                felt.textContent = "";
            }
        });

        if (lockedScores.size === scoreViews.length) {
            document.querySelector("#rollKnap button").disabled = true;
        }

    });
});

function updateTerninger() {
    let slag = rafflekop.getTerninger();

    for (let index = 0; index < slag.length; index++) {
        const checkbox = document.querySelector(
            "#box" + (index + 1) + " input"
        );

        // Kun ulåste terninger får en ny værdi.
        if (!checkbox.checked) {
            slag[index].roll();
        }

        // Vis altid terningens faktiske værdi.
        const felt = document.querySelector("#terning" + (index + 1));
        const eyes = slag[index].getEyes();

        felt.innerHTML =
            '<img src="./images/terning ' + eyes + '.png" ' +
            'alt="Terning med ' + eyes + ' øjne" class="terningBillede">';
    }

    updateScores(slag);
}

function updateScores(slag) {
    tælØjne(slag);
    const scores = getPossibleScores();

    if (!lockedScores.has("ones")) {
        document.querySelector("#ones").textContent = scores.get("1'ere");
    }

    if (!lockedScores.has("twos")) {
        document.querySelector("#twos").textContent = scores.get("2'ere");
    }

    if (!lockedScores.has("threes")) {
        document.querySelector("#threes").textContent = scores.get("3'ere");
    }

    if (!lockedScores.has("fours")) {
        document.querySelector("#fours").textContent = scores.get("4'ere");
    }

    if (!lockedScores.has("fives")) {
        document.querySelector("#fives").textContent = scores.get("5'ere");
    }

    if (!lockedScores.has("sixes")) {
        document.querySelector("#sixes").textContent = scores.get("6'ere");
    }

    if (!lockedScores.has("onePair")) {
        document.querySelector("#onePair").textContent = scores.get("Et par");
    }

    if (!lockedScores.has("twoPairs")) {
        document.querySelector("#twoPairs").textContent = scores.get("To par");
    }

    if (!lockedScores.has("threeSame")) {
        document.querySelector("#threeSame").textContent = scores.get("3 ens");
    }

    if (!lockedScores.has("fourSame")) {
        document.querySelector("#fourSame").textContent = scores.get("4 ens");
    }

    if (!lockedScores.has("fullHouse")) {
        document.querySelector("#fullHouse").textContent = scores.get("Fuldt hus");
    }

    if (!lockedScores.has("smallStraight")) {
        document.querySelector("#smallStraight").textContent = scores.get("Lille straight");
    }

    if (!lockedScores.has("largeStraight")) {
        document.querySelector("#largeStraight").textContent = scores.get("Store straight");
    }

    if (!lockedScores.has("chance")) {
        document.querySelector("#chance").textContent = scores.get("Chance");
    }

    if (!lockedScores.has("yatzy")) {
        document.querySelector("#yatzy").textContent = scores.get("Yatzy");
    }
}

function checkboxDisable() {
    for (let index = 0; index < 5; index++) {
        const checkbox = document.querySelector(
            "#box" + (index + 1) + " input"
        );

        checkbox.checked = false;
        checkbox.disabled = true;
    }
}

function checkboxEnable() {
    for (let index = 0; index < 5; index++) {
        const checkbox = document.querySelector(
            "#box" + (index + 1) + " input"
        );

        checkbox.disabled = false;
    }
}

function updateScore() {
    let scoreViewSum = 0;
    let scoreView2Sum = 0;

    document.querySelectorAll(".scoreView").forEach((felt) => {
        if (lockedScores.has(felt.id)) {
            scoreViewSum += Number(felt.textContent)
        }
    });

    document.querySelectorAll(".scoreView2").forEach((felt) => {
        if (lockedScores.has(felt.id)) {
            scoreView2Sum += Number(felt.textContent)
        }
    });


    let bonus = 0;
    if (scoreViewSum >= 63) {
        bonus = 50;
    }

    document.querySelector("#sum").textContent = scoreViewSum;
    document.querySelector("#bonus").textContent = bonus;
    document.querySelector("#total").textContent = scoreViewSum + scoreView2Sum + bonus;
}
