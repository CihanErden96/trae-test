"use client";

import React, { useState } from "react";
import { DepartmentsIcon, PeoplesIcon, QuestionsIcon } from './icons';
import styles from '../styles/footer.module.css';
import QuestionsPopup from './questions_popup';

export default function Footer() {
  const [ripples, setRipples] = useState<Array<{id: number, x: number, y: number}>>([]);
  const [isQuestionsPopupOpen, setIsQuestionsPopupOpen] = useState(false);

  const handleQuestionsClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newRipple = {
      id: Date.now(),
      x,
      y
    };
    
    setRipples(prev => [...prev, newRipple]);
    
    // Haptic feedback (iOS Safari)
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
    
    // Remove ripple after animation
    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
    }, 600);
    
    // Open questions popup
    setIsQuestionsPopupOpen(true);
    console.log('Questions popup opened!');
  };

  const handleCloseQuestionsPopup = () => {
    setIsQuestionsPopupOpen(false);
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.navIcon}>
        <DepartmentsIcon />
      </div>
      <div className={styles.navIcon}>
        <PeoplesIcon />
      </div>
      <button 
        className={`${styles.navIcon} ${styles.questionsButton}`}
        onClick={handleQuestionsClick}
        type="button"
        aria-label="Questions"
      >
        <QuestionsIcon />
        {ripples.map(ripple => (
          <span
            key={ripple.id}
            className={styles.ripple}
            style={{
              left: ripple.x - 20,
              top: ripple.y - 20,
            }}
          />
        ))}
      </button>
      {isQuestionsPopupOpen && (
          <QuestionsPopup 
            isOpen={isQuestionsPopupOpen}
            onClose={handleCloseQuestionsPopup} 
          />
        )}
    </footer>
  );
}