'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface Event {
  id: string;
  title: string;
  description: string;
  type: string;
  status: string;
  startDate: string;
  endDate: string;
  location: string;
  capacity: number;
  price: number;
  currency: string;
  imageUrl?: string;
  tags: string[];
  organizer: {
    id: string;
    name: string;
  };
  _count?: {
    registrations: number;
  };
}

interface EventListProps {
  eventType?: 'HACKATHON' | 'CONFERENCE' | 'WORKSHOP' | 'MEETUP';
  limit?: number;
  showFilters?: boolean;
}

export function EventList({ eventType, limit = 10, showFilters = true }: EventListProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState(eventType || 'all');

  useEffect(() => {
    fetchEvents();
  }, [filter]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filter && filter !== 'all') params.append('type', filter);
      if (limit) params.append('limit', limit.toString());

      const response = await fetch(`/api/events?${params}`);
      const data = await response.json();
      if (data.error) {
        setError(data.error);
      } else {
        setEvents(data.events || []);
      }
    } catch (err) {
      setError('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {showFilters && (
          <div className="h-10 bg-gray-200 rounded-lg animate-pulse w-full max-w-md"></div>
        )}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card p-6 animate-pulse">
              <div className="h-40 bg-gray-200 rounded mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card p-8 text-center bg-red-50">
        <p className="text-red-600 mb-4">❌ {error}</p>
        <button onClick={fetchEvents} className="btn-primary">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {showFilters && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            All Events
          </button>
          {['HACKATHON', 'CONFERENCE', 'WORKSHOP', 'MEETUP'].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === type ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {type.charAt(0) + type.slice(1).toLowerCase()}s
            </button>
          ))}
        </div>
      )}

      {events.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="text-6xl mb-4">📭</div>
          <h3 className="text-xl font-semibold mb-2">No events found</h3>
          <p className="text-gray-600">Check back later or try a different filter</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div key={event.id} className="card hover:shadow-lg transition-shadow">
              {event.imageUrl && (
                <div className="h-40 bg-gray-200">
                  <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-semibold text-gray-900 line-clamp-1">{event.title}</h3>
                  <span className={`px-2 py-1 text-xs rounded-full shrink-0 ml-2 ${
                    event.price === 0 ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {event.price === 0 ? 'FREE' : `$${event.price}`}
                  </span>
                </div>
                
                <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
                
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                  <span>📅 {new Date(event.startDate).toLocaleDateString()}</span>
                  <span>📍 {event.location.split(',')[0]}</span>
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-3 py-1 text-xs rounded-full ${
                    event.type === 'HACKATHON' ? 'bg-purple-100 text-purple-700' :
                    event.type === 'CONFERENCE' ? 'bg-blue-100 text-blue-700' :
                    event.type === 'WORKSHOP' ? 'bg-orange-100 text-orange-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {event.type}
                  </span>
                  <span className="text-sm text-gray-500">
                    👥 {event._count?.registrations || 0}/{event.capacity}
                  </span>
                </div>

                <Link
                  href={`/events/${event.id}`}
                  className="block text-center btn-primary"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}