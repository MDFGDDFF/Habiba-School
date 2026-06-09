/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Users,
  Briefcase,
  Star,
  Award,
  Plus,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  TrendingUp,
  Clock,
  ChevronDown,
  Download,
  Upload,
  FileSpreadsheet
} from 'lucide-react';
import { Teacher } from '../types';
import {
  exportTeachersToExcel,
  downloadTeacherTemplate,
  parseExcelFile,
  mapExcelToTeachers
} from '../utils/excelHelper';

interface TeachersModuleProps {
  teachers: Teacher[];
  onAddTeacher: (teacher: Omit<Teacher, 'id'>) => void;
  onAddBonus: (id: string, bonusAmount: number) => void;
  onImportTeachers?: (teachers: Omit<Teacher, 'id'>[]) => void;
}

export const TeachersModule: React.FC<TeachersModuleProps> = ({
  teachers,
  onAddTeacher,
  onAddBonus,
  onImportTeachers
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [bonusInput, setBonusInput] = useState('');

  // Excel integration states
  const [showExcelSection, setShowExcelSection] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [importStatus, setImportStatus] = useState<{ success?: boolean; msg?: string } | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setImportStatus(null);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      await processImportedFile(files[0]);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setImportStatus(null);
    const files = e.target.files;
    if (files && files.length > 0) {
      await processImportedFile(files[0]);
    }
  };

  const processImportedFile = async (file: File) => {
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (ext !== 'xlsx' && ext !== 'xls' && ext !== 'csv') {
      setImportStatus({ success: false, msg: 'عذراً! يرجى رفع ملف إكسل بصيغة .xlsx أو .xls أو .csv فقط!' });
      return;
    }
    try {
      const rows = await parseExcelFile(file);
      if (!rows || rows.length === 0) {
        setImportStatus({ success: false, msg: 'الملف فارغ أو غير متوافق التنسيق.' });
        return;
      }
      const mapped = mapExcelToTeachers(rows);
      if (onImportTeachers) {
        onImportTeachers(mapped);
        setImportStatus({ success: true, msg: `تم استيراد عدد (${mapped.length}) معلمين ومعلمات بنجاح وألحق بكشف الحضور والرواتب!` });
      } else {
        setImportStatus({ success: false, msg: 'الرجاء إعادة المحاولة.' });
      }
    } catch (err: any) {
      setImportStatus({ success: false, msg: `فشل التحليل: ${err?.message || 'تأكد من مطابقة أعمدة ومصطلحات النموذج الرسمية.'}` });
    }
  };

  // New Teacher Inputs
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('الرياضيات');
  const [salary, setSalary] = useState(11000);
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [contractType, setContractType] = useState<'دائم' | 'عقد مؤقت'>('دائم');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    onAddTeacher({
      name,
      avatar: "https://images.unsplash.com/photo-1594744803329-e58b31de215f?w=150",
      subject,
      classes: ["7-A"],
      contractType,
      salary: Number(salary),
      bonus: 0,
      joiningDate: new Date().toISOString().split('T')[0],
      attendanceRate: 100,
      rating: 5.0,
      phone,
      email: email || `${name.split(' ')[0]}@habiba.edu`,
      evaluations: [
        { reviewer: "مدير المدرسة ماجد البكري", score: 5, comment: "تم التعيين والتحقق من المؤهلات العلمية.", date: new Date().toISOString().split('T')[0] }
      ],
      schedule: {
        "الأحد": [{ period: 1, className: "7-A", subject }],
        "الإثنين": [{ period: 2, className: "7-A", subject }]
      }
    });

    // Reset
    setName('');
    setPhone('');
    setEmail('');
    setShowAddModal(false);
  };

  const handleBonusSubmit = (id: string) => {
    const val = Number(bonusInput);
    if (isNaN(val) || val <= 0) return;
    onAddBonus(id, val);
    setBonusInput('');
    // refresh detail state if loaded
    if (selectedTeacher && selectedTeacher.id === id) {
      setSelectedTeacher({
        ...selectedTeacher,
        bonus: selectedTeacher.bonus + val
      });
    }
  };

  return (
    <div className="space-y-6" id="teachers-module-container">
      {/* Header and statistics panel */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-800 dark:text-white inline-flex items-center gap-2">
            <Users className="w-7 h-7 text-[#E91E63]" />
            شؤون إدارة الكادر التعليمي
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            متابعة رواتب وأداء المعلمين، توزيع الحصص والجداول الدراسية الأسبوعية، ورصد التقييمات الرسمية
          </p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={() => setShowExcelSection(!showExcelSection)}
            className={`px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 text-sm transition cursor-pointer border ${
              showExcelSection 
                ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 border-emerald-200 dark:border-emerald-800' 
                : 'bg-white dark:bg-school-card-dark text-gray-700 dark:text-gray-300 border-gray-150 dark:border-gray-800 hover:border-[#E91E63]/30 hover:text-[#E91E63]'
            }`}
            id="btn-toggle-excel-teachers"
          >
            <FileSpreadsheet className="w-5 h-5 text-emerald-500" />
            عمليات إكسل Excel
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="glow-btn bg-[#E91E63] text-white select-none px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 text-sm transition cursor-pointer"
            id="btn-add-teacher"
          >
            <Plus className="w-4 h-4" />
            تسجيل معلم جديد
          </button>
        </div>
      </div>

      {/* Excel Section Block */}
      {showExcelSection && (
        <div className="bg-white dark:bg-school-card-dark border border-dashed border-emerald-200 dark:border-emerald-950/40 p-5 rounded-2xl space-y-4 shadow-sm animate-fade-in" id="excel-teachers-section">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3 border-b pb-3 border-gray-100 dark:border-gray-800/45">
            <div>
              <h3 className="text-sm font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5" />
                لوحة أدوات ومكاملة إكسل المتقدمة للمعلمين (Excel Workspace)
              </h3>
              <p className="text-[11px] text-gray-400 mt-0.5">يمكنك تصدير وتنزيل كافة بيانات المعلمين الحالية، أو سحب وإفلات ملف Excel/CSV للاستيراد الفوري والدفعة الكبرى</p>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <button
                onClick={downloadTeacherTemplate}
                className="p-2 px-3.5 bg-gray-50 hover:bg-gray-100 dark:bg-black/10 dark:hover:bg-black/20 text-[11px] font-bold rounded-xl text-gray-650 dark:text-gray-350 flex items-center gap-1.5 transition border cursor-pointer border-gray-100 dark:border-gray-800"
              >
                <Download className="w-3.5 h-3.5 text-blue-500" />
                تحميل نموذج الاستيراد (.xlsx)
              </button>

              <button
                onClick={() => exportTeachersToExcel(teachers)}
                className="p-2 px-3.5 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/10 dark:hover:bg-emerald-950/20 text-[11px] font-bold rounded-xl text-emerald-650 dark:text-emerald-400 flex items-center gap-1.5 transition border cursor-pointer border-emerald-100 dark:border-emerald-900/30"
              >
                <Download className="w-3.5 h-3.5 text-emerald-500" />
                تصدير الكادر التعليمي إلى إكسل
              </button>
            </div>
          </div>

          {/* Drag & Drop Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center text-center gap-2 transition-all ${
              isDragging 
                ? 'border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/10' 
                : 'border-gray-200 dark:border-gray-800 bg-gray-50/30 hover:bg-gray-50/70'
            }`}
          >
            <input
              type="file"
              id="teacher-excel-file"
              className="hidden"
              accept=".xlsx, .xls, .csv"
              onChange={handleFileSelect}
            />
            
            <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-950/20 rounded-full flex items-center justify-center text-emerald-500 mb-1">
              <Upload className="w-6 h-6 animate-bounce" />
            </div>

            <label htmlFor="teacher-excel-file" className="cursor-pointer">
              <p className="text-xs font-black text-gray-700 dark:text-gray-250">
                اسحب وأفلت ملف سجل الكادر التعليمي هنا، أو <span className="text-[#E91E63] underline hover:text-pink-600">انقر للتصفح والرفع</span>
              </p>
              <p className="text-[10px] text-gray-400 mt-1">تنسيقات الملفات المدعومة: Microsoft Excel (.xlsx, .xls) أو النصوص المحددة بفواصل (.csv)</p>
            </label>
          </div>

          {importStatus && (
            <div className={`p-3.5 rounded-xl text-xs font-bold text-center border leading-relaxed animate-fade-in ${
              importStatus.success 
                ? 'bg-green-50 dark:bg-green-950/10 border-green-100 dark:border-green-905/35 text-green-600' 
                : 'bg-red-50 dark:bg-red-950/10 border-red-100 dark:border-red-905/35 text-red-650'
            }`}>
              {importStatus.msg}
            </div>
          )}
        </div>
      )}

      {/* Teachers GRID list */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teachers.map((tch) => (
          <div
            key={tch.id}
            className="glass-panel rounded-2xl p-5 border border-pink-100 dark:border-pink-900/10 soft-shadow flex flex-col justify-between hover:-translate-y-1 transition duration-300 relative overflow-hidden"
          >
            <div className="absolute left-4 top-4 bg-[#E91E63]/10 px-2 py-0.5 rounded-full text-[11px] font-semibold text-[#E91E63]">
              {tch.subject}
            </div>

            <div className="space-y-4">
              <div className="flex gap-4 items-center">
                <img
                  src={tch.avatar}
                  alt={tch.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-pink-200"
                />
                <div className="space-y-1">
                  <h3 className="text-md font-bold text-gray-800 dark:text-white">{tch.name}</h3>
                  <p className="text-xs text-gray-400 font-mono">{tch.id}</p>
                  
                  {/* Rating Stars */}
                  <div className="flex items-center gap-0.5 text-amber-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 fill-current ${
                          i < Math.floor(tch.rating) ? 'opacity-100' : 'opacity-30'
                        }`}
                      />
                    ))}
                    <span className="text-[11px] font-bold text-gray-500 mr-1">({tch.rating})</span>
                  </div>
                </div>
              </div>

              {/* KPI metrics block */}
              <div className="grid grid-cols-2 gap-3 bg-gray-50 dark:bg-black/20 p-3 rounded-xl text-xs text-gray-600 dark:text-gray-300">
                <div>
                  <span className="text-gray-400 block mb-0.5">الراتب الأساسي</span>
                  <span className="font-extrabold text-gray-800 dark:text-white">{tch.salary.toLocaleString()} ₪</span>
                </div>
                <div>
                  <span className="text-gray-400 block mb-0.5">الحوافز والرصيد</span>
                  <span className="font-extrabold text-[#E91E63]">{tch.bonus.toLocaleString()} ₪</span>
                </div>
                <div>
                  <span className="text-gray-400 block mb-0.5">نسبة الحضور</span>
                  <span className="font-extrabold text-teal-600">{tch.attendanceRate}%</span>
                </div>
                <div>
                  <span className="text-gray-400 block mb-0.5">الصفوف الموكلة</span>
                  <span className="font-bold">{tch.classes.join(" & ")}</span>
                </div>
              </div>

              {/* Dynamic Action Button to detailed schedules */}
              <button
                onClick={() => setSelectedTeacher(tch)}
                className="w-full text-center bg-[#E91E63]/5 hover:bg-[#E91E63] hover:text-white text-[#E91E63] font-bold py-2 rounded-xl text-xs transition cursor-pointer inline-flex items-center justify-center gap-1.5"
                id={`btn-view-teacher-${tch.id}`}
              >
                <Calendar className="w-4 h-4" />
                عرض جدول الحصص والتقييم والرواتب
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Model 1: Teacher's Detailed Schedule & Finance & Evaluations modal */}
      {selectedTeacher && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-school-card-dark rounded-3xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto space-y-6 soft-shadow relative text-right">
            <button
              onClick={() => setSelectedTeacher(null)}
              className="absolute left-4 top-4 bg-gray-100 dark:bg-gray-800 p-1.5 rounded-full text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              x
            </button>

            <div className="border-b pb-4 border-gray-100 dark:border-gray-800 flex justify-between items-center flex-wrap gap-3">
              <div className="flex gap-4 items-center">
                <img
                  src={selectedTeacher.avatar}
                  alt={selectedTeacher.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-primary"
                />
                <div>
                  <h2 className="text-xl font-black text-gray-800 dark:text-white">{selectedTeacher.name}</h2>
                  <p className="text-xs text-gray-500 leading-relaxed font-semibold">
                    مدرس تخصص: <span className="text-pink-600">{selectedTeacher.subject}</span> | الكادر الأكاديمي {selectedTeacher.contractType}
                  </p>
                </div>
              </div>
              
              {/* Star badge */}
              <div className="bg-[#E91E63]/10 px-4 py-1.5 rounded-xl border border-primary-light/40 flex items-center gap-1.5">
                <Star className="w-4 h-4 text-[#E91E63] fill-current" />
                <span className="text-xs font-bold text-[#E91E63]">الدرجة التقييمية: {selectedTeacher.rating} / 5.0</span>
              </div>
            </div>

            {/* Layout Split: 1) Schedule, 2) Salary, 3) Evaluations */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Right Side: Weekly Timetable (8 columns) */}
              <div className="lg:col-span-8 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-md font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                    <Clock className="w-5 h-5 text-pink-600" />
                    جدول الحصص والتواجد الأسبوعي
                  </h3>
                  <span className="text-[10px] text-gray-400">الفترات: 1 (08:00) إلى 5 (12:30)</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-right border border-gray-100 dark:border-gray-800">
                    <thead className="bg-pink-50/50 dark:bg-pink-950/20 text-[#E91E63] font-bold">
                      <tr>
                        <th className="p-2.5 border border-pink-100/20 dark:border-gray-800">اليوم</th>
                        <th className="p-2.5 border border-pink-100/20 dark:border-gray-800">الحصة 1</th>
                        <th className="p-2.5 border border-pink-100/20 dark:border-gray-800">الحصة 2</th>
                        <th className="p-2.5 border border-pink-100/20 dark:border-gray-800">الحصة 3</th>
                        <th className="p-2.5 border border-pink-100/20 dark:border-gray-800">الحصة 4</th>
                        <th className="p-2.5 border border-pink-100/20 dark:border-gray-800">الحصة 5</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                      {["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس"].map((day) => {
                        const periods = selectedTeacher.schedule[day] || [];
                        return (
                          <tr key={day} className="hover:bg-gray-50/40 dark:hover:bg-black/10">
                            <td className="p-2.5 font-bold border border-gray-100 dark:border-gray-840 text-gray-600 dark:text-gray-300 bg-pink-50/10">
                              {day}
                            </td>
                            {[1, 2, 3, 4, 5].map((pNum) => {
                              const match = periods.find(p => p.period === pNum);
                              return (
                                <td key={pNum} className="p-2.5 border border-gray-100 dark:border-gray-800">
                                  {match ? (
                                    <div className="bg-pink-100/50 dark:bg-pink-950/30 border border-[#E91E63]/20 p-1.5 rounded-lg space-y-0.5 text-center">
                                      <p className="font-extrabold text-[#E91E63]">{match.className}</p>
                                      <p className="text-[10px] text-gray-500">{match.subject}</p>
                                    </div>
                                  ) : (
                                    <span className="text-gray-300 block text-center">-</span>
                                  )}
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Supervisor review evaluations */}
                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300">سجل التقييمات والأداء التربوي</h4>
                  <div className="space-y-2">
                    {selectedTeacher.evaluations.map((evalMsg, i) => (
                      <div key={i} className="bg-gray-50 dark:bg-black/20 p-3 rounded-xl border-r-2 border-[#E91E63] text-xs">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-bold text-gray-700 dark:text-gray-300">{evalMsg.reviewer}</span>
                          <span className="text-gray-400 font-mono text-[10px]">{evalMsg.date}</span>
                        </div>
                        <p className="text-gray-500 italic">" {evalMsg.comment} "</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Left Side: Finance & Actions (4 columns) */}
              <div className="lg:col-span-4 space-y-4 bg-gray-50/50 dark:bg-black/10 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 text-xs">
                <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1.5 border-b pb-2">
                  <DollarSign className="w-5 h-5 text-emerald-600" />
                  المستحقات وصرف الحوافز
                </h3>

                <div className="space-y-2.5">
                  <div className="flex justify-between">
                    <span className="font-bold text-gray-500">الراتب الأساسي:</span>
                    <span className="font-extrabold text-gary-800 dark:text-white">{selectedTeacher.salary.toLocaleString()} ₪</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold text-gray-500">الحوافز الحالية:</span>
                    <span className="font-extrabold text-green-600">+{selectedTeacher.bonus.toLocaleString()} ₪</span>
                  </div>
                  <div className="flex justify-between border-t pt-2 border-dashed">
                    <span className="font-black text-gray-800 dark:text-white">إجمالي المستحق هذا الشهر:</span>
                    <span className="font-black text-[#E91E63] text-sm">{(selectedTeacher.salary + selectedTeacher.bonus).toLocaleString()} ₪</span>
                  </div>
                </div>

                {/* Add dynamic bonus helper form */}
                <div className="space-y-2 pt-3 border-t">
                  <label className="font-bold text-gray-700 dark:text-gray-300 block">إضافة مكافأة / حافز نقدي جديد</label>
                  <div className="flex gap-1.5">
                    <input
                      type="number"
                      placeholder="شيكل"
                      value={bonusInput}
                      onChange={(e) => setBonusInput(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-gray-200 rounded-xl text-xs"
                      id="input-teacher-bonus"
                    />
                    <button
                      onClick={() => handleBonusSubmit(selectedTeacher.id)}
                      className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-3 py-1.5 rounded-xl cursor-pointer"
                    >
                      صرف
                    </button>
                  </div>
                  <p className="text-[10px] text-gray-400">تُضاف هذه الحوافز مباشرة إلى كشف الرواتب والميزانية العامة.</p>
                </div>

                {/* Teacher specific quick communication links */}
                <div className="space-y-2 pt-4">
                  <h4 className="font-bold text-gray-700 dark:text-gray-200">اتصل بالمعلم</h4>
                  <div className="flex flex-col gap-1.5 font-mono text-[11px] text-[#E91E63]">
                    <a href={`mailto:${selectedTeacher.email}`} className="flex items-center gap-1.5 hover:underline">
                      <Mail className="w-3.5 h-3.5" />
                      {selectedTeacher.email}
                    </a>
                    <a href={`tel:${selectedTeacher.phone}`} className="flex items-center gap-1.5 hover:underline text-gray-600 dark:text-gray-300">
                      <Phone className="w-3.5 h-3.5 text-pink-600" />
                      {selectedTeacher.phone}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t text-sm">
              <button
                type="button"
                onClick={() => setSelectedTeacher(null)}
                className="px-5 py-2 bg-gray-800 text-white font-bold rounded-xl cursor-pointer hover:bg-gray-900"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Model 2: Add Teacher Profile Form modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-school-card-dark rounded-3xl p-6 max-w-lg w-full soft-shadow relative text-right space-y-4">
            <h2 className="text-lg font-black text-[#E91E63] border-b pb-2">تسجيل وتأهيل معلم جديد بالمدرسة</h2>
            
            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-gray-700">الاسم الثلاثي للمعلم *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="مثال: أ. رائد عبد الرحمن الحربي"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs bg-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-0.5">
                  <label className="font-bold text-gray-700">التخصص / المادة الدراسية</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-transparent text-xs"
                  >
                    {["الرياضيات", "العلوم", "اللغة العربية", "اللغة الإنجليزية", "التربية الإسلامية"].map(sub => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-0.5">
                  <label className="font-bold text-gray-700">نوع التعاقد</label>
                  <select
                    value={contractType}
                    onChange={(e) => setContractType(e.target.value as 'دائم' | 'عقد مؤقت')}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-transparent text-xs"
                  >
                    <option value="دائم">دائم / رسمي</option>
                    <option value="عقد مؤقت">عقد مؤقت / بالساعات</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-700">الراتب الشهري الأساسي (شيكل جديد) *</label>
                <input
                  type="number"
                  required
                  value={salary}
                  onChange={(e) => setSalary(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs bg-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1 bg-transparent">
                  <label className="font-bold text-gray-700">رقم الهاتف *</label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+966 5..."
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">البريد الإلكتروني للأعمال</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@habiba.edu"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-gray-200 rounded-xl cursor-pointer"
                >
                  إلغاء التراجع
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#E91E63] text-white font-bold rounded-xl cursor-pointer"
                >
                  تأهيل وتعيين المدرس
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
