import { useEffect, useState } from "react";

const getTimeRemaining = (unlockAt) => {
  const total = new Date(unlockAt) - new Date();

  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const days = Math.floor(total / (1000 * 60 * 60 * 24));

  return { total, days, hours, minutes, seconds };
};

const CountdownTimer = ({ unlockAt }) => {
  const [time, setTime] = useState(getTimeRemaining(unlockAt));

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(getTimeRemaining(unlockAt));
    }, 1000);

    return () => clearInterval(interval);
  }, [unlockAt]);

  if (time.total <= 0) {
    return <p className="text-green-600 font-semibold">Unlocked 🎉</p>;
  }

  return (
    <div className="text-lg font-medium text-purple-700">
      ⏳ {time.days}d {time.hours}h {time.minutes}m {time.seconds}s
    </div>
  );
};

export default CountdownTimer;