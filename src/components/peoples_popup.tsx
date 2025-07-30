"use client";

import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import styles from '../styles/footer_popup.module.css';
import { hapticFeedback } from '../utils/haptic';

// Metin kısaltma utility fonksiyonu
const truncateText = (text: string, maxLength: number = 100): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

interface Person {
  id: number;
  name: string;
  surname: string;
  title: string;
  department: string;
}

interface PeoplesPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PeoplesPopup({ isOpen, onClose }: PeoplesPopupProps) {
  const [peoples, setPeoples] = useState<Person[]>([
    {
      id: 1,
      name: "Ahmet",
      surname: "Yılmaz",
      title: "Yazılım Geliştirici",
      department: "Bilgi İşlem"
    },
    {
      id: 2,
      name: "Ayşe",
      surname: "Kaya",
      title: "Proje Yöneticisi",
      department: "İnsan Kaynakları"
    },
    {
      id: 3,
      name: "Mehmet",
      surname: "Demir",
      title: "Sistem Yöneticisi",
      department: "Bilgi İşlem"
    },
    {
      id: 4,
      name: "Fatma",
      surname: "Şahin",
      title: "Muhasebe Uzmanı",
      department: "Mali İşler"
    },
    {
      id: 5,
      name: "Ali",
      surname: "Özkan",
      title: "Satış Temsilcisi",
      department: "Satış"
    }
  ]);

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
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <span className={styles.totalAllScore}>
              {peoples.length} Kişi
            </span>
          </div>
          <h2 className={styles.title}>Personel Listesi</h2>
          <button className={styles.closeButton} 
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
            <div className={styles.header}>
              <h2 className={styles.title}>Emin misiniz?</h2>
              <button className={styles.closeButton} 
                      onTouchStart={(e) => {e.preventDefault();hapticFeedback.navigation.close();}}
                      onMouseDown={(e) => {e.preventDefault();hapticFeedback.navigation.close();}}
                      onClick={(e) => {e.preventDefault();handleCancelDelete();}}>
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
                    onTouchStart={(e) => {e.preventDefault();hapticFeedback.action.cancel();}}
                    onMouseDown={(e) => {e.preventDefault();hapticFeedback.action.cancel();}}
                    onClick={(e) => {e.preventDefault();handleCancelDelete();}}
                  >
                    İptal
                  </button>
                  <button
                    className={styles.deleteButton}
                    onTouchStart={(e) => {e.preventDefault();hapticFeedback.action.delete();}}
                    onMouseDown={(e) => {e.preventDefault();hapticFeedback.action.delete();}}
                    onClick={(e) => {e.preventDefault();handleConfirmDelete();}}
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