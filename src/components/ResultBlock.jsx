import React from 'react';
import './ResultBlock.css';
import { Typography } from '@mui/material';
import { useSelector } from 'react-redux';

const ResultBlock = () => {

    const roundTotal = useSelector((state) => state.counter[0].roundTotal);
    const points = useSelector((state) => state.counter[0].points); // nro points

    return (
        <div className="ResultBlock centerContent">
            <div className="result-info-text">
                <Typography variant="h5">
                    Your Score: {points} / {roundTotal}
                </Typography>
        
            </div>
         
        </div>
    );
};

export default ResultBlock;