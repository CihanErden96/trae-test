"use client";

import React, { useState } from "react";
import { DepartmentsIcon, PeoplesIcon, QuestionsIcon } from './icons';
import styles from '../styles/footer.module.css';
import QuestionsPopup from './questions_popup';
import PeoplesPopup from './peoples_popup';
import DepartmentsPopup from './departments_popup';
import { hapticFeedback } from '../utils/haptic';

export default function Footer() {
  const [peoplesRipples, setPeoplesRipples] = useState<Array<{id: number, x: number, y: number}>>([]);
  const [questionsRipples, setQuestionsRipples] = useState<Array<{id: number, x: number, y: number}>>([]);
  const [departmentsRipples, setDepartmentsRipples] = useState<Array<{id: number, x: number, y: number}>>([]);
  const [isQuestionsPopupOpen, setIsQuestionsPopupOpen] = useState(false);
  const [isPeoplesPopupOpen, setIsPeoplesPopupOpen] = useState(false);
  const [isDepartmentsPopupOpen, setIsDepartmentsPopupOpen] = useState(false);

  // Generic function to handle both click and touch events
  const createRippleEffect = (
    e: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>,
    setRipples: React.Dispatch<React.SetStateAction<Array<{id: number, x: number, y: number}>>>
  ) => {
    const rect = e.currentTarget.getBoundingClientRect();
    let x, y;
    
    if ('changedTouches' in e && e.changedTouches.length > 0) {
      // Touch event (touchend uses changedTouches)
      x = e.changedTouches[0].clientX - rect.left;
      y = e.changedTouches[0].clientY - rect.top;
    } else if ('clientX' in e) {
      // Mouse event
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    } else {
      // Fallback to center
      x = rect.width / 2;
      y = rect.height / 2;
    }
    
    const newRipple = {
      id: Date.now(),
      x,
      y
    };
    
    setRipples(prev => [...prev, newRipple]);
    
    // Ripple'ı temizle
    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
    }, 600);
  };

  const handleDepartmentsAction = (e: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>) => {
    e.preventDefault();
    
    // Touch duration'ı hesapla
    let touchDuration = 0;
    if ('changedTouches' in e) {
      touchDuration = hapticFeedback.trackTouch.end();
    }
    
    // Touch duration'a göre haptic feedback
    if (touchDuration > 0) {
      hapticFeedback.touchEnd(touchDuration);
    } else {
      hapticFeedback.light();
    }
    
    createRippleEffect(e, setDepartmentsRipples);
    
    // Haptic feedback (iOS Safari)
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
    
    setIsDepartmentsPopupOpen(true);
  };

  const handlePeoplesAction = (e: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>) => {
    e.preventDefault();
    
    // Touch duration'ı hesapla
    let touchDuration = 0;
    if ('changedTouches' in e) {
      touchDuration = hapticFeedback.trackTouch.end();
    }
    
    // Touch duration'a göre haptic feedback
    if (touchDuration > 0) {
      hapticFeedback.touchEnd(touchDuration);
    } else {
      hapticFeedback.light();
    }
    
    createRippleEffect(e, setPeoplesRipples);
    
    setIsPeoplesPopupOpen(true);
  };

  const handleQuestionsAction = (e: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>) => {
    e.preventDefault();
    
    // Touch duration'ı hesapla
    let touchDuration = 0;
    if ('changedTouches' in e) {
      touchDuration = hapticFeedback.trackTouch.end();
    }
    
    // Touch duration'a göre haptic feedback
    if (touchDuration > 0) {
      hapticFeedback.touchEnd(touchDuration);
    } else {
      hapticFeedback.light();
    }
    
    createRippleEffect(e, setQuestionsRipples);
    
    setIsQuestionsPopupOpen(true);
  };

  // Legacy click handlers for backward compatibility
  const handleDepartmentsClick = (e: React.MouseEvent<HTMLButtonElement>) => handleDepartmentsAction(e);
  const handlePeoplesClick = (e: React.MouseEvent<HTMLButtonElement>) => handlePeoplesAction(e);
  const handleQuestionsClick = (e: React.MouseEvent<HTMLButtonElement>) => handleQuestionsAction(e);

  const handleCloseDepartmentsPopup = () => {
    setIsDepartmentsPopupOpen(false);
  };

  const handleCloseQuestionsPopup = () => {
    setIsQuestionsPopupOpen(false);
  };

  const handleClosePeoplesPopup = () => {
    setIsPeoplesPopupOpen(false);
  };

  return (
    <footer className={styles.footer}>
      <button 
        className={`${styles.navIcon} ${styles.questionsButton}`}
        onClick={handlePeoplesClick}
        onTouchStart={() => hapticFeedback.trackTouch.start()}
        onTouchEnd={handlePeoplesAction}
        type="button"
        aria-label="Peoples"
      >
        <PeoplesIcon />
        {peoplesRipples.map(ripple => (
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
      <button 
        className={`${styles.navIcon} ${styles.questionsButton}`}
        onClick={handleDepartmentsClick}
        onTouchStart={() => hapticFeedback.trackTouch.start()}
        onTouchEnd={handleDepartmentsAction}
        type="button"
        aria-label="Departments"
      >
        <DepartmentsIcon />
        {departmentsRipples.map(ripple => (
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

      <button 
        className={`${styles.navIcon} ${styles.questionsButton}`}
        onClick={handleQuestionsClick}
        onTouchStart={() => hapticFeedback.trackTouch.start()}
        onTouchEnd={handleQuestionsAction}
        type="button"
        aria-label="Questions"
      >
        <QuestionsIcon />
        {questionsRipples.map(ripple => (
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
      {isDepartmentsPopupOpen && (
          <DepartmentsPopup 
            isOpen={isDepartmentsPopupOpen}
            onClose={handleCloseDepartmentsPopup} 
          />
        )}
      {isQuestionsPopupOpen && (
          <QuestionsPopup 
            isOpen={isQuestionsPopupOpen}
            onClose={handleCloseQuestionsPopup} 
          />
        )}
      {isPeoplesPopupOpen && (
          <PeoplesPopup 
            isOpen={isPeoplesPopupOpen}
            onClose={handleClosePeoplesPopup} 
          />
        )}
    </footer>
  );
}