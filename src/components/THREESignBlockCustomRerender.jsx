import React, { useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';

const MemoizedTHREESignBlockCustomRerender = React.memo(
    ({
        distance,
        width,
        height,
        handleAskQuestionRequest,
        signText,
        standUpright,
        selectedOnce,
        selectedTwice,
        immune,   
        distanceRef,
        answerSign,
        activeSignIDRef,
        forceStopFlag,
    }) => {
        const textLen = signText.length;
        const signHeight = Math.pow(textLen, 1 / 2.5) / 2.2;
        const signWidth = Math.pow(textLen, 1 / 2.5) / 1.1;

        let goDownSpeed = 0.01;

        const distanceNumber = parseFloat(distance);
        const trainToSignGap = distance - distanceRef.current
        const initRef = useRef(true);
        const meshRef = useRef();
        let answerSignStart = 50
        const answerSignEnd = 6
        const zPosition = answerSign ? answerSignStart + distanceNumber : distanceNumber;
        

        useFrame(() => {
            if (initRef.current) {
                meshRef.current.position.z = zPosition;
                meshRef.current.position.x = width;
                initRef.current = false
            }

            if (meshRef.current.rotation.x < Math.PI / 2 && !immune && !answerSign) {
                if ((distance - distanceRef.current - 5 < 0)) {
                    if (signState === 'ready') {

                        meshRef.current.rotation.x += goDownSpeed;
                        goDownSpeed = 1.05 * goDownSpeed;
                    }
                    if (signState === 'clickedOnce') {
                        forceStopFlag.current = 1
                        setSignState('redReady');
                    }
                }
                if ((distance - distanceRef.current - 5 < -0.2) && signState === 'redReady') {
                    meshRef.current.rotation.x += goDownSpeed;
                    goDownSpeed = 1.05 * goDownSpeed;
                }
            }

            if (signState === 'clickedOnce' && activeSignIDRef.current !== distanceNumber) {
                setSignState('ready')
            }

           
            if (signState === 'clickedTwice' && !immune) {
            
                meshRef.current.position.z = trainToSignGap + distanceRef.current
                meshRef.current.position.x = 0.99 * meshRef.current.position.x;
               
            }
            if (answerSign && !immune) {                      
                answerSignStart = 0.96 * answerSignStart
                let dist = answerSignStart + answerSignEnd
                meshRef.current.position.z = distanceRef.current + dist
                meshRef.current.position.x = 0.985 * meshRef.current.position.x
                
            }
        });

        const signPosition = [0, height + signHeight / 2, 0];
        const textPosition = [0, height + signHeight / 2, -0.15];
        const leftPolePosition = [-0.7 * signWidth / 2, height / 2, 0];
        const rightPolePositon = [+0.7 * signWidth / 2, height / 2, 0];


        const [signState, setSignState] = useState('ready');

        
        let signBorderColor = signState === 'clickedOnce' ? 'red' : 'green'
        signBorderColor = signState === 'clickedTwice' ? 'white' : signBorderColor
        signBorderColor = signState === 'clickedTwice' ? 'white' : signBorderColor
        signBorderColor = signState === 'redReady' ? 'yellow' : signBorderColor
        const handleSignClick = (e) => {
             
            e.stopPropagation();

            if (answerSign || immune) {
                
                return
            }
            

                if (activeSignIDRef.current === distanceNumber) {

                    handleAskQuestionRequest(distance);
                    setSignState('clickedTwice')

                }
                else {
                    activeSignIDRef.current = distanceNumber

                    setSignState('clickedOnce')
                }
             


             
        };

        return (
            <>
                <group ref={meshRef} onClick={(e) => handleSignClick(e)}>
                    <mesh position={signPosition}>
                        <boxGeometry args={[signWidth, signHeight, 0.2]} />
                        <meshStandardMaterial color="blue" />
                    </mesh>
                    <mesh position={signPosition}>
                        <boxGeometry args={[signWidth + 0.5, signHeight + 0.5, 0.18]} />
                        <meshStandardMaterial color={signBorderColor} />
                    </mesh>

                    {!selectedTwice && !answerSign ? (
                        <>
                            <mesh position={rightPolePositon}>
                                <cylinderGeometry args={[0.25, 0.25, height]} />
                                <meshStandardMaterial color="gray" />
                            </mesh>
                            <mesh position={leftPolePosition}>
                                <cylinderGeometry args={[0.25, 0.25, height]} />
                                <meshStandardMaterial color="gray" />
                            </mesh>
                        </>
                    ) : null}

                    <Text
                        color="white"
                        anchorX="center"
                        anchorY="middle"
                        position={textPosition}
                        rotation={[Math.PI, 0, Math.PI]}
                        maxWidth={0.86 * signWidth}
                        fontSize={0.4}
                    >
                        {signText}
                    </Text>
                </group>
            </>
        );
    },
    (prevProps, nextProps) => {
        // Compare props and return true if you want to skip re-render
        return (
            prevProps.distance === nextProps.distance &&
            prevProps.width === nextProps.width &&
            prevProps.height === nextProps.height &&
            prevProps.signText === nextProps.signText &&
            prevProps.standUpright === nextProps.standUpright &&
            prevProps.selectedOnce === nextProps.selectedOnce &&
            prevProps.selectedTwice === nextProps.selectedTwice   
        );
    }
);

export default MemoizedTHREESignBlockCustomRerender;
