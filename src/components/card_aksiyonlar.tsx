"use client";

import React, { useState } from "react";
import Image from "next/image";
import { createPortal } from 'react-dom';
import styles from '../styles/card.module.css';
import { hapticFeedback } from '../utils/haptic';

// Metin kısaltma utility fonksiyonu
const truncateText = (text: string, maxLength: number = 100): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

interface Action {
  id: number;
  question: string;
  description: string;
  dueDate: string;
  startDate: string;
  completedDate?: string; // Tamamlanma tarihi (sadece tamamlanan aksiyonlar için)
  image?: string;
  department?: string;
  creator?: string;
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

// Tüm departman verilerini içeren merkezi veri deposu
export const departmentsData: Department[] = [
  {
    id: 1,
    name: "İnsan Kaynakları",
    score: 85,
    completedActions: 2,
    pendingActions: 3,
    pendingActionsList: [
      { id: 1, question: "Personel değerlendirme formları", description: "Yıllık performans değerlendirmelerini tamamla. Yıllık performans değerlendirmelerini tamamla ", dueDate: "2024-01-15", startDate: "2024-01-01", department: "İnsan Kaynakları", creator: "Ahmet Yılmaz" },
      { id: 2, question: "İşe alım süreci", description: "Yeni yazılım geliştirici pozisyonu için mülakat", dueDate: "2024-01-20", startDate: "2024-01-05", department: "İnsan Kaynakları", creator: "Fatma Demir" },
      { id: 3, question: "Eğitim planlaması", description: "Q1 çalışan eğitim programını hazırla", dueDate: "2024-01-25", startDate: "2024-01-10", department: "İnsan Kaynakları", creator: "Mehmet Kaya" }
    ],
    completedActionsList: [
      { id: 4, question: "Bordro hazırlama", description: "Aralık ayı bordroları tamamlandı", dueDate: "2023-12-30", startDate: "2023-12-15", completedDate: "2023-12-29", department: "İnsan Kaynakları", creator: "Ayşe Öztürk" },
      { id: 5, question: "Sigorta işlemleri", description: "Yeni personel sigorta kayıtları", dueDate: "2023-12-28", startDate: "2023-12-20", completedDate: "2023-12-27", department: "İnsan Kaynakları", creator: "Ali Çelik" }
    ]
  },
  {
    id: 2,
    name: "Üretim",
    score: 92,
    completedActions: 1,
    pendingActions: 5,
    pendingActionsList: [
      { id: 6, question: "Makine bakımı", description: "Aylık rutin bakım kontrolü", dueDate: "2024-01-10", startDate: "2024-01-01", department: "Üretim", creator: "Mustafa Arslan" },
      { id: 7, question: "Kalite kontrol", description: "Ürün kalite testlerini gerçekleştir", dueDate: "2024-01-12", startDate: "2024-01-02", department: "Üretim", creator: "Zeynep Kılıç" },
      { id: 8, question: "Stok sayımı", description: "Hammadde stok kontrolü", dueDate: "2024-01-18", startDate: "2024-01-08", department: "Üretim", creator: "Hasan Özkan" },
      { id: 9, question: "Güvenlik eğitimi", description: "İş güvenliği eğitimi planla", dueDate: "2024-01-22", startDate: "2024-01-12", department: "Üretim", creator: "Elif Şahin" },
      { id: 10, question: "Üretim raporu", description: "Haftalık üretim raporunu hazırla", dueDate: "2024-01-08", startDate: "2024-01-01", department: "Üretim", creator: "Oğuz Yıldız" }
    ],
    completedActionsList: [
      { id: 11, question: "Sipariş teslimi", description: "A firması siparişi tamamlandı", dueDate: "2023-12-29", startDate: "2023-12-20", completedDate: "2023-12-28", department: "Üretim", creator: "Ahmet Demir" }
    ]
  },
  {
    id: 3,
    name: "Satış ve Pazarlama",
    score: 78,
    completedActions: 1,
    pendingActions: 3,
    pendingActionsList: [
      { id: 12, question: "Kampanya hazırlığı", description: "Yeni yıl kampanyası tasarımı", dueDate: "2024-01-05", startDate: "2023-12-20", department: "Satış ve Pazarlama", creator: "Selin Aydın" },
      { id: 13, question: "Müşteri toplantısı", description: "B firması ile görüşme", dueDate: "2024-01-08", startDate: "2024-01-03", department: "Satış ve Pazarlama", creator: "Burak Koç" },
      { id: 14, question: "Pazar araştırması", description: "Rakip analizi raporu", dueDate: "2024-01-15", startDate: "2024-01-05", department: "Satış ve Pazarlama", creator: "Deniz Yılmaz" }
    ],
    completedActionsList: [
      { id: 15, question: "Sosyal medya paylaşımı", description: "Instagram kampanya paylaşımları", dueDate: "2023-12-30", startDate: "2023-12-25", completedDate: "2023-12-29", department: "Satış ve Pazarlama", creator: "Ayşe Kaya" }
    ]
  },
  {
    id: 4,
    name: "Muhasebe",
    score: 88,
    completedActions: 1,
    pendingActions: 2,
    pendingActionsList: [
      { id: 16, question: "Mali müşavir toplantısı", description: "Yıl sonu kapanış işlemleri", dueDate: "2024-01-03", startDate: "2023-12-28", department: "Muhasebe", creator: "Murat Özdemir" },
      { id: 17, question: "Fatura kontrolü", description: "Aralık ayı fatura onayları", dueDate: "2024-01-05", startDate: "2024-01-01", department: "Muhasebe", creator: "Gülşen Aktaş" }
    ],
    completedActionsList: [
      { id: 18, question: "Vergi beyannamesi", description: "KDV beyannamesi verildi", dueDate: "2023-12-25", startDate: "2023-12-20", completedDate: "2023-12-24", department: "Muhasebe", creator: "Kemal Erdoğan" }
    ]
  },
  {
    id: 5,
    name: "Ar-Ge",
    score: 95,
    completedActions: 1,
    pendingActions: 4,
    pendingActionsList: [
      { id: 19, question: "Prototip testi", description: "Yeni ürün prototip testleri", dueDate: "2024-01-12", startDate: "2024-01-05", department: "Ar-Ge", creator: "Dr. Emre Yıldırım" },
      { id: 20, question: "Patent başvurusu", description: "Yeni teknoloji patent dosyası", dueDate: "2024-01-20", startDate: "2024-01-10", department: "Ar-Ge", creator: "Prof. Aylin Çetin" },
      { id: 21, question: "Araştırma raporu", description: "Teknoloji trend analizi", dueDate: "2024-01-25", startDate: "2024-01-15", department: "Ar-Ge", creator: "Doç. Mehmet Kara" },
      { id: 22, question: "Lab ekipmanı", description: "Yeni test cihazı kurulumu", dueDate: "2024-01-30", startDate: "2024-01-20", department: "Ar-Ge", creator: "Mühendis Seda Özkan" }
    ],
    completedActionsList: [
      { id: 23, question: "Ürün geliştirme", description: "V2.0 yazılım tamamlandı", dueDate: "2023-12-28", startDate: "2023-12-01", completedDate: "2023-12-27", department: "Ar-Ge", creator: "Yazılım Uzmanı Ali Vural" }
    ]
  },
  {
    id: 6,
    name: "Lojistik",
    score: 82,
    completedActions: 1,
    pendingActions: 3,
    pendingActionsList: [
      { id: 24, question: "Kargo takibi", description: "Müşteri siparişlerini takip et", dueDate: "2024-01-07", startDate: "2024-01-02", department: "Lojistik", creator: "Serkan Yılmaz" },
      { id: 25, question: "Depo düzenleme", description: "Yeni ürün yerleşim planı", dueDate: "2024-01-10", startDate: "2024-01-05", department: "Lojistik", creator: "Fatma Koç" },
      { id: 26, question: "Nakliye planlaması", description: "Haftalık sevkiyat programı", dueDate: "2024-01-08", startDate: "2024-01-03", department: "Lojistik", creator: "Hüseyin Acar" }
    ],
    completedActionsList: [
      { id: 27, question: "Envanter sayımı", description: "Aralık ayı stok sayımı", dueDate: "2023-12-31", startDate: "2023-12-25", completedDate: "2023-12-30", department: "Lojistik", creator: "Mehmet Demir" }
    ]
  }
];

// Tüm departmanlardan toplam aksiyon sayılarını hesaplayan fonksiyon
const calculateTotalActions = () => {
  const totalCompleted = departmentsData.reduce((sum, dept) => sum + dept.completedActions, 0);
  const totalPending = departmentsData.reduce((sum, dept) => sum + dept.pendingActions, 0);
  const totalActions = totalCompleted + totalPending;
  const progressPercentage = totalActions > 0 ? Math.round((totalCompleted / totalActions) * 100) : 0;

  return {
    totalCompleted,
    totalPending,
    totalActions,
    progressPercentage
  };
};

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
    hapticFeedback.success();
    setIsPopupOpen(false);
  };

  // Card'a tıklama - bekleyen aksiyonları göster, tamamlananları kapalı tut
  const handleCardClick = () => {
    hapticFeedback.success();
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
        <div className={styles.card} onClick={handleCardClick}>
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
              className={`${styles.descriptiveData} ${styles.descriptiveDataLeft}`}
            >
              Bekleyen: {totalPending}
            </div>
            
            {/* Tamamlanan Aksiyonlar Bilgi Alanı - Sağ Alt */}
            <div 
              className={`${styles.descriptiveData} ${styles.descriptiveDataRight}`}
            >
              Tamamlanan: {totalCompleted}
            </div>
          </div>
        </div>
      </div>

      {/* Aksiyonlar Popup */}
      {isPopupOpen && createPortal(
        <div className={styles.overlay} onClick={(e) => {
          if (e.target === e.currentTarget) {
            handleClosePopup();
          }
        }}>
          <div className={styles.popup} onClick={(e) => e.stopPropagation()}>
            <div className={styles.header}>
              <h2 className={styles.title}>
                Aksiyonlar
              </h2>
              <button 
                className={styles.closeButton}
                onClick={handleClosePopup}
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
    hapticFeedback.success();
    setSelectedAction(action);
    setIsActionDetailOpen(true);
  };

  const handleCloseActionDetail = () => {
    hapticFeedback.warning();
    setIsActionDetailOpen(false);
    setSelectedAction(null);
  };

  // Bekleyen aksiyonlar için "daha fazla göster" fonksiyonu
  const handleShowMorePending = () => {
    hapticFeedback.success();
    setPendingDisplayCount(prev => prev + ITEMS_PER_PAGE);
  };

  // Tamamlanan aksiyonlar için "daha fazla göster" fonksiyonu
  const handleShowMoreCompleted = () => {
    hapticFeedback.success();
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
          onClick={() => {
            hapticFeedback.init();
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
                  onClick={() => handleActionClick(action)}
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
                    onClick={handleShowMorePending}
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
          onClick={() => {
            hapticFeedback.light();
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
                  onClick={() => handleActionClick(action)}
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
                    onClick={handleShowMoreCompleted}
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
      {isActionDetailOpen && selectedAction && createPortal(
        <div className={styles.overlay} onClick={(e) => {
          if (e.target === e.currentTarget) {
            handleCloseActionDetail();
          }
        }}>
          <div className={styles.popup} onClick={(e) => e.stopPropagation()}>
            <div className={styles.header}>
              <h2 className={styles.title}>Aksiyon</h2>
              <button 
                className={styles.closeButton}
                onClick={handleCloseActionDetail}
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
                  <p className={styles.detailText}>{selectedAction.question}</p>
                </div>

                {/* Açıklama */}
                <div className={styles.detailSection}>
                  <h4 className={styles.detailLabel}>Açıklama</h4>
                  <p className={styles.detailText}>{selectedAction.description}</p>
                </div>

                {/* Tarihler - Yan Yana */}
                <div className={styles.dateRow}>
                  <div className={styles.detailSection}>
                    <h4 className={styles.detailLabel}>Başlangıç Tarihi</h4>
                    <p className={styles.detailText}>{selectedAction.startDate}</p>
                  </div>
                  <div className={styles.detailSection}>
                    <h4 className={styles.detailLabel}>Termin Tarihi</h4>
                    <p className={styles.detailText}>{selectedAction.dueDate}</p>
                  </div>
                  {selectedAction.completedDate && (
                    <div className={styles.detailSection}>
                      <h4 className={styles.detailLabel}>Tamamlanma Tarihi</h4>
                      <p className={styles.detailText}>{selectedAction.completedDate}</p>
                    </div>
                  )}
                </div>

                {/* Departman ve Oluşturan - Yan Yana */}
                <div className={styles.infoRow}>
                  <div className={styles.detailSection}>
                    <h4 className={styles.detailLabel}>Departman</h4>
                    <p className={styles.detailText}>{selectedAction.department || 'Belirtilmemiş'}</p>
                  </div>
                  <div className={styles.detailSection}>
                    <h4 className={styles.detailLabel}>Oluşturan</h4>
                    <p className={styles.detailText}>{selectedAction.creator || 'Belirtilmemiş'}</p>
                  </div>
                </div>

                {/* Fotoğraf Alanı */}
                <div className={styles.detailSection}>
                  <h4 className={styles.detailLabel}>Fotoğraf</h4>
                  {selectedAction.image ? (
                    <div className={styles.imageContainer}>
                      <Image 
                        src={selectedAction.image} 
                        alt="Aksiyon fotoğrafı"
                        className={styles.actionImage}
                        width={400}
                        height={300}
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                  ) : (
                    <div className={styles.noImageContainer}>
                      <p className={styles.noImageText}>Fotoğraf yok</p>
                    </div>
                  )}
                </div>

              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}