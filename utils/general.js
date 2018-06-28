module.exports = {
    deleteObjectKeys: (obj, arrOfKeysToDelete) => {
        for(let i = 0; i < arrOfKeysToDelete.length; i++){
            if(obj.hasOwnProperty(arrOfKeysToDelete[i])){
                delete obj[arrOfKeysToDelete[i]]
            }
        }
        return obj;
    }
}