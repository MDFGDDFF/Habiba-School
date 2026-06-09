/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as XLSX from 'xlsx';
import { Student, Teacher, FinanceTransaction } from '../types';

/**
 * Parses dropped/uploaded excel/csv file into generic row arrays
 */
export const parseExcelFile = (file: File): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet);
        resolve(json);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = (err) => reject(err);
    reader.readAsArrayBuffer(file);
  });
};

/**
 * Downloads arbitrary file in Excel binary sheet format
 */
const saveAsWorkbook = (wb: XLSX.WorkBook, fileName: string) => {
  XLSX.writeFile(wb, fileName);
};

// ==========================================
// 1. STUDENTS SERVICE
// ==========================================

export const exportStudentsToExcel = (students: Student[]) => {
  const exportData = students.map(s => ({
    "معرف الطالب": s.id,
    "الاسم الكامل": s.name,
    "الفصل الدراسي": s.classId,
    "اسم ولي الأمر": s.parentName,
    "هاتف ولي الأمر": s.parentPhone,
    "البريد الأكاديمي": s.email,
    "رقم الهوية الوطنية / الإقامة": s.nationalId,
    "تاريخ الميلاد": s.birthDate,
    "فصيلة الدم": s.bloodType,
    "الرسوم الدراسية السنوية": s.feesTotal,
    "المبلغ المدفوع": s.feesPaid,
    "تاريخ الانتساب والمباشرة": s.joiningDate,
    "مؤشر الحضور %": s.attendanceRate,
    "درجة الانضباط والسلوك %": s.behaviorScore,
    "حالة الطالب": s.status,
    "ملاحظات إضافية": s.notes
  }));

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "الطلاب المسجلين");
  saveAsWorkbook(workbook, `قائمة_الطلاب_مدرسة_حبيبة_${new Date().toISOString().split('T')[0]}.xlsx`);
};

export const downloadStudentTemplate = () => {
  const templateRows = [
    {
      "الاسم الكامل": "ريان حسن الأحمد",
      "رقم الهوية الوطنية / الإقامة": "1098451221",
      "اسم ولي الأمر": "حسن علي الأحمد",
      "هاتف ولي الأمر": "+966501234567",
      "الفصل الدراسي": "7-A",
      "البريد الأكاديمي": "rayan@habiba.edu",
      "فصيلة الدم": "+O",
      "تاريخ الميلاد": "2013-05-12",
      "الرسوم الدراسية السنوية": 15000,
      "المبلغ المدفوع": 5000,
      "ملاحظات إضافية": "طالب متفوق بالرياضيات ولديه حساسية موسمية"
    },
    {
      "الاسم الكامل": "سارة محمد الشريف",
      "رقم الهوية الوطنية / الإقامة": "1041123412",
      "اسم ولي الأمر": "محمد الشريف",
      "هاتف ولي الأمر": "+966504567123",
      "الفصل الدراسي": "7-A",
      "البريد الأكاديمي": "sara@habiba.edu",
      "فصيلة الدم": "+A",
      "تاريخ الميلاد": "2013-09-24",
      "الرسوم الدراسية السنوية": 15000,
      "المبلغ المدفوع": 15000,
      "ملاحظات إضافية": "حصلت على وسام الطالب المتميز والأولى على الفصل"
    }
  ];

  const worksheet = XLSX.utils.json_to_sheet(templateRows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "نموذج استيراد طلاب");
  saveAsWorkbook(workbook, "نموذج_استيراد_طلاب_مدرسة_حبيبة.xlsx");
};

export const mapExcelToStudents = (rows: any[]): Omit<Student, 'id' | 'qrCode'>[] => {
  return rows.map(r => {
    const feesT = Number(r["الرسوم الدراسية السنوية"]) || 15000;
    const feesP = Number(r["المبلغ المدفوع"]) || 0;
    const sName = r["الاسم الكامل"] || "طالب غير معروف";
    return {
      name: sName,
      avatar: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=150",
      classId: r["الفصل الدراسي"] || "7-A",
      parentName: r["اسم ولي الأمر"] || "ولي أمر الطالب",
      parentPhone: String(r["هاتف ولي الأمر"] || "0500000000"),
      email: r["البريد الأكاديمي"] || `${sName.split(' ')[0] || 'student'}_${Math.floor(Math.random() * 1000)}@habiba.edu`,
      joiningDate: new Date().toISOString().split('T')[0],
      grades: { "الرياضيات": 90, "العلوم": 90, "اللغة العربية": 90 },
      attendanceRate: 100,
      feesTotal: feesT,
      feesPaid: feesP,
      behaviorScore: 100,
      status: 'نشط' as const,
      nationalId: String(r["رقم الهوية الوطنية / الإقامة"] || `10${Math.floor(10000000 + Math.random() * 90000000)}`),
      bloodType: r["فصيلة الدم"] || '+O',
      birthDate: r["تاريخ الميلاد"] || '2013-01-01',
      notes: r["ملاحظات إضافية"] || ''
    };
  });
};

// ==========================================
// 2. TEACHERS SERVICE
// ==========================================

export const exportTeachersToExcel = (teachers: Teacher[]) => {
  const exportData = teachers.map(t => ({
    "معرف المعلم": t.id,
    "الاسم الكامل": t.name,
    "التخصص / المادة الدراسية": t.subject,
    "الصفوف الموكلة": t.classes.join(', '),
    "نوع التعاقد": t.contractType,
    "الراتب الأساسي": t.salary,
    "الحوافز والرصيد": t.bonus,
    "إجمالي مستحقات الشهر": t.salary + t.bonus,
    "الهاتف الجوال": t.phone,
    "البريد الأكاديمي": t.email,
    "نسبة الحضور والانضباط %": t.attendanceRate,
    "التقييم العام": t.rating,
    "تاريخ مباشرة العمل": t.joiningDate
  }));

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "المعلمات والمعلمين");
  saveAsWorkbook(workbook, `سجل_الكادر_التعليمي_مدرسة_حبيبة_${new Date().toISOString().split('T')[0]}.xlsx`);
};

export const downloadTeacherTemplate = () => {
  const templateRows = [
    {
      "الاسم الكامل": "عبير عبدالرحمن العقيل",
      "التخصص / المادة الدراسية": "العلوم",
      "الصفوف الموكلة": "7-A, 8-B",
      "نوع التعاقد": "دائم",
      "الراتب الأساسي": 12500,
      "الهاتف الجوال": "+966504112233",
      "البريد الأكاديمي": "abeer@habiba.edu"
    },
    {
      "الاسم الكامل": "خلود محمد الحربي",
      "التخصص / المادة الدراسية": "الرياضيات",
      "الصفوف الموكلة": "7-A",
      "نوع التعاقد": "عقد مؤقت",
      "الراتب الأساسي": 11000,
      "الهاتف الجوال": "+966506994411",
      "البريد الأكاديمي": "kholoud@habiba.edu"
    }
  ];

  const worksheet = XLSX.utils.json_to_sheet(templateRows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "نموذج استيراد معلمين");
  saveAsWorkbook(workbook, "نموذج_استيراد_معلمين_مدرسة_حبيبة.xlsx");
};

export const mapExcelToTeachers = (rows: any[]): Omit<Teacher, 'id'>[] => {
  return rows.map(r => {
    const tName = r["الاسم الكامل"] || "معلم جديد";
    const subj = r["التخصص / المادة الدراسية"] || "الرياضيات";
    const clsStr = r["الصفوف الموكلة"] || "7-A";
    const classes = clsStr.split(',').map((c: string) => c.trim()).filter(Boolean);
    
    return {
      name: tName,
      avatar: "https://images.unsplash.com/photo-1594744803329-e58b31de215f?w=150",
      subject: subj,
      classes: classes.length > 0 ? classes : ["7-A"],
      contractType: r["نوع التعاقد"] === 'عقد مؤقت' ? 'عقد مؤقت' : 'دائم',
      salary: Number(r["الراتب الأساسي"]) || 11000,
      bonus: 0,
      joiningDate: new Date().toISOString().split('T')[0],
      attendanceRate: 100,
      rating: 5.0,
      phone: String(r["الهاتف الجوال"] || "0500000000"),
      email: r["البريد الأكاديمي"] || `${tName.split(' ')[0]}_${Math.floor(Math.random() * 1000)}@habiba.edu`,
      evaluations: [
        { reviewer: "مدير المدرسة أ. عابد", score: 5, comment: "تم استيراد الكادر عبر سجلات إكسل الرسمية.", date: new Date().toISOString().split('T')[0] }
      ],
      schedule: {
        "الأحد": [{ period: 1, className: "7-A", subject: subj }],
        "الإثنين": [{ period: 2, className: "7-A", subject: subj }]
      }
    };
  });
};

// ==========================================
// 3. FINANCE TRANSACTIONS SERVICE
// ==========================================

export const exportFinancialsToExcel = (transactions: FinanceTransaction[]) => {
  const exportData = transactions.map(t => ({
    "معرف القيد": t.id,
    "نوع القيد": t.type,
    "التصنيف والباب": t.category,
    "القيمة بالـ شيكل ₪": t.amount,
    "تاريخ تسجيل القيد": t.date,
    "رقم المرجع المصرفي": t.referenceNo,
    "وسيلة الدفع": t.paymentMethod,
    "البيان / الوصف التفصيلي": t.description,
    "حالة المستند المالي": t.status
  }));

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "القيود المالية والدفترية");
  saveAsWorkbook(workbook, `التقرير_المالي_مدرسة_حبيبة_${new Date().toISOString().split('T')[0]}.xlsx`);
};

export const downloadFinancialsTemplate = () => {
  const templateRows = [
    {
      "نوع القيد": "إيراد",
      "التصنيف والباب": "رسوم دراسية",
      "المبلغ": 4500,
      "طريقة الصرف / الدفع": "تحويل بنكي",
      "البيان / الوصف التفصيلي": "رسوم الفصل الأول للطلبة المستجدين"
    },
    {
      "نوع القيد": "مصروف",
      "التصنيف والباب": "أجهزة تقنية",
      "المبلغ": 8200,
      "طريقة الصرف / الدفع": "فيزا / ماستر كارد",
      "البيان / الوصف التفصيلي": "شراء حواسيب ومحولات اتصال ل غرف معمل الحاسوب"
    }
  ];

  const worksheet = XLSX.utils.json_to_sheet(templateRows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "نموذج استيراد قيود مالية");
  saveAsWorkbook(workbook, "نموذج_استيراد_قيود_مالية_مدرسة_حبيبة.xlsx");
};

export const mapExcelToTransactions = (rows: any[]): Omit<FinanceTransaction, 'id' | 'referenceNo' | 'status'>[] => {
  return rows.map(r => {
    return {
      type: r["نوع القيد"] === 'مصروف' ? 'مصروف' : 'إيراد',
      category: r["التصنيف والباب"] || "رسوم دراسية",
      amount: Number(r["المبلغ"]) || 100,
      date: new Date().toISOString().split('T')[0],
      paymentMethod: r["طريقة الصرف / الدفع"] || 'مدى',
      description: r["البيان / الوصف التفصيلي"] || "قيد مستنسخ من ملف إكسل مالي"
    };
  });
};
