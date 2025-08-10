"use client";

import React, { useState } from "react";
import Image from "next/image";
import { createPortal } from 'react-dom';
import styles from '../styles/card.module.css';
import { hapticFeedback } from '../utils/haptic';
import { Action, truncateText, departmentsData, calculateTotalActions, Department } from './const';
import ActionDetailPopup from './actionDetail_popup';

interface AksiyonlarPopupProps {
  department: Department;
  isPendingActionsCollapsed: boolean;
  setIsPendingActionsCollapsed: (value: boolean) => void;
  isCompletedActionsCollapsed: boolean;
  setIsCompletedActionsCollapsed: (value: boolean) => void;
}



// Ana Aksiyonlar Card Component'i
export function CardAksiyonlarMain() {
  const { totalCompleted, totalPending, progressPercentage } = calculateTotalActions();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isPendingActionsCollapsed, setIsPendingActionsCollapsed] = useState(false);
  const [isCompletedActionsCollapsed, setIsCompletedActionsCollapsed] = useState(true);
  
  // SVG circle için hesaplamalar
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercentage / 100) * circumference;

  // Popup'ı kapatma
  const handleClosePopup = () => {
    hapticFeedback.navigation.close();
    setIsPopupOpen(false);
  };

  // Card'a tıklama - bekleyen aksiyonları göster, tamamlananları kapalı tut
  const handleCardClick = () => {
    hapticFeedback.navigation.open();
    setIsPendingActionsCollapsed(false);
    setIsCompletedActionsCollapsed(true);
    setIsPopupOpen(true);
  };

  // Tüm departmanları birleştirerek tek bir departman objesi oluştur
  const allActionsData: Department = {
    id: 0,
    name: 'Tüm Aksiyonlar',
    score: 0,
    completedActions: totalCompleted,
    pendingActions: totalPending,
    pendingActionsList: departmentsData.flatMap(dept => dept.pendingActionsList),
    completedActionsList: departmentsData.flatMap(dept => dept.completedActionsList)
  };

  return (
    <>
      <div className={styles.cardContainer}>
        <div 
          className={styles.card}
          onTouchStart={(e) => {
            e.preventDefault();
            hapticFeedback.button.primary();
          }}
          onMouseDown={(e) => {
            e.preventDefault();
            hapticFeedback.button.primary();
          }}
          onClick={(e) => {
            e.preventDefault();
            handleCardClick();
          }}
        >
          <div className={styles.cardContent}>
            {/* Card Label - Sol Üst */}
            <div className={`${styles.cardLabel}`}>
              Aksiyonlar
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
                  {progressPercentage}%
                </text>
              </svg>
            </div>
            
            {/* Bekleyen Aksiyonlar Bilgi Alanı - Sol Alt */}
            <div 
              className={`${styles.descriptiveData} ${styles.descriptiveDataFirst}`}
            >
              Bekleyen: {totalPending}
            </div>
            
            {/* Tamamlanan Aksiyonlar Bilgi Alanı - Sağ Alt */}
            <div 
              className={`${styles.descriptiveData} ${styles.descriptiveDataSecond}`}
            >
              Tamamlanan: {totalCompleted}
            </div>
          </div>
        </div>
      </div>

      {/* Aksiyonlar Popup */}
      {isPopupOpen && createPortal(
        <div 
          className={styles.overlay} 
          onTouchStart={(e) => {
            e.preventDefault();
          }}
          onMouseDown={(e) => {
            e.preventDefault();
          }}
          onClick={(e) => {
            e.preventDefault();
            if (e.target === e.currentTarget) {
              handleClosePopup();
            }
          }}
        >
          <div 
            className={styles.popup} 
            onTouchStart={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
          >
            <div className='popup-header'>
              <h2 className={'popup-title'}>
                Aksiyonlar
              </h2>
              <button 
                className='popup-close-button'
                onTouchStart={(e) => {
                  e.preventDefault();
                }}
                onMouseDown={(e) => {
                  e.preventDefault();
                }}
                onClick={(e) => {
                  e.preventDefault();
                  handleClosePopup();
                }}
                aria-label="Kapat"
              >
                ×
              </button>
            </div>
            
            <div className={styles.content}>
              <AksiyonlarPopup
                department={allActionsData}
                isPendingActionsCollapsed={isPendingActionsCollapsed}
                setIsPendingActionsCollapsed={setIsPendingActionsCollapsed}
                isCompletedActionsCollapsed={isCompletedActionsCollapsed}
                setIsCompletedActionsCollapsed={setIsCompletedActionsCollapsed}
              />
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}

// Aksiyonlar Popup Component'i
export default function AksiyonlarPopup({ 
  department,
  isPendingActionsCollapsed,
  setIsPendingActionsCollapsed,
  isCompletedActionsCollapsed,
  setIsCompletedActionsCollapsed
}: AksiyonlarPopupProps) {
  const [selectedAction, setSelectedAction] = useState<Action | null>(null);
  const [isActionDetailOpen, setIsActionDetailOpen] = useState(false);
  
  // Pagination state'leri
  const [pendingDisplayCount, setPendingDisplayCount] = useState(10);
  const [completedDisplayCount, setCompletedDisplayCount] = useState(10);
  
  const ITEMS_PER_PAGE = 10;

  const handleActionClick = (action: Action) => {
    hapticFeedback.navigation.select();
    setSelectedAction(action);
    setIsActionDetailOpen(true);
  };

  const handleCloseActionDetail = () => {
    hapticFeedback.navigation.close();
    setIsActionDetailOpen(false);
    setSelectedAction(null);
  };

  // Bekleyen aksiyonlar için "daha fazla göster" fonksiyonu
  const handleShowMorePending = () => {
    hapticFeedback.button.secondary();
    setPendingDisplayCount(prev => prev + ITEMS_PER_PAGE);
  };

  // Tamamlanan aksiyonlar için "daha fazla göster" fonksiyonu
  const handleShowMoreCompleted = () => {
    hapticFeedback.button.secondary();
    setCompletedDisplayCount(prev => prev + ITEMS_PER_PAGE);
  };

  // Gösterilecek aksiyonları slice ile sınırla
  const displayedPendingActions = department.pendingActionsList.slice(0, pendingDisplayCount);
  const displayedCompletedActions = department.completedActionsList.slice(0, completedDisplayCount);

  // Daha fazla aksiyon var mı kontrol et
  const hasMorePendingActions = department.pendingActionsList.length > pendingDisplayCount;
  const hasMoreCompletedActions = department.completedActionsList.length > completedDisplayCount;

  return (
    <>
      {/* Bekleyen Aksiyonlar */}
      <div className={styles.categoryGroup}>
        <div 
          className={styles.categoryHeader}
          onTouchStart={(e) => {
            e.preventDefault();
            hapticFeedback.navigation.select();
          }}
          onMouseDown={(e) => {
            e.preventDefault();
            hapticFeedback.navigation.select();
          }}
          onClick={(e) => {
            e.preventDefault();
            setIsPendingActionsCollapsed(!isPendingActionsCollapsed);
          }}
        >
          <div className={styles.categoryTitle}>
            <span className={styles.categoryIcon}>
              {isPendingActionsCollapsed ? '▶' : '▼'}
            </span>
            <h3 className={styles.categoryName}>Bekleyen Aksiyonlar</h3>
            <div className={styles.categoryStats}>
              <span className={styles.actionCount}>({department.pendingActionsList.length})</span>
            </div>
          </div>
        </div>
        {!isPendingActionsCollapsed && (
          department.pendingActionsList.length > 0 ? (
            <div className={styles.categoryContent}>
              {displayedPendingActions.map((action) => (
                <div 
                  key={action.id} 
                  className={styles.actionItem}
                  onTouchStart={(e) => {
                    e.preventDefault();
                    hapticFeedback.button.primary();
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    hapticFeedback.button.primary();
                  }}

                  onClick={(e) => {
                    e.preventDefault();
                    handleActionClick(action);
                  }}
                >
                  <p className={styles.actionDescription}>
                    <strong>{action.question}</strong><br />
                    {truncateText(action.description)}
                  </p>
                  <span className={styles.actionScore}>
                    {new Date(action.dueDate).toLocaleDateString('tr-TR')}
                  </span>
                </div>
              ))}
              
              {/* Daha Fazla Göster Butonu - Bekleyen */}
              {hasMorePendingActions && (
                <div className={styles.loadMoreContainer}>
                  <button 
                    className={styles.loadMoreButton}
                    onTouchStart={(e) => {
                      e.preventDefault();
                      hapticFeedback.button.secondary();
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      hapticFeedback.button.secondary();
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      handleShowMorePending();
                    }}
                  >
                    Daha Fazlası İçin Tıkla ({department.pendingActionsList.length - pendingDisplayCount} kalan)
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className={styles.categoryContent}>
              <p className={styles.noActions}>{truncateText("Bekleyen aksiyon bulunmuyor.")}</p>
            </div>
          )
        )}
      </div>

      {/* Tamamlanan Aksiyonlar */}
      <div className={styles.categoryGroup}>
        <div 
          className={styles.categoryHeader}
          onTouchStart={(e) => {
            e.preventDefault();
            hapticFeedback.navigation.select();
          }}
          onMouseDown={(e) => {
            e.preventDefault();
            hapticFeedback.navigation.select();
          }}
          onClick={(e) => {
            e.preventDefault();
            setIsCompletedActionsCollapsed(!isCompletedActionsCollapsed);
          }}
        >
          <div className={styles.categoryTitle}>
            <span className={styles.categoryIcon}>
              {isCompletedActionsCollapsed ? '▶' : '▼'}
            </span>
            <h3 className={styles.categoryName}>Tamamlanan Aksiyonlar</h3>
            <div className={styles.categoryStats}>
              <span className={styles.actionCount}>({department.completedActionsList.length})</span>
            </div>
          </div>
        </div>
        {!isCompletedActionsCollapsed && (
          department.completedActionsList.length > 0 ? (
            <div className={styles.categoryContent}>
              {displayedCompletedActions.map((action) => (
                <div 
                  key={action.id} 
                  className={`${styles.actionItem} ${styles.completedAction}`}
                  onTouchStart={(e) => {
                    e.preventDefault();
                    hapticFeedback.button.primary();
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    hapticFeedback.button.primary();
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    handleActionClick(action);
                  }}
                >
                  <p className={styles.actionDescription}>
                    <strong>{action.question}</strong><br />
                    {truncateText(action.description)}
                  </p>
                  <span className={styles.actionScore}>
                    Tamamlandı: {new Date(action.dueDate).toLocaleDateString('tr-TR')}
                  </span>
                </div>
              ))}
              
              {/* Daha Fazla Göster Butonu - Tamamlanan */}
              {hasMoreCompletedActions && (
                <div className={styles.loadMoreContainer}>
                  <button 
                    className={styles.loadMoreButton}
                    onTouchStart={(e) => {
                      e.preventDefault();
                      hapticFeedback.button.secondary();
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      hapticFeedback.button.secondary();
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      handleShowMoreCompleted();
                    }}
                  >
                    Daha Fazlası İçin Tıkla ({department.completedActionsList.length - completedDisplayCount} kalan)
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className={styles.categoryContent}>
              <p className={styles.noActions}>{truncateText("Tamamlanan aksiyon bulunmuyor.")}</p>
            </div>
          )
        )}
      </div>

      {/* Aksiyon Detay Popup'ı */}
      {isActionDetailOpen && selectedAction && (
        <ActionDetailPopup
          selectedAction={selectedAction}
          isDueDateEditable={true}
          isCompletedButtonEnabled={false}
          onClose={() => {
            setIsActionDetailOpen(false);
            setSelectedAction(null);
          }}
        />
      )}
    </>
  );
}