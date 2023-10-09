import React from 'react';
import './IntroBlock.css';
import { Button, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { incrementIntro, addQuizOptions } from '../reducers/quizGameSlice';

const instructionsText = [
    "Wait while painting images are being loaded...",
    "Gallery Galore is a collection of AI-generated paintings that help you associate famous painters with their distinct painting styles.",
    "In the practice mode, you can browse through random paintings by clicking on the current painting. Alternatively, you can change the title with the bottom slider and the painter with the right slider. You can try these options now.",
    "In the quiz mode, your task is to guess the painter's name by clicking one of the four buttons below.\n\nClick on 'PRACTICE' or 'QUIZ' to start!"
];


const IntroBlock = () => {

    const dispatch = useDispatch();

    const nextIntro = () => {
        dispatch(incrementIntro());
        dispatch(addQuizOptions(4));   
    };

    const roundIntro = useSelector((state) => state.counter[0].roundIntro); // intro round nro

    return (
        <div className="IntroBlock">
            <div className="intro-info-text">
                <Typography variant="h6" style={{ whiteSpace: 'pre-line' }}>
                    {instructionsText[roundIntro]}
                </Typography>
                <div>
                    {(roundIntro >0 && roundIntro < 4) && (
                        <div className="intro_button">
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={nextIntro}
                            >
                                {roundIntro < 3 ? 'read more' : 'close'}
                            </Button>
                        </div>
                    )}
                </div>
            </div>
         
        </div>
    );
};

export default IntroBlock;