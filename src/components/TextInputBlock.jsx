import React, { useState } from 'react';
import './TextInputBlock.css'; // Import the CSS file

const TextInputBlock = ({ setThisQuestion, setGameState, sceneItems, setSceneItems, addWaitmessages }) => {

    const [inputValue, setInputValue] = useState('');

    const handleInputChange = (event) => {
    setInputValue(event.target.value);
    }

    const clearInput = () => {
        setInputValue('');
    }


    const processOwnQuestion = (ownQuestion) => {
        setThisQuestion(ownQuestion)
        setGameState('questionSelected');
        const ownQuestionItem = sceneItems
        const locationKey = Object.keys(ownQuestionItem)[0]
        ownQuestionItem[locationKey]['signText'] = ownQuestion
        const newSceneItems = addWaitmessages(ownQuestionItem)
        setSceneItems(newSceneItems)
    }

    return (
        <div className="TextInputBlock">                         
            <textarea className="TextInputBlock-text"
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                rows="4" 
                placeholder="Type your question here..."
            ></textarea>           
            {inputValue && (
                <button className="TextInputBlock-clear-button" onClick={clearInput}>
                    X   
                </button>
            )}          
            <button
                className="TextInputBlock-submit-button"
                onClick={() => inputValue.trim() !== '' && processOwnQuestion(inputValue)}
            >
                Submit
            </button>                                          
        </div>
    );
}

export default TextInputBlock; 
