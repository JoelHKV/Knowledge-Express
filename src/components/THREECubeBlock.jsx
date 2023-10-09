import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const THREECubeBlock = () => {
    const meshRef = useRef();

    // Rotate the cube
    useFrame(() => {
        if (meshRef.current) {
            meshRef.current.rotation.x += 0.01;
            meshRef.current.rotation.y += 0.01;
        }
    });

    // Define the cube
    return (
         <>
             


            <mesh ref={meshRef} position={[0, 2, 0]} >
            <boxGeometry args={[2, 2, 2]} />
            <meshStandardMaterial color="blue" />
            </mesh>
        </>
    );
};

export default THREECubeBlock ;
