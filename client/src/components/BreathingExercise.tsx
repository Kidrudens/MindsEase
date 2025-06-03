 import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Pause, Play, RefreshCw, Wind, Clock, Award, Heart } from "lucide-react";

type BreathState = "inhale" | "hold" | "exhale" | "rest" | "idle";

interface BreathingExerciseProps {
  onComplete?: () => void;
}

export function BreathingExercise({ onComplete }: BreathingExerciseProps) {
  const [isActive, setIsActive] = useState(false);
  const [breathState, setBreathState] = useState<BreathState>("idle");
  const [progress, setProgress] = useState(0);
  const [counter, setCounter] = useState(0);
  const [cycleCount, setCycleCount] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
 
 
 
 
 
 // Breathing pattern settings (in seconds)
  const inhaleDuration = 4;
  const holdDuration = 7;
  const exhaleDuration = 8;
  const restDuration = 2;
  const totalCycles = 3;
  
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isActive) {
      timer = setInterval(() => {
        setTotalDuration(prev => prev + 0.1);
        
        if (breathState === "inhale") {
          const newProgress = (counter / inhaleDuration) * 100;
          setProgress(newProgress);
          setCounter(prev => {
            const newCount = prev + 0.1;
            if (newCount >= inhaleDuration) {
              setBreathState("hold");
              return 0;
            }
            return newCount;
          });
        } 
        else if (breathState === "hold") {
          const newProgress = (counter / holdDuration) * 100;
          setProgress(newProgress);
          setCounter(prev => {
            const newCount = prev + 0.1;
            if (newCount >= holdDuration) {
              setBreathState("exhale");
              return 0;
            }
            return newCount;
          });
        } 
        else if (breathState === "exhale") {
          const newProgress = (counter / exhaleDuration) * 100;
          setProgress(newProgress);
          setCounter(prev => {
            const newCount = prev + 0.1;
            if (newCount >= exhaleDuration) {
              if (cycleCount + 1 >= totalCycles) {
                setIsActive(false);
                setBreathState("idle");
                setCycleCount(0);
                if (onComplete) onComplete();
                return 0;
              }
              setBreathState("rest");
              return 0;
            }
            return newCount;
          });
        }
        else if (breathState === "rest") {
          const newProgress = (counter / restDuration) * 100;
          setProgress(newProgress);
          setCounter(prev => {
            const newCount = prev + 0.1;
            if (newCount >= restDuration) {
              setBreathState("inhale");
              setCycleCount(prev => prev + 1);
              return 0;
            }
            return newCount;
          });
        }
      }, 100);
    }
    
    return () => {
      clearInterval(timer);
    };
  }, [isActive, breathState, counter, cycleCount, onComplete]);
  
  const handleStart = () => {
    setIsActive(true);
    setBreathState("inhale");
    setCounter(0);
    setProgress(0);
    setCycleCount(0);
    setTotalDuration(0);
  };
  
  const handleToggle = () => {
    setIsActive(!isActive);
  };
  
  const handleReset = () => {
    setIsActive(false);
    setBreathState("idle");
    setCounter(0);
    setProgress(0);
    setCycleCount(0);
    setTotalDuration(0);
  };

  const getCurrentInstruction = () => {
    switch (breathState) {
      case "inhale":
        return "Breathe in slowly...";
      case "hold":
        return "Hold your breath...";
      case "exhale":
        return "Breathe out slowly...";
      case "rest":
        return "Pause...";
      case "idle":
      default:
        return "Click Start to begin";
    }
  };
  
  const getCircleAnimation = () => {
    switch (breathState) {
      case "inhale":
        return "animate-expand";
      case "hold":
        return "animate-pulse-slow";
      case "exhale":
        return "animate-contract";
      case "rest":
        return "";
      case "idle":
      default:
        return "";
    }
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' + secs : secs}`;
  };

  const getBenefits = () => {
    return [
      { icon: <Heart className="h-5 w-5 text-primary" />, text: "Reduces anxiety" },
      { icon: <Wind className="h-5 w-5 text-primary" />, text: "Calms the nervous system" },
      { icon: <Clock className="h-5 w-5 text-primary" />, text: "Works in just 2 minutes" },
    ];
  };
  
  return (
    <Card className="w-full shadow-card overflow-hidden">
      <CardHeader className="pb-2 gradient-bg">
        <CardTitle className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Wind className="h-5 w-5 text-primary" />
            <span className="gradient-text">4-7-8 Breathing Exercise</span>
          </div>
          <span className="text-sm bg-white/90 text-primary font-medium px-2 py-1 rounded-full">
            {isActive && `Cycle ${cycleCount + 1}/${totalCycles}`}
          </span>
        </CardTitle>
        <CardDescription>
          A simple technique to reduce anxiety and help you relax
        </CardDescription>
      </CardHeader>

      <CardContent className="grid place-items-center py-8 relative">
        {/* Decorative elements */}
        <div className="absolute inset-0 dot-pattern opacity-10"></div>
        
        {breathState === "idle" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 w-full max-w-lg">
            {getBenefits().map((benefit, i) => (
              <div key={i} className="flex flex-col items-center p-3 bg-primary/5 rounded-lg">
                <div className="mb-2">{benefit.icon}</div>
                <div className="text-xs text-center font-medium">{benefit.text}</div>
              </div>
            ))}
          </div>
        )}
        
        <div className="mb-4 text-lg font-medium text-primary bg-white/80 px-4 py-1 rounded-full shadow-sm">
          {getCurrentInstruction()}
        </div>
        
        {/* SVG Breathing Circle */}
        <div className="relative mb-6">
          <div className={cn(
            "relative flex items-center justify-center w-48 h-48 mb-4 transition-all duration-500",
            getCircleAnimation()
          )}>
            {/* SVG Circle Animation */}
            <svg width="192" height="192" viewBox="0 0 192 192" className="absolute inset-0">
              <defs>
                <linearGradient id="breathGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="hsl(var(--primary))" />
                  <stop offset="100%" stopColor="hsl(var(--secondary))" />
                </linearGradient>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="8" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>
              
              {/* Pulsing Background Circle */}
              <circle 
                cx="96" 
                cy="96" 
                r={breathState === "inhale" ? "80" : breathState === "hold" ? "88" : breathState === "exhale" ? "75" : "70"} 
                fill="none" 
                strokeWidth="2"
                stroke="url(#breathGradient)"
                strokeOpacity="0.3"
                filter="url(#glow)"
                className="transition-all duration-500"
              />
              
              {/* Main Circle */}
              <circle 
                cx="96" 
                cy="96" 
                r={breathState === "inhale" ? "70" : breathState === "hold" ? "78" : breathState === "exhale" ? "65" : "60"} 
                fill={breathState === "idle" ? "hsl(var(--muted))" : "hsl(var(--primary-light)/0.2)"}
                stroke="url(#breathGradient)"
                strokeWidth="2"
                className="transition-all duration-500"
              />
            </svg>
            
            {/* Counter Display */}
            <div className="relative z-10 flex items-center justify-center rounded-full bg-white h-32 w-32 shadow-lg">
              <div className="text-5xl font-thin text-primary">
                {breathState !== "idle" ? Math.ceil(
                  breathState === "inhale" ? inhaleDuration - counter : 
                  breathState === "hold" ? holdDuration - counter : 
                  breathState === "exhale" ? exhaleDuration - counter :
                  restDuration - counter
                ) : (
                  <Play className="h-10 w-10 text-primary/50" />
                )}
              </div>
            </div>
          </div>
        </div>
        
        {breathState !== "idle" && (
          <div className="w-full max-w-xs mb-4">
            <div className="mb-1 flex justify-between text-xs text-neutral-500">
              <span>{getCurrentInstruction()}</span>
              <span>
                {breathState === "inhale" ? `${Math.ceil(inhaleDuration - counter)}s` : 
                 breathState === "hold" ? `${Math.ceil(holdDuration - counter)}s` : 
                 breathState === "exhale" ? `${Math.ceil(exhaleDuration - counter)}s` :
                 `${Math.ceil(restDuration - counter)}s`}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}
        
        {isActive && (
          <div className="flex items-center gap-2 text-sm text-neutral-500 mt-2">
            <Clock className="h-4 w-4" />
            <span>Total time: {formatTime(totalDuration)}</span>
          </div>
        )}
        
        {breathState === "idle" && !isActive && (
          <div className="mt-4 bg-white/80 p-4 rounded-lg max-w-lg text-sm text-neutral-600 shadow-sm">
            <p className="mb-2 font-medium">How to practice the 4-7-8 breathing technique:</p>
            <ol className="space-y-2 pl-5 list-decimal">
              <li>Exhale completely through your mouth</li>
              <li>Inhale quietly through your nose for 4 seconds</li>
              <li>Hold your breath for 7 seconds</li>
              <li>Exhale completely through your mouth for 8 seconds</li>
              <li>Repeat the cycle 3 times</li>
            </ol>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-center gap-4 pt-0 pb-6">
        {breathState === "idle" ? (
          <Button onClick={handleStart} className="gap-2 bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90 hover:from-primary hover:to-secondary" size="lg">
            <Play className="h-5 w-5" />
            Start Breathing Exercise
          </Button>
        ) : (
          <>
            <Button variant="outline" onClick={handleToggle} className="gap-2">
              {isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {isActive ? "Pause" : "Resume"}
            </Button>
            <Button variant="secondary" onClick={handleReset} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Reset
            </Button>
          </>
        )}
      </CardFooter>

      {/* Completion message */}
      {!isActive && cycleCount === totalCycles && (
        <div className="bg-success/10 p-4 mx-6 mb-6 rounded-lg border border-success/20 flex items-center gap-3">
          <Award className="h-5 w-5 text-success" />
          <div>
            <div className="font-medium text-success">Exercise Complete!</div>
            <div className="text-xs text-neutral-600">Great job! You should feel more relaxed now.</div>
          </div>
        </div>
      )}
    </Card>
  );
}

export default BreathingExercise;