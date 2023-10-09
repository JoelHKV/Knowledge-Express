import React from 'react';
import { Button } from '@mui/material';
import './PainterButtonArray.css';
import { useDispatch, useSelector } from 'react-redux';
import { incrementPoint, incrementRound } from '../reducers/quizGameSlice';

const answerTimeoutTime = 1200;

const PainterButtonArray = ({ clickableButtons, quizNextRound, painters, wrongOptionOpacity, setWrongOptionOpacity  }) => {

    const dispatch = useDispatch();

    const handleUserGuess = (correctPainterGuess) => {
        if (wrongOptionOpacity !== '') { return }
        setWrongOptionOpacity('wrong-option')
        if (correctPainterGuess) { // correct answer
            dispatch(incrementPoint());
        }
        setTimeout(() => {
            setWrongOptionOpacity('')
            dispatch(incrementRound())
            quizNextRound()          
        }, answerTimeoutTime);
    }

    const painterOptions = useSelector((state) => state.counter[0].painterOptions); // multiple choice options
    const thisPainterNro = useSelector((state) => state.counter[0].randPainter);

    const fakeIntroButton = clickableButtons ? '' : 'painter-button-fake';

    const buttonData = painterOptions.map((option, index) => {
        const isRightOption = option === thisPainterNro;
        const className = `${fakeIntroButton} painter-button-${index} ${isRightOption ? '' : wrongOptionOpacity}`;
        
        return {
            name: painters[option],
            className: className,
            param: isRightOption,
        };
    });

    const buttons = buttonData.map((button, index) => (
        <div key={index} className={`painter-option-button ${button.className}`}>
            <Button variant="contained" onClick={() => handleUserGuess(button.param)}>
                {button.name}
            </Button>
        </div>
    ));

    return (
        <div className="PainterButtonArray centerContent">
            {buttons}
        </div>
    );
};

export default PainterButtonArray;