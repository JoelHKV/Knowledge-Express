import React from 'react';

import { Grid  } from '@mui/material';
import '../App.css';

import ModeButtonRow from './ModeButtonRow';
import PaintingAndSliderBlock from './PaintingAndSliderBlock';
import ShowDetaisBlock from './ShowDetaisBlock';
import ResultBlock from './ResultBlock';

const PracticeBlock = ({ gameMode, handleModeChange, preloadedImages, paintingNames, painters }) => {
   
    return (
        <React.Fragment>
            <Grid item xs={12} className="second-row centerContent">
                <ModeButtonRow buttonFunction={handleModeChange} />
            </Grid>
            <Grid item xs={12} className="mainGameWindow">
                <PaintingAndSliderBlock
                    showSlider={true}
                    clickable={true}
                    preloadedImages={preloadedImages}
                />
                {(gameMode === 'finish') && (
                    <ResultBlock />
                )}

            </Grid>
            <Grid item xs={12} className="last-row centerContent">
                <ShowDetaisBlock
                    paintingNames={paintingNames}
                    painters={painters.map(painter => painter.nameFull)}
                />
            </Grid>
        </React.Fragment>
    );
};

export default PracticeBlock;