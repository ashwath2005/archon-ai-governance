import React from 'react';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  style = {},
  onClick,
  type = 'button'
}) => {
  const getVariantClass = () => {
    switch (variant) {
      case 'secondary': return 'btn-secondary';
      case 'ghost': return 'btn-ghost';
      case 'danger': return 'btn-danger';
      case 'success': return 'btn-success';
      case 'warning': return 'btn-warning';
      case 'primary':
      default: return 'btn-primary';
    }
  };

  const getSizeClass = () => (size === 'sm' ? 'btn-sm' : '');

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`btn ${getVariantClass()} ${getSizeClass()} ${className}`}
      style={{ ...style }}
    >
      {children}
    </button>
  );
};
