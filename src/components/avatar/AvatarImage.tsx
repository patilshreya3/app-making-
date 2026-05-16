import React from 'react';
import { useArtemisContext } from '../../context/ArtemisContext';
import { cn } from '../../lib/utils';

interface AvatarImageProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showGlow?: boolean;
}

export const AvatarImage: React.FC<AvatarImageProps> = ({ 
  className, 
  size = 'md',
  showGlow = false 
}) => {
  const { state } = useArtemisContext();
  
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-24 h-24',
    lg: 'w-48 h-48 md:w-64 md:h-64',
    xl: 'w-72 h-72 md:w-96 md:h-96'
  };

  const avatarUrl = `https://api.dicebear.com/7.x/lorelei/svg?seed=${state.assistantName}&clothing=${state.avatarConfig.outfit}&hair=${state.avatarConfig.hairStyle}&accessories=${state.avatarConfig.accessories !== 'none' ? state.avatarConfig.accessories : ''}&eyes=${state.avatarConfig.eyes}&mouth=${state.avatarConfig.mouth}&eyebrows=${state.avatarConfig.eyebrows}`;

  return (
    <div className={cn("relative flex items-center justify-center", sizeClasses[size], className)}>
      {showGlow && (
        <div className={cn(
          "absolute inset-0 blur-[60px] rounded-full scale-125 animate-pulse transition-colors duration-1000",
          state.roomState.isLampOn ? "bg-amber-400/40" : "bg-rose-400/40"
        )} />
      )}
      <img 
        src={avatarUrl} 
        alt="Avatar" 
        className={cn(
          "w-full h-full object-contain relative z-10",
          (size === 'lg' || size === 'xl') ? "scale-110" : "scale-125"
        )}
        referrerPolicy="no-referrer"
      />
    </div>
  );
};
