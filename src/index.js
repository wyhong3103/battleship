import { selectComps} from "./util";
import Player from "./player";
import Display from "./display";

const Controller = (() => {
    const player1 = Player();
    // const computer = Player();
    let lifting = -1;
    
    // Variable for preparation stage
    const stocks = [2, 3, 3, 4, 5];

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
                if (player1.gameboard.shipAt(Math.floor(i/10), i % 10) !== -1){
                    // unset this ship, start lifting
                    lifting = player1.gameboard.shipAt(Math.floor(i/10), i % 10);
                    player1.gameboard.unplaceShip(player1.gameboard.shipAt(Math.floor(i/10), i % 10));
                    Display.paintBoard(player1.gameboard);
                    // clearEvtLs(".cell");
                    setLift();
                }
            })
        }
    }

    function initPrep(){
        Display.prepPage();
        Display.paintStock(stocks);
        player1.gameboard.placeShip(3, 0, 0, true);
        player1.gameboard.placeShip(3, 2, 0, true);
        Display.paintBoard(player1.gameboard);
        setPrep();
    }

    function init(){
        initPrep();
    }

    return{
        init
    }

})();    

Controller.init();