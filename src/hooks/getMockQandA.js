import axios from 'axios';
import { useState, useEffect, useRef } from 'react';





export const getMockQandA = (cloudFunctionURL, thisQuestion) => {
    const [questionAnswerData, setQuestionAnswerData] = useState({});
  
    const [error, setError] = useState(null);
    const loadedRef = useRef(false);


    useEffect(() => {
        if (thisQuestion) {
            loadedRef.current = false
            fetchMockData()
        }

    }, [thisQuestion])


    const getRandomNumber = (min, max) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    const waitTime = getRandomNumber(1000, 4000)



    const fetchMockData = () => {
        const questionAnswerDataDict = {}
        questionAnswerDataDict['answer'] = generateRandomSentence(getRandomNumber(500, 600))
        for (let i = 1; i <= 6; i++) {
            questionAnswerDataDict['q' + i.toString()] = generateRandomSentence(getRandomNumber(60, 200))
        }
             
        setTimeout(() => {
            
            setQuestionAnswerData(questionAnswerDataDict) 
            loadedRef.current = true
        }, waitTime);
        setTimeout(() => {
            loadedRef.current = false
                       
        }, waitTime+1000);

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


    const loaded = loadedRef.current
    return { questionAnswerData, loaded, error }

};

