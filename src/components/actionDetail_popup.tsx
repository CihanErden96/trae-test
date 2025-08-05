"use client";

import React, { useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import styles from '../styles/card.module.css';
import Calendar from './calendar';
import { Action } from './const';

interface ActionDetailPopupProps {
  isOpen: boolean;
  onClose: () => void;
  selectedAction: Action | null;
  isDueDateEditable?: boolean;
  isCompletedButtonEnabled?: boolean;
  onToggleStatus?: () => void;
  onDueDateChange?: (newDueDate: string) => void;
}

const ActionDetailPopup: React.FC<ActionDetailPopupProps> = ({
  isOpen,
  onClose,
  selectedAction,
  isDueDateEditable = false,
  isCompletedButtonEnabled = false,
  onToggleStatus,
  onDueDateChange
}) => {
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

  const handleOverlayClick = (e: React.MouseEvent | React.TouchEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleDueDateClick = () => {
    if (isDueDateEditable) {
      setIsCalendarOpen(true);
      // Mevcut due date'i başlangıç olarak ayarla
      if (selectedAction?.dueDate) {
        setTempEndDate(selectedAction.dueDate);
      }
      setTempStartDate(todayString);
    }
  };

  const handleDateRangeChange = useCallback((start: string, end: string) => {
    setTempStartDate(start);
    setTempEndDate(end);
  }, []);

  const handleCalendarSave = () => {
    if (tempEndDate && onDueDateChange) {
      onDueDateChange(tempEndDate);
    }
    setIsCalendarOpen(false);
  };

  const handleCalendarCancel = () => {
    setIsCalendarOpen(false);
    setTempStartDate('');
    setTempEndDate('');
  };

  if (!isOpen || !selectedAction) {
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
              onClose();
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
                {selectedAction.question || selectedAction.title || 'Soru bulunmuyor'}
              </p>
            </div>

            {/* Açıklama */}
            <div className={styles.detailSection}>
              <h4 className={styles.detailLabel}>Açıklama</h4>
              <p className={styles.detailText}>
                {selectedAction.description || 'Açıklama bulunmuyor'}
              </p>
            </div>

            {/* Tarihler - Yan Yana */}
            <div className={styles.dateRow}>
              <div className={styles.detailSection}>
                <h4 className={styles.detailLabel}>Başlangıç Tarihi</h4>
                <p className={styles.detailText}>
                  {selectedAction.startDate || 'Belirtilmemiş'}
                </p>
              </div>
              <div className={styles.detailSection}>
                <h4 className={styles.detailLabel}>Termin Tarihi</h4>
                <p 
                  className={`${styles.detailText} ${isDueDateEditable ? styles.editableDate : ''}`}
                  onClick={handleDueDateClick}
                  style={{ 
                    cursor: isDueDateEditable ? 'pointer' : 'default',
                    textDecoration: isDueDateEditable ? 'underline' : 'none'
                  }}
                >
                  {selectedAction.dueDate ? 
                    (typeof selectedAction.dueDate === 'string' ? 
                      new Date(selectedAction.dueDate).toLocaleDateString('tr-TR') : 
                      selectedAction.dueDate
                    ) : 
                    'Belirtilmemiş'
                  }
                </p>
              </div>
              {/* Tamamlanma Tarihi - Her zaman görünür */}
              <div className={styles.detailSection}>
                <h4 className={styles.detailLabel}>Tamamlanma Tarihi</h4>
                <p className={styles.detailText}>
                  {selectedAction.completedDate || 'Tamamlanmamış'}
                </p>
              </div>
            </div>

            {/* Departman, Oluşturan ve Sorumlu - Yan Yana */}
            <div className={styles.infoRow}>
              <div className={styles.detailSection}>
                <h4 className={styles.detailLabel}>Departman</h4>
                <p className={styles.detailText}>
                  {selectedAction.department || 'Belirtilmemiş'}
                </p>
              </div>
              <div className={styles.detailSection}>
                <h4 className={styles.detailLabel}>Oluşturan</h4>
                <p className={styles.detailText}>
                  {selectedAction.creator || 'Belirtilmemiş'}
                </p>
              </div>
              <div className={styles.detailSection}>
                <h4 className={styles.detailLabel}>Sorumlu</h4>
                <p className={styles.detailText}>
                  {selectedAction.assignedTo || 'Belirtilmemiş'}
                </p>
              </div>
            </div>

            {/* Durum */}
            <div className={styles.detailSection}>
              <h4 className={styles.detailLabel}>Durum</h4>
              <p className={styles.detailText}>
                {selectedAction.status === 'completed' ? 'Tamamlandı' : 'Tamamlanmadı'}
              </p>
            </div>

            {/* Fotoğraf Alanı */}
            <div className={styles.detailSection}>
              <h4 className={styles.detailLabel}>Fotoğraf</h4>
              {selectedAction.image ? (
                <div className={styles.imagePreview} style={{ maxWidth: '100%' }}>
                  <Image 
                    src={selectedAction.image} 
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
            {isCompletedButtonEnabled && onToggleStatus && (
              <div className={styles.actionButtons}>
                <button
                  onClick={onToggleStatus}
                  className={`${styles.statusToggleButton} ${styles.markCompleteButton}`}
                >
                  {selectedAction.status === 'completed' 
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
                  className={styles.saveButton}
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