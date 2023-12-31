const moveAudio = new Audio('Sounds/move.mp3');
const captureAudio = new Audio('Sounds/Capture.mp3');
const checkAudio = new Audio('Sounds/Check.mp3');
const castlingAudio = new Audio('Sounds/Castling.mp3');
const checkmateAudio = new Audio('Sounds/Checkmate.mp3');
const drawAudio = new Audio('Sounds/Draw.mp3');

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