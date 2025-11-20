import React from 'react';

interface AudioVisualizerProps {
  isPlaying: boolean;
  color?: string;
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ isPlaying, color = 'bg-white' }) => {
  const bars = 12;

  return (
    <div className="flex items-center justify-center gap-1 h-12 w-full">
      {Array.from({ length: bars }).map((_, i) => (
        <div
          key={i}
          className={`w-1.5 rounded-full ${color} transition-all duration-300`}
          style={{
            height: isPlaying ? `${Math.max(20, Math.random() * 100)}%` : '20%',
            opacity: isPlaying ? 0.8 : 0.4,
            animation: isPlaying 
              ? `bounce 0.5s infinite ease-in-out alternate` 
              : 'none',
            animationDelay: `${i * 0.1}s`
          }}
        />
      ))}
      <style>{`
        @keyframes bounce {
          0% { height: 20%; }
          100% { height: 80%; }
        }
      `}</style>
    </div>
  );
};