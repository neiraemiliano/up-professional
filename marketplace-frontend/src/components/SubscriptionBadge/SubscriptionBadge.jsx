import React from 'react';
import { Crown, Star, Zap, Sparkles } from 'lucide-react';

const SubscriptionBadge = ({ plan, isFeatured, isPriority, size = 'sm' }) => {
  if (plan === 'free') return null;

  const badges = {
    premium: {
      text: 'PREMIUM',
      icon: Star,
      gradient: 'from-orange-500 to-red-500',
      shadow: 'shadow-orange-500/25',
      pulse: isPriority ? 'animate-pulse' : ''
    },
    pro: {
      text: 'PRO',
      icon: Crown,
      gradient: 'from-purple-600 to-pink-600',
      shadow: 'shadow-purple-500/25',
      pulse: isFeatured ? 'animate-pulse' : ''
    }
  };

  const config = badges[plan];
  if (!config) return null;

  const sizeClasses = {
    xs: 'px-1.5 py-0.5 text-xs',
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  const iconSizes = {
    xs: 'w-2.5 h-2.5',
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  const IconComponent = config.icon;

  return (
    <div className="relative inline-flex">
      <div className={`
        inline-flex items-center gap-1 
        bg-gradient-to-r ${config.gradient} 
        text-white font-bold 
        rounded-full ${sizeClasses[size]}
        shadow-lg ${config.shadow}
        transform hover:scale-105 transition-all duration-200
        ${config.pulse}
      `}>
        <IconComponent className={iconSizes[size]} />
        <span>{config.text}</span>
      </div>
      
      {/* Sparkles effect for featured pros */}
      {isFeatured && (
        <div className="absolute -top-1 -right-1 animate-bounce">
          <Sparkles className="w-3 h-3 text-yellow-400" />
        </div>
      )}
    </div>
  );
};

export default SubscriptionBadge;