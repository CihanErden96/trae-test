"use client";

import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import popupStyles from '../styles/footer_popup.module.css';
import AksiyonlarPopup from './card_aksiyonlar';
import { hapticFeedback } from '../utils/haptic';
import { Department, truncateText, departmentsData } from './const';

interface DepartmentsPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DepartmentsPopup({ isOpen, onClose }: DepartmentsPopupProps) {
  const [departments, setDepartments] = useState<Department[]>(departmentsData);

  const [isAddDepartmentOpen, setIsAddDepartmentOpen] = useState(false);
  const [newDepartmentName, setNewDepartmentName] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [isDepartmentDetailOpen, setIsDepartmentDetailOpen] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [departmentToDelete, setDepartmentToDelete] = useState<Department | null>(null);
  const [isPendingActionsCollapsed, setIsPendingActionsCollapsed] = useState(false);
  const [isCompletedActionsCollapsed, setIsCompletedActionsCollapsed] = useState(true);
  const [editedDepartmentName, setEditedDepartmentName] = useState('');

  const handleAddDepartment = () => {
    hapticFeedback.action.create();
    setIsAddDepartmentOpen(true);
  };

  const handleCloseAddDepartment = () => {
    hapticFeedback.navigation.close();
    setIsAddDepartmentOpen(false);
    setNewDepartmentName('');
  };

  const handleSaveDepartment = () => {
    if (newDepartmentName.trim()) {
      hapticFeedback.action.save();
      const newId = Math.max(...departments.map(d => d.id)) + 1;
      const newDepartment: Department = {
        id: newId,
        name: newDepartmentName.trim(),
        score: 100,
        completedActions: 0,
        pendingActions: 0,
        pendingActionsList: [],
        completedActionsList: []
      };
      
      setDepartments(prevDepartments => [...prevDepartments, newDepartment]);
      handleCloseAddDepartment();
    } else {
      hapticFeedback.form.error();
    }
  };

  const handleDepartmentClick = (department: Department) => {
    hapticFeedback.navigation.select();
    setSelectedDepartment(department);
    setEditedDepartmentName(department.name);
    setIsDepartmentDetailOpen(true);
  };

  const handleCloseDepartmentDetail = () => {
    hapticFeedback.navigation.close();
    setIsDepartmentDetailOpen(false);
    setSelectedDepartment(null);
    setEditedDepartmentName('');
  };

  const handleSaveEditDepartment = () => {
    if (selectedDepartment && editedDepartmentName.trim() && editedDepartmentName.trim() !== selectedDepartment.name) {
      hapticFeedback.action.save();
      setDepartments(prevDepartments => 
        prevDepartments.map(dept => 
          dept.id === selectedDepartment.id 
            ? { ...dept, name: editedDepartmentName.trim() }
            : dept
        )
      );
      setSelectedDepartment(prev => prev ? { ...prev, name: editedDepartmentName.trim() } : null);
    } else if (editedDepartmentName.trim() === '') {
      hapticFeedback.form.error();
    }
    // Departman detay popup'ını kapat ve ana listeye dön
    handleCloseDepartmentDetail();
  };

  const handleCancelEditDepartment = () => {
    hapticFeedback.action.cancel();
    // İptal butonuna basıldığında detay popup'ını kapat
    handleCloseDepartmentDetail();
  };

  const handleDeleteDepartment = (department: Department) => {
    hapticFeedback.button.danger();
    setDepartmentToDelete(department);
    setShowDeleteConfirmation(true);
  };

  const confirmDeleteDepartment = () => {
    hapticFeedback.action.delete();
    if (departmentToDelete) {
      setDepartments(prevDepartments => 
        prevDepartments.filter(dept => dept.id !== departmentToDelete.id)
      );
      setShowDeleteConfirmation(false);
      setDepartmentToDelete(null);
      setIsDepartmentDetailOpen(false);
      setSelectedDepartment(null);
    }
  };

  const cancelDeleteDepartment = () => {
    hapticFeedback.action.cancel();
    setShowDeleteConfirmation(false);
    setDepartmentToDelete(null);
  };

  const handleOverlayClick = (e: React.MouseEvent | React.TouchEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };



  if (!isOpen) return null;

  return createPortal(
    <>
      <div className={popupStyles.overlay} 
           onClick={(e) => {e.preventDefault();if (e.target === e.currentTarget) {hapticFeedback.navigation.close();handleOverlayClick(e);}}}>
        <div 
          className={popupStyles.popup} 
          onClick={(e) => e.stopPropagation()}
        >
          <div className={popupStyles.header}>
            <h2 className={popupStyles.title}>Departmanlar</h2>
            <button 
              className={popupStyles.closeButton}
              onClick={(e) => {e.preventDefault();hapticFeedback.navigation.close();onClose();}}
              aria-label="Kapat"
            >
              ×
            </button>
          </div>
          
          <div className={popupStyles.content}>
            <div className={popupStyles.departmentsList}>
              {departments.map((department) => (
                <div 
                  key={department.id} 
                  className={popupStyles.departmentCard}
                  onClick={(e) => {e.preventDefault();hapticFeedback.medium();handleDepartmentClick(department);}}
                >
                  <div className={popupStyles.departmentHeader}>
                    <h3 className={popupStyles.departmentName}>{department.name}</h3>
                    <div className={popupStyles.departmentScore}>{department.score}</div>
                  </div>
                  <div className={popupStyles.departmentStats}>
                    <div className={popupStyles.completedActions}>
                      <span className={popupStyles.actionLabel}>Biten Aksiyon</span>
                      <span className={popupStyles.actionCount}>{department.completedActions}</span>
                    </div>
                    <div className={popupStyles.pendingActions}>
                      <span className={popupStyles.actionLabel}>Bekleyen Aksiyon</span>
                      <span className={popupStyles.actionCount}>{department.pendingActions}</span>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Yeni Departman Ekle Butonu */}
              <div className={popupStyles.addDepartmentItem} 
                   onClick={(e) => {e.preventDefault();hapticFeedback.action.create();handleAddDepartment();}}>
                <div className={popupStyles.addDepartmentContent}>
                  <div className={popupStyles.addIcon}>+</div>
                  <div className={popupStyles.addText}>
                    <h3 className={popupStyles.addTitle}>Yeni Departman Ekle</h3>
                    <p className={popupStyles.addDescription}>{truncateText("Yeni bir departman oluşturmak için tıklayın")}</p>
                  </div>
                </div>
              </div>
              
            </div>
          </div>
        </div>

        {/* Yeni Departman Ekleme Popup'ı */}
        {isAddDepartmentOpen && (
          <div className={popupStyles.overlay} 
               onClick={(e) => {e.preventDefault();if (e.target === e.currentTarget) {hapticFeedback.navigation.close();handleCloseAddDepartment();}}}>
            <div 
            className={popupStyles.popup} 
            onClick={(e) => e.stopPropagation()}
          >
              <div className={popupStyles.header}>
                <h2 className={popupStyles.title}>Yeni Departman Ekle</h2>
                <button 
                  className={popupStyles.closeButton}
                  onClick={(e) => {e.preventDefault();hapticFeedback.navigation.close();handleCloseAddDepartment();}}
                  aria-label="Kapat"
                >
                  ×
                </button>
              </div>
              
              <div className={popupStyles.content}>
                <div className={popupStyles.addQuestionForm}>
                  <div className={popupStyles.formGroup}>
                    <label className={popupStyles.formLabel}>Departman İsmi</label>
                    <input 
                      type="text"
                      className={popupStyles.formInput}
                      placeholder="Departman ismini girin..."
                      value={newDepartmentName}
                      onChange={(e) => setNewDepartmentName(e.target.value)}
                    />
                  </div>

                  <div className={popupStyles.formActions}>
                    <button 
                      className={popupStyles.cancelButton}
                      onClick={(e) => {e.preventDefault();hapticFeedback.form.cancel();handleCloseAddDepartment();}}
                    >
                      İptal
                    </button>
                    <button 
                      className={popupStyles.saveButton}
                      onClick={(e) => {e.preventDefault();hapticFeedback.form.submit();handleSaveDepartment();}}
                      disabled={!newDepartmentName.trim()}
                    >
                      Kaydet
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Departman Detay Popup'ı */}
        {isDepartmentDetailOpen && selectedDepartment && (
          <div className={popupStyles.overlay} 
               onClick={(e) => {e.preventDefault();if (e.target === e.currentTarget) {hapticFeedback.navigation.close();handleCloseDepartmentDetail();}}}>
            <div 
            className={popupStyles.popup} 
            onClick={(e) => e.stopPropagation()}
          >
              <div className={popupStyles.header}>
                <h2 className={popupStyles.title}>Departman Detayı</h2>
                <button 
                  className={popupStyles.closeButton}
                  onClick={(e) => {e.preventDefault();hapticFeedback.navigation.close();handleCloseDepartmentDetail();}}
                  aria-label="Kapat"
                >
                  ×
                </button>
              </div>
              
              <div className={popupStyles.content}>
                <div className={popupStyles.addQuestionForm}>
                  <div className={popupStyles.categoryGroup}>
                    <div className={popupStyles.formGroup}>
                      <label className={popupStyles.formLabel}>Departman İsmi</label>
                      <input 
                        type="text"
                        className={popupStyles.formInput}
                        placeholder="Departman ismini girin..."
                        value={editedDepartmentName}
                        onChange={(e) => setEditedDepartmentName(e.target.value)}
                      />
                    </div>

                    <AksiyonlarPopup 
                      department={selectedDepartment}
                      isPendingActionsCollapsed={isPendingActionsCollapsed}
                      setIsPendingActionsCollapsed={setIsPendingActionsCollapsed}
                      isCompletedActionsCollapsed={isCompletedActionsCollapsed}
                      setIsCompletedActionsCollapsed={setIsCompletedActionsCollapsed}
                    />

                    <div className={popupStyles.formActions}>
                      <button 
                        className={popupStyles.deleteButton}
                        onClick={(e) => {e.preventDefault();hapticFeedback.button.danger();handleDeleteDepartment(selectedDepartment);}}
                      >
                        Sil
                      </button>
                      <div className={popupStyles.rightActions}>
                        <button 
                          className={popupStyles.cancelButton}
                          onClick={(e) => {e.preventDefault();hapticFeedback.action.cancel();handleCancelEditDepartment();}}
                        >
                          İptal
                        </button>
                        <button 
                          className={popupStyles.saveButton}
                          onClick={(e) => {e.preventDefault();hapticFeedback.action.save();handleSaveEditDepartment();}}
                          disabled={!editedDepartmentName.trim()}
                        >
                          Güncelle
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Silme Onay Popup'ı */}
        {showDeleteConfirmation && departmentToDelete && (
          <div className={popupStyles.overlay} 
               onClick={(e) => {e.preventDefault();if (e.target === e.currentTarget) {hapticFeedback.navigation.close();cancelDeleteDepartment();}}}>
            <div 
              className={popupStyles.popup}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={popupStyles.header}>
                <h2 className={popupStyles.title}>Departmanı Sil</h2>
              </div>
              
              <div className={popupStyles.content}>
                <div className={popupStyles.confirmationContent}>
                  <p className={popupStyles.confirmationMessage}>
                    <strong>{departmentToDelete.name}</strong> departmanını silmek istediğinizden emin misiniz?
                  </p>
                  <p className={popupStyles.confirmationWarning}>
                    Bu işlem geri alınamaz.
                  </p>
                  <div className={popupStyles.confirmationActions}>
                    <button 
                      className={popupStyles.cancelButton}
                      onClick={(e) => {e.preventDefault();hapticFeedback.action.cancel();cancelDeleteDepartment();}}
                    >
                      İptal
                    </button>
                    <button 
                      className={popupStyles.deleteConfirmButton}
                      onClick={(e) => {e.preventDefault();hapticFeedback.action.delete();confirmDeleteDepartment();}}
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
    </>,
    document.body
  );
}