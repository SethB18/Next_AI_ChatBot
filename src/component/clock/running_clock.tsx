import React,{useState,  useEffect} from "react";
import { Clock } from "lucide-react";
const RunningClock: React.FC = () => {
  const [time, setTime] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex justify-start text-sm font-bold">
        <Clock className="w-5 h-5 text-white mr-1" />
        <p>{time.toLocaleTimeString()}</p>
    </div>
  );
}
export default RunningClock;