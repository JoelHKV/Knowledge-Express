import React, { useEffect, useRef, useState } from 'react';
import { useFrame  } from '@react-three/fiber';

import { Text } from '@react-three/drei';



//import { useUpdate } from 'react';


//import { extend } from '@react-three/fiber';
//import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

//import { FontLoader } from 'three/addons/loaders/FontLoader.js';

//import * as helvetiker from 'C:/AI_APP_LAB_REACT/KnowledgeExpress/src/utilities/fonts/helvetiker_regular.typeface.json'

//extend({ TextGeometry })




 

 


//import { Text } from 'three-bmfont-text';

//import { useUpdate } from '@react-three/fiber';
//import CustomText from '../utilities/CustomText';
//import { FontLoader } from 'three/addons/loaders/FontLoader.js';




 
//import { Text } from 'three-bmfont-text';
//import { Text as ThreeText, THREE } from '@react-three/drei';

const THREERailroadBlock = ({  distanceRef }) => {
//const MemoizedTHREERailroadBlock = React.memo(({ distanceTravelled, distanceRef }) => {

    console.log('rerender railroad ')
    const hopDistance = 12;
    const meshRef = useRef();
     
    const questionWords = ["?", "?", "Who?", "What?", "Where?", "When?", "Why?", "How?", "Which?", "Whose?", "Whom?"];

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
                item: questionWords[Math.floor(Math.random() * questionWords.length)]
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


            {decorItems && decorItems.length > 0 && decorItems.map((item) => (                    
                <mesh
                    key={item.key}
                    position={[item.x, item.y, item.z]}
                    rotation={[0, 0, 0]}
                >
                    <boxGeometry args={[1, 1, 1]} /> {/* Define the size of the box */}
                    <meshStandardMaterial color="black" />
                </mesh>               
            ))}
             
           





        </>
    );
};
//});
export default THREERailroadBlock;
//export default MemoizedTHREERailroadBlock;