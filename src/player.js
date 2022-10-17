import Gameboard from "./gameboard";
import { shuffle } from "./util";

const Player = (() => {
    const gameboard = Gameboard();    
    let currentAttack = 0;
    let attackOrder = [];

    function generateAttackOrder(){
        for(let i = 0; i < 10; i++){
            for(let j = 0; j < 10; j++){
                attackOrder.push([i, j]);
            }
        }
        attackOrder = shuffle(attackOrder);
    }

    function randomAttack(oppBoard){
        let res = [-1, -1, -1];
        while (res[2] === -1){
            res = [
                attackOrder[currentAttack][0],
                attackOrder[currentAttack][1],
                -1
            ]
            res[2] = oppBoard.receiveAttack(res[0], res[1]);
            currentAttack += 1;
        } 
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

    return {
        gameboard,
        randomAttack,
        generateRandomShip
    }
});

export default Player;