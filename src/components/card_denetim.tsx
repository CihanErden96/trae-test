"use client";

import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import styles from '../styles/card.module.css';
import popupStyles from '../styles/footer_popup.module.css';
import calendarStyles from '../styles/calendar.module.css';
import { hapticFeedback } from '../utils/haptic';
import ReusableCombobox from './combobox';
import { Question, ComboboxOption, denetimQuestionsData, getScoreOptions, Action } from './const';



// Ana Denetim Departman Card Component'i
export function CardDenetimDepartman() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [questionScores, setQuestionScores] = useState<{[key: number]: string}>({});
  const [isAddActionOpen, setIsAddActionOpen] = useState(false);
  const [selectedQuestionId, setSelectedQuestionId] = useState<number | null>(null);
  const [newAction, setNewAction] = useState({
    title: '',
    dueDate: '',
    image: ''
  });
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
  const [warningMessage, setWarningMessage] = useState<{[key: number]: string}>({});
  const [isActionDetailOpen, setIsActionDetailOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<Action | null>(null);

  // Denetim sorularını const.tsx'ten al
  const questions = denetimQuestionsData;

  // Bugünün tarihi
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Takvim için ay ve gün isimleri
  const monthNames = [
    'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
  ];

  const dayNames = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];

  // SVG circle için hesaplamalar
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (75 / 100) * circumference; // Sabit %75 değeri

  const handleCardClick = () => {
    hapticFeedback.navigation.select();
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    hapticFeedback.navigation.close();
    setIsPopupOpen(false);
  };

  const handleOverlayClick = (e: React.MouseEvent | React.TouchEvent) => {
    if (e.target === e.currentTarget) {
      handleClosePopup();
    }
  };

  const handleQuestionClick = (question: Question) => {
    hapticFeedback.navigation.select();
    console.log('Soru tıklandı:', question);
    // Burada soru detay sayfasına yönlendirme veya başka bir işlem yapılabilir
  };

  const handleScoreSelect = (questionId: number, score: string) => {
    const question = questions.find(q => q.id === questionId);
    const hasActions = question?.actions && question.actions.length > 0;
    const isMaxScore = question && score === question.score.toString();
    
    // Eğer aksiyon varken max value seçilmeye çalışırsa uyarı ver
    if (hasActions && isMaxScore) {
      hapticFeedback.form.error();
      setWarningMessage(prev => ({
        ...prev,
        [questionId]: "Aksiyonu olan sorular için maksimum puan seçilemez!"
      }));
      
      // 3 saniye sonra uyarıyı temizle
      setTimeout(() => {
        setWarningMessage(prev => {
          const newWarnings = { ...prev };
          delete newWarnings[questionId];
          return newWarnings;
        });
      }, 3000);
      
      return;
    }
    
    hapticFeedback.navigation.select();
    setQuestionScores(prev => ({
      ...prev,
      [questionId]: score
    }));
    
    // Uyarı mesajını temizle
    setWarningMessage(prev => {
      const newWarnings = { ...prev };
      delete newWarnings[questionId];
      return newWarnings;
    });
    
    console.log(`Soru ${questionId} için seçilen puan: ${score}`);
  };

  const handleAddAction = (questionId: number) => {
    hapticFeedback.action.create();
    setSelectedQuestionId(questionId);
    setIsAddActionOpen(true);
  };

  const handleCloseAddAction = () => {
    hapticFeedback.navigation.close();
    setIsAddActionOpen(false);
    setSelectedQuestionId(null);
    setNewAction({
      title: '',
      dueDate: '',
      image: ''
    });
    setSelectedDate('');
  };

  const handleSaveAction = () => {
    if (newAction.title.trim() && newAction.dueDate) {
      hapticFeedback.action.save();
      console.log('Yeni aksiyon kaydedildi:', {
        questionId: selectedQuestionId,
        title: newAction.title,
        dueDate: newAction.dueDate,
        image: newAction.image
      });
      handleCloseAddAction();
    } else {
      hapticFeedback.form.error();
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setNewAction(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      hapticFeedback.action.create();
      const imageUrl = URL.createObjectURL(file);
      setNewAction(prev => ({
        ...prev,
        image: imageUrl
      }));
    }
  };

  // Takvim fonksiyonları
  const navigateMonth = (direction: 'prev' | 'next') => {
    hapticFeedback.navigation.select();
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
    
    // Ayın ilk gününün haftanın hangi günü olduğunu bul (Pazartesi = 0)
    const firstDayOfWeek = (firstDay.getDay() + 6) % 7;
    
    const days = [];
    
    // Önceki ayın son günlerini ekle
    const prevMonth = new Date(year, month - 1, 0);
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonth.getDate() - i),
        isCurrentMonth: false
      });
    }
    
    // Bu ayın günlerini ekle
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({
        date: new Date(year, month, day),
        isCurrentMonth: true
      });
    }
    
    // Sonraki ayın ilk günlerini ekle (42 gün tamamlamak için)
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
    if (date >= today) {
      hapticFeedback.navigation.select();
      const dateString = date.toISOString().split('T')[0];
      
      if (!startDate || (startDate && endDate)) {
        // İlk tarih seçimi veya yeniden başlama
        setStartDate(dateString);
        setEndDate('');
        setSelectedDate(dateString);
        setNewAction(prev => ({
          ...prev,
          dueDate: dateString
        }));
      } else if (startDate && !endDate) {
        // İkinci tarih seçimi
        const start = new Date(startDate);
        if (date >= start) {
          setEndDate(dateString);
          setSelectedDate(dateString);
          setNewAction(prev => ({
            ...prev,
            dueDate: dateString
          }));
        } else {
          // Eğer seçilen tarih başlangıçtan önce ise, yeni başlangıç yap
          setStartDate(dateString);
          setEndDate('');
          setSelectedDate(dateString);
          setNewAction(prev => ({
            ...prev,
            dueDate: dateString
          }));
        }
      }
    }
  };

  const isDateSelected = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
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

  const handleTextareaResize = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.target.style.height = 'auto';
    e.target.style.height = e.target.scrollHeight + 'px';
  };

  const handleActionClick = (action: Action) => {
    hapticFeedback.navigation.select();
    setSelectedAction(action);
    setIsActionDetailOpen(true);
  };

  const handleCloseActionDetail = () => {
    hapticFeedback.navigation.close();
    setIsActionDetailOpen(false);
    setSelectedAction(null);
  };

  const handleToggleActionStatus = () => {
    if (selectedAction) {
      hapticFeedback.action.save();
      const newStatus = selectedAction.status === 'completed' ? 'incompleted' : 'completed';
      const completedDate = newStatus === 'completed' ? new Date().toISOString().split('T')[0] : '';
      
      // Burada gerçek uygulamada API çağrısı yapılacak
      console.log(`Aksiyon durumu güncellendi: ${selectedAction.id} -> ${newStatus}, completedDate: ${completedDate}`);
      
      // Local state'i güncelle
      setSelectedAction(prev => prev ? { 
        ...prev, 
        status: newStatus,
        completedDate: completedDate
      } : null);
    }
  };

  return (
    <>
      <div className={styles.cardContainer}>
        <div className={styles.card} onClick={handleCardClick}>
          <div className={styles.cardContent}>
            {/* Card Label - Sol Üst */}
            <div className={`${styles.cardLabel}`}>
              Denetim
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
                  75%
                </text>
              </svg>
            </div>
            
            {/* Bekleyen Denetimler Bilgi Alanı - Sol Orta */}
            <div 
              className={`${styles.descriptiveData} ${styles.descriptiveDataFirst}`}
            >
              İmalat
            </div>
            
            {/* Son Tarih Bilgi Alanı - Sol Alt */}
            <div
              className={`${styles.descriptiveData} ${styles.descriptiveDataSecond}`}
            >
              TT: 02.08.2025
            </div>
          </div>
        </div>
      </div>

      {/* Denetim Popup'ı */}
      {isPopupOpen && createPortal(
        <div className={popupStyles.overlay} 
             onClick={(e) => {e.preventDefault();hapticFeedback.navigation.close();handleOverlayClick(e);}}>
          <div className={popupStyles.popup}>
            <div className={popupStyles.header}>
              <h2 className={popupStyles.title}>Denetim Soruları</h2>
              <button 
                className={popupStyles.closeButton}
                onClick={(e) => {e.preventDefault();hapticFeedback.navigation.close();handleClosePopup();}}
                aria-label="Kapat"
              >
                ×
              </button>
            </div>
            
            <div className={popupStyles.content}>
              <div className={styles.questionsList}>
                {questions.map((question) => {
                  const currentScore = questionScores[question.id];
                  const hasActions = question.actions && question.actions.some(action => action.status === 'incompleted');
                  
                  // Eğer hiçbir aksiyon yoksa ve puan seçilmemişse, default olarak max value seç
                  // Eğer aksiyon varsa ve puan seçilmemişse, default olarak min value (0) seç
                  const defaultScore = !hasActions && !currentScore 
                    ? question.score.toString() 
                    : hasActions && !currentScore 
                      ? '0' 
                      : currentScore || '0';
                  
                  // Eğer max value seçilirse aksiyon bölümünü gizle
                  const isMaxScore = currentScore === question.score.toString();
                  
                  // Eğer hiçbir aksiyon yoksa ve score güncellenirse (ama max değilse), aksiyon bölümünü göster
                  // Veya zaten aksiyon varsa göster
                  const shouldShowActions = (hasActions || (!hasActions && currentScore)) && !isMaxScore;
                  
                  return (
                    <div key={question.id} className={styles.questionItem}>
                      {/* Soru Başlığı */}
                      <h3 className={styles.questionText}>
                        {question.question}
                      </h3>
                      
                      {/* Soru Açıklaması */}
                      <p className={styles.questionDescription}>
                        {question.description}
                      </p>
                      
                      {/* Puan Seçici */}
                      <div className={styles.scoreSelector}>
                        <ReusableCombobox
                          options={getScoreOptions(question.score)}
                          selectedValue={defaultScore}
                          onSelect={(value) => handleScoreSelect(question.id, value)}
                          placeholder="Puan"
                        />
                      </div>
                      
                      {/* Uyarı Mesajı */}
                      {warningMessage[question.id] && (
                        <div className={styles.warningMessage}>
                          {warningMessage[question.id]}
                        </div>
                      )}
                      
                      {shouldShowActions && (
                        <div className={styles.actionsSection}>
                          <h4 className={styles.actionsSectionTitle}>Aksiyonlar:</h4>
                          
                          {/* Eğer aksiyon varsa listele, yoksa sadece Aksiyon Ekle butonu göster */}
                          {hasActions && (
                            <div className={styles.actionsList}>
                               {question.actions?.map((action, index) => (
                                 <div 
                                   key={index} 
                                   className={`${styles.actionItem} ${styles.actionItemCard}`}
                                   onClick={(e) => {
                                     e.preventDefault();
                                     handleActionClick(action);
                                   }}
                                 >
                                   <p className={styles.actionDescription}>{action.title}</p>
                                   <p className={styles.actionScore}>
                                     {new Date(action.dueDate).toLocaleDateString('tr-TR')}
                                   </p>
                                 </div>
                               ))}
                            </div>
                          )}
                          
                          {/* Aksiyon Ekle Butonu */}
                          <div className={styles.addActionItem} 
                               onClick={() => handleAddAction(question.id)}>
                            <div className={styles.addActionContent}>
                              <div className={styles.addIcon}>+</div>
                              <div className={styles.addText}>
                                <h3 className={styles.addTitle}>Aksiyon Ekle</h3>
                                <p className={styles.addDescription}>Bu soru için yeni bir aksiyon ekleyin</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Add Action Popup */}
      {isAddActionOpen && createPortal(
        <div className={popupStyles.overlay}>
          <div className={popupStyles.popup}>
            <div className={popupStyles.header}>
              <h2 className={popupStyles.title}>Aksiyon Ekle</h2>
              <button
                onClick={handleCloseAddAction}
                className={popupStyles.closeButton}
              >
                ✕
              </button>
            </div>
            <div className={popupStyles.content}>
              <div className={styles.addActionForm}>
                <form onSubmit={(e) => e.preventDefault()}>
                {/* Aksiyon Açıklaması */}
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    Aksiyon Açıklaması *
                  </label>
                  <textarea
                    value={newAction.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Aksiyon açıklamasını yazın..."
                    className={styles.formTextarea}
                    onInput={handleTextareaResize}
                  />
                </div>

                {/* Tarih Seçimi */}
                <div className={styles.formGroup}>
                  
                  <div className={styles.dateSection}>
                    {/* Tarih Önizleme Alanı */}
                    <div className={calendarStyles.dateRangePreview}>
                      <span className={calendarStyles.previewText}>
                        {today && newAction.dueDate ? (
                          <>
                            {today.toLocaleDateString('tr-TR')} - {new Date(newAction.dueDate).toLocaleDateString('tr-TR')}
                            {(() => {
                              const start = new Date(today);
                              const end = new Date(newAction.dueDate);
                              const diffTime = Math.abs(end.getTime() - start.getTime());
                              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
                              return ` (${diffDays} gün)`;
                            })()}
                          </>
                        ) : today ? (
                          <>
                            Bugünkü tarih: {today.toLocaleDateString('tr-TR')} - 
                          </>
                        ) : (
                          ''
                        )}
                      </span>
                    </div>

                    {/* Takvim - Her zaman açık */}
                    <div className={calendarStyles.calendarDropdown}>
                      <div className={calendarStyles.calendarHeader}>
                        <button
                          type="button"
                          onClick={() => navigateMonth('prev')}
                          className={calendarStyles.calendarNavButton}
                        >
                          ‹
                        </button>
                        <h3 className={calendarStyles.calendarTitle}>
                          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                        </h3>
                        <button
                          type="button"
                          onClick={() => navigateMonth('next')}
                          className={calendarStyles.calendarNavButton}
                        >
                          ›
                        </button>
                      </div>
                      
                      <div className={calendarStyles.calendarGrid}>
                        <div className={calendarStyles.calendarWeekdays}>
                          {dayNames.map(day => (
                            <div key={day} className={calendarStyles.calendarWeekday}>
                              {day}
                            </div>
                          ))}
                        </div>
                        <div className={calendarStyles.calendarDays}>
                          {getDaysInMonth(currentMonth).map((day, index) => {
                            const isToday = day.date.toDateString() === today.toDateString();
                            const isPast = day.date < today;
                            const isSelected = isDateSelected(day.date);
                            const inRange = isDateInRange(day.date);
                            const inHoverRange = isDateInHoverRange(day.date);
                            const isStartDate = day.date.toDateString() === today.toDateString();
                            
                            return (
                              <button
                                key={index}
                                type="button"
                                onClick={() => !isStartDate ? handleDateClick(day.date) : null}
                                onMouseEnter={() => setHoveredDate(day.date)}
                                onMouseLeave={() => setHoveredDate(null)}
                                disabled={isPast || isStartDate}
                                className={`${calendarStyles.calendarDay} ${day.isCurrentMonth ? calendarStyles.calendarDayCurrentMonth : calendarStyles.calendarDayOtherMonth} ${isToday ? calendarStyles.calendarDayToday : ''} ${isSelected || isStartDate ? calendarStyles.calendarDaySelected : ''} ${inRange ? calendarStyles.calendarDayInRange : ''} ${inHoverRange ? calendarStyles.calendarDayHoverRange : ''} ${isPast || isStartDate ? calendarStyles.calendarDayDisabled : ''}`}
                              >
                                {day.date.getDate()}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Fotoğraf Yükleme */}
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    Fotoğraf Ekle
                  </label>
                  
                  <div className={styles.imageUploadSection}>
                    {/* Fotoğraf Yükleme Butonları - Sadece fotoğraf yoksa göster */}
                    {!newAction.image && (
                      <div className={styles.imageUploadButtons}>
                        <label className={styles.imageUploadButton}>
                          <input
                            type="file"
                            accept="image/*"
                            capture="environment"
                            onChange={handleImageUpload}
                            className={styles.hiddenInput}
                          />
                          <div className={styles.imageUploadIcon}>📷</div>
                          <p className={styles.imageUploadText}>Kamera</p>
                        </label>
                        
                        <label className={styles.imageUploadButton}>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className={styles.hiddenInput}
                          />
                          <div className={styles.imageUploadIcon}>🖼️</div>
                          <p className={styles.imageUploadText}>Galeri</p>
                        </label>
                      </div>
                    )}

                    {/* Fotoğraf Önizlemesi */}
                    {newAction.image && (
                      <div className={styles.imagePreview}>
                        <img 
                          src={newAction.image} 
                          alt="Önizleme" 
                          className={styles.imagePreviewImg}
                        />
                        <button
                          type="button"
                          onClick={() => handleInputChange('image', '')}
                          className={styles.imageRemoveButton}
                        >
                          ✕
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Form Butonları */}
                <div className={styles.addActionFormActions}>
                  <button
                    type="button"
                    onClick={handleCloseAddAction}
                    className={styles.addActionCancelButton}
                  >
                    İptal
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveAction}
                    disabled={!newAction.title.trim() || !newAction.dueDate}
                    className={styles.addActionSaveButton}
                  >
                    Kaydet
                  </button>
                </div>
                </form>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Action Detail Popup */}
      {isActionDetailOpen && selectedAction && createPortal(
        <div className={styles.overlay} onClick={handleCloseActionDetail}>
          <div className={styles.popup} onClick={(e) => e.stopPropagation()}>
            <div className={styles.header}>
              <h2 className={styles.title}>Aksiyon Detayı</h2>
              <button
                onClick={handleCloseActionDetail}
                className={styles.closeButton}
              >
                ✕
              </button>
            </div>
            
            <div className={styles.content}>
              <div className={styles.actionDetailContent}>
                
                {/* Başlık */}
                <div className={styles.detailSection}>
                  <h4 className={styles.detailLabel}>Başlık</h4>
                  <p className={styles.detailText}>{selectedAction.title}</p>
                </div>

                {/* Açıklama */}
                <div className={styles.detailSection}>
                  <h4 className={styles.detailLabel}>Açıklama</h4>
                  <p className={styles.detailText}>{selectedAction.description || 'Açıklama bulunmuyor'}</p>
                </div>

                {/* Tarihler */}
                <div className={styles.dateRow}>
                  <div className={styles.detailSection}>
                    <h4 className={styles.detailLabel}>Başlangıç Tarihi</h4>
                    <p className={styles.detailText}>{selectedAction.startDate || 'Belirtilmemiş'}</p>
                  </div>
                  <div className={styles.detailSection}>
                    <h4 className={styles.detailLabel}>Termin Tarihi</h4>
                    <p className={styles.detailText}>{new Date(selectedAction.dueDate).toLocaleDateString('tr-TR')}</p>
                  </div>
                </div>

                {/* Durum */}
                <div className={styles.detailSection}>
                  <h4 className={styles.detailLabel}>Durum</h4>
                  <p className={styles.detailText}>
                    {selectedAction.status === 'completed' ? 'Tamamlandı' : 'Tamamlanmadı'}
                  </p>
                </div>

                {/* Fotoğraf */}
                {selectedAction.image && (
                  <div className={styles.detailSection}>
                    <h4 className={styles.detailLabel}>Fotoğraf</h4>
                    <div className={styles.imageContainer}>
                      <img 
                        src={selectedAction.image} 
                        alt="Aksiyon fotoğrafı"
                        className={styles.actionImage}
                      />
                    </div>
                  </div>
                )}

                {/* Durum Değiştirme Butonu */}
                <div className={styles.actionButtons}>
                  <button
                    onClick={handleToggleActionStatus}
                    className={`${styles.statusToggleButton} ${styles.markCompleteButton}`}
                  >
                    {selectedAction.status === 'completed' 
                      ? 'Tamamlanmadı olarak işaretle' 
                      : 'Tamamlandı olarak işaretle'
                    }
                  </button>
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