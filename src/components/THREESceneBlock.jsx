import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';

import THREERailroadBlock from '../components/THREERailroadBlock';
import THREESignBlockCustomRerender from '../components/THREESignBlockCustomRerender';
import THREESpotlightWithTarget from '../components/THREESpotlightWithTarget';
 


import './THREESceneBlock.css';

const THREESceneBlock = ({
    sceneItems,
    setSceneItems,
    distanceRef,
    forceStopFlag,
    pivotDistanceToSign,
    handleAskQuestionRequest,
    showFollowUpQuestions,
    finalSignAt,
    gameState,
    setGameState,
    trainSpeed,
    changeSpeed,
    canvasRef,
}) => {

     
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

   
    const activeSignIDRef = useRef(-1)
    const isFirstTriggerRef = useRef(true); // dummy to prevent a burst of calls

    const handleActiveSignClick = (signID) => {
        if (isFirstTriggerRef.current) {
            activeSignIDRef.current = signID
        }
        isFirstTriggerRef.current = false
        setTimeout(() => {
            isFirstTriggerRef.current = true
        }, 100);
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
                changeSpeed(-1, true)
                return
            }
        }
        if (gameState === 'input') {
            setGameState('stroll')
            changeSpeed(-1, true)
            setSceneItems({})
        }

    }

    const LocomotionAnimation = () => {

        camera.position.set(0, 2, distanceRef.current);
        

        camera.lookAt(0, 2, distanceRef.current + 1);
        let timeStamp = Date.now()

        useFrame(() => {
            const timeNow = Date.now()
            const deltaTime = timeNow - timeStamp
                      
            if (distanceRef.current >= finalSignAt.current - pivotDistanceToSign) {
                forceStopFlag.current = true
            }
            if (forceStopFlag.current && trainSpeed > 0) {
                changeSpeed(0, true)
            }

            distanceRef.current += trainSpeed * deltaTime / 1000
            camera.position.z = distanceRef.current

            timeStamp = timeNow
        });

        return null;
    };
    
    return (
        <div className="THREESceneBlock">
            <Canvas camera={camera} gl={{ antialias: true }} style={{ zIndex: 0 }} onClick={handleCanvasClick} ref={canvasRef}>
                <ambientLight intensity={0.3} />        
                <THREESpotlightWithTarget
                    distanceRef={distanceRef}
                />
                <Stars />
                <THREERailroadBlock
                    distanceRef={distanceRef}
                    canvasRef={canvasRef} 
                />

                {sceneItems && Object.entries(sceneItems).map(([key, value]) => ( // SIGNS
                    (key > distanceRef.current &&
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
                            canvasRef={canvasRef} 
                            activeSignIDRef={activeSignIDRef}
                            forceStopFlag={forceStopFlag}
                            pivotDistanceToSign={pivotDistanceToSign}
                            handleAskQuestionRequest={handleAskQuestionRequest}
                            handleActiveSignClick={handleActiveSignClick}
                            showFollowUpQuestions={showFollowUpQuestions}
                        />)
                ))}
                <LocomotionAnimation />  
            </Canvas>
        </div>
    );
};

export default THREESceneBlock;
