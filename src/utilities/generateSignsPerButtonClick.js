import { questions } from '../utilities/exampleQuestions';
const { worldQuestions, lifeQuestions } = questions();
const instructionSigns = ['Welcome onboard to Knowledge Express!',
    'Here you will enjoy while learn about the world, life and whatever you want',
    'Click WQ or LQ for a quick start or MQ to write your own question!'
];

export const composeDict = (signType, textContent, nroItems, spacing, positionOffset) => {
    console.log(signType)
    const tempDict = {} // init sceneItems dictionary from initial railroad sign
    let firstLocation
    let lastLocation
   // let positionCounter = spacing * (i + 1) + parseInt(positionOffset, 10)
    if (signType === 'QuestionDict') {
        let i = 0; 
        for (const key in textContent) {
            if (key.startsWith("q")) {
                const positionCounter = spacing * (i + 1) + parseInt(positionOffset, 10)
                textContent[key]
                tempDict[positionCounter] = addWhatToDict('NewQuestion', textContent[key], i)
                if (i === 0) {
                    firstLocation = positionCounter
                }
                 lastLocation = positionCounter
                i++;
            }
             
             
        }

    }

    else {
        if (signType === 'Instructions') {
            nroItems = instructionSigns.length;
        }
        for (let i = 0; i < nroItems; i++) {
            const positionCounter = spacing * (i + 1) + parseInt(positionOffset, 10)
            tempDict[positionCounter] = addWhatToDict(signType, textContent, i)
            if (i === 0) {
                firstLocation = positionCounter
            }
            if (i === nroItems - 1) {
                lastLocation = positionCounter
            }
        }
    }
    if (signType !== 'Instructions' && signType !== 'WaitMessages') {
        const finalSignText = 'You have not done anything for a while. Click any Question Button to keep the train going!' 
        lastLocation += spacing
        tempDict[lastLocation] = addWhatToDict('custom', finalSignText)
    }

    return [tempDict, firstLocation, lastLocation]
}






export const addWhatToDict = (signType, textContent, itemNro) => {

   
    
    let thisQuestion

    const waitMessages = ['ChatGPT is thinking.', 'Wait patiently', 'Just a little longer', 'The answer is coming.']


    if (signType === 'WorldQuestion') {
        return {
            width: getRandomNumber(-4, 4),
            height: 2,
            signText: worldQuestions[getRandomNumber(0, worldQuestions.length - 1)],
            standUpright: true,
            selectedOnce: false,
            selectedTwice: false,
            answerSign: false,
            immune: false,
        };
    }
    if (signType === 'LifeQuestion') {
        return {
            width: getRandomNumber(-4, 4),
            height: 2,
            signText: lifeQuestions[getRandomNumber(0, lifeQuestions.length - 1)],
            standUpright: true,
            selectedOnce: false,
            selectedTwice: false,
            answerSign: false,
            immune: false,
        };
    }
    if (signType === 'Instructions') {
        return {
            width: getRandomNumber(-4, 4),
            height: 2,
            signText: instructionSigns[itemNro],
            standUpright: true,
            selectedOnce: false,
            selectedTwice: false,
            answerSign: false,
            immune: true,
        };
    }



    if (signType === 'WaitMessages') {
        thisQuestion = waitMessages[getRandomNumber(0, waitMessages.length - 1)]
        return {
            width: Math.sign((Math.random()-0.5)) * getRandomNumber(4, 8),
            height: 1,
            signText: thisQuestion,
            standUpright: true,
            selectedOnce: false,
            selectedTwice: false,
            answerSign: false,
            immune: true,
        }; 
    }
    if (signType === 'custom') {
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


    if (signType === 'Answer') {
        thisQuestion = textContent
        return {
            width: 0,
            height: 0.5,
            signText: textContent,
            standUpright: true,
            selectedOnce: false,
            selectedTwice: false,
            answerSign: true,
            immune: false,
        };
    }

    if (signType === 'NewQuestion') {
        return {
            width: getRandomNumber(-4, 4),
            height: 2,
            signText: textContent,
            standUpright: true,
            selectedOnce: false,
            selectedTwice: false,
            answerSign: false,
            immune: false,
        };
    }

}



const getRandomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};