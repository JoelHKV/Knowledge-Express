import React from 'react';
import { Text } from '@react-three/drei';

const THREEMilestoneBlock = ({ item }) => {
    return (
        <mesh position={[item.x, item.y, item.z]} rotation={[0, 0, 0]}>
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
    );
};

export default THREEMilestoneBlock; 
