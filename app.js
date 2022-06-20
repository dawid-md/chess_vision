let gameTime = 30
let timer
let score = 0
let targetSquare = 0
let selectedSquare = 0

function drawChessboard() {
    let squares = {}                        //coordinates!!!
    let v = 0                              //zmienna pomocnicza do kolorowania pól
    let squareLetter = 'A'
    let squareNumber = 8
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
            selectedSquare = e.target.id
            checkSquare(targetSquare, selectedSquare)
            setTarget(squares)
        })
        document.querySelector('#chessboard').appendChild(square)

        squares[i] = squareLetter + squareNumber                             //dodanie id - nazwa pola do obiektu
        squareLetter = String.fromCharCode(squareLetter.charCodeAt() + 1)   //zmiana litery na nastepna dla kolejnego pola
        if(i%8 === 0) {                                                    //jesli caly jeden wiersz wypelniony...
            v=v+1                                                         //zmiana v na +1 aby od nowego wiersza był inny kolor
            squareLetter = 'A'                                           //zmiana na A od nowego wiersza
            squareNumber -= 1                                           //dekrementacja, numeracja wierszy szachownicy od góry do dołu
        }
    }
    return squares
}

function setTarget(squares) {
    targetSquare = Math.floor(Math.random() *64 +1)
    document.querySelector('#targetLabel').textContent = squares[targetSquare]
}

function checkSquare(targetSquare, selectedSquare) {
    if(targetSquare == selectedSquare){
        score += 1
        console.log('correct')
    }
}

function countDown(currentTime){
    return new Promise((resolve, reject) => {
        timer = setInterval(function(){
            currentTime--
            document.querySelector('#time-left').textContent = currentTime
            if(currentTime == 25) {
                clearInterval(timer)
                resolve(score)
            }
        }, 1000)
    })
}

function game(){
    setTarget(coordinates)
    countDown(gameTime).then((score) => {
        console.log(score)
    })
}

const coordinates = drawChessboard()
let startButton = document.querySelector('#start')
startButton.addEventListener('click', game)



//for(j = 1; j<=500; j++) {
//    let f = coordinates[Math.floor(Math.random() *64 +1)]
//    if (f == 'H1') {console.log(f)}
//}