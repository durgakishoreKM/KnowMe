import { useEffect, useState } from "react";

function Countdown({ unlockAt }) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const target = new Date(unlockAt);
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft("Unlocked!");
        clearInterval(interval);
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
    }, 1000);

    return () => clearInterval(interval);
  }, [unlockAt]);

  return (
    <div className="text-center mt-6">
      <p className="text-gray-500">Unlocks in</p>
      <h2 className="text-2xl font-bold">{timeLeft}</h2>
    </div>
  );
}

export default Countdown;