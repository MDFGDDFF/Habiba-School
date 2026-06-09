/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Student {
  id: string;
  name: string;
  avatar: string;
  classId: string; // e.g., "7-A"
  parentName: string;
  parentPhone: string;
  email: string;
  joiningDate: string;
  grades: { [subject: string]: number };
  attendanceRate: number; // 0-100
  feesTotal: number;
  feesPaid: number;
  behaviorScore: number; // out of 100
  qrCode: string;
  status: 'نشط' | 'خريج' | 'موقوف';
  nationalId: string;
  bloodType: string;
  birthDate: string;
  transportId?: string;
  notes: string;
  gender?: 'ذكر' | 'أنثى';
}

export interface Teacher {
  id: string;
  name: string;
  avatar: string;
  subject: string;
  classes: string[]; // e.g., ["7-A", "8-B"]
  contractType: 'دائم' | 'عقد مؤقت';
  salary: number;
  bonus: number;
  joiningDate: string;
  attendanceRate: number;
  rating: number; // 1-5 stars
  phone: string;
  email: string;
  evaluations: { reviewer: string; score: number; comment: string; date: string }[];
  schedule: { [day: string]: { period: number; className: string; subject: string }[] };
}

export interface Employee {
  id: string;
  name: string;
  avatar: string;
  role: 'سائق' | 'أمين مكتبة' | 'محاسب' | 'إداري' | 'طبيب' | 'مستودع';
  salary: number;
  joiningDate: string;
  attendanceRate: number;
  rating: number; // 1-5
  phone: string;
  status: 'نشط' | 'في إجازة' | 'مستقيل';
}

export interface SchoolClass {
  id: string;
  name: string;
  gradeLevel: string; // e.g. "الصف السابع"
  advisor: string;
  studentCount: number;
  roomNumber: string;
}

export interface FinanceTransaction {
  id: string;
  type: 'إيراد' | 'مصروف';
  category: string;
  amount: number;
  date: string;
  referenceNo: string;
  paymentMethod: 'نقدي' | 'مدى' | 'فيزا / ماستر كارد' | 'تحويل بنكي';
  description: string;
  status: 'مكتمل' | 'معلق' | 'ملغى';
}

export interface BookRecord {
  id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  availableCopies: number;
  totalCopies: number;
  digitalLink?: string;
  borrowedBy: { studentName: string; borrowDate: string; returnDate: string; status: 'نشط' | 'مسترجع' }[];
}

export interface TransportRoute {
  id: string;
  routeName: string;
  busNumber: string;
  driverName: string;
  driverPhone: string;
  capacity: number;
  occupied: number;
  stops: string[];
  status: 'في الموعد' | 'متأخر' | 'منتهي';
}

export interface MedicalLog {
  id: string;
  studentId: string;
  studentName: string;
  className: string;
  diagnose: string;
  medication: string;
  severity: 'منخفض' | 'متوسط' | 'حرج';
  date: string;
  nurseNotes: string;
}

export interface WarehouseItem {
  id: string;
  name: string;
  sku: string;
  category: 'قرطاسية' | 'أثاث' | 'طبية' | 'أجهزة تقنية' | 'كتب دراسية';
  stock: number;
  minStock: number;
  unit: string;
  location: string;
  supplierName: string;
}

export interface OCRDocument {
  id: string;
  name: string;
  fileSize: string;
  uploadDate: string;
  digitalBarcode: string;
  extractedText: string;
  isProcessed: boolean;
  category: 'وثائق تسجيل' | 'فواتير ومصاريف' | 'تقارير طيبة' | 'أوراق اختبارات';
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userRole: string;
  userName: string;
  action: string;
  target: string;
  status: 'نجاح' | 'فشل';
  ipAddress: string;
}

export interface Message {
  id: string;
  sender: string;
  receiver: string;
  senderRole: 'إدارة' | 'معلم' | 'ولي أمر' | 'مساعد ذكي';
  text: string;
  timestamp: string;
  isRead: boolean;
  channel: 'داخلي' | 'SMS' | 'WhatsApp';
}

export interface SchoolExam {
  id: string;
  title: string;
  subject: string;
  classId: string;
  date: string;
  duration: number; // minutes
  questions: { id: string; question: string; options: string[]; answerIndex: number; points: number }[];
}
