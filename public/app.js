let gameTime = 30
let timer
let score = 0
let randomSquares = []
let generatedSquare = 0
let targetSquare;
let targetSquare2nd;
let targetSquare3rd;
let selectedSquare = 0
let isGameRunning = false

let mainbox = document.querySelector('.main')
let nextbox = document.querySelector('.next')
let waitingbox = document.querySelector('.waiting')

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
    targetSquare = targetSquare2nd || randomSquares.shift()
    targetSquare2nd = targetSquare3rd || randomSquares.shift()
    targetSquare3rd = randomSquares.shift()
    
    if(isGameRunning){
    if(document.querySelector('.moveLeft'))         {document.querySelector('.moveLeft').className = 'fadeLeft'}
    if(document.querySelector('.appearfromRight'))  {document.querySelector('.appearfromRight').className = 'moveLeft'}
    if(document.querySelector('.main'))             {document.querySelector('.main').className = 'fadeLeft'}
    if(document.querySelector('.next'))             {document.querySelector('.next').className = 'moveLeft'}
    if(document.querySelector('.waiting'))          {document.querySelector('.waiting').className = 'appearfromRight'}
    
    let newBox = document.createElement('div')
    newBox.classList = 'waiting'
    newBox.textContent = squares[targetSquare3rd]
    document.querySelector('#maindiv').appendChild(newBox)      
    setTimeout(() => {document.querySelector('.fadeLeft').remove()}, 200)
    }     

}

function checkSquare(targetSquare, selectedSquare) {
    if(targetSquare == selectedSquare){
        score += 1
        document.querySelector('#score').textContent = score
        console.log('correct')
    }
}

function countDown(currentTime){
    let barMax = currentTime
    return new Promise((resolve, reject) => {
        timer = setInterval(function(){
            currentTime -= 0.1
            document.querySelector('#time-left').textContent = currentTime.toFixed(1)
            document.querySelector('.progress-bar').style.width = (barMax - currentTime)/barMax*100 + '%'
            if(currentTime <= 0) {
                document.querySelector('#time-left').textContent = 0
                clearInterval(timer)
                resolve(score)
            }
        }, 100)
        stopButton.addEventListener('click', () => {
            clearInterval(timer)
            document.querySelector('#time-left').textContent = gameTime.toFixed(1)
            document.querySelector('#score').textContent = 0
            document.querySelector('.progress-bar').style.width = "0%"
            reject('game has been interrupted')
            startButton.classList.remove('disabled')
        })
    })
}

function game(){
    startButton.classList.add('disabled')
    score = 0
    isGameRunning = true
    setTarget(coordinates)
    countDown(gameTime)
        .then((score) => {
            isGameRunning = false
            startButton.classList.remove('disabled')
            $('#exampleModal').modal('show');
            document.getElementById('#userscore').textContent = score
        })
        .catch((message) => {
            isGameRunning = false
            startButton.classList.remove('disabled')
            console.log(message)
        })
}

function generateRandomSquares(){
    randomSquares.push(Math.floor(Math.random() *64 +1))
    for(let j = 1; j<500; j++){
        generatedSquare = Math.floor(Math.random() *64 +1)
        if(generatedSquare != randomSquares[randomSquares.length - 1]){
            randomSquares.push(generatedSquare)
        }
        else{
            while(generatedSquare == randomSquares[randomSquares.length - 1]){
                generatedSquare = Math.floor(Math.random() *64 +1)
            }
            randomSquares.push(generatedSquare)
        }
    }
}

const coordinates = drawChessboard()
const startButton = document.querySelector('#start')
const stopButton = document.querySelector('#stop')
const saveButton = document.querySelector('#savescore')
const userLabel = document.getElementById('#username')
const scoreLabel = document.querySelector('#userscore')

startButton.addEventListener('click', game)

saveButton.addEventListener('click', () => {
    fetch('/add', {
        method: 'POST',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: userLabel.value, score: score, date: new Date(), timer: gameTime })
    }).then(function(response) {
        if(response.ok) {
            console.log('database updated');
            return;
        }
        throw new Error('Request failed.');
        });
})

document.querySelectorAll('.nav-link')[1].addEventListener('click', () => { 

    document.getElementById("tableBody").innerHTML = "";

    fetch('/results', {method: 'GET'})
        .then(function(response) {
            if(response.ok) {
                return response.json();
            }
            throw new Error('Request data failed.');
        })
        .then(function(data) {
            let users = data 
            users?.sort((a, b) => (a.score > b.score ? -1 : 1))
            users.forEach(user => {
                fillTable(user)
            })
        })
    
    function fillTable(user) {
        let table = document.getElementById("tableBody");
        let row = table.insertRow(-1);
        let cell1 = row.insertCell(0);
        let cell2 = row.insertCell(1);
        let cell3 = row.insertCell(2);
        let cell4 = row.insertCell(3);

        cell1.innerHTML = document.getElementById('leaderboard').rows.length - 1
        cell2.innerHTML = user['name']
        cell3.innerHTML = user['score']
        cell4.innerHTML = (user['date'].toString()).substring(0, 10);
    }
    
    
    $('#resultModal').modal('show') 
})

generateRandomSquares()
document.querySelector('.next').textContent = coordinates[randomSquares[0]]
document.querySelector('.waiting').textContent = coordinates[randomSquares[1]]
