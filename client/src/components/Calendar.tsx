import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { 
  getCalendarDays, 
  getNextMonth, 
  getPrevMonth,
  cn 
} from "@/lib/utils";
import { CalendarDay } from "@/lib/types";

interface CalendarProps {
  currentDate: Date;
  entries: { date: Date; }[];
  onSelectDate: (date: Date) => void;
}

export function Calendar({ currentDate, entries, onSelectDate }: CalendarProps) {
  const [viewDate, setViewDate] = useState(currentDate);
  const calendarDays = getCalendarDays(viewDate, entries);
  
  const handlePrevMonth = () => {
    setViewDate(getPrevMonth(viewDate));
  };
  
  const handleNextMonth = () => {
    setViewDate(getNextMonth(viewDate));
  };
  
  const handleSelectDay = (day: CalendarDay) => {
    onSelectDate(day.date);
  };
  
  const dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  
  return (
    <div className="bg-white rounded-xl shadow-sm mb-6 p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-neutral-800">{format(viewDate, "MMMM yyyy")}</h2>
        <div className="flex space-x-2">
          <button 
            className="p-1 rounded hover:bg-neutral-100"
            onClick={handlePrevMonth}
            aria-label="Previous month"
          >
            <ChevronLeft className="h-5 w-5 text-neutral-600" />
          </button>
          <button 
            className="p-1 rounded hover:bg-neutral-100"
            onClick={handleNextMonth}
            aria-label="Next month"
          >
            <ChevronRight className="h-5 w-5 text-neutral-600" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-sm font-medium text-neutral-600 mb-2">
        {dayNames.map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, index) => (
          <div
            key={index}
            className={cn(
              "calendar-day h-9 flex items-center justify-center text-sm rounded-full cursor-pointer",
              day.isCurrentMonth ? "hover:bg-neutral-100" : "text-neutral-400 hover:bg-neutral-100",
              day.isSelected && "bg-primary text-white hover:bg-primary",
              day.hasEntry && "has-entry"
            )}
            onClick={() => handleSelectDay(day)}
          >
            {format(day.date, "d")}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Calendar;
