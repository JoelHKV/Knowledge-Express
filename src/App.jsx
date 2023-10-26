import React, { useState, useRef } from 'react';

import { fetchQandA } from './hooks/fetchQandA';
import { fetchMockQandA } from './hooks/fetchMockQandA';

import { Box } from '@mui/material';  

import THREESceneBlock from './components/THREESceneBlock';
import TrainControlBlock from './components/TrainControlBlock';
import TextInputBlock from './components/TextInputBlock';
 
import { composeSignsFromQuestionsDict, composeSignsFromSetArray, composeAnswerSign } from './utilities/generateSignsDictionary';

import './App.css'; 

const App = () => {

    const [sceneItems, setSceneItems] = useState();
    const [gameState, setGameState] = useState('stroll'); 
    const [thisQuestion, setThisQuestion] = useState(null);
       
    const trainSpeedRef = useRef(1); // train speed 
    const distanceRef = useRef(0); // distance travelled  
    const finalSignAt = useRef(); // distance where the animation ends and prompts for user input 
    const canvasRef = useRef(null); // canvas dimensions for layout 
    const childRef = useRef(null); // need to call a child method for the sole purpose of...
    // rerendering the throttle lever without rerendering the whole scene when the train speed changes

    const pivotDistanceToSign = 6;
    const distanceToFirstSign = 10;
    const signSpacing = 5; 

    const cloudFunctionURL = 'https://europe-north1-koira-363317.cloudfunctions.net/knowledgeExpressRequest'
 
    const { questionAnswerData, loaded, error } = fetchQandA(cloudFunctionURL, thisQuestion); // fetch real data from the API
    //const { questionAnswerData, loaded, error } = fetchMockQandA(cloudFunctionURL, thisQuestion); // mimic fetch and generate mock data
   
    if (loaded && gameState === 'questionSelected') {
        setGameState('showAnswerSign')
        const positionID = 40 + distanceRef.current
        const newSceneItems = composeAnswerSign(positionID, questionAnswerData['answer'])
        setSceneItems(newSceneItems)
    }

    const handleAskQuestionRequest = (whichSign) => {    
        setThisQuestion(sceneItems[whichSign]['signText']) // this triggers API request from a custom hook
        setGameState('questionSelected'); 
        const keySignDistance = parseInt(whichSign)
        const onlySelectedQuestionSign = { [whichSign]: sceneItems[keySignDistance] };     
        const newSceneItems = addWaitmessages(onlySelectedQuestionSign)
        setSceneItems(newSceneItems)
    };

    const addWaitmessages = (sceneItemsForNow) => {
        const positionID = distanceToFirstSign + distanceRef.current
        const [waitingSignDict] = composeSignsFromSetArray(positionID, 'WaitMessages', 3, signSpacing, canvasRef)
        const newSceneItems = Object.assign({}, waitingSignDict, sceneItemsForNow);       
        return newSceneItems
    }

    const showFollowUpQuestions = () => {
        setGameState('stroll')
        const answerSign = { ...sceneItems };
        const positionID = distanceToFirstSign + distanceRef.current
        const [newSceneItems, finalSignLocation] = composeSignsFromQuestionsDict(positionID, questionAnswerData, 3, signSpacing, canvasRef)
        finalSignAt.current = finalSignLocation         
        const newSceneItems2 = Object.assign({}, answerSign, newSceneItems);
        setSceneItems(newSceneItems2)
    }

    const handleMouseWheelScroll = (event) => {
        const direction = Math.sign(event.deltaY)
        childRef.current.handleMouseWheelFromParent(direction);
    }

    const stopOrResumeMotion = (mode) => {
        childRef.current.stopOrResumeMotion(mode)
    }

    return (  
        <Box className="appContainer" onWheel={handleMouseWheelScroll}>                                                
            <THREESceneBlock
                sceneItems={sceneItems}
                setSceneItems={setSceneItems}
                distanceRef={distanceRef}
                pivotDistanceToSign={pivotDistanceToSign}
                handleAskQuestionRequest={handleAskQuestionRequest}
                showFollowUpQuestions={showFollowUpQuestions}
                finalSignAt={finalSignAt}
                gameState={gameState}
                setGameState={setGameState}
                trainSpeedRef={trainSpeedRef}
                stopOrResumeMotion={stopOrResumeMotion}
                canvasRef={canvasRef}
            />
            <TrainControlBlock 
                distanceRef={distanceRef}
                finalSignAt={finalSignAt}
                setGameState={setGameState}
                setSceneItems={setSceneItems}
                pivotDistanceToSign={pivotDistanceToSign}
                distanceToFirstSign={distanceToFirstSign}
                signSpacing={signSpacing}
                trainSpeedRef={trainSpeedRef}
                canvasRef={canvasRef}
                refe={childRef}                
            />
            {gameState === 'input' &&
                <TextInputBlock
                    setThisQuestion={setThisQuestion}
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