import React, { useState } from 'react';
import './TextInputBlock.css'; // Import the CSS file

const TextInputBlock = ({}) => {


    const [inputValue, setInputValue] = useState('');

    const handleInputChange = (event) => {
    setInputValue(event.target.value);
    }

    const clearInput = () => {
        setInputValue('');
    }

    const handleSubmit = () => {
        // You can perform any actions you want when the submit button is clicked here
        // For example, you can call a function passed through the 'onSubmit' prop
        
        console.log(inputValue)
         
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
            
                <button className="submit-button" onClick={handleSubmit}>
                    Submit
                </button>
            </div>
            
         
    </div>
    );
    }

export default TextInputBlock; 





