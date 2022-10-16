const Ship = ((shipLength, head, isHorizontal) => {

    let totalHits = 0;
    let shipHead = head;
    let isHor = isHorizontal;

    function hit(){
        totalHits += 1;
    }

    function isSunk(){
        return totalHits === shipLength;
    }

    function setHead(head){
        shipHead = head;
    }

    function getHead(){
        return shipHead
    }

    function setHor(isHorizontal){
        isHor = isHorizontal;
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