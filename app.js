function drawChessboard() {
    let v = 0       //zmienna pomocnicza do kolorowania pól
    for(let i=1; i<=64; i++) {
        let square = document.createElement('div')
        square.id = i
        if ((i+v)%2 == 0) {
            square.classList.add('squareE')
        } 
        else {
            square.classList.add('squareO')
        }
        square.addEventListener('click', (e) => {
            console.log(e.target.id)
            setTarget()
        })
        document.querySelector('#chessboard').appendChild(square)
        i%8 == 0 ? v=v+1 : v=v      //zmiana v na +1 aby od nowego wiersza był inny kolor
    }
}

function setTarget() {
    document.querySelector('#targetLabel').textContent = Math.floor(Math.random() *63 +1)
}

drawChessboard()
setTarget()