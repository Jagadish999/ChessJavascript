/*
Assumed that this api will be received from server
*/
let apiObject = {
    fenPosition : "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
    playerWhite : "Jagadish Parajuli",
    playerBlack : "Surab Parajuli",
    whiteTimeRemaining : 300000,
    blackTimeRemaining : 500000,
    castelDetails : {

        whiteKingMoved : false,
        whiteKingChecked : false,

        whiteKingSideRookMoved : false,
        whiteKingSideRookCaptured : false,
        whiteKingSideSquaresChecked : false,
        whiteQueenSideRookMoved : false,
        whiteQueenSideRookCaptured : false,
        whiteQueenSideSquaresChecked: false,

        blackKingMoved : false,
        blackKingChecked : false,

        blackKingSideRookMoved : false,
        blackKingSideRookCaptured : false,
        blackKingSideSquaresChecked : false,
        blackQueenSideRookMoved : false,
        blackQueenSideRookCaptured : false,
        blackQueenSideSquaresChecked : false
    }
}

console.log(apiObject.fenPosition.split("/"));

function fillNewFenPosition(newfenPos, castelInfos){

    const whiteTimeRemaining = playerColor == 'w' ? yourRemainingTime : opponentRemainingTime;
    const blackTimeRemaining = playerColor == 'w' ? opponentRemainingTime : yourRemainingTime;

    apiObject = {
        fenPosition : newfenPos,
        playerWhite : "Jagadish Parajuli",
        playerBlack : "Nishedh Karki",
        whiteTimeRemaining : whiteTimeRemaining,
        blackTimeRemaining : blackTimeRemaining,
        castelDetails : castelInfos
    }
}