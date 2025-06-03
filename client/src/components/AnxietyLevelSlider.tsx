import { useState, useRef, useEffect } from "react";
import { getAnxietyLevelWidth } from "@/lib/utils";

interface AnxietyLevelSliderProps {
  level: number;
  onChange: (level: number) => void;
}

export function AnxietyLevelSlider({ level, onChange }: AnxietyLevelSliderProps) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const updateSliderValue = (e: MouseEvent | React.MouseEvent) => {
    if (!sliderRef.current) return;
    
    const rect = sliderRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.min(Math.max(x / rect.width, 0), 1);
    const newLevel = Math.round(percentage * 10);
    onChange(newLevel === 0 ? 1 : newLevel); // Ensure minimum value is 1
  };
  
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    updateSliderValue(e);
  };
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        updateSliderValue(e);
      }
    };
    
    const handleMouseUp = () => {
      setIsDragging(false);
    };
    
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);
  
  return (
    <div className="mb-6">
      <h3 className="text-md font-medium text-neutral-800 mb-3">Anxiety/Stress Level</h3>
      <div 
        ref={sliderRef}
        className="w-full bg-neutral-100 rounded-full h-4 mb-2 cursor-pointer"
        onMouseDown={handleMouseDown}
      >
        <div 
          className="bg-primary h-4 rounded-full" 
          style={{ width: getAnxietyLevelWidth(level) }}
        ></div>
      </div>
      <div className="flex justify-between text-xs text-neutral-500">
        <span>Low</span>
        <span>Moderate</span>
        <span>High</span>
      </div>
    </div>
  );
}

export default AnxietyLevelSlider;
