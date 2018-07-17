export const mostCommonJourney = (journey) => {
    let totalSignups = 0;
    let journeyData = journey.map(actions => {
        let totalCount = 0;
        let conversionsAtStep = 0;
        let maxIndex = 0;
        for(let i = 0; i < actions.length; i++){
            const {metaData, actionData } = actions[i];
            if(actionData.isConversion){
                conversionsAtStep += metaData.count;
            }
            if(metaData.identifiers){
                totalSignups += metaData.identifiers.length;
            }
            totalCount += metaData.count;
            if(metaData.count > actions[maxIndex].metaData.count){
              maxIndex = i;
            }
        }
        //to eventually do on BE
        delete actions[maxIndex].metaData.referrers[null]
        return {
            actionData: actions[maxIndex].actionData,
            referrers: actions[maxIndex].metaData.referrers,
            identifiers: actions[maxIndex].metaData.identifiers,
            totalActionCount: actions[maxIndex].metaData.count,
            percent: Math.floor((actions[maxIndex].metaData.count / totalCount) * 100),
            time: (actions[maxIndex].metaData.secondsOnAction / actions[maxIndex].metaData.count).toFixed(2),
            occurrences: actions[maxIndex].metaData.count,
            totalCount: totalCount,
            conversionsAtStep: conversionsAtStep
        }
    })
    return {
        journey: journeyData,
        totalSignups: totalSignups
    }
}