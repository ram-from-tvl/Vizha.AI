'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'ORGANIZER' | 'ATTENDEE';
}

interface Registration {
  id: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'WAITLISTED';
  teamPreference?: string;
  skills: string[];
  motivation?: string;
  createdAt: string;
  event: {
    id: string;
    title: string;
    description: string;
    type: 'HACKATHON' | 'CONFERENCE' | 'WORKSHOP' | 'MEETUP';
    status: string;
    startDate: string;
    endDate: string;
    location: string;
    imageUrl?: string;
    organizer: {
      name: string;
    };
    _count: {
      registrations: number;
    };
  };
  team?: {
    id: string;
    name: string;
    status: string;
  };
}

const statusColors = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
  WAITLISTED: 'bg-purple-100 text-purple-800',
};

const typeColors = {
  HACKATHON: 'bg-purple-100 text-purple-700',
  CONFERENCE: 'bg-blue-100 text-blue-700',
  WORKSHOP: 'bg-orange-100 text-orange-700',
  MEETUP: 'bg-green-100 text-green-700',
};

const typeEmojis = {
  HACKATHON: '💻',
  CONFERENCE: '🎤',
  WORKSHOP: '🛠️',
  MEETUP: '🤝',
};

export default function MyRegistrationsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  useEffect(() => {
    checkAuthAndFetch();
  }, []);

  const checkAuthAndFetch = async () => {
    try {
      // Check if user is logged in
      const authResponse = await fetch('/api/auth/me');
      if (!authResponse.ok) {
        router.push('/login?redirect=/my-registrations');
        return;
      }
      const authData = await authResponse.json();
      if (!authData.user) {
        router.push('/login?redirect=/my-registrations');
        return;
      }
      setUser(authData.user);

      // Fetch registrations
      const regResponse = await fetch('/api/user/registrations');
      if (regResponse.ok) {
        const regData = await regResponse.json();
        setRegistrations(regData.registrations || []);
      }
    } catch (error) {
      console.error('Error:', error);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  const filteredRegistrations = registrations.filter(reg => {
    const eventDate = new Date(reg.event.startDate);
    const now = new Date();
    
    // Time filter
    if (filter === 'upcoming' && eventDate < now) return false;
    if (filter === 'past' && eventDate >= now) return false;
    
    // Type filter
    if (typeFilter !== 'all' && reg.event.type !== typeFilter) return false;
    
    return true;
  });

  const upcomingCount = registrations.filter(r => new Date(r.event.startDate) >= new Date()).length;
  const pastCount = registrations.filter(r => new Date(r.event.startDate) < new Date()).length;
  const confirmedCount = registrations.filter(r => r.status === 'CONFIRMED').length;

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 rounded w-1/3 mb-8"></div>
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-40 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Registrations</h1>
        <p className="text-gray-600 mt-1">Track all the events you've registered for</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-500 text-sm">Total</span>
            <span className="text-2xl">🎟️</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{registrations.length}</p>
          <p className="text-xs text-gray-500">registrations</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-500 text-sm">Upcoming</span>
            <span className="text-2xl">📅</span>
          </div>
          <p className="text-2xl font-bold text-blue-600">{upcomingCount}</p>
          <p className="text-xs text-gray-500">events coming up</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-500 text-sm">Confirmed</span>
            <span className="text-2xl">✅</span>
          </div>
          <p className="text-2xl font-bold text-green-600">{confirmedCount}</p>
          <p className="text-xs text-gray-500">confirmed spots</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-500 text-sm">Attended</span>
            <span className="text-2xl">🏆</span>
          </div>
          <p className="text-2xl font-bold text-purple-600">{pastCount}</p>
          <p className="text-xs text-gray-500">past events</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <span className="text-sm text-gray-500 mr-2">Time:</span>
            <div className="inline-flex gap-1">
              {[
                { value: 'all', label: 'All' },
                { value: 'upcoming', label: 'Upcoming' },
                { value: 'past', label: 'Past' },
              ].map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setFilter(opt.value as any)}
                  className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                    filter === opt.value 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <span className="text-sm text-gray-500 mr-2">Type:</span>
            <div className="inline-flex gap-1">
              {[
                { value: 'all', label: 'All Types' },
                { value: 'HACKATHON', label: '💻 Hackathons' },
                { value: 'CONFERENCE', label: '🎤 Conferences' },
                { value: 'WORKSHOP', label: '🛠️ Workshops' },
                { value: 'MEETUP', label: '🤝 Meetups' },
              ].map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setTypeFilter(opt.value)}
                  className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                    typeFilter === opt.value 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Registration List */}
      {filteredRegistrations.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="text-6xl mb-4">🎫</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {registrations.length === 0 ? "No registrations yet" : "No matching registrations"}
          </h3>
          <p className="text-gray-600 mb-6">
            {registrations.length === 0 
              ? "You haven't registered for any events yet. Start exploring!"
              : "Try adjusting your filters to see more events."}
          </p>
          <Link
            href="/events"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Browse Events
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRegistrations.map(registration => {
            const eventDate = new Date(registration.event.startDate);
            const endDate = new Date(registration.event.endDate);
            const isPast = eventDate < new Date();
            const isOngoing = new Date() >= eventDate && new Date() <= endDate;
            
            return (
              <div 
                key={registration.id} 
                className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow ${
                  isPast ? 'opacity-75' : ''
                }`}
              >
                <div className="flex flex-col md:flex-row">
                  {/* Event Image/Gradient */}
                  <div className="md:w-48 h-32 md:h-auto relative">
                    {registration.event.imageUrl ? (
                      <img 
                        src={registration.event.imageUrl} 
                        alt={registration.event.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className={`w-full h-full ${
                        registration.event.type === 'HACKATHON' ? 'bg-gradient-to-br from-purple-500 to-pink-500' :
                        registration.event.type === 'CONFERENCE' ? 'bg-gradient-to-br from-blue-500 to-cyan-500' :
                        registration.event.type === 'WORKSHOP' ? 'bg-gradient-to-br from-orange-500 to-yellow-500' :
                        'bg-gradient-to-br from-green-500 to-teal-500'
                      } flex items-center justify-center`}>
                        <span className="text-4xl">{typeEmojis[registration.event.type]}</span>
                      </div>
                    )}
                    {isOngoing && (
                      <div className="absolute top-2 left-2 px-2 py-1 bg-red-500 text-white text-xs font-medium rounded-full animate-pulse">
                        🔴 LIVE NOW
                      </div>
                    )}
                  </div>

                  {/* Event Details */}
                  <div className="flex-1 p-4 md:p-6">
                    <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                      <div>
                        <Link 
                          href={`/events/${registration.event.id}`}
                          className="text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                        >
                          {registration.event.title}
                        </Link>
                        <p className="text-sm text-gray-500">by {registration.event.organizer.name}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${typeColors[registration.event.type]}`}>
                          {registration.event.type}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[registration.status]}`}>
                          {registration.status}
                        </span>
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {registration.event.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
                      <span className="flex items-center gap-1">
                        📅 {eventDate.toLocaleDateString('en-US', { 
                          weekday: 'short',
                          month: 'short', 
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        📍 {registration.event.location}
                      </span>
                      <span className="flex items-center gap-1">
                        👥 {registration.event._count.registrations} registered
                      </span>
                    </div>

                    {/* Team Info (for hackathons) */}
                    {registration.event.type === 'HACKATHON' && (
                      <div className="flex items-center gap-4 mb-4">
                        {registration.team ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                            👥 Team: {registration.team.name}
                          </span>
                        ) : registration.teamPreference === 'looking' ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">
                            🔍 Looking for team
                          </span>
                        ) : registration.teamPreference === 'solo' ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                            🧑 Participating solo
                          </span>
                        ) : null}
                      </div>
                    )}

                    {/* Skills */}
                    {registration.skills && registration.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {registration.skills.slice(0, 5).map((skill, idx) => (
                          <span key={idx} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                            {skill}
                          </span>
                        ))}
                        {registration.skills.length > 5 && (
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                            +{registration.skills.length - 5} more
                          </span>
                        )}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2">
                      <Link
                        href={`/events/${registration.event.id}`}
                        className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        View Event
                      </Link>
                      {registration.event.type === 'HACKATHON' && !registration.team && !isPast && (
                        <Link
                          href={`/events/${registration.event.id}?tab=teams`}
                          className="px-4 py-2 bg-purple-100 text-purple-700 text-sm rounded-lg hover:bg-purple-200 transition-colors"
                        >
                          Find Teammates
                        </Link>
                      )}
                      {!isPast && (
                        <Link
                          href={`/events/${registration.event.id}?tab=chat`}
                          className="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          💬 Event Chat
                        </Link>
                      )}
                    </div>
                  </div>

                  {/* Registration Date */}
                  <div className="md:w-32 p-4 md:p-6 bg-gray-50 flex flex-col items-center justify-center text-center border-t md:border-t-0 md:border-l border-gray-200">
                    <p className="text-xs text-gray-500 mb-1">Registered</p>
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(registration.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(registration.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Quick Actions */}
      <div className="mt-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <h3 className="text-xl font-semibold mb-2">Looking for more events?</h3>
        <p className="text-blue-100 mb-4">Discover hackathons, conferences, workshops, and meetups happening soon.</p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/events"
            className="px-4 py-2 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors"
          >
            Browse All Events
          </Link>
          <Link
            href="/chat"
            className="px-4 py-2 bg-white/20 text-white rounded-lg font-medium hover:bg-white/30 transition-colors"
          >
            🤖 Ask AI Assistant
          </Link>
        </div>
      </div>
    </div>
  );
}
