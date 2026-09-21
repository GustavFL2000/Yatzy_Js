export default class Terning {
    eyes;

    Die(eyes) {
        this.eyes = eyes;
    }

    Die() {
        this.eyes = 6;
    }

    roll() {
        this.eyes = Math.floor(Math.random()*6)+1; // Giver et tilfældigt tal mellem 1 og 6
    }

     getEyes() {
        return this.eyes;
    }
}