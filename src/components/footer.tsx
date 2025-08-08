"use client";

import React, { useState, useCallback, memo } from "react";
import { DepartmentsIcon, PeoplesIcon, QuestionsIcon } from './icons';
import styles from '../styles/footer.module.css';
import QuestionsPopup from './questions_popup';
import PeoplesPopup from './peoples_popup';
import DepartmentsPopup from './departments_popup';
import { hapticFeedback } from '../utils/haptic';

const Footer = memo(function Footer() {
  const [activeRipples, setActiveRipples] = useState<{ [key: string]: Array<{ id: number, x: number, y: number }> }>({
    peoples: [],
    questions: [],
    departments: []
  });
  const [openPopups, setOpenPopups] = useState({
    questions: false,
    peoples: false,
    departments: false
  });

  // Optimized ripple effect function
  const createRippleEffect = (
    e: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>,
    buttonType: 'peoples' | 'questions' | 'departments'
  ) => {
    const rect = e.currentTarget.getBoundingClientRect();
    let x, y;

    if ('touches' in e && e.touches.length > 0) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = (e as React.MouseEvent<HTMLButtonElement>).clientX - rect.left;
      y = (e as React.MouseEvent<HTMLButtonElement>).clientY - rect.top;
    }

    const newRipple = { id: Date.now(), x, y };

    setActiveRipples(prev => ({
      ...prev,
      [buttonType]: [...prev[buttonType], newRipple]
    }));

    setTimeout(() => {
      setActiveRipples(prev => ({
        ...prev,
        [buttonType]: prev[buttonType].filter(ripple => ripple.id !== newRipple.id)
      }));
    }, 600);
  };



  const handleClosePopup = useCallback((popupType: 'departments' | 'questions' | 'peoples') => {
    setOpenPopups(prev => ({ ...prev, [popupType]: false }));
  }, []);


  return (
    <footer className={styles.footer}>
      <button
        className={`${styles.navIcon} ${styles.footerButton}`}
        onTouchStart={(e) => { e.preventDefault(); createRippleEffect(e, 'peoples'); hapticFeedback.navigation.open(); }}
        onMouseDown={(e) => { e.preventDefault(); createRippleEffect(e, 'peoples'); hapticFeedback.navigation.open(); }}
        onClick={(e) => { e.preventDefault(); setOpenPopups(prev => ({ ...prev, peoples: true })); }}
        type="button"
        aria-label="Peoples"
      >
        <PeoplesIcon />
        {activeRipples.peoples.map(ripple => (
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
        onTouchStart={(e) => { e.preventDefault(); createRippleEffect(e, 'departments'); hapticFeedback.navigation.open(); }}
        onMouseDown={(e) => { e.preventDefault(); createRippleEffect(e, 'departments'); hapticFeedback.navigation.open(); }}
        onClick={(e) => { e.preventDefault(); setOpenPopups(prev => ({ ...prev, departments: true })); }}
        type="button"
        aria-label="Departments"
      >
        <DepartmentsIcon />
        {activeRipples.departments.map(ripple => (
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
        onTouchStart={(e) => { e.preventDefault(); createRippleEffect(e, 'questions'); hapticFeedback.navigation.open(); }}
        onMouseDown={(e) => { e.preventDefault(); createRippleEffect(e, 'questions'); hapticFeedback.navigation.open(); }}
        onClick={(e) => { e.preventDefault(); setOpenPopups(prev => ({ ...prev, questions: true })); }}
        type="button"
        aria-label="Questions"
      >
        <QuestionsIcon />
        {activeRipples.questions.map(ripple => (
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
      {openPopups.departments && (
        <DepartmentsPopup
          isOpen={openPopups.departments}
          onClose={() => handleClosePopup('departments')}
        />
      )}
      {openPopups.questions && (
        <QuestionsPopup
          isOpen={openPopups.questions}
          onClose={() => handleClosePopup('questions')}
        />
      )}
      {openPopups.peoples && (
        <PeoplesPopup
          isOpen={openPopups.peoples}
          onClose={() => handleClosePopup('peoples')}
        />
      )}
    </footer>
  );
});

export default Footer;