import React, { useEffect, useState, useRef } from 'react';

import { Canvas, useFrame } from '@react-three/fiber';

 

import { Stars } from '@react-three/drei';


import * as THREE from 'three';



import { getQandA } from './hooks/getQandA';
//import { getMockQandA } from './hooks/getMockQandA';

import { Grid, Button, Box } from '@mui/material'; // use MUI component library

import THREESceneBlock from './components/THREESceneBlock';
 
import THREERailroadBlock from './components/THREERailroadBlock';


import TrainControlBlock from './components/TrainControlBlock';
import TextInputBlock from './components/TextInputBlock';
 
import THREESignBlockCustomRerender from './components/THREESignBlockCustomRerender';
 
import { addWhatToDict, composeDict } from './utilities/generateSignsPerButtonClick';
 
import './App.css'; 

const App = () => {




     

   // const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    const [sceneItems, setSceneItems] = useState();
    const [gameState, setGameState] = useState('stroll'); 
    const [thisQuestion, setThisQuestion] = useState(null);
    
    const [trainSpeed, setTrainSpeed] = useState(1);
    const [oldTrainSpeed, setOldTrainSpeed] = useState(trainSpeed);

    const [locationID, setLocationID] = useState(); // location of own text entry sign
    
    const pivotDistanceToSign = 9; 
    const distanceToFirstSign = 5;
    const signSpacing = 1; 

    const distanceRef = useRef(0); // distance travelled  
    const finalSignAt = useRef(); // distance where the animation ends and prompts for user input

    const forceStopFlag = useRef(false);
    const activeSignIDRef = useRef(-1)
     
    const isFirstTriggerRef = useRef(true); // dummy to prevent a burst of calls 
    
    
    const cloudFunctionURL = 'https://europe-north1-koira-363317.cloudfunctions.net/knowledgeExpressRequest'

     
    const { questionAnswerData, loaded, error } = getQandA(cloudFunctionURL, thisQuestion); // thisQuestion

    
    
    if (loaded && gameState === 'questionSelected') {
        console.log('addAnswer')
        setGameState('showAnswerSign')
        const newSceneItems = { };
        newSceneItems[parseInt(distanceRef.current) + 40] = addWhatToDict('Answer', questionAnswerData['answer'])                      
        setSceneItems(newSceneItems)
    }






 
    const upDateUseRefs = (finalSignLocation) => {          
        finalSignAt.current = finalSignLocation     
    }
  
    const handleCanvasClick = () => {  
         // empty canvas click can mean three different things

        if (gameState === 'stroll') {
        
            if (activeSignIDRef.current > 0) { // sign has been selected once
                setTimeout(() => {
                    handleActiveSignClick(-1) // undo the selection 
                }, 40);
            }
 
            if (forceStopFlag.current) { // sign has stopped the train
                backToMotionAfterForcedStop() // back to motion
                return
            }                         
        }    
        if (gameState === 'input') {
            setGameState('stroll')
            setTrainSpeed(oldTrainSpeed)
            setSceneItems({})
        }

    }

    const handleActiveSignClick = (signID) => { 
        if (isFirstTriggerRef.current) {
            activeSignIDRef.current = signID
        }
        isFirstTriggerRef.current = false
        setTimeout(() => {
            isFirstTriggerRef.current = true
        }, 100);
    }
    


    const backToMotionAfterForcedStop = () => {       
        forceStopFlag.current = false         
        setTrainSpeed(oldTrainSpeed)
        setGameState('stroll')   
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
        console.log('showFollowUpQuestions', forceStopFlag.current, oldTrainSpeed, trainSpeed)
        //setTrainSpeed(oldTrainSpeed)
        const answerSign = { ...sceneItems };
        const [newSceneItems, firstItemAt, finalSignLocation] = composeDict('QuestionDict', questionAnswerData, 2, signSpacing, distanceToFirstSign + distanceRef.current)
        upDateUseRefs(finalSignLocation)
        const newSceneItems2 = Object.assign({}, answerSign, newSceneItems);
        setSceneItems(newSceneItems2)
    }

    
    const writeOwnQuestionAndGo = (ownQuestion) => {
        setTrainSpeed(oldTrainSpeed)
        setThisQuestion(ownQuestion)
        setGameState('questionSelected');
        const ownQuestionItem = sceneItems
        ownQuestionItem[locationID]['signText'] = ownQuestion   
        const newSceneItems = addWaitmessages(ownQuestionItem)
        setSceneItems(newSceneItems)

    }
       
   
    
    return (      
        <Box className="appContainer">                                       
            <THREESceneBlock
               // camera={camera}
                sceneItems={sceneItems}
                distanceRef={distanceRef}
                forceStopFlag={forceStopFlag}
                activeSignIDRef={activeSignIDRef}
                pivotDistanceToSign={pivotDistanceToSign}
                handleCanvasClick={handleCanvasClick}
                handleAskQuestionRequest={handleAskQuestionRequest}
                handleActiveSignClick={handleActiveSignClick}
                showFollowUpQuestions={showFollowUpQuestions}
                finalSignAt={finalSignAt}
                trainSpeed={trainSpeed}
                setTrainSpeed={setTrainSpeed}
                setOldTrainSpeed={setOldTrainSpeed}
                 
            />
                <TrainControlBlock                   
                    upDateUseRefs={upDateUseRefs}
                    distanceRef={distanceRef}
                    gameState={gameState}
                    setGameState={setGameState}
                    setSceneItems={setSceneItems}
                    setTrainSpeed={setTrainSpeed}
                    pivotDistanceToSign={pivotDistanceToSign}
                    distanceToFirstSign={distanceToFirstSign}
                    signSpacing={signSpacing}
                    trainSpeed={trainSpeed}
                    setLocationID={setLocationID}
                    setOldTrainSpeed={setOldTrainSpeed}
                    forceStopFlag={forceStopFlag}
                />

            {gameState === 'input' && <TextInputBlock
                handleSubmitTextEntry={writeOwnQuestionAndGo}
            />
            }  

                      
        </Box>                      
    );
};

export default App;