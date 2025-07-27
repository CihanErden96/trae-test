"use client";

import React, { useState } from 'react';
import styles from '../styles/popup.module.css';

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

interface DepartmentsPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DepartmentsPopup({ isOpen, onClose }: DepartmentsPopupProps) {
  const [departments, setDepartments] = useState<Department[]>([
    {
      id: 1,
      name: "İnsan Kaynakları",
      score: 85,
      completedActions: 12,
      pendingActions: 3,
      pendingActionsList: [
        { id: 1, title: "Personel değerlendirme formları", description: "Yıllık performans değerlendirmelerini tamamla", dueDate: "2024-01-15", priority: "high" },
        { id: 2, title: "İşe alım süreci", description: "Yeni yazılım geliştirici pozisyonu için mülakat", dueDate: "2024-01-20", priority: "medium" },
        { id: 3, title: "Eğitim planlaması", description: "Q1 çalışan eğitim programını hazırla", dueDate: "2024-01-25", priority: "low" }
      ],
      completedActionsList: [
        { id: 4, title: "Bordro hazırlama", description: "Aralık ayı bordroları tamamlandı", dueDate: "2023-12-30", priority: "high" },
        { id: 5, title: "Sigorta işlemleri", description: "Yeni personel sigorta kayıtları", dueDate: "2023-12-28", priority: "medium" }
      ]
    },
    {
      id: 2,
      name: "Üretim",
      score: 92,
      completedActions: 18,
      pendingActions: 5,
      pendingActionsList: [
        { id: 6, title: "Makine bakımı", description: "Aylık rutin bakım kontrolü", dueDate: "2024-01-10", priority: "high" },
        { id: 7, title: "Kalite kontrol", description: "Ürün kalite testlerini gerçekleştir", dueDate: "2024-01-12", priority: "high" },
        { id: 8, title: "Stok sayımı", description: "Hammadde stok kontrolü", dueDate: "2024-01-18", priority: "medium" },
        { id: 9, title: "Güvenlik eğitimi", description: "İş güvenliği eğitimi planla", dueDate: "2024-01-22", priority: "medium" },
        { id: 10, title: "Üretim raporu", description: "Haftalık üretim raporunu hazırla", dueDate: "2024-01-08", priority: "low" }
      ],
      completedActionsList: [
        { id: 11, title: "Sipariş teslimi", description: "A firması siparişi tamamlandı", dueDate: "2023-12-29", priority: "high" }
      ]
    },
    {
      id: 3,
      name: "Satış ve Pazarlama",
      score: 78,
      completedActions: 9,
      pendingActions: 7,
      pendingActionsList: [
        { id: 12, title: "Kampanya hazırlığı", description: "Yeni yıl kampanyası tasarımı", dueDate: "2024-01-05", priority: "high" },
        { id: 13, title: "Müşteri toplantısı", description: "B firması ile görüşme", dueDate: "2024-01-08", priority: "high" },
        { id: 14, title: "Pazar araştırması", description: "Rakip analizi raporu", dueDate: "2024-01-15", priority: "medium" }
      ],
      completedActionsList: [
        { id: 15, title: "Sosyal medya paylaşımı", description: "Instagram kampanya paylaşımları", dueDate: "2023-12-30", priority: "low" }
      ]
    },
    {
      id: 4,
      name: "Muhasebe",
      score: 88,
      completedActions: 15,
      pendingActions: 2,
      pendingActionsList: [
        { id: 16, title: "Mali müşavir toplantısı", description: "Yıl sonu kapanış işlemleri", dueDate: "2024-01-03", priority: "high" },
        { id: 17, title: "Fatura kontrolü", description: "Aralık ayı fatura onayları", dueDate: "2024-01-05", priority: "medium" }
      ],
      completedActionsList: [
        { id: 18, title: "Vergi beyannamesi", description: "KDV beyannamesi verildi", dueDate: "2023-12-25", priority: "high" }
      ]
    },
    {
      id: 5,
      name: "Ar-Ge",
      score: 95,
      completedActions: 22,
      pendingActions: 4,
      pendingActionsList: [
        { id: 19, title: "Prototip testi", description: "Yeni ürün prototip testleri", dueDate: "2024-01-12", priority: "high" },
        { id: 20, title: "Patent başvurusu", description: "Yeni teknoloji patent dosyası", dueDate: "2024-01-20", priority: "medium" },
        { id: 21, title: "Araştırma raporu", description: "Teknoloji trend analizi", dueDate: "2024-01-25", priority: "low" },
        { id: 22, title: "Lab ekipmanı", description: "Yeni test cihazı kurulumu", dueDate: "2024-01-30", priority: "medium" }
      ],
      completedActionsList: [
        { id: 23, title: "Ürün geliştirme", description: "V2.0 yazılım tamamlandı", dueDate: "2023-12-28", priority: "high" }
      ]
    },
    {
      id: 6,
      name: "Lojistik",
      score: 82,
      completedActions: 14,
      pendingActions: 6,
      pendingActionsList: [
        { id: 24, title: "Kargo takibi", description: "Müşteri siparişlerini takip et", dueDate: "2024-01-07", priority: "high" },
        { id: 25, title: "Depo düzenleme", description: "Yeni ürün yerleşim planı", dueDate: "2024-01-10", priority: "medium" },
        { id: 26, title: "Nakliye planlaması", description: "Haftalık sevkiyat programı", dueDate: "2024-01-08", priority: "medium" }
      ],
      completedActionsList: [
        { id: 27, title: "Envanter sayımı", description: "Aralık ayı stok sayımı", dueDate: "2023-12-31", priority: "high" }
      ]
    }
  ]);

  const [isAddDepartmentOpen, setIsAddDepartmentOpen] = useState(false);
  const [newDepartmentName, setNewDepartmentName] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [isDepartmentDetailOpen, setIsDepartmentDetailOpen] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [departmentToDelete, setDepartmentToDelete] = useState<Department | null>(null);
  const [isPendingActionsCollapsed, setIsPendingActionsCollapsed] = useState(false);
  const [isCompletedActionsCollapsed, setIsCompletedActionsCollapsed] = useState(true);
  const [editedDepartmentName, setEditedDepartmentName] = useState('');
  const [isEditingDepartment, setIsEditingDepartment] = useState(false);

  const handleAddDepartment = () => {
    setIsAddDepartmentOpen(true);
  };

  const handleCloseAddDepartment = () => {
    setIsAddDepartmentOpen(false);
    setNewDepartmentName('');
  };

  const handleSaveDepartment = () => {
    if (newDepartmentName.trim()) {
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
    }
  };

  const handleDepartmentClick = (department: Department) => {
    setSelectedDepartment(department);
    setEditedDepartmentName(department.name);
    setIsEditingDepartment(true); // Direkt düzenleme modunda aç
    setIsDepartmentDetailOpen(true);
  };

  const handleCloseDepartmentDetail = () => {
    setIsDepartmentDetailOpen(false);
    setSelectedDepartment(null);
    setEditedDepartmentName('');
    setIsEditingDepartment(false);
  };

  const handleSaveEditDepartment = () => {
    if (selectedDepartment && editedDepartmentName.trim() && editedDepartmentName.trim() !== selectedDepartment.name) {
      setDepartments(prevDepartments => 
        prevDepartments.map(dept => 
          dept.id === selectedDepartment.id 
            ? { ...dept, name: editedDepartmentName.trim() }
            : dept
        )
      );
      setSelectedDepartment(prev => prev ? { ...prev, name: editedDepartmentName.trim() } : null);
    }
    setIsEditingDepartment(false);
    // Departman detay popup'ını kapat ve ana listeye dön
    handleCloseDepartmentDetail();
  };

  const handleCancelEditDepartment = () => {
    // İptal butonuna basıldığında detay popup'ını kapat
    handleCloseDepartmentDetail();
  };

  const handleDeleteDepartment = (department: Department) => {
    setDepartmentToDelete(department);
    setShowDeleteConfirmation(true);
  };

  const confirmDeleteDepartment = () => {
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
    setShowDeleteConfirmation(false);
    setDepartmentToDelete(null);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#ff4757';
      case 'medium': return '#ffa502';
      case 'low': return '#2ed573';
      default: return '#747d8c';
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };



  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.popup} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Departmanlar</h2>
          <button 
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Kapat"
          >
            ×
          </button>
        </div>
        
        <div className={styles.content}>
          <div className={styles.departmentsList}>
            {departments.map((department) => (
              <div 
                key={department.id} 
                className={styles.departmentCard}
                onClick={() => handleDepartmentClick(department)}
              >
                <div className={styles.departmentHeader}>
                  <h3 className={styles.departmentName}>{department.name}</h3>
                  <div className={styles.departmentScore}>{department.score}</div>
                </div>
                <div className={styles.departmentStats}>
                  <div className={styles.completedActions}>
                    <span className={styles.actionLabel}>Biten Aksiyon</span>
                    <span className={styles.actionCount}>{department.completedActions}</span>
                  </div>
                  <div className={styles.pendingActions}>
                    <span className={styles.actionLabel}>Bekleyen Aksiyon</span>
                    <span className={styles.actionCount}>{department.pendingActions}</span>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Yeni Departman Ekle Butonu */}
            <div className={styles.addDepartmentItem} onClick={handleAddDepartment}>
              <div className={styles.addDepartmentContent}>
                <div className={styles.addIcon}>+</div>
                <div className={styles.addText}>
                  <h3 className={styles.addTitle}>Yeni Departman Ekle</h3>
                  <p className={styles.addDescription}>Yeni bir departman oluşturmak için tıklayın</p>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>

      {/* Yeni Departman Ekleme Popup'ı */}
      {isAddDepartmentOpen && (
        <div className={styles.overlay} onClick={(e) => {
          if (e.target === e.currentTarget) {
            handleCloseAddDepartment();
          }
        }}>
          <div className={styles.popup} onClick={(e) => e.stopPropagation()}>
            <div className={styles.header}>
              <h2 className={styles.title}>Yeni Departman Ekle</h2>
              <button 
                className={styles.closeButton}
                onClick={handleCloseAddDepartment}
                aria-label="Kapat"
              >
                ×
              </button>
            </div>
            
            <div className={styles.content}>
              <div className={styles.addQuestionForm}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Departman İsmi</label>
                  <input 
                    type="text"
                    className={styles.formInput}
                    placeholder="Departman ismini girin..."
                    value={newDepartmentName}
                    onChange={(e) => setNewDepartmentName(e.target.value)}
                  />
                </div>

                <div className={styles.formActions}>
                  <button 
                    className={styles.cancelButton}
                    onClick={handleCloseAddDepartment}
                  >
                    İptal
                  </button>
                  <button 
                    className={styles.saveButton}
                    onClick={handleSaveDepartment}
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
        <div className={styles.overlay} onClick={(e) => {
          if (e.target === e.currentTarget) {
            handleCloseDepartmentDetail();
          }
        }}>
          <div className={styles.popup} onClick={(e) => e.stopPropagation()}>
            <div className={styles.header}>
              <h2 className={styles.title}>{selectedDepartment.name} Detayları</h2>
              <button 
                className={styles.closeButton}
                onClick={handleCloseDepartmentDetail}
                aria-label="Kapat"
              >
                ×
              </button>
            </div>
            
            <div className={styles.content}>
              <div className={styles.addQuestionForm}>
                {/* Departman Adı Düzenleme */}
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Departman İsmi</label>
                  <input 
                    type="text"
                    className={styles.formInput}
                    placeholder="Departman ismini girin..."
                    value={editedDepartmentName}
                    onChange={(e) => setEditedDepartmentName(e.target.value)}
                  />
                </div>

                <div className={styles.categoryGroup}>
                  <div 
                    className={styles.categoryHeader}
                    onClick={() => setIsPendingActionsCollapsed(!isPendingActionsCollapsed)}
                  >
                    <div className={styles.categoryTitle}>
                      <span className={styles.categoryIcon}>
                        {isPendingActionsCollapsed ? '▶' : '▼'}
                      </span>
                      <h3 className={styles.categoryName}>Bekleyen Aksiyonlar</h3>
                      <div className={styles.categoryStats}>
                        <span className={styles.questionCount}>({selectedDepartment.pendingActionsList.length})</span>
                      </div>
                    </div>
                  </div>
                  {!isPendingActionsCollapsed && (
                    selectedDepartment.pendingActionsList.length > 0 ? (
                      <div className={styles.categoryContent}>
                        {selectedDepartment.pendingActionsList.map((action) => (
                          <div key={action.id} className={styles.questionItem}>
                            <p className={styles.questionDescription}>{action.description}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className={styles.categoryContent}>
                        <p className={styles.noActions}>Bekleyen aksiyon bulunmuyor.</p>
                      </div>
                    )
                  )}
                </div>

                <div className={styles.categoryGroup}>
                  <div 
                    className={styles.categoryHeader}
                    onClick={() => setIsCompletedActionsCollapsed(!isCompletedActionsCollapsed)}
                  >
                    <div className={styles.categoryTitle}>
                      <span className={styles.categoryIcon}>
                        {isCompletedActionsCollapsed ? '▶' : '▼'}
                      </span>
                      <h3 className={styles.categoryName}>Tamamlanan Aksiyonlar</h3>
                      <div className={styles.categoryStats}>
                        <span className={styles.questionCount}>({selectedDepartment.completedActionsList.length})</span>
                      </div>
                    </div>
                  </div>
                  {!isCompletedActionsCollapsed && (
                    selectedDepartment.completedActionsList.length > 0 ? (
                      <div className={styles.categoryContent}>
                        {selectedDepartment.completedActionsList.map((action) => (
                          <div key={action.id} className={`${styles.questionItem} ${styles.completedAction}`}>
                            <p className={styles.questionDescription}>{action.description}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className={styles.categoryContent}>
                        <p className={styles.noActions}>Tamamlanan aksiyon bulunmuyor.</p>
                      </div>
                    )
                  )}
                </div>

                <div className={styles.formActions}>
                  <button 
                    className={styles.deleteButton}
                    onClick={() => handleDeleteDepartment(selectedDepartment)}
                  >
                    Sil
                  </button>
                  <div className={styles.rightActions}>
                    <button 
                      className={styles.cancelButton}
                      onClick={handleCancelEditDepartment}
                    >
                      İptal
                    </button>
                    <button 
                      className={styles.saveButton}
                      onClick={handleSaveEditDepartment}
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
      )}

      {/* Silme Onay Popup'ı */}
      {showDeleteConfirmation && departmentToDelete && (
        <div className={styles.overlay}>
          <div className={styles.popup} onClick={(e) => e.stopPropagation()}>
            <div className={styles.header}>
              <h2 className={styles.title}>Departmanı Sil</h2>
            </div>
            
            <div className={styles.content}>
              <div className={styles.confirmationContent}>
                <p className={styles.confirmationMessage}>
                  <strong>{departmentToDelete.name}</strong> departmanını silmek istediğinizden emin misiniz?
                </p>
                <p className={styles.confirmationWarning}>
                  Bu işlem geri alınamaz.
                </p>
                <div className={styles.confirmationActions}>
                  <button 
                    className={styles.cancelButton}
                    onClick={cancelDeleteDepartment}
                  >
                    İptal
                  </button>
                  <button 
                    className={styles.deleteConfirmButton}
                    onClick={confirmDeleteDepartment}
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