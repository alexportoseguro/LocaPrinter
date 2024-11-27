import React, { ReactNode } from 'react';

interface TooltipProps {
  children: ReactNode;
  content: string;
  side?: 'top' | 'bottom' | 'left' | 'right';
}

const Tooltip: React.FC<TooltipProps> = ({ 
  children, 
  content, 
  side = 'top' 
}) => {
  return (
    <div className="group relative inline-block">
      {children}
      <div 
        className={`
          absolute z-10 
          bg-gray-800 text-white text-xs 
          px-2 py-1 rounded 
          opacity-0 group-hover:opacity-100 
          transition-opacity duration-300
          ${side === 'top' ? 'bottom-full left-1/2 transform -translate-x-1/2 mb-2' : ''}
          ${side === 'bottom' ? 'top-full left-1/2 transform -translate-x-1/2 mt-2' : ''}
          ${side === 'left' ? 'right-full top-1/2 transform -translate-y-1/2 mr-2' : ''}
          ${side === 'right' ? 'left-full top-1/2 transform -translate-y-1/2 ml-2' : ''}
        `}
      >
        {content}
      </div>
    </div>
  );
};

export default Tooltip;
