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
        canvasRef,
        ownQuestionSign,
        startingSignState,
        answerSign,
        activeSignIDRef,
        handleActiveSignClick,
        stopOrResumeMotion,
        trainSpeedRef,
        pivotDistanceToSign,
    }) => {
         
        const adjustAnswerSignForMaxDimension = (signHeight, signWidth) => {
            const canvasWidth = canvasRef.current.offsetWidth
            let shrinkFactor = 1
            const maxHeight = 4.5
            const maxWidth = 1.8 + canvasWidth / 200
            if (signHeight > maxHeight) {
                shrinkFactor = shrinkFactor * signHeight / maxHeight
                signHeight = maxHeight
            }
            if (signWidth > maxWidth) {
                shrinkFactor = shrinkFactor * signWidth / maxWidth
                signWidth = maxWidth
            }
            return [signHeight, signWidth, Math.pow(shrinkFactor, 1 / 2.2)];
        }
        
       

        let fontSize = 0.4
        let textLen = signText.length;
        let signHeight = 1.1 * Math.pow(textLen, 1 / 2.5) / 1.9;
        let signWidth = Math.pow(textLen, 1 / 2.5) / 1.5;
        let signColor = "#880088"
        if (answerSign) {
            signColor = "#552255"                  
            let fontShrinkFactor
            [signHeight, signWidth, fontShrinkFactor] = adjustAnswerSignForMaxDimension(signHeight, signWidth);            
            fontSize = fontSize / fontShrinkFactor;
       
        }
        if (ownQuestionSign) {
            const canvasWidth = canvasRef.current.offsetWidth
            signHeight = 3.8
            signWidth = Math.min(5, 2.3 + canvasWidth/300)
            
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
                    goDownSpeed = 0.02 * trainSpeedRef.current;
                }
                if (signState === 'hasStoppedTrain' && trainSpeedRef.current>0) {
                    flipSign.current = true
                    goDownSpeed = 0.02 * trainSpeedRef.current;
                }

                if (signState === 'active') {
                    stopOrResumeMotion('stop')
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
                meshRef.current.position.x = 0.985 * meshRef.current.position.x
                
            }
        });

        const signPosition = [0, height + signHeight / 2, 0];
        const textPosition = [-0.05, height + signHeight / 2, -0.12];
         
        const leftPolePosition = [-0.7 * signWidth / 2, height / 2, 0];
        const rightPolePositon = [+0.7 * signWidth / 2, height / 2, 0];


        const handleSignClick = (e) => {          
            e.stopPropagation();

            if ((!clickable && signState !== 'basic') || flipSign.current || signState === 'selected') {              
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
                        <meshStandardMaterial color={signColor} />
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
                        maxWidth={signWidth-0.3}
                        fontSize={fontSize}
                    >
                        {signText}
                    </Text>
                    
                </group>
            </>
        );
    },
    (prevProps, nextProps) => {
        // Compare props  
        return (
            prevProps.distance === nextProps.distance &&
            prevProps.signText === nextProps.signText  
    
        );
    }
);

export default MemoizedTHREESignBlockCustomRerender;
