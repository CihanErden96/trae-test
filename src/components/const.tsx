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
  status: 'plan' | 'do' | 'check' | 'act';
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
  responsible: string;
  score?: number;
  completedActions?: number;
  pendingActions?: number;
  pendingActionsList?: Action[];
  completedActionsList?: Action[];
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
export const allActionsData: Action[] = [
  {
    id: 1,
    question: "Baykuş montaj hattı kalibrasyon kontrolü",
    description: "Baykuş montaj hattındaki tüm kalibrasyonları kontrol et ve ayarla",
    status: 'plan',
    dueDate: "2024-02-15",
    startDate: "2024-02-01",
    department: "Baykuş Montaj",
    creator: "Ahmet Yılmaz",
    assignedTo: "Zeynep Arslan",
    dueDateUpdateCount: 0
  },
  {
    id: 2,
    question: "Boyahane ventilasyon sistemi bakımı",
    description: "Boyahane ventilasyon sisteminin periyodik bakımını gerçekleştir",
    status: 'do',
    dueDate: "2024-02-10",
    startDate: "2024-02-05",
    department: "Boyahane",
    creator: "Mehmet Demir",
    assignedTo: "Murat Kaya",
    image: "/icons/profile.png",
    dueDateUpdateCount: 1
  },
  {
    id: 3,
    question: "Elektrik pano güvenlik kontrolü",
    description: "Elektrikhane'deki tüm elektrik panolarının güvenlik kontrollerini yap",
    status: 'check',
    dueDate: "2024-02-08",
    startDate: "2024-02-01",
    completedDate: "2024-02-07",
    department: "Elektrikhane",
    creator: "Ayşe Kaya",
    assignedTo: "Elif Çelik",
    dueDateUpdateCount: 0
  },
  {
    id: 4,
    question: "Kafa montaj kalite standardı güncelleme",
    description: "Kafa montaj sürecindeki kalite standartlarını güncelle ve uygula",
    status: 'act',
    dueDate: "2024-01-30",
    startDate: "2024-01-20",
    completedDate: "2024-01-29",
    department: "Kafa Montaj",
    creator: "Fatma Şahin",
    assignedTo: "Oğuz Taş",
    dueDateUpdateCount: 0
  },
  {
    id: 5,
    question: "Karınca montaj hattı verimlilik analizi",
    description: "Karınca montaj hattının verimlilik analizini yap ve iyileştirme önerileri sun",
    status: 'plan',
    dueDate: "2024-02-20",
    startDate: "2024-02-10",
    department: "Karınca Montaj",
    creator: "Ali Özkan",
    assignedTo: "Selin Aydın",
    image: "/icons/departments.svg",
    dueDateUpdateCount: 0
  },
  {
    id: 6,
    question: "Kartal montaj ekipman bakımı",
    description: "Kartal montaj hattındaki tüm ekipmanların periyodik bakımını gerçekleştir",
    status: 'do',
    dueDate: "2024-02-12",
    startDate: "2024-02-08",
    department: "Kartal Montaj",
    creator: "Zeynep Arslan",
    assignedTo: "Burak Yıldız",
    dueDateUpdateCount: 1
  },
  {
    id: 7,
    question: "Kasa imalat malzeme stok kontrolü",
    description: "Kasa imalat için gerekli malzeme stoklarını kontrol et ve sipariş ver",
    status: 'check',
    dueDate: "2024-02-05",
    startDate: "2024-02-01",
    department: "Kasa İmalat",
    creator: "Murat Kaya",
    assignedTo: "Deniz Öztürk",
    dueDateUpdateCount: 0
  },
  {
    id: 8,
    question: "Kaynak makinesi kalibrasyonu",
    description: "Kaynakhane'deki tüm kaynak makinelerinin kalibrasyonunu yap",
    status: 'act',
    dueDate: "2024-01-25",
    startDate: "2024-01-20",
    completedDate: "2024-01-24",
    department: "Kaynakhane",
    creator: "Elif Çelik",
    assignedTo: "Ahmet Yılmaz",
    dueDateUpdateCount: 0
  },
  {
    id: 9,
    question: "Serçe montaj hattı 5S uygulaması",
    description: "Serçe montaj hattında 5S metodolojisini uygula ve sürdür",
    status: 'do',
    dueDate: "2024-02-18",
    startDate: "2024-02-10",
    department: "Serçe Montaj",
    creator: "Oğuz Taş",
    assignedTo: "Mehmet Demir",
    image: "/icons/profile.png",
    dueDateUpdateCount: 0
  },
  {
    id: 10,
    question: "Sünger kalite kontrol prosedürü",
    description: "Süngerhane'de kalite kontrol prosedürlerini gözden geçir ve güncelle",
    status: 'plan',
    dueDate: "2024-02-25",
    department: "Süngerhane",
    creator: "Selin Aydın",
    assignedTo: "Ayşe Kaya",
    dueDateUpdateCount: 0
  },
  {
    id: 11,
    question: "Talaşlı imalat takım değişimi",
    description: "Talaşlı imalat makinelerinde takım değişimi ve keskinlik kontrolü",
    status: 'check',
    dueDate: "2024-02-14",
    startDate: "2024-02-10",
    completedDate: "2024-02-13",
    department: "Talaşlı İmalat",
    creator: "Burak Yıldız",
    assignedTo: "Fatma Şahin",
    dueDateUpdateCount: 1
  },
  {
    id: 12,
    question: "Tank imalat kaynak kalitesi kontrolü",
    description: "Tank imalatında kaynak kalitesi kontrollerini gerçekleştir",
    status: 'act',
    dueDate: "2024-02-01",
    startDate: "2024-01-25",
    completedDate: "2024-01-31",
    department: "Tank İmalat",
    creator: "Deniz Öztürk",
    assignedTo: "Ali Özkan",
    dueDateUpdateCount: 0
  },
  {
    id: 13,
    question: "Baykuş montaj operatör eğitimi",
    description: "Yeni operatörlere Baykuş montaj süreçleri hakkında eğitim ver",
    status: 'do',
    dueDate: "2024-02-22",
    startDate: "2024-02-15",
    department: "Baykuş Montaj",
    creator: "Ahmet Yılmaz",
    assignedTo: "Zeynep Arslan",
    dueDateUpdateCount: 0
  },
  {
    id: 14,
    question: "Boyahane atık yönetimi planı",
    description: "Boyahane atık yönetimi planını hazırla ve uygula",
    status: 'plan',
    dueDate: "2024-03-01",
    department: "Boyahane",
    creator: "Mehmet Demir",
    assignedTo: "Murat Kaya",
    image: "/icons/departments.svg",
    dueDateUpdateCount: 0
  },
  {
    id: 15,
    question: "Elektrikhane acil durum prosedürü",
    description: "Elektrikhane için acil durum prosedürlerini güncelle ve personeli bilgilendir",
    status: 'check',
    dueDate: "2024-02-16",
    startDate: "2024-02-10",
    department: "Elektrikhane",
    creator: "Ayşe Kaya",
    assignedTo: "Elif Çelik",
    dueDateUpdateCount: 0
  },
  {
    id: 16,
    question: "Kafa montaj hız optimizasyonu",
    description: "Kafa montaj hattının hızını optimize et ve cycle time'ı iyileştir",
    status: 'act',
    dueDate: "2024-02-05",
    startDate: "2024-01-28",
    completedDate: "2024-02-04",
    department: "Kafa Montaj",
    creator: "Fatma Şahin",
    assignedTo: "Oğuz Taş",
    dueDateUpdateCount: 1
  },
  {
    id: 17,
    question: "Karınca montaj hattı güvenlik denetimi",
    description: "Karınca montaj hattında güvenlik denetimi yap ve eksiklikleri belirle",
    status: 'do',
    dueDate: "2024-02-28",
    startDate: "2024-02-20",
    department: "Karınca Montaj",
    creator: "Ali Özkan",
    assignedTo: "Selin Aydın",
    dueDateUpdateCount: 0
  },
  {
    id: 18,
    question: "Kartal montaj kalite metrikleri",
    description: "Kartal montaj hattı için kalite metriklerini belirle ve takip sistemi kur",
    status: 'plan',
    dueDate: "2024-03-05",
    department: "Kartal Montaj",
    creator: "Zeynep Arslan",
    assignedTo: "Burak Yıldız",
    dueDateUpdateCount: 0
  },
  {
    id: 19,
    question: "Kasa imalat üretim planlaması",
    description: "Kasa imalat için aylık üretim planlamasını yap ve kaynak tahsisini belirle",
    status: 'check',
    dueDate: "2024-02-26",
    startDate: "2024-02-20",
    completedDate: "2024-02-25",
    department: "Kasa İmalat",
    creator: "Murat Kaya",
    assignedTo: "Deniz Öztürk",
    dueDateUpdateCount: 0
  },
  {
    id: 20,
    question: "Kaynakhane iş güvenliği eğitimi",
    description: "Kaynakhane personeline iş güvenliği eğitimi ver ve sertifikasyon sağla",
    status: 'act',
    dueDate: "2024-02-10",
    startDate: "2024-02-01",
    completedDate: "2024-02-09",
    department: "Kaynakhane",
    creator: "Elif Çelik",
    assignedTo: "Ahmet Yılmaz",
    image: "/icons/profile.png",
    dueDateUpdateCount: 0
  }
];


const DepartmentsData: Department[] = [
  { id: 1, name: "Baykuş Montaj", responsible: "Ahmet Yılmaz" },
  { id: 2, name: "Boyahane", responsible: "Mehmet Demir" },
  { id: 3, name: "Elektrikhane", responsible: "Ayşe Kaya" },
  { id: 4, name: "Kafa Montaj", responsible: "Fatma Şahin" },
  { id: 5, name: "Karınca Montaj", responsible: "Ali Özkan" },
  { id: 6, name: "Kartal Montaj", responsible: "Zeynep Arslan" },
  { id: 7, name: "Kasa İmalat", responsible: "Murat Kaya" },
  { id: 8, name: "Kaynakhane", responsible: "Elif Çelik" },
  { id: 9, name: "Serçe Montaj", responsible: "Oğuz Taş" },
  { id: 10, name: "Süngerhane", responsible: "Selin Aydın" },
  { id: 11, name: "Talaşlı İmalat", responsible: "Burak Yıldız" },
  { id: 12, name: "Tank İmalat", responsible: "Deniz Öztürk" }
];
// Yardımcı fonksiyon - Departman verilerini hesapla
export const calculatedActionsData = (departmentName: string) => {
  const actionsData=!departmentName?allActionsData:allActionsData.filter(action => action.department === departmentName);
  const completedActions = actionsData.filter(action => action.status === "act");
  const pendingActions = actionsData.filter(action => action.status !== "act");

  return {
    actionsData,
    completedActions,
    pendingActions,
    completedCount: completedActions.length,
    pendingCount: pendingActions.length,
    score: actionsData.length > 0 ? (completedActions.length / actionsData.length) * 100 : 0
  };
};

export const departmentsPopUpData: Department[] = (() => {
  const departments = DepartmentsData;
  
  return departments.map(dept => {
    const data = calculatedActionsData(dept.name);
    return {
      ...dept,
      completedActions: data.completedCount,
      pendingActions: data.pendingCount,
      completedActionsList: data.completedActions,
      pendingActionsList: data.pendingActions,
      score: data.score,
    };
  });
})();



// Yardımcı fonksiyonlar
// Metin kısaltma utility fonksiyonu
export const truncateText = (text: string, maxLength: number = 100): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
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