import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';

import THREERailroadBlock from '../components/THREERailroadBlock';
import THREESignBlockCustomRerender from '../components/THREESignBlockCustomRerender';


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
    oldTrainSpeed,
    setOldTrainSpeed,
    setTrainSpeed,
    canvasRef,
}) => {

    const renderingHorizon = 80; // distance of rending along the future path
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    const spotLightRef = useRef(null);
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
                forceStopFlag.current = false // back to motion
                setTrainSpeed(oldTrainSpeed) // back to motion
                setGameState('stroll')
                return
            }
        }
        if (gameState === 'input') {
            setGameState('stroll')
            setTrainSpeed(oldTrainSpeed)
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
            //console.log(forceStopFlag.current)

           // spotLightRef.current.position.z = distanceRef.current + 20
            spotlight.position.z = distanceRef.current + 1
            

            //spotLightRef.current.lookAt.z = 1;

            if (distanceRef.current >= finalSignAt.current - pivotDistanceToSign) {
                forceStopFlag.current = true
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

     
  
    const targetElementRef = useRef();
   // const targetPosition = new THREE.Vector3(0, 2, 100);
    //const spotlightTarget = new THREE.Object3D();
    //spotlightTarget.position.copy(targetPosition);

    const spotlight = useMemo(() => new THREE.SpotLight('#fff'), []);

    return (
        <div className="THREESceneBlock">
            <Canvas camera={camera} gl={{ antialias: true }} style={{ zIndex: 0 }} onClick={handleCanvasClick} ref={canvasRef}>
                <ambientLight intensity={0.2} />
                <group>
                     <primitive
                        object={spotlight}
                        position={[0, 1, 0]}
                        intensity={61.5}
                        penumbra={0}
                    />
                    <primitive object={spotlight.target} position={[0, 1e9/1.5, 1e9]} />
                </group>
                <Stars />
                <THREERailroadBlock
                    distanceRef={distanceRef}
                    canvasRef={canvasRef} 
                />

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
                <LocomotionAnimation />  
            </Canvas>
        </div>
    );
};

export default THREESceneBlock;
