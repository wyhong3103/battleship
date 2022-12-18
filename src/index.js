import { selectComp, selectComps, clearEvtLs} from "./util";
import Player from "./player";
import Display from "./display";

const Controller = (() => {
    let player = null;
    let opp = null;
    
    /*

        PREP FUNCS & VARIABLES

    */

    // Variable for preparation stage
    let stocks = [];
    let lifting = -1;
    let clicks = 0;
    let timer = null;


    function setLift(){
        const cells = selectComps(".cell");
        for(let i = 0 ; i < cells.length; i++){
            // eslint-disable-next-line no-loop-func
            cells[i].addEventListener("mouseover", () => {
                const ship = player.gameboard.getShip(lifting);
                if (player.gameboard.shipAt(Math.floor(i/10), i % 10) === -1 && 
                    player.gameboard.isValidPlacement(ship.shipLength, Math.floor(i/10), i%10, ship.getHor())){
                    player.gameboard.placeShip(ship.shipLength, Math.floor(i/10), i%10, ship.getHor(), lifting);
                    if (ship.getHor()){
                        for(let j = 0; j < ship.shipLength; j++){
                            cells[i+j].classList.add(`block${ship.shipLength}`);
                        }        
                    }
                    else{
                        for(let j = 0; j < ship.shipLength; j++){
                            cells[i+(j*10)].classList.add(`block${ship.shipLength}`);
                        }        
                    }
                }
            })
            // eslint-disable-next-line no-loop-func
            cells[i].addEventListener("mouseout", () => {
                const ship = player.gameboard.getShip(lifting);
                if (player.gameboard.shipAt(Math.floor(i/10), i % 10) === lifting){
                    player.gameboard.unplaceShip(lifting);
                    if (ship.getHor()){
                        for(let j = 0; j < ship.shipLength; j++){
                            cells[i+j].classList.remove(`block${ship.shipLength}`);
                        }        
                    }
                    else{
                        for(let j = 0; j < ship.shipLength; j++){
                            cells[i+(j*10)].classList.remove(`block${ship.shipLength}`);
                        }        
                    }
                }
            })

            // eslint-disable-next-line no-loop-func
            cells[i].addEventListener("click", () => {
                if (player.gameboard.shipAt(Math.floor(i/10), i % 10) === lifting){
                    lifting = -1;
                    Display.paintBoard(player.gameboard);
                    // eslint-disable-next-line no-use-before-define
                    setPrep();
                }
            })
        }

    }

    function setPrep(){
        const cells = selectComps(".cell");
        for(let i = 0 ; i < cells.length; i++){
            // eslint-disable-next-line no-loop-func
            cells[i].addEventListener("click", () => {
                
                const rotate = () => {
                    if (player.gameboard.shipAt(Math.floor(i/10), i % 10) !== -1){
                        const shipID = player.gameboard.shipAt(Math.floor(i/10), i %10);
                        const ship = player.gameboard.getShip(shipID);
                        player.gameboard.unplaceShip(shipID);
                        if (player.gameboard.isValidPlacement(ship.shipLength, ship.getHead()[0], ship.getHead()[1], !ship.getHor())){
                            player.gameboard.placeShip(ship.shipLength, ship.getHead()[0], ship.getHead()[1], !ship.getHor(), shipID);
                            Display.paintBoard(player.gameboard);
                            setPrep();
                        }else{
                            player.gameboard.placeShip(ship.shipLength, ship.getHead()[0], ship.getHead()[1], ship.getHor(), shipID);
                        }
                    }
                }

                const lift = () => {
                    if (player.gameboard.shipAt(Math.floor(i/10), i % 10) !== -1){
                        // unset this ship, start lifting
                        lifting = player.gameboard.shipAt(Math.floor(i/10), i % 10);
                        player.gameboard.unplaceShip(player.gameboard.shipAt(Math.floor(i/10), i % 10));
                        Display.paintBoard(player.gameboard);
                        setLift();
                    }
                }

                clicks += 1;

                if (clicks === 1){
                    timer = setTimeout(
                        () => {
                            lift();
                            clicks = 0;
                        },
                        200
                    )
                }else{
                    clearTimeout(timer);
                    rotate();
                    clicks = 0;
                }
            });

        }
    }

    function setStartBtn(){
        const startBtn = selectComp(".start-btn");
        startBtn.addEventListener("click", () => {
            initBattle();
        })
    }

    function setCurrent(){
        const doneBtn = selectComp(".done-btn");
        doneBtn.addEventListener("click", ()=>{
            if (lifting === -1 && stocks.length > 0){
                lifting = 5-stocks.length;
                const currentLength = stocks[stocks.length-1];
                player.gameboard.newShip(currentLength);
                stocks.pop();
                Display.paintCurrent(currentLength);
                Display.paintStock(stocks);
                // setPrep might get trigger, we need to clear it!
                clearEvtLs(".grid .cell", true);
                setLift();
            }else if (stocks.length === 0){
                Display.allowStart();
                setStartBtn();
            }
        });
    }

    function setStartUp(){
        const readyBtn = selectComp(".ready-btn");
        readyBtn.addEventListener("click", () => {
            Display.addCurrent();
            setCurrent();
            lifting = 0;
            const currentLength = 5;
            player.gameboard.newShip(currentLength);
            stocks.pop();
            Display.paintCurrent(currentLength);
            Display.paintStock(stocks);
            setLift();
        })
    }

    function initPrep(){
        player = Player();
        opp = Player();
        stocks = [2, 3, 3, 4, 5];
        Display.prepPage();
        Display.paintStock(stocks);
        Display.paintBoard(player.gameboard);
        setStartUp();
    }

    /*

        BATTLE FUNCS & VARIABLES

    */
   let turn = 0;

   function setMsg(){
        const okBtn = selectComp(".ok-btn");
        okBtn.addEventListener("click", () => {
            const content = selectComp("#content");
            content.removeChild(content.lastChild);
            content.removeChild(content.lastChild);
        });
   }

    function endGame(winner){
        clearEvtLs(".player-grid .cell", true);
        clearEvtLs(".opp-grid .cell", true);
        Display.displayMsg(`${winner === 1 ? "Player" : "AI"} have won the game! Press restart if you wish to restart the game with current setting. Otherwise, exit.`);
        setMsg();
    }

    function oppAttackCell(){
        const res = opp.randomAttack(player.gameboard);
        if (res[2] === 1) {
            Display.paintHit(-1, (res[0]*10)+res[1], res[2], 1);
        }else if (res[2] >= 2){
            Display.paintHit(player.gameboard.getShip(player.gameboard.shipAt(res[0],res[1])), (res[0]*10)+res[1], res[2], 1);
        }
        turn = 0;
        if (player.gameboard.isGameOver()){
            endGame(0);
        }
    }

    function setBattleCells(){
        const oppCells = selectComps(".opp-grid .cell");
        for(let i = 0; i < oppCells.length; i++){
            // eslint-disable-next-line no-loop-func
            oppCells[i].addEventListener("click", () => {
                if (turn === 0){
                    const result = opp.gameboard.receiveAttack(Math.floor(i/10), i%10);
                    if (result !== -1){
                        if (result === 1) {
                            Display.paintHit(-1, i, result, 2);
                        }else if (result >= 2){
                            Display.paintHit(opp.gameboard.getShip(opp.gameboard.shipAt(Math.floor(i/10), i % 10)), i, result, 2);
                        }
                        turn = 1;
                        if (opp.gameboard.isGameOver()){
                            endGame(1);
                        }
                        oppAttackCell();
                    }
                }
            });
        }
    }

   function restartGame(){
        player.gameboard.restartBoard();
        opp = Player();
        Display.battlePage();
        opp.generateRandomShip();
        Display.paintBoard(player.gameboard, 1);
        setBattleCells();
        setGameBtns();
   }


   function setGameBtns(){
        const restartBtn = selectComp(".restart-btn");
        restartBtn.addEventListener("click", () => {
            restartGame();
        });
        const exitBtn = selectComp(".exit-btn");
        exitBtn.addEventListener("click", () => {
            initPrep();
        });
   }

    function initBattle(){
        Display.battlePage();
        opp.generateRandomShip();
        Display.paintBoard(player.gameboard, 1);
        setBattleCells();
        setGameBtns();
    }

    function init(){
        initPrep();
        Display.displayMsg("Welcome to BATTLESHIP! Place your ships and ready for war! Click the ship one time to relocate it! Double click it to rotate it!");
        setMsg();
    }

    return{
        init
    }
})();    

Controller.init();
