import React, { useState, useEffect } from 'react';
import { styled } from '@mui/system';
import { Slider, Button, Tooltip } from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'; // You can choose an appropriate icon

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
 

const TrainControlBlock = ({ upDateUseRefs, distanceRef, setSceneItems, trainSpeed, setTrainSpeed, openTextEntry, backToMotionAfterForcedStop, forceStopFlag }) => {
     



    useEffect(() => {

        handleControlBoardClick('WorldQuestion') 
       // handleControlBoardClick('Instructions')
    }, []);


    

    const handleSliderChange = (event, newValue) => {
       forceStopFlag.current = false   
       setTrainSpeed(newValue) 
    };


    const handleControlBoardClick = (questionMode) => {

        if (questionMode === 'MyQuestion') {
            openTextEntry()
            return
        }
        const distanceValue = parseInt(distanceRef.current);
        const [tempDict, firstItemAt, finalSignLocation] = composeDict(questionMode, null, 20, 5, 1+distanceValue)
        upDateUseRefs(finalSignLocation)

        setSceneItems(tempDict)
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
            parameter: 'MyQuestion',
        },
        {
            text: '?',
            parameter: 'Instructions',
        },
    ];
   
    return (
        <div className="TrainControlBlock">     
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
