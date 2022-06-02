function drawChessboard() {
    let v = 0                       //zmienna pomocnicza do kolorowania pól
    let squareLetter = 'A'
    let squareNumber = 8
    for(let i=1; i<=64; i++) {
        let square = document.createElement('div')
        square.id = squareLetter + squareNumber
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

        squareLetter = String.fromCharCode(squareLetter.charCodeAt() + 1)   
        if(i%8 === 0) {
            v=v+1                   //zmiana v na +1 aby od nowego wiersza był inny kolor
            squareLetter = 'A'      //zmiana na A od nowego wiersza
            squareNumber -= 1       //dekrementacja, numeracja wierszy szachownicy od góry do dołu
        }
    }
}

function setTarget() {
    document.querySelector('#targetLabel').textContent = Math.floor(Math.random() *63 +1)
}

drawChessboard()
setTarget()