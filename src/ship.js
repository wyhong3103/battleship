const Ship = ((shipLength) => {

    let totalHits = 0;

    function hit(){
        totalHits += 1;
    }

    function isSunk(){
        return totalHits === shipLength;
    }

    return{
        hit,
        isSunk,
        shipLength
    }
});

export default Ship;