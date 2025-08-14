// Ortak arayüzler ve tipler
export interface Person {
  id: number;
  name: string;
  surname: string;
  title: string;
  department: string;
}

export interface Question {
  id: number;
  question: string;
  description: string;
  category: string;
  score: number;
  actions?: Action[];
}

export interface Action {
  id: number;
  question?: string;
  description: string;
  status: 'plan' | 'do' | 'check' | 'act' ;
  dueDate: string;
  startDate?: string;
  completedDate?: string;
  department?: string;
  creator?: string;
  assignedTo?: string;
  image?: string;
  dueDateUpdateCount?: number;
}

export interface Department {
  id: number;
  name: string;
  score: number;
  completedActions: number;
  pendingActions: number;
  pendingActionsList: Action[];
  completedActionsList: Action[];
}

export interface ComboboxOption {
  value: string;
  label: string;
}

// Personel verileri - Optimize edildi (lazy loading için)
export const peoplesData: Person[] = [
  { id: 1, name: "Ahmet", surname: "Yılmaz", title: "Yazılım Geliştirici", department: "Bilgi İşlem" },
  { id: 2, name: "Ayşe", surname: "Kaya", title: "Proje Yöneticisi", department: "İnsan Kaynakları" },
  { id: 3, name: "Mehmet", surname: "Demir", title: "Sistem Yöneticisi", department: "Bilgi İşlem" },
  { id: 4, name: "Fatma", surname: "Şahin", title: "Muhasebe Uzmanı", department: "Mali İşler" },
  { id: 5, name: "Ali", surname: "Özkan", title: "Satış Temsilcisi", department: "Satış" }
];

// Soru verileri - Optimize edildi
export const questionsData: Question[] = [
  { id: 1, question: "Gereksiz malzemeleri nasıl ayıklayabilirim?", description: "İş alanında kullanılmayan malzemelerin belirlenmesi ve ayrılması.", category: "Ayıkla", score: 10 },
  { id: 2, question: "Kırmızı etiket sistemi nasıl uygulanır?", description: "Şüpheli malzemelerin işaretlenmesi ve değerlendirme süreci.", category: "Ayıkla", score: 10 },
  { id: 3, question: "İş alanını nasıl düzenleyebilirim?", description: "Her şeyin yerinin belirlenmesi ve etiketleme sistemleri.", category: "Düzenle", score: 10 },
  { id: 4, question: "Araç ve malzeme yerleşimi nasıl optimize edilir?", description: "Sık kullanılan malzemelerin yakın konumlandırılması.", category: "Düzenle", score: 10 },
  { id: 5, question: "Temizlik standartları nasıl uygulanır?", description: "Günlük, haftalık ve aylık temizlik rutinleri.", category: "Temizle", score: 10 },
  { id: 6, question: "Temizlik kontrol listeleri nasıl hazırlanır?", description: "Detaylı temizlik görevlerinin listelenmesi.", category: "Temizle", score: 10 },
  { id: 7, question: "Standartları nasıl oluşturup uygularım?", description: "İş prosedürlerinin standartlaştırılması.", category: "Standartlaştır", score: 10 },
  { id: 8, question: "Görsel yönetim araçları nasıl kullanılır?", description: "İş talimatlarının görselleştirilmesi.", category: "Standartlaştır", score: 10 },
  { id: 9, question: "5S uygulamalarını nasıl sürdürebilirim?", description: "Sürekli iyileştirme kültürü ve düzenli denetimler.", category: "Sürdür", score: 10 },
  { id: 10, question: "5S denetim sistemi nasıl kurulur?", description: "Düzenli denetim programları ve değerlendirme kriterleri.", category: "Sürdür", score: 10 }
];

// Denetim soruları
export const denetimQuestionsData: Question[] = [
  {
    id: 1,
    question: "Çalışma alanı düzenli mi?",
    description: "İş alanının 5S prensiplerine uygun olarak düzenlenip düzenlenmediğinin kontrolü",
    category: "Düzen",
    score: 10,
    actions: []
  },
  {
    id: 2,
    question: "Güvenlik ekipmanları yerinde mi?",
    description: "Kişisel koruyucu donanımların ve güvenlik ekipmanlarının yerinde olup olmadığının kontrolü",
    category: "Güvenlik",
    score: 15,
    actions: [
      {
        id: 3,
        description: "Listede belirtilen eksik güvenlik ekipmanlarını satın al",
        status: 'do',
        dueDate: ''
      }
    ]
  },
  {
    id: 3,
    question: "Temizlik standartları uygulanıyor mu?",
    description: "Belirlenen temizlik standartlarının düzenli olarak uygulanıp uygulanmadığının kontrolü",
    category: "Temizlik",
    score: 10
  },
  {
    id: 4,
    question: "Prosedürler takip ediliyor mu?",
    description: "İş prosedürlerinin çalışanlar tarafından doğru şekilde takip edilip edilmediğinin kontrolü",
    category: "Prosedür",
    score: 20,
    actions: [
      {
        id: 4,
        description: "Çalışanlara güncel prosedürler hakkında eğitim ver",
        status: 'do',
        dueDate: '2025-01-25'
      },
      {
        id: 5,
        description: "Eski prosedür dokümanlarını yeni standartlara göre güncelle",
        status: 'act',
        dueDate: '2025-01-05'
      }
    ]
  }
];

// Aksiyon verileri - Optimize edildi
export const actionsData: Action[] = [];

// Departman verileri - Optimize edildi (lazy loading için hazır)
export const departmentsData: Department[] = [
  {
    id: 1, name: "İnsan Kaynakları", score: 85, completedActions: 2, pendingActions: 3,
    pendingActionsList: [
      { id: 1, description: "Yıllık performans değerlendirmelerini tamamla", dueDate: "2024-01-15", status: "act" },
      { id: 2, description: "Yeni yazılım geliştirici pozisyonu için mülakat", dueDate: "2024-01-20", status: "act" },
      { id: 3, description: "Q1 çalışan eğitim programını hazırla", dueDate: "2024-01-25", status: "act" }
    ],
    completedActionsList: [
      { id: 4, description: "Aralık ayı bordroları tamamlandı", dueDate: "2023-12-30", status: "act" },
      { id: 5, description: "Yeni personel sigorta kayıtları", dueDate: "2023-12-28", status: "act" }
    ]
  },
  {
    id: 2, name: "Üretim", score: 92, completedActions: 1, pendingActions: 5,
    pendingActionsList: [
      { id: 6, description: "Aylık rutin bakım kontrolü", dueDate: "", status: "act" },
      { id: 7, description: "Ürün kalite testlerini gerçekleştir", dueDate: "2024-01-12", status: "act" },
      { id: 8, description: "Hammadde stok kontrolü", dueDate: "2024-01-18", status: "act" },
      { id: 9, description: "İş güvenliği eğitimi planla", dueDate: "2024-01-22", status: "act" },
      { id: 10, description: "Haftalık üretim raporunu hazırla", dueDate: "2024-01-08", status: "act" }
    ],
    completedActionsList: [
      { id: 11, description: "A firması siparişi tamamlandı", dueDate: "2023-12-29", status: "act" }
    ]
  },
  {
    id: 3, name: "Satış ve Pazarlama", score: 78, completedActions: 1, pendingActions: 3,
    pendingActionsList: [
      { id: 12, description: "Yeni yıl kampanyası tasarımı", dueDate: "2024-01-05", status: "do" },
      { id: 13, description: "B firması ile görüşme", dueDate: "2024-01-08", status: "do" },
      { id: 14, description: "Rakip analizi raporu", dueDate: "2024-01-15", status: "do" }
    ],
    completedActionsList: [
      { id: 15, description: "Instagram kampanya paylaşımları", dueDate: "2023-12-30", status: "act" }
    ]
  },
  {
    id: 4, name: "Muhasebe", score: 88, completedActions: 1, pendingActions: 2,
    pendingActionsList: [
      { id: 16, description: "Yıl sonu kapanış işlemleri", dueDate: "2024-01-03", status: "do" },
      { id: 17, description: "Aralık ayı fatura onayları", dueDate: "2024-01-05", status: "do" }
    ],
    completedActionsList: [
      { id: 18, description: "KDV beyannamesi verildi", dueDate: "2023-12-25", status: "act" }
    ]
  },
  {
    id: 5, name: "Ar-Ge", score: 95, completedActions: 1, pendingActions: 4,
    pendingActionsList: [
      { id: 19, description: "Yeni ürün prototip testleri", dueDate: "2024-01-12", status: "do" },
      { id: 20, description: "Yeni teknoloji patent dosyası", dueDate: "2024-01-20", status: "do" },
      { id: 21, description: "Teknoloji trend analizi", dueDate: "2024-01-25", status: "do" },
      { id: 22, description: "Yeni test cihazı kurulumu", dueDate: "2024-01-30", status: "do" }
    ],
    completedActionsList: [
      { id: 23, description: "V2.0 yazılım tamamlandı", dueDate: "2023-12-28", status: "act" }
    ]
  },
  {
    id: 6, name: "Lojistik", score: 82, completedActions: 1, pendingActions: 3,
    pendingActionsList: [
      { id: 24, description: "Müşteri siparişlerini takip et", dueDate: "2024-01-07", status: "do" },
      { id: 25, description: "Yeni ürün yerleşim planı", dueDate: "2024-01-10", status: "do" },
      { id: 26, description: "Haftalık sevkiyat programı", dueDate: "2024-01-08", status: "do" }
    ],
    completedActionsList: [
      { id: 27, description: "Aralık ayı stok sayımı", dueDate: "2023-12-31", status: "act" }
    ]
  }
];

// Yardımcı fonksiyonlar
// Metin kısaltma utility fonksiyonu
export const truncateText = (text: string, maxLength: number = 100): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const calculateTotalActions = () => {
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

// Puan seçeneklerini oluşturan fonksiyon
export const getScoreOptions = (maxScore: number): ComboboxOption[] => {
  const scores = [];
  for (let i = maxScore; i >= 0; i--) {
    scores.push({
      value: i.toString(),
      label: `${i}`
    });
  }
  return scores;
};

// Kategori seçeneklerini oluşturan fonksiyon
export const getCategoryOptions = (questions: Question[]): ComboboxOption[] => {
  const groupedQuestions = questions.reduce((groups, question) => {
    const category = question.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(question);
    return groups;
  }, {} as Record<string, Question[]>);

  const availableCategories = Object.keys(groupedQuestions);
  
  return availableCategories.map(category => ({
    value: category,
    label: category
  }));
};

// 0-100 arası puan seçenekleri
export const getAllScoreOptions = (): ComboboxOption[] => {
  const scores = [];
  for (let i = 0; i <= 100; i++) {
    scores.push({
      value: i.toString(),
      label: `${i}`
    });
  }
  return scores;
};