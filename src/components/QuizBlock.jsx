import React from 'react';

import { Grid  } from '@mui/material';
import '../App.css';


import RoundDisplayBlock from './RoundDisplayBlock';
import PaintingAndSliderBlock from './PaintingAndSliderBlock';
import PainterButtonArray from './PainterButtonArray';


const QuizBlock = ({ preloadedImages, painters, wrongOptionOpacity, setWrongOptionOpacity, quizNextRound }) => {
   
    return (
        <React.Fragment>
            <Grid item xs={12} className="second-row centerContent">
                <RoundDisplayBlock />
            </Grid>
            <Grid item xs={12} className="mainGameWindow">
                <PaintingAndSliderBlock
                    showSlider={false}
                    clickable={false}
                    preloadedImages={preloadedImages}
                />

            </Grid>
            <Grid item xs={12} className="last-row centerContent">
                <PainterButtonArray
                    painters={painters.map(painter => painter.nameShort)}
                    wrongOptionOpacity={wrongOptionOpacity}
                    setWrongOptionOpacity={setWrongOptionOpacity}
                    quizNextRound={quizNextRound}
                    clickableButtons={true}
                />
            </Grid>
        </React.Fragment>
    );
};

export default QuizBlock;