"use client";

import React, { useState } from "react";
import { DepartmentsIcon, PeoplesIcon, QuestionsIcon } from './icons';
import styles from '../styles/footer.module.css';
import QuestionsPopup from './questions_popup';
import PeoplesPopup from './peoples_popup';
import DepartmentsPopup from './departments_popup';

export default function Footer() {
  const [peoplesRipples, setPeoplesRipples] = useState<Array<{id: number, x: number, y: number}>>([]);
  const [questionsRipples, setQuestionsRipples] = useState<Array<{id: number, x: number, y: number}>>([]);
  const [departmentsRipples, setDepartmentsRipples] = useState<Array<{id: number, x: number, y: number}>>([]);
  const [isQuestionsPopupOpen, setIsQuestionsPopupOpen] = useState(false);
  const [isPeoplesPopupOpen, setIsPeoplesPopupOpen] = useState(false);
  const [isDepartmentsPopupOpen, setIsDepartmentsPopupOpen] = useState(false);

  const handleDepartmentsClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newRipple = {
      id: Date.now(),
      x,
      y
    };
    
    setDepartmentsRipples(prev => [...prev, newRipple]);
    
    // Haptic feedback (iOS Safari)
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
    
    // Remove ripple after animation
    setTimeout(() => {
      setDepartmentsRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
    }, 600);
    
    setIsDepartmentsPopupOpen(true);
  };

  const handlePeoplesClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newRipple = {
      id: Date.now(),
      x,
      y
    };
    
    setPeoplesRipples(prev => [...prev, newRipple]);
    
    // Haptic feedback (iOS Safari)
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
    
    // Remove ripple after animation
    setTimeout(() => {
      setPeoplesRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
    }, 600);
    
    setIsPeoplesPopupOpen(true);
  };

  const handleQuestionsClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newRipple = {
      id: Date.now(),
      x,
      y
    };
    
    setQuestionsRipples(prev => [...prev, newRipple]);
    
    // Haptic feedback (iOS Safari)
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
    
    // Remove ripple after animation
    setTimeout(() => {
      setQuestionsRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
    }, 600);
    
    setIsQuestionsPopupOpen(true);
  };

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