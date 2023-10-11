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
 

const TrainControlBlock = ({ upDateUseRefs, distanceRef, setSceneItems, trainSpeed, setTrainSpeed, backToMotionAfterForcedStop }) => {
     
    //const [thisSpeed, setThisSpeed] = useState(speed);
     

    useEffect(() => {

        handleControlBoardClick('WorldQuestion') 
       // handleControlBoardClick('Instructions')
    }, []);



    const handleSliderChange = (event, newValue) => {
        backToMotionAfterForcedStop()
        //setThisSpeed(newValue);    
        setTrainSpeed(newValue)
        //upDateUseRefs('speedRef', newValue)   

        //const distanceValue = distanceRef.current;
       // console.log("Distance Value:", distanceValue);
    };


    const handleControlBoardClick = (questionMode) => {
        const distanceValue = distanceRef.current;
        const [tempDict, firstItemAt, lastItemAt] = composeDict(questionMode, null, 20, 5, distanceValue)

        upDateUseRefs(firstItemAt, lastItemAt)

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
             
            <svg
                width="10%"
                height="10%"
                style={{ position: 'absolute', bottom: '200px', left: '20%', transform: 'translateX(-50%)' }}
            >
                <circle cx="140" cy="140" r="140" fill="none" stroke="black" strokeWidth="100" />
            </svg>



        </div>
    );
};

export default TrainControlBlock;
