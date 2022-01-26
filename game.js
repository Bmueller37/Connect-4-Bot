class GameManager {
    constructor() {
        this.gameState = 0; //in game
        this.grid = new Array(7);
        this.backendGrid = new Array(7);
        this.turn = 1; // 1 = player, 0 = cpu;
        this.gameNumber = 0;
        this.initGrid();
    }
    initGrid() {
        let rows = document.getElementsByClassName("grid-container")[0].children;
        for (let i = 1; i < rows.length; i++) {
            if (rows[i].className != "grid-row") {
                continue;
            }
            this.grid[i - 1] = [];
            this.backendGrid[i - 1] = [];
            let cells = rows[i].children;
            for (let j = 0; j < cells.length; j++) {

                cells[j].setAttribute('data-y', i - 1); //may be made irrelevant
                cells[j].setAttribute('data-x', j);
                //cells[j].firstChild.style.backgroundColor = "white";
                //cells[j].setAttribute('data-owner', -1);
                this.backendGrid[i - 1][j] = -1;
                if (this.gameNumber == 0) {
                    cells[j].addEventListener('click', function (e) {
                        this.setTile(cells[j]);
                    }.bind(this));
                    cells[j].addEventListener('mouseenter', function (x) {
                        this.hover(j);
                    }.bind(this));
                    cells[j].addEventListener('mouseleave', function (y) {
                        this.unhover(j);
                    }.bind(this));
                }
                this.grid[i - 1][j] = cells[j];
            }
        }

    }
    setTile(element) {

        if (this.gameState == 1) {
            return;
        }

        var lastMove = [];
        let column = element.getAttribute('data-x');
        let row = element.getAttribute('data-y');


        for (let i = 5; i >= 0; i--) {
            var cell = this.grid[i][column];
            if (this.backendGrid[i][column] == -1) {

                if (this.turn == 1) {
                    //cell.setAttribute('data-owner', 1);
                    this.backendGrid[i][column] = 1;

                    cell.firstChild.style.backgroundColor = "red";
                    lastMove = [i, column, this.turn]; //x, y, whose tile
                    this.turn = 0;

                    break;
                }
                if (this.turn == 0) {
                    //cell.setAttribute('data-owner', 0);
                    this.backendGrid[i][column] = 0;
                    cell.firstChild.style.backgroundColor = "yellow";
                    lastMove = [i, column, this.turn]; //x, y, whose tile
                    this.turn = 1;
                    break;
                }

            }
        }
        this.hover(column);
        this.checkGameState(lastMove);
    }
    checkGameState(lastMove) {
        this.winCheck(lastMove);
    }
    winCheck(lastMove) {

        let x = lastMove[0];
        let y = parseInt(lastMove[1]);
        console.log(x,y);
        let owner = lastMove[2];
        // check horizontal
        for (let i = 0; i < 7; i++) {
            if (this.backendGrid[x][i] == owner) {
                let winCounter = 1;
                for (let j = i + 1; j < i + 4; j++) {
                    if (j > 7) {
                        i = j;
                        break;
                    }
                    else if (this.backendGrid[x][j] == owner) {
                        winCounter++;
                        continue;
                    }
                    else if (this.backendGrid[x][j] != owner) {
                        i = j;
                        break;
                    }
                }
                if (winCounter == 4) {
                    if (owner == 1) {
                        this.win();
                        return;
                    }
                    else if (owner == 0) {
                        this.lose();
                    }
                }
            }
        }
        //check vertical

        for (let i = 5; i >= 0; i--) {
            if (this.backendGrid[i][y] == owner) {
                let winCounter = 1;
                for (let j = i - 1; j > i - 4; j--) {
                    if (j < 0) {
                        i = j;
                        break;
                    }
                    else if (this.backendGrid[j][y] == owner) {
                        winCounter++;
                        continue;
                    }
                    else if (this.backendGrid[j][y] != owner) {
                        // i = j;
                        break;
                    }
                }

                if (winCounter == 4) {
                    if (owner == 1) {
                        this.win();
                    }
                    else if (owner == 0) {
                        this.lose();
                    }
                }
            }
        }
        //check diagonal
        let forwardSlashCount = 1;
        for (let i = 1, j = 1; i < 4; i++, j++) {
            if (x + i > 5 || y - i < 0) {
                break;
            }
            else if (this.backendGrid[x + i][y - i] != owner) {
                break;
            }
            else if (this.backendGrid[x + i][y - i] == owner) {
                forwardSlashCount += 1;
            }
        }

        if (forwardSlashCount == 4) {
            if (owner == 1) {
                this.win();
            }
            else {
                this.lose();
            }
        }

        for (let i = 1, j = 1; i < 4; i++, j++) {

            if (x - i < 0 || y + i > 6) {

                break;
            }
            else if (this.backendGrid[x - i][y + i] != owner) {


                break;
            }

            else if (this.backendGrid[x - i][y + i] == owner) {

                forwardSlashCount += 1;
            }

            if (forwardSlashCount == 4) {
                if (owner == 1) {
                    this.win();
                }
                else {
                    this.lose();
                }

                return;
            }
        }
        //console.log(forwardSlashCount);
        
        //check backslash
        let backSlashCount = 1;
        for (let i = 1, j = 1; i < 4; i++, j++ ) {
            console.log(backSlashCount);
            if (x+i > 5 || y+i > 6) {
                console.log("Bounds");
                break;
            }
            else if (this.backendGrid[x+i][y+i] != owner) {
                console.log("Other Player");
                break;
            }
            else if(this.backendGrid[x+i][y+i] == owner) {
                console.log("Add");
                backSlashCount += 1;
            }
        }
        
        if (backSlashCount == 4) {
            if (owner == 1) {
                this.win();
            }
            else {
                this.lose();
            }
        }
        for (let i = 1, j = 1; i < 4; i++, j++ ) {
            
            if (x-i < 0 || y - i < 0) {
                break;
            }
            else if (this.backendGrid[x-i][y-i] != owner) {
                break;
            }
            else if(this.backendGrid[x-i][y-i] == owner) {
                backSlashCount += 1;
            }
            if (backSlashCount == 4) {
                if (owner == 1) {
                    this.win();
                }
                else {
                    this.lose();
                }
                return;
            }
        }
        

    }
    win() {
        this.gameState = 1;
        /*
        for (let i = 0; i < this.grid.length-1; i++) {
            let row = this.grid[i];
            for (let j = 0; j <row.length; j++) {
                let cell = this.grid[i][j];
                let clone =  cell.cloneNode(true);
                cell.parentNode.replaceChild(clone, cell);
            }
        }
        */
        document.getElementsByClassName('popup')[0].style.display = "block";
    }
    lose() {
        this.gameState = 1;
        /*
        for (let i = 0; i < this.grid.length-1; i++) {
            let row = this.grid[i];
            for (let j = 0; j <row.length; j++) {
                let cell = this.grid[i][j];
                let clone =  cell.cloneNode(true);
                cell.parentNode.replaceChild(clone, cell);
            }
        }
        */
        document.getElementsByClassName('popup-lose')[0].style.display = "block";
    }
    resetBoard() {
        //in game
        for (let i = 0; i < this.grid.length - 1; i++) {
            let row = this.grid[i];
            for (let j = 0; j < row.length; j++) {
                let cell = this.grid[i][j];
                cell.firstChild.style.backgroundColor = "white";
                /*
                cell.addEventListener('click', function(e) {
                    this.setTile(cell);
                }.bind(this));
                */
            }
        }
        this.gameState = 0;
        document.getElementsByClassName('hole')
        this.backendGrid = new Array(7);
        this.turn = 1; // 1 = player, 0 = cpu;
        this.gameNumber += 1;
        this.initGrid();
        document.getElementsByClassName('popup-lose')[0].style.display = "none";
        document.getElementsByClassName('popup')[0].style.display = "none";
    }
    hover(column) {
        for (let i = 5; i >= 0; i--) {
            var cell = this.grid[i][column];
            if (this.backendGrid[i][column] == -1) {
                if (this.turn == 0) {
                    cell.firstChild.style.backgroundColor = "rgba(255,255,63,0.6)";
                }
                if (this.turn == 1){
                    cell.firstChild.style.backgroundColor = "rgba(242,100,100,0.6)";
                }
                
                break;
            }
        }
    }
    unhover(column) {
        for (let i = 5; i >= 0; i--) {
            var cell = this.grid[i][column];
            if (this.backendGrid[i][column] == -1) {
                cell.firstChild.style.backgroundColor = "white";
                break;
            }
        }
    }

}




function PageManager() {
    document.getElementsByClassName("hole")
    let bruh = new GameManager();
    function retry() {
        bruh.resetBoard();
    }
    function hoverEffect(element) {
        let column = element.getAttribute('data-x');
        bruh.hover(column);
    }
    document.getElementsByClassName("retry")[0].addEventListener('click', retry);
    document.getElementsByClassName("retry")[1].addEventListener('click', retry);


}
PageManager();