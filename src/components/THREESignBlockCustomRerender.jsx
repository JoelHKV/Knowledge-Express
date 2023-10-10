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
        trainSpeed,
        trainToSignDistance,
        answerSign,
    }) => {
        const textLen = signText.length;
        const signHeight = Math.pow(textLen, 1 / 2.5) / 2.2;
        const signWidth = Math.pow(textLen, 1 / 2.5) / 1.1;

        let goDownSpeed = 0.01;

       // console.log('rerender' + distance, answerSign)

        const [initialCameraPosition, setInitialCameraPosition] = useState(true);

        const distanceNumber = parseFloat(distance);

        const meshRef = useRef();
        let answerSignOffset = 16
        const zPosition = answerSign ? answerSignOffset + distanceNumber : distanceNumber;

        let timeStamp = Date.now();

        useFrame(() => {
            if (initialCameraPosition) {
                meshRef.current.position.z = zPosition;
                meshRef.current.position.x = width;
                setInitialCameraPosition(false);
            }
            if (!standUpright && !immune) {
                if (meshRef.current && meshRef.current.rotation.x < Math.PI / 2) {
                    meshRef.current.rotation.x += goDownSpeed;
                    goDownSpeed = 1.05 * goDownSpeed;
                }
            }
            if (selectedTwice && !immune) {
                const timeNow = Date.now();
                const deltaTime = timeNow - timeStamp;
                meshRef.current.position.z -= 0.01 * trainToSignDistance;
                trainToSignDistance = 0.99 * trainToSignDistance;

                meshRef.current.position.z += (trainSpeed * deltaTime) / 1000;
                meshRef.current.position.x = 0.99 * meshRef.current.position.x;
                timeStamp = timeNow;
            }
            if (answerSign && !immune) {
                const timeNow = Date.now();
                const deltaTime = timeNow - timeStamp;

   
                let dist = (trainSpeed * deltaTime) / 1000 - 0.03 * answerSignOffset
                answerSignOffset = answerSignOffset * 0.97
                meshRef.current.position.z += dist;
                timeStamp = timeNow;
            }



        });

        const signPosition = [0, height + signHeight / 2, 0];
        const textPosition = [0, height + signHeight / 2, -0.15];
        const leftPolePosition = [-0.7 * signWidth / 2, height / 2, 0];
        const rightPolePositon = [+0.7 * signWidth / 2, height / 2, 0];

        let signBorderColor = selectedOnce ? 'red' : 'green';
        signBorderColor = selectedTwice ? 'white' : signBorderColor;
        signBorderColor = answerSign ? 'yellow' : signBorderColor;
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
          //  prevProps.trainSpeed === nextProps.trainSpeed
            // Exclude trainToSignDistance from the comparison
        );
    }
);

export default MemoizedTHREESignBlockCustomRerender;
