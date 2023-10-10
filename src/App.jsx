import React, { useEffect, useState, useRef } from 'react';

import { Canvas, useFrame } from '@react-three/fiber';

 

import { PerspectiveCamera, OrbitControls, Stars } from '@react-three/drei';

//import { Text } from 'drei';

import * as THREE from 'three';

 
//import { Mesh } from 'three';

import { useDispatch, useSelector } from 'react-redux';
import { newGameMode } from './reducers/knowledgeExpressSlice';

import { getQandA } from './hooks/getQandA';


import { Grid, Button, Box } from '@mui/material'; // use MUI component library


import THREECubeBlock from './components/THREECubeBlock';
import THREERailroadBlock from './components/THREERailroadBlock';
import TrainControlBlock from './components/TrainControlBlock';



import THREESignBlock from './components/THREESignBlock';
import THREESignBlockCustomRerender from './components/THREESignBlockCustomRerender';
 

import { questions } from './utilities/exampleQuestions';



const { worldQuestions, lifeQuestions } = questions();
 
 
import { addWhatToDict, composeDict } from './utilities/generateSignsPerButtonClick';
 
import './App.css'; 

const App = () => {





    
    const gameMode = useSelector((state) => state.counter[0].gameMode); // 'intro' vs 'practice' vs 'quiz' vs 'finish'

    const dispatch = useDispatch();


    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

 



   
    
     
  
    const [sceneItems, setSceneItems] = useState();

    const [gameState, setGameState] = useState('stroll');

    
    const [thisQuestion, setThisQuestion] = useState(null);


    const distanceBeforeFlipping = 3;
    const distanceBeforeStopping = 5;

    const renderingHorizon = 40;



    const distanceRef = useRef(0);
    const speedRef = useRef(1);
    const stopAt = useRef(Infinity);
    const nextAt = useRef();
    const finalSignAt = useRef();
     
    const isFirstTriggerRef = useRef(true);
    
    
    
    


     

    const { questionAnswerData, loaded, error } = getQandA('ff', thisQuestion);
    console.log('app rerender loaded', loaded)
    if (loaded && gameState === 'questionSelected') {
        console.log('addAnswer')
        setGameState('requestCompleted')
        const newSceneItems = { };
        newSceneItems[parseInt(distanceRef.current) + 7] = addWhatToDict('Answer', questionAnswerData['Answer'])                      
        setSceneItems(newSceneItems)
    }

     

    const upDateUseRefs = (firstItemAt, lastItemAt) => {             
            nextAt.current = firstItemAt             
            finalSignAt.current = lastItemAt      
    }

     




    const handleCanvasClick = (passedGameState) => {  
        console.log('canvas ' + gameState, passedGameState)
        if (gameState === 'stroll')   {
            setTimeout(() => {
                handleThreeComponentClick(-1, false)
            }, 10);
        } 
      

    }

    const handleThreeComponentClick = (whichSign, selectedOnce) => {
        if (isFirstTriggerRef.current) {

            if (gameState === 'requestCompleted') {
                showFollowUpQuestions()
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
        setGameState('stroll')
        stopAt.current = Infinity
        console.log('set to stoll', gameState)
        const [newSceneItems, firstItemAt, lastItemAt] = composeDict('QuestionDict', questionAnswerData, 2, 5, distanceRef.current)
        upDateUseRefs(firstItemAt, lastItemAt)
        console.log(speedRef, stopAt, distanceRef)
        setSceneItems(newSceneItems)
    }


    const updateSceneItems = (whichSign, selectedOnce) => {
        const keySignDistance = parseInt(whichSign)
        if (!selectedOnce) { 

            stopAt.current = whichSign - distanceBeforeStopping

            const newSceneItems = { ...sceneItems };
            for (const key in newSceneItems) {
                const keyIsSign = key === whichSign
                newSceneItems[key]['selectedOnce'] = keyIsSign
            }
            setSceneItems(newSceneItems)
        }
        else{
            console.log('conformed')
            setGameState('questionSelected');
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

            if (gameState === 'stroll' && distanceRef.current < finalSignAt.current - distanceBeforeFlipping-1) {
                if (distanceRef.current > nextAt.current - distanceBeforeFlipping) {
                    nextAt.current += 10
                    flipSignFindNextSign(nextAt.current - 10)
                    
                }                                              
                distanceRef.current += speedRef.current * deltaTime / 1000
                camera.position.z = distanceRef.current             
            }

            if (gameState === 'requestCompleted' || gameState === 'questionSelected') {
                distanceRef.current += speedRef.current * deltaTime / 1000
                camera.position.z = distanceRef.current 
            }
         
            timeStamp = timeNow
        });

        return null;  
    };
    
    return (      
        <Box className="appContainer">   
             
                 
            
            <div className="canvas-container" >
                <Canvas camera={camera} gl={{ antialias: true }} onClick={() => handleCanvasClick(gameState)}>                    
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
                                        trainSpeed={speedRef.current}
                                        trainToSignDistance={stopAt.current - distanceRef.current}
                                        handleThreeComponentClick={handleThreeComponentClick}
                                    />)
                            ))} 






                                {  /* <OrbitControls/>*/}
                             
                            <LocomotionAnimation />
                            
                </Canvas>

                        <TrainControlBlock
                   
                    upDateUseRefs={upDateUseRefs}
                    distanceRef={distanceRef}
                    setSceneItems={setSceneItems}
                        />

                    </div>
                      
        </Box>                      
    );
};

export default App;