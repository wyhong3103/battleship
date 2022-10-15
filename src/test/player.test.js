import Player from '../player';
import shuffle from '../util';

test("Spawning random ships on one gameboard, and let computer destroy all of them", ()=>{
    const dummy = Player();
    const computer = Player();

    const expectedShips = Math.floor(Math.random() * 50)+1;
    let coords = [];
    for(let i = 0; i < 10; i++){
        for(let j = 0; j < 10; j++){
            coords.push([i, j]);
        }
    }
    coords = shuffle(coords);

    // Placing ships
    let totalShips = 0;
    for(let i = 0; i < expectedShips; i++){
        if (dummy.gameboard.placeShip(1, coords[i][0], coords[i][1])){
            totalShips += 1;
        }
    }

    // Destroy ships
    let destroyCount = 0;
    while (!dummy.gameboard.isGameOver()){
        if (computer.randomAttack(dummy.gameboard)[2] === 3){
            destroyCount += 1;
        }
    }

    expect(destroyCount).toBe(totalShips);
});
