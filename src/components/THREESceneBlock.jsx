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
  //  forceStopFlag,
    pivotDistanceToSign,
    handleAskQuestionRequest,
    showFollowUpQuestions,
    finalSignAt,
    gameState,
    setGameState,
    stopOrResumeMotion,
 //   trainSpeed,
    trainSpeedRef,
  //  changeSpeed,
    canvasRef,
}) => {

     
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    console.log('render scene')

    //const trainSpeed = thisTrainSpeedRef.current;
    const starsRef = useRef();
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
       
        if (gameState === 'stroll') {
             if (activeSignIDRef.current > 0) { // sign has been selected once
                 setTimeout(() => {
                     handleActiveSignClick(-1) // undo the selection 
                 }, 40);
                 stopOrResumeMotion('resume') // resume speed
                 return
             }    
           // trainSpeedRef.current = - trainSpeedRef.current // otherwise toggle stop and go 
            if (trainSpeedRef.current > 0) {
                stopOrResumeMotion('stop')
                return
            }
            if (trainSpeedRef.current < 0) {
                stopOrResumeMotion('resume')
                return
            }
        }
        if (gameState === 'input') {
            setGameState('stroll')
            stopOrResumeMotion('resume')
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
                      
            if (distanceRef.current >= finalSignAt.current - pivotDistanceToSign && trainSpeedRef.current > 0) {
                stopOrResumeMotion('stop')             
            }
            const presentSpeed = Math.max(trainSpeedRef.current, 0)
            distanceRef.current += presentSpeed * deltaTime / 1000
            camera.position.z = distanceRef.current

            if (starsRef.current) {
                starsRef.current.position.z = camera.position.z
            }

            timeStamp = timeNow
        });

        return null;
    };
    
    return (
        <div className="THREESceneBlock" onClick={handleCanvasClick}>
            <Canvas camera={camera} gl={{ antialias: true }} style={{ zIndex: 0 }} ref={canvasRef}>
                <ambientLight intensity={0.3} />        
                <THREESpotlightWithTarget
                    distanceRef={distanceRef}
                />
                <mesh ref={starsRef}>
                    <Stars/>
                </mesh>

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
                      //  forceStopFlag={forceStopFlag}
                            trainSpeedRef={trainSpeedRef}
                            stopOrResumeMotion={stopOrResumeMotion}
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
