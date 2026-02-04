'use client';

import React, { useState, useEffect } from 'react';
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
  tags: string[];
  _count?: { registrations: number };
}

export default function HomePage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/events');
        const data = await response.json();
        setEvents(data.events || []);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Hero Section */}
      <div className="text-center py-12 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          AI-Powered Event Management
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Discover hackathons, organize events, find teammates, and build amazing projects
        </p>
        
        {/* Quick Action Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto px-4">
          <Link
            href="/events"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2"
          >
            🔍 Find Events
          </Link>
          <Link
            href="/events/create"
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2"
          >
            ➕ Create Event
          </Link>
          <Link
            href="/dashboard"
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2"
          >
            👥 Dashboard
          </Link>
          <Link
            href="/login"
            className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2"
          >
            🔐 Login
          </Link>
        </div>
      </div>

      {/* Featured Events Section */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Featured Events</h2>
          <Link href="/events" className="text-blue-600 hover:text-blue-800 font-medium">
            View All →
          </Link>
        </div>
        
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading events...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No events found. Be the first to create one!</p>
            <Link
              href="/events/create"
              className="mt-4 inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
            >
              Create Event
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {events.slice(0, 4).map((event) => (
              <div key={event.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">{event.title}</h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    event.price === 0 ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {event.price === 0 ? 'FREE' : `$${event.price}`}
                  </span>
                </div>
                
                <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
                
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                  <span>📅 {new Date(event.startDate).toLocaleDateString()}</span>
                  <span>📍 {event.location}</span>
                  <span>👥 {event._count?.registrations || 0}/{event.capacity}</span>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {event.tags?.slice(0, 3).map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="flex gap-2">
                  <Link
                    href={`/events/${event.id}`}
                    className="flex-1 text-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Features Overview */}
      <div className="grid md:grid-cols-3 gap-8">
        <div className="text-center p-6 bg-white rounded-xl shadow-lg">
          <div className="text-4xl mb-4">🤖</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">AI-Powered</h3>
          <p className="text-gray-600">Smart recommendations and team matching powered by AI</p>
        </div>
        <div className="text-center p-6 bg-white rounded-xl shadow-lg">
          <div className="text-4xl mb-4">👥</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Team Formation</h3>
          <p className="text-gray-600">Find perfect teammates based on skills and interests</p>
        </div>
        <div className="text-center p-6 bg-white rounded-xl shadow-lg">
          <div className="text-4xl mb-4">📊</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Analytics</h3>
          <p className="text-gray-600">Track registrations, engagement, and event performance</p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-8 text-white">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold">{events.length}+</div>
            <div className="text-blue-100">Active Events</div>
          </div>
          <div>
            <div className="text-3xl font-bold">500+</div>
            <div className="text-blue-100">Participants</div>
          </div>
          <div>
            <div className="text-3xl font-bold">100+</div>
            <div className="text-blue-100">Teams Formed</div>
          </div>
          <div>
            <div className="text-3xl font-bold">50+</div>
            <div className="text-blue-100">Organizers</div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center py-12 bg-white rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to get started?</h2>
        <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
          Join our community of innovators, creators, and problem solvers. 
          Participate in hackathons, organize events, or find your dream team.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            href="/register"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-200"
          >
            Create Account
          </Link>
          <Link
            href="/events"
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-8 py-3 rounded-lg font-medium transition-colors duration-200"
          >
            Browse Events
          </Link>
        </div>
      </div>
    </div>
  );
}
