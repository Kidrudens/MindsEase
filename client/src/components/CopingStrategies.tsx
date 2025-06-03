import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Check, Clock, Award, Heart, Music, Coffee, Book, Bike, Users, MoveRight, Brain, RefreshCw } from "lucide-react";
import { CopingStrategy } from "@/lib/types";

interface CopingStrategiesProps {
  onSelect?: (strategyId: number) => void;
  onSave?: (strategyText: string) => void;
}

export function CopingStrategies({ onSelect, onSave }: CopingStrategiesProps) {
  const [selectedCategory, setSelectedCategory] = useState("physical");
  const [selectedStrategy, setSelectedStrategy] = useState<CopingStrategy | null>(null);
  const [notes, setNotes] = useState("");
  const [customStrategy, setCustomStrategy] = useState("");
  const [effectiveness, setEffectiveness] = useState<number | null>(null);
  const [usageDuration, setUsageDuration] = useState("");
  
  const categories = [
    { id: "physical", label: "Physical", icon: <Bike className="h-4 w-4" /> },
    { id: "mental", label: "Mental", icon: <Brain className="h-4 w-4" /> },
    { id: "social", label: "Social", icon: <Users className="h-4 w-4" /> },
    { id: "emotional", label: "Emotional", icon: <Heart className="h-4 w-4" /> },
    { id: "creative", label: "Creative", icon: <Music className="h-4 w-4" /> },
  ];
  
  const copingStrategies: Record<string, CopingStrategy[]> = {
    "physical": [
      { id: 1, title: "Deep Breathing", description: "Slow, deep breaths to activate the parasympathetic nervous system", category: "physical", icon: "lungs" },
      { id: 2, title: "Progressive Muscle Relaxation", description: "Tensing and relaxing different muscle groups", category: "physical", icon: "body" },
      { id: 3, title: "Walking or Light Exercise", description: "Physical activity to reduce anxiety and stress", category: "physical", icon: "walking" },
      { id: 4, title: "Stretching", description: "Gentle stretches to release physical tension", category: "physical", icon: "stretching" },
      { id: 5, title: "Cold Water Technique", description: "Splash cold water on face to activate diving reflex", category: "physical", icon: "water" },
    ],
    "mental": [
      { id: 6, title: "Meditation", description: "Focused attention to clear the mind", category: "mental", icon: "meditation" },
      { id: 7, title: "Grounding Techniques", description: "Using senses to reconnect with the present moment", category: "mental", icon: "anchor" },
      { id: 8, title: "Thought Challenging", description: "Questioning and reframing negative thoughts", category: "mental", icon: "brain" },
      { id: 9, title: "Visualization", description: "Using mental imagery to promote relaxation", category: "mental", icon: "eye" },
      { id: 10, title: "Mindfulness Practice", description: "Non-judgmental awareness of the present moment", category: "mental", icon: "awareness" },
    ],
    "social": [
      { id: 11, title: "Talk to a Friend", description: "Sharing feelings with someone you trust", category: "social", icon: "chat" },
      { id: 12, title: "Join a Support Group", description: "Connect with others experiencing similar challenges", category: "social", icon: "users" },
      { id: 13, title: "Ask for Help", description: "Reaching out when you need assistance", category: "social", icon: "help" },
      { id: 14, title: "Volunteer", description: "Helping others to shift focus from personal concerns", category: "social", icon: "heart" },
      { id: 15, title: "Spend Time with Pets", description: "Animal companionship to reduce stress", category: "social", icon: "paw" },
    ],
    "emotional": [
      { id: 16, title: "Journaling", description: "Writing down thoughts and feelings", category: "emotional", icon: "book" },
      { id: 17, title: "Self-Compassion", description: "Treating yourself with kindness and understanding", category: "emotional", icon: "heart" },
      { id: 18, title: "Emotional Release", description: "Safe expression of emotions like crying or laughing", category: "emotional", icon: "smile" },
      { id: 19, title: "Gratitude Practice", description: "Focusing on things you're thankful for", category: "emotional", icon: "star" },
      { id: 20, title: "Positive Affirmations", description: "Repeating encouraging statements to yourself", category: "emotional", icon: "check" },
    ],
    "creative": [
      { id: 21, title: "Art Therapy", description: "Drawing or painting to express emotions", category: "creative", icon: "palette" },
      { id: 22, title: "Music Therapy", description: "Listening to or creating music", category: "creative", icon: "music" },
      { id: 23, title: "Dance or Movement", description: "Expressing emotions through physical movement", category: "creative", icon: "activity" },
      { id: 24, title: "Creative Writing", description: "Writing stories or poetry to process feelings", category: "creative", icon: "pen" },
      { id: 25, title: "Crafting", description: "Engaging in hands-on creative activities", category: "creative", icon: "tool" },
    ]
  };
  
  const handleSelectStrategy = (strategy: CopingStrategy) => {
    setSelectedStrategy(strategy);
    if (onSelect) {
      onSelect(strategy.id);
    }
  };
  
  const handleSaveStrategy = () => {
    let strategyText = "";
    
    if (selectedStrategy) {
      strategyText = `Strategy: ${selectedStrategy.title}\n`;
      strategyText += `Category: ${selectedStrategy.category}\n`;
      
      if (effectiveness !== null) {
        strategyText += `Effectiveness: ${effectiveness}/5\n`;
      }
      
      if (usageDuration) {
        strategyText += `Duration used: ${usageDuration}\n`;
      }
      
      if (notes) {
        strategyText += `Notes: ${notes}\n`;
      }
    } else if (customStrategy) {
      strategyText = `Custom strategy: ${customStrategy}\n`;
      
      if (effectiveness !== null) {
        strategyText += `Effectiveness: ${effectiveness}/5\n`;
      }
      
      if (usageDuration) {
        strategyText += `Duration used: ${usageDuration}\n`;
      }
      
      if (notes) {
        strategyText += `Notes: ${notes}\n`;
      }
    }
    
    if (onSave && strategyText) {
      onSave(strategyText);
    }
  };
  
  const renderStrategyIcon = (iconName: string) => {
    switch (iconName) {
      case "lungs":
        return <RefreshCw className="h-4 w-4" />;
      case "body":
        return <Award className="h-4 w-4" />;
      case "walking":
        return <Bike className="h-4 w-4" />;
      case "stretching":
        return <RefreshCw className="h-4 w-4" />;
      case "water":
        return <Coffee className="h-4 w-4" />;
      case "meditation":
        return <Brain className="h-4 w-4" />;
      case "anchor":
        return <Award className="h-4 w-4" />;
      case "brain":
        return <Brain className="h-4 w-4" />;
      case "eye":
        return <Coffee className="h-4 w-4" />;
      case "awareness":
        return <Award className="h-4 w-4" />;
      case "chat":
        return <Users className="h-4 w-4" />;
      case "users":
        return <Users className="h-4 w-4" />;
      case "help":
        return <Users className="h-4 w-4" />;
      case "heart":
        return <Heart className="h-4 w-4" />;
      case "paw":
        return <Coffee className="h-4 w-4" />;
      case "book":
        return <Book className="h-4 w-4" />;
      case "smile":
        return <Heart className="h-4 w-4" />;
      case "star":
        return <Award className="h-4 w-4" />;
      case "check":
        return <Check className="h-4 w-4" />;
      case "palette":
        return <Coffee className="h-4 w-4" />;
      case "music":
        return <Music className="h-4 w-4" />;
      case "activity":
        return <Bike className="h-4 w-4" />;
      case "pen":
        return <Book className="h-4 w-4" />;
      case "tool":
        return <Coffee className="h-4 w-4" />;
      default:
        return <Award className="h-4 w-4" />;
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Coping Strategies</CardTitle>
        <CardDescription>
          Select strategies to manage stress and anxiety
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <div className="mb-4 flex border-b">
            {categories.map(category => (
              <button
                key={category.id}
                className={cn(
                  "flex items-center gap-1 px-4 py-2 text-sm font-medium border-b-2 transition-colors",
                  selectedCategory === category.id
                    ? "border-primary text-primary"
                    : "border-transparent text-neutral-500 hover:text-neutral-800"
                )}
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.icon}
                <span>{category.label}</span>
              </button>
            ))}
          </div>
          
          {Object.entries(copingStrategies).map(([category, strategies]) => (
            <div 
              key={category} 
              className={cn(
                "space-y-4",
                selectedCategory === category ? "block" : "hidden"
              )}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {strategies.map(strategy => (
                  <Card 
                    key={strategy.id} 
                    className={cn(
                      "strategy-card cursor-pointer transition-all border-2",
                      selectedStrategy?.id === strategy.id 
                        ? "border-primary" 
                        : "border-transparent hover:border-primary/30"
                    )}
                    onClick={() => handleSelectStrategy(strategy)}
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center gap-2">
                        {renderStrategyIcon(strategy.icon || "")}
                        {strategy.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-neutral-600">
                        {strategy.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Custom Strategy</h4>
                <div className="flex gap-2">
                  <Input 
                    placeholder="Enter your own coping strategy..." 
                    value={customStrategy}
                    onChange={(e) => {
                      setCustomStrategy(e.target.value);
                      setSelectedStrategy(null);
                    }}
                  />
                </div>
              </div>
              
              {(selectedStrategy || customStrategy) && (
                <div className="bg-neutral-50 p-4 rounded-lg mt-4 space-y-4">
                  <h3 className="font-medium">
                    {selectedStrategy ? selectedStrategy.title : customStrategy}
                  </h3>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Rate Effectiveness</h4>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map(rating => (
                        <Button
                          key={rating}
                          type="button"
                          variant={effectiveness === rating ? "default" : "outline"}
                          size="sm"
                          onClick={() => setEffectiveness(rating)}
                        >
                          {rating}
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">How Long Did You Use It?</h4>
                    <Input 
                      placeholder="e.g., 10 minutes, 1 hour, etc." 
                      value={usageDuration}
                      onChange={(e) => setUsageDuration(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Notes & Observations</h4>
                    <Textarea 
                      placeholder="How did it work for you? Any observations?" 
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={3}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="justify-between">
        <div className="text-sm text-neutral-500 flex items-center">
          <Clock className="h-4 w-4 mr-1" />
          <span>Past strategies help identify what works for you</span>
        </div>
        
        <Button 
          onClick={handleSaveStrategy}
          disabled={!selectedStrategy && !customStrategy}
          className="gap-2"
        >
          <Check className="h-4 w-4" />
          Save Strategy
        </Button>
      </CardFooter>
    </Card>
  );
}

export default CopingStrategies;