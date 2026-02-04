'use client';

import React from 'react';

interface ScheduleItem {
  id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  location?: string;
  speaker?: string;
}

interface EventScheduleProps {
  eventId: string;
  scheduleItems: ScheduleItem[];
}

export function EventSchedule({ eventId, scheduleItems }: EventScheduleProps) {
  // Group items by date
  const groupedByDate = scheduleItems.reduce((acc, item) => {
    const date = new Date(item.startTime).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });
    if (!acc[date]) acc[date] = [];
    acc[date].push(item);
    return acc;
  }, {} as Record<string, ScheduleItem[]>);

  if (!scheduleItems || scheduleItems.length === 0) {
    return (
      <div className="card p-8 text-center">
        <div className="text-4xl mb-4">📅</div>
        <h3 className="text-lg font-semibold mb-2">No Schedule Available</h3>
        <p className="text-gray-500">The schedule will be announced soon.</p>
      </div>
    );
  }

  return (
    <div className="card p-6">
      <h3 className="text-xl font-semibold mb-6">📅 Event Schedule</h3>
      
      <div className="space-y-8">
        {Object.entries(groupedByDate).map(([date, items]) => (
          <div key={date}>
            <h4 className="text-lg font-medium text-blue-600 mb-4 pb-2 border-b">
              {date}
            </h4>
            <div className="space-y-4">
              {items.map((item, index) => {
                const startTime = new Date(item.startTime).toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit'
                });
                const endTime = new Date(item.endTime).toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit'
                });
                
                return (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-24 shrink-0 text-sm text-gray-500">
                      {startTime}
                      <br />
                      <span className="text-gray-400">to {endTime}</span>
                    </div>
                    <div className="flex-1 relative pb-4">
                      {index < items.length - 1 && (
                        <div className="absolute left-0 top-6 bottom-0 w-px bg-gray-200"></div>
                      )}
                      <div className="bg-gray-50 rounded-lg p-4 relative">
                        <div className="absolute -left-2 top-4 w-4 h-4 bg-blue-500 rounded-full border-2 border-white"></div>
                        <h5 className="font-medium text-gray-900">{item.title}</h5>
                        {item.description && (
                          <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                        )}
                        <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500">
                          {item.location && (
                            <span>📍 {item.location}</span>
                          )}
                          {item.speaker && (
                            <span>🎤 {item.speaker}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}