import "./styles/index.sass"
import io from 'socket.io-client'
const socket = io('http://localhost:3000');
let roomName
let gameData
let playerNumber
let chessGrids = []
let pieceSelected = null

const joinRoomInput = document.getElementById('joinRoomInput')
const joinRoomButton =  document.getElementById('joinRoomButton')
const newGameButton = document.getElementById('newGameButton')
const turnElement = document.getElementById('turn')
const gameSection = document.getElementById('game')
const gamePageSection = document.getElementById('gamePage')
const formPageSection = document.getElementById('formPage')
const roomNameElement = document.getElementById('roomName')
const playerElement = document.getElementById('player')

newGameButton.addEventListener('click', newGameButtonHandler)
joinRoomButton.addEventListener('click', joinRoomHandler)

socket.on("connect", () => {
    console.log('Connected')
});
socket.on('init', handleInit)
socket.on('gameState', handleGameState)
socket.on('gameCode', handleGameCode)
socket.on('winner', handleWinner)
socket.on('unknownCode', handleUnknownCode);
socket.on('tooManyPlayers', handleTooManyPlayers);

function handleInit(res, player) {
    playerNumber = player
    playerElement.innerText = 'player: ' + playerNumber
    gameData = res
    turnElement.innerText = 'turn: ' + gameData.turn
    chessInit(gameData.board)
    paintChessBoard()
    paintTurn()
}
function handleGameState(res) {
    gameData = res
    turnElement.innerText = 'turn: ' + gameData.turn
    chessInit(gameData.board)
    paintChessBoard()
    paintTurn()
}
function handleWinner(res) {
    gameSection.style.display = "none"
    alert(res)
}
function newGameButtonHandler() {
    console.log('apretado')
    socket.emit('newGame', 'CHESS')
}
function createHtml(boardData) {
    gameSection.innerHTML = ""
    const images = importAll(require.context('./img/chess_pieces', false, /\.(png|jpe?g|svg)$/i))
    console.log(images)
    for (let i = 0; i < boardData.length; i++) {
        const container = document.createElement('div')
        container.classList.add('grid_8_col')
        for (let j = 0; j < boardData[i].length; j++) {
            const grid = document.createElement('div')
            grid.id = 'chess-grid-' + i + j
            grid.classList.add('grid_1')
            let element = boardData[i][j];
            if (element.name !== "") {
                grid.classList.add(element.name + '_' + element.player)
            }
            container.appendChild(grid)
        }
        gameSection.appendChild(container)
    }
    formPageSection.style.display = "none"
    gamePageSection.style.display = "flex"
    if (playerNumber == 2) {
        gameSection.style.flexDirection = "column-reverse"
    }
}
function saveElement(boardData) {
    chessGrids = []
    for (let i = 0; i < boardData.length; i++) {
        chessGrids.push([])
        for (let j = 0; j < boardData[i].length; j++) {
            const element = document.getElementById("chess-grid-" + i + j)
            element.addEventListener('click', gridHandler)
            chessGrids[i].push(element)
        }
    }
}
function chessInit(boardData) {
    createHtml(boardData);
    saveElement(boardData);
}
function gridHandler(e) {
    if (playerNumber !== gameData.turn) {
        return
    }
    const i = this.id[this.id.length - 2]
    const j = this.id[this.id.length - 1]
    const element = gameData.board[i][j]
    console.log(element)
    if (pieceSelected == null && element.name == "") {
        return
    }
    if (element.player !== gameData.turn && pieceSelected == null) {
        return
    }
    if (element.player == gameData.turn) {
        pieceSelected = {i: i, j: j}
        console.log("Piece " + i + ", " + j + ": " + element.name)
        console.log(element)
        paintChessBoard()
        element.placeCanMove.map( position => {
            chessGrids[position.i][position.j].style.backgroundColor = "blue"
        })
        return
    }
    if (pieceSelected != null && (element.player !== gameData.turn)) {
        const position = gameData.board[pieceSelected.i][pieceSelected.j].placeCanMove.find(a => a.i == i && a.j == j)
        if (position == undefined) {
            return
        }
        movePiece(pieceSelected, position)
        pieceSelected = null
    }
}
function paintChessBoard() {
    let flag = true
    for (let i = 0; i < chessGrids.length; i++) {
        for (let j = 0; j < chessGrids[i].length; j++) {
            chessGrids[i][j].style.backgroundColor = flag? "brown" : "beige"
            flag = !flag
        }
        flag = !flag
    }
}
function movePiece(from, to) {
    socket.emit("play", {from: from, to: to}, roomName)
}
function joinRoomHandler(e) {
    const roomCode = joinRoomInput.value
    if (roomCode > 0) {
        socket.emit('joinGame', roomCode)
    }
}
function handleUnknownCode() {
    alert('Unknown Game Code')
}

function handleTooManyPlayers() {
    alert('This game is already in progress');
}

function handleGameCode(room) {
    roomName = room
    roomNameElement.innerText = 'room: ' + roomName
}

function paintTurn() {
    if (gameData.turn == playerNumber) {
        turnElement.style.backgroundColor = "#9CFAAB"
    } else {
        turnElement.style.backgroundColor = "red"
    }
}

function importAll(r) {
    return r.keys().map(r)
}