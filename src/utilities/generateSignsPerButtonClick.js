import { questions } from '../utilities/exampleQuestions';
const { worldQuestions, lifeQuestions } = questions();
const instructionSigns = [
    'Welcome aboard the Knowledge Express!',
    'If you already know what to do, click MQ, WQ, or LQ to start.',
    'Otherwise, keep reading the instructional signs.',
    'This special train ride is all about learning.',
    'It teaches you nearly everything you have ever wanted to know.',
    'You are in control of Knowledge Express at every step of the way.',
    'You choose the initial topic as well as the direction of the details you explore.',
    "Let's first take a look at how to control the train.",
    'You can control the speed of the train in several different ways:',
    'Use the throttle lever located in the middle of the control panel.',
    'Turn the mouse wheel up and down.',
    'Click any sign once, and the train will stop in front of it.',
    'To resume motion, use the throttle lever, the mouse wheel, or simply click an empty part of the screen.',
    'The gameplay proceeds as follows:',
    'First, you will either choose a question or type in a question.',
    'The WQ button will display a series of World Questions to choose from.',
    'The LQ button will display a series of Life Questions to choose from.',
    'Simply travel through the question signs and double-click any that interest you.',
    'Alternatively, the MQ (My Question) button allows you to ask whatever you want. Simply type in your question and press the "Submit" button.',
    'Whether you choose a question or type in a question, a red border will appear around it. This indicates that ChatGPT is thinking about the question.',
    'Once the answer is ready, the answer sign will "fly" right in front of the train.',
    'After you have read the answer, click the answer sign, and it will fly away.',
    'Next, you will see a series of signs that contain follow-up questions.',
    'Double-click any follow-up question, and ChatGPT will start thinking about it.',
    'After reading the answer, you will be presented with new follow-up questions.',
    'By always asking the follow-up question of your interest, you can delve into any topic as deeply as you want.',
    'Once you are done with the topic, you can click MQ, WQ, or LQ to restart.',
    'Enjoy your learning journey with Knowledge Express!',
    'Now click MQ, WQ, or LQ to start, or press "?" to read the instructions again.'
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
        signtype = 'WaitSign'
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
            height: 0.2,
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
            height: 0.2,
 
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