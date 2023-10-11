import React, { useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';

const MemoizedTHREESignBlockCustomRerender = React.memo(
    ({
        distance,
        width,
        height,
        handleSceneElementClick,
        signText,
        standUpright,
        selectedOnce,
        selectedTwice,
        immune,   
        distanceRef,
        answerSign,
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
            if (!standUpright && !immune) {
                if (meshRef.current && meshRef.current.rotation.x < Math.PI / 2) {
                    meshRef.current.rotation.x += goDownSpeed;
                    goDownSpeed = 1.05 * goDownSpeed;
                }
            }
            if (selectedTwice && !immune) {
                const timeNow = Date.now();
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

        let signBorderColor = selectedOnce ? 'red' : 'green';
        signBorderColor = selectedTwice ? 'white' : signBorderColor;
        signBorderColor = answerSign ? 'white' : signBorderColor;
        const handleSignClick = (e) => {
            console.log(distance);
            e.stopPropagation();
            if (standUpright && !selectedTwice && !immune) {
                handleSceneElementClick(distance, selectedOnce);
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
