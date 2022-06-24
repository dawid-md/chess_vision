let gameTime = 60
let timer
let score = 0
let targetSquare = 0
let selectedSquare = 0
let isGameRunning = false
let previousSquare = 0

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
            if(isGameRunning){
                selectedSquare = e.target.id
                checkSquare(targetSquare, selectedSquare)
                setTarget(squares)
            }   
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
    if (targetSquare == previousSquare) {           //zapobiega pojawieniu sie dwa razy z rzedu tego samego pola
        console.log(targetSquare)
        targetSquare = 65 - targetSquare
    }
    previousSquare = targetSquare
    document.querySelector('#targetLabel').textContent = squares[targetSquare]
}

function checkSquare(targetSquare, selectedSquare) {
    if(targetSquare == selectedSquare){
        score += 1
        document.querySelector('#score').textContent = score
        console.log('correct')
    }
}

function countDown(currentTime){
    return new Promise((resolve, reject) => {
        timer = setInterval(function(){
            currentTime--
            document.querySelector('#time-left').textContent = currentTime
            if(currentTime == 0) {
                clearInterval(timer)
                resolve(score)
            }
        }, 1000)
        stopButton.addEventListener('click', () => {
            clearInterval(timer)
            document.querySelector('#time-left').textContent = gameTime
            document.querySelector('#score').textContent = 0
            reject('game has been interrupted')
        })
    })
}

function game(){
    isGameRunning = true
    startButton.classList.add('disabled')
    score = 0
    setTarget(coordinates)
    countDown(gameTime)
        .then((score) => {
            isGameRunning = false
            startButton.classList.remove('disabled')
            $('#exampleModal').modal('show');
            console.log(score)
        })
        .catch((message) => {
            isGameRunning = false
            startButton.classList.remove('disabled')
            console.log(message)
        })
}

const coordinates = drawChessboard()
const startButton = document.querySelector('#start')
const stopButton = document.querySelector('#stop')
startButton.addEventListener('click', game)

