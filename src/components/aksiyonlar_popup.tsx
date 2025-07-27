"use client";

import React, { useState } from 'react';
import popupStyles from '../styles/footer_popup.module.css';

// Metin kısaltma utility fonksiyonu
const truncateText = (text: string, maxLength: number = 100): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

interface Action {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
}

interface Department {
  id: number;
  name: string;
  score: number;
  completedActions: number;
  pendingActions: number;
  pendingActionsList: Action[];
  completedActionsList: Action[];
}

interface AksiyonlarPopupProps {
  department: Department;
  isPendingActionsCollapsed: boolean;
  setIsPendingActionsCollapsed: (value: boolean) => void;
  isCompletedActionsCollapsed: boolean;
  setIsCompletedActionsCollapsed: (value: boolean) => void;
}

export default function AksiyonlarPopup({ 
  department,
  isPendingActionsCollapsed,
  setIsPendingActionsCollapsed,
  isCompletedActionsCollapsed,
  setIsCompletedActionsCollapsed
}: AksiyonlarPopupProps) {

  return (
    <>
      {/* Bekleyen Aksiyonlar */}
      <div className={popupStyles.categoryGroup}>
        <div 
          className={popupStyles.categoryHeader}
          onClick={() => setIsPendingActionsCollapsed(!isPendingActionsCollapsed)}
        >
          <div className={popupStyles.categoryTitle}>
            <span className={popupStyles.categoryIcon}>
              {isPendingActionsCollapsed ? '▶' : '▼'}
            </span>
            <h3 className={popupStyles.categoryName}>Bekleyen Aksiyonlar</h3>
            <div className={popupStyles.categoryStats}>
              <span className={popupStyles.questionCount}>({department.pendingActionsList.length})</span>
            </div>
          </div>
        </div>
        {!isPendingActionsCollapsed && (
          department.pendingActionsList.length > 0 ? (
            <div className={popupStyles.categoryContent}>
              {department.pendingActionsList.map((action) => (
                <div key={action.id} className={popupStyles.questionItem} style={{ position: 'relative' }}>
                  <p className={popupStyles.questionDescription} style={{ 
                    position: 'relative',
                    paddingBottom: '40px',
                    marginBottom: '0'
                  }}>
                    {truncateText(action.description)}
                  </p>
                  <span className={popupStyles.questionScore} style={{ 
                    position: 'absolute', 
                    bottom: '12px', 
                    right: '12px',
                    fontSize: '0.75rem',
                    padding: '4px 8px'
                  }}>
                    {action.dueDate}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className={popupStyles.categoryContent}>
              <p className={popupStyles.noActions}>{truncateText("Bekleyen aksiyon bulunmuyor.")}</p>
            </div>
          )
        )}
      </div>

      {/* Tamamlanan Aksiyonlar */}
      <div className={popupStyles.categoryGroup}>
        <div 
          className={popupStyles.categoryHeader}
          onClick={() => setIsCompletedActionsCollapsed(!isCompletedActionsCollapsed)}
        >
          <div className={popupStyles.categoryTitle}>
            <span className={popupStyles.categoryIcon}>
              {isCompletedActionsCollapsed ? '▶' : '▼'}
            </span>
            <h3 className={popupStyles.categoryName}>Tamamlanan Aksiyonlar</h3>
            <div className={popupStyles.categoryStats}>
              <span className={popupStyles.questionCount}>({department.completedActionsList.length})</span>
            </div>
          </div>
        </div>
        {!isCompletedActionsCollapsed && (
          department.completedActionsList.length > 0 ? (
            <div className={popupStyles.categoryContent}>
              {department.completedActionsList.map((action) => (
                <div key={action.id} className={`${popupStyles.questionItem} ${popupStyles.completedAction}`} style={{ position: 'relative' }}>
                  <p className={popupStyles.questionDescription} style={{ 
                    position: 'relative',
                    paddingBottom: '40px',
                    marginBottom: '0'
                  }}>
                    {truncateText(action.description)}
                  </p>
                  <span className={popupStyles.questionScore} style={{ 
                    position: 'absolute', 
                    bottom: '12px', 
                    right: '12px',
                    fontSize: '0.75rem',
                    padding: '4px 8px'
                  }}>
                    Tamamlandı: {action.dueDate}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className={popupStyles.categoryContent}>
              <p className={popupStyles.noActions}>{truncateText("Tamamlanan aksiyon bulunmuyor.")}</p>
            </div>
          )
        )}
      </div>
    </>
  );
}