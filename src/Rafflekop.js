import Terning from "./Terning.js";
export default class Rafflekop{
    terninger = [];
    længde = 5;

    constructor(){
        for(let i = 0; i< this.længde; i++){
            this.terninger[i] = new Terning();
        }
    }

    kastTerning(){
        for(let terning of this.terninger){
            terning.roll();
        }
    }

    getTerninger(){
        return this.terninger;
    }
    
}