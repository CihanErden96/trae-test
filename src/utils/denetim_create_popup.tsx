"use client";

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import styles from '../styles/card.module.css';
import calendarStyles from '../styles/calendar.module.css';
import assignmentStyles from '../styles/denetim_assignment_popup.module.css';

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
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  error?: string;
}

function DateRangePicker({ startDate, endDate, onStartDateChange, onEndDateChange, error }: DateRangePickerProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const formatDateForDisplay = (dateStr: string) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('tr-TR');
  };

  const formatDateForInput = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    // Pazartesi başlangıcı için: 0 (Pazar) -> 6, 1 (Pazartesi) -> 0, 2 (Salı) -> 1, vb.
    const startingDayOfWeek = (firstDay.getDay() + 6) % 7;

    const days = [];
    
    // Önceki ayın günleri
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const prevDate = new Date(year, month, -i);
      days.push({ date: prevDate, isCurrentMonth: false });
    }
    
    // Bu ayın günleri
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(year, month, day);
      days.push({ date: currentDate, isCurrentMonth: true });
    }
    
    // Sonraki ayın günleri (42 gün tamamlamak için)
    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      const nextDate = new Date(year, month + 1, day);
      days.push({ date: nextDate, isCurrentMonth: false });
    }
    
    return days;
  };

  const isDateInRange = (date: Date) => {
    if (!startDate || !endDate) return false;
    const start = new Date(startDate);
    const end = new Date(endDate);
    return date >= start && date <= end;
  };

  const isDateSelected = (date: Date) => {
    const dateStr = formatDateForInput(date);
    return dateStr === startDate || dateStr === endDate;
  };

  const isDateInHoverRange = (date: Date) => {
    if (!hoveredDate || !startDate || endDate) return false;
    const start = new Date(startDate);
    const minDate = start < hoveredDate ? start : hoveredDate;
    const maxDate = start > hoveredDate ? start : hoveredDate;
    return date >= minDate && date <= maxDate;
  };

  const handleDateClick = (date: Date) => {
    const dateStr = formatDateForInput(date);
    
    // Ay değişimi yapmadan sadece tarih seçimi yap
    // (Ay değişimi sadece ileri/geri butonları ile yapılacak)
    
    if (!startDate || (startDate && endDate)) {
      // İlk tarih seçimi veya yeniden başlama
      onStartDateChange(dateStr);
      onEndDateChange('');
    } else if (startDate && !endDate) {
      // İkinci tarih seçimi
      const start = new Date(startDate);
      if (date >= start) {
        onEndDateChange(dateStr);
      } else {
        // Eğer seçilen tarih başlangıçtan önce ise, yeni başlangıç yap
        onStartDateChange(dateStr);
        onEndDateChange('');
      }
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      if (direction === 'prev') {
        newMonth.setMonth(prev.getMonth() - 1);
      } else {
        newMonth.setMonth(prev.getMonth() + 1);
      }
      return newMonth;
    });
  };

  const monthNames = [
    'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
  ];

  const dayNames = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];

  return (
    <div className={calendarStyles.dateRangeContainer}>
      <div className={calendarStyles.calendarDropdown}>
        <div className={calendarStyles.calendarHeader}>
          <button type="button" className={calendarStyles.calendarNavButton} 
                  onTouchStart={(e) => {e.preventDefault();}}
                  onMouseDown={(e) => {e.preventDefault();}}
                  onClick={(e) => {e.preventDefault();navigateMonth('prev');}}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <span className={calendarStyles.calendarTitle}>
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </span>
          <button type="button" className={calendarStyles.calendarNavButton} 
                  onTouchStart={(e) => {e.preventDefault();}}
                  onMouseDown={(e) => {e.preventDefault();}}
                  onClick={(e) => {e.preventDefault();navigateMonth('next');}}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        <div className={calendarStyles.calendarGrid}>
          <div className={calendarStyles.calendarWeekdays}>
            {dayNames.map(day => (
              <div key={day} className={calendarStyles.calendarWeekday}>{day}</div>
            ))}
          </div>
          
          <div className={calendarStyles.calendarDays}>
            {getDaysInMonth(currentMonth).map(({ date, isCurrentMonth }, index) => {
              const isToday = date.toDateString() === today.toDateString();
              const isSelected = isDateSelected(date);
              const isInRange = isDateInRange(date);
              const isInHoverRange = isDateInHoverRange(date);
              const isDisabled = date < today; // Sadece geçmiş tarihler disabled
              
              // Tarih aralığı pozisyon kontrolü
              const isRangeStart = startDate && date.toDateString() === new Date(startDate).toDateString();
              const isRangeEnd = endDate && date.toDateString() === new Date(endDate).toDateString();
              const isSingleDay = startDate && endDate && startDate === endDate && isSelected;
              
              return (
                <button
                  key={index}
                  type="button"
                  className={`${calendarStyles.calendarDay} 
                    ${isCurrentMonth ? calendarStyles.calendarDayCurrentMonth : calendarStyles.calendarDayOtherMonth}
                    ${isToday ? calendarStyles.calendarDayToday : ''}
                    ${isSelected ? calendarStyles.calendarDaySelected : ''}
                    ${isInRange ? calendarStyles.calendarDayInRange : ''}
                    ${isInHoverRange ? calendarStyles.calendarDayHoverRange : ''}
                    ${isDisabled ? calendarStyles.calendarDayDisabled : ''}
                    ${isSingleDay ? calendarStyles.calendarDayRangeSingle : ''}
                    ${isRangeStart ? calendarStyles.calendarDayRangeStart : ''}
                    ${isRangeEnd ? calendarStyles.calendarDayRangeEnd : ''}
                  `}
                  onTouchStart={(e) => {e.preventDefault();if (!isDisabled) setHoveredDate(date);}}
                  onMouseDown={(e) => {e.preventDefault();if (!isDisabled) setHoveredDate(date);}}
                  onClick={(e) => {e.preventDefault();if (!isDisabled) handleDateClick(date);}}
                  onMouseEnter={() => !isDisabled && setHoveredDate(date)}
                  onMouseLeave={() => setHoveredDate(null)}
                  disabled={isDisabled}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {error && (
        <span className={styles.formError}>{error}</span>
      )}
      
      <div className={calendarStyles.dateRangePreview}>
        <span className={calendarStyles.previewText}>
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
  
  // Custom dropdown state'leri
  const [openDropdowns, setOpenDropdowns] = useState<{ [department: string]: boolean }>({});
  const [dropdownPositions, setDropdownPositions] = useState<{ [department: string]: { top: number; left: number; width: number } }>({});
  const comboboxRefs = useRef<{ [department: string]: HTMLDivElement | null }>({});

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
    'Gamze Özdemir'
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

  // assignmentData'nın departmentResponsibles'ını varsayılan değerlerle güncelle
  useEffect(() => {
    if (Object.keys(defaultResponsibles).length > 0 && Object.keys(assignmentData.departmentResponsibles).length === 0) {
      setAssignmentData(prev => ({
        ...prev,
        departmentResponsibles: defaultResponsibles
      }));
    }
  }, [defaultResponsibles, assignmentData.departmentResponsibles]);

  // Dropdown'ların dışına tıklandığında kapatma
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      // Eğer tıklanan element combobox veya dropdown içinde değilse, tüm dropdown'ları kapat
      if (!target.closest('[data-combobox]') && !target.closest('[data-dropdown]')) {
        setOpenDropdowns({});
      }
    };

    if (Object.values(openDropdowns).some(isOpen => isOpen)) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [openDropdowns]);

  // Departman sorumlusu seçme fonksiyonu
  const handleResponsibleSelect = (department: string, person: string) => {
    setAssignmentData(prev => ({
      ...prev,
      departmentResponsibles: {
        ...prev.departmentResponsibles,
        [department]: person
      }
    }));
    
    // Dropdown'ı kapat
    setOpenDropdowns(prev => ({ ...prev, [department]: false }));
  };

  // Dropdown toggle fonksiyonu
  const toggleDropdown = (department: string) => {
    const isOpening = !openDropdowns[department];
    
    if (isOpening) {
      // Dropdown açılırken pozisyonu hesapla
      const comboboxElement = comboboxRefs.current[department];
      if (comboboxElement) {
        const rect = comboboxElement.getBoundingClientRect();
        setDropdownPositions(prev => ({
          ...prev,
          [department]: {
            top: rect.bottom + window.scrollY,
            left: rect.left + window.scrollX,
            width: rect.width
          }
        }));
      }
      
      // Diğer tüm dropdown'ları kapat ve seçileni aç
      setOpenDropdowns(prev => {
        const newState: { [key: string]: boolean } = {};
        Object.keys(prev).forEach(key => {
          newState[key] = false; // Önce hepsini kapat
        });
        newState[department] = true; // Seçilen departmanı aç
        return newState;
      });
    } else {
      // Dropdown kapatılıyor
      setOpenDropdowns(prev => ({ ...prev, [department]: false }));
    }
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

  const handleOverlayClick = (e: React.MouseEvent | React.TouchEvent) => {
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
        <div className={styles.overlay} 
             onTouchStart={(e) => {e.preventDefault();if (e.target === e.currentTarget) {/* haptic feedback yok */}}}
             onMouseDown={(e) => {e.preventDefault();if (e.target === e.currentTarget) {/* haptic feedback yok */}}}
             onClick={(e) => {e.preventDefault();handleOverlayClick(e);}}>
          <div className={`${styles.popup} ${isSliding ? (slideDirection === 'forward' ? styles.slideInRight : styles.slideOutRight) : ''}`}>
            <div className={styles.header}>
              <h2 className={styles.title}>Denetim Atama</h2>
              <button className={styles.closeButton} 
                      onTouchStart={(e) => {e.preventDefault();}}
                      onMouseDown={(e) => {e.preventDefault();}}
                      onClick={(e) => {e.preventDefault();onClose();}}>
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

                          {/* Modern Combobox */}
                          <div className={assignmentStyles.comboboxContainer} data-combobox>
                            <div
                              ref={(el) => { comboboxRefs.current[department] = el; }}
                              onTouchStart={(e) => {e.preventDefault();}}
                              onMouseDown={(e) => {e.preventDefault();}}
                              onClick={(e) => {e.preventDefault();toggleDropdown(department);}}
                              className={`${assignmentStyles.combobox} ${openDropdowns[department] ? assignmentStyles.open : ''}`}
                            >
                              <span>
                                {assignmentData.departmentResponsibles[department] || 'Sorumlu seçin'}
                              </span>
                              <span className={`${assignmentStyles.comboboxArrow} ${openDropdowns[department] ? assignmentStyles.open : ''}`}>
                                ▼
                              </span>
                            </div>
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
                    onTouchStart={(e) => {e.preventDefault();}}
                    onMouseDown={(e) => {e.preventDefault();}}
                    onClick={(e) => {e.preventDefault();onClose();}}
                  >
                    İptal
                  </button>
                  <div className={styles.rightActions}>
                    <button
                      type="button"
                      className={styles.cancelButton}
                      onTouchStart={(e) => {e.preventDefault();}}
                      onMouseDown={(e) => {e.preventDefault();}}
                      onClick={(e) => {e.preventDefault();onBack();}}
                    >
                      Geri
                    </button>
                    <button
                      type="submit"
                      className={styles.deleteConfirmButton}
                      onTouchStart={(e) => {e.preventDefault();}}
                      onMouseDown={(e) => {e.preventDefault();}}
                      onClick={(e) => {e.preventDefault();onClose();}}
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

      {/* Dropdown'lar için Portal */}
      {Object.entries(openDropdowns).map(([department, isOpen]) => 
        isOpen && dropdownPositions[department] && createPortal(
          <div
            key={department}
            data-dropdown
            className={assignmentStyles.dropdown}
            style={{
              position: 'absolute',
              top: dropdownPositions[department].top,
              left: dropdownPositions[department].left,
              width: dropdownPositions[department].width
            }}
          >
            {allPersonnel.map((person, personIndex) => (
                <div
                  key={personIndex}
                  onTouchStart={(e) => {e.preventDefault();}}
                  onMouseDown={(e) => {e.preventDefault();}}
                  onClick={(e) => {e.preventDefault();handleResponsibleSelect(department, person);}}
                  className={`${assignmentStyles.dropdownItem} ${
                    assignmentData.departmentResponsibles[department] === person 
                      ? assignmentStyles.selected 
                      : ''
                  }`}
                >
                  {person}
                </div>
              ))}
          </div>,
          document.body
        )
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

  const handleInputChange = (field: keyof DenetimData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
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

  const handleOverlayClick = (e: React.MouseEvent | React.TouchEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Ana Tarih Seçimi Popup'ı */}
      {!showDetailsPopup && createPortal(
        <div className={styles.overlay} 
             onTouchStart={(e) => {e.preventDefault();if (e.target === e.currentTarget) {/* haptic feedback yok */}}}
             onMouseDown={(e) => {e.preventDefault();if (e.target === e.currentTarget) {/* haptic feedback yok */}}}
             onClick={(e) => {e.preventDefault();handleOverlayClick(e);}}>
          <div className={`${styles.popup} ${isSliding ? (slideDirection === 'forward' ? styles.slideOutLeft : styles.slideInLeft) : ''}`}>
            <div className={styles.header}>
              <h2 className={styles.title}>Denetim Oluştur</h2>
              <button className={styles.closeButton} 
                      onTouchStart={(e) => {e.preventDefault();}}
                      onMouseDown={(e) => {e.preventDefault();}}
                      onClick={(e) => {e.preventDefault();onClose();}}>
                ×
              </button>
            </div>
            
            <div className={styles.content}>
              <form onSubmit={handleSubmit} className={styles.addQuestionForm}>
                <div className={styles.formGroup}>
                  <DateRangePicker
                    startDate={formData.startDate}
                    endDate={formData.endDate}
                    onStartDateChange={(date) => handleInputChange('startDate', date)}
                    onEndDateChange={(date) => handleInputChange('endDate', date)}
                    error={errors.startDate || errors.endDate}
                  />
                </div>

                <div className={styles.formActions}>
                  <button
                    type="button"
                    className={styles.cancelButton}
                    onTouchStart={(e) => {e.preventDefault();}}
                    onMouseDown={(e) => {e.preventDefault();}}
                    onClick={(e) => {e.preventDefault();onClose();}}
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