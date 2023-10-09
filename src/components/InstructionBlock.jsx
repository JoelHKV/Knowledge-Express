import React from 'react';
import { useSelector } from 'react-redux';
import { Grid  } from '@mui/material';
import '../App.css';

import ModeButtonRow from './ModeButtonRow';
import PaintingAndSliderBlock from './PaintingAndSliderBlock';
import PainterButtonArray from './PainterButtonArray';
import IntroBlock from './IntroBlock';

const InstructionBlock = ({ handleModeChange, imagesLoaded, preloadedImages, painters, wrongOptionOpacity, setWrongOptionOpacity, quizNextRound }) => {

    const roundIntro = useSelector((state) => state.counter[0].roundIntro); // intro round nro

    return (
        <React.Fragment>
            <Grid item xs={12} className="second-row centerContent">
                <ModeButtonRow buttonFunction={handleModeChange} />
            </Grid>
            <Grid item xs={12} className="mainGameWindow">
                {(roundIntro > 0 && imagesLoaded) && (
                    <PaintingAndSliderBlock
                        showSlider={roundIntro == 2}
                        clickable={roundIntro == 2}
                        preloadedImages={preloadedImages}
                    />
                )}
                {(roundIntro < 4) && (
                    <IntroBlock />
                )}
            </Grid>

            <Grid item xs={12} className="last-row centerContent">
                {(roundIntro === 3) && (
                    <PainterButtonArray
                        painters={painters.map(painter => painter.nameShort)}
                        wrongOptionOpacity={wrongOptionOpacity}
                        setWrongOptionOpacity={setWrongOptionOpacity}
                        quizNextRound={quizNextRound}
                        clickableButtons={false}
                    />
                )}
            </Grid>
        </React.Fragment>
    );
};

export default InstructionBlock;