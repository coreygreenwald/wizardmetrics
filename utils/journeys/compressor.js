/*
    Compressor function takes in 3 arguments
    1. An Uncompressed Journey object
    2. An object containing two properties of type {model: 'IMPACT', weight: 'MOST}
    3. An options obejct containing any information to be relayed to the subfunctions for each compression builder.
*/

const client = require('../../cache');

const compressor = (customerId, journeyId, journey, type, options) => {
    let totalSignups = 0;
    let journeyData = journey.map(actions => {
        let totalCount = 0;
        let conversionsAtStep = 0;
        let maxIndex = 0;
        let allIdentifiers = [];
        let totalBreaks = 0;
        let conversionType = options.conversionType || 'BOTH';
        for(let i = 0; i < actions.length; i++){
            const {metaData, actionData } = actions[i];
            if(actionData.isConversion){
                conversionsAtStep += metaData.count;
            }
            if(metaData.identifiers){
                totalSignups += metaData.identifiers.length;
                allIdentifiers = allIdentifiers.concat(metaData.identifiers);
            }
            totalCount += metaData.count;
            totalBreaks += metaData.breakCounter;
            let futureConversionCount;
            let maxIndexConversionCount;
            if(conversionType === 'HARD'){
                futureConversionCount = metaData.futureConversionCounter.hard;
                maxIndexConversionCount = actions[maxIndex].metaData.futureConversionCounter.hard;
            } else if(conversionType === 'SOFT'){
                futureConversionCount = metaData.futureConversionCounter.soft;
                maxIndexConversionCount = actions[maxIndex].metaData.futureConversionCounter.soft;
            } else {
                futureConversionCount = metaData.futureConversionCounter.hard + metaData.futureConversionCounter.soft;
                maxIndexConversionCount = actions[maxIndex].metaData.futureConversionCounter.hard + actions[maxIndex].metaData.futureConversionCounter.hard;
            }
            if(
                (type.model === 'IMPACT' && futureConversionCount > maxIndexConversionCount) || 
                (type.model === 'COMMON' && metaData.count > actions[maxIndex].metaData.count)
            ) {
                maxIndex = i;
            }
        }
        delete actions[maxIndex].metaData.referrers[null]
        return {
            maxIndex: maxIndex,
            actionData: actions[maxIndex].actionData,
            metaData: actions[maxIndex].metaData,
            referrers: actions[maxIndex].metaData.referrers,
            identifiers: actions[maxIndex].metaData.identifiers,
            allIdentifiers: allIdentifiers,
            totalActionCount: actions[maxIndex].metaData.count,
            percent: Math.floor((actions[maxIndex].metaData.count / totalCount) * 100),
            time: (actions[maxIndex].metaData.secondsOnAction / (actions[maxIndex].metaData.count - actions[maxIndex].metaData.breakCounter)).toFixed(2),
            breakCounter: actions[maxIndex].metaData.breakCounter,
            occurrences: actions[maxIndex].metaData.count,
            totalCount: totalCount,
            totalBreaks: totalBreaks,
            conversionsAtStep: conversionsAtStep
        }
    })
    const cacheObj = {
        journeyData,
        totalSignups
    }
    console.log('REDIS CACHE --> ', `${customerId}:${journeyId}:${type.model}-${type.weight}`)
    client.actions.setObj(`${customerId}:${journeyId}:${type.model}-${type.weight}`, cacheObj)
    return cacheObj
}

module.exports = compressor;