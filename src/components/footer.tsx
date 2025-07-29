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

  // Generic function to handle click and touch events
  const createRippleEffect = (
    e: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>,
    setRipples: React.Dispatch<React.SetStateAction<Array<{id: number, x: number, y: number}>>>
  ) => {
    const rect = e.currentTarget.getBoundingClientRect();
    let x, y;
    
    // Touch event için koordinatları al
    if ('touches' in e && e.touches.length > 0) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      // Mouse event için koordinatları al
      x = (e as React.MouseEvent<HTMLButtonElement>).clientX - rect.left;
      y = (e as React.MouseEvent<HTMLButtonElement>).clientY - rect.top;
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

  const handleClickStart = (
  ) => {
    setIsQuestionsPopupOpen(true)
    hapticFeedback.heavy();
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
        className={`${styles.navIcon} ${styles.footerButton}`}
        onTouchStart={(e) => {e.preventDefault();createRippleEffect(e,setPeoplesRipples);hapticFeedback.light();}}
        onMouseDown={(e) => {e.preventDefault();createRippleEffect(e,setPeoplesRipples);hapticFeedback.light();}}
        onTouchEnd={(e) => {e.preventDefault();setIsPeoplesPopupOpen(true);}}
        onMouseUp={(e) => {e.preventDefault();setIsPeoplesPopupOpen(true);}}
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
        className={`${styles.navIcon} ${styles.footerButton}`}
        onTouchStart={(e) => {e.preventDefault();createRippleEffect(e,setDepartmentsRipples);hapticFeedback.light();}}
        onMouseDown={(e) => {e.preventDefault();createRippleEffect(e,setDepartmentsRipples);hapticFeedback.light();}}
        onTouchEnd={(e) => {e.preventDefault();setIsDepartmentsPopupOpen(true);}}
        onMouseUp={(e) => {e.preventDefault();setIsDepartmentsPopupOpen(true);}}
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
        className={`${styles.navIcon} ${styles.footerButton}`}
        onTouchStart={(e) => {e.preventDefault();createRippleEffect(e,setQuestionsRipples);hapticFeedback.light();}}
        onMouseDown={(e) => {e.preventDefault();createRippleEffect(e,setQuestionsRipples);hapticFeedback.light();}}
        onTouchEnd={(e) => {e.preventDefault();setIsQuestionsPopupOpen(true);}}
        onMouseUp={(e) => {e.preventDefault();setIsQuestionsPopupOpen(true);}}
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