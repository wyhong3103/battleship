const Ship = ((length) => {

    let totalHits = 0;

    function hit(){
        totalHits += 1;
    }

    function isSunk(){
        return totalHits === length;
    }

    return{
        hit,
        isSunk,
    }
});

export default Ship;