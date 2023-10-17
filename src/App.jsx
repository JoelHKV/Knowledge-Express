import React, { useEffect, useState, useRef } from 'react';

import { Canvas, useFrame } from '@react-three/fiber';

 

import { Stars } from '@react-three/drei';


import * as THREE from 'three';



import { getQandA } from './hooks/getQandA';
//import { getMockQandA } from './hooks/getMockQandA';

import { Grid, Button, Box } from '@mui/material'; // use MUI component library


 
import THREERailroadBlock from './components/THREERailroadBlock';
import TrainControlBlock from './components/TrainControlBlock';
import TextInputBlock from './components/TextInputBlock';
 
import THREESignBlockCustomRerender from './components/THREESignBlockCustomRerender';
 
import { addWhatToDict, composeDict } from './utilities/generateSignsPerButtonClick';
 
import './App.css'; 

const App = () => {




     

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    const [sceneItems, setSceneItems] = useState();
    const [gameState, setGameState] = useState('stroll'); 
    const [thisQuestion, setThisQuestion] = useState(null);
    
    const [trainSpeed, setTrainSpeed] = useState(1);
    const [oldTrainSpeed, setOldTrainSpeed] = useState(trainSpeed);

    const [locationID, setLocationID] = useState(); // location of own text entry sign


     
    const pivotDistanceToSign = 9; 

    const distanceToFirstSign = 5;
    const signSpacing = 1; 


    const renderingHorizon = 40; // distance of rending along the future path

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
  
    const handleCanvasClick = () => {  // clicking empty part of canvas unselects
         

        if (gameState === 'stroll') {
        // empty canvas click can mean three different purposes

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
       
    const LocomotionAnimation = () => {
        
        camera.position.set(0, 2, distanceRef.current);
        camera.lookAt(0, 2, distanceRef.current + 1);  
        let timeStamp = Date.now()
      
        useFrame(() => {
            const timeNow = Date.now()
            const deltaTime = timeNow - timeStamp
            //console.log(forceStopFlag.current)
            if (distanceRef.current >= finalSignAt.current - pivotDistanceToSign) {
                forceStopFlag.current=true              
            }
            if (forceStopFlag.current && trainSpeed > 0) {
                setOldTrainSpeed(trainSpeed)
                setTrainSpeed(0)
            }

            distanceRef.current += trainSpeed * deltaTime / 1000
            camera.position.z = distanceRef.current 

            timeStamp = timeNow
        });

        return null;  
    };
    
    return (      
        <Box className="appContainer">                                       
            <div className="canvas-container" >
                <Canvas camera={camera} gl={{ antialias: true }} style={{ zIndex: 0 }} onClick={() => handleCanvasClick()}>                    
                    <ambientLight intensity={0.3} />
                    <directionalLight position={[0, 10, 0]} intensity={0.5}/>
                    <Stars />     
                   
                    <THREERailroadBlock distanceRef={distanceRef}/>
                     
                    {sceneItems && Object.entries(sceneItems).map(([key, value]) => ( // SIGNS
                        (key > distanceRef.current && key < distanceRef.current + renderingHorizon &&
                            <THREESignBlockCustomRerender
                            key={key}
                            distance={key}
                            width={value.width}
                            height={value.height}
                            signText={value.signText}
                            ownQuestionSign={value.ownQuestionSign}                          
                            startingSignState={value.startingSignState}
                            answerSign={value.answerSign}
                            clickable={value.clickable}
                            fallable={value.fallable}
                            distanceRef={distanceRef}
                            activeSignIDRef={activeSignIDRef}
                            forceStopFlag={forceStopFlag}
                            pivotDistanceToSign={pivotDistanceToSign}
                            handleAskQuestionRequest={handleAskQuestionRequest}
                            handleActiveSignClick={handleActiveSignClick}
                            showFollowUpQuestions={showFollowUpQuestions}
                        />)
                    ))}

                                { /* <OrbitControls/>*/}
                             
                    <LocomotionAnimation />                           
                </Canvas>
            </div>
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