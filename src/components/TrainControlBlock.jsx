import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';


import { styled } from '@mui/system';
import { Slider, Button, Typography } from '@mui/material';

import { composeOneEmptySign, composeSignsFromSetArray } from '../utilities/generateSignsPerButtonClick';


import './TrainControlBlock.css';

const CustomSlider = styled(Slider)(({ value }) => ({
    '& .MuiSlider-thumb': {
        backgroundColor: value === 0 ? 'red' : 'green',
        borderRadius: value === 0 ? '30%' : '0%',
        clipPath: value === 0 ? 'none' : 'polygon(50% 0%, 0% 100%, 100% 100%)',
        width: value === 0 ? 56 : 60,
        height: value === 0 ? 56 : 60,
    },
    '& .MuiSlider-track': {
        backgroundColor: '#880088',
        width: 20,
    },
    '& .MuiSlider-rail': {
        backgroundColor: 'black',
        width: 20,
    },


}));
 
 
const TrainControlBlock = ({ finalSignAt, distanceRef, pivotDistanceToSign, distanceToFirstSign, signSpacing, setGameState, setSceneItems, trainSpeedRef, canvasRef, refe }) => {


    const [sliderValue, setSliderValue] = useState(trainSpeedRef.current);
    const maxSpeed = 4

    useEffect(() => {
        setTimeout(function () {
            handleControlBoardClick('Instructions')
        }, 500);
        
    }, []);

 
    useImperativeHandle(refe, () => ({
        handleMouseWheelFromParent,
        stopOrResumeMotion,
    }));

    const handleMouseWheelFromParent = (increment) => {        
        changeSpeed(Math.abs(trainSpeedRef.current) - increment)
    }


    const changeSpeed = (newSpeed) => {
        if (newSpeed < 0) {
            newSpeed = 0
        }
        if (newSpeed > maxSpeed) {
            newSpeed = maxSpeed
        }
        trainSpeedRef.current = newSpeed
        setSliderValue(newSpeed)    
    }
 
     
    const stopOrResumeMotion = (mode) => {
        if (mode === 'stop') {
            trainSpeedRef.current = - Math.abs(trainSpeedRef.current)
            setSliderValue(0)
        }
        if (mode === 'resume') {
            trainSpeedRef.current = Math.abs(trainSpeedRef.current)
            setSliderValue(trainSpeedRef.current)
        } 
    }


    const handleControlBoardClick = (questionMode) => {

        if (questionMode === 'OwnQuestion') {
            setGameState('input') // pops out the actual text entry
            stopOrResumeMotion('stop')
            console.log(trainSpeedRef.current)
            const locationID = 0.1 + pivotDistanceToSign + parseInt(distanceRef.current)
            const tempDict = composeOneEmptySign(locationID) // creates a 3d sign behind it
            setSceneItems(tempDict)
        }
        else {
            setGameState('stroll')
            stopOrResumeMotion('resume')
            const positionID = distanceToFirstSign + distanceRef.current
            const [tempDict, finalSignLocation] = composeSignsFromSetArray(positionID, questionMode, 1, signSpacing, canvasRef)
            finalSignAt.current = finalSignLocation            
            setSceneItems(tempDict)
        }
  
    };

    const buttonConfig = [
        {
            text: 'WQ',
            parameter: 'WorldQuestion',
        },
        {
            text: 'LQ',
            parameter: 'LifeQuestion',
        },
        {
            text: 'MQ',
            parameter: 'OwnQuestion',
        },
        {
            text: '?',
            parameter: 'Instructions',
        },
    ];
   
    return (
        <div className="TrainControlBlock">                

            <div className="TitleBoard"></div>

             
            <Typography className='AppTitleText' variant="h3">
                Knowledge Express
            </Typography>
            <div className="ControlBoard"></div>          
            <div>
                <div className="TrainControlBlockSpeedSlider">
                    <CustomSlider
                        value={sliderValue}
                        onChange={(event, newSpeed) => changeSpeed(newSpeed)}
                        orientation="vertical"
                        min={0}
                        max={maxSpeed}
                        step={1}                    
                    />
                </div>
            </div>
             
            {buttonConfig.map((config, index) => (
                <Button
                    key={index}
                    variant="contained"
                    className={`TrainControlBlock${config.parameter}Button`}
                    color="primary"
                    onClick={() => handleControlBoardClick(config.parameter)}
                >
                    {config.text}
                </Button>
            ))}                                                                
        </div>
    );
};

export default TrainControlBlock;
