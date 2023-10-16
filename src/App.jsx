import React, { useEffect, useState, useRef } from 'react';

import { Canvas, useFrame } from '@react-three/fiber';

 

import { PerspectiveCamera, OrbitControls, Stars } from '@react-three/drei';


import * as THREE from 'three';

 
import { useDispatch, useSelector } from 'react-redux';
import { newGameMode } from './reducers/knowledgeExpressSlice';

import { getQandA } from './hooks/getQandA';
//import { getMockQandA } from './hooks/getMockQandA';

import { Grid, Button, Box } from '@mui/material'; // use MUI component library


import THREECubeBlock from './components/THREECubeBlock';
import THREERailroadBlock from './components/THREERailroadBlock';
import TrainControlBlock from './components/TrainControlBlock';


import TextInputBlock from './components/TextInputBlock';

import THREESignBlock from './components/THREESignBlock';
import THREESignBlockCustomRerender from './components/THREESignBlockCustomRerender';
 
import { addWhatToDict, composeDict } from './utilities/generateSignsPerButtonClick';
 
import './App.css'; 

const App = () => {





    
    const gameMode = useSelector((state) => state.counter[0].gameMode); // 'intro' vs 'practice' vs 'quiz' vs 'finish'

    const dispatch = useDispatch();


    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    const [sceneItems, setSceneItems] = useState();
    const [gameState, setGameState] = useState('stroll'); 
    const [thisQuestion, setThisQuestion] = useState(null);
    
    const [trainSpeed, setTrainSpeed] = useState(1);
    const [oldTrainSpeed, setOldTrainSpeed] = useState(trainSpeed);
    const stopDistanceBeforeLastSign = 6;
     

    const followupQuestionOffset = 4

    const answerFinalDistance = 6


    const renderingHorizon = 40; // distance of rending along the future path

    const distanceRef = useRef(0); // distance travelled
    //const speedRef = useRef(1); // speed
    const stopAt = useRef(Infinity); // sign at distance that forces us to stop
     
    const finalSignAt = useRef(); // distance where the animation ends and prompts for user input

    const forceStopFlag = useRef(false);
    const activeSignIDRef = useRef(-1)
     
    const isFirstTriggerRef = useRef(true); // dummy to prevent a burst of calls 
    
     

    const cloudFunctionURL = 'https://europe-north1-koira-363317.cloudfunctions.net/knowledgeExpressRequest'

     
    const { questionAnswerData, loaded, error } = getQandA(cloudFunctionURL, thisQuestion); // thisQuestion

    console.log(gameState, loaded)
    
    if (loaded && gameState === 'questionSelected') {
        console.log('addAnswer')
        setGameState('showAnswerSign')
        const newSceneItems = { };
        newSceneItems[parseInt(distanceRef.current) + answerFinalDistance] = addWhatToDict('Answer', questionAnswerData['answer'])                      
        setSceneItems(newSceneItems)
    }

    const upDateUseRefs = (finalSignLocation) => {          
        finalSignAt.current = finalSignLocation     
    }
  
    const handleCanvasClick = () => {  // clicking empty part of canvas unselects
        if (gameState === 'stroll') {
        // empty canvas click can serve three different purposes

            if (activeSignIDRef.current > 0) { // sign has been selected once
                setTimeout(() => {
                    handleActiveSignClick(-1) // undo the selection 
                }, 40);
            }
 
            if (forceStopFlag.current) { // sign has stopped the train
                backToMotionAfterForcedStop() // back to motion
                return
            }      
            else if (activeSignIDRef.current < 0) { //nothing is going on
                forceStopFlag.current = true // stop the train
            } 
                    
        }    
        if (gameState === 'input') {
            setGameState('stroll')
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
        const [waitingSignDict, firstItemAt, lastItemAt] = composeDict('WaitMessages', null, 30, 5, 2 + distanceRef.current)
        const newSceneItems = Object.assign({}, waitingSignDict, sceneItemsForNow);
         
        return newSceneItems
    }



    const showFollowUpQuestions = () => {
        setGameState('stroll')
        const answerSign = { ...sceneItems };
        const [newSceneItems, firstItemAt, finalSignLocation] = composeDict('QuestionDict', questionAnswerData, 2, 5, followupQuestionOffset + distanceRef.current)
        upDateUseRefs(finalSignLocation)
        const newSceneItems2 = Object.assign({}, answerSign, newSceneItems);
        setSceneItems(newSceneItems2)
    }

    const openTextEntry = () => {
   
        

    }
    const writeOwnQuestionAndGo = (ownQuestion, locationID) => {
         
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
            if (distanceRef.current >= finalSignAt.current - stopDistanceBeforeLastSign) {
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
                    trainSpeed={trainSpeed}
                    setOldTrainSpeed={setOldTrainSpeed}
                    forceStopFlag={forceStopFlag}
                    writeOwnQuestionAndGo={writeOwnQuestionAndGo}
                    backToMotionAfterForcedStop={backToMotionAfterForcedStop}
                    openTextEntry={openTextEntry}
                    />
           
                      
        </Box>                      
    );
};

export default App;