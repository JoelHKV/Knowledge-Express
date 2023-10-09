import React from 'react';
import { useFrame } from '@react-three/fiber';

import { Text } from '@react-three/drei';

//const THREERailroadBlock = ({ distanceTravelled }) => {
const MemoizedTHREERailroadBlock = React.memo(({ distanceTravelled }) => {

    console.log('rerender railroad ')

    return (
        <>            
            <mesh position={[0, -0.05, distanceTravelled + 40]} rotation={[0, 0, 0]}>
                <boxGeometry args={[140, 0.1, 80]} />   
                <meshStandardMaterial color="brown" />
            </mesh>
            {Array.from({ length: 2 }).map((_, index) => ( // RAILS
                <mesh key={index} position={[-1 + index * 2, 0.05, distanceTravelled+40]} rotation={[0, 0, 0]}>
                    <boxGeometry args={[0.2, 0.2, 80]} />  
                    <meshStandardMaterial color="yellow" />
                </mesh>
            ))}
            
            {Array.from({ length: 40 }).map((_, i) => ( // BLANKS
                <mesh key={i} position={[0, 0.02, i * 2 + Math.round(distanceTravelled / 2) * 2]} rotation={[0, 0, 0]}>
                    <boxGeometry args={[5, 0.1, 0.4]} />  
                    <meshStandardMaterial color="red" />
                </mesh>
            ))}
                       
        </>
    );
//};
});
//export default THREERailroadBlock;
export default MemoizedTHREERailroadBlock;