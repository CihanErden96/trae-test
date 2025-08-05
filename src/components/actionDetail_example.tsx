// ActionDetailPopup bileşeninin kullanım örneği

import React, { useState } from 'react';
import ActionDetailPopup from './actionDetail_popup';
import { Action } from './const';

const ActionDetailExample: React.FC = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<Action | null>(null);

  // Örnek aksiyon verisi
  const exampleAction: Action = {
    id: 1,
    title: "Güvenlik Ekipmanları Kontrolü",
    question: "Güvenlik ekipmanları yerinde mi?",
    description: "Kişisel koruyucu donanımların ve güvenlik ekipmanlarının yerinde olup olmadığının kontrolü",
    status: 'incompleted',
    dueDate: '2024-02-15',
    startDate: '2024-01-15',
    completedDate: '',
    department: 'Güvenlik',
    creator: 'Ahmet Yılmaz',
    assignedTo: 'Mehmet Demir',
    priority: 'high',
    category: 'Güvenlik',
    image: '/path/to/image.jpg'
  };

  const handleOpenPopup = () => {
    setSelectedAction(exampleAction);
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setSelectedAction(null);
  };

  const handleToggleStatus = () => {
    if (selectedAction) {
      const updatedAction = {
        ...selectedAction,
        status: selectedAction.status === 'completed' ? 'incompleted' : 'completed',
        completedDate: selectedAction.status === 'completed' ? '' : new Date().toLocaleDateString('tr-TR')
      } as Action;
      setSelectedAction(updatedAction);
      console.log('Aksiyon durumu değiştirildi:', updatedAction);
    }
  };

  const handleDueDateChange = (newDueDate: string) => {
    if (selectedAction) {
      const updatedAction = {
        ...selectedAction,
        dueDate: newDueDate
      };
      setSelectedAction(updatedAction);
      console.log('Termin tarihi güncellendi:', newDueDate);
    }
  };

  return (
    <div>
      <button onClick={handleOpenPopup}>
        Aksiyon Detayını Göster
      </button>

      {/* Temel kullanım - sadece görüntüleme */}
      <ActionDetailPopup
        isOpen={isPopupOpen}
        onClose={handleClosePopup}
        selectedAction={selectedAction}
      />

      {/* Gelişmiş kullanım - düzenlenebilir termin tarihi ve durum değiştirme */}
      {/*
      <ActionDetailPopup
        isOpen={isPopupOpen}
        onClose={handleClosePopup}
        selectedAction={selectedAction}
        isDueDateEditable={true}
        isCompletedButtonEnabled={true}
        onToggleStatus={handleToggleStatus}
        onDueDateChange={handleDueDateChange}
      />
      */}
    </div>
  );
};

export default ActionDetailExample;

/*
KULLANIM ÖRNEKLERİ:

1. Sadece Görüntüleme (Temel Kullanım):
<ActionDetailPopup
  isOpen={isPopupOpen}
  onClose={handleClosePopup}
  selectedAction={selectedAction}
/>

2. Düzenlenebilir Termin Tarihi:
<ActionDetailPopup
  isOpen={isPopupOpen}
  onClose={handleClosePopup}
  selectedAction={selectedAction}
  isDueDateEditable={true}
  onDueDateChange={handleDueDateChange}
/>

3. Durum Değiştirme Butonu ile:
<ActionDetailPopup
  isOpen={isPopupOpen}
  onClose={handleClosePopup}
  selectedAction={selectedAction}
  isCompletedButtonEnabled={true}
  onToggleStatus={handleToggleStatus}
/>

4. Tüm Özellikler Aktif:
<ActionDetailPopup
  isOpen={isPopupOpen}
  onClose={handleClosePopup}
  selectedAction={selectedAction}
  isDueDateEditable={true}
  isCompletedButtonEnabled={true}
  onToggleStatus={handleToggleStatus}
  onDueDateChange={handleDueDateChange}
/>

PROPS AÇIKLAMALARI:

- isOpen: Popup'ın açık olup olmadığını belirler
- onClose: Popup kapatıldığında çağrılan fonksiyon
- selectedAction: Gösterilecek aksiyon verisi
- isDueDateEditable: Termin tarihinin düzenlenebilir olup olmadığı (varsayılan: false)
- isCompletedButtonEnabled: Durum değiştirme butonunun görünür olup olmadığı (varsayılan: false)
- onToggleStatus: Durum değiştirme butonuna tıklandığında çağrılan fonksiyon
- onDueDateChange: Termin tarihi değiştirildiğinde çağrılan fonksiyon

*/