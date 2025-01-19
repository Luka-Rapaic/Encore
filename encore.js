import {VerifyData} from "./VerifyData.js";
import {ReceiveMessage} from "./ReceiveMessage.js";

let dice = setupDice();
let diceValues = [];
let selectedDice = {};
let unavailableDice = null;

let isOnDiceTurn = false;

let canThrowDice = false;

let disableTiles = true;

let colorDye = null;
let numberDye = null;
let number = null;
let color = null;

let crossedMatrix = setupCrossedMatrix();
let crossedTiles = [];

let selectedTiles = [];
let selectedTilesDOM = [];

let starMatrix = setupStarMatrix();

let columnsDOM = setupColumns();
let colorsDOM = setupColors();

let pointsColorBonus = 0;
let pointsColumnBonus = 0;
let pointsJokerBonus = 8;
let pointsStarPenalty = 30;
let pointsTotal = -30;

let pointsDOM = setupPoints();

const columnRewards = [
    [5, 3, 3, 3, 2, 2, 2, 1, 2, 2, 2, 3, 3, 3, 5],
    [3, 2, 2, 2, 1, 1, 1, 0, 1, 1, 1, 2, 2, 2, 3]
];

const ws = new WebSocket("ws://localhost:8080");
ws.addEventListener("open", () => {
    console.log("The connection is open!");
})

ws.onerror = (error) => {
    console.error('WebSocket error:', error);
};

const nesto = 0;

ws.addEventListener("message", message => {
    console.log(message);
    let data = JSON.parse(message.data);

    switch (data.type) {
        case 0:
            startGame(data);
            break;
        case 208:
            ReceiveMessage.canThrowDice();
            break;
        case 209:
            ReceiveMessage.newDice(data);
            break;
        case 210:
            receiveUsedDice(data);
            break;
        case 211:
            ReceiveMessage.validTurn();
            break;
        case 212:
            ReceiveMessage.invalidTurn();
            break;
        case 213:
            ReceiveMessage.myTurn();
            break;
        case 3:
            receiveNewDice(data);
            break;
        case 5:
            receiveTurnResponse(data);
            break;
        case 5:
            startTurn(data);
            break;
        case 6:
            canThrowDice = true;
            resetDice();
            enableDice();
            break;
        case 7:
            resetDice();
            break;
        case 8:
            crossColumn(data);
            break;
        case 9:
            circleColumn(data);
            break;
        case 10:
            crossColor(data);
            break;
        case 11:
            circleColor(data);
            break;
        case 12:
            winOrLoss(data);
            break;
        case 13:
            handleDraw();
            break;
        case 200:
            update_name();
            break;
        case 203:
            update_clients(data);
            break;
        case 204:
            display_start_button();
            break;
        case 205:
            display_room(data);
            break;
        case 206:
            display_game_window();
            break;
    }
});

function startGame(data) {
    if (data.isOnTurn) {
        enableDice();
        canThrowDice = true;
    } else {
        disableDice();
        canThrowDice = false;
    }
}

function startTurn(data) {
    if (!data.hasOwnProperty("unavailableDice")) return;

    if (data.unavailableDice != null) {
        dice[data.unavailableDice.color].classList.add("unavailable-dye");
        dice[data.unavailableDice.number].classList.add("unavailable-dye");
    }

    unavailableDice = data.unavailableDice;

    disableTiles = false;
    enableDice();
}

function receiveNewDice(data) {
    for (let i = 0; i < 3; i++) {
        dice[i].classList.remove(diceValues[i]);
        diceValues[i] = data.dice[i];
        dice[i].classList.add(diceValues[i]);
    }
    for (let i = 3; i < 6; i++) {
        diceValues[i] = data.dice[i];
        dice[i].innerHTML = diceValues[i];
    }

    disableTiles = false;
}

function receiveUsedDice(data) {
    let indices = VerifyData.usedDice(data);
    for (let index of indices) dice[index].classList.add("unavailable-dye");
}

function receiveTurnResponse(data) {
    if (!data.hasOwnProperty("isValidTurn")) return;

    if (data.isValidTurn === true) {
        clearDyeSelection();
        crossTileSelection();
    } else {
        clearDyeSelection();
        clearTileSelection();

        enableDice();
        disableTiles = false;
    }
}

function setupCrossedMatrix() {
    let crossedMatrix = [];
    for (let i = 0; i < 7; i++) {
        let row = [];
        for (let j = 0; j < 15; j++) {
            row.push(0);
        }
        crossedMatrix.push(row);
    }
    return crossedMatrix;
}

function setupStarMatrix() {
    return [
        [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
        [0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
        [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0]
    ];
}

function setupDice() {
    let dice = [];
    for (let i = 0; i < 6; i++) {
        dice.push(document.getElementById("dye" + i));
    }
    return dice;
}

function setupColumns() {
    let columns = [[], []];

    for (let i = 0; i < 15; i++) {
        columns[0].push(document.getElementById("maxCol" + i));
    }

    for (let i = 0; i < 15; i++) {
        columns[1].push(document.getElementById("col" + i));
    }

    return columns;
}

function setupColors() {
    let colorsDOM = {};
    colorsDOM["colorMax-green"] = document.getElementById("colorMax-green");
    colorsDOM["colorMax-yellow"] = document.getElementById("colorMax-yellow");
    colorsDOM["colorMax-blue"] = document.getElementById("colorMax-blue");
    colorsDOM["colorMax-red"] = document.getElementById("colorMax-red");
    colorsDOM["colorMax-orange"] = document.getElementById("colorMax-orange");
    colorsDOM["color-green"] = document.getElementById("color-green");
    colorsDOM["color-yellow"] = document.getElementById("color-yellow");
    colorsDOM["color-blue"] = document.getElementById("color-blue");
    colorsDOM["color-red"] = document.getElementById("color-red");
    colorsDOM["color-orange"] = document.getElementById("color-orange");

    return colorsDOM;
}

function setupPoints() {
    let pointsDOM = {}
    pointsDOM.colorBonus = document.getElementById("colorBonus");
    pointsDOM.columnBonus = document.getElementById("columnBonus");
    pointsDOM.jokerBonus = document.getElementById("jokerBonus");
    pointsDOM.starPenalty = document.getElementById("starPenalty");
    pointsDOM.pointTotal = document.getElementById("pointsTotal");
    return pointsDOM;
}

function clearDyeSelection() {
    dice[selectedDice.color].classList.remove("selected-dye");
    dice[selectedDice.number].classList.remove("selected-dye");

    selectedDice = {};
    colorDye = null;
    color = null;
    numberDye = null;
    number = null;
}

function clearTileSelection() {
    for (let tile of selectedTilesDOM) {
        tile.classList.remove("tile-selected");
    }

    selectedTiles = [];
    selectedTilesDOM = [];
}

function crossTileSelection() {
    for (let tile of selectedTilesDOM) {
        tile.classList.remove("tile-selected");
        tile.classList.add("tile-crossed");
    }

    let cnt = 0;
    for (let tile of selectedTiles) {
        if (starMatrix[tile.y][tile.x]) cnt++;
    }
    updateStarPenalty(cnt);

    crossedTiles.push(...selectedTiles);
    selectedTiles = [];
    selectedTilesDOM = [];
}

function disableDice() {
    for (let dye of dice) dye.classList.add("disabled-dye");
}

function enableDice() {
    for (let dye of dice) dye.classList.remove("disabled-dye");
}

function resetDice() {
    for (let i = 0; i < 3; i++) {
        dice[i].classList.remove(diceValues[i]);
    }
    for (let i = 3; i < 6; i++) {
        dice[i].innerHTML = "";
    }

    if (unavailableDice != null) {
        dice[unavailableDice.color].classList.remove("unavailable-dye");
        dice[unavailableDice.number].classList.remove("unavailable-dye");
        unavailableDice = null;
    }

    selectedDice = {};
    colorDye = null;
    color = null;
    numberDye = null;
    number = null;
}

function crossColumn(data) {
    if (!data.hasOwnProperty("column") || !data.hasOwnProperty("maxPoints")) return;

    if (data.maxPoints) {
        columnsDOM[0][data.column].classList.add("tile-crossed");
    } else {
        columnsDOM[1][data.column].classList.add("tile-crossed");
    }

    updateColumnBonus(data.column, data.maxPoints);
}

function circleColumn(data) {
    if (!data.hasOwnProperty("column")) return;

    columnsDOM[0][data.column].classList.add("tile-circled");
}

function crossColor(data) {
    if (!data.hasOwnProperty("color") || !data.hasOwnProperty("maxPoints")) return;

    if (data.maxPoints) {
        colorsDOM["colorMax-" + data.color].classList.add("tile-crossed");
    } else {
        colorsDOM["color-" + data.color].classList.add("tile-crossed");
    }

    updateColorBonus(data.maxPoints);
}

function circleColor(data) {
    if (!data.hasOwnProperty("color")) return;

    colorsDOM["colorMax-" + data.color].classList.add("tile-circled");
}

function updateTotalPoints() {
    pointsTotal = pointsColorBonus + pointsColumnBonus + pointsJokerBonus - pointsStarPenalty;
    pointsDOM.pointTotal.innerHTML = "T = " + pointsTotal;
}

function updateColorBonus(maxPoints) {
    if (maxPoints) pointsColorBonus = pointsColorBonus + 5;
    else pointsColorBonus = pointsColorBonus + 3;
    pointsDOM.colorBonus.innerHTML = "B = " + pointsColorBonus;
    updateTotalPoints();
}

function updateColumnBonus(column, maxPoints) {
    if (maxPoints) pointsColumnBonus = pointsColumnBonus + columnRewards[0][column];
    else pointsColumnBonus = pointsColumnBonus + columnRewards[1][column];
    pointsDOM.columnBonus.innerHTML = "A-0 + " + pointsColumnBonus;
    updateTotalPoints();
}

function updateJokerBonus(points) {
    pointsJokerBonus = pointsJokerBonus - points;
    pointsDOM.jokerBonus.innerHTML = "!(+1) + " + pointsJokerBonus;
    updateTotalPoints();
}

function updateStarPenalty(stars) {
    pointsStarPenalty = pointsStarPenalty - stars * 2;
    pointsDOM.starPenalty.innerHTML = "S(-2) - " + pointsStarPenalty;
    updateTotalPoints();
}

function winOrLoss(data) {
    if (!data.hasOwnProperty("won")) return;
    if (data.won) {
        alert("CONGRATULATIONS! :) You won!");
    } else {
        alert("Condolences :( You lost...")
    }
}

function handleDraw() {
    alert("Congratulations! You are all winners!");
}

const NAME_MENU = document.getElementById("name_menu");
const NAME_INPUT = document.getElementById("name_input");
const MAIN_MENU = document.getElementById("main-menu");
const JOIN_INPUT = document.getElementById("join-input");
const ROOM_MENU = document.getElementById("room-menu");
const ROOM_ID = document.getElementById("room_id")
const ROOM_CLIENTS = document.getElementById("room_clients");
const ROOM_START = document.getElementById("room-menu-button-start-game");
const GAME_WINDOW = document.getElementById("game-window");

export function display_name_menu() {
    MAIN_MENU.classList.add("hidden");
    NAME_MENU.classList.remove("hidden");
}

//TYPE 100
export function register_name() {
    let name = NAME_INPUT.value;
    let message = {type: 100, name: name}
    ws.send(JSON.stringify(message));
}

//TYPE 101
export function create_game() {
    let message = {type: 101};
    ws.send(JSON.stringify(message));
}

//TYPE 102
export function join_game() {
    let roomID = JOIN_INPUT.value;

    let message = {type: 102, roomID: roomID};
    ws.send(JSON.stringify(message));
}

//TYPE 103
export function leave_room() {
    if (!ROOM_START.classList.contains("hidden")) ROOM_START.classList.add("hidden");
    ROOM_MENU.classList.add("hidden");
    MAIN_MENU.classList.remove("hidden");

    let message = {type: 103};
    ws.send(JSON.stringify(message));
}

//TYPE 104
export function start_game() {
    let message = {type: 104}
    ws.send(JSON.stringify(message));
}


//RECEIVED MESSAGES
//TYPE 200
function update_name() {
    NAME_MENU.classList.add("hidden");
    MAIN_MENU.classList.remove("hidden");
}

//TYPE 203
function update_clients(data) {
    if (!data.hasOwnProperty("clients")) return;
    ROOM_CLIENTS.innerHTML = "";

    let clients = data.clients;
    for (let client of clients) {
        let node = document.createElement("h2");
        node.innerHTML = client;
        ROOM_CLIENTS.appendChild(node);
    }
}

//TYPE 204
function display_start_button() {
    ROOM_START.classList.remove("hidden");
}

//TYPE 205
function display_room(data) {
    if (!data.hasOwnProperty("id")) return;
    ROOM_ID.innerHTML = data.id;

    MAIN_MENU.classList.add("hidden");
    ROOM_MENU.classList.remove("hidden");
}

//TYPE 206
function display_game_window() {
    ROOM_MENU.classList.add("hidden");
    GAME_WINDOW.classList.remove("hidden");
}

export {ws};