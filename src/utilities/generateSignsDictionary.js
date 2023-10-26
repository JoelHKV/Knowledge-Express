
import { shuffleFisherYates, getRandomNumber } from '../utilities/numberCruching.js';

import { lifeQuestions } from '../utilities/lifeQuestions';
import { worldQuestions } from '../utilities/worldQuestions';
import { instructionText } from '../utilities/instructionText';
import { waitMessages } from '../utilities/waitMessages';
import { finalSignText } from '../utilities/finalSignText';

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
    tempDict[positionID] = addWhatToDict('endMessage', finalSignText)
    return [tempDict, positionID]
    
}

export const composeSignsFromSetArray = (positionID, arrayName, nroRepeat, spacing, canvasRef) => {
    const tempDict = {}
    positionID = Math.ceil(positionID)
    let signArray
    
    let signtype
    if (arrayName === 'Instructions') {
        signArray = instructionText
        signtype = 'GameInfo'
    }
    if (arrayName === 'WaitMessages') {
        signArray = waitMessages
        signtype = 'WaitSign'
    }
    if (arrayName === 'WorldQuestion') {
        signArray = shuffleFisherYates(worldQuestions)
        signtype = 'RegularQuestion'
    }
    if (arrayName === 'LifeQuestion') {
        signArray = shuffleFisherYates(lifeQuestions)
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
    textContent = textContent?.trim();
    let maxWidth = 4;
    if (canvasRef) {
        maxWidth = canvasRef.current.offsetWidth/225-0.6
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
            height: 1.25,
            signText: textContent,
            answerSign: false,           
            clickable: true,
            fallable: true,
        };
    }

    if (signType === 'GameInfo') {
        return {
            width: getRandomNumber(-maxWidth, maxWidth),
            height: 1.25,
            signText: textContent,
            answerSign: false,
            clickable: false,
            fallable: true,
        };
    }
    if (signType === 'WaitSign') {
        return {
            width: 4 * Math.sign(Math.random()-0.5),
            height: 1.25,
            signText: textContent,
            answerSign: false,
            clickable: false,
            fallable: true,
        };
    }
  
    if (signType === 'endMessage') {
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
        return {
            width: 0,
            height: 0.4,
 
            signText: textContent,
            answerSign: true,     
            clickable: true,
            fallable: true,
        };
    }

}
