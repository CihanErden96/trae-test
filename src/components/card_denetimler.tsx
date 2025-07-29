"use client";

import React, { useState } from "react";
import styles from '../styles/card.module.css';
import DenetimPopup from './denetim_create_popup';
import { hapticFeedback } from '../utils/haptic';

interface DenetimData {
  title: string;
  description: string;
  department: string;
  priority: 'Düşük' | 'Orta' | 'Yüksek' | 'Kritik';
  startDate: string;
  endDate: string;
  type: 'İç Denetim' | 'Dış Denetim' | 'Uygunluk Denetimi' | 'Performans Denetimi';
}

export default function CardDenetimler() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleAddDenetim = () => {
    hapticFeedback.success();
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  const handleSubmitDenetim = (denetim: DenetimData) => {
    console.log('Yeni denetim oluşturuldu:', denetim);
  };

  return (
    <>
      <div className={styles.cardContainer}>
        <div className={styles.card}>
          <div className={styles.cardContent}>
            {/* Card Label - Sol Üst */}
            <div className={`${styles.cardLabel}`}>
              Denetimler
            </div>
            
            {/* Circular Progress - Sağ Üst */}
            <div className={`${styles.circularProgress}`}>
              <svg width="100" height="100" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="currentStroke"
                  strokeWidth="10"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="10"
                  strokeDasharray="251.3"
                  strokeDashoffset="75.4"
                  strokeLinecap="round"
                  transform="rotate(-90 50 50)"
                />
                <text
                  x="50"
                  y="50"
                  textAnchor="middle"
                  dy=".3em"
                  className={styles.circularProgressText}
                >
                  70%
                </text>
              </svg>
            </div>
            
            {/* Add Button - Sağ Alt */}
            <div 
              className={`${styles.addButton}`}
              onClick={handleAddDenetim}
              style={{ cursor: 'pointer' }}
            >
              +
            </div>
            
            {/* Progress Bar - Sol Alt */}
            <div className={styles.progressContainer}>
              <div className={styles.progressBarLabel}>Güncel</div>
              <div className={styles.progressWrapper}>
                <div className={`${styles.progressBar}`}>
                  <div className={`${styles.progressFill} `}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <DenetimPopup
        isOpen={isPopupOpen}
        onClose={handleClosePopup}
        onSubmit={handleSubmitDenetim}
      />
    </>
  );
}