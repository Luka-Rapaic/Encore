import {InvalidMessageError} from "./Errors.js";

export class VerifyData {
    static validColors = new Set(["green", "red", "blue", "yellow", "orange"]);

    static newDice(data) {
        if (!data.hasOwnProperty("dice")) throw new InvalidMessageError();
        if (!data.dice instanceof Array) throw new InvalidMessageError();
        for (let i = 0; i < 3; i++) if (!data.dice[i] instanceof String || !this.validColors.has(data.dice[i]))
            throw new InvalidMessageError();
        for (let i = 3; i < 6; i++) if (!data.dice[i] instanceof Number || data.dice[i] < 1 || data.dice[i] > 6)
            throw new InvalidMessageError();
        return data.dice;
    }

    static usedDice(data) {
        if (!data.hasOwnProperty("indices")) throw new InvalidMessageError();
        if (!data.indices instanceof Array) throw new InvalidMessageError();
        if (data.indices.length > 2) throw new InvalidMessageError();
        return data.indices;
    }
}