import Rafflekop from "./Rafflekop.js";
import { tælØjne, getPossibleScores } from "./Logik.js";

let rollButton = document.querySelector("#rollKnap");
let turn = 0;

rollButton.addEventListener("click", () => {
    let turNummer = document.querySelector("#turNummer");

    if (turn < 3) {
        updateTerninger()
        turn++;
        turNummer.innerHTML = "<label>" + 'Turn ' + turn + " / 3" + "</label>"
    }
});

function updateTerninger() {
    let rafflekop = new Rafflekop();
    rafflekop.kastTerning();

    let slag = rafflekop.getTerninger();

    updateScores(slag);

    let terning1 = document.querySelector("#terning1");
    terning1.innerHTML = "<p>" + slag[0].getEyes() + "</p>";

    let terning2 = document.querySelector("#terning2");
    terning2.innerHTML = "<p>" + slag[1].getEyes() + "</p>";

    let terning3 = document.querySelector("#terning3");
    terning3.innerHTML = "<p>" + slag[2].getEyes() + "</p>";

    let terning4 = document.querySelector("#terning4");
    terning4.innerHTML = "<p>" + slag[3].getEyes() + "</p>";

    let terning5 = document.querySelector("#terning5");
    terning5.innerHTML = "<p>" + slag[4].getEyes() + "</p>";
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
    document.querySelector("#sum").textContent = scores.get(""); //Hvordan updatere vi sum
    document.querySelector("#bonus").textContent = scores.get(""); //Hvordan updatere vi bonus
    document.querySelector("#onePair").textContent = scores.get("Et par");
    document.querySelector("#twoPairs").textContent = scores.get("To par");
    document.querySelector("#threeSame").textContent = scores.get("3 ens");
    document.querySelector("#fourSame").textContent = scores.get("4 ens");
    document.querySelector("#fullHouse").textContent = scores.get("Fuldt hus");
    document.querySelector("#smallStraight").textContent = scores.get("Lille straight");
    document.querySelector("#largeStraight").textContent = scores.get("Store straight");
    document.querySelector("#chance").textContent = scores.get("Chance");
    document.querySelector("#yatzy").textContent = scores.get("Yatzy");
}