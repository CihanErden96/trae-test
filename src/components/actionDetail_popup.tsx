"use client";

import React, { useState, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import styles from '../styles/card.module.css';
import Calendar from './calendar';
import { Action } from './const';

interface ActionDetailPopupProps {
  selectedAction: Action | null;
  isDueDateEditable?: boolean;
  isCompletedButtonEnabled?: boolean;
  onActionUpdate?: (updatedAction: Action) => void;
  onClose?: () => void;
}

const ActionDetailPopup: React.FC<ActionDetailPopupProps> = ({
  selectedAction,
  isDueDateEditable = false,
  isCompletedButtonEnabled = false,
  onActionUpdate,
  onClose
}) => {
  const [isOpen, setIsOpen] = useState(!!selectedAction);
  const [currentAction, setCurrentAction] = useState<Action | null>(selectedAction);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [tempStartDate, setTempStartDate] = useState<string>('');
  const [tempEndDate, setTempEndDate] = useState<string>('');
   

  // Bugünün tarihi
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const formatDateToString = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const todayString = formatDateToString(today);

  // selectedAction değiştiğinde state'i güncelle
  useEffect(() => {
    setCurrentAction(selectedAction);
    setIsOpen(!!selectedAction);
  }, [selectedAction]);

  const handleClose = () => {
    setIsOpen(false);
    setCurrentAction(null);
    if (onClose) {
      onClose();
    }
  };

  const handleOverlayClick = (e: React.MouseEvent | React.TouchEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleDueDateClick = () => {
    if (isDueDateEditable) {
      setIsCalendarOpen(true);
      // Mevcut due date'i başlangıç olarak ayarla
      if (currentAction?.dueDate) {
        setTempEndDate(currentAction.dueDate);
      }
      setTempStartDate(todayString);
    }
  };

  const handleDateRangeChange = useCallback((start: string, end: string) => {
    setTempStartDate(start);
    setTempEndDate(end);
  }, []);

  const handleCalendarSave = () => {
    if (tempEndDate && currentAction) {
      const currentCount = currentAction.dueDateUpdateCount || 0;
      const updatedAction = { 
        ...currentAction, 
        dueDate: tempEndDate,
        dueDateUpdateCount: currentCount + 1
      };
      setCurrentAction(updatedAction);
      if (onActionUpdate) {
        onActionUpdate(updatedAction);
      }
    }
    setIsCalendarOpen(false);
  };

  const handleCalendarCancel = () => {
    setIsCalendarOpen(false);
    setTempStartDate('');
    setTempEndDate('');
  };

  const handleToggleStatus = () => {
    if (currentAction) {
      const newStatus = currentAction.status === 'act' ? 'plan' : 'act';
      const updatedAction = { 
        ...currentAction, 
        status: newStatus as 'plan' | 'do' | 'check' | 'act',
        completedDate: newStatus === 'act' ? new Date().toISOString().split('T')[0] : undefined
      };
      setCurrentAction(updatedAction);
      if (onActionUpdate) {
        onActionUpdate(updatedAction);
      }
    }
  };

  if (!isOpen || !currentAction) {
    return null;
  }

  return createPortal(
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
        handleOverlayClick(e);
      }}
    >
      <div 
        className={styles.popup} 
        onTouchStart={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
      >
        <div className='popup-header'>
          <h2 className='popup-title'>Aksiyon Detayı</h2>
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
              handleClose();
            }}
            aria-label="Kapat"
          >
            ×
          </button>
        </div>
        
        <div className={styles.content}>
          <div className={styles.actionDetailContent}>
            
            {/* Soru */}
            <div className={styles.detailSection}>
              <h4 className={styles.detailLabel}>Soru</h4>
              <p className={styles.detailText}>
                {currentAction.question || currentAction.description || 'Soru bulunmuyor'}
              </p>
            </div>

            {/* Açıklama */}
            <div className={styles.detailSection}>
              <h4 className={styles.detailLabel}>Açıklama</h4>
              <p className={styles.detailText}>
                {currentAction.description || 'Açıklama bulunmuyor'}
              </p>
            </div>

            {/* Tarihler - Yan Yana */}
            <div className={styles.dateRow}>
              <div className={styles.detailSection}>
                <h4 className={styles.detailLabel}>Başlangıç Tarihi</h4>
                <p className={styles.detailText}>
                  {currentAction.startDate || 'Belirtilmemiş'}
                </p>
              </div>
              <div className={styles.detailSection}>
                <h4 className={styles.detailLabel}>Termin Tarihi</h4>
                {isDueDateEditable ? (
                  <button 
                    className={styles.dueDateButton}
                    onClick={handleDueDateClick}
                    type="button"
                  >
                    {currentAction.dueDate ? 
                      (typeof currentAction.dueDate === 'string' ? 
                        new Date(currentAction.dueDate).toLocaleDateString('tr-TR') : 
                        currentAction.dueDate
                      ) : 
                      'Belirsiz'
                    }
                    {currentAction.dueDateUpdateCount && currentAction.dueDateUpdateCount > 0 && 
                      ` (${currentAction.dueDateUpdateCount})`
                    }
                  </button>
                ) : (
                  <p className={styles.detailText}>
                    {currentAction.dueDate ? 
                      (typeof currentAction.dueDate === 'string' ? 
                        new Date(currentAction.dueDate).toLocaleDateString('tr-TR') : 
                        currentAction.dueDate
                      ) : 
                      'Belirsiz'
                    }
                    {currentAction.dueDateUpdateCount && currentAction.dueDateUpdateCount > 0 && 
                      ` (${currentAction.dueDateUpdateCount})`
                    }
                  </p>
                )}
              </div>
              {/* Tamamlanma Tarihi - Her zaman görünür */}
              <div className={styles.detailSection}>
                <h4 className={styles.detailLabel}>Tamamlanma Tarihi</h4>
                <p className={styles.detailText}>
                  {currentAction.completedDate || 'Belirsiz'}
                </p>
              </div>
            </div>

            {/* Departman, Oluşturan ve Sorumlu - Yan Yana */}
            <div className={styles.infoRow}>
              <div className={styles.detailSection}>
                <h4 className={styles.detailLabel}>Departman</h4>
                <p className={styles.detailText}>
                  {currentAction.department || 'Belirtilmemiş'}
                </p>
              </div>
              <div className={styles.detailSection}>
                <h4 className={styles.detailLabel}>Oluşturan</h4>
                <p className={styles.detailText}>
                  {currentAction.creator || 'Belirtilmemiş'}
                </p>
              </div>
              <div className={styles.detailSection}>
                <h4 className={styles.detailLabel}>Sorumlu</h4>
                <p className={styles.detailText}>
                  {currentAction.assignedTo || 'Belirtilmemiş'}
                </p>
              </div>
            </div>

            {/* Durum */}
            <div className={styles.detailSection}>
              <h4 className={styles.detailLabel}>Durum</h4>
              <p className={styles.detailText}>
                {currentAction.status === 'act' ? 'Tamamlandı' : 'Tamamlanmadı'}
              </p>
            </div>

            {/* Fotoğraf Alanı */}
            <div className={`${styles.detailSection} ${styles.imageSection}`}>
              <h4 className={styles.detailLabel}>Fotoğraf</h4>
              {currentAction.image ? (
                <div className={styles.imagePreview} style={{ maxWidth: '100%' }}>
                  <Image 
                    src={currentAction.image} 
                    alt="Aksiyon fotoğrafı"
                    className={styles.actionImage}
                    width={400}
                    height={0}
                    style={{ 
                      objectFit: 'cover',
                      height: 'auto',
                      width: '100%',
                      maxWidth: '100%'
                    }}
                  />
                </div>
              ) : (
                <div className={styles.noImageContainer}>
                  <p className={styles.noImageText}>Fotoğraf yok</p>
                </div>
              )}
            </div>

            {/* Durum Değiştirme Butonu - Opsiyonel */}
            {isCompletedButtonEnabled && (
              <div className={styles.actionButtons}>
                <button
                  onClick={handleToggleStatus}
                  className={`${styles.statusToggleButton} ${styles.markCompleteButton}`}
                >
                  {currentAction.status === 'act' 
                    ? 'Tamamlanmadı olarak işaretle' 
                    : 'Tamamlandı olarak işaretle'
                  }
                </button>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Tarih Seçimi Popup'ı */}
      {isCalendarOpen && createPortal(
        <div 
          className={styles.overlay}
          onClick={handleCalendarCancel}
        >
          <div 
            className={styles.popup}
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '400px' }}
          >
            <div className='popup-header'>
              <h2 className='popup-title'>Termin Tarihi Seç</h2>
              <button 
                className='popup-close-button'
                onClick={handleCalendarCancel}
                aria-label="Kapat"
              >
                ×
              </button>
            </div>
            
            <div className={styles.content}>
              <Calendar
                isStartDateDisabled={true}
                onDateRangeChange={handleDateRangeChange}
                initialStartDate={todayString}
                initialEndDate={tempEndDate}
              />
              
              <div className={styles.actionButtons} style={{ marginTop: '20px' }}>
                <button
                  onClick={handleCalendarCancel}
                  className={styles.cancelButton}
                  style={{ marginRight: '10px' }}
                >
                  İptal
                </button>
                <button
                  onClick={handleCalendarSave}
                  className={styles.deleteConfirmButton}
                  disabled={!tempEndDate}
                >
                  Kaydet
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>,
    document.body
  );
};

export default ActionDetailPopup;