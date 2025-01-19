import {VerifyData} from "./VerifyData.js";
import {GameState} from "./GameState.js";

class ReceiveMessage {

    static canThrowDice() {
        GameState.canThrowDice = true;
    }

    static newDice(data) {
        GameState.dice = VerifyData.newDice(data);
    }

    static myTurn() {
        GameState.canChooseDice = true;
    }

    static validTurn() {
        for (let element of GameState.selectedTiles) {
            element[2].classList.remove("tile-selected");
            element[2].classList.add("tile-crossed");
            GameState.crossedTiles.add([element[0], element[1]]);
        }
        GameState.chosenColor = null;
        GameState.chosenNumber = null;
    }

    static invalidTurn() {
        GameState.chosenColor = null;
        GameState.chosenNumber = null;
        GameState.canChooseDice = true;
        GameState.canSelectTile = true;
    }

}

export {ReceiveMessage};