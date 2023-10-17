import axios from 'axios';
import { useState, useEffect, useRef } from 'react';

export const fetchQandA = (cloudFunctionURL, thisQuestion) => {

    const [questionAnswerData, setQuestionAnswerData] = useState({});
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

    useEffect(() => {
        if (thisQuestion) {
            loadedRef.current = false
            fetchData()         
        }

    }, [thisQuestion])

    const loaded = loadedRef.current
    return { questionAnswerData, loaded, error }

};

