import { useEffect, useState } from "react";

export default function Time({ setFinished }: { setFinished: (finished: boolean) => void }) {
  const [secondsLeft, setSecondsLeft] = useState<number>(() => {
    const saved = localStorage.getItem("quizTargetTime");
    return saved ? parseInt(saved) : 100;
  });

  useEffect(() => {
    if (secondsLeft <= 0) {
      localStorage.removeItem("quizTargetTime");
      setFinished(true);
      return;
    }

    localStorage.setItem("quizTargetTime", secondsLeft.toString());

    const timer = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft, setFinished]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  return (
    <div className="text-4xl font-mono font-bold m-10">
      <span className={minutes === 0 && seconds < 10 ? "text-red-500" : ""}>
        {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
      </span>
    </div>
  );
}