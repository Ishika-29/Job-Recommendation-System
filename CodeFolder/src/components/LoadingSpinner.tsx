import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Search } from 'lucide-react';

interface LoadingSpinnerProps {
  type: 'analyzing' | 'searching';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ type }) => {
  const config = {
    analyzing: {
      icon: Brain,
      title: 'Analyzing Resume',
      subtitle: 'AI is extracting key skills and experiences...',
      color: 'from-purple-500 to-blue-500'
    },
    searching: {
      icon: Search,
      title: 'Finding Jobs',
      subtitle: 'Searching for matching opportunities...',
      color: 'from-blue-500 to-teal-500'
    }
  };

  const { icon: Icon, title, subtitle, color } = config[type];

  return (
    <div
      className="flex flex-col items-center justify-center p-12"
    >
      <div className={`relative w-20 h-20 bg-gradient-to-br ${color} rounded-2xl flex items-center justify-center mb-6`}>
        <Icon className="w-10 h-10 text-white" />
        <div
          className="absolute inset-0 rounded-2xl border-4 border-white/30"
        />
      </div>

      <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-center max-w-md">{subtitle}</p>

      <div className="flex space-x-2 mt-6">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-3 h-3 bg-blue-500 rounded-full"
          />
        ))}
      </div>
    </div>
  );
};