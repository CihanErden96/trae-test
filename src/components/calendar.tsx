"use client";

import React, { useState, useEffect } from 'react';
import calendarStyles from '../styles/calendar.module.css';

interface CalendarProps {
  isStartDateDisabled: boolean;
  onDateRangeChange: (startDate: string, endDate: string) => void;
  initialStartDate?: string;
  initialEndDate?: string;
}

const Calendar: React.FC<CalendarProps> = ({ 
  isStartDateDisabled, 
  onDateRangeChange,
  initialStartDate = '',
  initialEndDate = ''
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const monthNames = [
    'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
  ];

  const dayNames = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];

  // Tarih string'ini yerel timezone'da oluşturan yardımcı fonksiyon
  const formatDateToString = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // isStartDateDisabled true ise startDate'i bugüne ayarla (sadece ilk render'da)
  useEffect(() => {
    if (isStartDateDisabled && !startDate) {
      const todayString = formatDateToString(today);
      setStartDate(todayString);
    }
  }, [isStartDateDisabled, startDate, today]);

  // Parent component'e değişiklikleri bildir
  useEffect(() => {
    onDateRangeChange(startDate, endDate);
  }, [startDate, endDate, onDateRangeChange]);

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

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    
    // Pazartesi = 1, Salı = 2, ..., Pazar = 0
    const firstDayOfWeek = firstDay.getDay();
    const startDay = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
    
    const days = [];
    
    // Önceki ayın günleri
    const prevMonth = new Date(year, month - 1, 0);
    const prevMonthDays = prevMonth.getDate();
    for (let i = startDay - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonthDays - i),
        isCurrentMonth: false
      });
    }
    
    // Bu ayın günleri
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({
        date: new Date(year, month, day),
        isCurrentMonth: true
      });
    }
    
    // Sonraki ayın günleri (42 gün tamamlamak için)
    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      days.push({
        date: new Date(year, month + 1, day),
        isCurrentMonth: false
      });
    }
    
    return days;
  };

  const handleDateClick = (date: Date) => {
    const dateString = formatDateToString(date);
    
    // isStartDateDisabled true ise sadece endDate seçilebilir
    if (isStartDateDisabled) {
      if (date >= today) {
        setEndDate(dateString);
      }
      return;
    }

    // Normal mod: hem startDate hem endDate seçilebilir
    if (date >= today) {
      if (!startDate || (startDate && endDate)) {
        // İlk tarih seçimi veya yeniden başlama
        setStartDate(dateString);
        setEndDate('');
      } else if (startDate && !endDate) {
        // İkinci tarih seçimi
        const start = new Date(startDate);
        if (date >= start) {
          setEndDate(dateString);
        } else {
          // Eğer seçilen tarih başlangıçtan önce ise, yeni başlangıç yap
          setStartDate(dateString);
          setEndDate('');
        }
      }
    }
  };

  const isDateSelected = (date: Date) => {
    const dateStr = formatDateToString(date);
    return dateStr === startDate || dateStr === endDate;
  };

  const isDateInRange = (date: Date) => {
    if (!startDate || !endDate) return false;
    const start = new Date(startDate);
    const end = new Date(endDate);
    return date >= start && date <= end;
  };

  const isDateInHoverRange = (date: Date) => {
    if (!hoveredDate || !startDate || endDate) return false;
    const start = new Date(startDate);
    const minDate = start < hoveredDate ? start : hoveredDate;
    const maxDate = start > hoveredDate ? start : hoveredDate;
    return date >= minDate && date <= maxDate;
  };

  return (
    <div className={calendarStyles.calendarDropdown}>
      <div className={calendarStyles.calendarHeader}>
        <button 
          type="button" 
          className={calendarStyles.calendarNavButton} 
          onClick={() => navigateMonth('prev')}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <span className={calendarStyles.calendarTitle}>
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </span>
        <button 
          type="button" 
          className={calendarStyles.calendarNavButton} 
          onClick={() => navigateMonth('next')}
        >
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
            const isDisabled = date < today || (isStartDateDisabled && isToday);
            
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
  );
};

export default Calendar;