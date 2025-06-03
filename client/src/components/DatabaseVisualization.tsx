import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Database, User, CalendarDays, Key, FileText, BarChart2, Link2, Brain, Heart, Activity, PieChart, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { type Entry } from "@shared/schema";

export function DatabaseVisualization() {
  const [activeTab, setActiveTab] = useState("entries");

  // Query to check database connection status
  const { data: connectionStatus, isLoading } = useQuery({
    queryKey: ['/api/user'],
    retry: false,
    refetchOnWindowFocus: false
  });

  // Query to get entries from database
  const { data: entries = [] } = useQuery<Entry[]>({
    queryKey: ['/api/entries'],
    retry: false,
    refetchOnWindowFocus: false
  });

  // Helper function to render a table cell icon
  const TableCellIcon = ({ icon }: { icon: React.ReactNode }) => (
    <div className="flex items-center justify-center bg-primary/10 rounded-full p-1.5 h-8 w-8 text-primary">
      {icon}
    </div>
  );

  return (
    <Card className="w-full shadow-card">
      <CardHeader className="pb-2 gradient-bg">
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5 text-primary" />
          <span className="gradient-text">Database Structure</span>
          
          {/* Database connection status */}
          {isLoading ? (
            <Badge variant="outline" className="ml-2 animate-pulse">
              Connecting...
            </Badge>
          ) : connectionStatus ? (
            <Badge variant="default" className="ml-2 bg-green-500">
              <Check className="h-3 w-3 mr-1" />
              Connected
            </Badge>
          ) : (
            <Badge variant="destructive" className="ml-2">
              <X className="h-3 w-3 mr-1" />
              Disconnected
            </Badge>
          )}
        </CardTitle>
        <CardDescription>
          How your anxiety and stress data is organized
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <Tabs defaultValue="entries" onValueChange={setActiveTab}>
          <TabsList className="mb-6 grid grid-cols-3 gap-2">
            <TabsTrigger value="entries" className="flex gap-2 items-center">
              <CalendarDays className="h-4 w-4" />
              <span>Entries</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex gap-2 items-center">
              <User className="h-4 w-4" />
              <span>Users</span>
            </TabsTrigger>
            <TabsTrigger value="relationships" className="flex gap-2 items-center">
              <Link2 className="h-4 w-4" />
              <span>Relationships</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="entries" className="space-y-6">
            <div className="gradient-border">
              <div className="p-4 space-y-2">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <span>Entry Data Structure</span>
                </h3>
                <p className="text-sm text-neutral-600">
                  The entries table stores all your daily anxiety and stress logs, including emotions, 
                  triggers, and symptoms across the four quadrants.
                </p>
              </div>
            </div>
            
            {/* Database Visualization */}
            <div className="db-container">
              <div className="db-table">
                <div className="db-header flex items-center gap-2">
                  <Database className="h-4 w-4" />
                  <span>Entries Table</span>
                </div>
                <div className="db-row bg-neutral-50">
                  <div className="db-column db-column-header">Column</div>
                  <div className="db-column db-column-header">Type</div>
                  <div className="db-column db-column-header">Description</div>
                </div>
                <div className="db-row">
                  <div className="db-column font-medium flex items-center gap-2">
                    <TableCellIcon icon={<Key className="h-4 w-4" />} />
                    <span>id</span>
                  </div>
                  <div className="db-column text-neutral-600">Integer</div>
                  <div className="db-column text-sm">Primary key</div>
                </div>
                <div className="db-row">
                  <div className="db-column font-medium flex items-center gap-2">
                    <TableCellIcon icon={<User className="h-4 w-4" />} />
                    <span>userId</span>
                  </div>
                  <div className="db-column text-neutral-600">Integer</div>
                  <div className="db-column text-sm">Foreign key to users table</div>
                </div>
                <div className="db-row">
                  <div className="db-column font-medium flex items-center gap-2">
                    <TableCellIcon icon={<CalendarDays className="h-4 w-4" />} />
                    <span>date</span>
                  </div>
                  <div className="db-column text-neutral-600">Date</div>
                  <div className="db-column text-sm">When the entry was recorded</div>
                </div>
                <div className="db-row">
                  <div className="db-column font-medium flex items-center gap-2">
                    <TableCellIcon icon={<Heart className="h-4 w-4" />} />
                    <span>emotion</span>
                  </div>
                  <div className="db-column text-neutral-600">String</div>
                  <div className="db-column text-sm">Primary emotion (calm, happy, anxious, etc.)</div>
                </div>
                <div className="db-row">
                  <div className="db-column font-medium flex items-center gap-2">
                    <TableCellIcon icon={<BarChart2 className="h-4 w-4" />} />
                    <span>anxietyLevel</span>
                  </div>
                  <div className="db-column text-neutral-600">Integer</div>
                  <div className="db-column text-sm">Scale from 1-10</div>
                </div>
                <div className="db-row">
                  <div className="db-column font-medium flex items-center gap-2">
                    <TableCellIcon icon={<Activity className="h-4 w-4" />} />
                    <span>trigger</span>
                  </div>
                  <div className="db-column text-neutral-600">String</div>
                  <div className="db-column text-sm">What caused the stress (home, work, etc.)</div>
                </div>
                <div className="db-row">
                  <div className="db-column font-medium flex items-center gap-2">
                    <TableCellIcon icon={<FileText className="h-4 w-4" />} />
                    <span>description</span>
                  </div>
                  <div className="db-column text-neutral-600">Text</div>
                  <div className="db-column text-sm">Details about the situation</div>
                </div>
                <div className="db-row">
                  <div className="db-column font-medium flex items-center gap-2">
                    <TableCellIcon icon={<Brain className="h-4 w-4" />} />
                    <span>mind</span>
                  </div>
                  <div className="db-column text-neutral-600">String[]</div>
                  <div className="db-column text-sm">Mind quadrant symptoms</div>
                </div>
                <div className="db-row">
                  <div className="db-column font-medium flex items-center gap-2">
                    <TableCellIcon icon={<Activity className="h-4 w-4" />} />
                    <span>body</span>
                  </div>
                  <div className="db-column text-neutral-600">String[]</div>
                  <div className="db-column text-sm">Body quadrant symptoms</div>
                </div>
                <div className="db-row">
                  <div className="db-column font-medium flex items-center gap-2">
                    <TableCellIcon icon={<Heart className="h-4 w-4" />} />
                    <span>emotions</span>
                  </div>
                  <div className="db-column text-neutral-600">String[]</div>
                  <div className="db-column text-sm">Emotions quadrant symptoms</div>
                </div>
                <div className="db-row">
                  <div className="db-column font-medium flex items-center gap-2">
                    <TableCellIcon icon={<Activity className="h-4 w-4" />} />
                    <span>behaviors</span>
                  </div>
                  <div className="db-column text-neutral-600">String[]</div>
                  <div className="db-column text-sm">Behavior quadrant symptoms</div>
                </div>
              </div>
            </div>

            {/* Database Status */}
            <div className="glass-card p-5 rounded-xl">
              <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                <Database className="h-4 w-4 text-primary" />
                <span className="gradient-text">Database Status</span>
                <Badge className="ml-2">
                  {entries?.length || 0} {(entries?.length || 0) === 1 ? 'entry' : 'entries'}
                </Badge>
              </h4>
              
              {entries && entries.length > 0 ? (
                <div className="bg-white border border-neutral-200 rounded-lg p-4">
                  <h5 className="text-sm font-medium mb-2">Current Database Entries</h5>
                  <div className="max-h-64 overflow-y-auto">
                    {entries.map((entry) => (
                      <div key={entry.id} className="mb-4 border-b pb-3 last:border-b-0 last:pb-0">
                        <div className="flex justify-between items-start mb-1">
                          <div className="font-medium text-sm">Entry #{entry.id}</div>
                          <Badge variant="outline" className="text-xs">
                            {new Date(entry.date).toLocaleDateString()}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div><span className="text-neutral-500">Emotion:</span> {entry.emotion}</div>
                          <div><span className="text-neutral-500">Anxiety Level:</span> {entry.anxietyLevel}/10</div>
                          <div><span className="text-neutral-500">Trigger:</span> {entry.trigger}</div>
                          <div>
                            <span className="text-neutral-500">Mind:</span> {Array.isArray(entry.mind) ? entry.mind.join(", ") : 'None'}
                          </div>
                          <div className="col-span-2">
                            <span className="text-neutral-500">Description:</span> {entry.description}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-white border border-neutral-200 rounded-lg p-4">
                  <div className="text-center py-6">
                    <FileText className="h-8 w-8 text-neutral-300 mx-auto mb-2" />
                    <p className="text-sm text-neutral-500">No entries yet</p>
                    <p className="text-xs text-neutral-400 mt-1">Create your first daily log to see data here</p>
                  </div>
                </div>
              )}
              
              {/* Data Insights */}
              <div className="mt-4 grid grid-cols-3 gap-3">
                <div className="bg-primary/10 rounded-lg p-3 text-center">
                  <PieChart className="h-5 w-5 mx-auto mb-1 text-primary" />
                  <div className="text-xs font-medium text-primary">Structure Data</div>
                </div>
                <div className="bg-secondary/10 rounded-lg p-3 text-center">
                  <BarChart2 className="h-5 w-5 mx-auto mb-1 text-secondary" />
                  <div className="text-xs font-medium text-secondary">Track Trends</div>
                </div>
                <div className="bg-accent/10 rounded-lg p-3 text-center">
                  <Brain className="h-5 w-5 mx-auto mb-1 text-accent" />
                  <div className="text-xs font-medium text-accent">Find Patterns</div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="users" className="space-y-6">
            <div className="gradient-border">
              <div className="p-4 space-y-2">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  <span>User Data Structure</span>
                </h3>
                <p className="text-sm text-neutral-600">
                  The users table stores basic user information for authentication and personalization.
                </p>
              </div>
            </div>
            
            <div className="db-container">
              <div className="db-table">
                <div className="db-header flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>Users Table</span>
                </div>
                <div className="db-row bg-neutral-50">
                  <div className="db-column db-column-header">Column</div>
                  <div className="db-column db-column-header">Type</div>
                  <div className="db-column db-column-header">Description</div>
                </div>
                <div className="db-row">
                  <div className="db-column font-medium flex items-center gap-2">
                    <TableCellIcon icon={<Key className="h-4 w-4" />} />
                    <span>id</span>
                  </div>
                  <div className="db-column text-neutral-600">Integer</div>
                  <div className="db-column text-sm">Primary key</div>
                </div>
                <div className="db-row">
                  <div className="db-column font-medium flex items-center gap-2">
                    <TableCellIcon icon={<User className="h-4 w-4" />} />
                    <span>username</span>
                  </div>
                  <div className="db-column text-neutral-600">String</div>
                  <div className="db-column text-sm">Unique username for login</div>
                </div>
                <div className="db-row">
                  <div className="db-column font-medium flex items-center gap-2">
                    <TableCellIcon icon={<Key className="h-4 w-4" />} />
                    <span>password</span>
                  </div>
                  <div className="db-column text-neutral-600">String</div>
                  <div className="db-column text-sm">Hashed password for security</div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="relationships" className="space-y-6">
            <div className="gradient-border">
              <div className="p-4 space-y-2">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <Link2 className="h-5 w-5 text-primary" />
                  <span>Relationship Diagram</span>
                </h3>
                <p className="text-sm text-neutral-600">
                  This diagram shows how the database tables are related to each other.
                </p>
              </div>
            </div>
            
            <div className="glass-card p-8 rounded-xl dot-pattern">
              <div className="flex flex-col items-center">
                {/* Database Schema SVG Illustration */}
                <svg width="100%" height="220" viewBox="0 0 400 220" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* User Table */}
                  <rect x="40" y="40" width="120" height="140" rx="8" fill="white" stroke="hsl(220 85% 57%)" strokeWidth="2"/>
                  <rect x="40" y="40" width="120" height="40" rx="8" fill="hsl(220 85% 57% / 0.1)" stroke="hsl(220 85% 57%)" strokeWidth="2"/>
                  <text x="100" y="65" fontSize="14" fontWeight="600" textAnchor="middle" fill="hsl(220 85% 57%)">Users</text>
                  
                  <line x1="50" y1="100" x2="150" y2="100" stroke="hsl(220 13% 90%)" strokeWidth="1"/>
                  <text x="60" y="90" fontSize="12" fill="hsl(220 20% 20%)">id</text>
                  <text x="60" y="120" fontSize="12" fill="hsl(220 20% 20%)">username</text>
                  <text x="60" y="150" fontSize="12" fill="hsl(220 20% 20%)">password</text>
                  
                  {/* Entries Table */}
                  <rect x="240" y="40" width="120" height="140" rx="8" fill="white" stroke="hsl(280 75% 60%)" strokeWidth="2"/>
                  <rect x="240" y="40" width="120" height="40" rx="8" fill="hsl(280 75% 60% / 0.1)" stroke="hsl(280 75% 60%)" strokeWidth="2"/>
                  <text x="300" y="65" fontSize="14" fontWeight="600" textAnchor="middle" fill="hsl(280 75% 60%)">Entries</text>
                  
                  <line x1="250" y1="100" x2="350" y2="100" stroke="hsl(220 13% 90%)" strokeWidth="1"/>
                  <text x="260" y="90" fontSize="12" fill="hsl(220 20% 20%)">id</text>
                  <text x="260" y="120" fontSize="12" fill="hsl(220 20% 20%)">userId</text>
                  <text x="260" y="150" fontSize="12" fill="hsl(220 20% 20%)">date, emotion, ...</text>
                  
                  {/* Relationship Arrow */}
                  <path d="M160 110 H240" stroke="hsl(220 85% 57%)" strokeWidth="2" strokeDasharray="4 2"/>
                  <polygon points="230,105 240,110 230,115" fill="hsl(220 85% 57%)"/>
                  
                  {/* Relationship Labels */}
                  <text x="170" y="100" fontSize="10" fill="hsl(220 20% 20%)">1</text>
                  <text x="225" y="100" fontSize="10" fill="hsl(220 20% 20%)">∞</text>
                  <text x="200" y="130" fontSize="11" fontWeight="500" textAnchor="middle" fill="hsl(220 20% 20%)">one-to-many</text>
                </svg>
                
                <div className="text-sm text-neutral-600 mt-8 max-w-md text-center">
                  <span className="font-medium">Relationship Explained:</span> One user can have multiple entries, but each entry belongs to only one user. 
                  This is represented by the <span className="bg-neutral-100 px-1 rounded font-mono text-xs">userId</span> foreign key in the entries table.
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

export default DatabaseVisualization;