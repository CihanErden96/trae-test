"use client";

import React, { useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import styles from '../styles/card.module.css';
import popupStyles from '../styles/footer_popup.module.css';
import calendarStyles from '../styles/calendar.module.css';
import { hapticFeedback } from '../utils/haptic';
import ReusableCombobox from './combobox';
import Calendar from './calendar';
import { Question, denetimQuestionsData, getScoreOptions, Action } from './const';
import ActionDetailPopup from './actionDetail_popup';



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

  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [warningMessage, setWarningMessage] = useState<{[key: number]: string}>({});
  const [selectedAction, setSelectedAction] = useState<Action | null>(null);
  const [showCompleteConfirmation, setShowCompleteConfirmation] = useState(false);

  // Denetim sorularını const.tsx'ten al
  const questions = denetimQuestionsData;

  // Bugünün tarihi
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Bugünün tarihini string formatında al
  const formatDateToString = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const todayString = formatDateToString(today);

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
    const hasActions = question?.actions && question.actions.some(action => action.status !== 'completed' && new Date(action.dueDate) < today);
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
    setStartDate('');
    setEndDate('');
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

  const handleDateRangeChange = useCallback((start: string, end: string) => {
    setStartDate(start);
    setEndDate(end);
    // Eğer end date varsa, onu newAction'ın dueDate'i olarak ayarla
    if (end) {
      setNewAction(prev => ({
        ...prev,
        dueDate: end
      }));
    }
  }, []);

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

  // Gelişmiş kamera özelliği
  const handleCameraCapture = useCallback(async () => {
    try {
      hapticFeedback.action.create();
      
      // getUserMedia API'si ile kamera erişimi
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // Arka kamera
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      });

      // Video element oluştur
      const video = document.createElement('video');
      video.srcObject = stream;
      video.autoplay = true;
      video.playsInline = true;

      // Canvas element oluştur
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');

      // Video yüklendiğinde fotoğraf çek
      video.onloadedmetadata = () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        // Fotoğraf çekme işlemi
        setTimeout(() => {
          if (context) {
            context.drawImage(video, 0, 0);
            
            // Canvas'ı blob'a çevir
            canvas.toBlob((blob) => {
              if (blob) {
                const imageUrl = URL.createObjectURL(blob);
                setNewAction(prev => ({
                  ...prev,
                  image: imageUrl
                }));
              }
              
              // Stream'i kapat
              stream.getTracks().forEach(track => track.stop());
            }, 'image/jpeg', 0.9);
          }
        }, 100);
      };

    } catch (error) {
      console.error('Kamera erişimi hatası:', error);
      // Fallback olarak normal file input kullan
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = 'image/*';
      fileInput.capture = 'environment';
      fileInput.onchange = (e) => {
        const target = e.target as HTMLInputElement;
        if (target.files?.[0]) {
          handleImageUpload({ target } as React.ChangeEvent<HTMLInputElement>);
        }
      };
      fileInput.click();
    }
  }, []);



  const handleTextareaResize = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.target.style.height = 'auto';
    e.target.style.height = e.target.scrollHeight + 'px';
  };

  const handleActionClick = (action: Action) => {
    hapticFeedback.navigation.select();
    setSelectedAction(action);
  };

  const handleCompleteAudit = () => {
    hapticFeedback.action.save();
    console.log('Denetim tamamlandı!');
    // Burada gerçek uygulamada API çağrısı yapılacak
    setShowCompleteConfirmation(false);
    setIsPopupOpen(false);
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
        <div className={styles.overlay} 
             onClick={(e) => {e.preventDefault();hapticFeedback.navigation.close();handleOverlayClick(e);}}>
          <div className={styles.popup}>
            <div className='popup-header'>
              <h2 className='popup-title'>Denetim Soruları</h2>
              <button 
                className='popup-close-button'
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
                  const hasActions = question.actions && question.actions.length>0;
                  
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
              
              {/* Denetimi Tamamla Butonu */}
              <div className={styles.actionButtons}>
                <button 
                  className={`${styles.statusToggleButton} ${styles.markCompleteButton}`}
                  onClick={() => setShowCompleteConfirmation(true)}
                >
                  Denetimi Tamamla
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Add Action Popup */}
      {isAddActionOpen && createPortal(
        <div className={styles.overlay}>
          <div className={styles.popup}>
            <div className='popup-header'>
              <h2 className='popup-title'>Aksiyon Ekle</h2>
              <button 
                className='popup-close-button'
                onClick={() => handleCloseAddAction()}
                aria-label="Kapat"
              >
                ×
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

                    {/* Takvim - Calendar Component */}
                    <Calendar
                      isStartDateDisabled={true}
                      onDateRangeChange={handleDateRangeChange}
                      initialStartDate={todayString}
                      initialEndDate={endDate}
                    />
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
                        <button
                          type="button"
                          className={styles.imageUploadButton}
                          onClick={handleCameraCapture}
                        >
                          <div className={styles.imageUploadIcon}>📷</div>
                          <p className={styles.imageUploadText}>Kamera</p>
                        </button>
                        
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
                    className={styles.addActionButton}
                  >
                    İptal
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveAction}
                    disabled={!newAction.title.trim() || !newAction.dueDate}
                    className={styles.addActionButton}
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
      {selectedAction && (
        <ActionDetailPopup
          selectedAction={selectedAction}
          isDueDateEditable={true}
          isCompletedButtonEnabled={true}
          onActionUpdate={(updatedAction) => {
            setSelectedAction(updatedAction);
            // Bu durumda questions içindeki actions'ları güncellememiz gerekiyor
            // Ancak şu an questions const olarak tanımlı, bu yüzden sadece selectedAction'ı güncelliyoruz
            console.log('Action updated:', updatedAction);
          }}
        />
      )}

      {/* Denetimi Tamamla Onay Popup'ı */}
      {showCompleteConfirmation && createPortal(
        <div className={styles.overlay} onClick={() => setShowCompleteConfirmation(false)}>
          <div 
            className={`${popupStyles.popup} ${popupStyles.confirmationPopup}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="popup-header">
              <h2 className="popup-title">Emin misiniz?</h2>
              <button className="popup-close-button"onClick={() => setShowCompleteConfirmation(false)}>
                ×
              </button>
            </div>
            <div className={popupStyles.content}>
              <div className={popupStyles.confirmationContent}>
                <p className={popupStyles.confirmationMessage}>
                   Denetimi tamamlamak istediğinizden emin misiniz?
                </p>
                <p className={popupStyles.confirmationWarning}>
                  Tamamlanan denetimler düzenlenemez.
                </p>
                <div className={popupStyles.confirmationActions}>
                  <button 
                    className={popupStyles.cancelButton}
                    onClick={() => setShowCompleteConfirmation(false)}
                  >
                    İptal
                  </button>
                  <button 
                    className={popupStyles.deleteButton}
                    onClick={handleCompleteAudit}
                  >
                    Tamamla
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