import React, { useEffect, useRef, useState } from 'react';
import { useFrame  } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { Stars } from '@react-three/drei';

const THREERailroadBlock = ({ distanceRef, canvasRef }) => {
  
    const hopDistance = 12;
    const meshRef = useRef();
    const [decorItems, setDecorItems] = useState(); 

 
    useEffect(() => {
      
        const decorItemCount = 1;
        const decorItemInit = [];
     
        for (let i = 0; i < decorItemCount; i++) {        
            decorItemInit.push({
                key: i,
                x: getMilestoneWidth(),
                y: 1,
                z: 10, // Initial X position
                rot: 0,
                 
           });
            
        }
     
        setDecorItems(decorItemInit)
    }, []);


    const getMilestoneWidth = () => {
        let milestoneWidth = 5;
        if (canvasRef) {
            milestoneWidth = 0.5 + 1.5 * canvasRef.current.offsetWidth / 250
        }
        return milestoneWidth
    }


    const RailRoadAnimation = () => {
        useFrame(() => {
            if (distanceRef.current - meshRef.current.position.z > hopDistance) {
                // Move the railroad block
                meshRef.current.position.z += hopDistance;

                const milestoneWidth = getMilestoneWidth()
                const updatedDecorItems = decorItems.map((item) => {
                    if (item.z < meshRef.current.position.z) {
                        item.z += 50;
                        item.x = milestoneWidth
                    }
                    return item; // You need to return a value from the map function even if you don't use it
                     
                });
                setDecorItems([...updatedDecorItems]);

            }
              
        });
    }



    return (
        <>                               
            <group ref={meshRef}  >  
                
           


                <mesh position={[0, -0.05, 40]} rotation={[0, 0, 0]}>
                    <boxGeometry args={[140, 0.1, 80]} />   
                    <meshStandardMaterial color="#D2B48C" />
                </mesh>
                {Array.from({ length: 2 }).map((_, index) => ( // RAILS
                    <mesh key={index} position={[-1 + index * 2, 0.05,  40]} rotation={[0, 0, 0]}>
                        <boxGeometry args={[0.2, 0.2, 80]} />  
                        <meshStandardMaterial color="#444444" />
                    </mesh>
                ))}
            
                {Array.from({ length: 40 }).map((_, i) => ( // BLANKS
                    <mesh key={i} position={[0, 0.02, i * 2  ]} rotation={[0, 0, 0]}>
                        <boxGeometry args={[5, 0.1, 0.4]} />  
                        <meshStandardMaterial color="brown" />
                    </mesh>
                ))}                          
                <RailRoadAnimation />       
            </group>


            {decorItems && decorItems.length > 0 && decorItems.map((item) => (                    
                <mesh
                    key={item.key}
                    position={[item.x, item.y, item.z]}
                    rotation={[0, 0, 0]}
                >
                    <boxGeometry args={[1, 2, 1]} />
                    <meshStandardMaterial color="black" />

                    <Text
                        color="white"
                        anchorX="center"
                        anchorY="middle"
                        position={[-0.1, 0.4, -0.55]}
                        rotation={[Math.PI, 0, Math.PI]}
                        maxWidth={1}
                        fontSize={0.4}
                    >
                        {Math.round(item.z / 50)}
                    </Text>
                    <Text
                        color="white"
                        anchorX="center"
                        anchorY="middle"
                        position={[-0.1, 0, -0.55]}
                        rotation={[Math.PI, 0, Math.PI]}
                        maxWidth={1}
                        fontSize={0.4}
                    >
                        {'km'}
                    </Text>

                </mesh>     



            ))}

           
                        
        </>
    );
};
export default THREERailroadBlock;
 