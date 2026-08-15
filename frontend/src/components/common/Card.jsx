import React from 'react';

export const Card = ({ children, variant = 'default', className = '', style = {}, onClick }) => {
  const getVariantClass = () => {
    switch (variant) {
      case 'elevated': return 'card-elevated';
      case 'interactive': return 'card-interactive';
      case 'featured': return 'card-featured';
      case 'default':
      default: return '';
    }
  };

  return (
    <div
      className={`card-container ${getVariantClass()} ${className}`}
      onClick={onClick}
      style={{ ...style }}
    >
      {children}
    </div>
  );
};
