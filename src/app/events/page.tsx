'use client';

import React from 'react';
import { EventList } from '@/components/tambo/EventList';
import { EventCalendar } from '@/components/tambo/EventCalendar';

export default function EventsPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Discover Events</h1>
          <p className="text-gray-600 mt-1">Find hackathons, conferences, workshops, and more</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <EventList showFilters={true} limit={12} />
        </div>
        <div>
          <EventCalendar />
        </div>
      </div>
    </div>
  );
}