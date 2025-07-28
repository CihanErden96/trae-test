"use client";

import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import styles from '../styles/card.module.css';
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
          <button type="button" className={calendarStyles.calendarNavButton} onClick={() => navigateMonth('prev')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <span className={calendarStyles.calendarTitle}>
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </span>
          <button type="button" className={calendarStyles.calendarNavButton} onClick={() => navigateMonth('next')}>
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
                  onClick={() => !isDisabled && handleDateClick(date)}
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

export default function DenetimPopup({ isOpen, onClose, onSubmit }: DenetimPopupProps) {
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

  const handleInputChange = (field: keyof DenetimData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

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
      onSubmit(formData);
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
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.popup}>
        <div className={styles.header}>
          <h2 className={styles.title}>Denetim Oluştur</h2>
          <button className={styles.closeButton} onClick={onClose}>
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
  );
}