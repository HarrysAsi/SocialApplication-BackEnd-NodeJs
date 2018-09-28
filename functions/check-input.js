function checkUndefined(object){
    for(let ob in object){
        if(object[ob] === undefined){
            return true;
        }
    }
    return false;
}

module.exports = checkUndefined;