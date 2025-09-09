import React from 'react';

interface RobotAvatarProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isActive?: boolean;
  className?: string;
}

const RobotAvatar: React.FC<RobotAvatarProps> = ({ 
  size = 'md', 
  isActive = false, 
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20',
    lg: 'w-24 h-24',
    xl: 'w-32 h-32'
  };

  return (
    <div className={`${sizeClasses[size]} ${className} relative`}>
      <div className={`w-full h-full bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center ${
        isActive ? 'animate-pulse' : ''
      }`}>
        <div className="w-4/5 h-4/5 bg-white rounded-full flex items-center justify-center">
          <div className="w-3/4 h-3/4 bg-cyan-500 rounded-full flex items-center justify-center">
            <div className="w-2/3 h-2/3 bg-white rounded-full flex items-center justify-center">
              <div className="w-1/2 h-1/2 bg-cyan-500 rounded-full flex items-center justify-center">
                <div className="w-1/3 h-1/3 bg-white rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Glowing effect when active */}
      {isActive && (
        <div className="absolute inset-0 bg-cyan-400 rounded-full opacity-30 animate-ping"></div>
      )}
    </div>
  );
};

export default RobotAvatar;
