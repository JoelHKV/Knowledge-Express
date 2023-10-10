import React, { useEffect, useState, useRef } from 'react';

import { Canvas, useFrame } from '@react-three/fiber';

 

import { PerspectiveCamera, OrbitControls, Stars } from '@react-three/drei';


import * as THREE from 'three';

 
import { useDispatch, useSelector } from 'react-redux';
import { newGameMode } from './reducers/knowledgeExpressSlice';

import { getQandA } from './hooks/getQandA';


import { Grid, Button, Box } from '@mui/material'; // use MUI component library


import THREECubeBlock from './components/THREECubeBlock';
import THREERailroadBlock from './components/THREERailroadBlock';
import TrainControlBlock from './components/TrainControlBlock';



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
    const distanceBeforeFlipping = 3;
    const distanceBeforeStopping = 5;

    const renderingHorizon = 40; // distance of rending along the future path

    const distanceRef = useRef(0); // distance travelled
    const speedRef = useRef(1); // speed
    const stopAt = useRef(Infinity); // sign at distance that forces us to stop
    const nextAt = useRef(); // distance for the next sign to go down
    const finalSignAt = useRef(); // distance where the animation ends and prompts for user input
     
    const isFirstTriggerRef = useRef(true); // dummy to prevent a burst of calls 
    
    console.log(stopAt.current)
    const { questionAnswerData, loaded, error } = getQandA('ff', thisQuestion);
    console.log('app rerender loaded', loaded)
    if (loaded && gameState === 'questionSelected') {
        console.log('addAnswer')
        setGameState('showAnswerSign')
        const newSceneItems = { };
        newSceneItems[parseInt(distanceRef.current) + 7] = addWhatToDict('Answer', questionAnswerData['Answer'])                      
        setSceneItems(newSceneItems)
    }

    const upDateUseRefs = (firstItemAt, lastItemAt) => {             
            nextAt.current = firstItemAt             
            finalSignAt.current = lastItemAt      
    }
  
    const handleCanvasClick = () => {  // clicking empty part of canvas unselects
        if (gameState === 'stroll')   {
            setTimeout(() => {
                handleSceneElementClick(-1, false) // delay to take scene element hit first
            }, 10);
        } 
                      
            backToMotionAfterForcedStop()             
        



    }

    const backToMotionAfterForcedStop = () => {
        if (gameState === 'forceStop') { 
            console.log(gameState)
            const stopSignPosition = stopAt.current + distanceBeforeStopping
            stopAt.current = Infinity
            flipSignFindNextSign(stopSignPosition)
            setTrainSpeed(oldTrainSpeed)
            setGameState('stroll')
        } 
    }


    const handleSceneElementClick = (whichSign, selectedOnce) => {
        if (isFirstTriggerRef.current) { // we take the first trigger i.e. the closest element we hit

            if (gameState === 'showAnswerSign') { // we have clicked the answer 
                showFollowUpQuestions() // and want to see the follow up questions
                return
            } 

            updateSceneItems(whichSign, selectedOnce)                     
        }
        isFirstTriggerRef.current = false;
        setTimeout(() => {
            isFirstTriggerRef.current = true;
        }, 100);
         
    };

    const showFollowUpQuestions = () => {
        stopAt.current = distanceRef.current 
        console.log('showFollowUpQuestions', stopAt.current)
        setGameState('stroll')
      //  stopAt.current = Infinity
         
        const [newSceneItems, firstItemAt, lastItemAt] = composeDict('QuestionDict', questionAnswerData, 2, 5, distanceRef.current)
        upDateUseRefs(firstItemAt, lastItemAt)
        setSceneItems(newSceneItems)
    }


    const updateSceneItems = (whichSign, selectedOnce) => {
        const keySignDistance = parseInt(whichSign)
        if (!selectedOnce) { // we click question for the first time

            stopAt.current = whichSign - distanceBeforeStopping

            const newSceneItems = { ...sceneItems };
            for (const key in newSceneItems) {
                const keyIsSign = key === whichSign
                newSceneItems[key]['selectedOnce'] = keyIsSign //we paint it red 
            }
            setSceneItems(newSceneItems)
        }
        else{
            setGameState('questionSelected'); // we have reclicked a question and proceed to get the answer
            setThisQuestion(sceneItems[whichSign]['signText'])
            
            const [waitingSignDict, firstItemAt, lastItemAt] = composeDict('WaitMessages', null, 20, 5, keySignDistance-4)                  
            upDateUseRefs(Infinity, Infinity)
           
            const keySceneItem = { [whichSign]: sceneItems[keySignDistance] };
            keySceneItem[whichSign]['selectedTwice'] = true          
            const newSceneItems = Object.assign({}, keySceneItem, waitingSignDict);
            setSceneItems(newSceneItems)
        }
              
    }
   
    const flipSignFindNextSign = (signAt) => {
        console.log('flipSignFindNextSign')
        const newSceneItems = { ...sceneItems };
        if (newSceneItems[signAt]) {
            newSceneItems[signAt]['standUpright'] = false // this one goes down now
            setSceneItems(newSceneItems)
        }

        const keysArray = Object.keys(sceneItems);        
        const indexOfKey = keysArray.indexOf(signAt.toString());
        nextAt.current = parseInt(keysArray[indexOfKey + 1]) // here the next one goes down
         
    }
  
    const LocomotionAnimation = () => {
        
        camera.position.set(0, 2, distanceRef.current);
        camera.lookAt(0, 2, distanceRef.current + 1);
   
        let timeStamp = Date.now()
      
        useFrame(() => {
            const timeNow = Date.now()
            const deltaTime = timeNow - timeStamp
            console.log(stopAt.current)
            if (gameState === 'stroll' && distanceRef.current < finalSignAt.current - distanceBeforeFlipping-1) {
                if (distanceRef.current > nextAt.current - distanceBeforeFlipping) {
                    nextAt.current += 10
                    flipSignFindNextSign(nextAt.current - 10)
                    
                }   

                

                if (distanceRef.current > stopAt.current && distanceRef.current > distanceBeforeStopping) {
                    console.log('stop', stopAt.current)
                    setOldTrainSpeed(trainSpeed)
                    setTrainSpeed(0)
                    setGameState('forceStop')
                }

                distanceRef.current += trainSpeed * deltaTime / 1000
                camera.position.z = distanceRef.current             
            }

            if (gameState === 'showAnswerSign' || gameState === 'questionSelected') {
                distanceRef.current += trainSpeed * deltaTime / 1000
                camera.position.z = distanceRef.current 
            }
         
            timeStamp = timeNow
        });

        return null;  
    };
    
    return (      
        <Box className="appContainer">   
             
                 
            
            <div className="canvas-container" >
                <Canvas camera={camera} gl={{ antialias: true }} onClick={() => handleCanvasClick()}>                    
                    <ambientLight intensity={0.3} />
                    <directionalLight position={[0, 10, 0]} intensity={0.5}/>
                    <Stars />                                   
                    <THREERailroadBlock                             
                        distanceTravelled={30*Math.floor(distanceRef.current/30)} // spare your scene
                    /> 

                            {sceneItems &&  Object.entries(sceneItems).map(([key, value]) => ( // SIGNS
                                (key > distanceRef.current && key < distanceRef.current + renderingHorizon &&
                                    <THREESignBlockCustomRerender
                                        key={key}
                                        distance={key}
                                        width={value.width}
                                        height={value.height}
                                        signText={value.signText}
                                        standUpright={value.standUpright}
                                        selectedOnce={value.selectedOnce}
                                        selectedTwice={value.selectedTwice}
                                        answerSign={value.answerSign}
                                        immune={value.immune}
                                        trainSpeed={trainSpeed}
                                        trainToSignDistance={stopAt.current - distanceRef.current}
                                        handleSceneElementClick={handleSceneElementClick}
                                    />)
                            ))} 






                                {  /* <OrbitControls/>*/}
                             
                            <LocomotionAnimation />
                            
                </Canvas>

                        <TrainControlBlock
                   
                    upDateUseRefs={upDateUseRefs}
                    distanceRef={distanceRef}
                    setSceneItems={setSceneItems}
                    setTrainSpeed={setTrainSpeed}
                    trainSpeed={trainSpeed}
                    backToMotionAfterForcedStop={backToMotionAfterForcedStop}
                        />

                    </div>
                      
        </Box>                      
    );
};

export default App;