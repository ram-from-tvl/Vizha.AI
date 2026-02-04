'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { EventAnalytics } from '@/components/tambo/EventAnalytics';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'ORGANIZER' | 'ATTENDEE';
}

interface Event {
  id: string;
  title: string;
  type: string;
  status: string;
  startDate: string;
  location: string;
  price: number;
  _count: {
    registrations: number;
  };
}

interface Registration {
  id: string;
  status: string;
  createdAt: string;
  event: Event;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (!response.ok) {
        router.push('/login');
        return;
      }
      const data = await response.json();
      if (!data.user) {
        router.push('/login');
        return;
      }
      setUser(data.user);
      
      if (data.user.role === 'ORGANIZER') {
        fetchMyEvents();
      } else {
        fetchMyRegistrations();
      }
    } catch (err) {
      router.push('/login');
    }
  };

  const fetchMyEvents = async () => {
    try {
      const response = await fetch('/api/events?organizer=me');
      const data = await response.json();
      setEvents(data.events || []);
    } catch (err) {
      console.error('Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  const fetchMyRegistrations = async () => {
    try {
      const response = await fetch('/api/user/registrations');
      const data = await response.json();
      setRegistrations(data.registrations || []);
      
      // Also fetch recommended events
      const eventsResponse = await fetch('/api/events?limit=6');
      const eventsData = await eventsResponse.json();
      setEvents(eventsData.events || []);
    } catch (err) {
      console.error('Failed to fetch registrations');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto animate-pulse">
        <div className="h-10 bg-gray-200 rounded w-1/3 mb-8"></div>
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
          ))}
        </div>
        <div className="h-64 bg-gray-200 rounded-xl"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Organizer Dashboard
  if (user.role === 'ORGANIZER') {
    return (
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Welcome back, {user.name}</p>
          </div>
          <Link href="/events/create" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            + Create Event
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-500">Total Events</span>
              <span className="text-2xl">📅</span>
            </div>
            <p className="text-3xl font-bold">{events.length}</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-500">Active Events</span>
              <span className="text-2xl">🟢</span>
            </div>
            <p className="text-3xl font-bold">
              {events.filter(e => e.status === 'PUBLISHED' || e.status === 'ONGOING').length}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-500">Total Registrations</span>
              <span className="text-2xl">👥</span>
            </div>
            <p className="text-3xl font-bold">
              {events.reduce((sum, e) => sum + (e._count?.registrations || 0), 0)}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-500">Upcoming</span>
              <span className="text-2xl">🚀</span>
            </div>
            <p className="text-3xl font-bold">
              {events.filter(e => new Date(e.startDate) > new Date()).length}
            </p>
          </div>
        </div>

        {/* Analytics */}
        <EventAnalytics organizerId={user.id} />

        {/* My Events */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">My Events</h2>
          {events.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <div className="text-4xl mb-4">📭</div>
              <p className="mb-4">You have not created any events yet</p>
              <Link href="/events/create" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Create Your First Event
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Event</th>
                    <th className="text-left py-3 px-4">Type</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4">Date</th>
                    <th className="text-left py-3 px-4">Registrations</th>
                    <th className="text-left py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map(event => (
                    <tr key={event.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <Link href={`/events/${event.id}`} className="font-medium hover:text-blue-600">
                          {event.title}
                        </Link>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          event.type === 'HACKATHON' ? 'bg-purple-100 text-purple-700' :
                          event.type === 'CONFERENCE' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {event.type}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          event.status === 'PUBLISHED' ? 'bg-green-100 text-green-700' :
                          event.status === 'DRAFT' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {event.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {new Date(event.startDate).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        {event._count?.registrations || 0}
                      </td>
                      <td className="py-3 px-4">
                        <Link href={`/events/${event.id}`} className="text-blue-600 hover:underline text-sm">
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Attendee Dashboard
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user.name}</p>
        </div>
        <Link href="/events" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Browse Events
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-500">Registered Events</span>
            <span className="text-2xl">🎫</span>
          </div>
          <p className="text-3xl font-bold">{registrations.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-500">Upcoming Events</span>
            <span className="text-2xl">📅</span>
          </div>
          <p className="text-3xl font-bold">
            {registrations.filter(r => new Date(r.event.startDate) > new Date()).length}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-500">Completed Events</span>
            <span className="text-2xl">✅</span>
          </div>
          <p className="text-3xl font-bold">
            {registrations.filter(r => new Date(r.event.startDate) <= new Date()).length}
          </p>
        </div>
      </div>

      {/* My Registrations */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">My Registrations</h2>
        {registrations.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <div className="text-4xl mb-4">📭</div>
            <p className="mb-4">You have not registered for any events yet</p>
            <Link href="/events" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Browse Events
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {registrations.map(reg => (
              <div key={reg.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div>
                  <h3 className="font-medium">{reg.event.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      reg.event.type === 'HACKATHON' ? 'bg-purple-100 text-purple-700' :
                      reg.event.type === 'CONFERENCE' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {reg.event.type}
                    </span>
                    <span>📅 {new Date(reg.event.startDate).toLocaleDateString()}</span>
                    <span>📍 {reg.event.location}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    reg.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' :
                    reg.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {reg.status}
                  </span>
                  <Link href={`/events/${reg.event.id}`} className="text-blue-600 hover:underline text-sm">
                    View →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recommended Events */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Recommended For You</h2>
        {events.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No events available at the moment</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.slice(0, 6).map(event => (
              <Link 
                key={event.id} 
                href={`/events/${event.id}`}
                className="p-4 border rounded-lg hover:shadow-md transition-shadow"
              >
                <h3 className="font-medium mb-2">{event.title}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    event.type === 'HACKATHON' ? 'bg-purple-100 text-purple-700' :
                    event.type === 'CONFERENCE' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {event.type}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">📅 {new Date(event.startDate).toLocaleDateString()}</span>
                  <span className={`font-medium ${event.price === 0 ? 'text-green-600' : 'text-blue-600'}`}>
                    {event.price === 0 ? 'FREE' : `$${event.price}`}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}