let terningerArray = [];
let antalArray = new Array(7);

const tælØjne = () => { //Jaja det en hjælpe metode ( tæller hvor mange der er af hver øjenværdi)
    antalArray.fill(0); //Den skal bruges i GUILogik.js køres efter hver gang der kastes en terning
    for (let terning of terningerArray) {
        antalArray[terning.getEyes()]++;
    }
}

export const upperSectionScore = (eyes) => {
    if (eyes < 1 || eyes > 6) return 0;
    return antalArray[eyes] * eyes;
}

export const onePairScore = () => {
    for (let i = 6; i >= 1; i--) {
        if (antalArray[i] >= 2) return i * 2;
    }
    return 0;
}

export const twoPairScore = () => {
    let pairsFound = 0;
    let score = 0;
    for (let i = 6; i >= 1; i--) {
        if (antalArray[i] >= 2) {
            pairsFound++;
            score += i * 2;
            if (pairsFound == 2) return score;
        }
    }
    return 0;
}

export const threeOfAKindScore = () => {
    for (let i = 6; i >= 1; i--) {
        if (antalArray[i] >= 3) return i * 3;
    }
    return 0;
}

export const fourOfAKindScore = () => {
    for (let i = 6; i >= 1; i--) {
        if (antalArray[i] >= 4) return i * 4;
    }
    return 0;
}

export const smallStraightScore = () => {
    for (let i = 1; i <= 5; i++) {
        if (antalArray[i] != 1) return 0;
    }
    return 15;
}

export const largeStraightScore = () => {
    for (let i = 2; i <= 6; i++) {
        if (antalArray[i] != 1) return 0;
    }
    return 20;
}

export const fullHouseScore = () => {
    let threeValue = 0;
    let twoValue = 0;
    for (let i = 1; i <= 6; i++) {
        if (antalArray[i] == 3) threeValue = i;
        else if (antalArray[i] == 2) twoValue = i;
    }
    if (threeValue > 0 && twoValue > 0) {
        return threeValue * 3 + twoValue * 2;
    }
    return 0;
}

export const chanceScore = () => {
    let sum = 0;
    for (let i = 1; i <= 6; i++) {
        sum += antalArray[i] * i;
    }
    return sum;
}

export const yatzyScore = () => {
    for (let i = 1; i <= 6; i++) {
        if (antalArray[i] == 5) return 50;
    }
    return 0;
}



export const getPossibleScores = () =>{
    const scores = new Map();

    scores.set("1'ere", upperSectionScore(1));
    scores.set("2'ere", upperSectionScore(2));
    scores.set("3'ere", upperSectionScore(3));
    scores.set("4'ere", upperSectionScore(4));
    scores.set("5'ere", upperSectionScore(5));
    scores.set("6'ere", upperSectionScore(6));
    scores.set("Et par", onePairScore());
    scores.set("To par", twoPairScore());
    scores.set("3 ens", threeOfAKindScore());
    scores.set("4 ens", fourOfAKindScore());
    scores.set("Lille straight", smallStraightScore());
    scores.set("Store straight", largeStraightScore());
    scores.set("Fuldt hus", fullHouseScore());
    scores.set("Chance", chanceScore());
    scores.set("Yatzy", yatzyScore());

    return scores;
}

