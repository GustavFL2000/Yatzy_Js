export default class Terning {
    eyes;

    constructor() {
        this.eyes = 0;
    }

    roll() {
        this.eyes = Math.floor(Math.random()*6)+1; // Giver et tilfældigt tal mellem 1 og 6
    }

     getEyes() {
        return this.eyes;
    }
}