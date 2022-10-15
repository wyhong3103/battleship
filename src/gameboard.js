import Ship from "./ship";

const Gameboard = (() => {
    const grid = [];
    const hitGrid = [];
    const ships = [];
    let shipsRemaining = 0;

    function generateGrid(){
        const gridLength = 10;
        for(let i = 0; i < gridLength; i++){
            const temp = [];
            for(let j = 0; j < gridLength; j++){
                temp.push(-1);
            }
            grid.push(temp);
        }
        for(let i = 0; i < gridLength; i++){
            const temp = [];
            for(let j = 0; j < gridLength; j++){
                temp.push(-1);
            }
            hitGrid.push(temp);
        }
    }

    function isInvalidCoord(row, col){
        if (row < 0 || col < 0 || row >= grid.length || col >= grid.length) return true;
        return false;
    }

    function isInvalidShip(fromRow, fromCol, toRow, toCol){
        // If testing a single coordinate, we only check fromRow and fromCol
        if (isInvalidCoord(fromRow,fromCol) || isInvalidCoord(toRow, toCol)) return true;

        // Testing both coordintes, make sure from is always smaller than to
        if (toRow < fromRow || toCol < fromCol) return true;

        const dr = [-1, -1, 0, 1, 1, 1, 0, -1];
        const dc = [0, 1, 1, 1, 0, -1, -1, -1];

        if (fromRow === toRow){
            for(let i = fromCol; i <= toCol; i++){
                for(let j = 0; j < 8; j++){
                    if (!(i+dc[j] < 0 || fromRow+dr[j] < 0 || i+dc[j] >= 10 || fromRow+dr[j] >= 10) &&
                        grid[fromRow+dr[j]][i+dc[j]] !== -1
                    ){
                       return true; 
                    }
                }
            }
        }
        if (fromCol === toCol){
            for(let i = fromRow; i <= toRow; i++){
                for(let j = 0; j < 8; j++){
                    if (!(fromCol+dc[j] < 0 || i+dr[j] < 0 || fromCol+dc[j] >= 10 || i+dr[j] >= 10) &&
                        grid[i+dr[j]][fromCol+dc[j]] !== -1
                    ){
                       return true; 
                    }
                }
            }
        }

        return false;
    }


    function isEmpty(fromRow, fromCol, toRow, toCol){
        let valid = true;
        if (fromRow === toRow){
            for(let i = fromCol; i <= toCol; i++){
                if (grid[fromRow][i] !== -1) valid = false;
            }
        }else{
            for(let i = fromRow; i <= toRow; i++){
                if (grid[i][fromCol] !== -1) valid = false;
            }
        }
        return valid;
    }

    function placeShip(length, row, col, isHorizontal){
        const shipID = ships.length;
        if (isHorizontal && !isInvalidShip(row, col, row, col+length-1) && isEmpty(row, col, row, col+length-1)){
            for(let i = col; i < col+length; i++){
                grid[row][i] = shipID;
            }        
            ships.push(Ship(length));
        }
        else if (!isHorizontal && !isInvalidShip(row, col, row+length-1, col) && isEmpty(row, col, row+length-1, col)){
            for(let i = row; i < row+length; i++){
                grid[i][col] = shipID;
            }        
            ships.push(Ship(length));
        }else{
            return false;
        }
        shipsRemaining += 1;
        return true;
    }

    function receiveAttack(row, col){
        // invalid hit
        if (isInvalidCoord(row, col) || hitGrid[row][col] !== -1) return -1;
        
        hitGrid[row][col] = 1;
        if (grid[row][col] !== -1){
            ships[grid[row][col]].hit();
            if (ships[grid[row][col]].isSunk()){
                shipsRemaining -= 1;
                
                // If sunk the ship
                return 3;
            }

            // If hit a ship
            return 2;
        }

        // If hit nothing
        return 1;
    }

    function isGameOver(){
        return shipsRemaining === 0;
    }

    generateGrid();
    return{
        placeShip,
        receiveAttack,
        isGameOver
    }
});

export default Gameboard;