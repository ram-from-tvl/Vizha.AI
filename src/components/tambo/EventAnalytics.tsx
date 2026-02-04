'use client';

import React, { useEffect, useState } from 'react';

interface AnalyticsData {
  totalEvents: number;
  totalRegistrations: number;
  totalRevenue: number;
  registrationTrend: { date: string; count: number }[];
  eventsByType: { type: string; count: number }[];
  registrationsByStatus: { status: string; count: number }[];
}

interface EventAnalyticsProps {
  eventId?: string;
  organizerId?: string;
}

export function EventAnalytics({ eventId, organizerId }: EventAnalyticsProps) {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  useEffect(() => {
    fetchAnalytics();
  }, [eventId, organizerId, timeRange]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      // In real app, this would be an API call
      // For now, generate mock data
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const mockData: AnalyticsData = {
        totalEvents: 12,
        totalRegistrations: 847,
        totalRevenue: 42350,
        registrationTrend: Array.from({ length: 7 }, (_, i) => ({
          date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          count: Math.floor(Math.random() * 50) + 20
        })),
        eventsByType: [
          { type: 'HACKATHON', count: 5 },
          { type: 'CONFERENCE', count: 3 },
          { type: 'WORKSHOP', count: 3 },
          { type: 'MEETUP', count: 1 }
        ],
        registrationsByStatus: [
          { status: 'CONFIRMED', count: 654 },
          { status: 'PENDING', count: 143 },
          { status: 'CANCELLED', count: 50 }
        ]
      };
      
      setAnalytics(mockData);
    } catch (err) {
      console.error('Failed to fetch analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="card p-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-24 bg-gray-200 rounded"></div>
          ))}
        </div>
        <div className="h-48 bg-gray-200 rounded"></div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="card p-8 text-center">
        <p className="text-gray-500">No analytics data available</p>
      </div>
    );
  }

  const maxCount = Math.max(...analytics.registrationTrend.map(d => d.count));

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold">📊 Analytics Dashboard</h3>
        <div className="flex gap-2">
          {(['7d', '30d', '90d'] as const).map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                timeRange === range ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : '90 Days'}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <p className="text-blue-100 text-sm">Total Events</p>
          <p className="text-3xl font-bold">{analytics.totalEvents}</p>
          <p className="text-blue-200 text-sm mt-1">↑ 12% from last period</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
          <p className="text-green-100 text-sm">Total Registrations</p>
          <p className="text-3xl font-bold">{analytics.totalRegistrations.toLocaleString()}</p>
          <p className="text-green-200 text-sm mt-1">↑ 23% from last period</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <p className="text-purple-100 text-sm">Total Revenue</p>
          <p className="text-3xl font-bold">${analytics.totalRevenue.toLocaleString()}</p>
          <p className="text-purple-200 text-sm mt-1">↑ 18% from last period</p>
        </div>
      </div>

      {/* Registration Trend Chart */}
      <div className="mb-8">
        <h4 className="font-medium mb-4">Registration Trend</h4>
        <div className="flex items-end gap-2 h-48 bg-gray-50 rounded-lg p-4">
          {analytics.registrationTrend.map((data, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <div
                className="w-full bg-blue-500 rounded-t transition-all hover:bg-blue-600"
                style={{ height: `${(data.count / maxCount) * 100}%` }}
                title={`${data.count} registrations`}
              ></div>
              <span className="text-xs text-gray-500">{data.date}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Distribution Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-medium mb-4">Events by Type</h4>
          <div className="space-y-3">
            {analytics.eventsByType.map(item => (
              <div key={item.type} className="flex items-center gap-3">
                <span className="w-24 text-sm text-gray-600">
                  {item.type.charAt(0) + item.type.slice(1).toLowerCase()}
                </span>
                <div className="flex-1 bg-gray-200 rounded-full h-4">
                  <div
                    className={`h-4 rounded-full ${
                      item.type === 'HACKATHON' ? 'bg-purple-500' :
                      item.type === 'CONFERENCE' ? 'bg-blue-500' :
                      item.type === 'WORKSHOP' ? 'bg-orange-500' :
                      'bg-green-500'
                    }`}
                    style={{ width: `${(item.count / analytics.totalEvents) * 100}%` }}
                  ></div>
                </div>
                <span className="w-8 text-sm font-medium">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-4">Registration Status</h4>
          <div className="space-y-3">
            {analytics.registrationsByStatus.map(item => (
              <div key={item.status} className="flex items-center gap-3">
                <span className="w-24 text-sm text-gray-600">{item.status}</span>
                <div className="flex-1 bg-gray-200 rounded-full h-4">
                  <div
                    className={`h-4 rounded-full ${
                      item.status === 'CONFIRMED' ? 'bg-green-500' :
                      item.status === 'PENDING' ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}
                    style={{ width: `${(item.count / analytics.totalRegistrations) * 100}%` }}
                  ></div>
                </div>
                <span className="w-12 text-sm font-medium">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}