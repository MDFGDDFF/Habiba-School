/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  School,
  LayoutDashboard,
  Users2,
  GraduationCap,
  NotebookTabs,
  DollarSign,
  CheckCircle2,
  ShieldCheck,
  Bot,
  Bell,
  Sun,
  Moon,
  ChevronRight,
  ChevronLeft,
  Coins,
  Search,
  CheckSquare,
  Globe,
  Lock,
  Eye,
  EyeOff,
  User
} from 'lucide-react';

import {
  Student,
  Teacher,
  Employee,
  FinanceTransaction,
  BookRecord,
  TransportRoute,
  MedicalLog,
  WarehouseItem,
  OCRDocument,
  AuditLog,
  Message,
  SchoolExam
} from './types';

import {
  initialStudents,
  initialTeachers,
  initialEmployees,
  initialTransactions,
  initialBooks,
  initialRoutes,
  initialMedicalLogs,
  initialWarehouse,
  initialOCRDocuments,
  initialAuditLogs,
  initialMessages,
  initialExams
} from './data/mockData';

// Component Views imports
import { DashboardView } from './components/DashboardView';
import { StudentsModule } from './components/StudentsModule';
import { TeachersModule } from './components/TeachersModule';
import { AcademicsModule } from './components/AcademicsModule';
import { FinancialsModule } from './components/FinancialsModule';
import { OtherModules } from './components/OtherModules';
import { AISecurityModule } from './components/AISecurityModule';

export default function App() {
  // Login Gate States
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('school_logged_in') === 'true';
  });
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (usernameInput.trim() === 'abed' && passwordInput === '24682468') {
      localStorage.setItem('school_logged_in', 'true');
      setIsLoggedIn(true);
      setLoginError('');
    } else {
      setLoginError('عذراً! اسم المستخدم أو كلمة المرور غير صحيحة. يرجى المحاولة مجدداً.');
    }
  };

  // Navigation tab states
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Settings states
  const [activeBranch, setActiveBranch] = useState('الفرع الرئيسي - الرياض');
  const [academicYear, setAcademicYear] = useState('2025/2026');
  const [currency, setCurrency] = useState('ILS');

  // Real-time notification lists
  const [notifications, setNotifications] = useState([
    { id: 1, text: "تم تحديث الحضور اليومي لطلاب المرحلة السابعة", time: "قبل 5 دقائق" },
    { id: 2, text: "فاتورة مصاريف العيادة صدرت بانتظار توقيع الصندوق", time: "قبل نصف ساعة" },
    { id: 3, text: "طلب استعارة كتاب رياضيات من ريان حسن الأحمد", time: "قبل ساعتين" }
  ]);
  const [showNotificationPopup, setShowNotificationPopup] = useState(false);

  // Core Persistent State Engine
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('school_students');
    return saved ? JSON.parse(saved) : initialStudents;
  });

  const [teachers, setTeachers] = useState<Teacher[]>(() => {
    const saved = localStorage.getItem('school_teachers');
    return saved ? JSON.parse(saved) : initialTeachers;
  });

  const [employees, setEmployees] = useState<Employee[]>(() => {
    const saved = localStorage.getItem('school_employees');
    return saved ? JSON.parse(saved) : initialEmployees;
  });

  const [transactions, setTransactions] = useState<FinanceTransaction[]>(() => {
    const saved = localStorage.getItem('school_transactions');
    return saved ? JSON.parse(saved) : initialTransactions;
  });

  const [books, setBooks] = useState<BookRecord[]>(() => {
    const saved = localStorage.getItem('school_books');
    return saved ? JSON.parse(saved) : initialBooks;
  });

  const [routes, setRoutes] = useState<TransportRoute[]>(() => {
    const saved = localStorage.getItem('school_routes');
    return saved ? JSON.parse(saved) : initialRoutes;
  });

  const [medicalLogs, setMedicalLogs] = useState<MedicalLog[]>(() => {
    const saved = localStorage.getItem('school_medical');
    return saved ? JSON.parse(saved) : initialMedicalLogs;
  });

  const [warehouse, setWarehouse] = useState<WarehouseItem[]>(() => {
    const saved = localStorage.getItem('school_warehouse');
    return saved ? JSON.parse(saved) : initialWarehouse;
  });

  const [ocrDocuments, setOcrDocuments] = useState<OCRDocument[]>(() => {
    const saved = localStorage.getItem('school_ocr');
    return saved ? JSON.parse(saved) : initialOCRDocuments;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem('school_audits');
    return saved ? JSON.parse(saved) : initialAuditLogs;
  });

  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('school_messages');
    return saved ? JSON.parse(saved) : initialMessages;
  });

  const [exams, setExams] = useState<SchoolExam[]>(() => {
    const saved = localStorage.getItem('school_exams');
    return saved ? JSON.parse(saved) : initialExams;
  });

  // Current testing active security user role
  const [userRole, setUserRole] = useState<'SuperAdmin' | 'Teacher' | 'Accountant' | 'Parent'>('SuperAdmin');

  // Sync state helpers
  useEffect(() => {
    localStorage.setItem('school_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('school_teachers', JSON.stringify(teachers));
  }, [teachers]);

  useEffect(() => {
    localStorage.setItem('school_employees', JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem('school_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('school_books', JSON.stringify(books));
  }, [books]);

  useEffect(() => {
    localStorage.setItem('school_routes', JSON.stringify(routes));
  }, [routes]);

  useEffect(() => {
    localStorage.setItem('school_medical', JSON.stringify(medicalLogs));
  }, [medicalLogs]);

  useEffect(() => {
    localStorage.setItem('school_warehouse', JSON.stringify(warehouse));
  }, [warehouse]);

  useEffect(() => {
    localStorage.setItem('school_ocr', JSON.stringify(ocrDocuments));
  }, [ocrDocuments]);

  useEffect(() => {
    localStorage.setItem('school_audits', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem('school_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('school_exams', JSON.stringify(exams));
  }, [exams]);

  // Dark/Light effect trigger
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Helper method: Add secure audit logs programmatically
  const addAuditLog = (action: string, target: string, status: 'نجاح' | 'فشل') => {
    const newLog: AuditLog = {
      id: `LOG-${Math.floor(Math.random() * 9000 + 1000)}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      userRole: userRole === 'SuperAdmin' ? 'مدير النظام' : userRole === 'Teacher' ? 'معلم رئيسي' : userRole === 'Accountant' ? 'محاسب' : 'ولي أمر',
      userName: userRole === 'SuperAdmin' ? 'أ. عابد (abed)' : userRole === 'Teacher' ? 'مندوب الكادر المعلم' : userRole === 'Accountant' ? 'أبو بكر الصدّيق' : 'حسن علي الأحمد',
      action,
      target,
      status,
      ipAddress: '192.168.1.155'
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const handleRestoreAllData = (backup: any) => {
    if (!backup || typeof backup !== 'object') return;
    if (backup.students) setStudents(backup.students);
    if (backup.teachers) setTeachers(backup.teachers);
    if (backup.employees) setEmployees(backup.employees);
    if (backup.transactions) setTransactions(backup.transactions);
    if (backup.books) setBooks(backup.books);
    if (backup.routes) setRoutes(backup.routes);
    if (backup.medicalLogs) setMedicalLogs(backup.medicalLogs);
    if (backup.warehouse) setWarehouse(backup.warehouse);
    if (backup.ocrDocuments) setOcrDocuments(backup.ocrDocuments);
    if (backup.auditLogs) setAuditLogs(backup.auditLogs);
    if (backup.messages) setMessages(backup.messages);
    if (backup.exams) setExams(backup.exams);
    addAuditLog("استرجاع قاعدة البيانات من ملف ترحيل خارجي", "تنسيق مكامل (.json)", "نجاح");
  };

  const handleResetAllData = () => {
    setStudents(initialStudents);
    setTeachers(initialTeachers);
    setEmployees(initialEmployees);
    setTransactions(initialTransactions);
    setBooks(initialBooks);
    setRoutes(initialRoutes);
    setMedicalLogs(initialMedicalLogs);
    setWarehouse(initialWarehouse);
    setOcrDocuments(initialOCRDocuments);
    setAuditLogs(initialAuditLogs);
    setMessages(initialMessages);
    setExams(initialExams);
    addAuditLog("تصفير شامل وإعادة ضبط المصنع للبيانات", "كل الجداول مدرسة حبيبة", "نجاح");
  };

  // State manipulation handlers (Callback connectors)

  const handleImportStudents = (imported: Omit<Student, 'id' | 'qrCode'>[]) => {
    setStudents(prev => {
      const newStudents = imported.map((stu, index) => {
        const newId = `STU-2026-${String(prev.length + index + 1).padStart(3, '0')}`;
        return {
          ...stu,
          id: newId,
          qrCode: `QR-GEN-${newId}-${Math.floor(Math.random() * 10000)}`
        };
      });
      return [...newStudents, ...prev];
    });
    addAuditLog("استيراد دفعة طلاب من ملف إكسل", `إضافة ${imported.length} طالب بنجاح`, "نجاح");
  };

  const handleImportTeachers = (imported: Omit<Teacher, 'id'>[]) => {
    setTeachers(prev => {
      const newTeachers = imported.map((tch, index) => {
        const newId = `TCH-2026-${String(prev.length + index + 1).padStart(3, '0')}`;
        return {
          ...tch,
          id: newId
        };
      });
      return [...newTeachers, ...prev];
    });
    addAuditLog("استيراد دفعة معلمات وكادر تعليمي", `تأهيل ${imported.length} معلم بنجاح`, "نجاح");
  };

  const handleImportTransactions = (imported: Omit<FinanceTransaction, 'id' | 'referenceNo' | 'status'>[]) => {
    setTransactions(prev => {
      const newTransactions = imported.map((tr) => {
        return {
          ...tr,
          id: `FT-2026-${Math.floor(Math.random() * 90000 + 10000)}`,
          referenceNo: `REF-GEN-${Math.floor(Math.random() * 90000 + 10000)}`,
          status: 'مكتمل' as const
        };
      });
      return [...newTransactions, ...prev];
    });
    addAuditLog("استيراد قيود مالية من ملف إكسل", `تسجيل ${imported.length} قيد مالي جديد`, "نجاح");
  };

  const handleAddStudent = (stu: Omit<Student, 'id' | 'qrCode'>) => {
    const newId = `STU-2026-${String(students.length + 1).padStart(3, '0')}`;
    const newStudent: Student = {
      ...stu,
      id: newId,
      qrCode: `QR-GEN-${newId}-${Math.floor(Math.random() * 10000)}`
    };
    setStudents(prev => [newStudent, ...prev]);
    addAuditLog("إنشاء ملف تعريف طالب دراسي جديد", newStudent.name, "نجاح");
  };

  const handleDeleteStudent = (id: string) => {
    const targetName = students.find(s => s.id === id)?.name || id;
    if (confirm(`هل أنت متأكد من رغبتك في إلغاء قيد وأرشفة الطالب: ${targetName}؟`)) {
      setStudents(prev => prev.filter(s => s.id !== id));
      addAuditLog("شطب وإلغاء انتساب طالب من لوحة التدقيق", targetName, "نجاح");
    }
  };

  const handleUpdateStudentBehavior = (id: string, newScore: number) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, behaviorScore: newScore } : s));
    const targetName = students.find(s => s.id === id)?.name || id;
    addAuditLog("تعديل مؤشر الانضباط والسلوك الأسبوعي", `${targetName} -> ${newScore}`, "نجاح");
  };

  const handleAddTeacher = (tch: Omit<Teacher, 'id'>) => {
    const newId = `TCH-2026-${String(teachers.length + 1).padStart(3, '0')}`;
    const newTch: Teacher = {
      ...tch,
      id: newId
    };
    setTeachers(prev => [newTch, ...prev]);
    addAuditLog("تأهيل وتعيين معلم تخصصي جديد", newTch.name, "نجاح");
  };

  const handleAddTeacherBonus = (id: string, bonusAmount: number) => {
    setTeachers(prev => prev.map(t => t.id === id ? { ...t, bonus: t.bonus + bonusAmount } : t));
    const targetName = teachers.find(t => t.id === id)?.name || id;
    addAuditLog("إيداع حافز نقدي بقائمة راتب المعلم", `${targetName} (+${bonusAmount} ₪)`, "نجاح");
  };

  const handleAddExam = (exam: SchoolExam) => {
    setExams(prev => [exam, ...prev]);
    addAuditLog("بناء ونشر نموذج اختبار بنك أسئلة جديد", exam.title, "نجاح");
  };

  const handleAddTransaction = (tr: Omit<FinanceTransaction, 'id' | 'referenceNo' | 'status'>) => {
    const newTr: FinanceTransaction = {
      ...tr,
      id: `FT-2026-${Math.floor(Math.random() * 90000 + 10000)}`,
      referenceNo: `REF-GEN-${Math.floor(Math.random() * 90000 + 10000)}`,
      status: 'مكتمل'
    };
    setTransactions(prev => [newTr, ...prev]);
    addAuditLog(`إصدار وثيقة قيد مالي (${newTr.type})`, `${newTr.category} - ${newTr.amount.toLocaleString()} ₪`, "نجاح");
  };

  const handlePayStudentFees = (stuId: string, amount: number) => {
    setStudents(prev => prev.map(s => {
      if (s.id === stuId) {
        return {
          ...s,
          feesPaid: Math.min(s.feesTotal, s.feesPaid + amount)
        };
      }
      return s;
    }));
    const targetName = students.find(s => s.id === stuId)?.name || stuId;
    addAuditLog("شحن وتسديد قسط مصروف لولي الأمر", `${targetName} (مدفوع: ${amount} ₪)`, "نجاح");
  };

  const handleAddOCRDocument = (doc: OCRDocument) => {
    setOcrDocuments(prev => [doc, ...prev]);
    addAuditLog("رفع وقراءة ملف سحابي بالـ OCR", doc.name, "نجاح");
  };

  const handleSendMessage = (msg: Message) => {
    setMessages(prev => [msg, ...prev]);
    addAuditLog(`بث رسالة فورية عبر قناة ${msg.channel}`, msg.receiver, "نجاح");
  };

  // Stats wrappers for calculations
  const schoolStatsSummary = {
    studentsCount: students.filter(s => s.status === 'نشط').length,
    teachersCount: teachers.length,
    totalBalance: students.reduce((sum, s) => sum + s.feesPaid, 0),
    lowStockCount: warehouse.filter(w => w.stock <= w.minStock).length
  };

  // Nav Links tailored strictly to specified modules
  const navigationLinks = [
    { id: 'dashboard', label: 'لوحة التحكم التنفيذية', icon: LayoutDashboard },
    { id: 'students', label: 'شؤون الطلاب والتسجيل', icon: Users2 },
    { id: 'teachers', label: 'الكادر الأكاديمي والمعلمون', icon: GraduationCap },
    { id: 'academics', label: 'الإدارة الأكاديمية والجدولة', icon: NotebookTabs },
    { id: 'financials', label: 'الموازنة والخزينة المالية', icon: DollarSign },
    { id: 'others', label: 'العمليات والخدمات العامة', icon: CheckCircle2 },
    { id: 'security_ai', label: 'الأمان وحوكمة الـ AI و الـ Audit', icon: ShieldCheck },
  ];

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden text-right select-none" dir="rtl" id="login-screen-wrapper">
        {/* Decorative ambient gradient glowing bubbles */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-[#E91E63]/10 dark:bg-[#E91E63]/5 rounded-full blur-[80px] -z-10" />
        <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[350px] h-[350px] bg-pink-100/30 dark:bg-pink-950/5 rounded-full blur-[80px] -z-10" />

        <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-pink-100 dark:border-pink-950/25 rounded-3xl shadow-xl p-8 relative z-10 transition duration-150">
          
          {/* Logo & School Title Header */}
          <div className="text-center space-y-3 mb-8">
            <div className="mx-auto w-14 h-14 bg-gradient-to-tr from-[#E91E63] to-pink-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-pink-200 dark:shadow-none">
              <School className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h1 className="text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-[#E91E63] dark:from-pink-400 dark:to-pink-600">
                مدرسة حبيبة التعليمية
              </h1>
              <p className="text-xs font-bold text-gray-500 dark:text-gray-400">
                بوابة الوصول الآمن لنظام تخطيط موارد المدارس (School ERP)
              </p>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-5">
            {loginError && (
              <div className="bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/50 p-3 rounded-2xl text-xs text-red-600 dark:text-red-400 font-bold text-center leading-relaxed">
                {loginError}
              </div>
            )}

            <div className="space-y-1.5 text-right">
              <label className="text-xs font-extrabold text-gray-600 dark:text-gray-300">
                اسم المستخدم للوحة التحكم
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  placeholder="أدخل اسم المستخدم"
                  className="w-full pr-10 pl-4 py-2.5 rounded-2xl border border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-950 text-xs focus:ring-2 focus:ring-[#E91E63]/20 focus:border-[#E91E63] transition font-sans outline-none text-slate-800 dark:text-slate-100 text-right"
                  id="login-username"
                />
                <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-gray-400">
                  <User className="w-4 h-4" />
                </div>
              </div>
            </div>

            <div className="space-y-1.5 text-right">
              <label className="text-xs font-extrabold text-gray-600 dark:text-gray-300">
                كلمة سر النظام المشفرة
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="أدخل كلمة المرور"
                  className="w-full pr-10 pl-10 py-2.5 rounded-2xl border border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-950 text-xs focus:ring-2 focus:ring-[#E91E63]/20 focus:border-[#E91E63] transition font-sans outline-none text-slate-800 dark:text-slate-100 text-right"
                  id="login-password"
                />
                <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-gray-400">
                  <Lock className="w-4 h-4" />
                </div>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 hover:text-gray-650 cursor-pointer"
                  title={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#E91E63] hover:bg-pink-700 text-white font-bold text-xs rounded-2xl shadow-lg shadow-pink-150 transition-all hover:scale-[1.01] cursor-pointer flex items-center justify-center gap-2 mt-2"
              id="login-submit-btn"
            >
              <span>تسجيل الدخول الآمن للوحة التحكم</span>
            </button>
          </form>

          {/* Verification info note */}
          <div className="mt-8 pt-6 border-t border-dashed border-gray-100 dark:border-slate-800 text-center">
            <p className="text-[10px] text-gray-400 leading-relaxed font-semibold">
              يقوم نظام ERP مدرسة حبيبة بحفظ جلسة المصادقة بمتصفح الويب للمشرف بصورة كاملة لمزيد من الحماية.
            </p>
          </div>

        </div>

        {/* Footer info brand */}
        <p className="text-[11px] text-gray-450 font-medium mt-6 text-center">
          حقوق الطبع والنشر © مدرسة حبيبة التعليمية 2026 - كافة الحقوق محفوظة
        </p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-school-bg dark:bg-school-dark-bg transition duration-150 text-right flex flex-col md:flex-row`} id="habiba-applet-root">
      
      {/* 1: PRIMARY SIDEBAR LAYOUT */}
      <aside className={`bg-white dark:bg-school-card-dark border-l border-pink-100 dark:border-pink-950/20 shadow-xl transition-all duration-300 z-30 flex flex-col justify-between shrink-0 ${
        isSidebarCollapsed ? 'w-20' : 'w-72'
      }`} id="sidebar-panel">
        <div>
          {/* Logo & School Name Banner */}
          <div className="p-5 border-b border-pink-50 dark:border-pink-950/20 flex items-center justify-between text-[#E91E63]">
            <div className={`flex items-center gap-2.5 ${isSidebarCollapsed && 'mx-auto justify-center'}`}>
              <div className="bg-[#E91E63] p-2.5 rounded-xl text-white shadow-lg shadow-pink-200">
                <School className="w-6 h-6 shrink-0" />
              </div>
              {!isSidebarCollapsed && (
                <div className="space-y-0.5 pointer-events-none">
                  <h2 className="text-md font-extrabold tracking-tight text-slate-850 dark:text-gray-150">مدرسة حبيبة</h2>
                  <p className="text-[10px] text-pink-500 font-bold">ERP المدرسي المتكامل</p>
                </div>
              )}
            </div>

            {/* Collapse toggle selector */}
            {!isSidebarCollapsed && (
              <button
                onClick={() => setIsSidebarCollapsed(true)}
                className="bg-pink-50 dark:bg-pink-950/20 p-1.5 rounded-lg text-[#E91E63] hover:bg-pink-100 transition duration-150 cursor-pointer animate-fade-in"
                title="طي القائمة الجانبية"
                id="btn-collapse-sidebar"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Navigation Links list */}
          <nav className="p-4 space-y-1">
            {navigationLinks.map((link) => {
              const Icon = link.icon;
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => setActiveTab(link.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold transition-all duration-250 cursor-pointer border-r-4 ${
                    isActive
                      ? 'bg-pink-50 dark:bg-pink-950/20 text-[#E91E63] border-[#E91E63] shadow-xs'
                      : 'text-slate-500 dark:text-gray-400 hover:text-[#E91E63] hover:bg-pink-50/50 dark:hover:bg-pink-950/10 border-transparent'
                  }`}
                  id={`nav-link-${link.id}`}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  {!isSidebarCollapsed && <span className="font-semibold">{link.label}</span>}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Collapsed sidebar expanded button */}
        {isSidebarCollapsed && (
          <button
            onClick={() => setIsSidebarCollapsed(false)}
            className="m-4 bg-pink-100 dark:bg-pink-900/15 p-2.5 rounded-2xl text-[#E91E63] text-center flex justify-center hover:bg-pink-200 transition duration-150 cursor-pointer"
            id="btn-expand-sidebar"
          >
            <ChevronLeft className="w-5 h-5 animate-pulse" />
          </button>
        )}

        {/* Footer info user card inside sidebar */}
        {!isSidebarCollapsed && (
          <div className="p-4 border-t border-pink-50 dark:border-pink-950/20 bg-pink-50/10 dark:bg-black/10 text-xs text-right space-y-2.5">
            <div className="flex gap-2.5 items-center justify-between">
              <div className="flex gap-2.5 items-center">
                <div className="bg-[#E91E63] text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                  A
                </div>
                <div className="space-y-0.5">
                  <p className="font-extrabold text-slate-800 dark:text-gray-100">أ. عابد (abed)</p>
                  <span className="text-[10px] text-slate-400 font-bold">مدير مدرسة حبيبة العام</span>
                </div>
              </div>
              
              <button
                onClick={() => {
                  localStorage.removeItem('school_logged_in');
                  setIsLoggedIn(false);
                }}
                className="p-1 px-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-650 hover:text-red-700 text-[10px] font-bold border border-red-100 cursor-pointer transition flex items-center gap-1"
                title="تسجيل الخروج الآمن"
              >
                خروج
              </button>
            </div>

            <div className="text-[10px] text-slate-400 font-semibold border-t pt-2 border-dashed border-pink-100 dark:border-gray-800 flex justify-between">
              <span>دور الفحص:</span>
              <span className="text-[#E91E63] font-bold">
                {userRole === 'SuperAdmin' ? 'مدير النظام' : userRole === 'Teacher' ? 'معلم' : userRole === 'Accountant' ? 'محاسب' : 'ولي أمر'}
              </span>
            </div>
          </div>
        )}
      </aside>

      {/* 2: MASTER BODY WORKSPACE (Header + Main Dynamic Panel) */}
      <main className="flex-1 flex flex-col overflow-x-hidden min-h-screen">
        
        {/* Header Smart Control Frame */}
        <header className="bg-white/80 dark:bg-school-card-dark/80 backdrop-blur-md sticky top-0 z-20 border-b border-pink-100 dark:border-pink-950/30 p-4 px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          
          {/* Right Side: Year, branch & Currency Dropdowns */}
          <div className="flex items-center gap-3 text-xs w-full sm:w-auto">
            {/* Branch option */}
            <div className="bg-gray-50 dark:bg-black/20 px-3 py-1.5 rounded-xl border flex items-center gap-1.5 focus-within:border-[#E91E63]">
              <span className="text-gray-400 font-bold">الفرع:</span>
              <select
                value={activeBranch}
                onChange={(e) => {
                  setActiveBranch(e.target.value);
                  addAuditLog("تعديل فرع تصفح المؤسسة", e.target.value, "نجاح");
                }}
                className="font-bold text-gray-700 bg-transparent focus:outline-none cursor-pointer"
              >
                <option value="الفرع الرئيسي - الرياض">الرئيسي - الرياض</option>
                <option value="فرع التخصصي الخارجي">فرع التخصصي</option>
                <option value="القسم الابتدائي للبنات">الابتدائي للبنات</option>
              </select>
            </div>

            {/* Academic Year option */}
            <div className="bg-gray-50 dark:bg-black/20 px-3 py-1.5 rounded-xl border flex items-center gap-1.5">
              <span className="text-gray-400 font-bold">السنة:</span>
              <select
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                className="font-bold text-gray-700 bg-transparent focus:outline-none cursor-pointer"
              >
                <option value="2025/2026">2025 / 2026</option>
                <option value="2026/2027">2026 / 2027</option>
              </select>
            </div>
          </div>

          {/* Left Side: Clock, Theme triggers, Notifications, Profile */}
          <div className="flex items-center gap-3 justify-end w-full sm:w-auto">
            {/* dynamic system Clock (Fixed representation) */}
            <span className="text-[11px] font-mono text-gray-400 bg-gray-50 dark:bg-black/20 px-2.5 py-1.5 rounded-xl border hidden md:block">
              توقيت النظام: 2026-06-09 10:19 UTC
            </span>

            {/* Dark & light theme trigger */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2.5 rounded-xl border hover:bg-pink-50/50 transition cursor-pointer text-gray-500"
              title="تعديل الوضع الحالي المظلم أو المضيء"
              id="btn-theme-toggle"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-indigo-700" />}
            </button>

            {/* Interactive Alert Notifications Icon */}
            <div className="relative">
              <button
                onClick={() => setShowNotificationPopup(!showNotificationPopup)}
                className="p-2.5 rounded-xl border hover:bg-pink-50/50 transition cursor-pointer text-[#E91E63] relative"
                id="btn-notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1 left-1.5 w-2 h-2 rounded-full bg-red-500" />
              </button>

              {showNotificationPopup && (
                <div className="absolute left-0 mt-3 w-80 bg-white dark:bg-school-card-dark rounded-2xl border p-4 soft-shadow z-55 space-y-3">
                  <div className="flex justify-between items-center border-b pb-2">
                    <span className="text-xs font-black text-gray-700 dark:text-gray-100">صندوق تنبيهات مدرسة حبيبة</span>
                    <button
                      onClick={() => setNotifications([])}
                      className="text-[10px] text-gray-400 hover:text-[#E91E63]"
                    >
                      تصفير التنبيهات
                    </button>
                  </div>
                  <div className="space-y-2.5 max-h-48 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map(n => (
                        <div key={n.id} className="text-xs text-right space-y-0.5 border-b pb-2 bg-pink-50/10 p-1.5 rounded-lg">
                          <p className="text-gray-800 dark:text-gray-200 font-semibold">{n.text}</p>
                          <span className="text-[9px] text-gray-400 font-mono block">{n.time}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-gray-400 py-4 text-center">لا توجد رسائل إشعار جديدة حالياً.</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dynamic Inner Panel Body */}
        <div className="p-6 flex-1 max-w-7xl mx-auto w-full">
          {activeTab === 'dashboard' && (
            <DashboardView
              students={students}
              teachers={teachers}
              transactions={transactions}
              onNavigate={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'students' && (
            <StudentsModule
              students={students}
              onAddStudent={handleAddStudent}
              onDeleteStudent={handleDeleteStudent}
              onUpdateScore={handleUpdateStudentBehavior}
              onImportStudents={handleImportStudents}
            />
          )}

          {activeTab === 'teachers' && (
            <TeachersModule
              teachers={teachers}
              onAddTeacher={handleAddTeacher}
              onAddBonus={handleAddTeacherBonus}
              onImportTeachers={handleImportTeachers}
            />
          )}

          {activeTab === 'academics' && (
            <AcademicsModule
              exams={exams}
              onAddExam={handleAddExam}
              studentsList={students}
            />
          )}

          {activeTab === 'financials' && (
            <FinancialsModule
              transactions={transactions}
              onAddTransaction={handleAddTransaction}
              studentsList={students}
              onPayStudentFees={handlePayStudentFees}
              onImportTransactions={handleImportTransactions}
            />
          )}

          {activeTab === 'others' && (
            <OtherModules
              students={students}
              teachers={teachers}
              employees={employees}
              books={books}
              routes={routes}
              medicalLogs={medicalLogs}
              warehouse={warehouse}
              ocrDocuments={ocrDocuments}
              messages={messages}
              onAddOCRDocument={handleAddOCRDocument}
              onSendMessage={handleSendMessage}
            />
          )}

          {activeTab === 'security_ai' && (
            <AISecurityModule
              auditLogs={auditLogs}
              onAddAuditLog={addAuditLog}
              userRole={userRole}
              onChangeUserRole={setUserRole}
              schoolStats={schoolStatsSummary}
              allData={{
                students,
                teachers,
                employees,
                transactions,
                books,
                routes,
                medicalLogs,
                warehouse,
                ocrDocuments,
                auditLogs,
                messages,
                exams
              }}
              onRestoreAllData={handleRestoreAllData}
              onResetAllData={handleResetAllData}
            />
          )}
        </div>
      </main>
    </div>
  );
}
