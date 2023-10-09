import React, { useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
//import { useLoader } from '@react-three/fiber';
//import { FontLoader } from 'three/addons/loaders/FontLoader';
 
import { Text } from '@react-three/drei';

const THREESignBlock = ({ distance, width, height, handleThreeComponentClick, signText, standUpright, selectedOnce, selectedTwice, trainSpeed, trainToSignDistance }) => {


    const textLen = signText.length;
    const signHeight = Math.pow(textLen, 1 / 2.5) / 2.2;
    const signWidth = Math.pow(textLen, 1 / 2.5) / 1.1;

    let goDownSpeed = 0.01

    //console.log('rerender')

    const [initialCameraPosition, setInitialCameraPosition] = useState(true);


    const distanceNumber = parseFloat(distance)

    const meshRef = useRef();
     
    let timeStamp = Date.now()

    useFrame(() => {
        if (initialCameraPosition) {
            meshRef.current.position.z = distanceNumber //+ offsetRef.current
            meshRef.current.position.x = width
            setInitialCameraPosition(false)
        }
        if (!standUpright) {
            if (meshRef.current && meshRef.current.rotation.x < Math.PI / 2) {
                meshRef.current.rotation.x += goDownSpeed;
                goDownSpeed = 1.05 * goDownSpeed
            }
        }
        if (selectedTwice) {
            const timeNow = Date.now()
            const deltaTime = timeNow - timeStamp
            meshRef.current.position.z -= 0.01 * trainToSignDistance
            trainToSignDistance = 0.99 * trainToSignDistance
             
            meshRef.current.position.z += trainSpeed * deltaTime / 1000
            meshRef.current.position.x = 0.99 * meshRef.current.position.x              
            timeStamp = timeNow
        }

    });

    



    const signPosition = [0, height + signHeight/2, 0]  
    const textPosition = [0, height + signHeight / 2, - 0.15]
    const leftPolePosition = [-0.7 * signWidth / 2, height / 2, 0]
    const rightPolePositon = [+0.7 * signWidth / 2, height / 2, 0]

    let signBorderColor = selectedOnce ? 'red' : 'green'
    signBorderColor = selectedTwice ? 'white' : signBorderColor

    const handleSignClick = (e) => {
        console.log(distance)
        e.stopPropagation();
        if (standUpright) {
            handleThreeComponentClick(distance, selectedOnce)
        }
    };

    

    return (
        <>
            <group ref={meshRef} onClick={(e) => { handleSignClick(e) }}>
            <mesh position={signPosition} >
                <boxGeometry args={[signWidth, signHeight, 0.2]} /> {/* Adjust the dimensions as needed */}
                <meshStandardMaterial color="blue" />
                </mesh>
                <mesh position={signPosition} >
                    <boxGeometry args={[signWidth + 0.5, signHeight + 0.5, 0.18]} /> {/* Adjust the dimensions as needed */}
                    <meshStandardMaterial color={signBorderColor} />
                </mesh>


                {!selectedTwice ? (
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
                maxWidth={0.86*signWidth}
                fontSize={0.4} 
            >
                {signText}
            </Text>
            </group>

        </>
    );
};

export default THREESignBlock;
