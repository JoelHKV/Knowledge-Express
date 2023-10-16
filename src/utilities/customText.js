import React, { useEffect, useRef } from 'react';
import { Text } from 'three-bmfont-text';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';

const CustomText = ({ text, position, color, fontSize, depth }) => {
    const fontLoader = new FontLoader();
    const textRef = useRef(null);

    useEffect(() => {
        fontLoader.load('/fonts/helvetiker_regular.typeface.json', (font) => {
            const config = {
                font,
                color,
                size: fontSize,
                depth: depth,
                bevelEnabled: false,
            };
            textRef.current = new Text(config);
        }, []);

        return (
            <primitive object={textRef.current} position={position} text={text} />
        );
    };

    export default CustomText;
