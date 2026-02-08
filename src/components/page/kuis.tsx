import { useEffect, useState } from "react";
import Time from "../time";
import useFetcher from "@/lib/useFetch";

export default function Kuis() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [finished, setFinished] = useState(false);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [score , setScore] = useState({
    corretAnswers : 0,
    falseAnswers : 0,
    scoreAnswer : 0
  });
  
  
  const { questionData, setQuestionData, refresData } = useFetcher()


  useEffect(() => {
    
    const getToken = localStorage.getItem("loginSession");
    if (!getToken) {
      alert("You must be logged in to access the quiz.");
      window.location.href = "/login";
    }

    const savedProgress = localStorage.getItem("quizProgress");
    if (savedProgress) {
      const parsedProgress = JSON.parse(savedProgress);
      setCurrentQuestionIndex(parsedProgress.currentQuestionIndex || 0)
      setAnswers (parsedProgress.answers || {});
      setScore (parsedProgress.score || {
        corretAnswers : 0,
        falseAnswers : 0,
        scoreAnswer : 0
      });
      if (parsedProgress.finished) setFinished(true);
    }
  }, [])

  useEffect(() => {
    if (questionData.length > 0 ) {
      const progess = {
        currentQuestionIndex,
        answers,
        score,
        finished
      }
      localStorage.setItem("quizProgress", JSON.stringify(progess));
    }
  },[currentQuestionIndex, answers, score, finished, questionData])


  

  const handleAnswerSelect = (answer: string) => {
  setAnswers(prev => ({
    ...prev,
    [currentQuestionIndex]: answer,
  }));
};

const handleRestart = () => {
  localStorage.removeItem("quizProgress");
  localStorage.removeItem("quizData");
  localStorage.removeItem("quizTargetTime");
  setQuestionData([])
  window.location.reload();
}

const handleCheckAnswers = () => {
  questionData.map((question, index) => {
    if (answers[index] === question.correct_answer) {
      setScore(prev => ({
        ...prev,
        corretAnswers: prev.corretAnswers + 1,
        scoreAnswer: prev.scoreAnswer + 10
      }));
    } else {
      setScore(prev => ({
        ...prev,
        falseAnswers: prev.falseAnswers + 1
      }));
    }
  })
}


  if (finished) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold">Quiz Results</h2>
        <p className="mt-4">Score: {score.scoreAnswer}</p>
        <p className="mt-2">
          Correct: {score.corretAnswers} | Incorrect: {score.falseAnswers}
        </p>
        <p>Total Questions: {score.corretAnswers + score.falseAnswers}</p>
        <div className="mt-6 flex gap-2">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded"
            onClick={() => {
             refresData();
             handleRestart();
            }}
          >
            Restart
          </button>
        </div>
      </div>
    );
  }


 
  return (
 questionData.length > 0 ? (
    <>
      <div className="max-w-md mx-auto p-4">
        <h1 className="text-xl font-bold mb-4">Kuis</h1>
        
        <div className="space-y-4">
          <div className="p-4 border rounded shadow-sm">
            <h2 className="font-semibold mb-3">
              Q{currentQuestionIndex + 1}:{" "}
              {questionData[currentQuestionIndex]?.question}
            </h2>
            
            {Array.isArray(questionData[currentQuestionIndex]?.all_answers) &&
              questionData[currentQuestionIndex].all_answers.map((a, i) => {
                const isSelected = answers[currentQuestionIndex] === a;
                return (
                  <div key={i} className="mt-2">
                    <button
                      onClick={() => {
                        setCurrentQuestionIndex((prev) => Math.min(prev + 1, questionData.length - 1));
                        handleAnswerSelect(a);
                      }}
                      className={`w-full px-4 py-2 rounded border transition-colors ${
                        isSelected 
                          ? 'bg-blue-500 text-white border-blue-600' 
                          : 'bg-gray-100 text-black hover:bg-gray-200'
                      }`}
                    >
                      {a}
                    </button>
                  </div>
                );
              })}
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-2">
          <div className="flex gap-2">
            {currentQuestionIndex > 0 && (
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded flex-1"
                onClick={() => setCurrentQuestionIndex((prev) => Math.max(prev - 1, 0))}
              >
                Previous
              </button>
            )}

            {currentQuestionIndex < questionData.length - 1 ? (
              <button
                onClick={() => setCurrentQuestionIndex((prev) => Math.min(prev + 1, questionData.length - 1))}
                className="bg-blue-600 text-white px-4 py-2 rounded flex-1"
              >
                Next Question
              </button>
            ) : (
              <button
                className="bg-green-600 text-white px-4 py-2 rounded flex-1"
                onClick={() => {setFinished(true), handleCheckAnswers() }}
              >
                Complete Quiz
              </button>
            )}
          </div>

          <button
            className="bg-red-500 text-white px-4 py-2 rounded w-full mt-4"
            onClick={() => {setFinished(true), handleCheckAnswers() }}
          >
            Submit Quiz Now
          </button>
        </div>

        <div className="mt-4 text-center">
          <Time setFinished={setFinished}  />
        </div>
      </div>
    </>
  ) : (
    <div className="flex justify-center items-center h-screen">Loading...</div>
  )
);
}
