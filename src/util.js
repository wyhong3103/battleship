function shuffle(array) {
    let currentIndex = array.length; let  randomIndex;
  
    // While there remain elements to shuffle.
    while (currentIndex !== 0) {
  
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex-=1;
  
      // And swap it with the current element.
      // eslint-disable-next-line no-param-reassign
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
}

function createComp(type, cls = ""){
    const element = document.createElement(type);
    if (cls !== ""){
        element.classList.add(cls);
    }
    return element;
}

function selectComp(selector){
    return document.querySelector(selector);
}

function selectComps(selector){
    return document.querySelectorAll(selector);
}


export {
    shuffle,
    createComp,
    selectComp,
    selectComps
};