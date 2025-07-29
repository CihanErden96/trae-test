import React, { ReactNode } from 'react';
import { SlideDirection } from '../hooks/useSlideAnimation';
import styles from '../styles/slide-animations.module.css';

interface SlideContainerProps {
  children: ReactNode;
  isVisible: boolean;
  slideDirection?: SlideDirection;
  isAnimating?: boolean;
  className?: string;
  onAnimationEnd?: () => void;
}

export function SlideContainer({
  children,
  isVisible,
  slideDirection,
  isAnimating = false,
  className = '',
  onAnimationEnd
}: SlideContainerProps) {
  if (!isVisible && !isAnimating) {
    return null;
  }

  const getAnimationClass = () => {
    if (!slideDirection || !isAnimating) return '';
    
    const direction = slideDirection.charAt(0).toUpperCase() + slideDirection.slice(1);
    return isVisible ? `${styles.slideIn}${direction}` : `${styles.slideOut}${direction}`;
  };

  return (
    <div
      className={`${styles.slideContainer} ${getAnimationClass()} ${className}`}
      onAnimationEnd={onAnimationEnd}
    >
      {children}
    </div>
  );
}