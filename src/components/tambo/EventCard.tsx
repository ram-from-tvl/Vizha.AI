'use client';

import React from 'react';
import { useTamboComponentState, TamboPropStreamProvider, useTamboStreamStatus } from '@tambo-ai/react';
import { Event } from '@/types';

interface EventCardProps {
  event: Event;
  showActions?: boolean;
  variant?: 'default' | 'compact' | 'detailed';
}

export function EventCard({ event, showActions = true, variant = 'default' }: EventCardProps) {
  const [isRegistered, setIsRegistered] = useTamboComponentState(
    `event-${event.id}-registration`,
    false
  );
  
  const [favorited, setFavorited] = useTamboComponentState(
    `event-${event.id}-favorite`,
    false
  );

  const { streamStatus } = useTamboStreamStatus();

  const handleRegister = () => {
    setIsRegistered(true);
    // Trigger notification to organizer
    // This would integrate with the notification tool
  };

  const handleFavorite = () => {
    setFavorited(!favorited);
  };

  if (variant === 'compact') {
    return (
      <TamboPropStreamProvider>
        <TamboPropStreamProvider.Success>
          <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-gray-900 text-lg">{event.title}</h3>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                event.price === 0 ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
              }`}>
                {event.price === 0 ? 'FREE' : `${event.price} ${event.currency}`}
              </span>
            </div>
            
            <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
              <span>📅 {new Date(event.startDate).toLocaleDateString()}</span>
              <span>📍 {event.location}</span>
            </div>
            
            {showActions && (
              <div className="flex gap-2">
                <button
                  onClick={handleRegister}
                  disabled={isRegistered}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isRegistered 
                      ? 'bg-green-100 text-green-800 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {isRegistered ? '✅ Registered' : 'Register'}
                </button>
                <button
                  onClick={handleFavorite}
                  className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                    favorited 
                      ? 'bg-red-100 text-red-600'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {favorited ? '❤️' : '🤍'}
                </button>
              </div>
            )}
          </div>
        </TamboPropStreamProvider.Success>
        
        <TamboPropStreamProvider.Streaming>
          <div className="bg-white border border-gray-200 rounded-lg p-4 animate-pulse">
            <div className="h-6 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded mb-3 w-3/4"></div>
            <div className="flex gap-2">
              <div className="h-8 bg-gray-200 rounded w-20"></div>
              <div className="h-8 bg-gray-200 rounded w-10"></div>
            </div>
          </div>
        </TamboPropStreamProvider.Streaming>
      </TamboPropStreamProvider>
    );
  }

  if (variant === 'detailed') {
    return (
      <TamboPropStreamProvider>
        <TamboPropStreamProvider.Success>
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{event.title}</h2>
                  <div className="flex items-center gap-4 text-gray-600">
                    <span className="text-lg font-medium">{event.type.toUpperCase()}</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      event.status === 'published' ? 'bg-green-100 text-green-800' :
                      event.status === 'ongoing' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {event.status}
                    </span>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">
                    {event.price === 0 ? 'FREE' : `$${event.price}`}
                  </div>
                  {event.price > 0 && (
                    <div className="text-sm text-gray-500">{event.currency}</div>
                  )}
                </div>
              </div>

              <p className="text-gray-700 text-lg mb-6">{event.description}</p>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">📅 Schedule</h4>
                  <p className="text-gray-600">
                    {new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}
                  </p>
                  <p className="text-gray-500 text-sm">
                    {new Date(event.startDate).toLocaleTimeString()} - {new Date(event.endDate).toLocaleTimeString()}
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">📍 Location</h4>
                  <p className="text-gray-600">{event.location}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">👥 Participants</h4>
                  <div className="flex items-center gap-2">
                    <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                      {event.registeredCount} / {event.capacity}
                    </div>
                    <div className="text-gray-500 text-sm">
                      {Math.round((event.registeredCount / event.capacity) * 100)}% full
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">🏆 Organizer</h4>
                  <div className="flex items-center gap-2">
                    {event.organizer.avatar && (
                      <img 
                        src={event.organizer.avatar} 
                        alt={event.organizer.name}
                        className="w-8 h-8 rounded-full"
                      />
                    )}
                    <span className="text-gray-600">{event.organizer.name}</span>
                  </div>
                </div>
              </div>

              {event.tags && event.tags.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-2">🏷️ Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {event.tags.map((tag, index) => (
                      <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {event.requirements && event.requirements.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-2">📋 Requirements</h4>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    {event.requirements.map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                </div>
              )}

              {event.prizes && event.prizes.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-2">🎁 Prizes</h4>
                  <div className="grid gap-3">
                    {event.prizes.map((prize, index) => (
                      <div key={index} className="flex justify-between items-center bg-yellow-50 p-3 rounded-lg">
                        <div>
                          <span className="font-medium text-yellow-800">#{prize.rank} {prize.title}</span>
                          <p className="text-yellow-700 text-sm">{prize.description}</p>
                        </div>
                        <div className="text-yellow-800 font-bold">
                          ${prize.value.toLocaleString()} {prize.currency}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {showActions && (
                <div className="flex gap-4">
                  <button
                    onClick={handleRegister}
                    disabled={isRegistered || event.registeredCount >= event.capacity}
                    className={`flex-1 py-3 px-6 rounded-lg font-medium transition-colors ${
                      isRegistered 
                        ? 'bg-green-100 text-green-800 cursor-not-allowed'
                        : event.registeredCount >= event.capacity
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    {isRegistered ? '✅ Registered' : 
                     event.registeredCount >= event.capacity ? '❌ Full' : 
                     '📝 Register Now'}
                  </button>
                  
                  <button
                    onClick={handleFavorite}
                    className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                      favorited 
                        ? 'bg-red-100 text-red-600'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {favorited ? '❤️ Favorited' : '🤍 Add to Favorites'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </TamboPropStreamProvider.Success>
        
        <TamboPropStreamProvider.Streaming>
          <div className="bg-white rounded-xl shadow-lg p-8 animate-pulse">
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-24 bg-gray-200 rounded"></div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="h-16 bg-gray-200 rounded"></div>
                <div className="h-16 bg-gray-200 rounded"></div>
              </div>
              <div className="flex gap-4">
                <div className="h-12 bg-gray-200 rounded flex-1"></div>
                <div className="h-12 bg-gray-200 rounded w-32"></div>
              </div>
            </div>
          </div>
        </TamboPropStreamProvider.Streaming>
      </TamboPropStreamProvider>
    );
  }

  // Default variant
  return (
    <TamboPropStreamProvider>
      <TamboPropStreamProvider.Success>
        <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-semibold text-gray-900">{event.title}</h3>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
              event.price === 0 ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
            }`}>
              {event.price === 0 ? 'FREE' : `$${event.price}`}
            </span>
          </div>
          
          <p className="text-gray-600 mb-4 line-clamp-3">{event.description}</p>
          
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
            <span>📅 {new Date(event.startDate).toLocaleDateString()}</span>
            <span>📍 {event.location}</span>
            <span>👥 {event.registeredCount}/{event.capacity}</span>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {event.tags.slice(0, 3).map((tag, index) => (
              <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                {tag}
              </span>
            ))}
            {event.tags.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-full">
                +{event.tags.length - 3} more
              </span>
            )}
          </div>
          
          {showActions && (
            <div className="flex gap-2">
              <button
                onClick={handleRegister}
                disabled={isRegistered}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                  isRegistered 
                    ? 'bg-green-100 text-green-800 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {isRegistered ? '✅ Registered' : 'Register'}
              </button>
              <button
                onClick={handleFavorite}
                className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                  favorited 
                    ? 'bg-red-100 text-red-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {favorited ? '❤️' : '🤍'}
              </button>
            </div>
          )}
        </div>
      </TamboPropStreamProvider.Success>
      
      <TamboPropStreamProvider.Streaming>
        <div className="bg-white border border-gray-200 rounded-lg p-6 animate-pulse">
          <div className="space-y-4">
            <div className="flex justify-between">
              <div className="h-6 bg-gray-200 rounded w-2/3"></div>
              <div className="h-6 bg-gray-200 rounded w-16"></div>
            </div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="flex gap-2">
              <div className="h-8 bg-gray-200 rounded flex-1"></div>
              <div className="h-8 bg-gray-200 rounded w-12"></div>
            </div>
          </div>
        </div>
      </TamboPropStreamProvider.Streaming>
      
      <TamboPropStreamProvider.Pending>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="text-center text-gray-500">
            <div className="animate-spin h-8 w-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-2"></div>
            <p>Loading event information...</p>
          </div>
        </div>
      </TamboPropStreamProvider.Pending>
    </TamboPropStreamProvider>
  );
}