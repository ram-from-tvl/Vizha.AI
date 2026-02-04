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
  createdAt: string;
}

interface TeamMatcherProps {
  eventId: string;
  userSkills?: string[];
}

const skillsList = [
  'JavaScript', 'TypeScript', 'Python', 'React', 'Node.js', 'Machine Learning',
  'AI/LLM', 'Backend', 'Frontend', 'DevOps', 'Mobile', 'Design', 'UI/UX',
  'Blockchain', 'Data Science', 'Security', 'Cloud', 'Database'
];

export function TeamMatcher({ eventId, userSkills = [] }: TeamMatcherProps) {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSkills, setSelectedSkills] = useState<string[]>(userSkills);
  const [matches, setMatches] = useState<Participant[]>([]);
  const [findingMatches, setFindingMatches] = useState(false);

  useEffect(() => {
    fetchParticipants();
  }, [eventId]);

  const fetchParticipants = async () => {
    try {
      const response = await fetch(`/api/events/${eventId}/register`);
      const data = await response.json();
      if (data.registrations) {
        setParticipants(data.registrations.filter((r: any) => !r.teamId));
      }
    } catch (err) {
      console.error('Failed to fetch participants');
    } finally {
      setLoading(false);
    }
  };

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev =>
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  const findMatches = async () => {
    setFindingMatches(true);
    
    // Simulate AI matching - in real app this would call an AI endpoint
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // For demo, just shuffle and return some participants
    const shuffled = [...participants].sort(() => Math.random() - 0.5);
    setMatches(shuffled.slice(0, Math.min(5, shuffled.length)));
    setFindingMatches(false);
  };

  if (loading) {
    return (
      <div className="card p-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="flex flex-wrap gap-2 mb-6">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-8 bg-gray-200 rounded w-20"></div>
          ))}
        </div>
        <div className="h-10 bg-gray-200 rounded w-32"></div>
      </div>
    );
  }

  return (
    <div className="card p-6">
      <h3 className="text-xl font-semibold mb-4">🤝 AI Team Matcher</h3>
      
      <div className="mb-6">
        <p className="text-gray-600 mb-3">Select your skills to find compatible teammates:</p>
        <div className="flex flex-wrap gap-2">
          {skillsList.map(skill => (
            <button
              key={skill}
              onClick={() => toggleSkill(skill)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                selectedSkills.includes(skill)
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {skill}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={findMatches}
        disabled={selectedSkills.length === 0 || findingMatches}
        className="btn-primary mb-6 flex items-center gap-2"
      >
        {findingMatches ? (
          <>
            <span className="animate-spin">⚙️</span>
            Finding matches...
          </>
        ) : (
          <>
            🔍 Find Teammates
          </>
        )}
      </button>

      {matches.length > 0 && (
        <div className="border-t pt-6">
          <h4 className="font-semibold mb-4">🎯 Suggested Teammates</h4>
          <div className="space-y-4">
            {matches.map(participant => (
              <div key={participant.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                    {participant.user.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium">{participant.user.name}</p>
                    <p className="text-sm text-gray-500">{participant.user.email}</p>
                  </div>
                </div>
                <button className="btn-secondary text-sm">
                  Send Invite
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {!matches.length && participants.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No participants looking for teams yet.</p>
          <p className="text-sm">Be the first to register!</p>
        </div>
      )}
    </div>
  );
}