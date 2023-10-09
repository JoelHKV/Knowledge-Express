import React from 'react';
import { Typography } from '@mui/material';
import './ShowDetaisBlock.css';
import { useSelector } from 'react-redux';
const ShowDetaisBlock = ({ paintingNames, painters }) => {
 
    const thisPainterNro = useSelector((state) => state.counter[0].randPainter); // painter nro
    const thisPaintingNro = useSelector((state) => state.counter[0].randPainting); // painting nro

    return (
        <div className="ShowDetaisBlock  centerContent">
            <div className="painting-painter-name">
                <Typography variant="h5">
                    {paintingNames[thisPaintingNro]}
                </Typography>
                <Typography variant="h5">
                    {painters[thisPainterNro]}
                </Typography>
            </div>        
        </div>
    );
};

export default ShowDetaisBlock;