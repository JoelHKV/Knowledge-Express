import { createSlice } from '@reduxjs/toolkit';
 
const initialState = [
    {
        roundIntro: 0,
        roundNro: 0,
        roundTotal: 3,
        points: 0,
        randPainter: 7,
        randPainting: 3,
        gameMode: 'intro',
    }
]

const knowledgeExpressReducer = createSlice({
    name: 'counter',
    initialState,
    reducers: {
  
        newGameMode: (state, newValue) => {
            state[0].gameMode = newValue.payload;
        },
  
    }

});

export const { newGameMode } = knowledgeExpressReducer.actions;
export default knowledgeExpressReducer.reducer;