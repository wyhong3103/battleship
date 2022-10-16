import { createComp, selectComp, selectComps } from "./util";

const Display = (() => {
    const content = selectComp("#content");

    function resetGridCells(){
        const grid = selectComp(".grid");
        grid.innerHTML = "";
        for(let i = 0; i < 100; i++){
            const cell = createComp("div", "cell");
            grid.appendChild(cell);
        }
    }

    function resetStockCells(){
        const remaining = (selectComp(".remaining"))
        remaining.innerHTML = "";
        for(let i = 0; i < 20; i++){
            const cell = createComp("div", "cell-remain");
            remaining.appendChild(cell);
        }
    }

    function paintStock(remain){
        resetStockCells();
        const cells = selectComps(".remaining .cell-remain");
        let row = 0; let col = 0;
        for(let i = 0; i < remain.length; i++){
            if (col+remain[i] >= 10) {
                row += 1;
                col = 0;
            }
            for(let j = col; j < col+remain[i]; j++){
                cells[(row*10) + j].classList.add(`block${remain[i]}`);
                if (j === col) cells[(row*10) + j].classList.add("cell-remain-left");
            }
            col += remain[i];
        }
    }

    function paintBoard(gameboard){
        resetGridCells();
        const cells = selectComps(".grid .cell");

        for(let i = 0; i < 10; i++){
            for(let j = 0; j < 10; j++){
                if (gameboard.shipAt(i,j) !== -1){
                    cells[(i*10)+j].classList.add(`block${gameboard.getShip(gameboard.shipAt(i, j)).shipLength}`);
                }
            }
        }

    }


    // Initialize preparation page
    function prepPage(){
        const main = createComp("div", "main");    

        const title = createComp("h1", "title");
        title.textContent = "BATTLESHIP";

        const prepContainer = createComp("div", "prep-container");
        const prepLeft = createComp("div", "prep-left");
        const grid = createComp("div", "grid");
        for(let i = 0; i < 100; i++){
            const cell = createComp("div", "cell");
            grid.appendChild(cell);
        }


        prepLeft.appendChild(grid);

        const prepRight = createComp("div", "prep-right");
        const remaining = createComp("div", "remaining");
        for(let i = 0; i < 20; i++){
            const cell = createComp("div", "cell-remain");
            remaining.appendChild(cell);
        }

        const startBtn = createComp("button", "start");
        startBtn.textContent = "START";

        prepRight.appendChild(remaining);
        prepRight.appendChild(startBtn);

        prepContainer.appendChild(prepLeft);
        prepContainer.appendChild(prepRight);
        main.appendChild(title);
        main.appendChild(prepContainer);

        content.appendChild(main);
    }

    return {
        prepPage,
        paintStock,
        paintBoard
    }

})();

export default Display;