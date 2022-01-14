const socket = io('http://localhost:3000');
let gameData
let chessGrids = []
let pieceSelected = null

const boton = document.getElementById('boton')
const turnElement = document.getElementById('turn')
const gameSection = document.getElementById('game')

boton.addEventListener('click', buttonHandler)

socket.on("connect", () => {
    console.log(socket.id); // x8WIv7-mJelg7on_ALbx
    console.log('Connected')
});
socket.on('newGame', (res) => {
    gameData = res
    turnElement.innerText = gameData.turn
    chessInit(gameData.board)
    paintChessBoard()
})

socket.on('update', (res)=> {
    gameData = res
    turnElement.innerText = gameData.turn
    chessInit(gameData.board)
    paintChessBoard()
})

socket.on('winner', (res)=> {
    gameSection.style.display = "none"
    alert(res)
})

function buttonHandler() {
    console.log('apretado')
    socket.emit('newGame', 'CHESS')
}

function createHtml(boardData) {
    let html = ""
    const pieceSrc = "./img/chess_pieces/"
    for (let i = 0; i < boardData.length; i++) {
        for (let j = 0; j < boardData[i].length; j++) {
            html += "<div id='chess-grid-" + i + j + "'>"
            let element = boardData[i][j];
            if (element.name !== "") {
                html += "<img src='" + pieceSrc + element.name + "_" + element.player + ".png'>"
            }
            html += "</div>"
        }
    }
    gameSection.innerHTML = html
    gameSection.style.display = "grid"
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
    socket.emit("play", {from: from, to: to})
}