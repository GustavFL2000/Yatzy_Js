
import Rafflekop from "./Rafflekop.js";

export default class Spil {

    constructor() {
        this.rafflekop = new Rafflekop();
        this.lockedScores = new Map();
        this.turn = 0;
        this.lockedDice = new Array(5).fill(false);
        this.antalArray = new Array(7).fill(0);
    }

    // Kaster alle terninger, der ikke er låst.
    kastTerninger() {

        if (this.turn >= 3) {
            return null;
        }

        let terninger = this.rafflekop.getTerninger();

        for (let index = 0; index < terninger.length; index++) {

            if (!this.lockedDice[index]) {
                terninger[index].roll();
            }
        }

        this.turn++;

        this.tælØjne(terninger);

        return {
            terninger: terninger,
            scores: this.getPossibleScores(),
            turn: this.turn
        };
    }

    // Returnerer det aktuelle antal kast.
    getTurn() {
        return this.turn;
    }

    // Nulstiller antal kast efter valg af pointfelt.
    resetTurn() {
        this.turn = 0;
        this.lockedDice.fill(false);
    }

    // Registrerer et valgt pointfelt.
    lockScore(scoreId, scoreValue) {

        if (this.turn === 0 || this.lockedScores.has(scoreId)) {
            return false;
        }

        this.lockedScores.set(scoreId, scoreValue);

        this.resetTurn();

        return true;
    }

    // Låser eller låser en terning op.
    setLockedDice(index, locked) {
        this.lockedDice[index] = locked;
    }

    // Kontrollerer om et pointfelt allerede er valgt.
    isScoreLocked(scoreId) {
        return this.lockedScores.has(scoreId);
    }

    // Returnerer om alle pointfelter er udfyldt.
    isGameOver() {
        return this.lockedScores.size === 15;
    }

    // Returnerer den samlede score.
    getScoreSummary() {

        let scoreViewSum = 0;
        let scoreView2Sum = 0;

        const upperScores = [
            "ones",
            "twos",
            "threes",
            "fours",
            "fives",
            "sixes"
        ];

        for (let [id, score] of this.lockedScores) {

            if (upperScores.includes(id)) {
                scoreViewSum += score;
            } else {
                scoreView2Sum += score;
            }
        }

        let bonus = 0;

        if (scoreViewSum >= 63) {
            bonus = 50;
        }

        return {
            sum: scoreViewSum,
            bonus: bonus,
            total: scoreViewSum + scoreView2Sum + bonus
        };
    }

    // Tæller hvor mange terninger der viser hver øjenværdi.
    tælØjne(terninger) {

        this.antalArray.fill(0);

        for (let terning of terninger) {
            this.antalArray[terning.getEyes()]++;
        }
    }

    upperSectionScore(eyes) {

        if (eyes < 1 || eyes > 6) {
            return 0;
        }

        return this.antalArray[eyes] * eyes;
    }

    onePairScore() {

        for (let i = 6; i >= 1; i--) {
            if (this.antalArray[i] >= 2) {
                return i * 2;
            }
        }

        return 0;
    }

    twoPairScore() {

        let pairsFound = 0;
        let score = 0;

        for (let i = 6; i >= 1; i--) {

            if (this.antalArray[i] >= 2) {
                pairsFound++;
                score += i * 2;

                if (pairsFound === 2) {
                    return score;
                }
            }
        }

        return 0;
    }

    threeOfAKindScore() {

        for (let i = 6; i >= 1; i--) {
            if (this.antalArray[i] >= 3) {
                return i * 3;
            }
        }

        return 0;
    }

    fourOfAKindScore() {

        for (let i = 6; i >= 1; i--) {
            if (this.antalArray[i] >= 4) {
                return i * 4;
            }
        }

        return 0;
    }

    smallStraightScore() {

        for (let i = 1; i <= 5; i++) {
            if (this.antalArray[i] !== 1) {
                return 0;
            }
        }

        return 15;
    }

    largeStraightScore() {

        for (let i = 2; i <= 6; i++) {
            if (this.antalArray[i] !== 1) {
                return 0;
            }
        }

        return 20;
    }

    fullHouseScore() {

        let threeValue = 0;
        let twoValue = 0;

        for (let i = 1; i <= 6; i++) {

            if (this.antalArray[i] === 3) {
                threeValue = i;
            } else if (this.antalArray[i] === 2) {
                twoValue = i;
            }
        }

        if (threeValue > 0 && twoValue > 0) {
            return threeValue * 3 + twoValue * 2;
        }

        return 0;
    }

    chanceScore() {

        let sum = 0;

        for (let i = 1; i <= 6; i++) {
            sum += this.antalArray[i] * i;
        }

        return sum;
    }

    yatzyScore() {

        for (let i = 1; i <= 6; i++) {
            if (this.antalArray[i] === 5) {
                return 50;
            }
        }

        return 0;
    }

    // Beregner alle mulige point ud fra det aktuelle terningkast.
    getPossibleScores() {

        const scores = new Map();

        scores.set("1'ere", this.upperSectionScore(1));
        scores.set("2'ere", this.upperSectionScore(2));
        scores.set("3'ere", this.upperSectionScore(3));
        scores.set("4'ere", this.upperSectionScore(4));
        scores.set("5'ere", this.upperSectionScore(5));
        scores.set("6'ere", this.upperSectionScore(6));

        scores.set("Et par", this.onePairScore());
        scores.set("To par", this.twoPairScore());
        scores.set("3 ens", this.threeOfAKindScore());
        scores.set("4 ens", this.fourOfAKindScore());
        scores.set("Fuldt hus", this.fullHouseScore());
        scores.set("Lille straight", this.smallStraightScore());
        scores.set("Store straight", this.largeStraightScore());
        scores.set("Chance", this.chanceScore());
        scores.set("Yatzy", this.yatzyScore());

        return scores;
    }
}
