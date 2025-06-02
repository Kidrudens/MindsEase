import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { format, subDays } from "date-fns";
import { Calendar as CalendarIcon, PieChart, LineChart, ChevronRight, Activity, Database } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Calendar from "@/components/Calendar";
import RecentEntries from "@/components/RecentEntries";
import BreathingExercise from "@/components/BreathingExercise";
import DatabaseVisualization from "@/components/DatabaseVisualization";
import { Entry } from "@shared/schema";
import { getAnxietyLevelText, getAnxietyLevelColor } from "@/lib/utils";

export default function Home() {
  const [, navigate] = useLocation();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentUser, setCurrentUser] = useState<{ id: number } | null>(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  
  // Fetch current user
  const { data: userData, isLoading: isLoadingUser } = useQuery({
    queryKey: ["/api/user"],
  });
  
  // Set current user when data is loaded
  useEffect(() => {
    if (userData) {
      setCurrentUser(userData);
    }
  }, [userData]);
  
  // Fetch entries if we have a user
  const { data: entries = [], isLoading: isLoadingEntries } = useQuery({
    queryKey: ["/api/entries", currentUser?.id],
    queryFn: () => 
      fetch(`/api/entries?userId=${currentUser?.id}`).then(res => res.json()),
    enabled: !!currentUser,
  });
  
  const handleSelectDate = (date: Date) => {
    setSelectedDate(date);
    navigate(`/daily-log/${format(date, "yyyy-MM-dd")}`);
  };
  
  const handleSelectEntry = (entry: Entry) => {
    navigate(`/daily-log/${format(new Date(entry.date), "yyyy-MM-dd")}`);
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
          onSelectEntry={handleSelectEntry}
        />
      </div>
      
      {/* Right Columns */}
      <div className="col-span-2 mt-8 lg:mt-0">
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-neutral-800">MindEase Dashboard</h2>
            <Link to="/daily-log">
              <Button variant="outline" className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                <span>New Entry</span>
              </Button>
            </Link>
          </div>
          
          {entries.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-neutral-700 mb-3">Welcome to MindEase</h3>
              <p className="text-neutral-600 mb-6 max-w-md mx-auto">
                Track your daily stress and anxiety levels to identify patterns and learn effective coping strategies.
              </p>
              <Link to="/daily-log">
                <Button>Create Your First Entry</Button>
              </Link>
            </div>
          ) : (
            <>
              <Tabs defaultValue="dashboard" value={activeTab} onValueChange={setActiveTab} className="mb-6">
                <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto">
                  <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                  <TabsTrigger value="breathing">Breathing</TabsTrigger>
                  <TabsTrigger value="database">Database</TabsTrigger>
                </TabsList>
                
                <TabsContent value="dashboard" className="space-y-6">
                  {/* Stats Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-neutral-500">
                          Entries This Week
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {entries.filter(e => 
                            new Date(e.date) >= subDays(new Date(), 7)
                          ).length}
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-neutral-500">
                          Average Anxiety Level
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {entries.length > 0 
                            ? Math.round(entries.reduce((sum, entry) => sum + entry.anxietyLevel, 0) / entries.length)
                            : 0
                          }
                          <span className="text-sm font-normal text-neutral-500 ml-1">
                            / 10
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-neutral-500">
                          Main Trigger
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold capitalize">
                          {entries.length > 0
                            ? Object.entries(
                                entries.reduce<Record<string, number>>((counts, entry) => {
                                  counts[entry.trigger] = (counts[entry.trigger] || 0) + 1;
                                  return counts;
                                }, {})
                              )
                              .sort((a, b) => b[1] - a[1])[0]?.[0] || "None"
                            : "None"
                          }
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  {/* Insights Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <span>Frequent Symptoms</span>
                          <PieChart className="h-4 w-4 text-neutral-400" />
                        </CardTitle>
                        <CardDescription>
                          Your most common symptoms
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {/* Simplified symptoms display for MVP */}
                          <div className="flex items-center">
                            <div className="w-2 h-2 rounded-full bg-primary mr-2"></div>
                            <span className="text-sm">Racing thoughts</span>
                            <span className="ml-auto text-sm font-medium">
                              {entries.filter(e => e.mind.includes("racing-thoughts")).length}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-2 h-2 rounded-full bg-secondary mr-2"></div>
                            <span className="text-sm">Trouble sleeping</span>
                            <span className="ml-auto text-sm font-medium">
                              {entries.filter(e => e.body.includes("trouble-sleeping")).length}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-2 h-2 rounded-full bg-success mr-2"></div>
                            <span className="text-sm">Overwhelmed</span>
                            <span className="ml-auto text-sm font-medium">
                              {entries.filter(e => e.emotions.includes("overwhelmed")).length}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-2 h-2 rounded-full bg-neutral-400 mr-2"></div>
                            <span className="text-sm">Restlessness</span>
                            <span className="ml-auto text-sm font-medium">
                              {entries.filter(e => e.behaviors.includes("restlessness")).length}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <span>Anxiety Trends</span>
                          <LineChart className="h-4 w-4 text-neutral-400" />
                        </CardTitle>
                        <CardDescription>
                          Your anxiety levels over time
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="h-[150px] flex items-end justify-between">
                          {/* Simplified chart visualization for MVP */}
                          {entries.length > 0 ? (
                            entries.slice(-7).map((entry, i) => (
                              <div key={i} className="relative flex flex-col items-center">
                                <div 
                                  className={`w-8 ${getAnxietyLevelColor(entry.anxietyLevel)} rounded-t`} 
                                  style={{ height: `${entry.anxietyLevel * 10}px` }}
                                ></div>
                                <span className="text-xs mt-1">
                                  {format(new Date(entry.date), "M/d")}
                                </span>
                              </div>
                            ))
                          ) : (
                            <div className="text-center w-full py-12 text-neutral-500">No data to display</div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  {/* Quick Actions */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    <Button 
                      variant="outline" 
                      className="bg-primary-light/10 border-primary-light/30 text-primary h-20"
                      onClick={() => setActiveTab("breathing")}
                    >
                      <Activity className="h-6 w-6 mr-2" />
                      <div className="text-left">
                        <div className="font-medium">Quick Breathing Exercise</div>
                        <div className="text-xs">Reduce anxiety in just 2 minutes</div>
                      </div>
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="bg-secondary-light/10 border-secondary-light/30 text-secondary h-20"
                      onClick={() => setActiveTab("database")}
                    >
                      <Database className="h-6 w-6 mr-2" />
                      <div className="text-left">
                        <div className="font-medium">Learn How Your Data Works</div>
                        <div className="text-xs">Understand your anxiety patterns</div>
                      </div>
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="breathing">
                  <BreathingExercise onComplete={() => setActiveTab("dashboard")} />
                </TabsContent>
                
                <TabsContent value="database">
                  <DatabaseVisualization />
                </TabsContent>
              </Tabs>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
