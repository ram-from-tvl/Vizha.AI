'use client';

import React, { useEffect, useState } from 'react';

interface Event {
  id: string;
  title: string;
  type: string;
  startDate: string;
  endDate: string;
}

interface EventCalendarProps {
  month?: number;
  year?: number;
  eventType?: 'HACKATHON' | 'CONFERENCE' | 'WORKSHOP' | 'MEETUP';
}

export function EventCalendar({ 
  month = new Date().getMonth(),
  year = new Date().getFullYear(),
  eventType
}: EventCalendarProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(month);
  const [currentYear, setCurrentYear] = useState(year);

  useEffect(() => {
    fetchEvents();
  }, [currentMonth, currentYear, eventType]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (eventType) params.append('type', eventType);
      
      const response = await fetch(`/api/events?${params}`);
      const data = await response.json();
      setEvents(data.events || []);
    } catch (err) {
      console.error('Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const getEventsForDate = (day: number) => {
    const date = new Date(currentYear, currentMonth, day);
    return events.filter(event => {
      const start = new Date(event.startDate);
      const end = new Date(event.endDate);
      return date >= new Date(start.setHours(0,0,0,0)) && date <= new Date(end.setHours(23,59,59,999));
    });
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
  const today = new Date();

  const typeColors: Record<string, string> = {
    HACKATHON: 'bg-purple-500',
    CONFERENCE: 'bg-blue-500',
    WORKSHOP: 'bg-orange-500',
    MEETUP: 'bg-green-500'
  };

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-lg">
          ←
        </button>
        <h3 className="text-xl font-semibold">
          {monthNames[currentMonth]} {currentYear}
        </h3>
        <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-lg">
          →
        </button>
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="animate-spin text-2xl">⏳</div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-7 gap-1 mb-2">
            {dayNames.map(day => (
              <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {/* Empty cells before first day */}
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} className="h-24 bg-gray-50 rounded-lg"></div>
            ))}

            {/* Days of the month */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dayEvents = getEventsForDate(day);
              const isToday = 
                day === today.getDate() && 
                currentMonth === today.getMonth() && 
                currentYear === today.getFullYear();

              return (
                <div
                  key={day}
                  className={`h-24 p-2 rounded-lg border ${
                    isToday ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'
                  } hover:bg-gray-50 transition-colors`}
                >
                  <span className={`text-sm font-medium ${
                    isToday ? 'text-blue-600' : 'text-gray-700'
                  }`}>
                    {day}
                  </span>
                  <div className="mt-1 space-y-1 overflow-hidden">
                    {dayEvents.slice(0, 2).map(event => (
                      <div
                        key={event.id}
                        className={`text-xs text-white px-1 py-0.5 rounded truncate ${
                          typeColors[event.type] || 'bg-gray-500'
                        }`}
                        title={event.title}
                      >
                        {event.title}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <div className="text-xs text-gray-500">
                        +{dayEvents.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-6 flex flex-wrap gap-4 text-sm">
            {Object.entries(typeColors).map(([type, color]) => (
              <div key={type} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded ${color}`}></div>
                <span className="text-gray-600">{type.charAt(0) + type.slice(1).toLowerCase()}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}