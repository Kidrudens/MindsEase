import { useState, useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { format, parse } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import Calendar from "@/components/Calendar";
import RecentEntries from "@/components/RecentEntries";
import EmotionSelector from "@/components/EmotionSelector";
import AnxietyLevelSlider from "@/components/AnxietyLevelSlider";
import QuadrantSelector from "@/components/QuadrantSelector";
import CopingStrategies from "@/components/CopingStrategies";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn, triggers, formatDate } from "@/lib/utils";
import { Entry, InsertEntry } from "@shared/schema";
import { EntryFormData } from "@/lib/types";

export default function DailyLog() {
  const [, navigate] = useLocation();
  const [, params] = useRoute("/daily-log/:date");
  const { toast } = useToast();
  
  // Extract date from URL or use today's date
  const defaultDate = params?.date 
    ? parse(params.date, "yyyy-MM-dd", new Date()) 
    : new Date();
    
  const [selectedDate, setSelectedDate] = useState<Date>(defaultDate);
  const [emotion, setEmotion] = useState<string>("anxious");
  const [anxietyLevel, setAnxietyLevel] = useState<number>(5);
  const [trigger, setTrigger] = useState<string>("home");
  const [description, setDescription] = useState<string>("");
  const [mindSelected, setMindSelected] = useState<string[]>([]);
  const [bodySelected, setBodySelected] = useState<string[]>([]);
  const [emotionsSelected, setEmotionsSelected] = useState<string[]>([]);
  const [behaviorsSelected, setBehaviorsSelected] = useState<string[]>([]);
  const [strategiesUsed, setStrategiesUsed] = useState<string>("");
  const [existingEntryId, setExistingEntryId] = useState<number | null>(null);
  
  // Fetch current user
  const { data: userData } = useQuery({
    queryKey: ["/api/user"],
  });
  
  // Fetch all entries
  const { data: entries = [] } = useQuery({
    queryKey: ["/api/entries", userData?.id],
    queryFn: () => 
      fetch(`/api/entries?userId=${userData?.id}`).then(res => res.json()),
    enabled: !!userData,
  });
  
  // Fetch entries for the selected date
  const { data: dateEntries = [] } = useQuery({
    queryKey: ["/api/entries/date", userData?.id, formatDate(selectedDate, "yyyy-MM-dd")],
    queryFn: () => 
      fetch(`/api/entries/date/${formatDate(selectedDate, "yyyy-MM-dd")}?userId=${userData?.id}`)
        .then(res => res.json()),
    enabled: !!userData,
  });
  
  // Pre-populate form if we have an entry for the selected date
  useEffect(() => {
    if (dateEntries && dateEntries.length > 0) {
      const entry = dateEntries[0]; // Use the first entry for this date
      setExistingEntryId(entry.id);
      setEmotion(entry.emotion);
      setAnxietyLevel(entry.anxietyLevel);
      setTrigger(entry.trigger);
      setDescription(entry.description);
      setMindSelected(entry.mind);
      setBodySelected(entry.body);
      setEmotionsSelected(entry.emotions);
      setBehaviorsSelected(entry.behaviors);
      setStrategiesUsed(entry.strategiesUsed || "");
    } else {
      // Reset form for a new entry
      setExistingEntryId(null);
      setEmotion("anxious");
      setAnxietyLevel(5);
      setTrigger("home");
      setDescription("");
      setMindSelected([]);
      setBodySelected([]);
      setEmotionsSelected([]);
      setBehaviorsSelected([]);
      setStrategiesUsed("");
    }
  }, [dateEntries, selectedDate]);
  
  // Create new entry
  const createMutation = useMutation({
    mutationFn: async (data: InsertEntry) => {
      const res = await apiRequest("POST", "/api/entries", data);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Your entry has been saved.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/entries"] });
      queryClient.invalidateQueries({ 
        queryKey: ["/api/entries/date", userData?.id, formatDate(selectedDate, "yyyy-MM-dd")] 
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to save entry: ${error.message}`,
        variant: "destructive",
      });
    },
  });
  
  // Update existing entry
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertEntry> }) => {
      const res = await apiRequest("PUT", `/api/entries/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Your entry has been updated.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/entries"] });
      queryClient.invalidateQueries({ 
        queryKey: ["/api/entries/date", userData?.id, formatDate(selectedDate, "yyyy-MM-dd")] 
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update entry: ${error.message}`,
        variant: "destructive",
      });
    },
  });
  
  const isPending = createMutation.isPending || updateMutation.isPending;
  
  const handleSelectDate = (date: Date) => {
    setSelectedDate(date);
    navigate(`/daily-log/${format(date, "yyyy-MM-dd")}`);
  };
  
  const handleTriggerSelect = (selected: string) => {
    setTrigger(selected);
  };
  
  const handleSaveEntry = async () => {
    if (!userData) {
      toast({
        title: "Error",
        description: "You need to be logged in to save entries.",
        variant: "destructive",
      });
      return;
    }
    
    const entryData: InsertEntry = {
      userId: userData.id,
      date: selectedDate,
      emotion,
      anxietyLevel,
      trigger,
      description,
      mind: mindSelected,
      body: bodySelected,
      emotions: emotionsSelected,
      behaviors: behaviorsSelected,
      strategiesUsed,
    };
    
    if (existingEntryId) {
      updateMutation.mutate({ id: existingEntryId, data: entryData });
    } else {
      createMutation.mutate(entryData);
    }
  };
  
  const handleSaveDraft = () => {
    // Save to local storage
    const draft: EntryFormData = {
      userId: userData?.id || 0,
      date: selectedDate,
      emotion,
      anxietyLevel,
      trigger,
      description,
      mind: mindSelected,
      body: bodySelected,
      emotions: emotionsSelected,
      behaviors: behaviorsSelected,
      strategiesUsed,
    };
    
    localStorage.setItem("mindease-draft", JSON.stringify(draft));
    
    toast({
      title: "Draft Saved",
      description: "Your entry has been saved as a draft.",
    });
  };
  
  return (
    <div className="lg:grid lg:grid-cols-3 lg:gap-8">
      {/* Left Column */}
      <div className="col-span-1">
        <Calendar 
          currentDate={selectedDate}
          entries={entries}
          onSelectDate={handleSelectDate}
        />
        
        <RecentEntries 
          entries={entries} 
          onSelectEntry={(entry: Entry) => {
            handleSelectDate(new Date(entry.date));
          }}
        />
      </div>
      
      {/* Form Column */}
      <div className="col-span-2 mt-8 lg:mt-0">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-neutral-800">
              Daily Log: {formatDate(selectedDate)}
            </h2>
            <button 
              className="text-sm font-medium text-neutral-600 flex items-center hover:text-primary transition-colors"
              onClick={() => {
                const today = new Date();
                handleSelectDate(today);
              }}
            >
              <CalendarIcon className="h-4 w-4 mr-1" />
              Change Date
            </button>
          </div>
          
          {/* Emotion Selector */}
          <EmotionSelector 
            selectedEmotion={emotion} 
            onChange={setEmotion} 
          />
          
          {/* Anxiety Level Slider */}
          <AnxietyLevelSlider 
            level={anxietyLevel} 
            onChange={setAnxietyLevel} 
          />
          
          {/* Trigger Selection */}
          <div className="mb-6">
            <h3 className="text-md font-medium text-neutral-800 mb-3">What triggered your feelings?</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {triggers.map((t) => (
                <button
                  key={t.id}
                  className={cn(
                    "py-2 px-3 border rounded-lg font-medium text-sm transition-colors",
                    trigger === t.id
                      ? "border-primary bg-primary-light/10 text-primary"
                      : "border-neutral-300 text-neutral-700 hover:border-primary hover:text-primary"
                  )}
                  onClick={() => handleTriggerSelect(t.id)}
                >
                  {t.icon} {t.label}
                </button>
              ))}
            </div>
          </div>
          
          {/* Description */}
          <div className="mb-6">
            <h3 className="text-md font-medium text-neutral-800 mb-3">Describe what happened</h3>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-neutral-300 rounded-lg p-3 h-24 focus:ring-2 focus:ring-primary-light focus:border-primary outline-none transition-all"
              placeholder="Write about what happened and how it made you feel..."
            />
          </div>
          
          {/* Four Quadrants */}
          <QuadrantSelector
            mindSelected={mindSelected}
            bodySelected={bodySelected}
            emotionsSelected={emotionsSelected}
            behaviorsSelected={behaviorsSelected}
            onMindChange={setMindSelected}
            onBodyChange={setBodySelected}
            onEmotionsChange={setEmotionsSelected}
            onBehaviorsChange={setBehaviorsSelected}
          />
          
          {/* Coping Strategies */}
          <div className="mb-6">
            <h3 className="text-md font-medium text-neutral-800 mb-3">Coping Strategies</h3>
            <CopingStrategies onSave={(text) => setStrategiesUsed(text)} />
          </div>
          
          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-end">
            <Button
              variant="outline"
              onClick={handleSaveDraft}
              disabled={isPending}
            >
              Save as Draft
            </Button>
            <Button
              onClick={handleSaveEntry}
              disabled={isPending}
            >
              {existingEntryId ? "Update Entry" : "Save Entry"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
