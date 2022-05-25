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
    document.querySelector('#chessboard').appendChild(square)
    i%8 == 0 ? v=v+1 : v=v      //zmiana v na +1 aby od nowego wiersza był inny kolor
}