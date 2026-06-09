/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Student,
  Teacher,
  Employee,
  SchoolClass,
  FinanceTransaction,
  BookRecord,
  TransportRoute,
  MedicalLog,
  WarehouseItem,
  OCRDocument,
  AuditLog,
  Message,
  SchoolExam
} from '../types';

export const initialStudents: Student[] = [
  {
    id: "STU-2026-001",
    name: "ريان حسن الأحمد",
    avatar: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=150",
    classId: "G6-A",
    parentName: "حسن علي الأحمد",
    parentPhone: "+966 50 123 4567",
    email: "rayan.ahmed@habiba.edu",
    joiningDate: "2024-09-01",
    grades: { "الرياضيات": 94, "العلوم": 88, "اللغة العربية": 95, "التربية الإسلامية": 98, "اللغة الإنجليزية": 90 },
    attendanceRate: 97.4,
    feesTotal: 4500,
    feesPaid: 3200,
    behaviorScore: 98,
    qrCode: "STU-RAYAN-9852",
    status: "نشط",
    nationalId: "1098425211",
    bloodType: "+O",
    birthDate: "2014-04-12",
    transportId: "BUS-01",
    notes: "طالب متميز رياضي وحائز على جائزة حفظ القرآن الكريم.",
    gender: "ذكر"
  },
  {
    id: "STU-2026-002",
    name: "سارة محمد الشريف",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150",
    classId: "G1-A",
    parentName: "محمد سليم الشريف",
    parentPhone: "+966 55 987 6543",
    email: "sarah.shereef@habiba.edu",
    joiningDate: "2025-09-01",
    grades: { "الرياضيات": 99, "العلوم": 97, "اللغة العربية": 98, "التربية الإسلامية": 100, "اللغة الإنجليزية": 96 },
    attendanceRate: 99.1,
    feesTotal: 4000,
    feesPaid: 4000,
    behaviorScore: 100,
    qrCode: "STU-SARAH-4112",
    status: "نشط",
    nationalId: "1087411234",
    bloodType: "-A",
    birthDate: "2019-08-22",
    transportId: "BUS-02",
    notes: "الأولى على مستوى الصف الأول بمعدل 98.8%.",
    gender: "أنثى"
  },
  {
    id: "STU-2026-003",
    name: "يوسف خالد الغامدي",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150",
    classId: "KG-A",
    parentName: "خالد سعيد الغامدي",
    parentPhone: "+966 54 321 0987",
    email: "yousef.ghamdi@habiba.edu",
    joiningDate: "2025-09-05",
    grades: { "الحساب": 86, "العلوم البسيطة": 92, "اللغة العربية": 85, "السلوك": 95 },
    attendanceRate: 94.2,
    feesTotal: 3500,
    feesPaid: 2000,
    behaviorScore: 95,
    qrCode: "STU-YOUSEF-7741",
    status: "نشط",
    nationalId: "1023774109",
    bloodType: "+B",
    birthDate: "2021-11-05",
    transportId: "BUS-01",
    notes: "طفل ذكي ومحب للألعاب التعليمية والأنشطة التفاعلية.",
    gender: "ذكر"
  },
  {
    id: "STU-2026-004",
    name: "جود عبد العزيز العتيبي",
    avatar: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150",
    classId: "G3-A",
    parentName: "عبد العزيز حمود العتيبي",
    parentPhone: "+966 56 456 7890",
    email: "jood.otaibi@habiba.edu",
    joiningDate: "2024-09-05",
    grades: { "الرياضيات": 92, "العلوم": 95, "اللغة العربية": 94, "التربية الإسلامية": 95, "اللغة الإنجليزية": 98 },
    attendanceRate: 96.5,
    feesTotal: 4200,
    feesPaid: 4200,
    behaviorScore: 97,
    qrCode: "STU-JOOD-2209",
    status: "نشط",
    nationalId: "1055220988",
    bloodType: "+AB",
    birthDate: "2017-01-19",
    transportId: "",
    notes: "طالبة متفوقة ولديها موهبة متميزة في الإلقاء والشعر.",
    gender: "أنثى"
  },
  {
    id: "STU-2026-005",
    name: "لانا أحمد البكري",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150",
    classId: "PRE-A",
    parentName: "أحمد محمد البكري",
    parentPhone: "+966 53 111 2222",
    email: "lana.bakri@habiba.edu",
    joiningDate: "2025-09-01",
    grades: { "الألوان والرسوم": 95, "التهجئة": 94, "التربية الإسلامية": 96 },
    attendanceRate: 95.0,
    feesTotal: 3800,
    feesPaid: 3800,
    behaviorScore: 98,
    qrCode: "STU-LANA-5501",
    status: "نشط",
    nationalId: "1011550192",
    bloodType: "+O",
    birthDate: "2020-05-30",
    transportId: "",
    notes: "طفلة مجتهدة ومحبة للتلوين والأنشطة الجماعية الصفية.",
    gender: "أنثى"
  },
  {
    id: "STU-2026-006",
    name: "عمر ماجد سلامة",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
    classId: "G2-A",
    parentName: "ماجد سلامة",
    parentPhone: "+966 53 444 5555",
    email: "omar.salama@habiba.edu",
    joiningDate: "2024-09-01",
    grades: { "الرياضيات": 88, "العلوم": 90, "اللغة العربية": 87, "التربية الإسلامية": 92 },
    attendanceRate: 96.2,
    feesTotal: 4100,
    feesPaid: 3000,
    behaviorScore: 96,
    qrCode: "STU-OMAR-6602",
    status: "نشط",
    nationalId: "1033445501",
    bloodType: "-B",
    birthDate: "2018-02-15",
    transportId: "BUS-02",
    notes: "لديه شغف كبير بالقراءة والحساب الذهني السريع.",
    gender: "ذكر"
  },
  {
    id: "STU-2026-007",
    name: "فاطمة علي البكري",
    avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150",
    classId: "G5-A",
    parentName: "أ. علي البكري",
    parentPhone: "+966 54 888 9999",
    email: "fatima.bakri@habiba.edu",
    joiningDate: "2023-09-01",
    grades: { "الرياضيات": 95, "العلوم": 96, "اللغة العربية": 98, "التربية الإسلامية": 100 },
    attendanceRate: 98.8,
    feesTotal: 4400,
    feesPaid: 4400,
    behaviorScore: 100,
    qrCode: "STU-FATIMA-7703",
    status: "نشط",
    nationalId: "1044778802",
    bloodType: "+A",
    birthDate: "2015-06-25",
    transportId: "",
    notes: "تتحلى بأخلاق عالية ومشاركة فعالة متميزة في الإذاعة المدرسية.",
    gender: "أنثى"
  },
  {
    id: "STU-2026-008",
    name: "خالد وليد سلام",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    classId: "G4-A",
    parentName: "وليد سلام",
    parentPhone: "+966 56 123 7890",
    email: "khaled.sallam@habiba.edu",
    joiningDate: "2024-09-01",
    grades: { "الرياضيات": 82, "العلوم": 94, "اللغة العربية": 85, "التربية الإسلامية": 90 },
    attendanceRate: 93.5,
    feesTotal: 4300,
    feesPaid: 2200,
    behaviorScore: 92,
    qrCode: "STU-KHALED-8804",
    status: "نشط",
    nationalId: "1055889901",
    bloodType: "+O",
    birthDate: "2016-10-10",
    transportId: "BUS-01",
    notes: "طالب نشيط ويحب مادة العلوم بشكل لافت وإجراء التجارب البسيطة.",
    gender: "ذكر"
  }
];

export const initialTeachers: Teacher[] = [
  {
    id: "TCH-2026-001",
    name: "أ. منيرة عبد الرحمن العبدالله",
    avatar: "https://images.unsplash.com/photo-1594744803329-e58b31de215f?w=150",
    subject: "الرياضيات",
    classes: ["G1-A", "G3-A", "G5-A"],
    contractType: "دائم",
    salary: 12000,
    bonus: 850,
    joiningDate: "2021-08-15",
    attendanceRate: 98.7,
    rating: 4.9,
    phone: "+966 50 112 2334",
    email: "mounira.abdullah@habiba.edu",
    evaluations: [
      { reviewer: "د. هدى السديري (المشرفة التربوية)", score: 5, comment: "شرح مبتكر واستخدام فعال للوسائل التفاعلية الذكية الموجهة للتعليم المبكر.", date: "2025-11-20" },
      { reviewer: "أ. ماجد البكري (مدير المدرسة)", score: 4.8, comment: "متميزة في تفهّم احتياجات الطفولة وبناء أسس التفكير الرياضي السليم.", date: "2026-02-14" }
    ],
    schedule: {
      "الأحد": [
        { period: 1, className: "G1-A", subject: "الرياضيات" },
        { period: 3, className: "G3-A", subject: "الرياضيات" }
      ],
      "الإثنين": [
        { period: 2, className: "G1-A", subject: "الرياضيات" },
        { period: 4, className: "G5-A", subject: "الرياضيات" }
      ],
      "الثلاثاء": [
        { period: 1, className: "G3-A", subject: "الرياضيات" },
        { period: 5, className: "G5-A", subject: "الرياضيات" }
      ],
      "الأربعاء": [
        { period: 2, className: "G1-A", subject: "الرياضيات" },
        { period: 3, className: "G3-A", subject: "الرياضيات" }
      ],
      "الخميس": [
        { period: 4, className: "G5-A", subject: "الرياضيات" },
        { period: 5, className: "G1-A", subject: "الرياضيات" }
      ]
    }
  },
  {
    id: "TCH-2026-002",
    name: "أ. طارق محمود الياسين",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
    subject: "العلوم",
    classes: ["G2-A", "G4-A", "G6-A"],
    contractType: "دائم",
    salary: 11500,
    bonus: 500,
    joiningDate: "2022-09-01",
    attendanceRate: 96.2,
    rating: 4.7,
    phone: "+966 55 443 3221",
    email: "tariq.yaseen@habiba.edu",
    evaluations: [
      { reviewer: "أ. ماجد البكري (مدير المدرسة)", score: 4.7, comment: "عرض مبسط للتجارب العملية المناسبة للعلوم الابتدائية وتثقيف الأطفال.", date: "2025-12-10" }
    ],
    schedule: {
      "الأحد": [
        { period: 2, className: "G2-A", subject: "العلوم" },
        { period: 4, className: "G4-A", subject: "العلوم" }
      ],
      "الإثنين": [
        { period: 1, className: "G6-A", subject: "العلوم" },
        { period: 3, className: "G2-A", subject: "العلوم" }
      ],
      "الثلاثاء": [
        { period: 3, className: "G4-A", subject: "العلوم" }
      ],
      "الأربعاء": [
        { period: 1, className: "G2-A", subject: "العلوم" },
        { period: 4, className: "G6-A", subject: "العلوم" }
      ],
      "الخميس": [
        { period: 2, className: "G4-A", subject: "العلوم" }
      ]
    }
  },
  {
    id: "TCH-2026-003",
    name: "أ. هدى ياسين القرشي",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150",
    subject: "اللغة العربية",
    classes: ["KG-A", "PRE-A", "G6-A"],
    contractType: "دائم",
    salary: 12500,
    bonus: 1000,
    joiningDate: "2020-01-20",
    attendanceRate: 99.4,
    rating: 5.0,
    phone: "+966 54 778 8990",
    email: "hoda.qurashi@habiba.edu",
    evaluations: [
      { reviewer: "وزارة التعليم (لجنة التميز الأكاديمي)", score: 5.0, comment: "أفضل معلمة تأسيسية متميزة في مخارج الحروف وقصص الأطفال الممتعة.", date: "2026-01-05" }
    ],
    schedule: {
      "الأحد": [
        { period: 5, className: "KG-A", subject: "اللغة العربية" }
      ],
      "الإثنين": [
        { period: 5, className: "PRE-A", subject: "اللغة العربية" }
      ],
      "الثلاثاء": [
        { period: 2, className: "KG-A", subject: "اللغة العربية" },
        { period: 4, className: "G6-A", subject: "اللغة العربية" }
      ],
      "الأربعاء": [
        { period: 5, className: "PRE-A", subject: "اللغة العربية" }
      ],
      "الخميس": [
        { period: 1, className: "G6-A", subject: "اللغة العربية" }
      ]
    }
  }
];

export const initialEmployees: Employee[] = [
  {
    id: "EMP-2026-001",
    name: "أبو بكر محمد الصديق",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    role: "محاسب",
    salary: 9500,
    joiningDate: "2021-02-10",
    attendanceRate: 98.2,
    rating: 4.8,
    phone: "+966 53 111 4444",
    status: "نشط"
  },
  {
    id: "EMP-2026-002",
    name: "أ. خديجة منصور الحربي",
    avatar: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=150",
    role: "أمين مكتبة",
    salary: 8000,
    joiningDate: "2023-01-15",
    attendanceRate: 97.5,
    rating: 4.6,
    phone: "+966 55 222 7777",
    status: "نشط"
  },
  {
    id: "EMP-2026-003",
    name: "د. عبد المجيد ناصر العلي",
    avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150",
    role: "طبيب",
    salary: 16000,
    joiningDate: "2022-05-18",
    attendanceRate: 95.0,
    rating: 4.9,
    phone: "+966 56 333 8888",
    status: "نشط"
  },
  {
    id: "EMP-2026-004",
    name: "خالد فالح السبيعي",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
    role: "سائق",
    salary: 6000,
    joiningDate: "2020-09-10",
    attendanceRate: 99.0,
    rating: 4.5,
    phone: "+966 54 999 0000",
    status: "نشط"
  }
];

export const initialClasses: SchoolClass[] = [
  { id: "KG-A", name: "الروضة (أ)", gradeLevel: "صف الروضة", advisor: "أ. هدى ياسين القرشي", studentCount: 15, roomNumber: "قاعة الروضة 1" },
  { id: "PRE-A", name: "التمهيدي (أ)", gradeLevel: "التمهيدي", advisor: "أ. منيرة عبد الرحمن العبدالله", studentCount: 18, roomNumber: "قاعة التمهيدي 2" },
  { id: "G1-A", name: "الصف الأول (أ)", gradeLevel: "الصف الأول", advisor: "أ. منيرة عبد الرحمن العبدالله", studentCount: 22, roomNumber: "قاعة 101" },
  { id: "G2-A", name: "الصف الثاني (أ)", gradeLevel: "الصف الثاني", advisor: "أ. طارق محمود الياسين", studentCount: 20, roomNumber: "قاعة 102" },
  { id: "G3-A", name: "الصف الثالث (أ)", gradeLevel: "الصف الثالث", advisor: "أ. طارق محمود الياسين", studentCount: 24, roomNumber: "قاعة 201" },
  { id: "G4-A", name: "الصف الرابع (أ)", gradeLevel: "الصف الرابع", advisor: "أ. هدى ياسين القرشي", studentCount: 24, roomNumber: "قاعة 202" },
  { id: "G5-A", name: "الصف الخامس (أ)", gradeLevel: "الصف الخامس", advisor: "أ. منيرة عبد الرحمن العبدالله", studentCount: 21, roomNumber: "قاعة 301" },
  { id: "G6-A", name: "الصف السادس (أ)", gradeLevel: "الصف السادس", advisor: "أ. هدى ياسين القرشي", studentCount: 25, roomNumber: "قاعة 302" },
  { id: "G7-A", name: "الصف السابع (أ)", gradeLevel: "الصف السابع", advisor: "أ. طارق محمود الياسين", studentCount: 19, roomNumber: "قاعة 401" },
  { id: "G8-A", name: "الصف الثامن (أ)", gradeLevel: "الصف الثامن", advisor: "أ. منيرة عبد الرحمن العبدالله", studentCount: 21, roomNumber: "قاعة 402" },
  { id: "G9-A", name: "الصف التاسع (أ)", gradeLevel: "الصف التاسع", advisor: "أ. هدى ياسين القرشي", studentCount: 18, roomNumber: "قاعة 501" }
];

export const initialTransactions: FinanceTransaction[] = [
  { id: "FT-2026-101", type: "إيراد", category: "رسوم دراسية", amount: 3200, date: "2026-06-01", referenceNo: "REF-STU-9852-01", paymentMethod: "مدى", description: "رسوم الفصل الدراسي الأول ل ريان حسن الأحمد", status: "مكتمل" },
  { id: "FT-2026-102", type: "إيراد", category: "رسوم دراسية", amount: 4000, date: "2026-06-02", referenceNo: "REF-STU-4112-01", paymentMethod: "فيزا / ماستر كارد", description: "رسوم دراسية كاملة ل سارة محمد الشريف", status: "مكتمل" },
  { id: "FT-2026-103", type: "مصروف", category: "رواتب مدرسين", amount: 12850, date: "2026-05-28", referenceNo: "PAY-TCH-001", paymentMethod: "تحويل بنكي", description: "راتب شهر مايو أ. منيرة عبد الرحمن العبدالله", status: "مكتمل" },
  { id: "FT-2026-104", type: "مصروف", category: "رواتب مدرسين", amount: 12000, date: "2026-05-28", referenceNo: "PAY-TCH-002", paymentMethod: "تحويل بنكي", description: "راتب شهر مايو أ. طارق محمود الياسين", status: "مكتمل" },
  { id: "FT-2026-105", type: "مصروف", category: "مشتريات مستودع", amount: 3500, date: "2026-06-03", referenceNo: "EXP-INV-450", paymentMethod: "نقدي", description: "شراء مستلزمات طبية ومعقمات للعيادة المدرسية", status: "مكتمل" },
  { id: "FT-2026-106", type: "إيراد", category: "رسوم نقل وحافلات", amount: 800, date: "2026-06-04", referenceNo: "REF-STU-7741-TR", paymentMethod: "مدى", description: "رسوم حافلة للطفل يوسف خالد الغامدي", status: "مكتمل" }
];

export const initialBooks: BookRecord[] = [
  {
    id: "BOK-9852",
    title: "موسوعة المبدعين في الرياضيات الحديثة",
    author: "د. سامي السعيد",
    isbn: "978-3-16-148410-0",
    category: "علمي / رياضيات",
    availableCopies: 4,
    totalCopies: 5,
    digitalLink: "https://pdf-sample-server.habiba.edu/math-encyclopedia.pdf",
    borrowedBy: [
      { studentName: "ريان حسن الأحمد", borrowDate: "2026-06-01", returnDate: "2026-06-15", status: "نشط" }
    ]
  },
  {
    id: "BOK-4712",
    title: "مباهج اللغة العربية والصلات البلاغية",
    author: "أ.د. عبد الهادي الفضلي",
    isbn: "978-9-19-122410-4",
    category: "أدبي / لغة عربية",
    availableCopies: 3,
    totalCopies: 3,
    digitalLink: "https://pdf-sample-server.habiba.edu/arabic-eloquence.pdf",
    borrowedBy: []
  },
  {
    id: "BOK-1109",
    title: "رحلة في فضاء العلوم والذرات",
    author: "ألبير مجيد النشاوي",
    isbn: "978-1-12-111199-5",
    category: "علمي / فيزياء وكيمياء",
    availableCopies: 1,
    totalCopies: 2,
    digitalLink: "https://pdf-sample-server.habiba.edu/physics-journey.pdf",
    borrowedBy: [
      { studentName: "جود عبد العزيز العتيبي", borrowDate: "2026-06-02", returnDate: "2026-06-10", status: "نشط" }
    ]
  }
];

export const initialRoutes: TransportRoute[] = [
  { id: "BUS-01", routeName: "مسار قرطبة واليرموك", busNumber: "ح ب ط 4952", driverName: "خالد فالح السبيعي", driverPhone: "+966 54 999 0000", capacity: 30, occupied: 22, stops: ["مخرج 8", "جامع اليرموك", "أسواق العثيم قرطبة", "بوابة المدرسة الرئيسية"], status: "في الموعد" },
  { id: "BUS-02", routeName: "مسار الملقا والياسمين", busNumber: "ر م ق 1184", driverName: "عاصم سليم الخطيب", driverPhone: "+966 55 184 7761", capacity: 25, occupied: 18, stops: ["شارع أنس بن مالك", "دوار الملقا الأول", "ممشى الياسمين", "بوابة المدرسة الفرعية"], status: "في الموعد" }
];

export const initialMedicalLogs: MedicalLog[] = [
  { id: "MED-001", studentId: "STU-2026-003", studentName: "يوسف خالد الغامدي", className: "الروضة (أ)", diagnose: "صداع مفاجئ مع ارتفاع طفيف بالحرارة", medication: "أدول شراب للأطفال مع راحة بنصف ساعة بالعيادة", severity: "منخفض", date: "2026-06-03", nurseNotes: "تم قياس درجة الحرارة وتقديم الدعم النفسي للطفل للتخفيف عنه حتى استعاد نشاطه." },
  { id: "MED-002", studentId: "STU-2026-001", studentName: "ريان حسن الأحمد", className: "الصف السادس (أ)", diagnose: "جرح سطحي في الكف أثناء حصة التربية الرياضية", medication: "تعقيم بمحلول البيتادين مع ضمادة طبية واقية ولطيفة للأطفال", severity: "منخفض", date: "2026-06-04", nurseNotes: "جرح خارجي بسيط جداً، تم إرشاد الطالب للمحافظة على نظافة يده ومتابعة الحالة." }
];

export const initialWarehouse: WarehouseItem[] = [
  { id: "WH-001", name: "أقلام سبورة ملونة (علبة)", sku: "STAT-PEN-REDBLUE", category: "قرطاسية", stock: 150, minStock: 20, unit: "علبة", location: "الرف المالي A3", supplierName: "مكتبة جرير للتوريد" },
  { id: "WH-002", name: "سبورة زجاجية ذكية 120x240", sku: "FURN-SMART-BOARD", category: "أثاث", stock: 12, minStock: 3, unit: "وحدة", location: "مستودع الأثاث الرئيسي B", supplierName: "الشركة السعودية للتجهيزات الأكاديمية" },
  { id: "WH-003", name: "معقمات يد كحولية سعة 1 لتر", sku: "MED-SANITIZER-1L", category: "طبية", stock: 85, minStock: 15, unit: "عبوة", location: "الرف الصيدلي C1", supplierName: "الشركة الوطنية للمستلزمات الطبية" }
];

export const initialOCRDocuments: OCRDocument[] = [
  {
    id: "DOC-2026-01",
    name: "فاتورة شراء أجهزة معمل الحاسب.jpg",
    fileSize: "1.4 MB",
    uploadDate: "2026-06-05",
    digitalBarcode: "BARCODE-210452-ABC",
    extractedText: "شركة الحواسيب الشرقية المحدودة\nتاريخ الفاتورة: 2026-06-04\nفاتورة رقم: INV-784110\nالبيان: تجهيز معمل الحاسب بنظام محطات العمل الذكية\nالعدد: 10 أجهزة تابلت ومحطة تشغيل رئيسية\nالقيمة الإجمالية: 45,000 ريال سعودي شاملاً الضريبة",
    isProcessed: true,
    category: "فواتير ومصاريف"
  },
  {
    id: "DOC-2026-02",
    name: "تقرير طبي معتمد - ريان الأحمد.png",
    fileSize: "850 KB",
    uploadDate: "2026-06-03",
    digitalBarcode: "BARCODE-985203-MED",
    extractedText: "مستشفى الطبيب التخصصي بالرياض\nقسم الأطفال والنمو\nتوصية سريرية: يعاني الطفل ريان حسن الأحمد من حساسية الصدر الموسمية (الربو الغباري)\nالتوجيه: يرجى إعفاؤه من الأنشطة البدنية الشديدة في الأيام ذات الأتربة المعلقة وتجنب الروائح القوية\nتوقيع طبيب الأخصائي المشرف",
    isProcessed: true,
    category: "تقارير طيبة"
  }
];

export const initialAuditLogs: AuditLog[] = [
  { id: "LOG-1004", timestamp: "2026-06-09 10:11:04", userRole: "مدير النظام", userName: "ماجد محمد البكري", action: "إنشاء اختبار تجريبي جديد", target: "اختبار العلوم والفيزياء الصف السابع", status: "نجاح", ipAddress: "192.168.1.45" },
  { id: "LOG-1003", timestamp: "2026-06-09 09:45:22", userRole: "محاسب رئيسي", userName: "أبو بكر الصديق", action: "توليد سند قبض وإيصال رقم FT-2026-101", target: "ريان حسن الأحمد", status: "نجاح", ipAddress: "192.168.1.12" },
  { id: "LOG-1002", timestamp: "2026-06-09 08:30:15", userRole: "مدير النظام", userName: "ماجد محمد البكري", action: "تفعيل ميزة الـ 2FA لحساب د. عبد المجيد", target: "حساب الكادر الطبي", status: "نجاح", ipAddress: "192.168.1.45" },
  { id: "LOG-1001", timestamp: "2026-06-09 07:15:00", userRole: "بوابة الدفع", userName: "سداد الإلكتروني", action: "محاولة عملية تصفية مصرفية دورية", target: "بوابة بنك الراجحي للرسوم والذمم الدولية", status: "نجاح", ipAddress: "10.0.4.155" }
];

export const initialMessages: Message[] = [
  { id: "MSG-001", sender: "أ. منيرة عبد الرحمن العبدالله", receiver: "حسن علي الأحمد (ولي أمر ريان)", senderRole: "معلم", text: "السلام عليكم ورحمه الله وبركاته.. ريان حصل على الدرجة الكاملة في التقييم الأسبوعي للرياضيات، أدائه رائع وقمة في الانضباط السلوكي.", timestamp: "2026-06-08 17:30", isRead: true, channel: "داخلي" },
  { id: "MSG-002", sender: "حسن علي الأحمد (ولي أمر ريان)", receiver: "أ. منيرة عبد الرحمن العبدالله", senderRole: "ولي أمر", text: "وعليكم السلام ورحمة الله وبركاته.. جزاكِ الله خيراً يا أستاذة على مجهودك الكريم واهتمامك المستمر مع أبنائنا، نسعد لخدمتكم دوماً.", timestamp: "2026-06-08 18:02", isRead: true, channel: "داخلي" },
  { id: "MSG-003", sender: "إدارة مدرسة حبيبة", receiver: "+966 50 123 4567", senderRole: "إدارة", text: "تذكير: تعلن إدارة مدرسة حبيبة التعليمية الدولية عن رحلة المدرسة الفلكية مساء الخميس القادم، يرجى تعبئة استمارة الموافقة المرفقة بالبريد.", timestamp: "2026-06-09 09:00", isRead: true, channel: "SMS" },
  { id: "MSG-004", sender: "مساعد مدرسة حبيبة الذكي", receiver: "حسن علي الأحمد (ولي أمر ريان)", senderRole: "مساعد ذكي", text: "أهلاً بك يا أبا ريان، أنا مساعد مدرسة حبيبة الذكي. تفضل بالسؤال عن جدول ابنك ريان، درجاته، غياباته، أو حتى استحقاقاته المالية للترم القادم.", timestamp: "2026-06-09 10:15", isRead: false, channel: "WhatsApp" }
];

export const initialExams: SchoolExam[] = [
  {
    id: "EXM-701",
    title: "الاختبار القصير الأول - مادة الرياضيات",
    subject: "الرياضيات",
    classId: "7-A",
    date: "2026-06-15",
    duration: 45,
    questions: [
      { id: "Q1", question: "ما هو ناتج حل المعادلة الجبرية التالية: 2س + 6 = 18 ؟", options: ["س = 4", "س = 6", "س = 12", "س = 8"], answerIndex: 1, points: 5 },
      { id: "Q2", question: "أي من الأعداد التالية يعتبر عدداً أولياً بشكل مطلق؟", options: ["9", "15", "23", "27"], answerIndex: 2, points: 5 },
      { id: "Q3", question: "مجموع الزاويا الداخلية للمثلث القائم المتطابق الضلعين يساوي:", options: ["180 درجة", "90 درجة", "360 درجة", "120 درجة"], answerIndex: 0, points: 5 }
    ]
  },
  {
    id: "EXM-801",
    title: "اختبار العلوم والفيزياء والكيمياء النصف سنوي",
    subject: "العلوم",
    classId: "8-B",
    date: "2026-06-18",
    duration: 60,
    questions: [
      { id: "Q11", question: "ما هو الرمز الكيميائي المعتمد لعنصر الصوديوم؟", options: ["K", "Na", "S", "Cl"], answerIndex: 1, points: 5 },
      { id: "Q12", question: "قوة الجاذبية الأرضية تصنف كقوة:", options: ["قوة تلامس", "قوة مجال مغناطيسي", "قوة سحب وتجاذب عن بعد", "قوة دفع واحتكاك"], answerIndex: 2, points: 5 }
    ]
  }
];

export const educationalEvents = [
  { title: "الرحلة الفلكية لمحمية الملك سلمان الملكية", date: "2026-06-12", time: "05:00 م", location: "المرصد الفلكي الخارجي", type: "رحلة" },
  { title: "معرض مدرسة حبيبة السنوي للمخترعين الصغار", date: "2026-06-20", time: "09:00 ص", location: "البهو والملعب المغطى", type: "فعالية" },
  { title: "نهائيات مسابقة الإملاء العربي ومخارج الحروف", date: "2026-06-24", time: "10:30 ص", location: "مسرح المدرسة الرئيسي", type: "مسابقة" }
];
