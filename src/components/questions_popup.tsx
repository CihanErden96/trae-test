"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import styles from '../styles/footer_popup.module.css';
import { hapticFeedback } from '../utils/haptic';
import ReusableCombobox from './combobox';
import { Question, ComboboxOption, questionsData, getCategoryOptions, getAllScoreOptions, truncateText } from './const';

interface QuestionsPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const QuestionsPopup: React.FC<QuestionsPopupProps> = ({ isOpen, onClose }) => {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [isAddQuestionOpen, setIsAddQuestionOpen] = useState(false);
  const [isEditQuestionOpen, setIsEditQuestionOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState<Question | null>(null);
  const [newQuestion, setNewQuestion] = useState({
    category: '',
    question: '',
    description: '',
    score: ''
  });

  const [questions, setQuestions] = useState<Question[]>(questionsData);

  // Soruları kategorilere göre gruplandır
  const groupedQuestions = questions.reduce((groups, question) => {
    const category = question.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(question);
    return groups;
  }, {} as Record<string, Question[]>);

  // Kategorileri ComboboxOption formatına dönüştür
  const categoryOptions: ComboboxOption[] = useMemo(() => {
    return getCategoryOptions(questions);
  }, [questions]);

  // Puan seçeneklerini ComboboxOption formatına dönüştür
  const scoreOptions: ComboboxOption[] = useMemo(() => {
    return getAllScoreOptions();
  }, []);

  const toggleCategory = (category: string) => {
    hapticFeedback.navigation.select();
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const handleQuestionClick = (question: Question) => {
    hapticFeedback.navigation.select();
    setEditingQuestion(question);
    setNewQuestion({
      category: question.category,
      question: question.question,
      description: question.description,
      score: question.score.toString()
    });
    setIsEditQuestionOpen(true);
  };

  const handleCloseEditQuestion = () => {
    hapticFeedback.navigation.close();
    setIsEditQuestionOpen(false);
    setEditingQuestion(null);
    setNewQuestion({
      category: '',
      question: '',
      description: '',
      score: ''
    });
  };

  const handleDeleteQuestion = () => {
    hapticFeedback.button.danger();
    if (editingQuestion) {
      setQuestionToDelete(editingQuestion);
      setShowDeleteConfirmation(true);
    }
  };

  const confirmDeleteQuestion = () => {
    hapticFeedback.action.delete();
    if (questionToDelete) {
      setQuestions(prevQuestions => 
        prevQuestions.filter(q => q.id !== questionToDelete.id)
      );
      setShowDeleteConfirmation(false);
      setQuestionToDelete(null);
      handleCloseEditQuestion();
    }
  };

  const cancelDeleteQuestion = () => {
    hapticFeedback.action.cancel();
    setShowDeleteConfirmation(false);
    setQuestionToDelete(null);
  };

  const handleUpdateQuestion = () => {
    if (newQuestion.category && newQuestion.question && newQuestion.description && newQuestion.score && editingQuestion) {
      hapticFeedback.action.save();
      const updatedQuestion: Question = {
        ...editingQuestion,
        category: newQuestion.category,
        question: newQuestion.question,
        description: newQuestion.description,
        score: parseInt(newQuestion.score)
      };
      
      setQuestions(prevQuestions => 
        prevQuestions.map(q => q.id === editingQuestion.id ? updatedQuestion : q)
      );
      handleCloseEditQuestion();
    } else {
      hapticFeedback.form.error();
    }
  };

  const handleAddQuestion = () => {
    hapticFeedback.action.create();
    setIsAddQuestionOpen(true);
  };

  const handleCloseAddQuestion = () => {
    hapticFeedback.navigation.close();
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
      hapticFeedback.action.save();
      const newId = Math.max(...questions.map(q => q.id)) + 1;
      const questionToAdd: Question = {
        id: newId,
        category: newQuestion.category,
        question: newQuestion.question,
        description: newQuestion.description,
        score: parseInt(newQuestion.score)
      };
      
      setQuestions(prevQuestions => [...prevQuestions, questionToAdd]);
      handleCloseAddQuestion();
    } else {
      hapticFeedback.form.error();
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setNewQuestion(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Textarea auto resize fonksiyonu
  const handleTextareaResize = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.max(textarea.scrollHeight, 40)}px`;
  };

  // Textarea'ları auto resize için useEffect
  useEffect(() => {
    const textareas = document.querySelectorAll(`.${styles.formTextarea}`);
    textareas.forEach((textarea) => {
      const element = textarea as HTMLTextAreaElement;
      element.style.height = 'auto';
      element.style.height = `${Math.max(element.scrollHeight, 40)}px`;
    });
  }, [newQuestion.question, newQuestion.description, isAddQuestionOpen, isEditQuestionOpen]);

  const handleOverlayClick = (e: React.MouseEvent | React.TouchEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  // Tüm soruların toplam puanını hesapla
  const totalAllScore = questions.reduce((sum, question) => sum + question.score, 0);

  return createPortal(
    <div className={styles.overlay} 
         onClick={(e) => {e.preventDefault();hapticFeedback.navigation.close();handleOverlayClick(e);}}>
      <div className={styles.popup}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <span className={styles.totalAllScore}>{totalAllScore}</span>
          </div>
          <h2 className={styles.title}>5S Soruları</h2>
          <button 
            className={styles.closeButton}
            onClick={(e) => {e.preventDefault();hapticFeedback.navigation.close();onClose();}}
            aria-label="Kapat"
          >
            ×
          </button>
        </div>
        
        <div className={styles.content}>
          <div className={styles.questionsList}>
            {Object.entries(groupedQuestions).map(([category, categoryQuestions]) => {
              // Kategori içindeki soruların puan toplamını hesapla
              const totalScore = categoryQuestions.reduce((sum, question) => sum + question.score, 0);
              
              return (
                <div key={category} className={styles.categoryGroup}>
                  <div 
                    className={styles.categoryHeader}
                    onClick={(e) => {e.preventDefault();hapticFeedback.navigation.select();toggleCategory(category);}}
                  >
                    <div className={styles.categoryTitle}>
                      <span className={styles.categoryIcon}>
                        {expandedCategories.has(category) ? '▼' : '▶'}
                      </span>
                      <h3 className={styles.categoryName}>{category}</h3>
                      <div className={styles.categoryStats}>
                        <span className={styles.totalScore}>{totalScore}</span>
                        <span className={styles.questionCount}>({categoryQuestions.length})</span>
                      </div>
                    </div>
                  </div>
                  
                  {expandedCategories.has(category) && (
                    <div className={styles.categoryContent}>
                      {categoryQuestions.map((question) => (
                        <div 
                          key={question.id}
                          className={styles.questionItem}
                          onClick={(e) => {e.preventDefault();hapticFeedback.navigation.select();handleQuestionClick(question);}}
                        >
                          <div className={styles.questionHeader}>
                            <h3 className={styles.questionTitle}>{question.question}</h3>
                            <div className={styles.questionScore}>{question.score}</div>
                          </div>
                          <p className={styles.questionDescription}>{truncateText(question.description)}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
            
            <div className={styles.addQuestionItem} 
                 onClick={(e) => {e.preventDefault();hapticFeedback.action.create();handleAddQuestion();}}>
              <div className={styles.addQuestionContent}>
                <div className={styles.addIcon}>+</div>
                <div className={styles.addText}>
                  <h3 className={styles.addTitle}>Yeni Soru Ekle</h3>
                  <p className={styles.addDescription}>{truncateText("Kendi sorunuzu ekleyerek listeyi genişletin")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Soru Düzenleme Popup'ı */}
      {isEditQuestionOpen && (
        <div className={styles.overlay} 
             onClick={(e) => {e.preventDefault();if (e.target === e.currentTarget) {hapticFeedback.navigation.close();handleCloseEditQuestion();}}}>
          <div className={styles.popup}>
            <div className={styles.header}>
              <h2 className={styles.title}>Soru Düzenle</h2>
              <button 
                className={styles.closeButton}
                onClick={(e) => {e.preventDefault();hapticFeedback.navigation.close();handleCloseEditQuestion();}}
                aria-label="Kapat"
              >
                ×
              </button>
            </div>
            
            <div className={styles.content}>
              <div className={styles.addQuestionForm}>
                <div className={styles.comboboxFormGroup}>
                  <label className={styles.formLabel}>Kategori</label>
                  <ReusableCombobox
                    options={categoryOptions}
                    selectedValue={newQuestion.category}
                    placeholder="Kategori seçin..."
                    onSelect={(value) => handleInputChange('category', value)}
                    id="category-combobox"
                  />
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
                  <div className={styles.comboboxFormGroup}>
                  <label className={styles.formLabel}>Puan</label>
                  <ReusableCombobox
                    options={scoreOptions}
                    selectedValue={newQuestion.score}
                    placeholder="Puan seçin..."
                    onSelect={(value) => handleInputChange('score', value)}
                    id="edit-score-combobox"
                  />
                  </div>
                </div>

                <div className={styles.formActions}>
                  <button 
                    className={styles.deleteButton}
                    onClick={(e) => {e.preventDefault();hapticFeedback.button.danger();handleDeleteQuestion();}}
                  >
                    Sil
                  </button>
                  <div className={styles.rightActions}>
                    <button 
                      className={styles.cancelButton}
                      onClick={(e) => {e.preventDefault();hapticFeedback.action.cancel();handleCloseEditQuestion();}}
                    >
                      İptal
                    </button>
                    <button 
                      className={styles.saveButton}
                      onClick={(e) => {e.preventDefault();hapticFeedback.action.save();handleUpdateQuestion();}}
                      disabled={!newQuestion.category || !newQuestion.question || !newQuestion.description || !newQuestion.score}
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

      {/* Soru Ekleme Popup'ı */}
      {isAddQuestionOpen && (
        <div className={styles.overlay} 
             onClick={(e) => {e.preventDefault();if (e.target === e.currentTarget) {hapticFeedback.navigation.close();handleCloseAddQuestion();}}}>
          <div className={styles.popup}>
            <div className={styles.header}>
              <h2 className={styles.title}>Yeni Soru Ekle</h2>
              <button 
                className={styles.closeButton}
                onClick={(e) => {e.preventDefault();hapticFeedback.navigation.close();handleCloseAddQuestion();}}
                aria-label="Kapat"
              >
                ×
              </button>
            </div>
            
            <div className={styles.content}>
              <div className={styles.addQuestionForm}>
                <div className={styles.comboboxFormGroup}>
                  <label className={styles.formLabel}>Kategori</label>
                  <ReusableCombobox
                    options={categoryOptions}
                    selectedValue={newQuestion.category}
                    placeholder="Kategori seçin..."
                    onSelect={(value) => handleInputChange('category', value)}
                    id="add-category-combobox"
                  />
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
                  <div className={styles.comboboxFormGroup}>
                  <label className={styles.formLabel}>Puan</label>
                  <ReusableCombobox
                    options={scoreOptions}
                    selectedValue={newQuestion.score}
                    placeholder="Puan seçin..."
                    onSelect={(value) => handleInputChange('score', value)}
                    id="add-score-combobox"
                  />
                  </div>
                </div>

                <div className={styles.formActions}>
                  <button 
                    className={styles.cancelButton}
                    onClick={(e) => {e.preventDefault();hapticFeedback.form.cancel();handleCloseAddQuestion();}}
                  >
                    İptal
                  </button>
                  <button 
                    className={styles.saveButton}
                    onClick={(e) => {e.preventDefault();hapticFeedback.form.submit();handleSaveQuestion();}}
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

      {/* Silme Onayı Popup'ı */}
      {showDeleteConfirmation && questionToDelete && (
        <div className={styles.overlay} onClick={cancelDeleteQuestion}>
          <div 
            className={`${styles.popup} ${styles.confirmationPopup}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.header}>
              <h2 className={styles.title}>Emin misiniz?</h2>
              <button className={styles.closeButton} onClick={(e) => {e.preventDefault();hapticFeedback.navigation.close();cancelDeleteQuestion();}}>
                ×
              </button>
            </div>
            <div className={styles.content}>
              <div className={styles.confirmationContent}>
                <p className={styles.confirmationMessage}>
                  <strong>&quot;{questionToDelete.question}&quot;</strong> sorusunu silmek istediğinizden emin misiniz?
                </p>
                <p className={styles.confirmationWarning}>
                  Bu işlem geri alınamaz.
                </p>
                <div className={styles.confirmationActions}>
                  <button 
                    className={styles.cancelButton}
                    onClick={cancelDeleteQuestion}
                  >
                    İptal
                  </button>
                  <button 
                    className={styles.deleteButton}
                    onClick={confirmDeleteQuestion}
                  >
                    Sil
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>,
    document.body
  );
};

export default QuestionsPopup;