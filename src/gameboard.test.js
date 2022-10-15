import Gameboard from "./gameboard";

function generateRandomShip(){
    const gridLength = 10;
    const row = Math.floor(Math.random() * gridLength);
    const col = Math.floor(Math.random() * gridLength);
    // True or false
    const isHorizontal = (Math.floor(Math.random() * 2) === 1);
    const length = (
        isHorizontal ? 
        Math.floor(Math.random() * (gridLength-col)) :
        Math.floor(Math.random() * (gridLength-row))
        ) + 1;
    
    const ret = [length, row, col, isHorizontal];
    return ret;
}

/*

    PLACING SHIP TEST

*/


describe("placeShip test", () => {
    test("Placing a ship at {0,0} to {0,3}", () => {
        const gameBoard = Gameboard();
        expect(gameBoard.placeShip(4, 0, 0, true )).toBe(true);
    });

    test("Placing a ship at {0,0} to {0,9}", () => {
        const gameBoard = Gameboard();
        expect(gameBoard.placeShip(10, 0, 0, true )).toBe(true);
    });

    test("Placing an invalid ship {0, 10}, {0, 10} ", () => {
        const gameBoard = Gameboard();
        expect(gameBoard.placeShip(1, 0, 10, true )).toBe(false);
    });

    test("Placing an invalid ship {0, 9}, {0, 11} ", () => {
        const gameBoard = Gameboard();
        expect(gameBoard.placeShip(2, 0, 9, true )).toBe(false);
    });

    test("Placing two ships that is adjacent to each other", () => {
        for(let length = 1; length <= 10; length++){
            for(let i = 0; i < 9; i++){
                const gameBoard = Gameboard();
                expect(gameBoard.placeShip(length, 0, i, false)).toBe(true);
                expect(gameBoard.placeShip(length, 0, i+1, false)).toBe(true);
            }
        }

        for(let length = 1; length <= 10; length++){
            for(let i = 0; i < 9; i++){
                const gameBoard = Gameboard();
                expect(gameBoard.placeShip(length, i, 0, true)).toBe(true);
                expect(gameBoard.placeShip(length, i+1, 0, true)).toBe(true);
            }
        }
    });

    test("Placing two ships at the same location", () => {
        for(let i = 0; i < 100; i++){
            const ship = generateRandomShip();
            const gameBoard = Gameboard();
            expect(gameBoard.placeShip(ship[0], ship[1], ship[2], ship[3])).toBe(true);
            expect(gameBoard.placeShip(ship[0], ship[1], ship[2], ship[3])).toBe(false);
        }
    });

    test("Placing a ship randomly", () => {
        for(let i = 0; i < 100; i++){
            const ship = generateRandomShip();
            const gameBoard = Gameboard();
            expect(gameBoard.placeShip(ship[0], ship[1], ship[2], ship[3])).toBe(true);
        }
    });
});

/*

    ATTACK TEST

*/


describe("receiveAttack test", () => {
    test("Attack a ship with one hit", () => {
        const gameBoard = Gameboard();
        gameBoard.placeShip(1, 0, 0, true);
        expect(gameBoard.receiveAttack(0, 0)).toBe(1);
    });

    test("Destroy a ship", () => {
        const gameBoard = Gameboard();
        gameBoard.placeShip(3, 0, 0, true);
        expect(gameBoard.receiveAttack(0, 0)).toBe(1);
        expect(gameBoard.receiveAttack(0, 1)).toBe(1);
        expect(gameBoard.receiveAttack(0, 2)).toBe(1);
    });

    test("Attack an empty cell", () => {
        const gameBoard = Gameboard();
        gameBoard.placeShip(1, 0, 0, true);
        expect(gameBoard.receiveAttack(0, 1)).toBe(2);
    });

    test("Attack an attacked cell", () => {
        const gameBoard = Gameboard();
        gameBoard.placeShip(1, 0, 0, true);
        gameBoard.receiveAttack(0, 0);
        expect(gameBoard.receiveAttack(0, 0)).toBe(-1);
    });

    test("Destroy a ship then an empty cell", () => {
        const gameBoard = Gameboard();
        gameBoard.placeShip(3, 0, 0, true);
        expect(gameBoard.receiveAttack(0, 0)).toBe(1);
        expect(gameBoard.receiveAttack(0, 1)).toBe(1);
        expect(gameBoard.receiveAttack(0, 2)).toBe(1);
        expect(gameBoard.receiveAttack(0, 3)).toBe(2);
    });

    test("Destroy a ship then game over", () => {
        const gameBoard = Gameboard();
        gameBoard.placeShip(3, 0, 0, true);
        expect(gameBoard.receiveAttack(0, 0)).toBe(1);
        expect(gameBoard.receiveAttack(0, 1)).toBe(1);
        expect(gameBoard.receiveAttack(0, 2)).toBe(1);
        expect(gameBoard.isGameOver()).toBe(true);
    });

    test("Destroy ships then game over", () => {
        const gameBoard = Gameboard();
        gameBoard.placeShip(1, 0, 0, true);
        gameBoard.placeShip(1, 0, 1, true);
        gameBoard.placeShip(1, 0, 2, true);
        expect(gameBoard.receiveAttack(0, 0)).toBe(1);
        expect(gameBoard.receiveAttack(0, 1)).toBe(1);
        expect(gameBoard.receiveAttack(0, 2)).toBe(1);
        expect(gameBoard.isGameOver()).toBe(true);
    });
    
    test("Destroy ships and not game over", () => {
        const gameBoard = Gameboard();
        gameBoard.placeShip(1, 0, 0, true);
        gameBoard.placeShip(1, 0, 1, true);
        gameBoard.placeShip(1, 0, 2, true);
        expect(gameBoard.receiveAttack(0, 0)).toBe(1);
        expect(gameBoard.receiveAttack(0, 1)).toBe(1);
        expect(gameBoard.isGameOver()).toBe(false);
    });
});