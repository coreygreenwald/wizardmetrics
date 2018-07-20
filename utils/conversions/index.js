//Returns an instance of action.
const compareActionToConversions = (action, conversions) => {
    let referrer = action.referrer;
    delete action.referrer;
    for(let i = 0; i < conversions.length; i++){
        if(conversions[i].compareActionToConversion(action)){
            action.isConversion = true;
            action.conversionId = conversions[i].id;
            break;
        }
    }
    if(action.isConversion && !conversions.map(conversion => conversion.id).includes(action.conversionId)){
        action.conversionId = null;
        action.isConversion = false;
    }
    action.referrer = referrer;
    return action;
}

module.exports = {
    compareActionToConversions
}