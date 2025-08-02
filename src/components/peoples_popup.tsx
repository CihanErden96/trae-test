"use client";

import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import styles from '../styles/footer_popup.module.css';
import { hapticFeedback } from '../utils/haptic';
import { Person, peoplesData, truncateText } from './const';

interface PeoplesPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PeoplesPopup({ isOpen, onClose }: PeoplesPopupProps) {
  const [peoples, setPeoples] = useState<Person[]>(peoplesData);

  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    personId: number | null;
    personName: string;
  }>({
    isOpen: false,
    personId: null,
    personName: ''
  });

  const handleDeleteClick = (person: Person) => {
    hapticFeedback.button.danger();
    setDeleteConfirmation({
      isOpen: true,
      personId: person.id,
      personName: `${person.name} ${person.surname}`
    });
  };

  const handleConfirmDelete = () => {
    hapticFeedback.action.delete();
    if (deleteConfirmation.personId) {
      setPeoples(prev => prev.filter(person => person.id !== deleteConfirmation.personId));
    }
    setDeleteConfirmation({
      isOpen: false,
      personId: null,
      personName: ''
    });
  };

  const handleCancelDelete = () => {
    hapticFeedback.action.cancel();
    setDeleteConfirmation({
      isOpen: false,
      personId: null,
      personName: ''
    });
  };

  const handleOverlayClick = (e: React.MouseEvent | React.TouchEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleCloseButton = () => {
    onClose();
  };

  if (!isOpen) return null;

  return createPortal(
    <div className={styles.overlay} 
         onTouchStart={(e) => {e.preventDefault();hapticFeedback.navigation.open();}}
         onMouseDown={(e) => {e.preventDefault();hapticFeedback.navigation.open();}}
         onClick={(e) => {e.preventDefault();handleOverlayClick(e);}}>
      <div className={styles.popup} 
           onTouchStart={(e) => {e.preventDefault();e.stopPropagation();}}
           onMouseDown={(e) => {e.preventDefault();e.stopPropagation();}}
           onClick={(e) => {e.preventDefault();e.stopPropagation();}}>
        <div className="popup-header">

          <h2 className="popup-title">Personel Listesi</h2>
          <button className="popup-close-button" 
                  onTouchStart={(e) => {e.preventDefault();hapticFeedback.light();}}
                  onMouseDown={(e) => {e.preventDefault();hapticFeedback.light();}}
                  onClick={(e) => {e.preventDefault();handleCloseButton();}}>
            ×
          </button>
        </div>

        <div className={styles.content}>
          <div className={styles.questionsList}>
            {/* People List */}
            {peoples.map((person) => (
              <div key={person.id} className={styles.questionItem}>
                <div className={styles.questionHeader}>
                  <div style={{ flex: 1 }}>
                    <h3 className={styles.questionTitle}>
                      {person.name} {person.surname}
                    </h3>
                    <p className={styles.questionDescription}>
                       <strong>Rol:</strong> {truncateText(person.title)}
                     </p>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                    <button
                      onTouchStart={(e) => {e.preventDefault();hapticFeedback.button.danger();}}
                      onMouseDown={(e) => {e.preventDefault();hapticFeedback.button.danger();}}
                      onClick={(e) => {e.preventDefault();handleDeleteClick(person);}}
                      style={{
                        background: '#dc2626',
                        color: 'white',
                        border: 'none',
                        padding: '6px 12px',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        cursor: 'pointer',
                        fontWeight: '600'
                      }}
                    >
                      Sil
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Popup */}
      {deleteConfirmation.isOpen && (
        <div className={styles.overlay} 
             onTouchStart={(e) => {e.preventDefault();hapticFeedback.navigation.close();}}
             onMouseDown={(e) => {e.preventDefault();hapticFeedback.navigation.close();}}
             onClick={(e) => {e.preventDefault();handleCancelDelete();}}>
          <div 
            className={`${styles.popup} ${styles.confirmationPopup}`}
            onTouchStart={(e) => {e.preventDefault();e.stopPropagation();}}
            onMouseDown={(e) => {e.preventDefault();e.stopPropagation();}}
            onClick={(e) => {e.preventDefault();e.stopPropagation();}}
          >
            <div className="popup-header">
              <h2 className="popup-title">Emin misiniz?</h2>
              <button className="popup-close-button" 
                      onClick={handleCancelDelete}>
                ×
              </button>
            </div>
            <div className={styles.content}>
              <div className={styles.confirmationContent}>
                <div className={styles.confirmationIcon}>
                </div>
                <p className={styles.confirmationMessage}>
                  <strong>{deleteConfirmation.personName}</strong> {truncateText("adlı personeli silmek istediğinizden emin misiniz?")}
                </p>
                <p className={styles.confirmationWarning}>
                  {truncateText("Bu işlem geri alınamaz.")}
                </p>
                <div className={styles.confirmationActions}>
                  <button
                    className={styles.cancelButton}
                    onClick={handleCancelDelete}
                  >
                    İptal
                  </button>
                  <button
                    className={styles.deleteButton}
                    onClick={handleConfirmDelete}
                  >
                    Sil
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>,
    document.body
  );
}