import React from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';

import THREERailroadBlock from '../components/THREERailroadBlock';
import THREESignBlockCustomRerender from '../components/THREESignBlockCustomRerender';


import './THREESceneBlock.css';

const THREESceneBlock = ({
    sceneItems,
    distanceRef,
    forceStopFlag,
    activeSignIDRef,
    pivotDistanceToSign,
    handleCanvasClick,
    handleAskQuestionRequest,
    handleActiveSignClick,
    showFollowUpQuestions,
    finalSignAt,
    trainSpeed,
    setOldTrainSpeed,
    setTrainSpeed,
}) => {

    const renderingHorizon = 40; // distance of rending along the future path
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
















    const LocomotionAnimation = () => {

        camera.position.set(0, 2, distanceRef.current);
        camera.lookAt(0, 2, distanceRef.current + 1);
        let timeStamp = Date.now()

        useFrame(() => {
            const timeNow = Date.now()
            const deltaTime = timeNow - timeStamp
            //console.log(forceStopFlag.current)
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

    return (
        <div className="THREESceneBlock">
            <Canvas camera={camera} gl={{ antialias: true }} style={{ zIndex: 0 }} onClick={handleCanvasClick}>
                <ambientLight intensity={0.3} />
                <directionalLight position={[0, 10, 0]} intensity={0.5} />
                <Stars />
                <THREERailroadBlock distanceRef={distanceRef} />

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
