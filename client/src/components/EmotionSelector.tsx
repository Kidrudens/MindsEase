import { useState } from "react";
import { cn } from "@/lib/utils";
import { emotions } from "@/lib/utils";

interface EmotionSelectorProps {
  selectedEmotion: string;
  onChange: (emotion: string) => void;
}

export function EmotionSelector({ selectedEmotion, onChange }: EmotionSelectorProps) {
  // Helper function to get emotion description
  const getEmotionDescription = (id: string) => {
    switch(id) {
      case "calm":
        return "You feel peaceful and at ease";
      case "happy":
        return "You feel joyful and positive";
      case "anxious":
        return "You feel worried or nervous";
      case "sad":
        return "You feel down or unhappy";
      case "angry":
        return "You feel irritated or frustrated";
      default:
        return "Select an emotion that matches how you feel";
    }
  };

  return (
    <div className="mb-6 bg-gradient-to-r from-primary/5 to-secondary/5 p-4 rounded-xl">
      <h3 className="text-md font-medium gradient-text mb-3 inline-block">How are you feeling today?</h3>
      
      {selectedEmotion && (
        <p className="text-sm text-neutral-600 mb-4">
          {getEmotionDescription(selectedEmotion)}
        </p>
      )}
      
      <div className="grid grid-cols-5 gap-2 md:gap-4">
        {emotions.map((emotion) => (
          <div key={emotion.id} className="emotion-icon flex flex-col items-center">
            <button 
              className={cn(
                "w-16 h-16 rounded-full flex items-center justify-center mb-2 transition-all duration-300",
                "shadow-sm hover:shadow-md transform hover:-translate-y-1",
                emotion.color,
                selectedEmotion === emotion.id 
                  ? "border-2 border-primary scale-110 shadow-md" 
                  : "border border-neutral-200"
              )}
              onClick={() => onChange(emotion.id)}
              aria-label={`Select ${emotion.label} emotion`}
            >
              {/* SVG Emotion Face */}
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className={cn(
                  "h-8 w-8 transition-all",
                  selectedEmotion === emotion.id ? "text-white" : "text-current"
                )}
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
                strokeWidth={selectedEmotion === emotion.id ? 2.5 : 2}
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  d={emotion.icon} 
                />
              </svg>
            </button>
            
            <div className="text-center">
              <span className={cn(
                "text-sm transition-all duration-300",
                selectedEmotion === emotion.id 
                  ? "font-semibold text-primary" 
                  : "text-neutral-600"
              )}>
                {emotion.label}
              </span>
            </div>
          </div>
        ))}
      </div>
      
      {/* Visual representation */}
      {selectedEmotion && (
        <div className="mt-6 bg-white p-3 rounded-lg shadow-sm border border-neutral-100">
          <div className="flex items-center">
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center mr-3",
              emotions.find(e => e.id === selectedEmotion)?.color
            )}>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-6 w-6 text-white" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d={emotions.find(e => e.id === selectedEmotion)?.icon || ""} 
                />
              </svg>
            </div>
            <div>
              <div className="text-sm font-medium">
                You selected: <span className="text-primary">{emotions.find(e => e.id === selectedEmotion)?.label}</span>
              </div>
              <div className="text-xs text-neutral-500">
                {getEmotionDescription(selectedEmotion)}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EmotionSelector;
