/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  NotebookTabs,
  Award,
  Plus,
  Tv,
  Printer,
  CalendarCheck,
  CheckCircle,
  HelpCircle,
  Clock,
  ChevronLeft,
  GraduationCap,
  Edit,
  Trash2,
  Settings
} from 'lucide-react';
import { SchoolExam } from '../types';
import { initialExams } from '../data/mockData';

interface AcademicsModuleProps {
  exams: SchoolExam[];
  onAddExam: (exam: SchoolExam) => void;
  studentsList: { id: string; name: string }[];
  onUpdateExam?: (exam: SchoolExam) => void;
  onDeleteExam?: (examId: string) => void;
}

export const AcademicsModule: React.FC<AcademicsModuleProps> = ({
  exams,
  onAddExam,
  onUpdateExam,
  onDeleteExam,
  studentsList
}) => {
  const [activeTab, setActiveTab] = useState<'schedule' | 'exams' | 'certificates'>('schedule');

  // Certificate Generator State
  const [certRecipient, setCertRecipient] = useState(studentsList[0]?.name || 'سارة محمد الشريف');
  const [certSubject, setCertSubject] = useState('التفوق الأكاديمي والرياضي العام');
  const [certText, setCertText] = useState('لحصولها على المرتبة الأولى في مدرسة حبيبة التعليمية وتفوقها اللافت في تفعيل اللغة العربية والرياضيات بمعدل 99%.');
  const [showCertificateModal, setShowCertificateModal] = useState(false);

  // Quiz exam corrector helper (reactive query lookups)
  const [selectedQuizId, setSelectedQuizId] = useState<string>(exams[0]?.id || '');
  const selectedQuiz = exams.find(e => e.id === selectedQuizId) || exams[0] || null;
  const [studentAnswers, setStudentAnswers] = useState<{ [qId: string]: number }>({});
  const [correctedScore, setCorrectedScore] = useState<number | null>(null);

  // Modals for Adding / Editing Exams
  const [showAddExamModal, setShowAddExamModal] = useState(false);
  const [newExamTitle, setNewExamTitle] = useState('');
  const [newExamSubject, setNewExamSubject] = useState('');
  const [newExamClassId, setNewExamClassId] = useState('9-A');
  const [newExamDuration, setNewExamDuration] = useState(45);

  const [showEditExamModal, setShowEditExamModal] = useState(false);
  const [editExamTitle, setEditExamTitle] = useState('');
  const [editExamSubject, setEditExamSubject] = useState('');
  const [editExamClassId, setEditExamClassId] = useState('9-A');
  const [editExamDuration, setEditExamDuration] = useState(45);

  // Modal for Adding / Editing Question
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null); // null means adding a new question
  const [questionText, setQuestionText] = useState('');
  const [opt1, setOpt1] = useState('');
  const [opt2, setOpt2] = useState('');
  const [opt3, setOpt3] = useState('');
  const [opt4, setOpt4] = useState('');
  const [correctIndex, setCorrectIndex] = useState(0);
  const [questionPoints, setQuestionPoints] = useState(10);

  // Submit new exam
  const handleCreateExamSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExamTitle || !newExamSubject) return;
    const newExam: SchoolExam = {
      id: `EXM-${Math.floor(1000 + Math.random() * 9000)}`,
      title: newExamTitle,
      subject: newExamSubject,
      classId: newExamClassId,
      date: new Date().toISOString().split('T')[0],
      duration: Number(newExamDuration),
      questions: []
    };
    onAddExam(newExam);
    setSelectedQuizId(newExam.id);
    
    // reset
    setNewExamTitle('');
    setNewExamSubject('');
    setNewExamClassId('9-A');
    setNewExamDuration(45);
    setShowAddExamModal(false);
  };

  // Submit edit exam details
  const handleEditExamSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedQuiz || !editExamTitle || !editExamSubject) return;
    const updatedExam: SchoolExam = {
      ...selectedQuiz,
      title: editExamTitle,
      subject: editExamSubject,
      classId: editExamClassId,
      duration: Number(editExamDuration)
    };
    onUpdateExam?.(updatedExam);
    setShowEditExamModal(false);
  };

  // Open Edit Exam
  const handleOpenEditExam = () => {
    if (!selectedQuiz) return;
    setEditExamTitle(selectedQuiz.title);
    setEditExamSubject(selectedQuiz.subject);
    setEditExamClassId(selectedQuiz.classId || '9-A');
    setEditExamDuration(selectedQuiz.duration);
    setShowEditExamModal(true);
  };

  // Delete active exam
  const handleDeleteExamClick = () => {
    if (!selectedQuiz) return;
    if (confirm(`هل أنت متأكد من رغبتك في حذف هذا الاختبار بالكامل من اللوحة وبنك الأسئلة؟\n- اسم الاختبار: ${selectedQuiz.title}`)) {
      const deletedId = selectedQuiz.id;
      // Find the next available quiz
      const remaining = exams.filter(e => e.id !== deletedId);
      onDeleteExam?.(deletedId);
      if (remaining.length > 0) {
        setSelectedQuizId(remaining[0].id);
      } else {
        setSelectedQuizId('');
      }
      setStudentAnswers({});
      setCorrectedScore(null);
    }
  };

  // Open Add Question Modal
  const handleOpenAddQuestion = () => {
    setEditingQuestionId(null);
    setQuestionText('');
    setOpt1('');
    setOpt2('');
    setOpt3('');
    setOpt4('');
    setCorrectIndex(0);
    setQuestionPoints(10);
    setShowQuestionModal(true);
  };

  // Open Edit Question Modal
  const handleOpenEditQuestion = (q: { id: string; question: string; options: string[]; answerIndex: number; points: number }) => {
    setEditingQuestionId(q.id);
    setQuestionText(q.question);
    setOpt1(q.options[0] || '');
    setOpt2(q.options[1] || '');
    setOpt3(q.options[2] || '');
    setOpt4(q.options[3] || '');
    setCorrectIndex(q.answerIndex);
    setQuestionPoints(q.points);
    setShowQuestionModal(true);
  };

  // Save/Submit Question (Add or Edit)
  const handleSaveQuestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedQuiz || !questionText || !opt1 || !opt2) return;

    const optList: string[] = [opt1];
    if (opt2.trim()) optList.push(opt2.trim());
    if (opt3.trim()) optList.push(opt3.trim());
    if (opt4.trim()) optList.push(opt4.trim());

    let updatedQuestions = [...selectedQuiz.questions];

    if (editingQuestionId === null) {
      // Add new question
      const newQ = {
        id: `Q-${Date.now()}`,
        question: questionText,
        options: optList,
        answerIndex: correctIndex >= optList.length ? 0 : correctIndex,
        points: Number(questionPoints)
      };
      updatedQuestions.push(newQ);
    } else {
      // Edit existing
      updatedQuestions = updatedQuestions.map(q => q.id === editingQuestionId ? {
        ...q,
        question: questionText,
        options: optList,
        answerIndex: correctIndex >= optList.length ? 0 : correctIndex,
        points: Number(questionPoints)
      } : q);
    }

    const updatedExam = {
      ...selectedQuiz,
      questions: updatedQuestions
    };

    onUpdateExam?.(updatedExam);
    setShowQuestionModal(false);
    setStudentAnswers({});
    setCorrectedScore(null);
  };

  // Delete Question
  const handleDeleteQuestion = (qId: string) => {
    if (!selectedQuiz) return;
    if (confirm("هل أنت متأكد من حذف هذا السؤال من بنك أسئلة هذا الاختبار؟")) {
      const updatedExam = {
        ...selectedQuiz,
        questions: selectedQuiz.questions.filter(q => q.id !== qId)
      };
      onUpdateExam?.(updatedExam);
      setStudentAnswers({});
      setCorrectedScore(null);
    }
  };

  // Drag and drop timetable representation state
  const [scheduleGrid, setScheduleGrid] = useState<{ [day: string]: string[] }>({
    "الأحد": ["الرياضيات (7-A)", "العلوم (8-B)", "اللغة العربية (7-A)", "اللغة الإنجليزية (8-B)", "التوعية الإسلامية"],
    "الإثنين": ["العلوم (7-A)", "الرياضيات (8-B)", "العلوم (8-B)", "اللغة العربية (7-A)", "حصيرة حرة"],
    "الثلاثاء": ["اللغة العربية (8-B)", "الرياضيات (7-A)", "التربية الإسلامية", "العلوم (7-A)", "الرياضيات (8-B)"],
    "الأربعاء": ["الرياضيات (7-A)", "العلوم (8-B)", "الرياضيات (8-B)", "اللغة العربية (7-A)", "الرياضيات (7-A)"],
    "الخميس": ["اللغة الإنجليزية (7-A)", "العلوم (7-A)", "الرياضيات (8-B)", "اللغة العربية (8-B)", "مراجعة دورية"]
  });

  // Timetable scheduling states for Admin/Director editing
  const [editingDay, setEditingDay] = useState<string | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editSubjectName, setEditSubjectName] = useState<string>('');
  const [editClassName, setEditClassName] = useState<string>('9-A');

  const [addingDay, setAddingDay] = useState<string | null>(null);
  const [addSubjectName, setAddSubjectName] = useState<string>('الرياضيات');
  const [addClassName, setAddClassName] = useState<string>('9-A');

  const parseSlot = (str: string) => {
    const match = str.match(/(.+?)\s*\((.+?)\)/);
    if (match) {
      return { subject: match[1].trim(), className: match[2].trim() };
    }
    return { subject: str, className: '9-A' };
  };

  const handleOpenEditSlot = (day: string, idx: number) => {
    const originalText = scheduleGrid[day][idx];
    const parsed = parseSlot(originalText);
    setEditingDay(day);
    setEditingIndex(idx);
    setEditSubjectName(parsed.subject);
    setEditClassName(parsed.className);
  };

  const handleSaveEditSlot = () => {
    if (!editingDay || editingIndex === null) return;
    const updated = [...scheduleGrid[editingDay]];
    updated[editingIndex] = editClassName ? `${editSubjectName} (${editClassName})` : editSubjectName;
    setScheduleGrid({
      ...scheduleGrid,
      [editingDay]: updated
    });
    setEditingDay(null);
    setEditingIndex(null);
  };

  const handleDeleteSlot = (day: string, idx: number) => {
    const updated = scheduleGrid[day].filter((_, i) => i !== idx);
    setScheduleGrid({
      ...scheduleGrid,
      [day]: updated
    });
    setEditingDay(null);
    setEditingIndex(null);
  };

  const handleOpenAddSlot = (day: string) => {
    setAddingDay(day);
    setAddSubjectName('الرياضيات');
    setAddClassName('9-A');
  };

  const handleSaveNewSlot = () => {
    if (!addingDay) return;
    const updated = [...scheduleGrid[addingDay], addClassName ? `${addSubjectName} (${addClassName})` : addSubjectName];
    setScheduleGrid({
      ...scheduleGrid,
      [addingDay]: updated
    });
    setAddingDay(null);
  };

  const handleResetDay = (day: string) => {
    const defaultData: { [key: string]: string[] } = {
      "الأحد": ["الرياضيات (7-A)", "العلوم (8-B)", "اللغة العربية (7-A)", "اللغة الإنجليزية (8-B)", "التوعية الإسلامية"],
      "الإثنين": ["العلوم (7-A)", "الرياضيات (8-B)", "العلوم (8-B)", "اللغة العربية (7-A)", "حصيرة حرة"],
      "الثلاثاء": ["اللغة العربية (8-B)", "الرياضيات (7-A)", "التربية الإسلامية", "العلوم (7-A)", "الرياضيات (8-B)"],
      "الأربعاء": ["الرياضيات (7-A)", "العلوم (8-B)", "الرياضيات (8-B)", "اللغة العربية (7-A)", "الرياضيات (7-A)"],
      "الخميس": ["اللغة الإنجليزية (7-A)", "العلوم (7-A)", "الرياضيات (8-B)", "اللغة العربية (8-B)", "مراجعة دورية"]
    };
    setScheduleGrid({
      ...scheduleGrid,
      [day]: defaultData[day] || []
    });
  };

  const handleDragMock = (day: string, slotIdx: number) => {
    // Keep this or fallback to directly opening the edit dialog
    handleOpenEditSlot(day, slotIdx);
  };

  const calculateQuizScore = () => {
    if (!selectedQuiz) return;
    let score = 0;
    let totalPoints = 0;
    selectedQuiz.questions.forEach(q => {
      totalPoints += q.points;
      if (studentAnswers[q.id] === q.answerIndex) {
        score += q.points;
      }
    });
    setCorrectedScore(Math.round((score / totalPoints) * 100));
  };

  return (
    <div className="space-y-6" id="academics-module-container">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-gray-800 dark:text-white inline-flex items-center gap-2">
          <NotebookTabs className="w-7 h-7 text-[#E91E63]" />
          الإدارة الأكاديمية والامتحانات
        </h1>
        <p className="text-xs text-gray-500 mt-1">توليد جداول الفصول، بنك الأسئلة، التصحيح الآلي وبث شهادات التقدير الإلكترونية</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-100 dark:border-gray-850 gap-2">
        <button
          onClick={() => setActiveTab('schedule')}
          className={`px-4 py-2 font-bold text-xs cursor-pointer border-b-2 transition ${
            activeTab === 'schedule' ? 'border-[#E91E63] text-[#E91E63]' : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          أداة تنظيم الحصص بالسحب والإفلات
        </button>
        <button
          onClick={() => setActiveTab('exams')}
          className={`px-4 py-2 font-bold text-xs cursor-pointer border-b-2 transition ${
            activeTab === 'exams' ? 'border-[#E91E63] text-[#E91E63]' : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          بنك الأسئلة والتصحيح التلقائي
        </button>
        <button
          onClick={() => setActiveTab('certificates')}
          className={`px-4 py-2 font-bold text-xs cursor-pointer border-b-2 transition ${
            activeTab === 'certificates' ? 'border-[#E91E63] text-[#E91E63]' : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          توليد وطباعة شهادات التقدير
        </button>
      </div>

      {/* Tab 1: DRAG & DROP SCHEDULE */}
      {activeTab === 'schedule' && (
        <div className="space-y-4" id="view-schedule-panel">
          <div className="bg-pink-50/50 dark:bg-pink-950/20 p-4 rounded-2xl border border-pink-100 dark:border-pink-900/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-[#E91E63] flex items-center gap-1">
                <CalendarCheck className="w-5 h-5" />
                لوحة جدولة الحصص وتنظيم المواد (للمدير والمشرف)
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                اضغط على أي حصة بالجدول أدناه لتعديل مادتها الدراسية، أو تبديل صفوفها (مثل 9-A)، أو حذفها. كما يمكنك إضافة حصص إضافية وتصفير الأيام بكل مرونة لتفعيل الحوكمة الأكاديمية الشاملة.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  if (confirm("هل أنت متأكد من إعادة تعيين جدول الأسبوع بأكمله للوضع الافتراضي؟")) {
                    ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس"].forEach(d => handleResetDay(d));
                  }
                }}
                className="px-3.5 py-1.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 text-xs font-black text-gray-700 dark:text-gray-200 rounded-xl hover:bg-slate-50 transition cursor-pointer"
              >
                🔄 استعادة الجدول الافتراضي
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس"].map((day) => (
              <div key={day} className="glass-panel rounded-2xl p-4 soft-shadow border border-pink-50 dark:border-gray-800 space-y-3 bg-white dark:bg-slate-900/60">
                <div className="border-b pb-2 border-pink-50 dark:border-gray-800 flex justify-between items-center bg-pink-100/10 -m-4 p-4 rounded-t-2xl">
                  <span className="font-extrabold text-sm text-[#E91E63]">{day}</span>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`هل ترغب في إعادة تعيين جدول يوم (${day}) فقط؟`)) {
                        handleResetDay(day);
                      }
                    }}
                    className="text-[9px] bg-white dark:bg-slate-900 border border-gray-150 dark:border-slate-800 text-gray-500 font-bold px-1.5 py-0.5 rounded cursor-pointer hover:bg-pink-50 hover:text-[#E91E63]"
                  >
                    تصفير اليوم
                  </button>
                </div>

                <div className="space-y-2 pt-3">
                  {(scheduleGrid[day] || []).length === 0 ? (
                    <div className="text-center py-8 text-[11px] text-gray-400 font-semibold border-2 border-dashed border-gray-100 dark:border-slate-800 rounded-xl">
                      لا يوجد حصص مسجلة
                    </div>
                  ) : (
                    (scheduleGrid[day] || []).map((subject, idx) => {
                      const parsed = parseSlot(subject);
                      return (
                        <div
                          key={idx}
                          onClick={() => handleOpenEditSlot(day, idx)}
                          className="p-3 rounded-xl border border-[#E91E63]/5 hover:border-[#E91E63] bg-pink-50/10 dark:bg-slate-950/20 hover:bg-pink-50 dark:hover:bg-pink-950/20 cursor-pointer text-right text-xs transition duration-200 group active:scale-95 space-y-1 relative"
                        >
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400 text-[9px] font-mono">الحصة {idx + 1}</span>
                            <span className="text-[9px] font-black bg-pink-100/50 text-[#E91E63] dark:bg-pink-950/30 px-1 py-0.2 rounded">
                              {parsed.className}
                            </span>
                          </div>
                          <p className="font-bold text-gray-800 dark:text-gray-200 group-hover:text-[#E91E63] transition leading-tight">
                            {parsed.subject}
                          </p>
                        </div>
                      );
                    })
                  )}

                  {/* Add Slot Button for this day */}
                  <button
                    type="button"
                    onClick={() => handleOpenAddSlot(day)}
                    className="w-full py-2 border-2 border-dashed border-pink-100 hover:border-[#E91E63] dark:border-slate-800 dark:hover:border-pink-900 text-[11px] font-black text-[#E91E63] bg-pink-50/5 dark:bg-slate-900/30 hover:bg-pink-50/30 rounded-xl transition cursor-pointer flex items-center justify-center gap-1 mt-2"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    إضافة حصة جديدة
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Modal 1: Edit Slot Dialog */}
          {editingDay !== null && editingIndex !== null && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
              <div className="bg-white dark:bg-school-card-dark rounded-3xl p-6 max-w-md w-full soft-shadow relative text-right space-y-5 animate-fade-in">
                <div className="flex justify-between items-center border-b pb-2">
                  <h3 className="text-md font-bold text-gray-800 dark:text-white flex items-center gap-1.5">
                    <Clock className="w-5 h-5 text-[#E91E63]" />
                    <span>تعديل المادة والحصة الدراسيّة ({editingDay})</span>
                  </h3>
                  <button
                    type="button"
                    onClick={() => { setEditingDay(null); setEditingIndex(null); }}
                    className="text-gray-400 hover:text-gray-600 text-lg font-bold"
                  >
                    ✕
                  </button>
                </div>

                <p className="text-xs text-[#E91E63] font-bold">
                  الحصة رقم {editingIndex + 1} المقررة ليوم {editingDay}
                </p>

                <div className="space-y-4">
                  {/* Subject Name Input */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block">اسم المادة الدراسية *</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-transparent text-xs"
                      value={editSubjectName}
                      onChange={(e) => setEditSubjectName(e.target.value)}
                      placeholder="امسح واكتب مثل: مهارات الحاسوب، الكيمياء، إلخ"
                      required
                    />
                  </div>

                  {/* Quick Select Buttons */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 block">أزرار سريعة لاختيار مواد شائعة:</label>
                    <div className="flex flex-wrap gap-1.5">
                      {["الرياضيات", "العلوم", "اللغة العربية", "اللغة الإنجليزية", "التربية الإسلامية", "حاسوب", "التدقيق المالي", "الرياضة", "رسم وفنون"].map(s => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setEditSubjectName(s)}
                          className="px-2 py-1 bg-gray-50 dark:bg-slate-900 border border-gray-150 dark:border-slate-800 text-[10px] rounded-lg hover:border-[#E91E63] hover:text-[#E91E63] transition"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Class Name Selector / Input */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block">الصف المدرسي (الفصل) *</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-white"
                      value={editClassName}
                      onChange={(e) => setEditClassName(e.target.value)}
                    >
                      <option value="9-A">الصف التاسع (9-A)</option>
                      <option value="8-A">الصف الثامن (8-A)</option>
                      <option value="7-A">الصف السابع (7-A)</option>
                      <option value="6-A">الصف السادس (6-A)</option>
                      <option value="5-A">الصف الخامس (5-A)</option>
                      <option value="8-B">شعبة (8-B)</option>
                      <option value="7-B">شعبة (7-B)</option>
                      <option value="الروضة">مرحلة الروضة</option>
                      <option value="عام">نشاط عام / حرة</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2 border-t flex flex-col gap-2">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleSaveEditSlot}
                      className="flex-1 py-2.5 bg-[#E91E63] text-white text-xs font-black rounded-xl hover:bg-pink-600 transition cursor-pointer"
                    >
                      ✅ حفظ وتأكيد التغييرات
                    </button>
                    <button
                      type="button"
                      onClick={() => { setEditingDay(null); setEditingIndex(null); }}
                      className="px-4 py-2 bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-200 text-xs font-bold rounded-xl hover:bg-gray-200 transition"
                    >
                      إلغاء
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (confirm("هل أنت متأكد من رغبتك في حذف هذه الحصة بالكامل من جدول هذا اليوم؟")) {
                        handleDeleteSlot(editingDay, editingIndex);
                      }
                    }}
                    className="w-full py-1.5 bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-950/20 dark:text-red-400 text-[11px] font-bold rounded-lg transition"
                  >
                    🗑️ حذف هذه الحصة التمهيدية بالكامل
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Modal 2: Add Slot Dialog */}
          {addingDay !== null && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
              <div className="bg-white dark:bg-school-card-dark rounded-3xl p-6 max-w-md w-full soft-shadow relative text-right space-y-5 animate-fade-in">
                <div className="flex justify-between items-center border-b pb-2">
                  <h3 className="text-md font-bold text-gray-800 dark:text-white flex items-center gap-1.5">
                    <Plus className="w-5 h-5 text-[#E91E63]" />
                    <span>إدخال حصة دراسية جديدة ({addingDay})</span>
                  </h3>
                  <button
                    type="button"
                    onClick={() => setAddingDay(null)}
                    className="text-gray-400 hover:text-gray-600 text-lg font-bold"
                  >
                    ✕
                  </button>
                </div>

                <p className="text-xs text-gray-500 leading-relaxed">
                  سيتم إدراج هذه الحصة في نهاية الحصص المسجلة ليوم {addingDay} تلقائياً.
                </p>

                <div className="space-y-4">
                  {/* Subject Name Input */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block">اسم المادة الجديدة *</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-transparent text-xs"
                      value={addSubjectName}
                      onChange={(e) => setAddSubjectName(e.target.value)}
                      placeholder="اكتب اسم المادة (مثال: التربية الفنية)"
                      required
                    />
                  </div>

                  {/* Quick Select Buttons */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 block">اقتراحات سريعة للمواد:</label>
                    <div className="flex flex-wrap gap-1.5">
                      {["الرياضيات", "العلوم", "اللغة العربية", "اللغة الإنجليزية", "التربية الإسلامية", "حاسوب", "الفيزياء", "الكيمياء", "التوعية الأسرية"].map(s => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setAddSubjectName(s)}
                          className="px-2 py-1 bg-gray-50 dark:bg-slate-900 border border-gray-150 dark:border-slate-800 text-[10px] rounded-lg hover:border-[#E91E63] hover:text-[#E91E63] transition"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Class Name Selector */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block">الصف المدرسي (الفصل) *</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-white"
                      value={addClassName}
                      onChange={(e) => setAddClassName(e.target.value)}
                    >
                      <option value="9-A">الصف التاسع (9-A)</option>
                      <option value="8-A">الصف الثامن (8-A)</option>
                      <option value="7-A">الصف السابع (7-A)</option>
                      <option value="6-A">الصف السادس (6-A)</option>
                      <option value="5-A">الصف الخامس (5-A)</option>
                      <option value="8-B">شعبة (8-B)</option>
                      <option value="7-B">شعبة (7-B)</option>
                      <option value="الروضة">الروضة</option>
                      <option value="عام">نشاط عام / حرة</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2 border-t flex gap-2">
                  <button
                    type="button"
                    onClick={handleSaveNewSlot}
                    className="flex-1 py-2.5 bg-gradient-to-r from-[#E91E63] to-pink-500 text-white text-xs font-black rounded-xl hover:-translate-y-0.5 transition cursor-pointer"
                  >
                    ➕ إضافة الحصة للجدول
                  </button>
                  <button
                    type="button"
                    onClick={() => setAddingDay(null)}
                    className="px-4 py-2 bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-200 text-xs font-bold rounded-xl hover:bg-gray-200 transition"
                  >
                    إلغاء
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: BANQUE DES QUESTIONS & TESTS CORRECTOR */}
      {activeTab === 'exams' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="view-exams-panel">
          {/* List of exams and questions (5 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex justify-between items-center bg-gray-50/50 dark:bg-slate-900/40 p-3 rounded-2xl border border-gray-150 dark:border-slate-800">
              <h3 className="text-xs font-black text-gray-700 dark:text-gray-300">قائمة الامتحانات ومجموعات الأسئلة</h3>
              <button
                type="button"
                onClick={() => {
                  setNewExamTitle('');
                  setNewExamSubject('الرياضيات');
                  setNewExamClassId('9-A');
                  setNewExamDuration(45);
                  setShowAddExamModal(true);
                }}
                className="px-2.5 py-1.5 bg-[#E91E63] text-white text-[11px] font-black rounded-xl hover:bg-pink-600 transition cursor-pointer flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>إضافة اختبار</span>
              </button>
            </div>

            <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
              {exams.length === 0 ? (
                <div className="text-center py-12 text-gray-400 text-xs border-2 border-dashed rounded-2xl">
                  لا توجد اختبارات متوفرة حالياً. اضغط "إضافة اختبار" للأعلى.
                </div>
              ) : (
                exams.map((ex) => (
                  <div
                    key={ex.id}
                    onClick={() => {
                      setSelectedQuizId(ex.id);
                      setStudentAnswers({});
                      setCorrectedScore(null);
                    }}
                    className={`p-4 rounded-2xl border cursor-pointer text-right transition group relative ${
                      selectedQuiz?.id === ex.id
                        ? 'border-[#E91E63] bg-[#E91E63]/5'
                        : 'border-gray-100 dark:border-slate-800 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <p className="text-[10px] font-mono font-black text-[#E91E63]">{ex.id} - {ex.subject}</p>
                      <span className="text-[9px] font-extrabold bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 px-1.5 py-0.2 rounded">
                        {ex.classId || 'عام'}
                      </span>
                    </div>
                    <h4 className="text-sm font-black text-gray-800 dark:text-white mt-1 leading-tight group-hover:text-[#E91E63] transition">{ex.title}</h4>
                    <div className="flex justify-between items-center text-[11px] text-gray-400 mt-2 pt-2 border-t border-dashed border-gray-100/10">
                      <span>🕒 المدة: {ex.duration} دقيقة</span>
                      <span>📝 بنود الأسئلة: {ex.questions?.length || 0}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Corrector Simulator workspace (8 cols) */}
          <div className="lg:col-span-8 glass-panel rounded-2xl p-5 border border-[#E91E63]/10 soft-shadow space-y-5">
            {selectedQuiz ? (
              <div className="space-y-4 text-right animate-fade-in">
                {/* Active Exam Action Header */}
                <div className="border-b pb-3 border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-xs bg-[#E91E63]/10 text-[#E91E63] font-bold px-2.5 py-0.5 rounded-full">{selectedQuiz.subject}</span>
                    <h3 className="text-md font-black text-gray-800 dark:text-white mt-1">{selectedQuiz.title}</h3>
                  </div>
                  
                  {/* Action buttons on active exam */}
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={handleOpenEditExam}
                      className="px-2.5 py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-150 dark:bg-slate-900 dark:border-slate-800 text-[11px] text-gray-700 dark:text-gray-300 font-bold rounded-xl cursor-pointer flex items-center gap-1"
                    >
                      <Edit className="w-3.5 h-3.5 text-[#E91E63]" />
                      تعديل بيانات الاختبار
                    </button>
                    <button
                      type="button"
                      onClick={handleDeleteExamClick}
                      className="px-2.5 py-1.5 bg-red-50/50 hover:bg-red-50 border border-red-100 text-[11px] text-red-600 font-bold rounded-xl cursor-pointer flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      حذف
                    </button>
                    <button
                      type="button"
                      onClick={handleOpenAddQuestion}
                      className="px-3 py-1.5 bg-[#E91E63] text-white text-[11px] font-black rounded-xl hover:bg-pink-600 hover:-translate-y-0.5 transition cursor-pointer flex items-center gap-1"
                    >
                      <Plus className="w-4 h-4" />
                      إضافة سؤال جديد
                    </button>
                  </div>
                </div>

                {/* Exam questions explorer */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h5 className="font-extrabold text-xs text-gray-500 uppercase">بنود الأسئلة المتوفرة ومحاكاة التصحيح والمدخلات</h5>
                    <span className="text-[10px] text-gray-400 font-bold">بموجب المراجعة الأكاديمية لمدرسة حبيبة</span>
                  </div>

                  <div className="space-y-4">
                    {(selectedQuiz.questions || []).length === 0 ? (
                      <div className="text-center py-16 text-gray-400 text-xs border-2 border-dashed border-gray-200 dark:border-slate-800 rounded-3xl space-y-2">
                        <p className="font-bold">بنك الأسئلة فارغ مجملاً لهذا الامتحان حالياً.</p>
                        <p className="text-[11px] text-blue-500">انقر على "إضافة سؤال جديد" للأعلى لتأسيس المحتوى الأكاديمي.</p>
                      </div>
                    ) : (
                      (selectedQuiz.questions || []).map((q, qIndex) => (
                        <div key={q.id} className="p-4 bg-gray-50 dark:bg-slate-950/20 rounded-2xl space-y-3.5 border border-gray-100 dark:border-slate-800 relative group/card">
                          
                          {/* Absolute floating question operation actions */}
                          <div className="absolute left-3 top-3 opacity-100 sm:opacity-0 group-hover/card:opacity-100 transition duration-150 flex gap-1 z-10">
                            <button
                              type="button"
                              onClick={() => handleOpenEditQuestion(q)}
                              className="p-1 px-2 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-gray-200 dark:border-slate-800 text-[10px] rounded-lg hover:border-[#E91E63] hover:text-[#E91E63] transition flex items-center gap-0.5 cursor-pointer"
                              title="تعديل هذا البند الدراسي"
                            >
                              <Edit className="w-3 h-3" />
                              تعديل
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteQuestion(q.id)}
                              className="p-1 px-1 bg-red-50 text-red-600 border border-red-100 text-[10px] rounded-lg hover:bg-red-100 transition flex items-center cursor-pointer"
                              title="حذف هذا البند"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="space-y-1.5 pl-24">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-extrabold text-xs text-gray-400 font-mono">البند {qIndex + 1}</span>
                              <span className="text-[9px] font-black bg-emerald-50 text-emerald-600 px-1.5 py-0.2 rounded-md">
                                الجواب الصحيح المعتمد: {q.options[q.answerIndex] || `الخيار رقم ${q.answerIndex + 1}`}
                              </span>
                            </div>
                            <p className="text-xs font-black text-gray-800 dark:text-gray-200 leading-relaxed pt-1">
                              {q.question} <span className="text-gray-400 font-bold">({q.points} نقاط)</span>
                            </p>
                          </div>

                          {/* Options render */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                            {q.options.map((opt, optIndex) => (
                              <button
                                key={optIndex}
                                type="button"
                                onClick={() => setStudentAnswers({ ...studentAnswers, [q.id]: optIndex })}
                                className={`p-2.5 rounded-xl border text-right transition duration-150 relative ${
                                  studentAnswers[q.id] === optIndex
                                    ? 'bg-[#E91E63]/10 border-[#E91E63] font-black text-[#E91E63]'
                                    : 'border-gray-100 dark:border-slate-900 bg-white dark:bg-slate-900/60 hover:bg-gray-50'
                                }`}
                              >
                                <span className="font-black text-[9px] text-[#E91E63] ml-1 bg-pink-100/40 px-1 py-0.2 rounded-md">
                                  {optIndex + 1}
                                </span>
                                {opt}
                                {q.answerIndex === optIndex && (
                                  <span className="absolute left-2 top-2.5 text-[9px] font-bold text-emerald-600" title="هذا هو الجواب الصحيح">
                                    ✓
                                  </span>
                                )}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Actions to correct */}
                  {(selectedQuiz.questions || []).length > 0 && (
                    <div className="flex justify-between items-center border-t pt-4 flex-wrap gap-2">
                      <button
                        onClick={calculateQuizScore}
                        className="px-6 py-2.5 bg-gradient-to-r from-[#E91E63] to-pink-500 text-white font-black text-xs rounded-xl hover:-translate-y-0.5 transition cursor-pointer"
                      >
                        بدء التصحيح التلقائي وتدقيق الورقة
                      </button>

                      {correctedScore !== null && (
                        <div className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl text-xs font-bold border border-emerald-200">
                          النتيجة المحللة: <span className="font-mono text-sm font-black">{correctedScore}%</span>
                          {correctedScore >= 90 ? ' (ممتاز جداً - درجة مستحقة)' : correctedScore >= 70 ? ' (جيد جداً)' : ' (يحتاج تركيز)'}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="h-60 flex items-center justify-center text-center text-gray-400 text-xs">
                يرجى تحديد اختبار من اللوحة اليمنى لعرض الأسئلة وتجريب شاشة التصحيح الفردي
              </div>
            )}
          </div>

          {/* Modal 3: Add Exam Dialog */}
          {showAddExamModal && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
              <form onSubmit={handleCreateExamSubmit} className="bg-white dark:bg-school-card-dark rounded-3xl p-6 max-w-md w-full soft-shadow relative text-right space-y-5 animate-fade-in">
                <div className="flex justify-between items-center border-b pb-2">
                  <h3 className="text-sm font-bold text-gray-800 dark:text-white flex items-center gap-1.5">
                    <NotebookTabs className="w-5 h-5 text-[#E91E63]" />
                    <span>تأسيس ونشر اختبار وطراز جديد</span>
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowAddExamModal(false)}
                    className="text-gray-400 hover:text-gray-600 text-lg font-bold hover:red-500"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-4 text-xs">
                  {/* Exam Title */}
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700 dark:text-gray-300 block">عنوان الاختبار المعتمد *</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-transparent font-bold"
                      value={newExamTitle}
                      onChange={(e) => setNewExamTitle(e.target.value)}
                      placeholder="مثال: الاختبار الفصلي الأول لمقرر الرياضيات"
                      required
                    />
                  </div>

                  {/* Subject */}
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700 dark:text-gray-300 block">المادة الدراسية (القسم)</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-transparent"
                      value={newExamSubject}
                      onChange={(e) => setNewExamSubject(e.target.value)}
                      placeholder="مثال: الرياضيات، الفيزياء، العلوم"
                      required
                    />
                  </div>

                  {/* Class selection */}
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700 dark:text-gray-300 block">الصف المستهدف للتقييم</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-slate-900 text-slate-800 dark:text-white font-bold"
                      value={newExamClassId}
                      onChange={(e) => setNewExamClassId(e.target.value)}
                    >
                      <option value="9-A">الصف التاسع (9-A)</option>
                      <option value="8-A">الصف الثامن (8-A)</option>
                      <option value="7-A">الصف السابع (7-A)</option>
                      <option value="6-A">الصف السادس (6-A)</option>
                      <option value="5-A">الصف الخامس (5-A)</option>
                    </select>
                  </div>

                  {/* Duration */}
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700 dark:text-gray-300 block">زمن الاختبار الأكاديمي (بالدقائق)</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-transparent"
                      value={newExamDuration}
                      onChange={(e) => setNewExamDuration(Number(e.target.value))}
                      min={10}
                      max={180}
                      required
                    />
                  </div>
                </div>

                <div className="pt-2 border-t flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-[#E91E63] text-white text-xs font-black rounded-xl hover:bg-pink-600 transition cursor-pointer"
                  >
                    ✅ بناء ونشر الاختبار بنجاح
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddExamModal(false)}
                    className="px-4 py-2 bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-200 text-xs font-bold rounded-xl"
                  >
                    إلغاء
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Modal 4: Edit Exam Dialog */}
          {showEditExamModal && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
              <form onSubmit={handleEditExamSubmit} className="bg-white dark:bg-school-card-dark rounded-3xl p-6 max-w-md w-full soft-shadow relative text-right space-y-5 animate-fade-in">
                <div className="flex justify-between items-center border-b pb-2">
                  <h3 className="text-md font-bold text-gray-800 dark:text-white flex items-center gap-1.5">
                    <Edit className="w-5 h-5 text-[#E91E63]" />
                    <span>تعديل تفاصيل مستند الاختبار</span>
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowEditExamModal(false)}
                    className="text-gray-400 hover:text-gray-600 text-lg font-bold"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-4 text-xs">
                  {/* Exam Title */}
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700 dark:text-gray-300 block">عنوان الاختبار المعتمد *</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-transparent font-bold"
                      value={editExamTitle}
                      onChange={(e) => setEditExamTitle(e.target.value)}
                      required
                    />
                  </div>

                  {/* Subject */}
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700 dark:text-gray-300 block">المادة الدراسية (القسم)</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-transparent"
                      value={editExamSubject}
                      onChange={(e) => setEditExamSubject(e.target.value)}
                      required
                    />
                  </div>

                  {/* Class selection */}
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700 dark:text-gray-300 block">الصف المستهدف للتقييم</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-slate-900 text-slate-800 dark:text-white font-bold"
                      value={editExamClassId}
                      onChange={(e) => setEditExamClassId(e.target.value)}
                    >
                      <option value="9-A">الصف التاسع (9-A)</option>
                      <option value="8-A">الصف الثامن (8-A)</option>
                      <option value="7-A">الصف السابع (7-A)</option>
                      <option value="6-A">الصف السادس (6-A)</option>
                      <option value="5-A">الصف الخامس (5-A)</option>
                    </select>
                  </div>

                  {/* Duration */}
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700 dark:text-gray-300 block">زمن الاختبار الأكاديمي (بالدقائق)</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-transparent"
                      value={editExamDuration}
                      onChange={(e) => setEditExamDuration(Number(e.target.value))}
                      min={10}
                      max={180}
                      required
                    />
                  </div>
                </div>

                <div className="pt-2 border-t flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-[#E91E63] text-white text-xs font-black rounded-xl hover:bg-pink-600 transition cursor-pointer"
                  >
                    💾 تحديث تفاصيل الاختبار
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowEditExamModal(false)}
                    className="px-4 py-2 bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-200 text-xs font-bold rounded-xl"
                  >
                    إلغاء
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Modal 5: Add / Edit Question Dialog */}
          {showQuestionModal && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
              <form onSubmit={handleSaveQuestionSubmit} className="bg-white dark:bg-school-card-dark rounded-3xl p-6 max-w-lg w-full soft-shadow relative text-right space-y-4 animate-fade-in animate-duration-150">
                <div className="flex justify-between items-center border-b pb-2">
                  <h3 className="text-sm font-bold text-gray-800 dark:text-white flex items-center gap-1.5">
                    <HelpCircle className="w-5 h-5 text-[#E91E63]" />
                    <span>{editingQuestionId === null ? "توليد وإضافة سؤال جديد لبنك الأسئلة" : "تعديل صياغة البند ومحتويات الخيارات"}</span>
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowQuestionModal(false)}
                    className="text-gray-400 hover:text-gray-600 text-lg font-bold"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-3 text-xs text-right">
                  {/* Question text */}
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700 dark:text-gray-300 block">صيغة السؤال المقترح *</label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-transparent h-20"
                      value={questionText}
                      onChange={(e) => setQuestionText(e.target.value)}
                      placeholder="مثال: كم حاصل ضرب 9 في 9 في الرياضيات الفخرية؟"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3 pb-1 border-b border-dashed border-gray-100/10">
                    {/* Points */}
                    <div className="space-y-1">
                      <label className="font-bold text-gray-700 dark:text-gray-300 block">درجة السؤال (النقاط)</label>
                      <input
                        type="number"
                        className="w-full px-3 py-1.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-transparent font-mono"
                        value={questionPoints}
                        onChange={(e) => setQuestionPoints(Number(e.target.value))}
                        min={1}
                        max={100}
                        required
                      />
                    </div>

                    {/* Correct Index */}
                    <div className="space-y-1">
                      <label className="font-bold text-[#E91E63] block">موقع الإجابة الصحيحة المعتمدة</label>
                      <select
                        className="w-full px-3 py-1.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-slate-900 font-bold text-slate-800 dark:text-white"
                        value={correctIndex}
                        onChange={(e) => setCorrectIndex(Number(e.target.value))}
                      >
                        <option value={0}>الخيار الأول (1)</option>
                        <option value={1}>الخيار الثاني (2)</option>
                        <option value={2}>الخيار الثالث (3) [إن وجد]</option>
                        <option value={3}>الخيار الرابع (4) [إن وجد]</option>
                      </select>
                    </div>
                  </div>

                  {/* Options */}
                  <div className="space-y-2">
                    <label className="font-bold text-gray-600 block">الخيارات والبدائل المتوفرة (اكتب خيارات مميزة):</label>
                    
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className="w-5 text-center font-bold text-[#E91E63]">(1)</span>
                        <input
                          type="text"
                          className="flex-1 px-3 py-1.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-transparent"
                          value={opt1}
                          onChange={(e) => setOpt1(e.target.value)}
                          placeholder="الخيار الأول (إلزامي)"
                          required
                        />
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className="w-5 text-center font-bold text-[#E91E63]">(2)</span>
                        <input
                          type="text"
                          className="flex-1 px-3 py-1.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-transparent"
                          value={opt2}
                          onChange={(e) => setOpt2(e.target.value)}
                          placeholder="الخيار الثاني (إلزامي)"
                          required
                        />
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className="w-5 text-center font-bold text-gray-400">(3)</span>
                        <input
                          type="text"
                          className="flex-1 px-3 py-1.5 border border-gray-150 dark:border-slate-800 rounded-xl bg-transparent text-gray-700 dark:text-gray-200"
                          value={opt3}
                          onChange={(e) => setOpt3(e.target.value)}
                          placeholder="الخيار الثالث (اختياري)"
                        />
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className="w-5 text-center font-bold text-gray-400">(4)</span>
                        <input
                          type="text"
                          className="flex-1 px-3 py-1.5 border border-gray-150 dark:border-slate-800 rounded-xl bg-transparent text-gray-700 dark:text-gray-200"
                          value={opt4}
                          onChange={(e) => setOpt4(e.target.value)}
                          placeholder="الخيار الرابع (اختياري)"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-gradient-to-r from-[#E91E63] to-pink-500 text-white text-xs font-black rounded-xl hover:-translate-y-0.5 transition cursor-pointer"
                  >
                    💾 حفظ وتحديث بنك الأسئلة
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowQuestionModal(false)}
                    className="px-4 py-2 bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-200 text-xs font-bold rounded-xl"
                  >
                    إلغاء
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: GENERATE DIGITAL CERTIFICATES OF APPRECIATION */}
      {activeTab === 'certificates' && (
        <div className="space-y-6" id="view-certificates-panel">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Input values (4 cols) */}
            <div className="lg:col-span-4 glass-panel rounded-2xl p-5 border border-[#E91E63]/10 soft-shadow space-y-4 text-xs">
              <h3 className="text-md font-bold text-gray-700 dark:text-gray-300">نموذج صناعة وتصميم الشهادة</h3>
              
              <div className="space-y-1">
                <label className="font-bold block text-gray-600">اسم الطالب المكرم *</label>
                <input
                  type="text"
                  value={certRecipient}
                  onChange={(e) => setCertRecipient(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl"
                  placeholder="اسم الطالب"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold block text-gray-600">مجال التكريم المعتمد</label>
                <input
                  type="text"
                  value={certSubject}
                  onChange={(e) => setCertSubject(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl"
                  placeholder="مثال: الرياضيات المتقدمة"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold block text-gray-600">صيغة التقدير والثناء *</label>
                <textarea
                  value={certText}
                  onChange={(e) => setCertText(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl h-24"
                />
              </div>

              <button
                onClick={() => setShowCertificateModal(true)}
                className="w-full text-center bg-[#E91E63] hover:bg-pink-600 text-white font-bold py-2.5 rounded-xl cursor-pointer"
                id="btn-preview-certificate"
              >
                توليد ومعاينة الشهادة الفاخرة
              </button>
            </div>

            {/* Live mockup display of certificate (8 cols) */}
            <div className="lg:col-span-8 border-4 border-double border-pink-200 bg-gradient-to-br from-[#FFF] via-pink-50/5 to-[#FFF] text-center p-8 rounded-2xl relative overflow-hidden flex flex-col items-center justify-center space-y-4">
              <div className="absolute inset-0 border-[16px] border-pink-50 pointer-events-none" />
              <div className="absolute right-4 top-4 text-xs text-amber-600 font-bold border border-amber-500/20 px-2 py-0.5 rounded-md">
                مدرسة حبيبة
              </div>

              <div className="space-y-2">
                <h4 className="text-orange-500 font-serif font-black text-xl tracking-widest">شهادة شكر وتقدير واعتزاز</h4>
                <p className="text-[11px] text-gray-400">تمنح مدرسة حبيبة التعليمية الدولية هذه الشهادة بفخر لـ :</p>
              </div>

              <div className="space-y-1">
                <h2 className="text-2xl font-black text-gray-900 font-sans tracking-wide">
                  {certRecipient}
                </h2>
                <div className="w-40 h-0.5 bg-gradient-to-r from-transparent via-[#E91E63] to-transparent mx-auto" />
              </div>

              <div className="max-w-md mx-auto space-y-3">
                <p className="text-xs text-[#E91E63] font-bold underline">بسبب: {certSubject}</p>
                <p className="text-xs text-gray-600 leading-relaxed italic">
                  "{certText}"
                </p>
              </div>

              <div className="grid grid-cols-2 w-full pt-6 border-t border-dashed border-gray-100 text-xs text-gray-500 dark:text-gray-400">
                <div className="text-right">
                  <p>بتاريخه: {new Date().toISOString().split('T')[0]}</p>
                  <p>رقم الإدراج: CERT-2026-985</p>
                </div>
                <div className="text-left font-serif font-black text-[#E91E63]/80 italic">
                  توقيع الإدارة المعتمدة
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pop up overlay of printable royal certificate */}
      {showCertificateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-school-card-dark rounded-3xl p-6 max-w-4xl w-full soft-shadow relative text-right space-y-6">
            <button
              onClick={() => setShowCertificateModal(false)}
              className="absolute left-4 top-4 bg-gray-100 p-1.5 rounded-full text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              x
            </button>

            <div className="border-b pb-3 flex justify-between items-center">
              <h2 className="text-lg font-black text-[#E91E63]">الشهادة التعليمية الذهبية الجاهزة للتصدير</h2>
              <span className="text-xs bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded">شهادة شرفية معتمدة</span>
            </div>

            {/* Elegant Royal Certificate canvas ready for PDF or direct paper print */}
            <div className="border-[20px] border-double border-amber-400 bg-[#FFFDF9] dark:bg-amber-950/5 p-12 rounded-2xl relative overflow-hidden text-center space-y-6 soft-shadow text-black">
              {/* decorative corners */}
              <div className="absolute top-2 right-2 text-2xl text-amber-400">❖</div>
              <div className="absolute top-2 left-2 text-2xl text-amber-400">❖</div>
              <div className="absolute bottom-2 right-2 text-2xl text-amber-400">❖</div>
              <div className="absolute bottom-2 left-2 text-2xl text-amber-400">❖</div>

              <div className="space-y-3">
                <img
                  src="https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=80"
                  alt="habiba logo"
                  className="w-12 h-12 rounded-full mx-auto object-cover border-2 border-amber-400 shadow"
                />
                <h3 className="text-amber-600 font-black text-xs font-mono tracking-widest">مَدْرَسَة حَبِيبَة التَّعْلِيمِيَّة الدُّوَلِيَّة</h3>
                <h1 className="text-3xl font-serif font-extrabold text-amber-800 tracking-wide">شَهَادَة تَقْدِير وَأَوْلَوِيَّة</h1>
              </div>

              <div className="space-y-4 max-w-xl mx-auto">
                <p className="text-xs text-gray-500 font-semibold">تُشهد إدارة مدرسة حبيبة التعليمية بعميق الفخر والامتنان بأن الطالب/الطالبة:</p>
                <h2 className="text-3xl font-serif font-black text-[#E91E63] tracking-wider my-3">
                  {certRecipient}
                </h2>
                <div className="w-1/2 h-[3px] bg-amber-400 mx-auto rounded-full" />
                <p className="text-sm text-gray-800 font-medium leading-relaxed italic">
                  "{certText}"
                </p>
                <p className="text-xs text-gray-600">
                  ونحن إذ نمنحه هذه الهوية التكريمية نتمنى له دوام الرقي والنجاح بمساره الأكاديمي والمدني.
                </p>
              </div>

              {/* Badges and signatures */}
              <div className="grid grid-cols-3 w-full pt-8 text-xs text-gray-600 items-end">
                <div className="text-right space-y-1">
                  <p className="font-semibold text-amber-800">التأريخ والسند:</p>
                  <p className="font-mono text-gray-500">2026-06-09</p>
                  <p className="font-mono text-[9px] text-gray-400">QR: STU-CERT-994</p>
                </div>
                
                {/* SVG Golden circular seal representation */}
                <div className="flex justify-center flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-400 to-amber-500 border-4 border-white shadow-md flex items-center justify-center text-white text-[10px] font-black uppercase tracking-wider relative">
                    <div className="absolute inset-1 rounded-full border border-dashed border-white" />
                    <span>SEAL 2026</span>
                  </div>
                  <span className="text-[9px] text-amber-600 font-bold mt-1">الختم الأكاديمي الرسمي</span>
                </div>

                <div className="text-left space-y-1">
                  <p className="font-semibold text-amber-800">مدير مدرسة حبيبة:</p>
                  <p className="font-bold underline text-[#E91E63]">ماجد محمّد البكري</p>
                  <p className="text-[10px] text-gray-400">إمضاء رقمي معتمد</p>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-3 gap-2">
              <button
                onClick={() => {
                  window.print();
                }}
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-black text-xs rounded-xl cursor-pointer flex items-center gap-1"
              >
                <Printer className="w-4 h-4" />
                تصدير للطباعة بالألوان أو ملف PDF
              </button>
              <button
                type="button"
                onClick={() => setShowCertificateModal(false)}
                className="px-5 py-2 bg-gray-800 hover:bg-gray-900 text-white font-bold text-xs rounded-xl cursor-pointer"
              >
                إغلاق والعودة
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
