let gameTime = 15
let timer
let score = 0
let currentTime
let scoreSegments = {}
let realSegments = {}
let randomSquares = []
let generatedSquare = 0
let targetSquare;
let targetSquare2nd;
let targetSquare3rd;
let selectedSquare = 0
let isGameRunning = false
let resizeable = true

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

    // document.querySelector("[id='64']").appendChild(circle)

    return squares
}

function setTarget(squares) {
    targetSquare = targetSquare2nd || randomSquares.shift()
    targetSquare2nd = targetSquare3rd || randomSquares.shift()
    targetSquare3rd = randomSquares.shift()
    
    if(isGameRunning){
    if(document.querySelector('.main'))             {document.querySelector('.main').className = 'fadeLeft'}
    if(document.querySelector('.next'))             {document.querySelector('.next').className = 'main'}
    if(document.querySelector('.waiting'))          {document.querySelector('.waiting').className = 'next'}
    
    let newBox = document.createElement('p')
    newBox.classList = 'waiting'
    newBox.textContent = squares[targetSquare3rd]
    document.querySelector('#maindiv').appendChild(newBox)
    
    document.querySelector('.main').style.fontSize = (document.getElementById('chessboard').offsetWidth / 3.533) + 'px'
    document.querySelector('.next').style.fontSize = (document.getElementById('chessboard').offsetWidth / 8.34) + 'px'
    document.querySelector('.waiting').style.fontSize = (document.getElementById('chessboard').offsetWidth / 8.34) + 'px'

    setTimeout(() => {document.querySelector('.fadeLeft').remove()}, 150)
    }     

}

function checkSquare(targetSquare, selectedSquare) {
    if(targetSquare == selectedSquare){
        document.querySelector('#score').textContent = score += 1
        realSegments[score] = currentTime.toFixed(1)
    }
    else {
        document.querySelector('.main').style.color = "red"
        document.querySelector('.main').style.opacity = 0.2
    }
}

function countDown(gameTime){
    let barMax = gameTime
    currentTime = gameTime
    return new Promise((resolve, reject) => {
        timer = setInterval(function(){
            document.querySelector('#time-left').textContent = currentTime.toFixed(1)
            document.querySelector('.progress-bar').style.width = (barMax - currentTime)/barMax*100 + '%'
            //if(currentTime.toFixed(1) % 0.1 == 0){
                scoreSegments[(gameTime - currentTime).toFixed(1)] = score
            //}
            if(currentTime.toFixed(1) <= 0) {
                document.querySelector('#time-left').textContent = 0
                clearInterval(timer)
                document.querySelector('.progress-bar').style.width = "0%"
                document.querySelector('#chessboard').style.resize = 'both'
                resizeable = true
                resolve(score)
                console.log(scoreSegments);
            }
            currentTime -= 0.1
        }, 100)
        stopCard.addEventListener('click', () => {
            clearInterval(timer)
            document.querySelector('#time-left').textContent = gameTime.toFixed(1)
            document.querySelector('#score').textContent = 0
            startCard.style.display = 'block'
            stopCard.style.display = 'none'
            reject('game has been interrupted')
            startCard.style.display = 'block'
            stopCard.style.display = 'none'
            document.querySelector('.progress-bar').style.width = "0%"
            document.querySelector('#chessboard').style.resize = 'both'
            resizeable = true
        })
    })
}

function game(){
    isGameRunning = true
    score = 0
    setTarget(coordinates)
    countDown(gameTime)
        .then((score) => {
            isGameRunning = false
            startCard.style.display = 'block'
            stopCard.style.display = 'none'
            $('#exampleModal').modal('show');
            document.getElementById('#userscore').textContent = score
        })
        .catch((message) => {
            isGameRunning = false
            startCard.style.display = 'block'
            stopCard.style.display = 'none'
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

function drawChart(currentUser, allUsers){

    let currentUserName = currentUser['name']
    let timer = currentUser['timer']
    let userSegments = currentUser['segments']

    let arrayOftimeAxispoints = []
    let currentUserData = []
    let secondUserData = []
    let thirdUserData = []

    let currentUserID = allUsers.findIndex(item => item._id === currentUser._id)

    for(j = 0.0; j < timer + 0.01; j+=0.1){
        arrayOftimeAxispoints.push((j.toFixed(1).toString()))
        currentUserData.push(userSegments[j.toFixed(1)])
        secondUserData.push(allUsers[currentUserID-1]['segments'][j.toFixed(1)])    //user o pozycje wyzej od current usera
        thirdUserData.push(allUsers[currentUserID+1]['segments'][j.toFixed(1)])    //user o pozycje nizej od current usera
    }

    let firstUser = {
        label: currentUserName,
        data: currentUserData,
        borderWidth: 1,
        tension: 0.1
    }

    let secondUser = {
        label: allUsers[currentUserID-1]['name'],
        data: secondUserData,
        borderWidth: 1,
        tension: 0.1
    }

    let thirdUser = {
        label: allUsers[currentUserID+1]['name'],
        data: thirdUserData,
        borderWidth: 1,
        tension: 0.1
    }

    let ctx = document.getElementById('myChart')

    new Chart(ctx, {
      type: 'line',
      options: {
        elements: {
            point:{
                radius: 0.2
            }
        }
      },
        data: {
            labels: arrayOftimeAxispoints,
            datasets: [firstUser, secondUser, thirdUser]
        }
    });
}



const coordinates = drawChessboard()
const saveButton = document.querySelector('#savescore')
const userLabel = document.getElementById('#username')
const scoreLabel = document.querySelector('#userscore')
const startCard = document.querySelector('#startCard')
const stopCard = document.querySelector('#stopCard')

startCard.addEventListener('click', () => {
    document.querySelector('#chessboard').style.resize = 'none'
    resizeable = false
    document.querySelector('#score').textContent = 0
    startCard.style.display = 'none'
    stopCard.style.display = 'block'
    game()
})

saveButton.addEventListener('click', () => {
    fetch('/add', {
        method: 'POST',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: userLabel.value, score: score, date: new Date(), timer: gameTime, segments: scoreSegments })
    }).then(function(response) {
        if(response.ok) {
            console.log('database updated');
            return;
        }
        throw new Error('Request failed.');
        });
})

document.querySelectorAll('.nav-link')[0].addEventListener('click', () => {
    $('#settingsModal').modal('show') 
})

document.querySelectorAll('.nav-link')[2].addEventListener('click', () => {
    $('#aboutModal').modal('show') 
})

document.querySelectorAll('.nav-link')[1].addEventListener('click', () => {

    document.querySelectorAll('.btnTop').forEach(button => button.checked = false)
    document.querySelector('#btnradio3').checked = true

    let users 
    document.getElementById("tableBody").innerHTML = "";

    fetch('/results', {method: 'GET'})
        .then(function(response) {
            if(response.ok) {
                return response.json();
            }
            throw new Error('Request data failed.');
        })
        .then(function(data) {
            users = data 
            users?.sort((a, b) => (a.score > b.score ? -1 : 1))
            users.forEach(user => {
                fillTable(user)
            })
        })
    
    function fillTable(user, selectedTime = 15) {
        if(user['timer'] == selectedTime) {
            let table = document.getElementById("tableBody");
            let row = table.insertRow(-1);
            let cell1 = row.insertCell(0);
            let cell2 = row.insertCell(1);
            let cell3 = row.insertCell(2);
            let cell4 = row.insertCell(3);
            let cell5 = row.insertCell(4);
            cell1.innerHTML = document.getElementById('leaderboard').rows.length - 1
            cell2.innerHTML = user['name']
            cell3.innerHTML = user['score']
            cell4.innerHTML = (user['date'].toString()).substring(0, 10);
            let button = document.createElement('button')
                button.innerText = "Details"
                button.classList.add('btn', 'btn-primary')
                button.addEventListener('click', () => {
                    document.getElementById('showTable').style.display = 'none'
                    document.getElementById('showDetails').style.display = 'block'
                    drawChart(user, users)
                })
            cell5.appendChild(button)
        }
    }
    $('#resultModal').modal('show') 

    const topSelectors = document.querySelectorAll('.btnTop')
    topSelectors.forEach(button => {
        button.addEventListener('click', () => {
            document.getElementById("tableBody").innerHTML = "";
            users.forEach(user => {fillTable(user, button.value * 1)})
        })
    })
})

window.addEventListener('click', () => {
    if(resizeable == true){
        document.getElementById('chessboard').style.height = document.getElementById('chessboard').style.width
        document.querySelector('.main').style.fontSize = (document.getElementById('chessboard').offsetWidth / 3.533) + 'px'
        document.querySelector('.next').style.fontSize = (document.getElementById('chessboard').offsetWidth / 8.34) + 'px'
        document.querySelector('.waiting').style.fontSize = (document.getElementById('chessboard').offsetWidth / 8.34) + 'px'
        document.getElementById('maindiv').style.width = document.getElementById('chessboard').style.width
        document.getElementById('maindiv').style.height = document.getElementById('chessboard').style.width
        document.querySelector('.progress').style.width = (document.getElementById('chessboard').style.width)
        
        document.querySelector('.coordinatesRow').style.width = (document.getElementById('chessboard').style.width)
        document.querySelector('.coordinatesColumn').style.height = (document.getElementById('chessboard').style.height)
    }
})

generateRandomSquares()
document.querySelector('.next').textContent = coordinates[randomSquares[0]]
document.querySelector('.waiting').textContent = coordinates[randomSquares[1]]

document.querySelector('#showprogressbar').addEventListener('click', () => {
    if(document.querySelector('#showprogressbar').checked) {
        document.querySelector('.progress').style.visibility = 'visible'
    }
    else if(document.querySelector('#showprogressbar').checked == false) {
        document.querySelector('.progress').style.visibility = 'hidden'
    }
})

document.querySelector('#showcoordinates').addEventListener('click', () => {
    if(document.querySelector('#showcoordinates').checked) {
        document.querySelector('.coordinatesRow').style.visibility = 'visible'
        document.querySelector('.coordinatesColumn').style.visibility = 'visible'
        document.querySelector('.progress').style.marginTop = '-5px'
    }
    else if(document.querySelector('#showcoordinates').checked == false) {
        document.querySelector('.coordinatesRow').style.visibility = 'hidden'
        document.querySelector('.coordinatesColumn').style.visibility = 'hidden'
        document.querySelector('.progress').style.marginTop = '-20px'
    }
})

const timeSelectors = document.querySelectorAll('.btnTime')
timeSelectors.forEach(button => {
    button.addEventListener('click', () => {
        timeSelectors[0].checked = false
        timeSelectors[1].checked = false
        timeSelectors[2].checked = false
        button.checked = true
        document.querySelector('#time-left').innerHTML = button.value + ".0"
        gameTime = button.value * 1
    })
})

setTimeout(() => {document.querySelector('.redcircle').style.display = 'none'}, 2500)