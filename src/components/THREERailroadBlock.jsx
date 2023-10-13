import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';

import { Text } from '@react-three/drei';

const THREERailroadBlock = ({  distanceRef }) => {
//const MemoizedTHREERailroadBlock = React.memo(({ distanceTravelled, distanceRef }) => {

    console.log('rerender railroad ')
    const hopDistance = 12;
    const meshRef = useRef();
    const cubesRef = useRef([]);
    const extraItemCount = 4;

    if (cubesRef.current.length === 0) {
        for (let i = 0; i < extraItemCount; i++) {
            cubesRef.current.push({
                key: i,
                x: Math.random() * 10 - 5, // Random X position between -5 and 5
                z: Math.random() * 25, // Random Z position between 0 and 80
            });
        }
    }



    const RailRoadAnimation = () => {
        useFrame(() => {
            if (distanceRef.current - meshRef.current.position.z > hopDistance) {
                // Move the railroad block
                meshRef.current.position.z += hopDistance;

              
              //  for (let i = 0; i < extraItemCount; i++) {
               //     if (cubesRef.current[i].z < distanceRef.current + 10) {
               //         console.log(cubesRef.current[i].z)
               //         cubesRef.current[i].z += 10
                 //       console.log(cubesRef.current[i].z)
                //    }
               // }



            }

          
            cubesRef.current[0].z = distanceRef.current +8


            

        });
    }



    return (
        <>        
            
            {cubesRef.current.map((cube, index) => (
                <mesh key={cube.key} position={[cube.x, 0.05, cube.z]}>
                    <boxGeometry args={[1, 1, 1]} />
                    <meshStandardMaterial color="blue" />
                </mesh>
            ))}


            <group ref={meshRef}  >

                



            <mesh position={[0, -0.05,   40]} rotation={[0, 0, 0]}>
                <boxGeometry args={[140, 0.1, 80]} />   
                <meshStandardMaterial color="brown" />
            </mesh>
            {Array.from({ length: 2 }).map((_, index) => ( // RAILS
                <mesh key={index} position={[-1 + index * 2, 0.05,  40]} rotation={[0, 0, 0]}>
                    <boxGeometry args={[0.2, 0.2, 80]} />  
                    <meshStandardMaterial color="yellow" />
                </mesh>
            ))}
            
            {Array.from({ length: 40 }).map((_, i) => ( // BLANKS
                <mesh key={i} position={[0, 0.02, i * 2  ]} rotation={[0, 0, 0]}>
                    <boxGeometry args={[5, 0.1, 0.4]} />  
                    <meshStandardMaterial color="red" />
                </mesh>
            ))}

                  


                <RailRoadAnimation />       
            </group>
        </>
    );
};
//});
export default THREERailroadBlock;
//export default MemoizedTHREERailroadBlock;