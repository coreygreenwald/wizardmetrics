export const mostCommonJourney = (journey) => {
    return journey.map(actions => {
        let totalCount = 0;
        let maxIndex = 0;
        for(let i = 0; i < actions.length; i++){
            const {metaData, actionData } = actions[i];
            totalCount += metaData.count;
            if(metaData.count > actions[maxIndex]){
              maxIndex = i;
            }
        }
        return {
            actionData: actions[maxIndex].actionData,
            percent: ((actions[maxIndex].metaData.count / totalCount) * 100).toFixed(2),
            time: (actions[maxIndex].metaData.secondsOnAction / actions[maxIndex].metaData.count).toFixed(2),
            occurrences: actions[maxIndex].metaData.count
        }
    })
}