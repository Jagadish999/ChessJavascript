let playerId = "";
let playerColor = "";
let fenPosition = "";

let yourRemainingTime = 0;
let opponentRemainingTime = 0;

let yourTimeInterval;

let timeOver = false;

let chessBoardArray = new Array(64);
let piecesMoveDetectionArray = new Array(120);

let opponentPieceMovements = [];
let yourPieceMovements = [];

let clickedPieceDetails = null;
let movedSquare;

let castelDetails = {};

let check = false;
let checkmate = false;
let stalemate = false;