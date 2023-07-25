//suppose game starts by receiving API apiObject

function main(){

    //Extract Required information from api
    loadRequiredGlobals();

    //show board in browser
    boardSetup();

    //Remaining time 
    updateRemainingTime();

    //checkStatus
    checkGameStatus();
}

function checkGameStatus(){

    if(timeOver || checkmate || stalemate){
        boardSetup();
        setGameStatusMessages();
    }
    else{
        //obj for filling chessBoardArray and piecesMoveDetectionArray
        const chessBoardArrayFillerObj = new ChessBoardArrayFiller(fenPosition);

        chessBoardArray = chessBoardArrayFillerObj.fillChessBoardArray();
        piecesMoveDetectionArray = chessBoardArrayFillerObj.fillPiecesMoveDetectionArray(chessBoardArray);
        // console.log(chessBoardArray);
        //_________________________________________________________________________________________________

        //obj for filtering the moves
        const gameStatusCheckerObj = new GameStatusChecker();
        const filterMovesObj = new FilterMoves(gameStatusCheckerObj, playerColor, chessBoardArray, piecesMoveDetectionArray, fenPosition, apiObject.castelDetails);

        const legalMovesCaptures = filterMovesObj.filteredMoves();
        
        //Assumming these moves are filtered
        //Filter moves later on
        yourPieceMovements = legalMovesCaptures[0];
        opponentPieceMovements = legalMovesCaptures[1];

        check =  gameStatusCheckerObj.findCheck(playerColor, yourPieceMovements, opponentPieceMovements);
        checkmate = gameStatusCheckerObj.findCheckmate(yourPieceMovements, check);
        stalemate = gameStatusCheckerObj.findStalemate(fenPosition, yourPieceMovements, check, opponentPieceMovements);

        boardSetup();
        setGameStatusMessages();

        if(!checkmate || !stalemate){

            ownPieceHoverMovementEffect();
        }
    }
}

function setGameStatusMessages(){
    const currentPlayer = playerColor == "w" ? "white" : "black";
    let message = currentPlayer + " to move ";

    if(timeOver){
        message = currentPlayer + " lost by Time";
        checkmateAudio.play();
    }

    if(check){
        checkAudio.play();
        message = currentPlayer + " is in check";
    }

    if(stalemate){
        drawAudio.play();
        message = "Game Ended: Stalemate";
        clearInterval(yourTimeInterval);
    }

    if(checkmate){
        checkmateAudio.play();
        message = currentPlayer + " lost by checkmate";
        clearInterval(yourTimeInterval);
    }

    const messageArea = document.getElementsByClassName('time-status')[0];
    changeTextInHtml(messageArea, message)
}

//Drag And Drop is remaining
//click and play available
function ownPieceHoverMovementEffect(){

    const chessBoardElement = document.getElementsByClassName('newChessBrd')[0];

    let ownPiecesSquare = [];
    let kingSquare;

    for(let i = 0; i < yourPieceMovements.length; i++){
        ownPiecesSquare.push(yourPieceMovements[i].currentSquare);
        if(yourPieceMovements[i].pieceName == 'k' || yourPieceMovements[i].pieceName == 'K'){
            kingSquare = yourPieceMovements[i].currentSquare;
        }
    }

    const rank = [8, 7, 6, 5, 4, 3, 2, 1];
    const file = [1, 2, 3, 4, 5, 6, 7, 8];

    for(let i = 0; i < chessBoardElement.childNodes.length; i++){

        for(let j = 0; j < chessBoardElement.childNodes[i].childNodes.length; j++){

            const currentBoardElement = chessBoardElement.childNodes[i].childNodes[j];
            const currentBg = currentBoardElement.style.backgroundColor;

            let ranks = rank[i];
            let files = file[j];

            const currentSquare = (ranks * 8) - (8 - files);

            if(check && currentSquare == kingSquare){
                currentBoardElement.style.backgroundColor = "#5B5EA6";
            }

            currentBoardElement.addEventListener('mouseenter', () =>{

                if(ownPiecesSquare.includes(currentSquare)){
                    currentBoardElement.style.backgroundColor = "#98B4D4";
                }
            });

            currentBoardElement.addEventListener('mouseleave', () =>{

                if(ownPiecesSquare.includes(currentSquare)){
                    currentBoardElement.style.backgroundColor = currentBg;
                }
                if(check && currentSquare == kingSquare){
                    currentBoardElement.style.backgroundColor = "#5B5EA6";
                }
            });

            // currentBoardElement.addEventListener('click', () => {

            //     clickedOnYourPiece(currentSquare, ownPiecesSquare);
            // });

            currentBoardElement.addEventListener('mousedown', () =>{

                clickedOnYourPiece(currentSquare, ownPiecesSquare);
            });
        }
    }
}

function clickedOnYourPiece(currentSquare, ownPiecesSquare){
    //Piece Selected
    if(ownPiecesSquare.includes(currentSquare)){
        boardSetup();
        ownPieceHoverMovementEffect();
        clickedPieceDetails = findPieceByCurrentSquare(currentSquare);
        highLightMovescaptures();
    }
    //if clicked in moveable square of capturable squares
    if(clickedPieceDetails != null){
        if(clickedPieceDetails.availableCaptures.includes(currentSquare) || clickedPieceDetails.availableSquares.includes(currentSquare) || clickedPieceDetails.castelSquare.includes(currentSquare) || clickedPieceDetails.unphasantSquare.includes(currentSquare)){

            if(clickedPieceDetails.availableSquares.includes(currentSquare)){
                moveAudio.play();
            }
            else if(clickedPieceDetails.availableCaptures.includes(currentSquare) || clickedPieceDetails.unphasantSquare.includes(currentSquare)){
                captureAudio.play();
            }
            else if(clickedPieceDetails.castelSquare.includes(currentSquare)){
                castlingAudio.play();
            }
            
            movedSquare = currentSquare;
            //now send this to server movedSquare and pieceSquare
            //for now lets continue in generateFenPosition function
            fenerateFenPosition();
            boardSetup();
            ownPieceHoverMovementEffect();
        }
    }
}

function fenerateFenPosition(){

    castelDetails = apiObject.castelDetails;

    const updatedFenPositionGeneratorObj = new UpdatedFenPositionGenerator(chessBoardArray, movedSquare, clickedPieceDetails, fenPosition, castelDetails);
    const updatedFenPosition = updatedFenPositionGeneratorObj.returnUpdatedFenPosition();
    const updatedCastelInformations = updatedFenPositionGeneratorObj.returnUpdatedCastelInfos();

    fillNewFenPosition(updatedFenPosition, updatedCastelInformations);

    startNewPosition();
}

function highLightMovescaptures(){

    const chessBoardElement = document.getElementsByClassName('newChessBrd')[0];

    const rank = [8, 7, 6, 5, 4, 3, 2, 1];
    const file = [1, 2, 3, 4, 5, 6, 7, 8];
    for(let i = 0; i < chessBoardElement.childNodes.length; i++){
        for(let j = 0; j < chessBoardElement.childNodes[i].childNodes.length; j++){

            const currentBoardElement = chessBoardElement.childNodes[i].childNodes[j];

            let ranks = rank[i];
            let files = file[j];

            const currentSquare = (ranks * 8) - (8 - files);

            if(clickedPieceDetails.availableSquares.includes(currentSquare)){
                currentBoardElement.style.backgroundColor = "#009B77";
                currentBoardElement.style.border = "2px solid black";
            }
            if(clickedPieceDetails.availableCaptures.includes(currentSquare)){
                currentBoardElement.style.backgroundColor = "#DD4124";
                currentBoardElement.style.border = "2px solid black";
            }
            if(clickedPieceDetails.castelSquare.includes(currentSquare)){
                currentBoardElement.style.backgroundColor = "#B565A7";
                currentBoardElement.style.border = "2px solid black";
            }
            if(clickedPieceDetails.unphasantSquare.includes(currentSquare)){
                currentBoardElement.style.backgroundColor = "#DD4124";
                currentBoardElement.style.border = "2px solid black";
            }
        }
    }
}

function findPieceByCurrentSquare(currentSquare){
    for(let i = 0; i < yourPieceMovements.length; i++){
        if(yourPieceMovements[i].currentSquare == currentSquare){
            return yourPieceMovements[i];
        }
    }
}



function updateRemainingTime(){

    const playerDetails = document.getElementsByClassName('player-info-span')[0];

    let opponentTimeHolder;
    let yourTimeHolder;

    if(playerColor == 'w'){
        opponentTimeHolder = document.getElementsByClassName('opp-remaining-time')[0];
        yourTimeHolder = document.getElementsByClassName('your-remaining-time')[0];
    }
    else{
        opponentTimeHolder = document.getElementsByClassName('your-remaining-time')[0];
        yourTimeHolder = document.getElementsByClassName('opp-remaining-time')[0];
    }

    const opponentTime = secondToTime(opponentRemainingTime);
    const yourTime = secondToTime(yourRemainingTime);

    changeTextInHtml(opponentTimeHolder, opponentTime);
    changeTextInHtml(yourTimeHolder, yourTime);
    changeTextInHtml(playerDetails, "Player Name: " + playerId)

    yourTimeInterval = setInterval(() => {

        if(yourRemainingTime > 0){
            yourRemainingTime--;
            const yourTime = secondToTime(yourRemainingTime);
            changeTextInHtml(yourTimeHolder, yourTime);
        }
        else{
            clearInterval(yourTimeInterval);
            timeOver = true;
            checkGameStatus();
        }
        
    }, 1000);
}

function changeTextInHtml(element, time){
    while(element.firstChild){
        element.removeChild(element.firstChild)
    }
    element.textContent = time;
}

function secondToTime(second){

    let minute = (second - second % 60) / 60;
    let seconds = second % 60;

    if(minute < 10){
        minute = '0' + minute;
    }
    if(seconds < 10){
        seconds = '0' + seconds;
    }

    return  minute + ":" + seconds;
}

function boardSetup(){

    const chessBoardHolder = document.getElementsByClassName('chessboard')[0];
    const chessBoard = currentBoardPosition(fenPosition, playerColor);

    while(chessBoardHolder.firstChild){
        chessBoardHolder.removeChild(chessBoardHolder.firstChild);
    }

    chessBoardHolder.appendChild(chessBoard);
}

//Pass the fen Position and player color and get chess board with current fen position
function currentBoardPosition(fenPos, color){

    const brdFirstColor = '#b48766';
    const brdSecondColor = '#edd9b6';
    const brdheight = 550;
    const brdWidth = 550;

    //Object of ChessBoard for empty chess board
    const boardObj = new BlankChessBoard(brdFirstColor , brdSecondColor, brdheight, brdWidth);
    const emptyBoard = boardObj.createBoard();

    //board appended to empty chess board
    const brdWithPiecesObj = new ChessPieceSetter(emptyBoard, fenPos, color);
    let brdWithPieces = brdWithPiecesObj.setPieces();

    return brdWithPieces;
}

function loadRequiredGlobals(){

    fenPosition = apiObject.fenPosition;
    playerColor = fenPosition.split(" ")[1];
    playerId = playerColor == "w" ? apiObject.playerWhite : apiObject.playerBlack;

    timeOver = false;

    yourRemainingTime = playerColor == "w" ? apiObject.whiteTimeRemaining : apiObject.blackTimeRemaining;
    opponentRemainingTime = playerColor == "w" ? apiObject.blackTimeRemaining : apiObject.whiteTimeRemaining;
}

function startNewPosition(){

    clearGlobals();
    loadRequiredGlobals();
    boardSetup();
    updateRemainingTime();
    checkGameStatus();

    console.log(apiObject.fenPosition);

}

function clearGlobals(){

    clearInterval(yourTimeInterval);
    playerId = "";
    playerColor = "";
    fenPosition = "";
    
    yourRemainingTime = 0;
    opponentRemainingTime = 0;
    
    yourTimeInterval;
    
    timeOver = false;
    
    chessBoardArray = new Array(64);
    piecesMoveDetectionArray = new Array(120);
    
    opponentPieceMovements = [];
    yourPieceMovements = [];
    
    clickedPieceDetails = null;
    movedSquare;

    castelDetails = {};

    check = false;
    checkmate = false;
    stalemate = false;
}

document.addEventListener('DOMContentLoaded', main);