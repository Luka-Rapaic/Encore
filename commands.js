import {GameState} from "./GameState.js";
import {SendMessage} from "./SendMessage.js";
import {ws} from "./encore.js";
import {Dice} from "./Dice.js";

class Commands {
    static selectTile(tile) {
        if (!GameState.canSelectTile) return;

        let x = parseInt(tile.dataset.x);
        let y = parseInt(tile.dataset.y);

        if (GameState.searchCoords(GameState.crossedTiles, x, y)) return;

        if (GameState.searchCoords(GameState.selectedTiles, x, y)) {
            tile.classList.remove("tile-selected");
            GameState.deleteCoords(GameState.selectedTiles, x, y);
            GameState.selectedNumber--;
            return;
        }

        if ((GameState.searchCoords(GameState.crossedTiles, x-1, y) ||
            GameState.searchCoords(GameState.crossedTiles, x+1, y) ||
            GameState.searchCoords(GameState.crossedTiles, x, y-1) ||
            GameState.searchCoords(GameState.crossedTiles, x, y+1) ||
            GameState.searchCoords(GameState.selectedTiles, x-1, y) ||
            GameState.searchCoords(GameState.selectedTiles, x+1, y) ||
            GameState.searchCoords(GameState.selectedTiles, x, y-1) ||
            GameState.searchCoords(GameState.selectedTiles, x, y+1) ||
            x === 7) &&
            GameState.selectedNumber < GameState.chosenNumber &&
            tile.classList.contains("tile-" + GameState.chosenColor)
        ) {
            tile.classList.add("tile-selected");
            GameState.selectedTiles.add([x, y, tile]);
            GameState.selectedNumber++;
        }
    }

    static selectDye(dye) {
        if (GameState.canThrowDice) {
            SendMessage.throwDice(ws);
            GameState.canThrowDice = false;
            return;
        }

        if (GameState.canChooseDice) {
            let index = parseInt(dye.id.substring(3));
            if (index < 3) {
                GameState.chosenColor = GameState.dice[index];
                Dice.selectColor(dye);
            } else if (index < 6) {
                GameState.chosenNumber = GameState.dice[index];
                Dice.selectNumber(dye);
            }
        }
    }

    static endTurn() {
        if (GameState.selectedNumber === GameState.chosenNumber || GameState.selectedNumber === 0) {
            GameState.canSelectTile = false;
            GameState.canChooseDice = false;

            let selectedTiles = [];
            for (let element of GameState.selectedTiles) element.push({x: element[0], y: element[1]});
            SendMessage.endTurn(selectedTiles, GameState.chosenNumber, GameState.chosenColor);
        }
    }
}

window.selectTile = Commands.selectTile;
export {Commands};