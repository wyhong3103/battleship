const Ship = ((shipLength, head, isHorizontal) => {

    let totalHits = 0;
    // shipHead is an array of [x,y]
    let shipHead = head;
    let isHor = isHorizontal;

    function hit(){
        totalHits += 1;
    }

    function isSunk(){
        return totalHits === shipLength;
    }

    function setHead(newHead){
        shipHead = newHead;
    }

    function getHead(){
        return shipHead
    }

    function setHor(isHori){
        isHor = isHori;
    }

    function getHor(){
        return isHor;
    }

    return{
        hit,
        isSunk,
        shipLength,
        setHead,
        getHead,
        setHor,
        getHor
    }
});

export default Ship;