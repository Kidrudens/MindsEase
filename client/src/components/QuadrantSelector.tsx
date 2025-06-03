import { cn } from "@/lib/utils";
import { Zap, Heart, SmilePlus, Hand, Info, Brain, Activity, ArrowRight, PlusCircle } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { 
  mindItems, 
  bodyItems, 
  emotionItems, 
  behaviorItems 
} from "@/lib/utils";

interface QuadrantSelectorProps {
  mindSelected: string[];
  bodySelected: string[];
  emotionsSelected: string[];
  behaviorsSelected: string[];
  onMindChange: (values: string[]) => void;
  onBodyChange: (values: string[]) => void;
  onEmotionsChange: (values: string[]) => void;
  onBehaviorsChange: (values: string[]) => void;
}

export function QuadrantSelector({
  mindSelected,
  bodySelected,
  emotionsSelected,
  behaviorsSelected,
  onMindChange,
  onBodyChange,
  onEmotionsChange,
  onBehaviorsChange
}: QuadrantSelectorProps) {
  const [activeInfo, setActiveInfo] = useState<string | null>(null);
  
  const handleMindChange = (id: string, checked: boolean) => {
    if (checked) {
      onMindChange([...mindSelected, id]);
    } else {
      onMindChange(mindSelected.filter(item => item !== id));
    }
  };
  
  const handleBodyChange = (id: string, checked: boolean) => {
    if (checked) {
      onBodyChange([...bodySelected, id]);
    } else {
      onBodyChange(bodySelected.filter(item => item !== id));
    }
  };
  
  const handleEmotionsChange = (id: string, checked: boolean) => {
    if (checked) {
      onEmotionsChange([...emotionsSelected, id]);
    } else {
      onEmotionsChange(emotionsSelected.filter(item => item !== id));
    }
  };
  
  const handleBehaviorsChange = (id: string, checked: boolean) => {
    if (checked) {
      onBehaviorsChange([...behaviorsSelected, id]);
    } else {
      onBehaviorsChange(behaviorsSelected.filter(item => item !== id));
    }
  };

  const toggleInfo = (quadrant: string) => {
    if (activeInfo === quadrant) {
      setActiveInfo(null);
    } else {
      setActiveInfo(quadrant);
    }
  };

  const getQuadrantInfo = (quadrant: string) => {
    switch(quadrant) {
      case 'mind':
        return "Mind symptoms are the thoughts and cognitive experiences that occur during anxiety, such as racing thoughts or difficulty concentrating.";
      case 'body':
        return "Body symptoms are the physical sensations you experience during anxiety, such as rapid heartbeat or tension in muscles.";
      case 'emotions':
        return "Emotional symptoms are the feelings that accompany anxiety, beyond the primary emotion you selected earlier.";
      case 'behaviors':
        return "Behavioral symptoms are the actions or reactions you take when experiencing anxiety.";
      default:
        return "";
    }
  };

  // Helper function to get the count and color for each quadrant
  const getQuadrantBadge = (items: string[], color: string) => {
    return items.length > 0 ? (
      <Badge variant="outline" className={cn("ml-1 bg-white", `text-${color} border-${color}`)}>
        {items.length}
      </Badge>
    ) : null;
  };
  
  return (
    <div className="mb-6">
      <h3 className="gradient-text text-lg font-medium mb-3 inline-flex items-center gap-2">
        <Brain className="h-5 w-5" />
        Track how your anxiety affects you
      </h3>
      
      <div className="bg-white p-4 rounded-xl border border-neutral-100 mb-4">
        <div className="text-sm text-neutral-600 flex items-start gap-3">
          <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <p>
            Anxiety affects four different areas of your experience. Select the symptoms you're experiencing
            in each quadrant to get a better understanding of your anxiety patterns.
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Mind Quadrant */}
        <div className={cn(
          "quadrant-card bg-gradient-to-br rounded-xl overflow-hidden shadow-card transition-all duration-300",
          activeInfo === 'mind' ? "from-secondary/20 to-secondary/5" : "from-secondary/10 to-secondary/5"
        )}>
          <div className="p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-secondary/20 flex items-center justify-center">
                  <Zap className="h-5 w-5 text-secondary" />
                </div>
                <h4 className="text-md font-medium text-neutral-800">
                  Mind
                  {getQuadrantBadge(mindSelected, "secondary")}
                </h4>
              </div>
              <button 
                className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center transition-colors",
                  activeInfo === 'mind' ? "bg-secondary text-white" : "bg-neutral-100 text-neutral-400 hover:bg-secondary/20 hover:text-secondary"
                )}
                onClick={() => toggleInfo('mind')}
                aria-label="Information about the Mind quadrant"
              >
                <Info className="h-3 w-3" />
              </button>
            </div>
            
            {/* Info Panel */}
            {activeInfo === 'mind' && (
              <div className="bg-white/80 p-3 rounded-lg mb-3 text-xs text-neutral-600">
                {getQuadrantInfo('mind')}
              </div>
            )}
            
            {/* Checkboxes */}
            <div className="space-y-2 p-2">
              {mindItems.map((item) => (
                <div key={item.id} className={cn(
                  "flex items-center rounded-lg px-2 py-1.5 transition-colors",
                  mindSelected.includes(item.id) ? "bg-secondary/10" : "hover:bg-neutral-50"
                )}>
                  <Checkbox 
                    id={`mind-${item.id}`} 
                    checked={mindSelected.includes(item.id)}
                    onCheckedChange={(checked) => 
                      handleMindChange(item.id, checked as boolean)
                    }
                    className={cn(
                      "w-4 h-4 rounded text-secondary focus:ring-secondary",
                      mindSelected.includes(item.id) ? "border-secondary" : "border-neutral-300"
                    )}
                  />
                  <label 
                    htmlFor={`mind-${item.id}`} 
                    className={cn(
                      "ml-2 text-sm cursor-pointer flex-1",
                      mindSelected.includes(item.id) ? "text-secondary font-medium" : "text-neutral-700"
                    )}
                  >
                    {item.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Body Quadrant */}
        <div className={cn(
          "quadrant-card bg-gradient-to-br rounded-xl overflow-hidden shadow-card transition-all duration-300",
          activeInfo === 'body' ? "from-success/20 to-success/5" : "from-success/10 to-success/5"
        )}>
          <div className="p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-success/20 flex items-center justify-center">
                  <Activity className="h-5 w-5 text-success" />
                </div>
                <h4 className="text-md font-medium text-neutral-800">
                  Body
                  {getQuadrantBadge(bodySelected, "success")}
                </h4>
              </div>
              <button 
                className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center transition-colors",
                  activeInfo === 'body' ? "bg-success text-white" : "bg-neutral-100 text-neutral-400 hover:bg-success/20 hover:text-success"
                )}
                onClick={() => toggleInfo('body')}
                aria-label="Information about the Body quadrant"
              >
                <Info className="h-3 w-3" />
              </button>
            </div>
            
            {/* Info Panel */}
            {activeInfo === 'body' && (
              <div className="bg-white/80 p-3 rounded-lg mb-3 text-xs text-neutral-600">
                {getQuadrantInfo('body')}
              </div>
            )}
            
            {/* Checkboxes */}
            <div className="space-y-2 p-2">
              {bodyItems.map((item) => (
                <div key={item.id} className={cn(
                  "flex items-center rounded-lg px-2 py-1.5 transition-colors",
                  bodySelected.includes(item.id) ? "bg-success/10" : "hover:bg-neutral-50"
                )}>
                  <Checkbox 
                    id={`body-${item.id}`} 
                    checked={bodySelected.includes(item.id)}
                    onCheckedChange={(checked) => 
                      handleBodyChange(item.id, checked as boolean)
                    }
                    className={cn(
                      "w-4 h-4 rounded text-success focus:ring-success",
                      bodySelected.includes(item.id) ? "border-success" : "border-neutral-300"
                    )}
                  />
                  <label 
                    htmlFor={`body-${item.id}`} 
                    className={cn(
                      "ml-2 text-sm cursor-pointer flex-1",
                      bodySelected.includes(item.id) ? "text-success font-medium" : "text-neutral-700"
                    )}
                  >
                    {item.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Emotions Quadrant */}
        <div className={cn(
          "quadrant-card bg-gradient-to-br rounded-xl overflow-hidden shadow-card transition-all duration-300",
          activeInfo === 'emotions' ? "from-primary/20 to-primary/5" : "from-primary/10 to-primary/5"
        )}>
          <div className="p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <Heart className="h-5 w-5 text-primary" />
                </div>
                <h4 className="text-md font-medium text-neutral-800">
                  Emotions
                  {getQuadrantBadge(emotionsSelected, "primary")}
                </h4>
              </div>
              <button 
                className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center transition-colors",
                  activeInfo === 'emotions' ? "bg-primary text-white" : "bg-neutral-100 text-neutral-400 hover:bg-primary/20 hover:text-primary"
                )}
                onClick={() => toggleInfo('emotions')}
                aria-label="Information about the Emotions quadrant"
              >
                <Info className="h-3 w-3" />
              </button>
            </div>
            
            {/* Info Panel */}
            {activeInfo === 'emotions' && (
              <div className="bg-white/80 p-3 rounded-lg mb-3 text-xs text-neutral-600">
                {getQuadrantInfo('emotions')}
              </div>
            )}
            
            {/* Checkboxes */}
            <div className="space-y-2 p-2">
              {emotionItems.map((item) => (
                <div key={item.id} className={cn(
                  "flex items-center rounded-lg px-2 py-1.5 transition-colors",
                  emotionsSelected.includes(item.id) ? "bg-primary/10" : "hover:bg-neutral-50"
                )}>
                  <Checkbox 
                    id={`emotion-${item.id}`} 
                    checked={emotionsSelected.includes(item.id)}
                    onCheckedChange={(checked) => 
                      handleEmotionsChange(item.id, checked as boolean)
                    }
                    className={cn(
                      "w-4 h-4 rounded text-primary focus:ring-primary",
                      emotionsSelected.includes(item.id) ? "border-primary" : "border-neutral-300"
                    )}
                  />
                  <label 
                    htmlFor={`emotion-${item.id}`} 
                    className={cn(
                      "ml-2 text-sm cursor-pointer flex-1",
                      emotionsSelected.includes(item.id) ? "text-primary font-medium" : "text-neutral-700"
                    )}
                  >
                    {item.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Behavior Quadrant */}
        <div className={cn(
          "quadrant-card bg-gradient-to-br rounded-xl overflow-hidden shadow-card transition-all duration-300",
          activeInfo === 'behaviors' ? "from-accent/20 to-accent/5" : "from-accent/10 to-accent/5"
        )}>
          <div className="p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-accent/20 flex items-center justify-center">
                  <Hand className="h-5 w-5 text-accent" />
                </div>
                <h4 className="text-md font-medium text-neutral-800">
                  Behavior
                  {getQuadrantBadge(behaviorsSelected, "accent")}
                </h4>
              </div>
              <button 
                className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center transition-colors",
                  activeInfo === 'behaviors' ? "bg-accent text-white" : "bg-neutral-100 text-neutral-400 hover:bg-accent/20 hover:text-accent"
                )}
                onClick={() => toggleInfo('behaviors')}
                aria-label="Information about the Behavior quadrant"
              >
                <Info className="h-3 w-3" />
              </button>
            </div>
            
            {/* Info Panel */}
            {activeInfo === 'behaviors' && (
              <div className="bg-white/80 p-3 rounded-lg mb-3 text-xs text-neutral-600">
                {getQuadrantInfo('behaviors')}
              </div>
            )}
            
            {/* Checkboxes */}
            <div className="space-y-2 p-2">
              {behaviorItems.map((item) => (
                <div key={item.id} className={cn(
                  "flex items-center rounded-lg px-2 py-1.5 transition-colors",
                  behaviorsSelected.includes(item.id) ? "bg-accent/10" : "hover:bg-neutral-50"
                )}>
                  <Checkbox 
                    id={`behavior-${item.id}`} 
                    checked={behaviorsSelected.includes(item.id)}
                    onCheckedChange={(checked) => 
                      handleBehaviorsChange(item.id, checked as boolean)
                    }
                    className={cn(
                      "w-4 h-4 rounded text-accent focus:ring-accent",
                      behaviorsSelected.includes(item.id) ? "border-accent" : "border-neutral-300"
                    )}
                  />
                  <label 
                    htmlFor={`behavior-${item.id}`} 
                    className={cn(
                      "ml-2 text-sm cursor-pointer flex-1",
                      behaviorsSelected.includes(item.id) ? "text-accent font-medium" : "text-neutral-700"
                    )}
                  >
                    {item.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Summary Section */}
      {(mindSelected.length > 0 || bodySelected.length > 0 || emotionsSelected.length > 0 || behaviorsSelected.length > 0) && (
        <div className="bg-white p-4 rounded-xl border border-neutral-100 shadow-sm">
          <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
            <PlusCircle className="h-4 w-4 text-primary" />
            <span>Selected Symptoms ({mindSelected.length + bodySelected.length + emotionsSelected.length + behaviorsSelected.length})</span>
          </h4>
          
          <div className="space-y-2 text-sm">
            {mindSelected.length > 0 && (
              <div className="flex items-start gap-2">
                <div className="h-5 w-5 rounded-full bg-secondary/20 flex-shrink-0 flex items-center justify-center mt-0.5">
                  <Zap className="h-3 w-3 text-secondary" />
                </div>
                <div>
                  <span className="font-medium text-secondary">Mind:</span> 
                  <span className="text-neutral-600 ml-1">
                    {mindSelected.map(id => mindItems.find(item => item.id === id)?.label).join(', ')}
                  </span>
                </div>
              </div>
            )}
            
            {bodySelected.length > 0 && (
              <div className="flex items-start gap-2">
                <div className="h-5 w-5 rounded-full bg-success/20 flex-shrink-0 flex items-center justify-center mt-0.5">
                  <Activity className="h-3 w-3 text-success" />
                </div>
                <div>
                  <span className="font-medium text-success">Body:</span> 
                  <span className="text-neutral-600 ml-1">
                    {bodySelected.map(id => bodyItems.find(item => item.id === id)?.label).join(', ')}
                  </span>
                </div>
              </div>
            )}
            
            {emotionsSelected.length > 0 && (
              <div className="flex items-start gap-2">
                <div className="h-5 w-5 rounded-full bg-primary/20 flex-shrink-0 flex items-center justify-center mt-0.5">
                  <Heart className="h-3 w-3 text-primary" />
                </div>
                <div>
                  <span className="font-medium text-primary">Emotions:</span> 
                  <span className="text-neutral-600 ml-1">
                    {emotionsSelected.map(id => emotionItems.find(item => item.id === id)?.label).join(', ')}
                  </span>
                </div>
              </div>
            )}
            
            {behaviorsSelected.length > 0 && (
              <div className="flex items-start gap-2">
                <div className="h-5 w-5 rounded-full bg-accent/20 flex-shrink-0 flex items-center justify-center mt-0.5">
                  <Hand className="h-3 w-3 text-accent" />
                </div>
                <div>
                  <span className="font-medium text-accent">Behaviors:</span> 
                  <span className="text-neutral-600 ml-1">
                    {behaviorsSelected.map(id => behaviorItems.find(item => item.id === id)?.label).join(', ')}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default QuadrantSelector;
