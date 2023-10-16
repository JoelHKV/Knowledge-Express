import React, { useState, useEffect } from 'react';
import { styled } from '@mui/system';
import { Slider, Button, Typography } from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'; // You can choose an appropriate icon

import { addWhatToDict, composeDict } from '../utilities/generateSignsPerButtonClick';

import TextInputBlock from '../components/TextInputBlock';

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
 

const TrainControlBlock = ({ upDateUseRefs, distanceRef, gameState, writeOwnQuestionAndGo, setGameState, setSceneItems, trainSpeed, setTrainSpeed, setOldTrainSpeed, openTextEntry, backToMotionAfterForcedStop, forceStopFlag }) => {
     
    const [ownQuestionPosition, setOwnQuestionPosition] = useState();


    useEffect(() => {

        handleControlBoardClick('WorldQuestion') 
       // handleControlBoardClick('Instructions')
    }, []);


    

    const handleSliderChange = (event, newValue) => {
       forceStopFlag.current = false   
       setTrainSpeed(newValue) 
    };


    const handleControlBoardClick = (questionMode) => {
        const distanceValue = parseInt(distanceRef.current);


        if (questionMode === 'OwnQuestion') {
            setGameState('input')
            setOldTrainSpeed(trainSpeed)
            setTrainSpeed(0)   
            const ownQuestion = 6 + distanceValue
            setOwnQuestionPosition(ownQuestion)




            const [tempDict, firstItemAt, finalSignLocation] = composeDict(questionMode, '', null, null, ownQuestion);
            setSceneItems(tempDict)

        }
        else {

            const [tempDict, firstItemAt, finalSignLocation] = composeDict(questionMode, null, 20, 5, 1 + distanceValue)
            upDateUseRefs(finalSignLocation)
            setSceneItems(tempDict)
        }

        
    };

    const handleSubmitTextEntry = (ownQuestion) => {
        writeOwnQuestionAndGo(ownQuestion, ownQuestionPosition)
    }

    const handleMouseWheelScroll = (event) => {
        const scrollDirection = Math.sign(event.deltaY) 
        if (event.deltaY < 0 && trainSpeed < 4) {             
            setTrainSpeed((prevSpeed) => prevSpeed + 1);
            setOldTrainSpeed(trainSpeed + 1)         
        }
        if (event.deltaY > 0 && trainSpeed > 0) {
            setTrainSpeed((prevSpeed) => prevSpeed - 1);
            setOldTrainSpeed(trainSpeed - 1)
        }
        console.log('Mouse wheel scrolled', scrollDirection);
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
             
            
              


            {gameState === 'input' && <TextInputBlock
                handleSubmitTextEntry={handleSubmitTextEntry}
            />
            }                              
        </div>
    );
};

export default TrainControlBlock;
