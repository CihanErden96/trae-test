"use client";

import React, { useState } from 'react';
import styles from '../styles/popup.module.css';

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
    setDeleteConfirmation({
      isOpen: true,
      personId: person.id,
      personName: `${person.name} ${person.surname}`
    });
  };

  const handleConfirmDelete = () => {
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
    setDeleteConfirmation({
      isOpen: false,
      personId: null,
      personName: ''
    });
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.popup} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <span className={styles.totalAllScore}>
              {peoples.length} Kişi
            </span>
          </div>
          <h2 className={styles.title}>Personel Listesi</h2>
          <button className={styles.closeButton} onClick={onClose}>
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
                       <strong>Rol:</strong> {person.title}
                     </p>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                    <button
                      onClick={() => handleDeleteClick(person)}
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
        <div className={styles.overlay} onClick={handleCancelDelete}>
          <div 
            className={`${styles.popup} ${styles.confirmationPopup}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.header}>
              <h2 className={styles.title}>Emin misiniz?</h2>
              <button className={styles.closeButton} onClick={handleCancelDelete}>
                ×
              </button>
            </div>
            <div className={styles.content}>
              <div className={styles.confirmationContent}>
                <div className={styles.confirmationIcon}>
                </div>
                <p className={styles.confirmationMessage}>
                  <strong>{deleteConfirmation.personName}</strong> adlı personeli silmek istediğinizden emin misiniz?
                </p>
                <p className={styles.confirmationWarning}>
                  Bu işlem geri alınamaz.
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
    </div>
  );
}