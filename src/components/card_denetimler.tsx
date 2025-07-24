import React from "react";
import styles from '../styles/card_denetimler.module.css';

export default function CardDenetimler() {
  return (
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
                stroke="rgba(255, 248, 225, 0.5)"
                strokeWidth="10"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#FFF8E1"
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
          <div className={`${styles.addButton}`}>
            +
          </div>
          
          {/* All Button - Sol Orta */}
          <div className={`${styles.allButton}`}>
            Tümü
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
  );
}