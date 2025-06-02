import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { format, subMonths, startOfMonth, endOfMonth } from "date-fns";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDate, getAnxietyLevelText, getAnxietyLevelColor } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { Entry } from "@shared/schema";
import Calendar from "@/components/Calendar";

export default function History() {
  const [, navigate] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTrigger, setSelectedTrigger] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  // Fetch current user
  const { data: userData } = useQuery({
    queryKey: ["/api/user"],
  });
  
  // Fetch all entries
  const { data: entries = [], isLoading } = useQuery({
    queryKey: ["/api/entries", userData?.id],
    queryFn: () => 
      fetch(`/api/entries?userId=${userData?.id}`).then(res => res.json()),
    enabled: !!userData,
  });
  
  // Filter entries based on search and filter criteria
  const filteredEntries = entries.filter((entry: Entry) => {
    const matchesSearch = searchTerm === "" || 
      entry.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTrigger = selectedTrigger === null || 
      selectedTrigger === "all" ||
      entry.trigger === selectedTrigger;
    
    return matchesSearch && matchesTrigger;
  });
  
  const handleSelectDate = (date: Date) => {
    setSelectedDate(date);
    navigate(`/daily-log/${format(date, "yyyy-MM-dd")}`);
  };
  
  const handlePrevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };
  
  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)));
  };
  
  const handleViewEntry = (entry: Entry) => {
    navigate(`/daily-log/${format(new Date(entry.date), "yyyy-MM-dd")}`);
  };
  
  // Group entries by month
  const entriesByMonth: Record<string, Entry[]> = {};
  entries.forEach((entry: Entry) => {
    const month = format(new Date(entry.date), "MMMM yyyy");
    if (!entriesByMonth[month]) {
      entriesByMonth[month] = [];
    }
    entriesByMonth[month].push(entry);
  });
  
  return (
    <div className="lg:grid lg:grid-cols-3 lg:gap-8">
      {/* Left Column - Calendar */}
      <div className="col-span-1">
        <Calendar 
          currentDate={selectedDate}
          entries={entries}
          onSelectDate={handleSelectDate}
        />
        
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <h2 className="text-lg font-medium text-neutral-800 mb-4">Filters</h2>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="search" className="text-sm font-medium text-neutral-700 mb-1 block">
                Search entries
              </label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-neutral-400" />
                <Input
                  id="search"
                  placeholder="Search by description..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="trigger-filter" className="text-sm font-medium text-neutral-700 mb-1 block">
                Filter by trigger
              </label>
              <Select 
                value={selectedTrigger || ""} 
                onValueChange={(value) => setSelectedTrigger(value || null)}
              >
                <SelectTrigger id="trigger-filter">
                  <SelectValue placeholder="All triggers" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All triggers</SelectItem>
                  <SelectItem value="home">Home</SelectItem>
                  <SelectItem value="school">School</SelectItem>
                  <SelectItem value="work">Work</SelectItem>
                  <SelectItem value="social">Social</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => {
                setSearchTerm("");
                setSelectedTrigger(null);
              }}
            >
              Clear Filters
            </Button>
          </div>
        </div>
      </div>
      
      {/* Right Column - Entries List */}
      <div className="col-span-2 mt-8 lg:mt-0">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-neutral-800">Entry History</h2>
            <Button 
              variant="outline"
              onClick={() => navigate("/daily-log")}
              className="flex items-center gap-2"
            >
              <CalendarIcon className="h-4 w-4" />
              <span>New Entry</span>
            </Button>
          </div>
          
          <Tabs defaultValue="list">
            <TabsList className="mb-6">
              <TabsTrigger value="list">List View</TabsTrigger>
              <TabsTrigger value="month">Monthly View</TabsTrigger>
            </TabsList>
            
            <TabsContent value="list">
              {isLoading ? (
                <div className="text-center py-12">
                  <p>Loading entries...</p>
                </div>
              ) : filteredEntries.length > 0 ? (
                <div className="space-y-4">
                  {filteredEntries.map((entry) => (
                    <Card 
                      key={entry.id} 
                      className="cursor-pointer hover:border-primary transition-colors"
                      onClick={() => handleViewEntry(entry)}
                    >
                      <CardContent className="pt-6">
                        <div className="flex justify-between">
                          <div>
                            <h3 className="font-medium text-neutral-800">
                              {formatDate(new Date(entry.date))}
                            </h3>
                            <div className="flex items-center mt-1">
                              <div className={cn(
                                "w-3 h-3 rounded-full mr-2",
                                getAnxietyLevelColor(entry.anxietyLevel)
                              )}></div>
                              <span className="text-sm text-neutral-600">
                                {getAnxietyLevelText(entry.anxietyLevel)}
                              </span>
                            </div>
                          </div>
                          <span className="text-xs px-2 py-1 bg-neutral-100 rounded-full text-neutral-700 capitalize">
                            {entry.trigger}
                          </span>
                        </div>
                        <p className="mt-3 text-neutral-600 line-clamp-2">
                          {entry.description}
                        </p>
                        
                        <div className="mt-3 flex flex-wrap gap-2">
                          {entry.mind.map((item) => (
                            <span 
                              key={item} 
                              className="text-xs px-2 py-1 bg-secondary-light/10 rounded-full text-secondary-dark"
                            >
                              {item}
                            </span>
                          ))}
                          {entry.emotions.map((item) => (
                            <span 
                              key={item} 
                              className="text-xs px-2 py-1 bg-primary-light/10 rounded-full text-primary-dark"
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-neutral-500">No entries found matching your filters.</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="month">
              <div className="space-y-8">
                {Object.keys(entriesByMonth).length > 0 ? (
                  Object.entries(entriesByMonth).map(([month, monthEntries]) => (
                    <div key={month}>
                      <h3 className="font-medium text-lg text-neutral-800 mb-4">{month}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {monthEntries.map((entry) => (
                          <Card 
                            key={entry.id} 
                            className="cursor-pointer hover:border-primary transition-colors"
                            onClick={() => handleViewEntry(entry)}
                          >
                            <CardContent className="pt-4">
                              <div className="flex justify-between">
                                <div>
                                  <h3 className="font-medium text-neutral-800">
                                    {format(new Date(entry.date), "EEEE, MMM d")}
                                  </h3>
                                  <div className="flex items-center mt-1">
                                    <div className={cn(
                                      "w-2 h-2 rounded-full mr-2",
                                      getAnxietyLevelColor(entry.anxietyLevel)
                                    )}></div>
                                    <span className="text-xs text-neutral-600">
                                      {getAnxietyLevelText(entry.anxietyLevel)}
                                    </span>
                                  </div>
                                </div>
                                <span className="text-xs px-2 py-0.5 bg-neutral-100 rounded-full text-neutral-700 capitalize">
                                  {entry.trigger}
                                </span>
                              </div>
                              <p className="mt-2 text-sm text-neutral-600 line-clamp-1">
                                {entry.description}
                              </p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <p className="text-neutral-500">No entries found.</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}