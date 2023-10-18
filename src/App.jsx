import React, { useState, useRef } from 'react';

import { fetchQandA } from './hooks/fetchQandA';
import { fetchMockQandA } from './hooks/fetchMockQandA';

import { Box } from '@mui/material';  

import THREESceneBlock from './components/THREESceneBlock';
import TrainControlBlock from './components/TrainControlBlock';
import TextInputBlock from './components/TextInputBlock';
 
import { composeSignsFromQuestionsDict, composeSignsFromSetArray, composeAnswerSign } from './utilities/generateSignsPerButtonClick';
 
import './App.css'; 

const App = () => {

    const [sceneItems, setSceneItems] = useState();
    const [gameState, setGameState] = useState('stroll'); 
    const [thisQuestion, setThisQuestion] = useState(null);
    
    const [trainSpeed, setTrainSpeed] = useState(1);
    const [oldTrainSpeed, setOldTrainSpeed] = useState(trainSpeed);

    const pivotDistanceToSign = 9; 
    const distanceToFirstSign = 5;
    const signSpacing = 4; 

    const distanceRef = useRef(0); // distance travelled  
    const finalSignAt = useRef(); // distance where the animation ends and prompts for user input
    const forceStopFlag = useRef(false);

    const canvasRef = useRef(null);
 
    const cloudFunctionURL = 'https://europe-north1-koira-363317.cloudfunctions.net/knowledgeExpressRequest'
 
    const { questionAnswerData, loaded, error } = fetchQandA(cloudFunctionURL, thisQuestion); // fetch real data from the API
    //const { questionAnswerData, loaded, error } = fetchMockQandA(cloudFunctionURL, thisQuestion); // mimic fetch and generate mock data

     


    if (loaded && gameState === 'questionSelected') {
        setGameState('showAnswerSign')
        //const newSceneItems = {};
        const positionID = 40 + distanceRef.current
        const newSceneItems = composeAnswerSign(positionID, questionAnswerData['answer'])
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
        const positionID = distanceToFirstSign + distanceRef.current
        const [waitingSignDict] = composeSignsFromSetArray(positionID, 'WaitMessages', 1, signSpacing, canvasRef)
        const newSceneItems = Object.assign({}, waitingSignDict, sceneItemsForNow);       
        return newSceneItems
    }

    const showFollowUpQuestions = () => {
        setGameState('stroll')
        const answerSign = { ...sceneItems };
        const positionID = distanceToFirstSign + distanceRef.current
        const [newSceneItems, finalSignLocation] = composeSignsFromQuestionsDict(positionID, questionAnswerData, 2, signSpacing, canvasRef)
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
                canvasRef={canvasRef} 
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
                canvasRef={canvasRef}
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