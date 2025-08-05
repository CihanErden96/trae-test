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
  title?: string;
  question?: string;
  description: string;
  status: 'completed' | 'incompleted';
  dueDate: string;
  startDate?: string;
  completedDate?: string;
  department?: string;
  creator?: string;
  assignedTo?: string;
  priority?: 'low' | 'medium' | 'high';
  category?: string;
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

// Personel verileri
export const peoplesData: Person[] = [
  {
    id: 1,
    name: "Ahmet",
    surname: "Yılmaz",
    title: "Yazılım Geliştirici",
    department: "Bilgi İşlem"
  },
  {
    id: 2,
    name: "Ayşe",
    surname: "Kaya",
    title: "Proje Yöneticisi",
    department: "İnsan Kaynakları"
  },
  {
    id: 3,
    name: "Mehmet",
    surname: "Demir",
    title: "Sistem Yöneticisi",
    department: "Bilgi İşlem"
  },
  {
    id: 4,
    name: "Fatma",
    surname: "Şahin",
    title: "Muhasebe Uzmanı",
    department: "Mali İşler"
  },
  {
    id: 5,
    name: "Ali",
    surname: "Özkan",
    title: "Satış Temsilcisi",
    department: "Satış"
  }
];

// Soru verileri
export const questionsData: Question[] = [
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
    score: 10
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
    score: 10
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
        title: "Eksik güvenlik ekipmanlarını temin et",
        description: "Listede belirtilen eksik güvenlik ekipmanlarını satın al",
        status: 'incompleted',
        dueDate: '2026-01-20'
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
        title: "Prosedür eğitimi düzenle",
        description: "Çalışanlara güncel prosedürler hakkında eğitim ver",
        status: 'incompleted',
        dueDate: '2025-01-25'
      },
      {
        id: 5,
        title: "Prosedür dokümanlarını güncelle",
        description: "Eski prosedür dokümanlarını yeni standartlara göre güncelle",
        status: 'completed',
        dueDate: '2025-01-05'
      }
    ]
  }
];

// Aksiyon verileri
export const actionsData: Action[] = [
  {
    id: 1,
    title: "Güvenlik Kamerası Kurulumu",
    description: "Ana giriş kapısına güvenlik kamerası kurulması gerekiyor. Kamera sistemi 24/7 kayıt yapabilmeli ve uzaktan erişim imkanı sunmalı.",
    status: "incompleted",
    dueDate: "2024-01-15",
    assignedTo: "Ahmet Yılmaz",
    priority: "high",
    category: "Güvenlik"
  },
  {
    id: 2,
    title: "Yangın Söndürücü Kontrolü",
    description: "Tüm yangın söndürücülerin basınç kontrolü yapılacak ve gerekli olanlar değiştirilecek.",
    status: "incompleted",
    dueDate: "2024-01-20",
    assignedTo: "Mehmet Demir",
    priority: "high",
    category: "Yangın Güvenliği"
  },
  {
    id: 3,
    title: "İlk Yardım Eğitimi",
    description: "Personel için temel ilk yardım eğitimi düzenlenecek. Eğitim sertifikalı olmalı.",
    status: "completed",
    dueDate: "2024-01-10",
    assignedTo: "Fatma Kaya",
    priority: "medium",
    category: "Eğitim"
  },
  {
    id: 4,
    title: "Acil Çıkış İşaretleri",
    description: "Acil çıkış işaretlerinin görünürlüğü kontrol edilecek ve gerekli yerlere yeni işaretler eklenecek.",
    status: "incompleted",
    dueDate: "2024-01-25",
    assignedTo: "Ali Özkan",
    priority: "medium",
    category: "Güvenlik"
  },
  {
    id: 5,
    title: "Elektrik Panosu Bakımı",
    description: "Ana elektrik panosunun genel bakımı yapılacak ve güvenlik kontrolleri gerçekleştirilecek.",
    status: "incompleted",
    dueDate: "2024-01-18",
    assignedTo: "Hasan Çelik",
    priority: "high",
    category: "Elektrik"
  },
  {
    id: 6,
    title: "Temizlik Malzemesi Tedariki",
    description: "Endüstriyel temizlik malzemeleri tedarik edilecek ve depo alanında uygun şekilde saklanacak.",
    status: "completed",
    dueDate: "2024-01-08",
    assignedTo: "Zeynep Arslan",
    priority: "low",
    category: "Temizlik"
  },
  {
    id: 7,
    title: "Havalandırma Sistemi Kontrolü",
    description: "Havalandırma sisteminin filtre değişimi ve genel performans kontrolü yapılacak.",
    status: "incompleted",
    dueDate: "2024-01-30",
    assignedTo: "Murat Şahin",
    priority: "medium",
    category: "Havalandırma"
  },
  {
    id: 8,
    title: "Güvenlik Protokolü Güncellemesi",
    description: "Mevcut güvenlik protokolleri gözden geçirilecek ve güncel mevzuata uygun hale getirilecek.",
    status: "incompleted",
    dueDate: "2024-02-05",
    assignedTo: "Ayşe Yıldız",
    priority: "high",
    category: "Güvenlik"
  }
];

// Departman verileri
export const departmentsData: Department[] = [
  {
    id: 1,
    name: "İnsan Kaynakları",
    score: 85,
    completedActions: 2,
    pendingActions: 3,
    pendingActionsList: [
      { id: 1, question: "Personel değerlendirme formları", description: "Yıllık performans değerlendirmelerini tamamla. Yıllık performans değerlendirmelerini tamamla ", dueDate: "2024-01-15", startDate: "2024-01-01", department: "İnsan Kaynakları", creator: "Ahmet Yılmaz", status: "incompleted" },
      { id: 2, question: "İşe alım süreci", description: "Yeni yazılım geliştirici pozisyonu için mülakat", dueDate: "2024-01-20", startDate: "2024-01-05", department: "İnsan Kaynakları", creator: "Fatma Demir", status: "incompleted" },
      { id: 3, question: "Eğitim planlaması", description: "Q1 çalışan eğitim programını hazırla", dueDate: "2024-01-25", startDate: "2024-01-10", department: "İnsan Kaynakları", creator: "Mehmet Kaya", status: "incompleted" }
    ],
    completedActionsList: [
      { id: 4, question: "Bordro hazırlama", description: "Aralık ayı bordroları tamamlandı", dueDate: "2023-12-30", startDate: "2023-12-15", completedDate: "2023-12-29", department: "İnsan Kaynakları", creator: "Ayşe Öztürk", status: "completed" },
      { id: 5, question: "Sigorta işlemleri", description: "Yeni personel sigorta kayıtları", dueDate: "2023-12-28", startDate: "2023-12-20", completedDate: "2023-12-27", department: "İnsan Kaynakları", creator: "Ali Çelik", status: "completed" }
    ]
  },
  {
    id: 2,
    name: "Üretim",
    score: 92,
    completedActions: 1,
    pendingActions: 5,
    pendingActionsList: [
      { id: 6, question: "Makine bakımı", description: "Aylık rutin bakım kontrolü", dueDate: "2024-01-10", startDate: "2024-01-01", department: "Üretim", creator: "Mustafa Arslan", status: "incompleted" },
      { id: 7, question: "Kalite kontrol", description: "Ürün kalite testlerini gerçekleştir", dueDate: "2024-01-12", startDate: "2024-01-02", department: "Üretim", creator: "Zeynep Kılıç", status: "incompleted" },
      { id: 8, question: "Stok sayımı", description: "Hammadde stok kontrolü", dueDate: "2024-01-18", startDate: "2024-01-08", department: "Üretim", creator: "Hasan Özkan", status: "incompleted" },
      { id: 9, question: "Güvenlik eğitimi", description: "İş güvenliği eğitimi planla", dueDate: "2024-01-22", startDate: "2024-01-12", department: "Üretim", creator: "Elif Şahin", status: "incompleted" },
      { id: 10, question: "Üretim raporu", description: "Haftalık üretim raporunu hazırla", dueDate: "2024-01-08", startDate: "2024-01-01", department: "Üretim", creator: "Oğuz Yıldız", status: "incompleted" }
    ],
    completedActionsList: [
      { id: 11, question: "Sipariş teslimi", description: "A firması siparişi tamamlandı", dueDate: "2023-12-29", startDate: "2023-12-20", completedDate: "2023-12-28", department: "Üretim", creator: "Ahmet Demir", status: "completed" }
    ]
  },
  {
    id: 3,
    name: "Satış ve Pazarlama",
    score: 78,
    completedActions: 1,
    pendingActions: 3,
    pendingActionsList: [
      { id: 12, question: "Kampanya hazırlığı", description: "Yeni yıl kampanyası tasarımı", dueDate: "2024-01-05", startDate: "2023-12-20", department: "Satış ve Pazarlama", creator: "Selin Aydın", status: "incompleted" },
      { id: 13, question: "Müşteri toplantısı", description: "B firması ile görüşme", dueDate: "2024-01-08", startDate: "2024-01-03", department: "Satış ve Pazarlama", creator: "Burak Koç", status: "incompleted" },
      { id: 14, question: "Pazar araştırması", description: "Rakip analizi raporu", dueDate: "2024-01-15", startDate: "2024-01-05", department: "Satış ve Pazarlama", creator: "Deniz Yılmaz", status: "incompleted" }
    ],
    completedActionsList: [
      { id: 15, question: "Sosyal medya paylaşımı", description: "Instagram kampanya paylaşımları", dueDate: "2023-12-30", startDate: "2023-12-25", completedDate: "2023-12-29", department: "Satış ve Pazarlama", creator: "Ayşe Kaya", status: "completed" }
    ]
  },
  {
    id: 4,
    name: "Muhasebe",
    score: 88,
    completedActions: 1,
    pendingActions: 2,
    pendingActionsList: [
      { id: 16, question: "Mali müşavir toplantısı", description: "Yıl sonu kapanış işlemleri", dueDate: "2024-01-03", startDate: "2023-12-28", department: "Muhasebe", creator: "Murat Özdemir", status: "incompleted" },
      { id: 17, question: "Fatura kontrolü", description: "Aralık ayı fatura onayları", dueDate: "2024-01-05", startDate: "2024-01-01", department: "Muhasebe", creator: "Gülşen Aktaş", status: "incompleted" }
    ],
    completedActionsList: [
      { id: 18, question: "Vergi beyannamesi", description: "KDV beyannamesi verildi", dueDate: "2023-12-25", startDate: "2023-12-20", completedDate: "2023-12-24", department: "Muhasebe", creator: "Kemal Erdoğan", status: "completed" }
    ]
  },
  {
    id: 5,
    name: "Ar-Ge",
    score: 95,
    completedActions: 1,
    pendingActions: 4,
    pendingActionsList: [
      { id: 19, question: "Prototip testi", description: "Yeni ürün prototip testleri", dueDate: "2024-01-12", startDate: "2024-01-05", department: "Ar-Ge", creator: "Dr. Emre Yıldırım", status: "incompleted" },
      { id: 20, question: "Patent başvurusu", description: "Yeni teknoloji patent dosyası", dueDate: "2024-01-20", startDate: "2024-01-10", department: "Ar-Ge", creator: "Prof. Aylin Çetin", status: "incompleted" },
      { id: 21, question: "Araştırma raporu", description: "Teknoloji trend analizi", dueDate: "2024-01-25", startDate: "2024-01-15", department: "Ar-Ge", creator: "Doç. Mehmet Kara", status: "incompleted" },
      { id: 22, question: "Lab ekipmanı", description: "Yeni test cihazı kurulumu", dueDate: "2024-01-30", startDate: "2024-01-20", department: "Ar-Ge", creator: "Mühendis Seda Özkan", status: "incompleted" }
    ],
    completedActionsList: [
      { id: 23, question: "Ürün geliştirme", description: "V2.0 yazılım tamamlandı", dueDate: "2023-12-28", startDate: "2023-12-01", completedDate: "2023-12-27", department: "Ar-Ge", creator: "Yazılım Uzmanı Ali Vural", status: "completed" }
    ]
  },
  {
    id: 6,
    name: "Lojistik",
    score: 82,
    completedActions: 1,
    pendingActions: 3,
    pendingActionsList: [
      { id: 24, question: "Kargo takibi", description: "Müşteri siparişlerini takip et", dueDate: "2024-01-07", startDate: "2024-01-02", department: "Lojistik", creator: "Serkan Yılmaz", status: "incompleted" },
      { id: 25, question: "Depo düzenleme", description: "Yeni ürün yerleşim planı", dueDate: "2024-01-10", startDate: "2024-01-05", department: "Lojistik", creator: "Fatma Koç", status: "incompleted" },
      { id: 26, question: "Nakliye planlaması", description: "Haftalık sevkiyat programı", dueDate: "2024-01-08", startDate: "2024-01-03", department: "Lojistik", creator: "Hüseyin Acar", status: "incompleted" }
    ],
    completedActionsList: [
      { id: 27, question: "Envanter sayımı", description: "Aralık ayı stok sayımı", dueDate: "2023-12-31", startDate: "2023-12-25", completedDate: "2023-12-30", department: "Lojistik", creator: "Mehmet Demir", status: "completed" }
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