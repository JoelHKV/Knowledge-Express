import { questions } from '../utilities/exampleQuestions';



export const composeDictOLD = (questionType, textContent, nroItems, spacing, positionOffset) => {
    const tempDict = {} // init sceneItems dictionary from initial railroad sign
    let firstLocation
    let lastLocation
    for (let i = 0; i < nroItems; i++) {
        const positionCounter = spacing * (i + 1) + positionOffset 
        tempDict[positionCounter] = addWhatToDictOLD(questionType, textContent)
        if (i === 0) {
            firstLocation = positionCounter
        }
        if (i === nroItems-1) {
            lastLocation = positionCounter
        }
    }

    const finalSignText = 'You have not done anything for a while. Click any Question Button to keep the train going!' 
    lastLocation += spacing
    tempDict[lastLocation] = addWhatToDict('custom', finalSignText)
    console.log(tempDict)

    return [tempDict, firstLocation, lastLocation]
}






export const addWhatToDictOLD = (questionType, textContent) => {

   
    const { worldQuestions, lifeQuestions } = questions();
    let thisQuestion

    const waitMessages = ['ChatGPT is thinking.', 'Wait patiently', 'Just a little longer', 'The answer is coming.']


    if (questionType === 'world') {
         thisQuestion = worldQuestions[getRandomNumber(0, worldQuestions.length - 1)]
        
    }
    if (questionType === 'life') {
         thisQuestion = lifeQuestions[getRandomNumber(0, lifeQuestions.length - 1)]
        
    }
    if (questionType === 'waitmessage') {
        thisQuestion = waitMessages[getRandomNumber(0, waitMessages.length - 1)]
        return {
            width: getRandomNumber(3, 4),
            height: 2,
            signText: thisQuestion,
            standUpright: true,
            selectedOnce: false,
            selectedTwice: false,
            answerSign: false,
            immune: true,
        }; 
    }
    if (questionType === 'custom') {
        thisQuestion = textContent
        return {
            width: getRandomNumber(0, 0),
            height: 0.5,
            signText: textContent,
            standUpright: true,
            selectedOnce: false,
            selectedTwice: false,
            answerSign: false,
            immune: true,
        };
    }


    if (questionType === 'question') {
        thisQuestion = textContent
        return {
            width: getRandomNumber(0, 0),
            height: 0.5,
            signText: textContent,
            standUpright: true,
            selectedOnce: false,
            selectedTwice: false,
            answerSign: true,
            immune: false,
        };



    }

    return {
        width: getRandomNumber(-4, 4),
        height: 2,
        signText: thisQuestion,
        standUpright: true,
        selectedOnce: false,
        selectedTwice: false,
        answerSign: false,
        immune: false,
    };

}


const getRandomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};