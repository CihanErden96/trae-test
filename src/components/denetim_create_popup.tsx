"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import styles from '../styles/card.module.css';
import assignmentStyles from '../styles/denetim_assignment_popup.module.css';
import ReusableCombobox, { ComboboxOption } from './combobox';
import Calendar from './calendar';
import calendarStyles from '../styles/calendar.module.css';

interface DenetimPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (denetim: DenetimData) => void;
}

interface DenetimData {
  title: string;
  description: string;
  department: string;
  priority: 'Düşük' | 'Orta' | 'Yüksek' | 'Kritik';
  startDate: string;
  endDate: string;
  type: 'İç Denetim' | 'Dış Denetim' | 'Uygunluk Denetimi' | 'Performans Denetimi';
}

interface DenetimAssignmentPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onBack: () => void;
  onSave: (details: DenetimAssignmentData) => void;
  dateRange: { startDate: string; endDate: string };
  isSliding?: boolean;
  slideDirection?: 'forward' | 'backward';
}

interface DenetimAssignmentData {
  title: string;
  description: string;
  department: string;
  priority: 'Düşük' | 'Orta' | 'Yüksek' | 'Kritik';
  type: 'İç Denetim' | 'Dış Denetim' | 'Uygunluk Denetimi' | 'Performans Denetimi';
  departmentResponsibles: { [department: string]: string };
}

// DropdownPortal bileşenini kaldırdık - artık gerekli değil

interface DateRangePickerProps {
  onDateRangeChange: (startDate: string, endDate: string) => void;
  error?: string;
}

function DateRangePicker({ onDateRangeChange, error }: DateRangePickerProps) {
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  // Tarih formatı dönüştürme fonksiyonları
  const formatDateForDisplay = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('tr-TR');
  };

  // Tarih aralığı değişikliklerini parent'a bildir
  useEffect(() => {
    onDateRangeChange(startDate, endDate);
  }, [startDate, endDate, onDateRangeChange]);

  // Calendar component'inden gelen tarih değişikliklerini handle et
  const handleDateRangeChange = useCallback((start: string, end: string) => {
    setStartDate(start);
    setEndDate(end);
  }, []);

  return (
    <div>
      <Calendar
        isStartDateDisabled={false}
        onDateRangeChange={handleDateRangeChange}
        initialStartDate={startDate}
        initialEndDate={endDate}
      />
      
      {error && (
        <span className={styles.formError}>{error}</span>
      )}
      
      <div className={calendarStyles.dateRangePreview}>
        <span  className={calendarStyles.previewText}>
          {startDate ? (
            startDate && endDate ? (
              <>
                Seçilen tarih: {formatDateForDisplay(startDate)} - {formatDateForDisplay(endDate)}
                {(() => {
                  const start = new Date(startDate);
                  const end = new Date(endDate);
                  const diffTime = Math.abs(end.getTime() - start.getTime());
                  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
                  return ` (${diffDays} gün)`;
                })()}
              </>
            ) : (
              <>
                Seçilen tarih: {formatDateForDisplay(startDate)} - 
              </>
            )
          ) : (
            'Seçilen tarih: -'
          )}
        </span>
      </div>
    </div>
  );
}

// Yeni Denetim Atama Popup'ı
function DenetimAssignmentPopup({ isOpen, onClose, onBack, onSave, dateRange, isSliding = false, slideDirection = 'forward' }: DenetimAssignmentPopupProps) {
  const [errors, setErrors] = useState<Partial<DenetimAssignmentData>>({});

  // Genel personel listesi (tüm departmanlar için aynı liste)
  const allPersonnel = useMemo(() => [
    'Mehmet Kaya',
    'Ayşe Demir', 
    'Fatma Yılmaz',
    'Ali Özkan',
    'Zeynep Çelik',
    'Murat Şahin',
    'Elif Koç',
    'Hasan Aydın',
    'Seda Polat',
    'Burak Arslan',
    'Gizem Kara',
    'Emre Doğan',
    'Canan Öztürk',
    'Serkan Yıldız',
    'Pınar Güneş',
    'Oğuz Kılıç',
    'Merve Akgül',
    'Tolga Erdoğan',
    'Deniz Çakır',
    'Ece Bayram',
    'Kemal Usta',
    'Sibel Taş',
    'Onur Kaya',
    'Gamze Özdemir Gamze Özdemir Gamze Özdemir Gamze Özdemir'
  ], []);

  // Departman listesi
  const departments = useMemo(() => [
    'İnsan Kaynakları',
    'Bilgi İşlem', 
    'Muhasebe',
    'Pazarlama',
    'Satış',
    'Üretim',
    'Kalite Kontrol',
    'Lojistik'
  ], []);

  // Personel listesini ComboboxOption formatına çevir
  const personnelOptions: ComboboxOption[] = useMemo(() => allPersonnel.map(person => ({
    value: person,
    label: person
  })), [allPersonnel]);

  // Varsayılan departman sorumluları
  const defaultResponsibles = useMemo(() => {
    if (departments.length > 0 && allPersonnel.length > 0) {
      return departments.reduce((acc, dept) => {
        acc[dept] = allPersonnel[0];
        return acc;
      }, {} as { [department: string]: string });
    }
    return {};
  }, [departments, allPersonnel]);

  const [assignmentData, setAssignmentData] = useState<DenetimAssignmentData>({
    title: '',
    description: '',
    department: '',
    priority: 'Düşük',
    type: 'İç Denetim',
    departmentResponsibles: {}
  });

  // assignmentData'nın departmentResponsibles'ını varsayılan değerlerle güncelle (sadece ilk render'da)
  useEffect(() => {
    if (Object.keys(defaultResponsibles).length > 0 && Object.keys(assignmentData.departmentResponsibles).length === 0) {
      setAssignmentData(prev => ({
        ...prev,
        departmentResponsibles: defaultResponsibles
      }));
    }
  }, [defaultResponsibles, assignmentData.departmentResponsibles]);



  // Departman sorumlusu seçme fonksiyonu
  const handleResponsibleSelect = (department: string, person: string) => {
    setAssignmentData(prev => ({
      ...prev,
      departmentResponsibles: {
        ...prev.departmentResponsibles,
        [department]: person
      }
    }));
  };

  const validateAssignmentForm = (): boolean => {
    const newErrors: Partial<DenetimAssignmentData> = {};

    if (!assignmentData.title.trim()) {
      newErrors.title = 'Başlık gereklidir';
    }
    if (!assignmentData.description.trim()) {
      newErrors.description = 'Açıklama gereklidir';
    }
    if (!assignmentData.department.trim()) {
      newErrors.department = 'Departman gereklidir';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateAssignmentForm()) {
      onSave(assignmentData);
      // Form verilerini sıfırla
      setAssignmentData({
        title: '',
        description: '',
        department: '',
        priority: 'Düşük',
        type: 'İç Denetim',
        departmentResponsibles: {}
      });
      setErrors({});
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const formatDateForDisplay = (dateStr: string) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('tr-TR');
  };

  if (!isOpen) return null;

  return (
    <>
      {createPortal(
        <div className={styles.overlay} onClick={handleOverlayClick}>
          <div className={`${styles.popup} ${isSliding ? (slideDirection === 'forward' ? styles.slideInRight : styles.slideOutRight) : ''}`}>
            <div className="popup-header">
              <h2 className="popup-title">Denetim Atama</h2>
              <button className="popup-close-button" onClick={onClose}>
                ×
              </button>
            </div>
            
            <div className={styles.content}>
              <form onSubmit={handleSave} className={styles.addQuestionForm}>
                {/* Seçilen tarih aralığını göster */}
                <div className={styles.formGroup}>
                  <div className={calendarStyles.dateRangePreview}>
                    <span className={calendarStyles.previewText}>
                      {formatDateForDisplay(dateRange.startDate)} - {formatDateForDisplay(dateRange.endDate)}
                    </span>
                  </div>
                </div>

                {/* Departman-Personel Sorumlu Seçimi */}
                <div className={styles.formGroup}>
                  <div className={assignmentStyles.departmentResponsiblesContainer}>
                    {/* Header */}
                    <div className={assignmentStyles.departmentHeader}>
                      Departman / Sorumlu Kişi
                    </div>

                    {/* Departman ve Combobox Listesi */}
                    {departments.map((department, index) => {
                      return (
                        <div 
                          key={index}
                          className={assignmentStyles.departmentRow}
                        >
                          {/* Departman Adı */}
                          <div className={assignmentStyles.departmentName}>
                            {department}
                          </div>

                          {/* Reusable Combobox */}
                          <div className={assignmentStyles.comboboxContainer}>
                            <ReusableCombobox
                              options={personnelOptions}
                              selectedValue={assignmentData.departmentResponsibles[department]}
                              placeholder="Sorumlu seçin"
                              onSelect={(value) => handleResponsibleSelect(department, value)}
                              id={`responsible-${department}`}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className={styles.formActions}>
                  <button
                    type="button"
                    className={styles.cancelButton}
                    onClick={onClose}
                  >
                    İptal
                  </button>
                  <div className={styles.rightActions}>
                    <button
                      type="button"
                      className={styles.cancelButton}
                      onClick={onBack}
                    >
                      Geri
                    </button>
                    <button
                      type="submit"
                      className={styles.deleteConfirmButton}
                      onClick={onClose}
                    >
                      Kaydet
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}

export default function DenetimPopup({ isOpen, onClose, onSubmit }: DenetimPopupProps) {
  const [showDetailsPopup, setShowDetailsPopup] = useState(false);
  const [isSliding, setIsSliding] = useState(false);
  const [slideDirection, setSlideDirection] = useState<'forward' | 'backward'>('forward');
  const [selectedDateRange, setSelectedDateRange] = useState({ startDate: '', endDate: '' });
  const [formData, setFormData] = useState<DenetimData>({
    title: '',
    description: '',
    department: '',
    priority: 'Düşük',
    startDate: '',
    endDate: '',
    type: 'İç Denetim'
  });

  const [errors, setErrors] = useState<Partial<DenetimData>>({});

  const handleInputChange = useCallback((field: keyof DenetimData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  }, [errors]);

  const handleDateRangeChange = useCallback((startDate: string, endDate: string) => {
    handleInputChange('startDate', startDate);
    handleInputChange('endDate', endDate);
  }, [handleInputChange]);

  const validateForm = (): boolean => {
    const newErrors: Partial<DenetimData> = {};

    if (!formData.startDate) {
      newErrors.startDate = 'Başlangıç tarihi gereklidir';
    }
    if (!formData.endDate) {
      newErrors.endDate = 'Bitiş tarihi gereklidir';
    }
    if (formData.startDate && formData.endDate && formData.startDate > formData.endDate) {
      newErrors.endDate = 'Bitiş tarihi başlangıç tarihinden sonra olmalıdır';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Slide animasyonunu başlat
      setIsSliding(true);
      setSlideDirection('forward');
      
      // Tarih aralığını kaydet
      setSelectedDateRange({
        startDate: formData.startDate,
        endDate: formData.endDate
      });
      
      // Animasyon tamamlandıktan sonra detay popup'ını aç
      setTimeout(() => {
        setShowDetailsPopup(true);
        setIsSliding(false);
      }, 300);
    }
  };

  const handleAssignmentSubmit = (assignment: DenetimAssignmentData) => {
    // Tüm verileri birleştir ve ana onSubmit'e gönder
    const completeData: DenetimData = {
      ...assignment,
      startDate: selectedDateRange.startDate,
      endDate: selectedDateRange.endDate
    };
    
    onSubmit(completeData);
    
    // Tüm popup'ları kapat ve verileri sıfırla
    setShowDetailsPopup(false);
    setFormData({
      title: '',
      description: '',
      department: '',
      priority: 'Düşük',
      startDate: '',
      endDate: '',
      type: 'İç Denetim'
    });
    setErrors({});
    onClose();
  };

  const handleAssignmentBack = () => {
    // Geri slide animasyonunu başlat
    setIsSliding(true);
    setSlideDirection('backward');
    
    // Animasyon tamamlandıktan sonra ana popup'a dön
    setTimeout(() => {
      setShowDetailsPopup(false);
      setIsSliding(false);
    }, 300);
  };

  const handleAssignmentClose = () => {
    setShowDetailsPopup(false);
    onClose();
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Ana Tarih Seçimi Popup'ı */}
      {!showDetailsPopup && createPortal(
        <div className={styles.overlay} onClick={handleOverlayClick}>
          <div className={`${styles.popup} ${isSliding ? (slideDirection === 'forward' ? styles.slideOutLeft : styles.slideInLeft) : ''}`}>
            <div className="popup-header">
              <h2 className="popup-title">Denetim Oluştur</h2>
              <button className="popup-close-button" onClick={onClose}>
                ×
              </button>
            </div>
            
            <div className={styles.content}>
              <form onSubmit={handleSubmit} className={styles.addQuestionForm}>
                <div className={styles.formGroup}>
                  <DateRangePicker
                    onDateRangeChange={handleDateRangeChange}
                    error={errors.startDate || errors.endDate}
                  />
                </div>

                <div className={styles.formActions}>
                  <button
                    type="button"
                    className={styles.cancelButton}
                    onClick={onClose}
                  >
                    İptal
                  </button>
                  <div className={styles.rightActions}>
                    <button
                      type="submit"
                      className={styles.deleteConfirmButton}
                    >
                      İleri
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Denetim Detayları Popup'ı */}
      <DenetimAssignmentPopup
        isOpen={showDetailsPopup}
        onClose={handleAssignmentClose}
        onBack={handleAssignmentBack}
        onSave={handleAssignmentSubmit}
        dateRange={selectedDateRange}
        isSliding={isSliding}
        slideDirection={slideDirection}
      />
    </>
  );
}