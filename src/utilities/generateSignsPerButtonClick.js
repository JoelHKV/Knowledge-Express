import { questions } from '../utilities/exampleQuestions';
const { worldQuestions, lifeQuestions } = questions();
const instructionSigns = ['Welcome onboard to Knowledge Express!',
    'Here you will enjoy while learn about the world, life and whatever you want',
    'Click WQ or LQ for a quick start or MQ to write your own question!'
];

const waitMessages = ['ChatGPT is thinking.', 'Wait patiently', 'Just a little longer', 'The answer is coming.']
const finalSignText = 'You have not done anything for a while. Click any Question Button to keep the train going!'


export const composeOneEmptySign = (positionID) => {
    const tempDict = {}
    tempDict[positionID] = addWhatToDict('OwnQuestion')  
    return tempDict
}

export const composeAnswerSign = (positionID, answerText) => {
    const tempDict = {}
    positionID = Math.ceil(positionID)
    tempDict[positionID] = addWhatToDict('Answer', answerText)    
    return tempDict
}

export const composeSignsFromQuestionsDict = (positionID, questionDict, nroRepeat, spacing, canvasRef) => {
    console.log(canvasRef.current.offsetWidth)
    const tempDict = {}
    positionID = Math.ceil(positionID)
    for (var i = 0; i < nroRepeat; i++) {
        for (const key in questionDict) {
            if (key.startsWith("q")) {
                tempDict[positionID] = addWhatToDict('RegularQuestion', questionDict[key], canvasRef)
                positionID = positionID + spacing
            }
        }
    }
    console.log(tempDict)
    tempDict[positionID] = addWhatToDict('endMessage', finalSignText)
    return [tempDict, positionID]
    
}

export const composeSignsFromSetArray = (positionID, arrayName, nroRepeat, spacing, canvasRef) => {
    console.log(canvasRef.current.offsetWidth)
    const tempDict = {}
    positionID = Math.ceil(positionID)
    let signArray
    
    let signtype
    if (arrayName === 'Instructions') {
        signArray = instructionSigns
        signtype = 'GameInfo'
    }
    if (arrayName === 'WaitMessages') {
        signArray = waitMessages
        signtype = 'GameInfo'
    }
    if (arrayName === 'WorldQuestion') {
        signArray = worldQuestions
        signtype = 'RegularQuestion'
    }
    if (arrayName === 'LifeQuestion') {
        signArray = lifeQuestions
        signtype = 'RegularQuestion'
    }

    for (var i = 0; i < nroRepeat; i++) {

        for (const item in signArray) {          
            tempDict[positionID] = addWhatToDict(signtype, signArray[item], canvasRef)
            positionID = positionID + spacing           
        }

    }

    if (signtype === 'RegularQuestion') {
        tempDict[positionID] = addWhatToDict('endMessage', finalSignText)
        positionID = positionID + spacing
    }
    
    return [tempDict, positionID - spacing]
}


const addWhatToDict = (signType, textContent, canvasRef) => {
   
    let maxWidth = 4;
    if (canvasRef) {
        maxWidth = canvasRef.current.offsetWidth/250
    }
 
    if (signType === 'OwnQuestion') {
        return {
            ownQuestionSign: true,
            startingSignState: 'selected',
            answerSign: false,
            clickable: false,
            fallable: false,
            height: 0.5,
            signText: '',
            width: 0,
        };

    }

    if (signType === 'RegularQuestion') {
        return {
            width: getRandomNumber(-maxWidth, maxWidth),
            height: 1.5,
            signText: textContent,
            answerSign: false,           
            clickable: true,
            fallable: true,
        };
    }

    if (signType === 'GameInfo') {
        return {
            width: getRandomNumber(-maxWidth, maxWidth),
            height: 1.5,
            signText: textContent,
            answerSign: false,
            clickable: false,
            fallable: true,
        };
    }
  
    if (signType === 'endMessage') {
      //  thisQuestion = textContent
        return {
            width: 0,
            height: 0.5,
            signText: textContent,
            answerSign: false,         
            clickable: false,
            fallable: false,
        };
    }


    if (signType === 'Answer') {
      //  thisQuestion = textContent
        return {
            width: 0,
            height: 0.5,
            signText: textContent,
            answerSign: true,     
            clickable: true,
            fallable: true,
        };
    }

}

const getRandomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};