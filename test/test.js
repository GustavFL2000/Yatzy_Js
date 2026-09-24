import { expect } from "chai";
import { describe, it } from "mocha";
import { fullHouseScore, tælØjne } from "../src/Logik.js";
import Terning from "../src/Terning.js";

describe("Test logikken", function () {

    it("Bekræfter om en spiller har slået full house", function () {

        const terninger = [
            new Terning(),
            new Terning(),
            new Terning(),
            new Terning(),
            new Terning()
        ];

        terninger[0].eyes = 4;
        terninger[1].eyes = 4;
        terninger[2].eyes = 4;
        terninger[3].eyes = 5;
        terninger[4].eyes = 5;

        tælØjne(terninger);

        const result = fullHouseScore();

        expect(result).to.equal(22);
    });
    
    it("skal give 0 hvis hånden ikke er et full house", function () {

        const terninger = [
            new Terning(),
            new Terning(),
            new Terning(),
            new Terning(),
            new Terning()
        ];

        terninger[0].eyes = 4;
        terninger[1].eyes = 2;
        terninger[2].eyes = 1;
        terninger[3].eyes = 4;
        terninger[4].eyes = 5;

        tælØjne(terninger);

        const result = fullHouseScore();

        expect(result).to.equal(0);
    });

});