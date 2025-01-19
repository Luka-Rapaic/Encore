import {ws} from "./encore.js";

class SendMessage {
    static throwDice() {
        let message = {type: 105};
        ws.send(JSON.stringify(message));
    }

    static endTurn(selectedTiles, chosenNumber, chosenColor) {
        let message =
            {type: 106, selectedTiles: selectedTiles, selectedDice: {number: chosenNumber, color: chosenColor}};
        ws.send(JSON.stringify(message));
    }
}

export {SendMessage}