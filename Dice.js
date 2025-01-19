import {GameState} from "./GameState.js";

class Dice {
    static dice = [document.getElementById("dye0"),
        document.getElementById("dye1"),
        document.getElementById("dye2"),
        document.getElementById("dye3"),
        document.getElementById("dye4"),
        document.getElementById("dye5")];

    static selectedColor = null;
    static selectedNumber = null;
    static #areEnabled = false;

    static {
        GameState.subscribe(this);
        this.disable();
    }

    static get areEnabled() {
        return this.#areEnabled;
    }

    static set areEnabled(value) {
        console.log("areEnabled");
        console.log(this.areEnabled)
        console.log("value");
        console.log(value);
        if (this.#areEnabled === value) return;
        if (value === true) this.enable();
        else this.disable();
        this.#areEnabled = value;
    }

    static setDice(dice) {
        if (dice === null) return;

        for (let i = 0; i < 3; i++) {
            this.dice[i].classList.remove(this.dice[i].classList.item(-1));
            this.dice[i].classList.add(dice[i]);
        }

        for (let i = 3; i < 6; i++) {
            this.dice[i].innerHTML = dice[i];
        }
    }

    static selectColor(dye) {
        if (this.selectedColor !== null)
            this.selectedColor.classList.remove("selected-dye");

        if (dye !== null) dye.classList.add("selected-dye");
        this.selectedColor = dye;
    }

    static selectNumber(dye) {
        if (this.selectedNumber !== null)
            this.selectedNumber.classList.remove("selected-dye");

        if (dye !== null) dye.classList.add("selected-dye");
        this.selectedNumber = dye;
    }

    static disable() {
        for (let dye of this.dice) dye.classList.add("disabled-dye");
        this.selectColor(null);
        this.selectNumber(null);
    }

    static enable() {
        for (let dye of this.dice) dye.classList.remove("disabled-dye");
    }

    static notify() {
        this.setDice(GameState.dice);
        this.areEnabled = GameState.canChooseDice || GameState.canThrowDice;
    }
}

export {Dice};
