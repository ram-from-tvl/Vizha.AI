'use client';

import React, { useEffect, useState } from 'react';

interface Participant {
  id: string;
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  status: string;
  teamId?: string;
  team?: {
    id: string;
    name: string;
  };
  createdAt: string;
}

interface ParticipantListProps {
  eventId: string;
  showTeams?: boolean;
}

export function ParticipantList({ eventId, showTeams = true }: ParticipantListProps) {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'with-team' | 'looking'>('all');

  useEffect(() => {
    fetchParticipants();
  }, [eventId]);

  const fetchParticipants = async () => {
    try {
      const response = await fetch(`/api/events/${eventId}/register`);
      const data = await response.json();
      if (data.error) {
        setError(data.error);
      } else {
        setParticipants(data.registrations || []);
      }
    } catch (err) {
      setError('Failed to load participants');
    } finally {
      setLoading(false);
    }
  };

  const filteredParticipants = participants.filter(p => {
    if (filter === 'with-team') return p.teamId;
    if (filter === 'looking') return !p.teamId;
    return true;
  });

  if (loading) {
    return (
      <div className="card p-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="space-y-3">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card p-6 bg-red-50">
        <p className="text-red-600">❌ {error}</p>
      </div>
    );
  }

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold">👥 Participants ({participants.length})</h3>
        {showTeams && (
          <div className="flex gap-2">
            {['all', 'with-team', 'looking'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f as any)}
                className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                  filter === f ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {f === 'all' ? 'All' : f === 'with-team' ? 'In Team' : 'Looking'}
              </button>
            ))}
          </div>
        )}
      </div>

      {filteredParticipants.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No participants found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredParticipants.map(participant => (
            <div
              key={participant.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                  {participant.user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{participant.user.name}</p>
                  <p className="text-sm text-gray-500">
                    Joined {new Date(participant.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {showTeams && (
                  participant.team ? (
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full">
                      {participant.team.name}
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-sm rounded-full">
                      Looking for team
                    </span>
                  )
                )}
                <span className={`px-2 py-1 text-xs rounded-full ${
                  participant.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' :
                  participant.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {participant.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}