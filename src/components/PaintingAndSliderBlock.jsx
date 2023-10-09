import React from 'react';
import { styled } from '@mui/system';
import { Slider  } from '@mui/material';
import './PaintingAndSliderBlock.css';
import { useDispatch, useSelector } from 'react-redux';
import { randomChoice, paintingSliderChoice, painterSliderChoice } from '../reducers/quizGameSlice';

 
const CustomSlider = styled(Slider)(() => ({
    '& .MuiSlider-thumb': {
        backgroundColor: 'var(--button-background-color)',
        width: 26,
        height: 26,
         
    },
    '& .MuiSlider-track': {
        backgroundColor: 'black',
    },
    '& .MuiSlider-rail': {
        backgroundColor: 'black',
    },
}));


const PaintingAndSliderBlock = ({ showSlider, clickable, preloadedImages }) => {

    const dispatch = useDispatch();
    const maxPaintingIndex = preloadedImages.length -1;  
    const maxPainterIndex = preloadedImages[0].length - 1;

    const thisPainterNro = useSelector((state) => state.counter[0].randPainter); // painter nro
    const thisPaintingNro = useSelector((state) => state.counter[0].randPainting); // painting nro
    
    const clickPaintingRandom = () => { // shows a random painting after clicking a painting 
        if (clickable) {
            dispatch(randomChoice([maxPaintingIndex, maxPainterIndex]));
        }
    }

    const handleSliderChange = (newValue, whichSlider) => {
        if (whichSlider == 'Painter') {
            dispatch(painterSliderChoice(newValue))
        }
        if (whichSlider == 'Painting') {
            dispatch(paintingSliderChoice(newValue))
        }        
       
    };

    
    return (
        <div className="PaintingAndSliderBlock centerContent">
            <img style={clickable ? { cursor: 'pointer' } : {}}
                src={preloadedImages[thisPaintingNro][thisPainterNro].src}
                alt="Image"
                onClick={clickPaintingRandom}
            />
            {(showSlider) && (
            <div>
            <div className="painting-slider">
                <CustomSlider
                    value={thisPaintingNro}
                     
                    onChange={(event, newValue) => handleSliderChange(newValue, 'Painting')}
                    min={0}
                    max={maxPaintingIndex}
                    step={1}
                    marks
                />
            </div>
            
            <div className="painter-slider">
                <CustomSlider
                    value={thisPainterNro}
                    onChange={(event, newValue) => handleSliderChange(newValue, 'Painter')}
                    orientation="vertical"
                    min={0}
                    max={maxPainterIndex}
                    step={1}
                    marks
                />
            </div>
                </div>
            )}
        </div>
    );
};

export default PaintingAndSliderBlock;