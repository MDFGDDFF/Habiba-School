/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Search,
  Plus,
  Filter,
  Users,
  GraduationCap,
  Download,
  Award,
  Trash2,
  CheckCircle,
  FileText,
  UserCog,
  QrCode,
  Upload,
  FileSpreadsheet
} from 'lucide-react';
import { Student } from '../types';
import { initialClasses } from '../data/mockData';
import {
  exportStudentsToExcel,
  downloadStudentTemplate,
  parseExcelFile,
  mapExcelToStudents
} from '../utils/excelHelper';

interface StudentsModuleProps {
  students: Student[];
  onAddStudent: (student: Omit<Student, 'id' | 'qrCode'>) => void;
  onDeleteStudent: (id: string) => void;
  onUpdateScore: (id: string, newScore: number) => void;
  onUpdateStudent?: (student: Student) => void;
  onImportStudents?: (students: Omit<Student, 'id' | 'qrCode'>[]) => void;
}

export const StudentsModule: React.FC<StudentsModuleProps> = ({
  students,
  onAddStudent,
  onDeleteStudent,
  onUpdateScore,
  onUpdateStudent,
  onImportStudents
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('الكل');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // Edit Student Form State
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editClassId, setEditClassId] = useState('');
  const [editParentName, setEditParentName] = useState('');
  const [editParentPhone, setEditParentPhone] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editNationalId, setEditNationalId] = useState('');
  const [editBloodType, setEditBloodType] = useState('');
  const [editGrades, setEditGrades] = useState<{ [subject: string]: number }>({});
  const [editGender, setEditGender] = useState<'ذكر' | 'أنثى'>('ذكر');

  const startEditingStudent = (stu: Student) => {
    setEditName(stu.name);
    setEditClassId(stu.classId);
    setEditParentName(stu.parentName);
    setEditParentPhone(stu.parentPhone);
    setEditEmail(stu.email);
    setEditNationalId(stu.nationalId);
    setEditBloodType(stu.bloodType);
    setEditGrades({ ...stu.grades });
    setEditGender(stu.gender || 'ذكر');
    setIsEditing(true);
  };

  const saveStudentEdits = () => {
    if (!selectedStudent || !editName) return;
    const updated: Student = {
      ...selectedStudent,
      name: editName,
      classId: editClassId,
      parentName: editParentName,
      parentPhone: editParentPhone,
      email: editEmail,
      nationalId: editNationalId,
      bloodType: editBloodType,
      grades: editGrades,
      gender: editGender
    };
    onUpdateStudent?.(updated);
    setSelectedStudent(updated);
    setIsEditing(false);
  };

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
      const mapped = mapExcelToStudents(rows);
      if (onImportStudents) {
        onImportStudents(mapped);
        setImportStatus({ success: true, msg: `تم استيراد عدد (${mapped.length}) طالب وطالبة بنجاح وطرح وثائق قيدهم!` });
      } else {
        setImportStatus({ success: false, msg: 'الرجاء المحاولة مجدداً.' });
      }
    } catch (err: any) {
      setImportStatus({ success: false, msg: `فشل التحليل: ${err?.message || 'تأكد من مطابقة أعمدة ومصطلحات النموذج.'}` });
    }
  };

  // Form states
  const [newName, setNewName] = useState('');
  const [newParentName, setNewParentName] = useState('');
  const [newParentPhone, setNewParentPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newClassId, setNewClassId] = useState('7-A');
  const [newNationalId, setNewNationalId] = useState('');
  const [newBloodType, setNewBloodType] = useState('+O');
  const [newBirthDate, setNewBirthDate] = useState('2013-01-01');
  const [newFeesTotal, setNewFeesTotal] = useState(0);
  const [newFeesPaid, setNewFeesPaid] = useState(0);
  const [newNotes, setNewNotes] = useState('');
  const [newGender, setNewGender] = useState<'ذكر' | 'أنثى'>('ذكر');

  // Search and filter logic
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.includes(searchTerm) || 
                          student.parentName.includes(searchTerm) || 
                          student.id.includes(searchTerm);
    
    if (selectedClass === 'الكل') return matchesSearch;
    if (selectedClass === 'خريج') return student.status === 'خريج' && matchesSearch;
    return student.classId === selectedClass && student.status === 'نشط' && matchesSearch;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newParentPhone) return;
    
    onAddStudent({
      name: newName,
      avatar: newGender === 'ذكر'
        ? "https://images.unsplash.com/photo-1544717305-2782549b5136?w=150"
        : "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150",
      classId: newClassId,
      parentName: newParentName,
      parentPhone: newParentPhone,
      email: newEmail || `${newName.split(' ')[0]}@habiba.edu`,
      joiningDate: new Date().toISOString().split('T')[0],
      grades: { "الرياضيات": 90, "العلوم": 90, "اللغة العربية": 90 },
      attendanceRate: 100,
      feesTotal: Number(newFeesTotal),
      feesPaid: Number(newFeesPaid),
      behaviorScore: 100,
      status: 'نشط',
      nationalId: newNationalId,
      bloodType: newBloodType,
      birthDate: newBirthDate,
      notes: newNotes,
      gender: newGender
    });

    // Reset fields
    setNewName('');
    setNewParentName('');
    setNewParentPhone('');
    setNewEmail('');
    setNewNotes('');
    setNewGender('ذكر');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6" id="students-module-container">
      {/* Title & Stats */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-800 dark:text-white inline-flex items-center gap-2">
            <Users className="w-7 h-7 text-[#E91E63]" />
            شؤون إدارة الطلاب والتسجيل
          </h1>
          <p className="text-xs text-gray-500 mt-1">تسجيل وتعديل بيانات الطلاب، مع متابعة تقارير السلوك وبطاقات الهوية والأفواج الدراسية</p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={() => setShowExcelSection(!showExcelSection)}
            className={`px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 text-sm transition cursor-pointer border ${
              showExcelSection 
                ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 border-emerald-200 dark:border-emerald-800' 
                : 'bg-white dark:bg-school-card-dark text-gray-700 dark:text-gray-300 border-gray-150 dark:border-gray-800 hover:border-[#E91E63]/30 hover:text-[#E91E63]'
            }`}
            id="btn-toggle-excel-students"
          >
            <FileSpreadsheet className="w-5 h-5 text-emerald-500" />
            عمليات إكسل Excel
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="glow-btn bg-[#E91E63] text-white select-none px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 text-sm transition cursor-pointer"
            id="btn-trigger-add-student"
          >
            <Plus className="w-4 h-4" />
            تسجيل طالب جديد
          </button>
        </div>
      </div>

      {/* Excel Section Block */}
      {showExcelSection && (
        <div className="bg-white dark:bg-school-card-dark border border-dashed border-emerald-200 dark:border-emerald-950/40 p-5 rounded-2xl space-y-4 shadow-sm animate-fade-in" id="excel-students-section">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3 border-b pb-3 border-gray-100 dark:border-gray-800/45">
            <div>
              <h3 className="text-sm font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5" />
                لوحة أدوات ومكاملة إكسل المتقدمة (Excel Workspace)
              </h3>
              <p className="text-[11px] text-gray-400 mt-0.5">يمكنك تصدير وتنزيل كافة بيانات الطلاب الحالية، أو سحب وإفلات ملف Excel/CSV للاستيراد الفوري والدفعة الكبرى</p>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <button
                onClick={downloadStudentTemplate}
                className="p-2 px-3.5 bg-gray-50 hover:bg-gray-100 dark:bg-black/10 dark:hover:bg-black/20 text-[11px] font-bold rounded-xl text-gray-650 dark:text-gray-350 flex items-center gap-1.5 transition border cursor-pointer border-gray-100 dark:border-gray-800"
              >
                <Download className="w-3.5 h-3.5 text-blue-500" />
                تحميل نموذج الاستيراد (.xlsx)
              </button>

              <button
                onClick={() => exportStudentsToExcel(students)}
                className="p-2 px-3.5 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/10 dark:hover:bg-emerald-950/20 text-[11px] font-bold rounded-xl text-emerald-650 dark:text-emerald-400 flex items-center gap-1.5 transition border cursor-pointer border-emerald-100 dark:border-emerald-900/30"
              >
                <Download className="w-3.5 h-3.5 text-emerald-500" />
                تصدير كافة الطلاب إلى إكسل
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
              id="student-excel-file"
              className="hidden"
              accept=".xlsx, .xls, .csv"
              onChange={handleFileSelect}
            />
            
            <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-950/20 rounded-full flex items-center justify-center text-emerald-500 mb-1">
              <Upload className="w-6 h-6 animate-bounce" />
            </div>

            <label htmlFor="student-excel-file" className="cursor-pointer">
              <p className="text-xs font-black text-gray-700 dark:text-gray-250">
                اسحب وأفلت ملف سجل الطلاب هنا، أو <span className="text-[#E91E63] underline hover:text-pink-600">انقر للتصفح والرفع</span>
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

      {/* Control bar (Search + Filter Selectors) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search Input */}
        <div className="md:col-span-2 relative">
          <input
            type="text"
            placeholder="ابحث عن اسم الطالب، رقم القيد، أو ولي الأمر..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-4 pr-11 py-2.5 rounded-xl bg-white dark:bg-school-card-dark border border-gray-100 dark:border-gray-800 text-sm focus:outline-none focus:border-[#E91E63] transition"
            id="input-student-search"
          />
          <Search className="w-5 h-5 text-gray-400 absolute right-4 top-3" />
        </div>

        {/* Dynamic Class Filter Select */}
        <div className="relative">
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-school-card-dark border border-gray-100 dark:border-gray-800 text-sm focus:outline-none focus:border-[#E91E63] appearance-none"
            id="select-class-filter"
          >
            <option value="الكل">جميع الأفواج والصفوف</option>
            {initialClasses.map(cl => (
              <option key={cl.id} value={cl.id}>{cl.name}</option>
            ))}
            <option value="خريج">الخريجون والأرشيف القديم</option>
          </select>
          <Filter className="w-4 h-4 text-[#E91E63] absolute left-4 top-3.5 pointer-events-none" />
        </div>

        {/* Counter Widget */}
        <div className="bg-pink-50 dark:bg-pink-950/20 p-2.5 rounded-xl border border-pink-100 dark:border-pink-900/40 text-center flex items-center justify-center gap-2">
          <span className="text-xs font-bold text-gray-500">عدد النتائج المصفاة:</span>
          <span className="text-sm font-black text-[#E91E63]" id="text-students-count">
            {filteredStudents.length} طلاب
          </span>
        </div>
      </div>

      {/* Grid of Student Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStudents.map((stu) => (
          <div
            key={stu.id}
            className="glass-panel rounded-2xl p-5 soft-shadow border border-[#E91E63]/5 hover:border-[#E91E63]/30 transition group duration-300 relative overflow-hidden"
          >
            {/* Status badge */}
            <span className={`absolute left-4 top-4 text-[11px] font-bold px-2 py-0.5 rounded-full ${
              stu.status === 'نشط' ? 'bg-green-50 text-green-600 dark:bg-green-950/20' : 'bg-gray-100 text-gray-600 dark:bg-gray-800'
            }`}>
              {stu.status}
            </span>

            {/* Profile information */}
            <div className="flex gap-4 items-center">
              <img
                src={stu.avatar}
                alt={stu.name}
                className="w-14 h-14 rounded-full object-cover border-2 border-pink-200"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <p className="text-xs font-mono font-bold text-[#E91E63]">{stu.id}</p>
                  {stu.gender && (
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      stu.gender === 'ذكر' ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/20' : 'bg-pink-50 text-pink-500 dark:bg-pink-950/20'
                    }`}>
                      {stu.gender}
                    </span>
                  )}
                </div>
                <h3 className="text-md font-bold text-gray-800 dark:text-white group-hover:text-[#E91E63] transition">
                  {stu.name}
                </h3>
                <p className="text-xs text-gray-500">الصف {stu.classId === 'خريج' ? 'الخريجين' : stu.classId}</p>
              </div>
            </div>

            {/* Micro KPI lists */}
            <div className="grid grid-cols-3 gap-2 py-4 my-4 border-y border-gray-100 dark:border-gray-800 text-center text-xs">
              <div>
                <span className="text-gray-400 block mb-1">الحضور</span>
                <span className="font-extrabold text-teal-600">{stu.attendanceRate}%</span>
              </div>
              <div>
                <span className="text-gray-400 block mb-1">السلوك</span>
                <span className="font-extrabold text-indigo-600">{stu.behaviorScore}/100</span>
              </div>
              <div>
                <span className="text-gray-400 block mb-1">الرسوم</span>
                <span className="font-extrabold text-green-600">مجاني بالكامل</span>
              </div>
            </div>

            {/* Parent Info */}
            <div className="space-y-1 text-xs text-gray-500 dark:text-gray-400 pb-3">
              <p>
                <span className="ml-1 font-semibold">ولي الأمر:</span> {stu.parentName}
              </p>
              <p>
                <span className="ml-1 font-semibold">الهاتف:</span> {stu.parentPhone}
              </p>
            </div>

            {/* Actions for detailed modal */}
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedStudent(stu)}
                className="flex-1 text-center bg-pink-50 hover:bg-[#E91E63] hover:text-white transition duration-200 text-[#E91E63] font-bold py-2 rounded-xl text-xs cursor-pointer inline-flex items-center justify-center gap-1.5"
                id={`btn-view-card-${stu.id}`}
              >
                <UserCog className="w-3.5 h-3.5" />
                البطاقة الذكية والدرجات
              </button>
              <button
                onClick={() => onDeleteStudent(stu.id)}
                className="bg-red-50 hover:bg-red-500 hover:text-white text-red-500 transition p-2 rounded-xl cursor-pointer"
                title="إلغاء قيد هذا الطالب من شؤون المدرسة"
                id={`btn-delete-${stu.id}`}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Model 1: Create Student Profile Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-school-card-dark rounded-3xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-4 soft-shadow relative text-right">
            <h2 className="text-xl font-black text-[#E91E63] border-b pb-3 border-gray-100 dark:border-gray-800">
              تسجيل ملف طالب دراسي جديد
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-gray-700 dark:text-gray-300 block">اسم الطالب كاملاً *</label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="مثال: ريان حسن الأحمد"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-700 dark:text-gray-300 block">رقم الهوية الوطنية أو الإقامة *</label>
                  <input
                    type="text"
                    required
                    value={newNationalId}
                    onChange={(e) => setNewNationalId(e.target.value)}
                    placeholder="10 خانات تبدأ بـ 1 أو 2"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-700 dark:text-gray-300 block">رقم هاتف ولي الأمر للتذكير بـ SMS *</label>
                  <input
                    type="text"
                    required
                    value={newParentPhone}
                    onChange={(e) => setNewParentPhone(e.target.value)}
                    placeholder="مثال: +966 50 123 4567"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-700 dark:text-gray-300 block">اسم ولي أمر الطالب بالكامل *</label>
                  <input
                    type="text"
                    required
                    value={newParentName}
                    onChange={(e) => setNewParentName(e.target.value)}
                    placeholder="مثال: حسن علي الأحمد"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-700 dark:text-gray-300 block">البريد الإلكتروني الأكاديمي</label>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="اختياري - يولد تلقائياً"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700 dark:text-gray-300 block">الفصل والحجرة</label>
                    <select
                      value={newClassId}
                      onChange={(e) => setNewClassId(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent"
                    >
                      {initialClasses.map(cl => (
                        <option key={cl.id} value={cl.id}>{cl.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700 dark:text-gray-300 block">فصيلة الدم</label>
                    <select
                      value={newBloodType}
                      onChange={(e) => setNewBloodType(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent"
                    >
                      {['+O', '-O', '+A', '-A', '+B', '-B', '+AB', '-AB'].map(blood => (
                        <option key={blood} value={blood}>{blood}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700 dark:text-gray-300 block">تاريخ الميلاد *</label>
                    <input
                      type="date"
                      required
                      value={newBirthDate}
                      onChange={(e) => setNewBirthDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700 dark:text-gray-300 block">جنس الطالب (النوع) *</label>
                    <select
                      value={newGender}
                      onChange={(e) => setNewGender(e.target.value as 'ذكر' | 'أنثى')}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent bg-white dark:bg-school-card-dark text-gray-800 dark:text-white"
                    >
                      <option value="ذكر" className="text-gray-850">ذكر (Male)</option>
                      <option value="أنثى" className="text-gray-850">أنثى (Female)</option>
                    </select>
                  </div>
                </div>

                <div className="p-3.5 bg-green-50 dark:bg-green-950/20 text-green-600 rounded-xl text-xs font-bold leading-relaxed border border-green-100 dark:border-green-900/35">
                  ✓ تنبيه: مدرسة حبيبة مدرسة نموذجية مجانية بالكامل. لا يترتب على تسجيل الطلاب أي رسوم دراسية أو ماليّة.
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-700 dark:text-gray-300 block">ملاحظات ووثائق هامة للملف المالي أو السلوكي</label>
                <textarea
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="ملاحظات الحساسية الطبية أو منح الخصم من الشركاء أو التفوق الدراسي..."
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent h-20"
                />
              </div>

              {/* simulated document uploader */}
              <div className="border border-dashed border-pink-300 bg-pink-50/20 dark:bg-pink-950/5 p-4 rounded-2xl flex flex-col items-center justify-center text-center gap-1">
                <p className="font-bold text-gray-700 dark:text-gray-300">وثائق تسجيل الهوية المرفوعة (سجل العائلة، شهادة الميلاد)</p>
                <p className="text-[10px] text-gray-400">اسحب مستند التسجيل أو انقر لإرفاقه فوراً بالملف السحابي</p>
                <span className="text-[10px] bg-pink-100 text-[#E91E63] font-bold px-2 py-0.5 rounded cursor-pointer mt-1">تجهيز OCR</span>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-gray-100 dark:border-gray-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-gray-200 rounded-xl cursor-pointer"
                >
                  إلغاء التراجع
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#E91E63] text-white font-bold rounded-xl cursor-pointer hover:bg-pink-600 transition"
                >
                  حفظ وتسجيل الطالب
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Model 2: Student Profile Detail Overlay Cards & ID Badge Generator */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-school-card-dark rounded-3xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-6 soft-shadow relative text-right">
            <button
              onClick={() => {
                setSelectedStudent(null);
                setIsEditing(false);
              }}
              className="absolute left-4 top-4 bg-gray-100 dark:bg-gray-850 p-1.5 rounded-full text-gray-400 hover:text-gray-600"
            >
              x
            </button>
            
            <div className="border-b pb-4 border-gray-100 dark:border-gray-800 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-black text-gray-800 dark:text-white">
                  {isEditing ? "تعديل تفاصيل ملف الطالب كاملة" : "ملف التحصيل الدراسي والهوية الرقمية"}
                </h2>
                <p className="text-xs text-gray-400 font-mono">طالب: {selectedStudent.name} ({selectedStudent.id})</p>
              </div>
              <span className="text-xs font-semibold px-2 py-1 bg-pink-100 text-[#E91E63] rounded-full inline-flex items-center gap-1">
                <Award className="w-3.5 h-3.5" />
                ملف معتمد
              </span>
            </div>

            {isEditing ? (
              <div className="space-y-4 text-xs text-right">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name field */}
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700 dark:text-gray-300">اسم الطالب الثنائي/الرباعي *</label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded-xl bg-transparent font-bold text-gray-800 dark:text-white"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                    />
                  </div>

                  {/* Class selection */}
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700 dark:text-gray-300">الفصل والقسم الدراسي</label>
                    <select
                      className="w-full p-2 border rounded-xl bg-white dark:bg-slate-900 font-bold"
                      value={editClassId}
                      onChange={(e) => setEditClassId(e.target.value)}
                    >
                      <option value="9-A">الصف التاسع (9-A)</option>
                      <option value="8-A">الصف الثامن (8-A)</option>
                      <option value="7-A">الصف السابع (7-A)</option>
                      <option value="6-A">الصف السادس (6-A)</option>
                      <option value="5-A">الصف الخامس (5-A)</option>
                    </select>
                  </div>

                  {/* Parent name */}
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700 dark:text-gray-300">اسم ولي الأمر والقرابة</label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded-xl bg-transparent"
                      value={editParentName}
                      onChange={(e) => setEditParentName(e.target.value)}
                    />
                  </div>

                  {/* Parent phone */}
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700 dark:text-gray-300">جوال ولي الأمر للتنبيهات والشكاوى</label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded-xl bg-transparent text-left font-mono"
                      value={editParentPhone}
                      onChange={(e) => setEditParentPhone(e.target.value)}
                    />
                  </div>

                  {/* Email address */}
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700 dark:text-gray-300">بريد التواصل والمراسلات</label>
                    <input
                      type="email"
                      className="w-full p-2 border rounded-xl bg-transparent text-left font-mono"
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                    />
                  </div>

                  {/* National ID */}
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700 dark:text-gray-300">رقم الهوية الوطنية / الإقامة</label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded-xl bg-transparent text-left font-mono"
                      value={editNationalId}
                      onChange={(e) => setEditNationalId(e.target.value)}
                    />
                  </div>

                  {/* Blood Type */}
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700 dark:text-gray-300">فصيلة دم الطالب (لكشوفات الطوارئ)</label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded-xl bg-transparent"
                      value={editBloodType}
                      onChange={(e) => setEditBloodType(e.target.value)}
                    />
                  </div>

                  {/* Gender */}
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700 dark:text-gray-300">الجنس</label>
                    <select
                      className="w-full p-2 border rounded-xl bg-white dark:bg-slate-900"
                      value={editGender}
                      onChange={(e) => setEditGender(e.target.value as any)}
                    >
                      <option value="ذكر">ذكر</option>
                      <option value="أنثى">أنثى</option>
                    </select>
                  </div>
                </div>

                {/* Grade editing block */}
                <div className="bg-gray-50 dark:bg-slate-900/40 p-4 rounded-2xl space-y-3 border border-pink-100/20">
                  <h4 className="font-black text-[#E91E63]">تعديل كشوفات درجات المواد الدراسية (%)</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {Object.keys(editGrades).map((subject) => (
                      <div key={subject} className="space-y-1">
                        <label className="font-bold text-gray-600 block">{subject}</label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          className="w-full p-1.5 border rounded-lg bg-transparent font-mono text-center font-bold"
                          value={editGrades[subject]}
                          onChange={(e) => setEditGrades({
                            ...editGrades,
                            [subject]: Number(e.target.value)
                          })}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t flex gap-2">
                  <button
                    type="button"
                    onClick={saveStudentEdits}
                    className="flex-1 py-2.5 bg-gradient-to-r from-[#E91E63] to-pink-500 text-white text-xs font-black rounded-xl hover:-translate-y-0.5 transition cursor-pointer"
                  >
                    💾 حفظ وتثبيت التعديلات بالملف
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-5 py-2.5 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 font-bold rounded-xl"
                  >
                    إلغاء التعديل
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* ID electronic Student Badge card in premium layout */}
                  <div className="border border-pink-100 dark:border-pink-900 bg-gradient-to-br from-white via-pink-50/20 to-pink-100/10 dark:from-school-card-dark dark:to-pink-950/10 p-5 rounded-2xl relative overflow-hidden soft-shadow text-center space-y-4">
                    <div className="absolute right-0 top-0 w-24 h-24 bg-[#E91E63]/5 rounded-bl-[100px]" />
                    <div className="flex justify-between items-center text-xs text-[#E91E63] font-bold mb-2">
                      <span>مدرسة حبيبة التعليمية الدولية</span>
                      <span className="text-[10px] bg-[#E91E63]/10 px-1 py-0.5 rounded">بطاقة طالب ذكية</span>
                    </div>

                    <div className="space-y-2">
                      <img
                        src={selectedStudent.avatar}
                        alt={selectedStudent.name}
                        className="w-20 h-20 rounded-full mx-auto object-cover border-4 border-[#E91E63] shadow"
                      />
                      <div>
                        <h4 className="text-md font-bold text-gray-800 dark:text-white">{selectedStudent.name}</h4>
                        <p className="text-xs text-gray-500">الفصل الدراسي: {selectedStudent.classId}</p>
                      </div>
                    </div>

                    {/* Laser Barcode generator representation */}
                    <div className="bg-white dark:bg-black/40 p-3 rounded-xl border border-pink-50 dark:border-pink-900/10 inline-flex flex-col items-center gap-1 w-full scale-95">
                      <div className="flex gap-[2px] h-10 items-stretch bg-gray-900 p-1 w-full">
                        {/* Repeating barcode vertical lines in SVG style layout */}
                        {[1, 4, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3, 4, 1, 2, 3, 2, 4, 1, 2, 1, 4, 3, 1, 2, 4, 3, 2].map((w, index) => (
                          <div key={index} className="bg-white" style={{ flexGrow: w }} />
                        ))}
                      </div>
                      <span className="text-[9px] font-mono tracking-widest text-gray-500 font-bold">{selectedStudent.qrCode}</span>
                    </div>

                    <div className="grid grid-cols-2 text-right text-[11px] text-gray-500 dark:text-gray-400 gap-y-1">
                      <p><span className="font-semibold">جنس الطالب:</span> {selectedStudent.gender || "غير محدد"}</p>
                      <p><span className="font-semibold">فصيلة الدم:</span> {selectedStudent.bloodType}</p>
                      <p className="col-span-2"><span className="font-semibold">تاريخ الانتساب:</span> {selectedStudent.joiningDate}</p>
                      <p className="col-span-2 text-center text-[10px] text-gray-400 mt-2 font-semibold">بصمة الهوية مدمجة بنظام QR ومتابعة النقل</p>
                    </div>
                  </div>

                  {/* Academic Grades Record */}
                  <div className="space-y-4">
                    <div className="bg-gray-50 dark:bg-black/30 p-4 rounded-2xl relative">
                      <h4 className="font-bold text-xs text-[#E91E63] uppercase border-b border-gray-200 dark:border-gray-800 pb-2 mb-3">
                        كشف تقييم الدرجات الأكاديمية
                      </h4>
                      <div className="space-y-2.5">
                        {Object.entries(selectedStudent.grades).map(([subject, val]) => (
                          <div key={subject} className="flex justify-between items-center text-xs">
                            <span className="font-semibold text-gray-700 dark:text-gray-300">{subject}</span>
                            <div className="flex items-center gap-2">
                              <div className="w-24 bg-gray-200 dark:bg-gray-800 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-[#E91E63] h-full" style={{ width: `${val}%` }} />
                              </div>
                              <span className="font-bold text-gray-800 dark:text-white font-mono">{val}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Behavioral management panel */}
                    <div className="bg-gray-50 dark:bg-black/30 p-4 rounded-2xl space-y-3">
                      <div className="flex justify-between items-center">
                        <h4 className="font-bold text-xs text-[#E91E63] uppercase">تقييم الانضباط والسلوك</h4>
                        <span className="text-xs font-black text-indigo-600 font-mono">{selectedStudent.behaviorScore}/100</span>
                      </div>
                      <input
                        type="range"
                        min="60"
                        max="100"
                        value={selectedStudent.behaviorScore}
                        onChange={(e) => onUpdateScore(selectedStudent.id, Number(e.target.value))}
                        className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#E91E63]"
                        id={`input-grade-slider-${selectedStudent.id}`}
                      />
                      <p className="text-[10px] text-gray-400 leading-relaxed">
                        من خلال تحريك شريط السلوك يتم تعديل تقييم الطالب فورا في لوحة ولي الأمر، ويتم تحديث مؤشر الحوافز الأسبوعي.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap justify-between items-center pt-3 border-t border-gray-100 dark:border-gray-800 gap-2">
                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => startEditingStudent(selectedStudent)}
                      className="px-4 py-2 bg-pink-100 hover:bg-pink-200 text-[#E91E63] font-bold text-xs rounded-xl cursor-pointer"
                    >
                      ✍️ تعديل كامل بيانات الطالب
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onDeleteStudent(selectedStudent.id);
                        setSelectedStudent(null);
                      }}
                      className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-650 text-xs font-bold rounded-xl cursor-pointer"
                    >
                      🗑️ شطب القيد
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        window.print();
                      }}
                      className="px-4 py-2 border border-[#E91E63]/20 hover:border-[#E91E63] text-xs text-[#E91E63] font-bold rounded-xl cursor-pointer flex items-center gap-1 bg-[#E91E63]/5 hover:bg-pink-100"
                    >
                      <Download className="w-3.5 h-3.5" />
                      تصدير وطباعة بطاقة الهوية
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedStudent(null)}
                      className="px-5 py-2 bg-gray-800 hover:bg-gray-900 text-white font-bold text-xs rounded-xl cursor-pointer"
                    >
                      إغلاق النافذة
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
