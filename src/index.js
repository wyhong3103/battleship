import { selectComp, selectComps} from "./util";
import Player from "./player";
import Display from "./display";

const Controller = (() => {
    const player1 = Player();
    // const computer = Player();
    
    // Variable for preparation stage
    const stocks = [2, 3, 3, 4, 5];
    let lifting = -1;
    let clicks = 0;
    let timer = null;


    function setLift(){
        const cells = selectComps(".cell");
        for(let i = 0 ; i < cells.length; i++){
            // eslint-disable-next-line no-loop-func
            cells[i].addEventListener("mouseover", () => {
                const ship = player1.gameboard.getShip(lifting);
                if (player1.gameboard.shipAt(Math.floor(i/10), i % 10) === -1 && 
                    player1.gameboard.isValidPlacement(ship.shipLength, Math.floor(i/10), i%10, ship.getHor())){
                    player1.gameboard.placeShip(ship.shipLength, Math.floor(i/10), i%10, ship.getHor(), lifting);
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
                const ship = player1.gameboard.getShip(lifting);
                if (player1.gameboard.shipAt(Math.floor(i/10), i % 10) === lifting){
                    player1.gameboard.unplaceShip(lifting);
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
                if (player1.gameboard.shipAt(Math.floor(i/10), i % 10) === lifting){
                    lifting = -1;
                    Display.paintBoard(player1.gameboard);
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
                    if (player1.gameboard.shipAt(Math.floor(i/10), i % 10) !== -1){
                        const shipID = player1.gameboard.shipAt(Math.floor(i/10), i %10);
                        const ship = player1.gameboard.getShip(shipID);
                        player1.gameboard.unplaceShip(shipID);
                        if (player1.gameboard.isValidPlacement(ship.shipLength, ship.getHead()[0], ship.getHead()[1], !ship.getHor())){
                            player1.gameboard.placeShip(ship.shipLength, ship.getHead()[0], ship.getHead()[1], !ship.getHor(), shipID);
                            Display.paintBoard(player1.gameboard);
                            setPrep();
                        }else{
                            player1.gameboard.placeShip(ship.shipLength, ship.getHead()[0], ship.getHead()[1], ship.getHor(), shipID);
                        }
                    }
                }

                const lift = () => {
                    if (player1.gameboard.shipAt(Math.floor(i/10), i % 10) !== -1){
                        // unset this ship, start lifting
                        lifting = player1.gameboard.shipAt(Math.floor(i/10), i % 10);
                        player1.gameboard.unplaceShip(player1.gameboard.shipAt(Math.floor(i/10), i % 10));
                        Display.paintBoard(player1.gameboard);
                        // clearEvtLs(".cell");
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

    function setCurrent(){
        const doneBtn = selectComp(".done-btn");
        doneBtn.addEventListener("click", ()=>{
            if (lifting === -1 && stocks.length > 0){
                lifting = 5-stocks.length;
                const currentLength = stocks[stocks.length-1];
                player1.gameboard.newShip(currentLength);
                stocks.pop();
                Display.paintCurrent(currentLength);
                Display.paintStock(stocks);
                setLift();
            }else if (stocks.length === 0){
                Display.allowStart();
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
            player1.gameboard.newShip(currentLength);
            stocks.pop();
            Display.paintCurrent(currentLength);
            Display.paintStock(stocks);
            setLift();
        })
    }

    function initPrep(){
        Display.prepPage();
        Display.paintStock(stocks);
        Display.paintBoard(player1.gameboard);
        setStartUp();
    }

    function init(){
        initPrep();
    }

    return{
        init
    }
})();    

Controller.init();
