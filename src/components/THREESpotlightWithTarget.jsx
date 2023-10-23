import React, { useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const SpotlightWithTarget = ( { distanceRef } ) => {
    const spotlight = useMemo(() => new THREE.SpotLight('#fff'), []);

    useFrame(() => {
        spotlight.position.z = distanceRef.current + 0
    });

    return (
        <group>
            <primitive
                object={spotlight}
                position={[0, 1, 0]}
                intensity={60}
                penumbra={0}
                angle={1.22 * Math.PI / 4}
            />
            <primitive object={spotlight.target} position={[0, 1e9 / 1.5, 1e9]} />
        </group>
    );
};

export default SpotlightWithTarget;
