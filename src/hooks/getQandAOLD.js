import axios from 'axios';
import { useState, useEffect, useRef } from 'react';



export const getQandA = (cloudFunctionURL, thisQuestion) => {
    const [questionAnswerData, setQuestionAnswerData] = useState({});
 
   // const [loaded, setLoaded] = useState(false);  
    const [error, setError] = useState(null);


    const loadedRef = useRef(false);


    const fetchData = () => { 
        
        axios   
            .get(cloudFunctionURL + '?question=' + thisQuestion)   
            .then(response => {
                response.data
                setQuestionAnswerData(response.data) 
                 
                loadedRef.current = true
                setTimeout(() => {
                    loadedRef.current = false
                }, 1000);



            })
            .catch(error => {
                setError('1st error: ' + error);
            })
            .finally(() => {
                
            });
 

    }

    const fetchMockData = () => {
        const questionAnswerDataDict = {}
        questionAnswerDataDict['answer'] = generateRandomSentence(getRandomNumber(500, 600))
        for (let i = 1; i <= 6; i++) {
            questionAnswerDataDict['q' + i.toString()] = generateRandomSentence(getRandomNumber(60, 200))
        }
         
        
        setTimeout(() => {
            
            setQuestionAnswerData(questionAnswerDataDict) 
            loadedRef.current = true
        }, 1400);
        setTimeout(() => {
            loadedRef.current = false
             
            // setLoaded(true)
        }, 2400);



    }


    const generateRandomSentence = (length) => {
        const words = [
            'Lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing',
            'elit', 'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
            'magna', 'aliqua', 'Ut', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud', 'exercitation',
            'ullamco', 'laboris', 'nisi', 'ut', 'aliquip', 'ex', 'ea', 'commodo', 'consequat'
        ];

        let sentence = '';

        while (sentence.length < length) {
            const word = getRandomElement(words);
            sentence += word + ' '; // Add word with space separator
        }

        // Capitalize the first letter and add a period at the end
        sentence = sentence.charAt(0).toUpperCase() + sentence.slice(1, -1) + '.';

        return sentence;
    };


    const getRandomNumber = (min, max) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    const getRandomElement = (array) => {
        return array[Math.floor(Math.random() * array.length)];
    };




    useEffect(() => {
        if (thisQuestion) {
           // setLoaded(false)
            loadedRef.current = false
            fetchData()
           // fetchMockData()
             
        }



    }, [thisQuestion])
    const loaded = loadedRef.current
    return { questionAnswerData, loaded, error }

};

