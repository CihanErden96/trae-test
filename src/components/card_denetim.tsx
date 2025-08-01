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
  actions?: Action[];
}

interface Action {
  id: number;
  title: string;
  description: string;
  status: 'pending' | 'completed';
  dueDate?: string;
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
      score: 10,
      actions: [
        {
          id: 1,
          title: "Çalışma alanını düzenle",
          description: "5S prensiplerine uygun olarak çalışma alanını yeniden düzenle",
          status: 'pending',
          dueDate: '2025-01-15'
        },
        {
          id: 2,
          title: "Düzen kontrol listesi oluştur",
          description: "Günlük düzen kontrolü için checklist hazırla",
          status: 'pending',
          dueDate: '2025-01-10'
        }
      ]
    },
    {
      id: 2,
      question: "Güvenlik ekipmanları yerinde mi?",
      description: "Kişisel koruyucu donanımların ve güvenlik ekipmanlarının yerinde olup olmadığının kontrolü",
      category: "Güvenlik",
      score: 15,
      actions: [
        {
          id: 3,
          title: "Eksik güvenlik ekipmanlarını temin et",
          description: "Listede belirtilen eksik güvenlik ekipmanlarını satın al",
          status: 'pending',
          dueDate: '2025-01-20'
        }
      ]
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
      score: 20,
      actions: [
        {
          id: 4,
          title: "Prosedür eğitimi düzenle",
          description: "Çalışanlara güncel prosedürler hakkında eğitim ver",
          status: 'pending',
          dueDate: '2025-01-25'
        },
        {
          id: 5,
          title: "Prosedür dokümanlarını güncelle",
          description: "Eski prosedür dokümanlarını yeni standartlara göre güncelle",
          status: 'completed',
          dueDate: '2025-01-05'
        }
      ]
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
    const question = questions.find(q => q.id === questionId);
    
    // Eğer soru aksiyonları varsa ve en yüksek puan seçilmezse, default olarak 0 yap
    if (question?.actions && question.actions.length > 0 && parseInt(score) < question.score) {
      setQuestionScores(prev => ({
        ...prev,
        [questionId]: '0'
      }));
      console.log(`Soru ${questionId} için aksiyon gerekli - puan 0 olarak ayarlandı`);
    } else {
      setQuestionScores(prev => ({
        ...prev,
        [questionId]: score
      }));
      console.log(`Soru ${questionId} için seçilen puan: ${score}`);
    }
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
                {questions.map((question) => {
                  const selectedScore = questionScores[question.id];
                  const shouldShowActions = question.actions && 
                    question.actions.length > 0 && 
                    selectedScore && 
                    parseInt(selectedScore) < question.score;

                  return (
                    <div key={question.id}>
                      <div 
                        className={popupStyles.questionItem}
                        onClick={(e) => {e.preventDefault();hapticFeedback.navigation.select();handleQuestionClick(question);}}
                      >
                        <div className={popupStyles.questionHeader}>
                          <h3 className={popupStyles.questionTitle}>{question.question}</h3>
                        </div>
                        
                        <p className={popupStyles.questionDescription}>{question.description}</p>
                        <div className={popupStyles.questionScore}>
                          <ReusableCombobox
                            options={getScoreOptions(question.score)}
                            selectedValue={questionScores[question.id] || ''}
                            placeholder={`${question.score}`}
                            onSelect={(score) => handleScoreSelect(question.id, score)}
                          />
                        </div>
                      </div>

                      {/* Aksiyon Listesi */}
                      {shouldShowActions && (
                        <div className={popupStyles.categoryContent}>
                          {question.actions!.map((action) => (
                            <div 
                              key={action.id}
                              className={`${popupStyles.actionItem} ${action.status === 'completed' ? popupStyles.completedAction : ''}`}
                            >
                              <div className={popupStyles.actionHeader}>
                                <h4 className={popupStyles.actionTitle}>{action.title}</h4>
                                <span className={`${popupStyles.actionStatus} ${popupStyles[action.status]}`}>
                                  {action.status === 'pending' ? 'Bekliyor' : 'Tamamlandı'}
                                </span>
                              </div>
                              <p className={popupStyles.actionDescription}>{action.description}</p>
                              {action.dueDate && (
                                <div className={popupStyles.actionDueDate}>
                                  Son Tarih: {new Date(action.dueDate).toLocaleDateString('tr-TR')}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}