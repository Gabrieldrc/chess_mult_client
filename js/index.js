const socket = io('http://localhost:3000');
let gameData

const boton = document.getElementById('boton')
const gameSection = document.getElementById('game')

boton.addEventListener('click', buttonHandler)

socket.on("connect", () => {
    console.log(socket.id); // x8WIv7-mJelg7on_ALbx
    console.log('Connected')
});
socket.on('newGame', (data) => {
    gameData = data
    chessInit(gameData)
})

function buttonHandler() {
    console.log('apretado')
    socket.emit('newGame', 'CHESS')
}
function chessInit(boardData) {
    let html = ""
    const pieceSrc = "./img/chess_pieces/"
    for (let i = 0; i < boardData.length; i++) {
        for (let j = 0; j < boardData[i].length; j++) {
            html += "<div class='grid'>"
            let element = boardData[i][j];
            if (element.name !== "") {
                html += "<img src='" + pieceSrc + element.name + "_" + element.player + ".png'>"
            }
            html += "</div>"
        }
    }
    gameSection.innerHTML = html
}