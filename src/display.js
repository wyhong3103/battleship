import { createComp, selectComp, selectComps } from "./util";

const Display = (() => {
    const content = selectComp("#content");

    function hideBg(){
        const bgContainer = createComp("div", "hide-bg");
        content.appendChild(bgContainer);
    }

    function displayMsg(message){
        hideBg();
        const msgContainer = createComp("div", "msg-container");
        const msgBox = createComp("div", "msg-box");

        const msg = createComp("h3", "msg");
        msg.textContent = message;

        const okBtn = createComp("button", "ok-btn");
        okBtn.textContent = "OK!";
        msgBox.appendChild(msg);
        msgBox.appendChild(okBtn);

        msgContainer.appendChild(msgBox);
        content.appendChild(msgContainer);
    }

    function allowStart(){
        const prepRight = selectComp(".prep-right");
        prepRight.innerHTML = "";
        const startBtn = createComp("button", "start-btn");
        startBtn.textContent = "START";
        prepRight.appendChild(startBtn);
    }

    function resetGridCells(gridNumber = -1){
        let selector = "";
        if (gridNumber === 1) selector = ".player-grid";
        else if (gridNumber === 2) selector = ".opp-grid";
        else selector = ".grid";
        const grid = selectComp(selector);
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

    function resetCurrent(){
        const current = selectComp(".current");
        current.innerHTML = "";
        for(let i = 0; i < 6; i++){
            const cell = createComp("div", "cell-current");
            current.appendChild(cell);
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

    function sunkShip(length, at, isHorizontal, grid = -1){
        let selector = "";
        if (grid === 1) selector = ".player-grid";
        else if (grid === 2) selector = ".opp-grid";
        else selector = ".grid";
        const cells = selectComps(`${selector} .cell`);

        if (isHorizontal){
            for(let j = 0; j < length; j++){
                cells[at+j].classList.add(`block${length}`);
            }        
        }else{
            for(let j = 0; j < length; j++){
                cells[at+(j*10)].classList.add(`block${length}`);
            }        
        }
    }


    function paintHit(ship, at, hitType, grid = -1){
        let selector = "";
        if (grid === 1) selector = ".player-grid";
        else if (grid === 2) selector = ".opp-grid";
        else selector = ".grid";
        const cells = selectComps(`${selector} .cell`);

        if (hitType === 1){
            cells[at].textContent = "·";
        }else if (hitType >= 2){
            cells[at].textContent = "X";
        }
        if (hitType === 3){
            sunkShip(ship.shipLength, (ship.getHead()[0]*10) + ship.getHead()[1], ship.getHor(), grid);
        }
    }

    function paintCurrent(length){
        resetCurrent();
        const cells = selectComps(".cell-current");
        for(let i = 0; i < length; i++){
            cells[i].classList.add(`block${length}`);
        }
    }

    function paintBoard(gameboard, grid = -1){
        resetGridCells(grid);
        let selector = "";
        if (grid === 1) selector = ".player-grid";
        else if (grid === 2) selector = ".opp-grid";
        else selector = ".grid";
        const cells = selectComps(`${selector} .cell`);

        for(let i = 0; i < 10; i++){
            for(let j = 0; j < 10; j++){
                if (gameboard.shipAt(i,j) !== -1){
                    cells[(i*10)+j].classList.add(`block${gameboard.getShip(gameboard.shipAt(i, j)).shipLength}`);
                }
            }
        }
    }

    function addCurrent(){
        const prepRight = selectComp(".prep-right");
        prepRight.removeChild(prepRight.lastChild);

        const currentContainer = createComp("div", "current-container");
        const currentText = createComp("h3", "current-text");
        currentText.textContent = "CURRENT SHIP";

        const current = createComp("div", "current");
        for(let i = 0; i < 6; i++){
            const cell = createComp("div", "cell-current");
            current.appendChild(cell);
        }

        const doneBtn = createComp("button", "done-btn");
        const doneImg = createComp("img", "done-svg");
        doneImg.src = "./assets/tick.svg";
        doneBtn.appendChild(doneImg);

        currentContainer.appendChild(currentText);
        currentContainer.appendChild(current);
        currentContainer.appendChild(doneBtn);
        prepRight.appendChild(currentContainer);
    }


    // Initialize preparation page
    function prepPage(){
        content.innerHTML = "";
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

        const readyBtn = createComp("button", "ready-btn");
        readyBtn.textContent = "READY";

        prepRight.appendChild(remaining);
        prepRight.appendChild(readyBtn);

        prepContainer.appendChild(prepLeft);
        prepContainer.appendChild(prepRight);

        const footer = createComp("div", "footer");
        const footerText = createComp("p");
        footerText.textContent = "Made By";
        const anchor = createComp("a");
        anchor.setAttribute("href", "https://github.com/wyhong3103");
        const gitHubImg = createComp("img", "github-svg");
        gitHubImg.src = "./assets/github.svg";
        const gitHubName = createComp("p");
        gitHubName.textContent = "wyhong3103";

        anchor.appendChild(gitHubImg);
        anchor.appendChild(gitHubName);

        footer.appendChild(footerText);
        footer.appendChild(anchor);


        main.appendChild(title);
        main.appendChild(prepContainer);
        main.appendChild(footer);

        content.appendChild(main);
    }

    function battlePage(){
        content.innerHTML = "";
        const main = createComp("div", "main");    

        const title = createComp("h1", "title");
        title.textContent = "BATTLESHIP";

        const gridContainer = createComp("div", "grid-container");

        const playerGrid = createComp("div", "player-grid");
        for(let i = 0; i < 100; i++){
            const cell = createComp("div", "cell");
            playerGrid.appendChild(cell);
        }

        const oppGrid = createComp("div", "opp-grid");
        for(let i = 0; i < 100; i++){
            const cell = createComp("div", "cell");
            oppGrid.appendChild(cell);
        }
        gridContainer.appendChild(playerGrid);
        gridContainer.appendChild(oppGrid);

        const gameBtnContainer = createComp("div", "game-btn-container");
        const restartBtn = createComp("button", "restart-btn");
        const exitBtn = createComp("button", "exit-btn");
        restartBtn.textContent = "RESTART";
        exitBtn.textContent = "EXIT";

        gameBtnContainer.appendChild(restartBtn);
        gameBtnContainer.appendChild(exitBtn);

        const footer = createComp("div", "footer");
        const footerText = createComp("p");
        footerText.textContent = "Made By";
        const anchor = createComp("a");
        anchor.setAttribute("href", "https://github.com/wyhong3103");
        const gitHubImg = createComp("img", "github-svg");
        gitHubImg.src = "./assets/github.svg";
        const gitHubName = createComp("p");
        gitHubName.textContent = "wyhong3103";

        anchor.appendChild(gitHubImg);
        anchor.appendChild(gitHubName);

        footer.appendChild(footerText);
        footer.appendChild(anchor);


        main.appendChild(title);
        main.appendChild(gridContainer);
        main.appendChild(gameBtnContainer);
        main.appendChild(footer);
        content.appendChild(main);
    }

    return {
        prepPage,
        paintStock,
        paintBoard,
        paintCurrent,
        allowStart,
        addCurrent,
        battlePage,
        paintHit,
        displayMsg
    }

})();

export default Display;