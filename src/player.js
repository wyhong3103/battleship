import Gameboard from "./gameboard";
import { shuffle } from "./util";

const Player = (() => {
    const gameboard = Gameboard();    
    let currentAttack = 0;
    let attackOrder = [];
    // -1 = unknown, 1 = impossible to have ship
    let found = [[-1, -1], [-1, -1]];
    const queue = [];
    const hitGrid = [];

    function generateAttackOrder(){
        for(let i = 0; i < 10; i++){
            for(let j = 0; j < 10; j++){
                attackOrder.push([i, j]);
            }
        }
        attackOrder = shuffle(attackOrder);
    }

    function generateHitGrid(){
        for(let i = 0; i < 10; i++){
            const temp = [];
            for(let j = 0; j < 10; j++){
                temp.push(-1);
            }
            hitGrid.push(temp);
        }
    }

    function coverImpossible(rowAt, colAt, oppBoard){
        const dr = [-1, -1, 0, 1, 1, 1, 0, -1];
        const dc = [0, 1, 1, 1, 0, -1, -1, -1];
        const ship = oppBoard.getShip(oppBoard.shipAt(rowAt, colAt));
        const [row,col] = ship.getHead();
        if (ship.getHor()){
            for(let i = col; i < col+ship.shipLength; i++){
                for(let j = 0; j < 8; j++){
                    if (!(row+dr[j] < 0 || i+dc[j] < 0 || row+dr[j] >= 10 || i+dc[j] >= 10)){
                        hitGrid[row+dr[j]][i+dc[j]] = 1;
                    }
                }
            }
        }else{
            for(let i = row; i < row+ship.shipLength; i++){
                for(let j = 0; j < 8; j++){
                    if (!(i+dr[j] < 0 || col+dc[j] < 0 || i+dr[j] >= 10 || col+dc[j] >= 10)){
                        hitGrid[i+dr[j]][col+dc[j]] = 1;
                    }
                }
            }
        }
    }

    function randomAttack(oppBoard){
        let res = [-1, -1, -1];
        if (found[0][0] !== -1 && found[0][1] !== -1){
            // Only found one point
            if (found[0][0] === found[1][0] && found[0][1] === found[1][1]){
                while (res[2] === -1){
                    const toAttack = queue.shift();
                    res = [toAttack[0], toAttack[1], -1];
                    res[2] = (oppBoard.receiveAttack(toAttack[0], toAttack[1]));
                }
                if (res[2] === 2){
                    while (queue.length > 0) queue.pop();
                    // Same row
                    if (res[0] === found[0][0]){
                        if (res[1] > found[0][1]){
                            found[1] = [res[0], res[1]];
                        }else{
                            found[0] = [res[0], res[1]];
                        }
                    }else if(res[1] === found[0][1]){
                        if (res[0] > found[0][0]){
                            found[1] = [res[0], res[1]];
                        }else{
                            found[0] = [res[0], res[1]];
                        }
                    }
                }
            }else if (!(found[0][0] === found[1][0] && found[0][1] === found[1][1])){
                // Found different points! Determined the direction!

                // same row
                if (found[0][0] === found[1][0]){
                    // Try left first
                    res = [
                        found[0][0],
                        found[0][1],
                        -1
                    ]
                    while (res[1] >= 0 && res[2] === -1){
                        res[1] -= 1;
                        if (res[1] >= 0 && hitGrid[res[0]][res[1]] === -1) res[2] = oppBoard.receiveAttack(res[0],res[1]);
                        else break;
                    }
                    
                    // Found another part move pointer
                    if (res[2] >= 2) found[0][1] -= 1;

                    if (res[2] === -1){
                        // Try right
                        res = [
                            found[1][0],
                            found[1][1],
                            -1
                        ]
                        while (res[1] < 10 && res[2] === -1){
                            res[1] += 1;
                            if (res[1] < 10 && hitGrid[res[0]][res[1]] === -1) res[2] = oppBoard.receiveAttack(res[0],res[1]);
                            else break;
                        }
                        if (res[2] >= 2) found[1][1] += 1;
                    }
                }else if (found[0][1] === found[1][1]){
                    // Try left first
                    res = [
                        found[0][0],
                        found[0][1],
                        -1
                    ]
                    while (res[1] >= 0 && res[2] === -1){
                        res[0] -= 1;
                        if (res[0] >= 0 && hitGrid[res[0]][res[1]] === -1) res[2] = oppBoard.receiveAttack(res[0],res[1]);
                        else break;
                    }

                    // Found another part move pointer
                    if (res[2] >= 2) found[0][0] -= 1;

                    if (res[2] === -1){
                        // Try right
                        res = [
                            found[1][0],
                            found[1][1],
                            -1
                        ]
                        while (res[0] < 10 && res[2] === -1){
                            res[0] += 1;
                            if (res[0] < 10 && hitGrid[res[0]][res[1]] === -1) res[2] = oppBoard.receiveAttack(res[0],res[1]);
                            else break;
                        }
                        if (res[2] >= 2) found[1][0] += 1;
                    }
                }
            }
        }
        else{
            while (res[2] === -1){
                res = [
                    attackOrder[currentAttack][0],
                    attackOrder[currentAttack][1],
                    -1
                ]
                if (hitGrid[res[0]][res[1]] === -1){
                    res[2] = oppBoard.receiveAttack(res[0], res[1]);
                    if (res[2] === 2){

                        // Set found cell
                        found = [[res[0],res[1]], [res[0], res[1]]];
                        const [row,col] = [res[0], res[1]];
                        const dr = [1, -1, 0, 0];
                        const dc = [0, 0, 1, -1];

                        // Try cells in 4 directions
                        for(let i = 0; i < 4; i++){
                            if (!(row+dr[i] < 0 || row+dr[i] >= 10 || col+dc[i] < 0 || col+dc[i] >= 10 || hitGrid[row+dr[i]][col+dc[i]] === 1)){
                                queue.push([row+dr[i], col+dc[i]]);
                            }
                        }
                    }
                } 
                currentAttack += 1;
            } 
        }
        if (res[2] === 3){
            found = [[-1,-1], [-1,-1]];
            coverImpossible(res[0], res[1], oppBoard);
        }

        hitGrid[res[0]][res[1]] = 1;
        return res;
    }

    function generateRandomShip(){
        const ships = [2, 3, 3, 4, 5];
        while (ships.length > 0){
            const currentLength = ships[ships.length-1];
            const [row,col] = [Math.floor(Math.random() * 10), Math.floor(Math.random() * 10)]            
            const isHorizontal = Math.floor(Math.random() * 2) === 1;
            
            if (gameboard.isValidPlacement(currentLength,row, col, isHorizontal)){
                gameboard.placeShip(currentLength, row, col, isHorizontal);
                ships.pop();
            }
        }
    }

    generateAttackOrder();
    generateHitGrid();

    return {
        gameboard,
        randomAttack,
        generateRandomShip
    }
});

export default Player;