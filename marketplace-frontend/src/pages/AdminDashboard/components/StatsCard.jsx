import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatsCard = ({ 
  title, 
  value, 
  icon: IconComponent, 
  trend, 
  color = 'blue', 
  size = 'normal',
  isPercentage = false 
}) => {
  const colorClasses = {
    blue: 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25',
    green: 'bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/25',
    orange: 'bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/25',
    purple: 'bg-gradient-to-br from-purple-500 to-pink-600 text-white shadow-lg shadow-purple-500/25',
    red: 'bg-gradient-to-br from-red-500 to-red-600 text-white shadow-lg shadow-red-500/25',
    yellow: 'bg-gradient-to-br from-yellow-500 to-orange-500 text-white shadow-lg shadow-yellow-500/25',
    indigo: 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25'
  };

  const bgColorClasses = {
    blue: 'bg-gradient-to-br from-blue-50/80 to-white/80 border-blue-200/50',
    green: 'bg-gradient-to-br from-green-50/80 to-white/80 border-green-200/50',
    orange: 'bg-gradient-to-br from-orange-50/80 to-red-50/80 border-orange-200/50',
    purple: 'bg-gradient-to-br from-purple-50/80 to-white/80 border-purple-200/50',
    red: 'bg-gradient-to-br from-red-50/80 to-white/80 border-red-200/50',
    yellow: 'bg-gradient-to-br from-yellow-50/80 to-white/80 border-yellow-200/50',
    indigo: 'bg-gradient-to-br from-indigo-50/80 to-white/80 border-indigo-200/50'
  };

  const textColorClasses = {
    blue: 'text-blue-700 font-semibold',
    green: 'text-green-700 font-semibold',
    orange: 'text-orange-700 font-semibold',
    purple: 'text-purple-700 font-semibold',
    red: 'text-red-700 font-semibold',
    yellow: 'text-yellow-700 font-semibold',
    indigo: 'text-indigo-700 font-semibold'
  };

  const sizeClasses = size === 'sm' 
    ? 'p-4' 
    : 'p-6';

  const valueSizeClasses = size === 'sm' 
    ? 'text-xl' 
    : 'text-3xl';

  const iconSizeClasses = size === 'sm' 
    ? 'w-10 h-10' 
    : 'w-12 h-12';

  return (
    <div className={`${bgColorClasses[color]} backdrop-blur-sm rounded-2xl border ${sizeClasses} hover:shadow-xl hover:scale-105 transition-all duration-300 group relative overflow-hidden`}>
      {/* Brillo sutil en hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
      
      <div className="flex items-start justify-between relative z-10">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-bold text-gray-700 uppercase tracking-wider">{title}</p>
            <div className={`${iconSizeClasses} ${colorClasses[color]} rounded-2xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-200`}>
              <IconComponent className="w-6 h-6" />
            </div>
          </div>
          
          <div className={`${valueSizeClasses} font-extrabold text-gray-900 mb-2`}>
            {typeof value === 'number' && !isPercentage 
              ? value.toLocaleString() 
              : value
            }
          </div>
          
          {trend && (
            <div className={`flex items-center text-sm ${textColorClasses[color]} bg-white/60 rounded-full px-3 py-1 backdrop-blur-sm`}>
              {typeof trend === 'object' ? (
                <span className="flex items-center gap-1">
                  {trend.isPositive ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  {trend.value}%
                </span>
              ) : (
                <span>{trend}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;