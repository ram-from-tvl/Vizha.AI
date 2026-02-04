'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'ORGANIZER' | 'ATTENDEE';
  avatar?: string | null;
  bio?: string | null;
  skills: string[];
  interests: string[];
}

interface Registration {
  id: string;
  status: string;
  createdAt: string;
  event: {
    id: string;
    title: string;
    type: string;
    startDate: string;
    location: string;
  };
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    skills: '',
    interests: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
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
      setFormData({
        name: data.user.name || '',
        bio: data.user.bio || '',
        skills: (data.user.skills || []).join(', '),
        interests: (data.user.interests || []).join(', '),
      });

      // Fetch user's registrations
      const regResponse = await fetch('/api/user/registrations');
      if (regResponse.ok) {
        const regData = await regResponse.json();
        setRegistrations(regData.registrations || []);
      }
    } catch (err) {
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          bio: formData.bio,
          skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
          interests: formData.interests.split(',').map(s => s.trim()).filter(Boolean),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setEditing(false);
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to update profile');
      }
    } catch (err) {
      alert('An error occurred');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto animate-pulse">
        <div className="h-48 bg-gray-200 rounded-xl mb-8"></div>
        <div className="h-10 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="h-6 bg-gray-200 rounded w-1/2"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Profile Header */}
      <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl p-8 text-white">
        <div className="flex items-start gap-6">
          <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center text-4xl font-bold">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
            ) : (
              user.name.charAt(0).toUpperCase()
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold">{user.name}</h1>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                user.role === 'ORGANIZER' 
                  ? 'bg-purple-400/30 text-purple-100' 
                  : 'bg-green-400/30 text-green-100'
              }`}>
                {user.role === 'ORGANIZER' ? '🎯 Organizer' : '👤 Attendee'}
              </span>
            </div>
            <p className="text-white/80">{user.email}</p>
            {user.bio && <p className="mt-2 text-white/90">{user.bio}</p>}
          </div>
          <button
            onClick={() => setEditing(!editing)}
            className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
          >
            {editing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>
      </div>

      {/* Edit Form */}
      {editing && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-6">Edit Profile</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Tell us about yourself..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Skills (comma separated)</label>
              <input
                type="text"
                value={formData.skills}
                onChange={(e) => setFormData(prev => ({ ...prev, skills: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="React, Python, Machine Learning..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Interests (comma separated)</label>
              <input
                type="text"
                value={formData.interests}
                onChange={(e) => setFormData(prev => ({ ...prev, interests: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="AI, Web Development, Open Source..."
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setEditing(false)}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Skills & Interests */}
      {!editing && (user.skills?.length > 0 || user.interests?.length > 0) && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Skills & Interests</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {user.skills?.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {user.skills.map((skill, i) => (
                    <span key={i} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {user.interests?.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Interests</h3>
                <div className="flex flex-wrap gap-2">
                  {user.interests.map((interest, i) => (
                    <span key={i} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* My Registrations */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">
          {user.role === 'ORGANIZER' ? 'My Organized Events' : 'My Registrations'}
        </h2>
        {registrations.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">📭</div>
            <p className="text-gray-500 mb-4">
              {user.role === 'ORGANIZER' 
                ? "You haven't organized any events yet" 
                : "You haven't registered for any events yet"}
            </p>
            <a
              href={user.role === 'ORGANIZER' ? '/events/create' : '/events'}
              className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {user.role === 'ORGANIZER' ? 'Create Event' : 'Browse Events'}
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {registrations.map((reg) => (
              <div key={reg.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div>
                  <h3 className="font-medium">{reg.event.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                    <span>{reg.event.type}</span>
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
                  <a
                    href={`/events/${reg.event.id}`}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    View →
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
