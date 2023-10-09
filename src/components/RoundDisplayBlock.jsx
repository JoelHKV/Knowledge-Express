import React from 'react';
import { Typography, Button } from '@mui/material';
import './RoundDisplayBlock.css';
import { useSelector, useDispatch } from 'react-redux';

import {  newGameMode } from '../reducers/quizGameSlice';

const RoundDisplayBlock = () => {

    const roundNro = useSelector((state) => state.counter[0].roundNro);
    const roundTotal = useSelector((state) => state.counter[0].roundTotal);
    const dispatch = useDispatch();

    const restart = () => { // show introscreen
        dispatch(newGameMode('practice'))
    }

    return (
        <div className="RoundDisplayBlock centerContent">                      
            <Typography variant="h5">
                Round: {roundNro + 1} / {roundTotal}   
            </Typography>
            <Button
                variant="contained"
                    onClick={() => restart()}
                >
                X
            </Button>                   
        </div>
    );
};

export default RoundDisplayBlock;