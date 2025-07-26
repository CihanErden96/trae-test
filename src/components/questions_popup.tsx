"use client";

import React, { useState } from 'react';
import styles from '../styles/popup.module.css';

interface Question {
  id: number;
  question: string;
  description: string;
  category: string;
  score: number;
}

interface QuestionsPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const QuestionsPopup: React.FC<QuestionsPopupProps> = ({ isOpen, onClose }) => {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [isAddQuestionOpen, setIsAddQuestionOpen] = useState(false);
  const [newQuestion, setNewQuestion] = useState({
    category: '',
    question: '',
    description: '',
    score: ''
  });

  const questions: Question[] = [
    {
      id: 1,
      question: "Gereksiz malzemeleri nasıl ayıklayabilirim?",
      description: "İş alanında kullanılmayan, bozuk veya gereksiz malzemelerin belirlenmesi ve ayrılması süreçleri. Kırmızı etiket uygulaması ve karar verme kriterleri.",
      category: "Ayıkla",
      score: 10
    },
    {
      id: 2,
      question: "Kırmızı etiket sistemi nasıl uygulanır?",
      description: "Şüpheli malzemelerin işaretlenmesi, değerlendirme süreci ve karar verme mekanizmaları. Etiketleme kuralları ve takip sistemi.",
      category: "Ayıkla",
      score: 10
    },
    {
      id: 3,
      question: "İş alanını nasıl düzenleyebilirim?",
      description: "Her şeyin yerinin belirlenmesi, etiketleme sistemleri ve görsel yönetim araçlarının kullanımı. Verimli çalışma alanı tasarımı.",
      category: "Düzenle",
      score: 10
    },
    {
      id: 4,
      question: "Araç ve malzeme yerleşimi nasıl optimize edilir?",
      description: "Sık kullanılan malzemelerin yakın konumlandırılması, ergonomik düzenleme ve erişim kolaylığı sağlama teknikleri.",
      category: "Düzenle",
      score: 10
    },
    {
      id: 5,
      question: "Temizlik standartları nasıl uygulanır?",
      description: "Günlük, haftalık ve aylık temizlik rutinleri. Temizlik kontrol listeleri ve sorumluluk alanlarının belirlenmesi.",
      category: "Temizle",
      score: 85
    },
    {
      id: 6,
      question: "Temizlik kontrol listeleri nasıl hazırlanır?",
      description: "Detaylı temizlik görevlerinin listelenmesi, sorumluluk dağılımı ve kontrol mekanizmalarının oluşturulması.",
      category: "Temizle",
      score: 10
    },
    {
      id: 7,
      question: "Standartları nasıl oluşturup uygularım?",
      description: "İş prosedürlerinin standartlaştırılması, görsel talimatların hazırlanması ve çalışan eğitimi süreçleri.",
      category: "Standartlaştır",
      score: 90
    },
    {
      id: 8,
      question: "Görsel yönetim araçları nasıl kullanılır?",
      description: "İş talimatlarının görselleştirilmesi, renk kodlama sistemleri ve anında anlaşılabilir işaretleme teknikleri.",
      category: "Standartlaştır",
      score: 10
    },
    {
      id: 9,
      question: "5S uygulamalarını nasıl sürdürebilirim?",
      description: "Sürekli iyileştirme kültürü, düzenli denetimler ve çalışan katılımının sağlanması. Motivasyon ve ödül sistemleri.",
      category: "Sürdür",
      score: 10
    },
    {
      id: 10,
      question: "5S denetim sistemi nasıl kurulur?",
      description: "Düzenli denetim programları, değerlendirme kriterleri ve geri bildirim mekanizmalarının oluşturulması. Sürekli iyileştirme döngüsü.",
      category: "Sürdür",
      score: 10
    }
  ];

  // Soruları kategorilere göre gruplandır
  const groupedQuestions = questions.reduce((groups, question) => {
    const category = question.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(question);
    return groups;
  }, {} as Record<string, Question[]>);

  // Mevcut kategorileri al
  const availableCategories = Object.keys(groupedQuestions);

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const handleQuestionClick = (question: Question) => {
    console.log('Seçilen soru:', question);
    // Burada soruya tıklandığında yapılacak işlemler
  };

  const handleAddQuestion = () => {
    setIsAddQuestionOpen(true);
  };

  const handleCloseAddQuestion = () => {
    setIsAddQuestionOpen(false);
    setNewQuestion({
      category: '',
      question: '',
      description: '',
      score: ''
    });
  };

  const handleSaveQuestion = () => {
    if (newQuestion.category && newQuestion.question && newQuestion.description && newQuestion.score) {
      console.log('Yeni soru kaydediliyor:', newQuestion);
      // Burada yeni soruyu kaydetme işlemi yapılacak
      handleCloseAddQuestion();
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setNewQuestion(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTextareaResize = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = Math.max(40, textarea.scrollHeight) + 'px';
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.popup}>
        <div className={styles.header}>
          <h2 className={styles.question}>5S Soruları</h2>
          <button 
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Kapat"
          >
            ×
          </button>
        </div>
        
        <div className={styles.content}>
          <div className={styles.questionsList}>
            {Object.entries(groupedQuestions).map(([category, categoryQuestions]) => (
              <div key={category} className={styles.categoryGroup}>
                <div 
                  className={styles.categoryHeader}
                  onClick={() => toggleCategory(category)}
                >
                  <div className={styles.categoryTitle}>
                    <span className={styles.categoryIcon}>
                      {expandedCategories.has(category) ? '▼' : '▶'}
                    </span>
                    <h3 className={styles.categoryName}>{category}</h3>
                    <span className={styles.questionCount}>({categoryQuestions.length})</span>
                  </div>
                </div>
                
                {expandedCategories.has(category) && (
                  <div className={styles.categoryContent}>
                    {categoryQuestions.map((question) => (
                      <div 
                        key={question.id}
                        className={styles.questionItem}
                        onClick={() => handleQuestionClick(question)}
                      >
                        <div className={styles.questionHeader}>
                          <h3 className={styles.questionquestion}>{question.question}</h3>
                          <div className={styles.questionScore}>{question.score}</div>
                        </div>
                        <p className={styles.questionDescription}>{question.description}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            
            <div className={styles.addQuestionItem} onClick={handleAddQuestion}>
              <div className={styles.addQuestionContent}>
                <div className={styles.addIcon}>+</div>
                <div className={styles.addText}>
                  <h3 className={styles.addTitle}>Yeni Soru Ekle</h3>
                  <p className={styles.addDescription}>Kendi sorunuzu ekleyerek listeyi genişletin</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Yeni Soru Ekleme Popup'ı */}
      {isAddQuestionOpen && (
        <div className={styles.overlay} onClick={(e) => {
          if (e.target === e.currentTarget) {
            handleCloseAddQuestion();
          }
        }}>
          <div className={styles.popup}>
            <div className={styles.header}>
              <h2 className={styles.title}>Yeni Soru Ekle</h2>
              <button 
                className={styles.closeButton}
                onClick={handleCloseAddQuestion}
                aria-label="Kapat"
              >
                ×
              </button>
            </div>
            
            <div className={styles.content}>
              <div className={styles.addQuestionForm}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Kategori</label>
                  <select 
                    className={styles.formSelect}
                    value={newQuestion.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                  >
                    <option value="">Kategori seçin...</option>
                    {availableCategories.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Soru</label>
                  <textarea 
                    className={styles.formTextarea}
                    placeholder="Sorunuzu yazın..."
                    value={newQuestion.question}
                    onChange={(e) => {
                      handleInputChange('question', e.target.value);
                      handleTextareaResize(e);
                    }}
                    rows={1}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Açıklama</label>
                  <textarea 
                    className={styles.formTextarea}
                    placeholder="Soru açıklamasını yazın..."
                    value={newQuestion.description}
                    onChange={(e) => {
                      handleInputChange('description', e.target.value);
                      handleTextareaResize(e);
                    }}
                    rows={1}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Puan</label>
                  <input 
                    type="number"
                    className={styles.formInput}
                    placeholder="Puan girin (0-100)"
                    value={newQuestion.score}
                    onChange={(e) => handleInputChange('score', e.target.value)}
                    min="0"
                    max="100"
                  />
                </div>

                <div className={styles.formActions}>
                  <button 
                    className={styles.cancelButton}
                    onClick={handleCloseAddQuestion}
                  >
                    İptal
                  </button>
                  <button 
                    className={styles.saveButton}
                    onClick={handleSaveQuestion}
                    disabled={!newQuestion.category || !newQuestion.question || !newQuestion.description || !newQuestion.score}
                  >
                    Kaydet
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionsPopup;