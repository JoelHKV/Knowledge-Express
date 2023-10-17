import React, { useState, useEffect } from 'react';
import { styled } from '@mui/system';
import { Slider, Button, Typography } from '@mui/material';

import { addWhatToDict, composeDict } from '../utilities/generateSignsPerButtonClick';


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
        backgroundColor: 'black',
    },
    '& .MuiSlider-rail': {
        backgroundColor: 'black',
    },


}));
 
 
const TrainControlBlock = ({ finalSignAt, distanceRef, gameState, pivotDistanceToSign, distanceToFirstSign, signSpacing, setGameState, setSceneItems, trainSpeed, setTrainSpeed, setOldTrainSpeed, forceStopFlag }) => {
      
    useEffect(() => {
       // handleControlBoardClick('OwnQuestion')
         handleControlBoardClick('WorldQuestion') 
       // handleControlBoardClick('Instructions')
    }, []);
  
    const handleSliderChange = (event, newValue) => {
        if (gameState !== 'stroll') { return }
       forceStopFlag.current = false   
       setTrainSpeed(newValue) 
    };

    const handleControlBoardClick = (questionMode) => {
        const distanceValue = parseInt(distanceRef.current);

        if (questionMode === 'OwnQuestion') {
            setGameState('input')
            setOldTrainSpeed(trainSpeed)
            setTrainSpeed(0)   
            const locationID = 0.1 + pivotDistanceToSign + parseInt(distanceRef.current)
            const [tempDict, firstItemAt, finalSignLocation] = composeDict(questionMode, '', null, null, locationID);
            delete tempDict[0]
            setSceneItems(tempDict)
        }
        else {
            setGameState('stroll')
            const [tempDict, firstItemAt, finalSignLocation] = composeDict(questionMode, null, 20, signSpacing, distanceToFirstSign + distanceValue)
            finalSignAt.current = finalSignLocation            
            setSceneItems(tempDict)
        }
  
    };

    const handleMouseWheelScroll = (event) => {
        if (gameState !== 'stroll') { return }
     
        if (event.deltaY < 0 && trainSpeed < 4) {             
            setTrainSpeed((prevSpeed) => prevSpeed + 1);
            setOldTrainSpeed(trainSpeed + 1)         
        }
        if (event.deltaY > 0 && trainSpeed > 0) {
            setTrainSpeed((prevSpeed) => prevSpeed - 1);
            setOldTrainSpeed(trainSpeed - 1)
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
        <div className="TrainControlBlock" onWheel={handleMouseWheelScroll}>  
            <div className="controlboardtop"></div>
            <div className="controlboard"></div>


            <Typography className='AppTitleText' variant="h3">
                Knowledge Express
            </Typography>



            <div>
                <div className="TrainControlBlockSpeedSlider">
                    <CustomSlider
                        value={trainSpeed}
                        onChange={handleSliderChange}
                        orientation="vertical"
                        min={0}
                        max={3}
                        step={1}
                        marks
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
