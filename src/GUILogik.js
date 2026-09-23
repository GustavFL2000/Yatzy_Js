import Rafflekop from "./Rafflekop.js";
import { tælØjne, getPossibleScores } from "./Logik.js";

let rafflekop = new Rafflekop();

let rollButton = document.querySelector("#rollKnap");
let turn = 0;

checkboxDisable();

rollButton.addEventListener("click", () => {
    // Stop funktionen, hvis de tre kast er brugt.
    if (turn >= 3) {
        return;
    }

    updateTerninger();
    turn++;

    // Efter første kast må spilleren holde terninger.
    if (turn === 1) {
        checkboxEnable();
    }

    let turNummer = document.querySelector("#turNummer");
    turNummer.innerHTML =
        "<label>Turn " + turn + " / 3</label>";
});

scoreView.addEventListener("click", () => {
    //TODO
    //Man skal kunne klikke på hver scoreView hvert scoreView har også eget ID
});



function updateTerninger() {
    const slag = rafflekop.getTerninger();

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
    document.querySelector("#ones").textContent = scores.get("1'ere");
    document.querySelector("#twos").textContent = scores.get("2'ere");
    document.querySelector("#threes").textContent = scores.get("3'ere");
    document.querySelector("#fours").textContent = scores.get("4'ere");
    document.querySelector("#fives").textContent = scores.get("5'ere");
    document.querySelector("#sixes").textContent = scores.get("6'ere");

    document.querySelector("#sum").textContent = scores.get("upperSectionScore"); // Hvordan updatere vi sum

    if ("#sum".textContent > 63) {
        document.querySelector("#bonus").textContent = scores.get(50); //Hvordan updatere vi bonus
    }

    document.querySelector("#onePair").textContent = scores.get("Et par");
    document.querySelector("#twoPairs").textContent = scores.get("To par");
    document.querySelector("#threeSame").textContent = scores.get("3 ens");
    document.querySelector("#fourSame").textContent = scores.get("4 ens");
    document.querySelector("#fullHouse").textContent = scores.get("Fuldt hus");
    document.querySelector("#smallStraight").textContent = scores.get("Lille straight");
    document.querySelector("#largeStraight").textContent = scores.get("Store straight");
    document.querySelector("#chance").textContent = scores.get("Chance");
    document.querySelector("#yatzy").textContent = scores.get("Yatzy");

    document.querySelector("#total").textContent = scores.get(""); // Vi mangler at updatere total
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

//TODO
//Beregn sum
//Lås felter med værdi + til total og disable efterfølgende
//