import { useState } from "react";
import { Link } from "wouter";
import { formatDate, getAnxietyLevelText, getAnxietyLevelColor } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { Entry } from "@shared/schema";

interface RecentEntriesProps {
  entries: Entry[];
  onSelectEntry?: (entry: Entry) => void;
  maxEntries?: number;
}

export function RecentEntries({ 
  entries, 
  onSelectEntry, 
  maxEntries = 4 
}: RecentEntriesProps) {
  const [showAll, setShowAll] = useState(false);
  
  const displayEntries = showAll ? entries : entries.slice(0, maxEntries);
  
  const handleEntryClick = (entry: Entry) => {
    if (onSelectEntry) {
      onSelectEntry(entry);
    }
  };
  
  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      <h2 className="text-lg font-medium text-neutral-800 mb-4">Recent Entries</h2>
      
      {displayEntries.length === 0 ? (
        <div className="text-center py-6 text-neutral-500">
          <p>No entries yet. Start tracking your stress and anxiety by creating a daily log.</p>
        </div>
      ) : (
        <>
          {displayEntries.map((entry, index) => (
            <div 
              key={entry.id} 
              className={cn(
                "mb-4 pb-4",
                index < displayEntries.length - 1 && "border-b border-neutral-200"
              )}
              onClick={() => handleEntryClick(entry)}
            >
              <div className="flex justify-between items-start">
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
              <p className="mt-2 text-sm text-neutral-600 line-clamp-2">
                {entry.description}
              </p>
            </div>
          ))}
        
          {entries.length > maxEntries && (
            <Link to="/history">
              <button className="w-full mt-4 py-2 text-sm font-medium text-primary border border-primary rounded-md hover:bg-primary-light/10 transition-colors">
                View All Entries
              </button>
            </Link>
          )}
        </>
      )}
    </div>
  );
}

export default RecentEntries;