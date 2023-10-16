import React, { useState } from 'react';
import './TextInputBlock.css'; // Import the CSS file

const TextInputBlock = ({ handleSubmitTextEntry }) => {


    const [inputValue, setInputValue] = useState('');

    const handleInputChange = (event) => {
    setInputValue(event.target.value);
    }

    const clearInput = () => {
        setInputValue('');
    }

    

    return (
    <div className="centered-container">
            <div className="centered-content">
                 
                <textarea className="centered-input"
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    rows="4" 
                    placeholder="Type your question here..."
                ></textarea>

            
                {inputValue && (
                    <button className="clear-button" onClick={clearInput}>
                         X  {/* You can use a suitable clear icon here */}

                    </button>
                )}
            
                <button
                    className="submit-button"
                    onClick={() => inputValue.trim() !== '' && handleSubmitTextEntry(inputValue)}
                >
                    Submit
                </button>
                





            </div>
            
         
    </div>
    );
    }

export default TextInputBlock; 





