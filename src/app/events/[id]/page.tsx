'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { EventSchedule } from '@/components/tambo/EventSchedule';
import { PrizeDisplay } from '@/components/tambo/PrizeDisplay';
import { ParticipantList } from '@/components/tambo/ParticipantList';
import { TeamMatcher } from '@/components/tambo/TeamMatcher';

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
    email: string;
  };
  prizes: Array<{
    rank: number;
    title: string;
    description: string;
    value: number;
    currency: string;
  }>;
  scheduleItems: Array<{
    id: string;
    title: string;
    description?: string;
    startTime: string;
    endTime: string;
    location?: string;
    speaker?: string;
  }>;
  _count: {
    registrations: number;
    teams: number;
  };
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;
  
  const [event, setEvent] = useState<Event | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'schedule' | 'participants' | 'teams'>('overview');
  const [registering, setRegistering] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [showRegModal, setShowRegModal] = useState(false);
  const [regForm, setRegForm] = useState({
    teamPreference: 'looking',
    skills: '',
    motivation: '',
    specialRequests: '',
  });

  useEffect(() => {
    if (eventId) {
      fetchEvent();
      checkAuth();
    }
  }, [eventId]);

  const fetchEvent = async () => {
    try {
      const response = await fetch(`/api/events/${eventId}`);
      const data = await response.json();
      if (data.error) {
        setError(data.error);
      } else {
        setEvent(data.event);
      }
    } catch (err) {
      setError('Failed to load event');
    } finally {
      setLoading(false);
    }
  };

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const data = await response.json();
        if (data.user) {
          setUser(data.user);
          const regResponse = await fetch(`/api/events/${eventId}/register`);
          const regData = await regResponse.json();
          const userReg = regData.registrations?.find((r: any) => r.userId === data.user.id);
          setIsRegistered(!!userReg);
        }
      }
    } catch (err) {
      // User not logged in
    }
  };

  const handleRegister = async () => {
    if (!user) {
      router.push(`/login?redirect=/events/${eventId}`);
      return;
    }
    setShowRegModal(true);
  };

  const submitRegistration = async () => {
    setRegistering(true);
    try {
      const response = await fetch(`/api/events/${eventId}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teamPreference: regForm.teamPreference,
          skills: regForm.skills.split(',').map(s => s.trim()).filter(Boolean),
          motivation: regForm.motivation,
          specialRequests: regForm.specialRequests,
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setIsRegistered(true);
        setShowRegModal(false);
        fetchEvent();
        
        if (data.checkoutUrl) {
          window.location.href = data.checkoutUrl;
        }
      } else {
        alert(data.error || 'Registration failed');
      }
    } catch (err) {
      alert('An error occurred');
    } finally {
      setRegistering(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto animate-pulse">
        <div className="h-64 bg-gray-200 rounded-xl mb-8"></div>
        <div className="h-10 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-8"></div>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="h-40 bg-gray-200 rounded"></div>
          <div className="h-40 bg-gray-200 rounded"></div>
          <div className="h-40 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <div className="text-6xl mb-4">😢</div>
          <h2 className="text-2xl font-bold mb-2">Event Not Found</h2>
          <p className="text-gray-600 mb-6">{error || "The event you're looking for doesn't exist."}</p>
          <Link href="/events" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Browse Events
          </Link>
        </div>
      </div>
    );
  }

  const isFull = event._count.registrations >= event.capacity;

  return (
    <div className="max-w-6xl mx-auto">
      {/* Registration Modal */}
      {showRegModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Register for {event.title}</h2>
                <button onClick={() => setShowRegModal(false)} className="text-gray-500 hover:text-gray-700 text-2xl">
                  ×
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              {event.type === 'HACKATHON' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Team Preference</label>
                  <select
                    value={regForm.teamPreference}
                    onChange={(e) => setRegForm(prev => ({ ...prev, teamPreference: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="looking">Looking for a team</option>
                    <option value="have_team">I have a team</option>
                    <option value="solo">Participating solo</option>
                  </select>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Skills (comma separated)</label>
                <input
                  type="text"
                  value={regForm.skills}
                  onChange={(e) => setRegForm(prev => ({ ...prev, skills: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., React, Python, Machine Learning"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Why do you want to attend?</label>
                <textarea
                  value={regForm.motivation}
                  onChange={(e) => setRegForm(prev => ({ ...prev, motivation: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Tell us your motivation..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Special Requests (optional)</label>
                <textarea
                  value={regForm.specialRequests}
                  onChange={(e) => setRegForm(prev => ({ ...prev, specialRequests: e.target.value }))}
                  rows={2}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Any dietary restrictions, accessibility needs, etc."
                />
              </div>

              {event.price > 0 && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-700">
                    💳 This is a paid event. You will be redirected to complete payment after registration.
                  </p>
                  <p className="text-2xl font-bold text-blue-800 mt-2">
                    {event.currency} {event.price}
                  </p>
                </div>
              )}
            </div>
            <div className="p-6 border-t flex justify-end gap-3">
              <button
                onClick={() => setShowRegModal(false)}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={submitRegistration}
                disabled={registering}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {registering ? 'Registering...' : event.price > 0 ? 'Continue to Payment' : 'Complete Registration'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="relative rounded-xl overflow-hidden mb-8">
        {event.imageUrl ? (
          <img src={event.imageUrl} alt={event.title} className="w-full h-64 object-cover" />
        ) : (
          <div className="w-full h-64 bg-gradient-to-br from-blue-600 to-purple-600"></div>
        )}
        <div className="absolute inset-0 bg-black/40 flex items-end">
          <div className="p-8 text-white">
            <span className={`inline-block px-3 py-1 text-sm rounded-full mb-4 ${
              event.type === 'HACKATHON' ? 'bg-purple-500' :
              event.type === 'CONFERENCE' ? 'bg-blue-500' :
              event.type === 'WORKSHOP' ? 'bg-orange-500' :
              'bg-green-500'
            }`}>
              {event.type}
            </span>
            <h1 className="text-4xl font-bold mb-2">{event.title}</h1>
            <p className="text-white/80">by {event.organizer.name}</p>
          </div>
        </div>
      </div>

      {/* Quick Info Bar */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="grid md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-xl">📅</div>
            <div>
              <p className="text-sm text-gray-500">Date</p>
              <p className="font-medium">
                {new Date(event.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(event.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-xl">📍</div>
            <div>
              <p className="text-sm text-gray-500">Location</p>
              <p className="font-medium">{event.location}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-xl">👥</div>
            <div>
              <p className="text-sm text-gray-500">Participants</p>
              <p className="font-medium">{event._count.registrations} / {event.capacity}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center text-xl">💰</div>
            <div>
              <p className="text-sm text-gray-500">Price</p>
              <p className="font-medium text-lg">{event.price === 0 ? 'FREE' : `$${event.price}`}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {['overview', 'schedule', 'participants', 'teams'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4">About this Event</h2>
                <p className="text-gray-600 whitespace-pre-wrap">{event.description}</p>
                
                {event.tags && event.tags.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {event.tags.map((tag, i) => (
                        <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">{tag}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {event.prizes && event.prizes.length > 0 && (
                <PrizeDisplay prizes={event.prizes} />
              )}
            </div>
          )}

          {activeTab === 'schedule' && (
            <EventSchedule eventId={eventId} scheduleItems={event.scheduleItems} />
          )}

          {activeTab === 'participants' && (
            <ParticipantList eventId={eventId} showTeams={event.type === 'HACKATHON'} />
          )}

          {activeTab === 'teams' && event.type === 'HACKATHON' && (
            <TeamMatcher eventId={eventId} />
          )}
        </div>

        {/* Right Column - Registration */}
        <div>
          <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
            <h3 className="text-xl font-semibold mb-4">Register Now</h3>
            
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Spots filled</span>
                <span className="font-medium">{event._count.registrations}/{event.capacity}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${isFull ? 'bg-red-500' : 'bg-green-500'}`}
                  style={{ width: `${Math.min((event._count.registrations / event.capacity) * 100, 100)}%` }}
                ></div>
              </div>
            </div>

            <div className="text-center mb-6">
              <p className="text-3xl font-bold text-blue-600">
                {event.price === 0 ? 'FREE' : `$${event.price}`}
              </p>
              {event.price > 0 && <p className="text-sm text-gray-500">per person</p>}
            </div>

            {isRegistered ? (
              <div className="bg-green-50 text-green-700 p-4 rounded-lg text-center">
                <span className="text-xl mr-2">✅</span>
                You are registered for this event!
              </div>
            ) : (
              <button
                onClick={handleRegister}
                disabled={registering || isFull}
                className="w-full py-3 text-lg bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {registering ? 'Registering...' : isFull ? 'Event Full - Join Waitlist' : 'Register Now'}
              </button>
            )}

            {!user && (
              <p className="text-sm text-gray-500 text-center mt-3">
                <Link href="/login" className="text-blue-600 hover:underline">Login</Link> or{' '}
                <Link href="/register" className="text-blue-600 hover:underline">Register</Link> to sign up
              </p>
            )}

            <div className="mt-6 pt-6 border-t">
              <h4 className="font-medium mb-3">Organizer</h4>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                  {event.organizer.name.charAt(0)}
                </div>
                <div>
                  <p className="font-medium">{event.organizer.name}</p>
                  <p className="text-sm text-gray-500">{event.organizer.email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
