'use client';

import React from 'react';

interface Prize {
  rank: number;
  title: string;
  description: string;
  value: number;
  currency: string;
}

interface PrizeDisplayProps {
  prizes: Prize[];
}

const rankEmojis: Record<number, string> = {
  1: '🥇',
  2: '🥈',
  3: '🥉'
};

const rankColors: Record<number, string> = {
  1: 'from-yellow-400 to-amber-500',
  2: 'from-gray-300 to-gray-400',
  3: 'from-amber-600 to-amber-700'
};

export function PrizeDisplay({ prizes }: PrizeDisplayProps) {
  if (!prizes || prizes.length === 0) {
    return (
      <div className="card p-8 text-center">
        <div className="text-4xl mb-4">🏆</div>
        <h3 className="text-lg font-semibold mb-2">Prizes Coming Soon</h3>
        <p className="text-gray-500">Prize details will be announced.</p>
      </div>
    );
  }

  const sortedPrizes = [...prizes].sort((a, b) => a.rank - b.rank);
  const totalPrizeValue = prizes.reduce((sum, p) => sum + p.value, 0);

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold">🏆 Prizes</h3>
        <span className="text-lg font-bold text-green-600">
          Total: ${totalPrizeValue.toLocaleString()}
        </span>
      </div>
      
      <div className="space-y-4">
        {sortedPrizes.map((prize) => {
          const emoji = rankEmojis[prize.rank] || '🏅';
          const gradient = rankColors[prize.rank] || 'from-blue-500 to-blue-600';
          
          return (
            <div
              key={prize.rank}
              className={`relative overflow-hidden rounded-xl p-6 bg-gradient-to-r ${gradient} text-white`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-4xl">{emoji}</span>
                  <div>
                    <h4 className="text-lg font-bold">{prize.title}</h4>
                    <p className="text-white/80 text-sm">{prize.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold">
                    ${prize.value.toLocaleString()}
                  </p>
                  <p className="text-white/70 text-sm">{prize.currency}</p>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full"></div>
              <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/5 rounded-full"></div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          💡 <strong>Tip:</strong> Prizes are awarded based on judging criteria including innovation, 
          technical complexity, and presentation quality.
        </p>
      </div>
    </div>
  );
}