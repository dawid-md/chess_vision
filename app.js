function drawChessboard() {
    let squares = {}                //coordinates!!!
    let v = 0                       //zmienna pomocnicza do kolorowania pól
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
            //console.log(e.target.id)
            setTarget(squares)
        })
        document.querySelector('#chessboard').appendChild(square)

        squares[i] = squareLetter + squareNumber                        //dodanie id - nazwa pola do obiektu
        squareLetter = String.fromCharCode(squareLetter.charCodeAt() + 1)   //zmiana litery na nastepna dla kolejnego pola
        if(i%8 === 0) {             //jesli caly jeden wiersz wypelniony...
            v=v+1                   //zmiana v na +1 aby od nowego wiersza był inny kolor
            squareLetter = 'A'      //zmiana na A od nowego wiersza
            squareNumber -= 1       //dekrementacja, numeracja wierszy szachownicy od góry do dołu
        }
    }
    return squares
}

function setTarget(squares) {
    document.querySelector('#targetLabel').textContent = squares[Math.floor(Math.random() *64 +1)]
}

const coordinates = drawChessboard()
setTarget(coordinates)

//for(j = 1; j<=500; j++) {
//    let f = coordinates[Math.floor(Math.random() *64 +1)]
//    if (f == 'H1') {console.log(f)}
//}