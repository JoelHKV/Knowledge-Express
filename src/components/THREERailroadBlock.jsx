import React, { useEffect, useRef, useState } from 'react';
import { useFrame  } from '@react-three/fiber';

const THREERailroadBlock = ({  distanceRef }) => {

    console.log('rerender railroad ')
    const hopDistance = 12;
    const meshRef = useRef();
    const [decorItems, setDecorItems] = useState(); 
 
    
    useEffect(() => {
      
        const decorItemCount = 20;
        const decorItemInit = [];
     
        for (let i = 0; i < decorItemCount; i++) {        
            decorItemInit.push({
                key: i,
                x: Math.sign(Math.random() - 0.5) * (3 + 20 * Math.random()),
                y: -0.2,
                z: 70 * Math.random(), // Initial X position
                rot: 2 * Math.PI * Math.random(),
                 
           });
            
        }
     
        setDecorItems(decorItemInit)
    }, []);


    const RailRoadAnimation = () => {
        useFrame(() => {
            if (distanceRef.current - meshRef.current.position.z > hopDistance) {
                // Move the railroad block
                meshRef.current.position.z += hopDistance;

  
                const updatedDecorItems = decorItems.map((item) => {
                    if (item.z < meshRef.current.position.z) {
                        item.z += 50;
                        
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
                    <meshStandardMaterial color="#55aa33" />
                </mesh>
                {Array.from({ length: 2 }).map((_, index) => ( // RAILS
                    <mesh key={index} position={[-1 + index * 2, 0.05,  40]} rotation={[0, 0, 0]}>
                        <boxGeometry args={[0.2, 0.2, 80]} />  
                        <meshStandardMaterial color="#222222" />
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
                    <boxGeometry args={[1, 1, 1]} />
                    <meshStandardMaterial color="black" />
                </mesh>               
            ))}
                        
        </>
    );
};
export default THREERailroadBlock;
 