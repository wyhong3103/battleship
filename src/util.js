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

function clearEvtLs(selector, group = false){
    if (group){
        const comps = selectComps(selector);
        for(let i = 0; i < comps.length; i++){
            const oldComp = comps[i];
            const newComp = comps[i].cloneNode(true);
            oldComp.parentNode.replaceChild(newComp, oldComp);
        }

    }else{
        const comp = selectComp(selector);
        const oldComp = comp;
        const newComp = comp.cloneNode(true);
        oldComp.parentNode.replaceChild(newComp, oldComp);
    }
}


export {
    shuffle,
    createComp,
    selectComp,
    selectComps,
    clearEvtLs
};