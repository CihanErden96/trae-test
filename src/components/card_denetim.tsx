"use client";

import React, { useState, useMemo } from "react";
import { createPortal } from 'react-dom';
import styles from '../styles/card.module.css';
import popupStyles from '../styles/footer_popup.module.css';
import { hapticFeedback } from '../utils/haptic';
import ReusableCombobox, { ComboboxOption } from './combobox';



interface Question {
  id: number;
  question: string;
  description: string;
  category: string;
  score: number;
}

// Ana Denetim Departman Card Component'i
export function CardDenetimDepartman() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [questionScores, setQuestionScores] = useState<{[key: number]: string}>({});

  // Örnek denetim soruları
  const questions: Question[] = [
    {
      id: 1,
      question: "Çalışma alanı düzenli mi?",
      description: "İş alanının 5S prensiplerine uygun olarak düzenlenip düzenlenmediğinin kontrolü",
      category: "Düzen",
      score: 10
    },
    {
      id: 2,
      question: "Güvenlik ekipmanları yerinde mi?",
      description: "Kişisel koruyucu donanımların ve güvenlik ekipmanlarının yerinde olup olmadığının kontrolü",
      category: "Güvenlik",
      score: 15
    },
    {
      id: 3,
      question: "Temizlik standartları uygulanıyor mu?",
      description: "Belirlenen temizlik standartlarının düzenli olarak uygulanıp uygulanmadığının kontrolü",
      category: "Temizlik",
      score: 10
    },
    {
      id: 4,
      question: "Prosedürler takip ediliyor mu?",
      description: "İş prosedürlerinin çalışanlar tarafından doğru şekilde takip edilip edilmediğinin kontrolü",
      category: "Prosedür",
      score: 20
    }
  ];

  // Puan seçeneklerini ComboboxOption formatına dönüştür (parametrik olarak question.score'a kadar)
  const getScoreOptions = (maxScore: number): ComboboxOption[] => {
    const scores = [];
    for (let i = maxScore; i >= 0; i--) {
      scores.push({
        value: i.toString(),
        label: `${i}`
      });
    }
    return scores;
  };

  // SVG circle için hesaplamalar
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (75 / 100) * circumference; // Sabit %75 değeri

  const handleCardClick = () => {
    hapticFeedback.navigation.select();
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    hapticFeedback.navigation.close();
    setIsPopupOpen(false);
  };

  const handleOverlayClick = (e: React.MouseEvent | React.TouchEvent) => {
    if (e.target === e.currentTarget) {
      handleClosePopup();
    }
  };

  const handleQuestionClick = (question: Question) => {
    hapticFeedback.navigation.select();
    console.log('Soru tıklandı:', question);
    // Burada soru detay sayfasına yönlendirme veya başka bir işlem yapılabilir
  };

  const handleScoreSelect = (questionId: number, score: string) => {
    hapticFeedback.navigation.select();
    setQuestionScores(prev => ({
      ...prev,
      [questionId]: score
    }));
    console.log(`Soru ${questionId} için seçilen puan: ${score}`);
  };

  return (
    <>
      <div className={styles.cardContainer}>
        <div className={styles.card} onClick={handleCardClick}>
          <div className={styles.cardContent}>
            {/* Card Label - Sol Üst */}
            <div className={`${styles.cardLabel}`}>
              Denetim
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
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
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
                  75%
                </text>
              </svg>
            </div>
            
            {/* Bekleyen Denetimler Bilgi Alanı - Sol Orta */}
            <div 
              className={`${styles.descriptiveData} ${styles.descriptiveDataFirst}`}
            >
              İmalat
            </div>
            
            {/* Son Tarih Bilgi Alanı - Sol Alt */}
            <div
              className={`${styles.descriptiveData} ${styles.descriptiveDataSecond}`}
            >
              TT: 02.08.2025
            </div>
          </div>
        </div>
      </div>

      {/* Denetim Popup'ı */}
      {isPopupOpen && createPortal(
        <div className={popupStyles.overlay} 
             onClick={(e) => {e.preventDefault();hapticFeedback.navigation.close();handleOverlayClick(e);}}>
          <div className={popupStyles.popup}>
            <div className={popupStyles.header}>
              <h2 className={popupStyles.title}>Denetim Soruları</h2>
              <button 
                className={popupStyles.closeButton}
                onClick={(e) => {e.preventDefault();hapticFeedback.navigation.close();handleClosePopup();}}
                aria-label="Kapat"
              >
                ×
              </button>
            </div>
            
            <div className={popupStyles.content}>
              <div className={popupStyles.questionsContainer}>
                {questions.map((question) => (
                  <div 
                    key={question.id}
                    className={popupStyles.questionItem}
                    onClick={(e) => {e.preventDefault();hapticFeedback.navigation.select();handleQuestionClick(question);}}
                  >
                    <div className={popupStyles.questionHeader}>
                      <h3 className={popupStyles.questionTitle}>{question.question}</h3>
                    </div>
                    
                    <p className={popupStyles.questionDescription}>{question.description}</p>
                        <ReusableCombobox
                          options={getScoreOptions(question.score)}
                          selectedValue={questionScores[question.id] || ''}
                          placeholder={`${question.score}`}
                          onSelect={(score) => handleScoreSelect(question.id, score)}
                        />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}