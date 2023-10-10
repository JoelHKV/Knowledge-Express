import axios from 'axios';
import { useState, useEffect, useRef } from 'react';



export const getQandA = (cloudFunctionURL, thisQuestion) => {
    const [questionAnswerData, setQuestionAnswerData] = useState({});
 
   // const [loaded, setLoaded] = useState(false);  
    const [error, setError] = useState(null);


    const loadedRef = useRef(false);


    const fetchData = () => { 
        
        axios
            .get(cloudFunctionURL + '?concept_name=' + queryParam.replace(/\//g, "-"))
            .then(response => {
                setConceptDetails(response.data)
                setLoaded(true)

            })
            .catch(error => {
                setError('1st error: ' + error);
            })
            .finally(() => {
                
            });
 

    }

    const fetchMockData = () => {
        const questionAnswerDataDict = {}
        questionAnswerDataDict['Answer'] = generateRandomSentence(getRandomNumber(500, 600))
        for (let i = 1; i <= 6; i++) {
            questionAnswerDataDict['Question' + i.toString()] = generateRandomSentence(getRandomNumber(60, 200))
        }
         
        
        setTimeout(() => {
            loadedRef.current = true
            setQuestionAnswerData(questionAnswerDataDict) 
           // setLoaded(true)
        }, 4400);
        setTimeout(() => {
            loadedRef.current = false
             
            // setLoaded(true)
        }, 6400);



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
            //fetchData()
            fetchMockData()
            console.log('fetch mock data', thisQuestion)
        }
    }, [thisQuestion])
    const loaded = loadedRef.current
    return { questionAnswerData, loaded, error }

};

