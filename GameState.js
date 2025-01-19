class GameState {
    static selectedTiles = new Set(); // [x, y]
    static crossedTiles = new Set(); // [x, y, tile]
    static selectedNumber = 0;

    static #chosenColor = "red";
    static #chosenNumber = 4;
    static #dice = null;

    static #canSelectTile = true;
    static #canChooseDice = false;
    static #canThrowDice = false;

    static subscribers = [];

    static get chosenColor() {
        return this.#chosenColor;
    }

    static get chosenNumber() {
        return this.#chosenNumber;
    }

    static get dice() {
        return this.#dice;
    }

    static get canSelectTile() {
        return this.#canSelectTile;
    }

    static get canChooseDice() {
        return this.#canChooseDice;
    }

    static get canThrowDice() {
        return this.#canThrowDice;
    }

    static set chosenColor(chosenColor) {
        this.#chosenColor = chosenColor;

        for (let element of this.selectedTiles) {
            let tile = element[2];
            tile.classList.remove("tile-selected");
        }
        this.selectedTiles.clear();
        this.selectedNumber = 0;
    }

    static set chosenNumber(chosenNumber) {
        this.#chosenNumber = chosenNumber;

        for (let element of this.selectedTiles) {
            let tile = element[2];
            tile.classList.remove("tile-selected");
        }
        this.selectedTiles.clear();
        this.selectedNumber = 0;
    }

    static set dice(dice) {
        this.#dice = dice;
        GameState.notify();
    }

    static set canSelectTile(value) {
        this.#canSelectTile = value;
    }

    static set canChooseDice(value) {
        this.#canChooseDice = value;
        console.log(value);
        GameState.notify();
    }

    static set canThrowDice(value) {
        this.#canThrowDice = value;
        GameState.notify();
    }

    static searchCoords(set, x, y) {
        for (let value of set) {
            if (value[0] === x && value[1] === y) return true;
        }
        return false;
    }

    static deleteCoords(set, x, y) {
        for (let value of set) {
            if (value[0] === x && value[1] === y) {
                set.delete(value);
                break;
            }
        }
    }

    static subscribe(subscriber) {
        this.subscribers.push(subscriber);
    }

    static notify() {
        for (let subscriber of this.subscribers) {
            subscriber.notify();
        }
    }
}

export {GameState}