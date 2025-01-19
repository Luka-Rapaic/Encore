import {create_game, display_name_menu, join_game, leave_room, register_name, start_game} from "./encore.js";
import {Commands} from "./commands.js";

function setupMenus() {
    document.getElementById("name-menu-button-continue").addEventListener("click", (e) => register_name());

    document.getElementById("main-menu-button-create-game").addEventListener("click", (e) => create_game());
    document.getElementById("main-menu-button-join-game").addEventListener("click", (e) => join_game());
    document.getElementById("main-menu-button-back").addEventListener("click", (e) => display_name_menu());

    document.getElementById("room-menu-button-start-game").addEventListener("click", (e) => start_game());
    document.getElementById("room-menu-button-leave-game").addEventListener("click", (e) => leave_room());
}

function setupBoard() {
    let tiles = document.getElementsByClassName("tile");
    let colorDice = document.getElementsByClassName("color-dye");
    let numberDice = document.getElementsByClassName("number-dye");
    let endTurnBtn = document.getElementById("end-turn-button");

    for (let tile of tiles)
        tile.addEventListener("mousedown", (e) => Commands.selectTile(e.target));
    for (let dye of colorDice)
        dye.addEventListener("mousedown", (e) => Commands.selectDye(e.target));
    for (let dye of numberDice)
        dye.addEventListener("mousedown", (e) => Commands.selectDye(e.target));
    endTurnBtn.addEventListener("mousedown", (e) => Commands.endTurn());
}

setupMenus();
setupBoard();