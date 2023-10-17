import React, { useState, useRef } from 'react';

import { getQandA } from './hooks/getQandA';
//import { getMockQandA } from './hooks/getMockQandA';

import { Box } from '@mui/material'; // use MUI component library

import THREESceneBlock from './components/THREESceneBlock';
import TrainControlBlock from './components/TrainControlBlock';
import TextInputBlock from './components/TextInputBlock';
 
 
import { addWhatToDict, composeDict } from './utilities/generateSignsPerButtonClick';
 
import './App.css'; 

const App = () => {

    const [sceneItems, setSceneItems] = useState();
    const [gameState, setGameState] = useState('stroll'); 
    const [thisQuestion, setThisQuestion] = useState(null);
    
    const [trainSpeed, setTrainSpeed] = useState(1);
    const [oldTrainSpeed, setOldTrainSpeed] = useState(trainSpeed);

    const pivotDistanceToSign = 9; 
    const distanceToFirstSign = 5;
    const signSpacing = 1; 

    const distanceRef = useRef(0); // distance travelled  
    const finalSignAt = useRef(); // distance where the animation ends and prompts for user input
    const forceStopFlag = useRef(false);
 
    const cloudFunctionURL = 'https://europe-north1-koira-363317.cloudfunctions.net/knowledgeExpressRequest'
 
    const { questionAnswerData, loaded, error } = getQandA(cloudFunctionURL, thisQuestion); // thisQuestion
 
    if (loaded && gameState === 'questionSelected') {
        console.log('addAnswer')
        setGameState('showAnswerSign')
        const newSceneItems = { };
        newSceneItems[parseInt(distanceRef.current) + 40] = addWhatToDict('Answer', questionAnswerData['answer'])                      
        setSceneItems(newSceneItems)
    }

    const handleAskQuestionRequest = (whichSign) => {
        setThisQuestion(sceneItems[whichSign]['signText']) // this triggers API request from a custom hook
        setGameState('questionSelected'); 
        const keySignDistance = parseInt(whichSign)
        //reduce the signs to the selected question
        const onlySelectedQuestionSign = { [whichSign]: sceneItems[keySignDistance] };     
        const newSceneItems = addWaitmessages(onlySelectedQuestionSign)
        setSceneItems(newSceneItems)
    };

    const addWaitmessages = (sceneItemsForNow) => {
        const [waitingSignDict, firstItemAt, lastItemAt] = composeDict('WaitMessages', null, 30, signSpacing, distanceToFirstSign + distanceRef.current)
        const newSceneItems = Object.assign({}, waitingSignDict, sceneItemsForNow);       
        return newSceneItems
    }

    const showFollowUpQuestions = () => {
        setGameState('stroll')
        const answerSign = { ...sceneItems };
        const [newSceneItems, firstItemAt, finalSignLocation] = composeDict('QuestionDict', questionAnswerData, 2, signSpacing, distanceToFirstSign + distanceRef.current)
        finalSignAt.current = finalSignLocation         
        const newSceneItems2 = Object.assign({}, answerSign, newSceneItems);
        setSceneItems(newSceneItems2)
    }
     
    return (      
        <Box className="appContainer">                                       
            <THREESceneBlock
                sceneItems={sceneItems}
                setSceneItems={setSceneItems}
                distanceRef={distanceRef}
                forceStopFlag={forceStopFlag}
                pivotDistanceToSign={pivotDistanceToSign}
                handleAskQuestionRequest={handleAskQuestionRequest}
                showFollowUpQuestions={showFollowUpQuestions}
                finalSignAt={finalSignAt}
                gameState={gameState}
                setGameState={setGameState}
                trainSpeed={trainSpeed}
                setTrainSpeed={setTrainSpeed}
                oldTrainSpeed={oldTrainSpeed}
                setOldTrainSpeed={setOldTrainSpeed}
                 
            />
            <TrainControlBlock                   
                distanceRef={distanceRef}
                finalSignAt={finalSignAt}
                gameState={gameState}
                setGameState={setGameState}
                setSceneItems={setSceneItems}
                setTrainSpeed={setTrainSpeed}
                pivotDistanceToSign={pivotDistanceToSign}
                distanceToFirstSign={distanceToFirstSign}
                signSpacing={signSpacing}
                trainSpeed={trainSpeed}
                setOldTrainSpeed={setOldTrainSpeed}
                forceStopFlag={forceStopFlag}
            />
            {gameState === 'input' &&
                <TextInputBlock
                    setThisQuestion={setThisQuestion}
                    setTrainSpeed={setTrainSpeed}
                    oldTrainSpeed={oldTrainSpeed}
                    setGameState={setGameState}
                    sceneItems={sceneItems}
                    setSceneItems={setSceneItems}
                    addWaitmessages={addWaitmessages}
                />
            }                       
        </Box>                      
    );
};
 
export default App;