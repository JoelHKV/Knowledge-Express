import React, { useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';

const MemoizedTHREESignBlockCustomRerender = React.memo(
    ({
        distance,
        width,
        height,
        handleAskQuestionRequest,
        showFollowUpQuestions,
        signText,
        clickable,
        fallable,  
        distanceRef,
        ownQuestionSign,
        startingSignState,
        answerSign,
        activeSignIDRef,
        handleActiveSignClick,
        forceStopFlag,
        pivotDistanceToSign,
    }) => {
         

        let textLen = signText.length;
       // if (ownQuestionSign) {
       //     textLen = 180
       // }

        let fontSize = 0.4

        let signHeight = 1.1 * Math.pow(textLen, 1 / 2.5) / 1.9;
        let signWidth = Math.pow(textLen, 1 / 2.5) / 1.5;
        if (ownQuestionSign || answerSign) {
            signHeight = 4.5
            signWidth = 5
            //fontSize = 0.6 - textLen/1500
            console.log(textLen)
        }


        let goDownSpeed  

        const distanceNumber = parseFloat(distance);
        const trainToSignGap = distance - distanceRef.current
        const initRef = useRef(true);
        const meshRef = useRef();
        const flyawaySign = useRef(false);
        const flipSign = useRef(false)
        let answerSignStart =  50
        let flyawaySpeed = 0.04;
        const answerSignEnd = pivotDistanceToSign + 0;
        const zPosition = answerSign ? answerSignStart + distanceNumber : distanceNumber;

        let prevPos
             
        let startState = 'basic';

        if (startingSignState) {
            startState = startingSignState
        }


        const [signState, setSignState] = useState(startState);
        const signColorMapping = {
            'basic': "#cc00cc", // normal starting sign that is ready to go down
            'active': 'red', // once clicked sign can stop the trsin
            'selected': 'white', // selected as the question, proceeds to render signs
            'hasStoppedTrain': 'yellow', // stopped train but can go down if user wants
        };

        let signBorderColor = signColorMapping[signState]

        if (answerSign) {
            signBorderColor = 'white'
        }


        useFrame(() => {
            if (initRef.current) {
                meshRef.current.position.z = zPosition;
                meshRef.current.position.x = width;
                initRef.current = false
            }
         
            if (fallable && !answerSign && distance - distanceRef.current - pivotDistanceToSign < -0.1 && meshRef.current.rotation.x ===0) {
                if (signState === 'basic') {
                    flipSign.current = true
                    goDownSpeed = 1 * (distanceRef.current - prevPos)
                }
                if (signState === 'hasStoppedTrain' && !forceStopFlag.current) {
                    flipSign.current = true
                }

                if (signState === 'active') {
                    forceStopFlag.current = true
                    setSignState('hasStoppedTrain');
                }
            } 

            if (flipSign.current) {
                meshRef.current.rotation.x += goDownSpeed// parseFloat(distanceRef.current - flipPos);
                goDownSpeed = 1.05 * goDownSpeed;

                if (meshRef.current.rotation.x > Math.PI / 2) {
                    meshRef.current.rotation.x = 1.04 * Math.PI / 2
                    flipSign.current = false
                }
            }

            if (flyawaySign.current) {
                meshRef.current.position.y += flyawaySpeed
                flyawaySpeed = 1.1 * flyawaySpeed
                if (meshRef.current.position.y > 50) {
                    flyawaySign.current = false
                }

            }
             
            if (signState === 'active' && activeSignIDRef.current !== distanceNumber) {
                setSignState('basic')
            }
                      
            if (signState === 'selected') {  
            
                meshRef.current.position.z = trainToSignGap + distanceRef.current
                meshRef.current.position.x = 0.99 * meshRef.current.position.x;
               
            }
            if (answerSign) {  
                
                answerSignStart = 0.96 * answerSignStart
                let dist = answerSignStart + answerSignEnd               
                meshRef.current.position.z = distanceRef.current + dist  
                 
               // meshRef.current.position.y -=0.01

                meshRef.current.position.x = 0.985 * meshRef.current.position.x
                
            }
            prevPos = distanceRef.current;
        });

        const signPosition = [0, height + signHeight / 2, 0];
        const textPosition = [0, height + signHeight / 2, -0.15];
        const leftPolePosition = [-0.7 * signWidth / 2, height / 2, 0];
        const rightPolePositon = [+0.7 * signWidth / 2, height / 2, 0];

        const handleSignClick = (e) => {          
            e.stopPropagation();

            if (!clickable || flipSign.current) {              
                return
            }
            if (answerSign) {
                flyawaySign.current = true
                showFollowUpQuestions()
                return
            }
            if (activeSignIDRef.current === distanceNumber) {
                handleAskQuestionRequest(distance);
                setSignState('selected')
            }
            else {
                setSignState('active')
                handleActiveSignClick(distanceNumber)                          
            }                        
        };

        return (
            <>
                <group ref={meshRef} onClick={(e) => handleSignClick(e)}>
                    <mesh position={signPosition}>
                        <boxGeometry args={[signWidth, signHeight, 0.2]} />
                        <meshStandardMaterial color="#880088" />
                    </mesh>
                    <mesh position={signPosition}>
                        <boxGeometry args={[signWidth + 0.25, signHeight + 0.25, 0.18]} />
                        <meshStandardMaterial color={signBorderColor} />
                    </mesh>

                    {signState !== 'selected' && !answerSign ? (
                        <>
                            <mesh position={rightPolePositon}>
                                <cylinderGeometry args={[0.25, 0.25, height]} />
                                <meshStandardMaterial color="#555" />
                            </mesh>
                            <mesh position={leftPolePosition}>
                                <cylinderGeometry args={[0.25, 0.25, height]} />
                                <meshStandardMaterial color="#555" />
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
                        fontSize={fontSize}
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
          //   prevProps.startingSignState === nextProps.startingSignState &&
             //   prevProps.width === nextProps.width &&
            // prevProps.fallable === nextProps.fallable &&
             prevProps.signText === nextProps.signText  
           // prevProps.standUpright === nextProps.standUpright &&
           // prevProps.selectedOnce === nextProps.selectedOnce &&
          //  prevProps.selectedTwice === nextProps.selectedTwice   
        );
    }
);

export default MemoizedTHREESignBlockCustomRerender;
