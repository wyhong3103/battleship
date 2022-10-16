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

    generateAttackOrder();

    return {
        gameboard,
        randomAttack,
    }
});

export default Player;