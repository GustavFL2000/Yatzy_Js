import Rafflekop from "./Rafflekop.js";


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