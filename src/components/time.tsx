import Countdown from "react-countdown";
import { useEffect, useState } from "react";

export default function Time({ setFinished }: { setFinished: (finished: boolean) => void }) {
  const [targetDate, setTargetDate] = useState<number | null>(null);

  useEffect(() => {
    const savedTarget = localStorage.getItem("quizTargetTime");
    
    if (savedTarget) {
      setTargetDate(parseInt(savedTarget));
    } else {
      const newTarget = Date.now() + 100000;
      localStorage.setItem("quizTargetTime", newTarget.toString());
      setTargetDate(newTarget);
    }
  }, []);


  if (!targetDate) return null;

  return (
    <div className="text-4xl font-mono font-bold m-10">
      <Countdown 
        date={targetDate} 
        onComplete={() => {
          localStorage.removeItem("quizTargetTime");
          setFinished(true);
        }} 
        renderer={({ minutes, seconds }) => (
          <span className={minutes === 0 && seconds < 10 ? "text-red-500" : ""}>
            {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
          </span>
        )}
      />
    </div>
  );
}