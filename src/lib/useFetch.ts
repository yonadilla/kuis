import { useCallback, useEffect, useRef, useState } from "react";

interface Question {
    type: string;
    difficulty: string;
    category: string;
    question: string;
    correct_answer: string;
    all_answers: string[]; 
}

export default function useFetcher() {
    const [questionData, setQuestionData] = useState<Question[]>([]);

    const isFetching = useRef(false)
    const refresData = useCallback(async() => {
        if (isFetching.current) return; 
        isFetching.current = true;

        try {
            const response = await fetch("https://opentdb.com/api.php?amount=10");
            const data = await response.json();
            if (data.results) {
                const dataQuestion = data.results.map((item: any) =>   ({
                    type : item.type,
                    difficulty : item.difficulty,
                    category : item.category,
                    question : item.question,
                    correct_answer : item.correct_answer,
                    all_answers: [...item.incorrect_answers, item.correct_answer].sort(() => Math.random() - 0.5)
                }))
                setQuestionData(dataQuestion);
                localStorage.setItem("quizData", JSON.stringify(dataQuestion));
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            isFetching.current = false;
        }
    },[])

    useEffect(() => {
        const saveData = localStorage.getItem("quizData");       
        if (saveData && saveData !== '[]') {
            setQuestionData(JSON.parse(saveData));
        } else {
            refresData();
            console.log("fetching new data");
        }
    },[refresData])

 
    return {questionData, setQuestionData, refresData};
}