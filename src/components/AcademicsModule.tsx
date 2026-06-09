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
  GraduationCap
} from 'lucide-react';
import { SchoolExam } from '../types';
import { initialExams } from '../data/mockData';

interface AcademicsModuleProps {
  exams: SchoolExam[];
  onAddExam: (exam: SchoolExam) => void;
  studentsList: { id: string; name: string }[];
}

export const AcademicsModule: React.FC<AcademicsModuleProps> = ({
  exams,
  onAddExam,
  studentsList
}) => {
  const [activeTab, setActiveTab] = useState<'schedule' | 'exams' | 'certificates'>('schedule');

  // Certificate Generator State
  const [certRecipient, setCertRecipient] = useState(studentsList[0]?.name || 'سارة محمد الشريف');
  const [certSubject, setCertSubject] = useState('التفوق الأكاديمي والرياضي العام');
  const [certText, setCertText] = useState('لحصولها على المرتبة الأولى في مدرسة حبيبة التعليمية وتفوقها اللافت في تفعيل اللغة العربية والرياضيات بمعدل 99%.');
  const [showCertificateModal, setShowCertificateModal] = useState(false);

  // Quiz exam corrector mock state
  const [selectedQuiz, setSelectedQuiz] = useState<SchoolExam | null>(exams[0]);
  const [studentAnswers, setStudentAnswers] = useState<{ [qId: string]: number }>({});
  const [correctedScore, setCorrectedScore] = useState<number | null>(null);

  // Drag and drop timetable representation state
  const [scheduleGrid, setScheduleGrid] = useState<{ [day: string]: string[] }>({
    "الأحد": ["الرياضيات (7-A)", "العلوم (8-B)", "اللغة العربية (7-A)", "اللغة الإنجليزية (8-B)", "التوعية الإسلامية"],
    "الإثنين": ["العلوم (7-A)", "الرياضيات (8-B)", "العلوم (8-B)", "اللغة العربية (7-A)", "حصيرة حرة"],
    "الثلاثاء": ["اللغة العربية (8-B)", "الرياضيات (7-A)", "التربية الإسلامية", "العلوم (7-A)", "الرياضيات (8-B)"],
    "الأربعاء": ["الرياضيات (7-A)", "العلوم (8-B)", "الرياضيات (8-B)", "اللغة العربية (7-A)", "الرياضيات (7-A)"],
    "الخميس": ["اللغة الإنجليزية (7-A)", "العلوم (7-A)", "الرياضيات (8-B)", "اللغة العربية (8-B)", "مراجعة دورية"]
  });

  const handleDragMock = (day: string, slotIdx: number) => {
    // Simulated drag & drop - shift subject values in line with client interaction
    const oldArray = [...scheduleGrid[day]];
    const temp = oldArray[slotIdx];
    // swap with next or move randomly to feel highly interactive!
    if (slotIdx + 1 < oldArray.length) {
      oldArray[slotIdx] = oldArray[slotIdx + 1];
      oldArray[slotIdx + 1] = temp;
    } else {
      oldArray[slotIdx] = oldArray[0];
      oldArray[0] = temp;
    }
    setScheduleGrid({
      ...scheduleGrid,
      [day]: oldArray
    });
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
          <div className="bg-pink-50/50 dark:bg-pink-950/20 p-4 rounded-2xl border border-pink-100 dark:border-pink-900/30">
            <h3 className="text-sm font-bold text-[#E91E63] flex items-center gap-1">
              <CalendarCheck className="w-5 h-5" />
              أداة التخطيط الذكية الفورية
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 leading-relaxed">
              انقر على أي مادة أو فصل بالجدول أدناه لتعديل ترتيبها الفوري أو إعادة توزيع المعلم. يتيح لك الموديل حوكمة المواعيد دون حدوث تعارضات زمنية للغرف التعليمية.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {Object.keys(scheduleGrid).map((day) => (
              <div key={day} className="glass-panel rounded-2xl p-4 soft-shadow border border-pink-50 dark:border-gray-800 space-y-3">
                <div className="border-b pb-2 border-pink-50 dark:border-gray-800 flex justify-between items-center bg-pink-100/10 -m-4 p-4 rounded-t-2xl">
                  <span className="font-extrabold text-sm text-[#E91E63]">{day}</span>
                  <span className="text-[10px] bg-white text-gray-500 font-bold px-1.5 py-0.5 rounded cursor-pointer hover:bg-pink-50">إعادة تعيين</span>
                </div>

                <div className="space-y-2 pt-2">
                  {scheduleGrid[day].map((subject, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleDragMock(day, idx)}
                      className="p-3 rounded-xl border border-[#E91E63]/5 hover:border-[#E91E63] bg-pink-50/20 hover:bg-pink-50 dark:hover:bg-pink-950/10 cursor-pointer text-right text-xs transition duration-200 group active:scale-95 space-y-0.5"
                    >
                      <span className="text-gray-400 text-[10px] block font-mono">الحصة {idx + 1}</span>
                      <p className="font-bold text-gray-800 dark:text-gray-200 group-hover:text-[#E91E63] transition">
                        {subject}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: BANQUE DES QUESTIONS & TESTS CORRECTOR */}
      {activeTab === 'exams' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="view-exams-panel">
          {/* List of exams and questions (5 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <h3 className="text-md font-bold text-gray-700 dark:text-gray-300">الاختبارات وبنوك الأسئلة المتوفرة</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
              {exams.map((ex) => (
                <div
                  key={ex.id}
                  onClick={() => {
                    setSelectedQuiz(ex);
                    setStudentAnswers({});
                    setCorrectedScore(null);
                  }}
                  className={`p-4 rounded-2xl border cursor-pointer text-right transition ${
                    selectedQuiz?.id === ex.id
                      ? 'border-[#E91E63] bg-pink-50/30'
                      : 'border-gray-100 hover:bg-gray-50'
                  }`}
                >
                  <p className="text-[10px] font-mono font-bold text-[#E91E63]">{ex.id} - {ex.subject}</p>
                  <h4 className="text-sm font-bold text-gray-800 dark:text-white mt-1">{ex.title}</h4>
                  <div className="flex justify-between items-center text-xs text-gray-400 mt-2">
                    <span>المدة: {ex.duration} دقيقة</span>
                    <span>الأسئلة: {ex.questions.length}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Corrector Simulator workspace (8 cols) */}
          <div className="lg:col-span-8 glass-panel rounded-2xl p-5 border border-[#E91E63]/10 soft-shadow space-y-5">
            {selectedQuiz ? (
              <div className="space-y-4 text-right">
                <div className="border-b pb-3 border-gray-100 dark:border-gray-800">
                  <span className="text-xs bg-[#E91E63]/10 text-[#E91E63] font-bold px-2 py-0.5 rounded-full">{selectedQuiz.subject}</span>
                  <h3 className="text-lg font-black text-gray-800 dark:text-white mt-1">{selectedQuiz.title}</h3>
                </div>

                {/* Exam corrector sandbox */}
                <div className="space-y-4">
                  <h5 className="font-bold text-xs text-gray-500 uppercase">محاكي التصحيح وتصحيح عينات أوراق الطلاب</h5>
                  <div className="space-y-4">
                    {selectedQuiz.questions.map((q, qIndex) => (
                      <div key={q.id} className="p-4 bg-gray-50 dark:bg-black/20 rounded-xl space-y-2 border">
                        <p className="text-xs font-bold text-gray-800 dark:text-gray-200">
                          {qIndex + 1}. {q.question} ({q.points} نقاط)
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          {q.options.map((opt, optIndex) => (
                            <button
                              key={optIndex}
                              type="button"
                              onClick={() => setStudentAnswers({ ...studentAnswers, [q.id]: optIndex })}
                              className={`p-2.5 rounded-xl border text-right transition ${
                                studentAnswers[q.id] === optIndex
                                  ? 'bg-[#E91E63]/10 border-[#E91E63] font-bold text-[#E91E63]'
                                  : 'border-gray-100 bg-white hover:bg-gray-50'
                              }`}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Actions to correct */}
                  <div className="flex justify-between items-center border-t pt-4 flex-wrap gap-2">
                    <button
                      onClick={calculateQuizScore}
                      className="px-6 py-2.5 bg-gradient-to-r from-[#E91E63] to-pink-500 text-white font-black text-xs rounded-xl hover:-translate-y-0.5 transition cursor-pointer"
                    >
                      بدء التصحيح التلقائي للورقة
                    </button>

                    {correctedScore !== null && (
                      <div className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl text-xs font-bold border border-emerald-200">
                        النتيجة المحللة: <span className="font-mono text-sm font-black">{correctedScore}%</span>
                        {correctedScore >= 90 ? ' (ممتاز جداً)' : correctedScore >= 70 ? ' (جيد جداً)' : ' (يحتاج تركيز)'}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-60 flex items-center justify-center text-center text-gray-400 text-xs">
                يرجى تحديد اختبار من اللوحة اليمنى لعرض الأسئلة وتجريب شاشة التصحيح الفردي
              </div>
            )}
          </div>
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
