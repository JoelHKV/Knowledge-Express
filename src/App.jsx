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

console.log(THREERailroadBlock)

import THREESignBlock from './components/THREESignBlock';
import THREESignBlockCustomRerender from './components/THREESignBlockCustomRerender';
 

import { questions } from './utilities/exampleQuestions';


const { worldQuestions, lifeQuestions } = questions();
 

 
import './App.css'; 

const App = () => {





    
    const gameMode = useSelector((state) => state.counter[0].gameMode); // 'intro' vs 'practice' vs 'quiz' vs 'finish'

    const dispatch = useDispatch();


    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

 



   
    
     
  
    const [sceneItems, setSceneItems] = useState();

    const [gameState, setGameState] = useState('stroll');

    const [questionOriginState, setQuestionOriginState] = useState('life');


    const [thisQuestion, setThisQuestion] = useState(null);


    const distanceBeforeFlipping = 3;
    const distanceBeforeStopping = 5;


    const distanceRef = useRef(0);
    const speedRef = useRef(1);
    const stopAt = useRef(Infinity);
    const nextAt = useRef();
    const redSignArray = useRef([]);

    const addWhatToDict = (questionType, textContent) => {
        let thisQuestion

        const waitMessages = ['ChatGPT is working on your question', 'Wait patiently', 'Just a little longer', 'The answer will be soon available']


        if (questionType === 'world') {
            thisQuestion = worldQuestions[getRandomNumber(0, worldQuestions.length - 1)]
        }
        if (questionType === 'life') {
            thisQuestion = lifeQuestions[getRandomNumber(0, lifeQuestions.length - 1)]
        }
        if (questionType === 'waitmessage') {
            thisQuestion = waitMessages[getRandomNumber(0, waitMessages.length - 1)]
        }
        if (questionType === 'custom') {
            thisQuestion = textContent
        }
        if (questionType === 'question') {
            thisQuestion = textContent
            return {
                width: getRandomNumber(0, 0),
                height: 0.5,
                signText: textContent,
                standUpright: true,
                selectedOnce: false,
                selectedTwice: false,
                answerSign: true,
            };



        }

        return {
            width: getRandomNumber(-4, 4),
            height: 2,
            signText: thisQuestion,
            standUpright: true,
            selectedOnce: false,
            selectedTwice: false,
            answerSign: false,
        };

    }



    const getRandomNumber = (min, max) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };



    useEffect(() => { //  
        const tempDict = {} // init sceneItems dictionary from initial railroad sign
        for (let i = 0; i < 5; i++) {
            const positionCounter = 6 + 6 * i //+ getRandomNumber(0, 5)
            tempDict[positionCounter] = addWhatToDict(questionOriginState)
            if (i === 0) {
                nextAt.current = positionCounter
            }
        }
        setSceneItems(tempDict)
    
    }, []);


     

    const { questionAnswerData, loaded, error } = getQandA('ff', thisQuestion);

    if (loaded && gameState === 'questionSelected') {
        setGameState('answerReceived')
        console.log(questionAnswerData['Question'])

        const newSceneItems = { };

        newSceneItems[parseInt(distanceRef.current) + 7] = addWhatToDict('question', questionAnswerData['Question'])

        console.log(distanceRef.current)
          
         
   


       

       
         setSceneItems(newSceneItems)





    }

    
    const handleTrainMovement = (doWhat) => {
        if (doWhat === 'stop') {
            speedRef.current = 0
        }
        if (doWhat === 'go') {
            speedRef.current = 1
            
        }
        if (doWhat === 'wq') {
            setQuestionOriginState('world')
        }
        if (doWhat === 'lq') {
            setQuestionOriginState('life')
        }

    };




    const handleCanvasClick = () => {  
        console.log('canvas ' + gameState)
        if (gameState === 'stroll')   {
            setTimeout(() => {
                handleThreeComponentClick(-1, false)
            }, 10);
        } 
        if (gameState === 'answerReceived') {
            setGameState('stroll')
       
        const newSceneItems = {};
            for (let i = 1; i <= 5; i++) {
                const thisData = addWhatToDict('custom', questionAnswerData['Answer' + i.toString()])
                console.log(thisData)
                newSceneItems[parseInt(distanceRef.current) + 11 + 5 * i] = thisData
            }
            setSceneItems(newSceneItems)
        } 






    }

    const handleThreeComponentClick = (whichSign, selectedOnce) => {
     
        if (isFirstTriggerRef.current) {
            if (selectedOnce) {
                updateSceneItems(whichSign, 'selectedTwice') 
                setGameState('questionSelected');
                
                setThisQuestion(sceneItems[whichSign]['signText'])
            }
            else {
                
                updateSceneItems(whichSign, 'selectedOnce') 

                if (whichSign > -1) {
                    stopAt.current = whichSign - distanceBeforeStopping
                }
                else {
                    stopAt.current = Infinity
                }
            }                  
        }
        isFirstTriggerRef.current = false;
        setTimeout(() => {
            isFirstTriggerRef.current = true;
        }, 100);
         
    };

    const updateSceneItems = (whichSign, subkeyToChange) => {
        
        if (subkeyToChange == 'selectedOnce') { 
            const newSceneItems = { ...sceneItems };
            for (const key in newSceneItems) {
                const keyIsSign = key === whichSign
                newSceneItems[key][subkeyToChange] = keyIsSign
            }
            setSceneItems(newSceneItems)
        }
        if (subkeyToChange == 'selectedTwice') {
     
            const newSceneItems = { [whichSign]: sceneItems[whichSign] };

            

            for (let i = 0; i < 5; i++) {
                if (i === 0) {
                    newSceneItems[parseInt(whichSign) + 1 + 3 * i] = addWhatToDict('custom', 'ChatGPT is now processing this question.')
                }
                else {
                    newSceneItems[parseInt(whichSign) + 1 + 3 * i] = addWhatToDict('waitmessage')
                }
            }

            
            
            console.log(newSceneItems)
            newSceneItems[whichSign][subkeyToChange] = true           
            setSceneItems(newSceneItems)
        }


        
    }
    const isFirstTriggerRef = useRef(true);


    const flipSignFindNextSign = (signAt) => {
        addOneSignSetSignDown([], signAt)
        const keysArray = Object.keys(sceneItems);        
        const indexOfKey = keysArray.indexOf(signAt.toString());
        nextAt.current = parseInt(keysArray[indexOfKey + 1]) 
         
    }



    const addOneSignSetSignDown = (newSignData, whichSignDown) => {
        const keys = Object.keys(sceneItems);
        const newSceneItems = { ...sceneItems };
        console.log(newSceneItems[whichSignDown]['standUpright'])
        newSceneItems[whichSignDown]['standUpright'] = false // set this shot down

        const nextSignLocation = parseInt(keys[keys.length - 1]) + 5 + getRandomNumber(0, 15)

        newSceneItems[nextSignLocation] = addWhatToDict(questionOriginState)
        setSceneItems(newSceneItems)        
    };
   
   


     
  



    const LocomotionAnimation = () => {
        
        camera.position.set(0, 2, distanceRef.current);
        camera.lookAt(0, 2, distanceRef.current + 1);
   
        let timeStamp = Date.now()
      
        useFrame(() => {
            //console.log(camera.position.z)
            const timeNow = Date.now()
            const deltaTime = timeNow - timeStamp

            if (gameState === 'stroll') {
                if (distanceRef.current > nextAt.current - distanceBeforeFlipping) {
                    nextAt.current += 10
                    flipSignFindNextSign(nextAt.current - 10)
                    //setGameState('confirm?')
                }


                if (distanceRef.current < stopAt.current) {
                    distanceRef.current += speedRef.current * deltaTime / 1000
                    camera.position.z = distanceRef.current
                }
            }
            if (gameState === 'questionSelected') {

                    distanceRef.current += speedRef.current * deltaTime / 1000
                    camera.position.z = distanceRef.current               
            }
            if (gameState === 'answerReceived') {
                distanceRef.current += speedRef.current * deltaTime / 1000
                camera.position.z = distanceRef.current 
            }


            



            timeStamp = timeNow
        });

        return null;  
    };
 
    return (      
        <Box className="appContainer">   
            <Grid container className="appContainer">
            <Grid item xs={12}>
            <div className="canvas-container" >
                    <Canvas camera={camera} gl={{ antialias: true }} onClick={handleCanvasClick}>                    
                    <ambientLight intensity={0.3} />
                    <directionalLight position={[0, 10, 0]} intensity={0.5}/>
                    <Stars />                                   
                    <THREERailroadBlock                             
                        distanceTravelled={30*Math.floor(distanceRef.current/30)} // spare your scene
                    /> 

                            {sceneItems &&  Object.entries(sceneItems).map(([key, value]) => ( // SIGNS
                                (key > distanceRef.current && <THREESignBlockCustomRerender
                                    key={key}
                                    distance={key}
                                    width={value.width}
                                    height={value.height}
                                    signText={value.signText}
                                    standUpright={value.standUpright}
                                    selectedOnce={value.selectedOnce}
                                    selectedTwice={value.selectedTwice}
                                    answerSign={value.answerSign}
                                    trainSpeed={speedRef.current}
                                    trainToSignDistance={stopAt.current - distanceRef.current}
                                    handleThreeComponentClick={handleThreeComponentClick}
                                />)
                            ))} 






                                {  /* <OrbitControls/>*/}
                             
                    <LocomotionAnimation />
                </Canvas>



            </div>
            </Grid>
            <Grid item xs={12}>
                    <Button variant="contained" color="primary" onClick={() => handleTrainMovement('stop')} >
                    Stop
            </Button>
                    <Button variant="contained" color="primary" onClick={() => handleTrainMovement('go')} >
                    Go
                    </Button>
                    <Button variant="contained" color="primary" onClick={() => handleTrainMovement('wq')} >
                        WQ
                    </Button>
                    <Button variant="contained" color="primary" onClick={() => handleTrainMovement('lg')} >
                        LQ
                    </Button>

            </Grid>
            </Grid>
           
        </Box>                      
    );
};

export default App;