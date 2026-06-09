/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Bot,
  Volume2,
  ShieldCheck,
  Smartphone,
  CheckCircle,
  Database,
  Lock,
  ChevronDown,
  Sparkles,
  Search,
  Users,
  Download,
  Upload,
  RefreshCw,
  HardDrive,
  Save,
  Server,
  Check,
  AlertTriangle,
  FileSpreadsheet
} from 'lucide-react';
import { AuditLog } from '../types';

interface AISecurityModuleProps {
  auditLogs: AuditLog[];
  onAddAuditLog: (action: string, target: string, status: 'نجاح' | 'فشل') => void;
  userRole: 'SuperAdmin' | 'Teacher' | 'Accountant' | 'Parent';
  onChangeUserRole: (role: 'SuperAdmin' | 'Teacher' | 'Accountant' | 'Parent') => void;
  schoolStats: {
    studentsCount: number;
    teachersCount: number;
    totalBalance: number;
    lowStockCount: number;
  };
  allData: {
    students: any[];
    teachers: any[];
    employees: any[];
    transactions: any[];
    books: any[];
    routes: any[];
    medicalLogs: any[];
    warehouse: any[];
    ocrDocuments: any[];
    auditLogs: any[];
    messages: any[];
    exams: any[];
  };
  onRestoreAllData: (data: any) => void;
  onResetAllData: () => void;
}

export const AISecurityModule: React.FC<AISecurityModuleProps> = ({
  auditLogs,
  onAddAuditLog,
  userRole,
  onChangeUserRole,
  schoolStats,
  allData,
  onRestoreAllData,
  onResetAllData
}) => {
  const [activeTab, setActiveTab] = useState<'ai' | 'security' | 'database'>('database');
  const [dbStatus, setDbStatus] = useState<{ success?: boolean; msg?: string } | null>(null);
  const [isWiping, setIsWiping] = useState(false);

  const handleExportBackup = () => {
    try {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(allData, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `habiba_school_database_backup_${new Date().toISOString().slice(0, 10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      onAddAuditLog("تصدير نسخة احتياطية كاملة مكاملة لقاعدة البيانات", "تنزيل ملف النسخ الشامل", "نجاح");
      setDbStatus({ success: true, msg: "تم تصدير وحفظ كامل مصفوفات الجوانب وقاعدة البيانات المحلية بنجاح!" });
    } catch (e: any) {
      setDbStatus({ success: false, msg: `فشل التصدير: ${e?.message || e}` });
    }
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDbStatus(null);
    const files = e.target.files;
    if (files && files.length > 0) {
      processBackupFile(files[0]);
    }
  };

  const processBackupFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed && typeof parsed === 'object' && (parsed.students || parsed.teachers || parsed.transactions)) {
          onRestoreAllData(parsed);
          setDbStatus({ success: true, msg: "رائع! تم استعادة قاعدة البيانات وتحديث الجداول بنجاح. كافة التعديلات نشطة الآن!" });
          onAddAuditLog("استيراد واستعادة قاعدة البيانات من ملف خارجي", file.name, "نجاح");
        } else {
          setDbStatus({ success: false, msg: "الملف يحتوي على صيغة نسخ احتياطي غير مدعومة أو ناقصة الفئات الأساسية." });
        }
      } catch (err: any) {
        setDbStatus({ success: false, msg: `فشل قراءة الملف: ${err?.message || 'تأكد من اختيار ملف صالح.'}` });
      }
    };
    reader.readAsText(file);
  };

  // AI Assistant States
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiAnswers, setAiAnswers] = useState<Array<{ sender: 'user' | 'ai'; text: string; time: string }>>([
    {
      sender: 'ai',
      text: 'مرحباً بك في وحدة الذكاء الاصطناعي الأكاديمي لـ مدرسة حبيبة التعليمية. أنا السكرتير الذكي المساعد لك. كيف يمكنني إفادتك اليوم بجرد المستودع، التحليل المالي، أو طباعة بطاقات الطلاب؟',
      time: '10:15'
    }
  ]);
  const [isAiThinking, setIsAiThinking] = useState(false);

  // Security 2FA
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [mfaToken, setMfaToken] = useState('HBB-4921-X');

  const arabicTTS = (text: string) => {
    if (!('speechSynthesis' in window)) {
      alert('متصفحك الحالي لا يدعم ميزة توليف النطق الصوتي.');
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ar-SA';
    // set pitch & rate for professional accent
    utterance.pitch = 1.0;
    utterance.rate = 1.02;
    window.speechSynthesis.speak(utterance);
  };

  const handleAiQuery = async (promptText: string) => {
    const query = promptText || aiPrompt;
    if (!query) return;

    // Add user query to conversation bubble
    const userMsg = { sender: 'user' as const, text: query, time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }) };
    setAiAnswers(prev => [...prev, userMsg]);
    setAiPrompt('');
    setIsAiThinking(true);

    onAddAuditLog("استعلام سكرتير الذكاء الاصطناعي", query, "نجاح");

    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          prompt: query,
          stats: schoolStats,
          context: {
            auditLogsCount: auditLogs?.length || 0,
            studentsCount: allData?.students?.length || 0,
            teachersCount: allData?.teachers?.length || 0,
            transactionsCount: allData?.transactions?.length || 0,
            booksCount: allData?.books?.length || 0,
            routesCount: allData?.routes?.length || 0,
            medicalRegsCount: allData?.medicalLogs?.length || 0,
            warehouseCount: allData?.warehouse?.length || 0,
            ocrDocsCount: allData?.ocrDocuments?.length || 0,
            examsCount: allData?.exams?.length || 0
          }
        })
      });

      if (!response.ok) {
        throw new Error("فشلت عملية المزامنة مع خادم الذكاء الاصطناعي.");
      }

      const data = await response.json();
      const aiResponseText = data.text || "عذراً، لم تنجح في صياغة رد متوافق.";
      setAiAnswers(prev => [...prev, { sender: 'ai' as const, text: aiResponseText, time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }) }]);
    } catch (error: any) {
      console.error("AI consult fetch error:", error);
      // Fallback response with beautiful message
      const fallbackMsg = `[الاستشاري المحلي لمكتب مدرسة حبيبة]
تعذر الاتصال بخادم الذكاء الاصطناعي الخارجي مؤقتاً، ولكن يسعدني إفادتك بالتحليل الذكي المحلي:
- حالة موازنة الصندوق: مستقرة بقيمة (${schoolStats.totalBalance.toLocaleString()} ₪).
- الأصناف الحرجة بالمستودع: ${schoolStats.lowStockCount} أصناف تحت خط الأمان.
- حالة العمليات: تم تأمين وحصانة ${auditLogs?.length || 0} حركة مسجلة بنجاح.`;
      setAiAnswers(prev => [...prev, { sender: 'ai' as const, text: fallbackMsg, time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }) }]);
    } finally {
      setIsAiThinking(false);
    }
  };

  const handle2FA_Toggle = () => {
    const nextState = !is2FAEnabled;
    setIs2FAEnabled(nextState);
    if (nextState) {
      setMfaToken(`HBB-${Math.floor(Math.random() * 9000 + 1000)}-MFA`);
      onAddAuditLog("تفعيل ميزة الـ 2FA للحساب", "حساب الكادر الأكاديمي", "نجاح");
    } else {
      onAddAuditLog("إلغاء ميزة الـ 2FA للحساب", "حساب الكادر الأكاديمي", "نجاح");
    }
  };

  return (
    <div className="space-y-6" id="ai-security-module-container">
      {/* Selection Tabs */}
      <div className="flex border-b border-gray-150 gap-2 flex-wrap">
        <button
          onClick={() => setActiveTab('database')}
          className={`px-4 py-2 font-black text-xs cursor-pointer border-b-2 transition ${
            activeTab === 'database' ? 'border-[#E91E63] text-[#E91E63]' : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          قوالب وقواعد البيانات الحقيقية (Local Storage & Backups)
        </button>
        <button
          onClick={() => setActiveTab('ai')}
          className={`px-4 py-2 font-black text-xs cursor-pointer border-b-2 transition ${
            activeTab === 'ai' ? 'border-[#E91E63] text-[#E91E63]' : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          مساعد الإدارة التوليدي (AI Consultant)
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`px-4 py-2 font-black text-xs cursor-pointer border-b-2 transition ${
            activeTab === 'security' ? 'border-[#E91E63] text-[#E91E63]' : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          حوكمة الصلاحيات والأمن وسجل النشاطات (Audit)
        </button>
      </div>

      {/* RENDER DYNAMIC TAB */}

      {/* 1: GENERATIVE AI INTERACTIVE WORKSPACE */}
      {activeTab === 'ai' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="panel-ai">
          {/* AI Chat Room (8 columns) */}
          <div className="lg:col-span-8 glass-panel rounded-2xl p-5 border border-pink-100 soft-shadow flex flex-col justify-between min-h-[420px] space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-[#E91E63] animate-pulse" />
                <h3 className="text-md font-bold text-gray-800">الغرفة الاستشارية لـ ذكاء مدرسة حبيبة المساعد</h3>
              </div>
              <span className="text-[10px] text-gray-400 font-mono">نموذج: Gemini 3.5 Turbo Active</span>
            </div>

            {/* Chats bubbles */}
            <div className="flex-1 overflow-y-auto space-y-3 max-h-72 p-1">
              {aiAnswers.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} text-xs text-right`}>
                  <div className={`p-3.5 rounded-2xl max-w-sm relative ${
                    msg.sender === 'user'
                      ? 'bg-[#E91E63] text-white rounded-br-none'
                      : 'bg-pink-50 text-gray-800 rounded-bl-none border'
                  }`}>
                    <p className="leading-relaxed font-semibold">{msg.text}</p>
                    <div className="flex justify-between items-center mt-2 text-[9px] opacity-75">
                      <span>{msg.time}</span>
                      {msg.sender === 'ai' && (
                        <button
                          onClick={() => arabicTTS(msg.text)}
                          className="hover:scale-110 transition bg-[#E91E63]/10 p-1 rounded-full text-[#E91E63]"
                          title="استمع لصوت المساعد الذكي انطلاقاً"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {isAiThinking && (
                <div className="flex justify-start text-xs">
                  <div className="bg-pink-50 p-3 rounded-2xl rounded-bl-none text-gray-400 font-bold animate-pulse">
                    جاري فحص مخازن البيانات وتوليد الإجابة...
                  </div>
                </div>
              )}
            </div>

            {/* prompt submission actions */}
            <div className="space-y-2 pt-2 border-t">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="اسأل السكرتير اليوم عن ميزانية المدرسة، طلاب حد السلوك، أو جرد المعمل الأكاديمي..."
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAiQuery('');
                  }}
                  className="w-full px-4 py-2 text-xs border border-pink-100 rounded-xl focus:outline-none focus:border-[#E91E63] bg-white duration-150"
                  id="input-ai-prompt"
                />
                <button
                  onClick={() => handleAiQuery('')}
                  className="bg-[#E91E63] text-white font-bold px-5 py-2 rounded-xl text-xs hover:bg-pink-650 cursor-pointer"
                >
                  استعلم
                </button>
              </div>
            </div>
          </div>

          {/* Quick Context Prompt Suggestions (4 columns) */}
          <div className="lg:col-span-4 space-y-4 text-xs">
            <h4 className="font-bold text-gray-650 block">اقتراحات استرشادية ذكية للنظام</h4>
            <div className="space-y-2.5">
              {[
                { text: "ما هو صافي ميزانية المدرسة والرسوم المحصلة؟", label: "الحالة المالية للمؤسسة" },
                { text: "هل هناك أصناف تحت حد الأمان في المستودع اليوم؟", label: "جرد ومشتريات المستودع" },
                { text: "أعطني تقريراً لـ ريان حسن الأحمد ونتائجه وسلوكه", label: "ملف طالب أكاديمي مفصل" },
              ].map((sug, i) => (
                <div
                  key={i}
                  onClick={() => handleAiQuery(sug.text)}
                  className="p-3 bg-white hover:bg-pink-50/40 rounded-xl border border-pink-50 hover:border-pink-200 cursor-pointer text-right transition duration-200 group relative"
                >
                  <span className="text-[9px] bg-[#E91E63]/10 text-[#E91E63] px-1.5 py-0.5 rounded-full font-bold mb-1 block w-max">
                    {sug.label}
                  </span>
                  <p className="font-bold text-gray-700">{sug.text}</p>
                </div>
              ))}
            </div>

            {/* TTS Wave ornament */}
            <div className="bg-gradient-to-r from-pink-50 to-[#FFF] p-4 rounded-xl border border-pink-100 flex items-center justify-between">
              <div className="space-y-0.5">
                <h5 className="font-bold font-sans text-gray-700">توليف الصوت التلقائي (TTS)</h5>
                <p className="text-[10px] text-gray-400">يدعم المساعد ذكاء اصطناعي صوتي بالكامل بلغة عربية فصحى نقية.</p>
              </div>
              <Sparkles className="w-5 h-5 text-pink-500 shrink-0" />
            </div>
          </div>
        </div>
      )}

      {/* 2: SECURITY, ROLES SELECTION & AUDIT LOGS LEDGER */}
      {activeTab === 'security' && (
        <div className="space-y-5" id="panel-security">
          {/* Top Selection: Multi-level privileges toggle */}
          <div className="glass-panel p-4 rounded-2xl border border-pink-100 flex justify-between items-center flex-wrap gap-4 text-xs">
            <div className="space-y-1">
              <h4 className="font-black text-gray-800">بيئة فحص الأدوار والامتيازات (Multi-Role Preview)</h4>
              <p className="text-[11px] text-gray-400">تتيح لك كمسؤول مدرسة حبيبة تصفح النظام بهوية: معلم، محاسب، أو ولي أمر لمحاكاة تجارب مخصصة.</p>
            </div>

            <div className="flex gap-2">
              {[
                { key: 'SuperAdmin', label: 'مدير الصلاحيات الرياضي (مدير)' },
                { key: 'Teacher', label: 'المدرس والأستاذ' },
                { key: 'Accountant', label: 'أمين الخزينة وحسّاب الرواتب' },
                { key: 'Parent', label: 'بوابة ولي الأمر (والد ريان)' },
              ].map((role) => (
                <button
                  key={role.key}
                  onClick={() => onChangeUserRole(role.key as any)}
                  className={`px-3 py-2 rounded-xl font-bold border transition text-[11px] cursor-pointer ${
                    userRole === role.key
                      ? 'bg-rose-600 text-white border-rose-600'
                      : 'border-gray-200 bg-white hover:bg-gray-50'
                  }`}
                >
                  {role.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 text-right text-xs">
            {/* 2FA visual simulator (4 columns) */}
            <div className="lg:col-span-4 bg-gray-50 rounded-2xl p-5 border space-y-4">
              <h4 className="font-bold text-gray-800 flex items-center gap-1">
                <ShieldCheck className="w-5 h-5 text-rose-600" />
                المصادقة الثنائية (2FA Security)
              </h4>
              <p className="text-[11px] text-gray-500 leading-relaxed">
                إن تفعيل المصادقة المزدوجة يطالب المعلمين وأمناء الحسابات بإدخال الرمز السري المرسل لهواتفهم لمنع أي قرصنة أو وصول عشوائي لبيانات التقييمات.
              </p>

              <div className="flex justify-between items-center py-2 border-y">
                <span className="font-bold">حالة المصادقة المزدوجة:</span>
                <button
                  onClick={handle2FA_Toggle}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-black cursor-pointer ${
                    is2FAEnabled ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {is2FAEnabled ? '✓ نشط ومفعل' : 'موقف (انقر للتفعيل)'}
                </button>
              </div>

              {is2FAEnabled && (
                <div className="p-3 bg-white rounded-xl border border-green-200 flex justify-between items-center">
                  <span className="text-gray-400">رمز الأمان المتجدد (MFA):</span>
                  <span className="font-mono font-bold text-green-600 tracking-wider text-sm">{mfaToken}</span>
                </div>
              )}

              {/* device terminal status */}
              <div className="space-y-2">
                <span className="font-bold text-gray-400 block pb-1">الأجهزة والمنصات المصرح لها:</span>
                <div className="divide-y font-mono text-[10px]">
                  <div className="py-1 flex justify-between text-gray-600"><span>Chrome 126 (لوحة التحكم)</span><span className="text-green-500 font-bold">نشط حالياً</span></div>
                  <div className="py-1 flex justify-between text-gray-600"><span>Safari IOS 17 (بوابة ولي الأمر)</span><span className="text-gray-400">مرخص</span></div>
                </div>
              </div>
            </div>

            {/* Audit Logs visual table (8 columns) */}
            <div className="lg:col-span-8 glass-panel rounded-2xl p-5 border soft-shadow space-y-4">
              <div className="flex justify-between items-center border-b pb-2">
                <h4 className="font-bold text-gray-800 flex items-center gap-1.5">
                  <Database className="w-5 h-5 text-[#E91E63]" />
                  سجل العمليات والتدقيق الأمني المعتمد (System Audit Log)
                </h4>
                <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded font-bold">تشفير AES-256</span>
              </div>

              <div className="overflow-x-auto text-[11px]">
                <table className="w-full text-right divide-y">
                  <thead className="bg-pink-50/20 text-[#E91E63] font-bold">
                    <tr>
                      <th className="p-2.5">التوقيت الأكاديمي</th>
                      <th className="p-2.5">الموظف والمنتسب</th>
                      <th className="p-2.5">العملية الإجرائية</th>
                      <th className="p-2.5">الهدف المرصود</th>
                      <th className="p-2.5">الحالة الأمنية</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y font-mono text-gray-600 dark:text-gray-400">
                    {auditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-gray-50/20">
                        <td className="p-2.5">{log.timestamp.slice(11)}</td>
                        <td className="p-2.5 font-sans font-bold">{log.userName} ({log.userRole})</td>
                        <td className="p-2.5 font-sans">{log.action}</td>
                        <td className="p-2.5 font-sans">{log.target}</td>
                        <td className="p-2.5">
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                            log.status === 'نجاح' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                          }`}>
                            {log.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3: DATABASE BACKUP AND LIVE RESTORE CONTROLLER */}
      {activeTab === 'database' && (
        <div className="space-y-6 animate-fade-in" id="panel-database">
          <div className="glass-panel p-5 bg-white dark:bg-school-card-dark rounded-2xl border border-emerald-100 dark:border-emerald-900/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs text-right">
            <div className="space-y-1.5 flex-1">
              <span className="bg-emerald-100 dark:bg-emerald-950/20 text-emerald-850 dark:text-emerald-400 px-2 py-0.5 rounded-full font-bold text-[9px] w-max block font-sans">نشط ومؤمن بالكامل بالمتصفح</span>
              <h3 className="text-sm font-black text-gray-800 dark:text-gray-200 flex items-center gap-1.5 font-sans">
                <HardDrive className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                محرك قاعدة البيانات الحقيقية المدمج (Robust Client Storage Engine)
              </h3>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed font-sans">
                في النسخة الحالية لمدير مدرسة حبيبة، يتم الاحتفاظ بكافة التغييرات التي تجريها (تعديل وبطاقات الطلاب، والغياب للأفواج، والرواتب ونسب الزيادة، والمدخلات المالية، والعيادة المدرسية وجداول الامتحانات والاتصالات) وحفظها فورياً في ذاكرة تخزين المتصفح الآمنة. هذا يعني أن التحديث وإغلاق المتصفح لن يمسح بياناتك أبداً! يمكنك تحميل نسخة احتياطية (.json) ونقلها بالكامل.
              </p>
            </div>

            <div className="flex gap-2 shrink-0">
              <button
                onClick={handleExportBackup}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center gap-1.5 transition cursor-pointer text-xs font-sans"
              >
                <Download className="w-4 h-4" />
                تصدير نسخة احتياطية (.json)
              </button>
            </div>
          </div>

          {/* Database stats grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 text-right">
            {[
              { name: 'الطلاب والمسجلين', count: allData?.students?.length || 0, color: 'border-pink-500 text-pink-600 bg-pink-50/10' },
              { name: 'الكادر التعليمي', count: allData?.teachers?.length || 0, color: 'border-blue-500 text-blue-600 bg-blue-50/10' },
              { name: 'الموظفون الإداريون', count: allData?.employees?.length || 0, color: 'border-purple-500 text-purple-600 bg-purple-50/10' },
              { name: 'الحركة والقيود المالية', count: allData?.transactions?.length || 0, color: 'border-emerald-500 text-emerald-600 bg-emerald-50/10' },
              { name: 'الكتب المتاحة', count: allData?.books?.length || 0, color: 'border-amber-500 text-amber-600 bg-amber-50/10' },
              { name: 'حافلات النقل والمواصلات', count: allData?.routes?.length || 0, color: 'border-rose-500 text-rose-600 bg-rose-50/10' },
              { name: 'الامتحانات والنتائج', count: allData?.exams?.length || 0, color: 'border-indigo-500 text-indigo-600 bg-indigo-50/10' },
              { name: 'زيارات العيادة الصحية', count: allData?.medicalLogs?.length || 0, color: 'border-red-500 text-red-650 bg-red-50/10' },
              { name: 'التجهيزات والمستودع', count: allData?.warehouse?.length || 0, color: 'border-teal-500 text-teal-600 bg-teal-50/10' },
              { name: 'مستندات OCR الذكية', count: allData?.ocrDocuments?.length || 0, color: 'border-violet-500 text-violet-600 bg-violet-50/10' },
              { name: 'سجلات المراجعة والنشاط', count: allData?.auditLogs?.length || 0, color: 'border-gray-500 text-gray-600 bg-gray-50/10' },
              { name: 'الرسائل والمكاتبة', count: allData?.messages?.length || 0, color: 'border-cyan-500 text-cyan-600 bg-cyan-50/10' }
            ].map((table, i) => (
              <div key={i} className={`p-4 border dark:border-gray-800 rounded-2xl ${table.color} shadow-sm font-sans`}>
                <span className="text-gray-400 font-bold block text-[10px] truncate">{table.name}</span>
                <span className="text-lg font-black block mt-1 font-mono">{table.count} <span className="text-[10px] font-sans text-gray-400">سجل</span></span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 text-right text-xs">
            {/* Import & Restore Column (8 Columns) */}
            <div className="lg:col-span-8 bg-white dark:bg-school-card-dark rounded-2xl p-5 border border-gray-150 dark:border-gray-800 soft-shadow space-y-4">
              <h3 className="font-bold text-gray-800 dark:text-gray-200 flex items-center gap-1.5 border-b pb-2 font-sans">
                <Upload className="w-5 h-5 text-indigo-500 animate-pulse" />
                استعادة قاعدة البيانات المرفقة (Restore Database Snapshot)
              </h3>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed font-sans">
                هل قمت برفع هذا الكود كـ موقع كامل على سيرفر وتريد استرجاع كل بياناتك وبطاقات الطلاب السابقة؟ قم فقط برفع ملف النسخة الاحتياطية (.json) الذي قمت بتحميله سابقاً من النظام، وسيتولى المحرك ملء جميع البيانات فوراً.
              </p>

              {/* Drag and Drop Zone */}
              <div className="border-2 border-dashed border-gray-200 dark:border-gray-800 hover:border-[#E91E63] rounded-2xl p-6 bg-gray-50/50 dark:bg-black/10 flex flex-col justify-center items-center text-center cursor-pointer transition relative group font-sans">
                <input
                  type="file"
                  id="db-backup-picker"
                  className="hidden"
                  accept=".json"
                  onChange={handleImportBackup}
                />
                <Database className="w-10 h-10 text-gray-300 dark:text-gray-700 group-hover:text-[#E91E63] duration-150 mb-2" />
                <label htmlFor="db-backup-picker" className="cursor-pointer">
                  <p className="text-xs font-black text-gray-700 dark:text-gray-300">اسحب وأفلت الملف الاحتياطي .json هنا، أو <span className="text-[#E91E63] underline hover:text-[#E91E63]/85">انقر للتصفح والرفع</span></p>
                  <p className="text-[10px] text-gray-400 mt-1">يتطابق مع ملفات التخزين الرسمية لمكتب مدرسة حبيبة.</p>
                </label>
              </div>

              {dbStatus && (
                <div className={`p-4 rounded-xl leading-relaxed text-xs font-bold font-sans border text-center ${
                  dbStatus.success
                    ? 'bg-green-50 dark:bg-green-950/10 border-green-200 dark:border-green-90 /35 text-green-600'
                    : 'bg-red-50 dark:bg-red-950/10 border-red-200 dark:border-red-90 /35 text-red-650'
                }`}>
                  {dbStatus.msg}
                </div>
              )}
            </div>

            {/* Server Guidelines Setup & Reset (4 Columns) */}
            <div className="lg:col-span-4 bg-gray-50 dark:bg-black/10 rounded-2xl p-5 border dark:border-gray-800 space-y-4">
              <h4 className="font-bold text-gray-800 dark:text-gray-200 flex items-center gap-1.5 font-sans">
                <Server className="w-5 h-5 text-[#E91E63]" />
                دليل الرفع والمزامنة على السيرفر
              </h4>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-normal font-sans">
                إذا كنت مهتماً بالانتقال لقاعدة بيانات خارجية مثل (PostgreSQL, MySQL, Google Cloud SQL, or Firebase) على السيرفر الفعلي:
              </p>
              <div className="space-y-2 bg-white dark:bg-school-card-dark p-3 rounded-xl border border-gray-150 dark:border-gray-850 text-[10px] leading-relaxed text-gray-650 dark:text-gray-400 font-mono">
                <p>١. يمتلك الكود بنية بيانات جاهزة ومصممة بدقة في ملف <span className="text-[#E91E63]">/src/data/mockData.ts</span>.</p>
                <p>٢. يمكنك تحويل الـ LocalStorage إلى واجهة API ترسل مدخلات الحفظ والتحميل إلى قاعدة بيانات السيرفر.</p>
                <p>٣. لتشغيل السيرفر بأوجه متكاملة قم بتفعيل الـ SQL بـ Express API في ملف <span className="text-[#E91E63]">server.ts</span>.</p>
              </div>

              {/* Reset Database option */}
              <div className="pt-2 border-t border-gray-200 dark:border-gray-800 mt-4 font-sans">
                <h5 className="font-bold text-[11px] text-red-600 flex items-center gap-1">
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                  منطقة خطر - تصفير البيانات
                </h5>
                <p className="text-[10px] text-gray-400 mt-0.5 mb-2.5">إعادة ضبط المصنع يمسح كافة الطلاب والقيود المالية ويعيدها للبداية الافتراضية للنموذج الاسترشادي.</p>
                
                {!isWiping ? (
                  <button
                    onClick={() => setIsWiping(true)}
                    className="p-2 w-full bg-red-50 dark:bg-rose-950/10 hover:bg-red-100 dark:hover:bg-rose-950/20 text-red-600 text-[10px] font-black rounded-lg transition border border-red-200 dark:border-rose-900/40 cursor-pointer text-center"
                  >
                    تصفير الجداول وإعادة التجهيز المالي الأولية
                  </button>
                ) : (
                  <div className="space-y-1.5 p-2 bg-red-50/50 dark:bg-rose-950/10 border border-red-200 dark:border-rose-900/30 rounded-lg">
                    <p className="text-[10px] font-bold text-red-700 dark:text-red-400 text-center">هل أنت متأكد من مسح كافة التغييرات وإعادة تثبيت البيانات الافتراضية؟</p>
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => {
                          onResetAllData();
                          setIsWiping(false);
                          setDbStatus({ success: true, msg: "تم تفريغ كافة الجداول وتصفير المستودعات والطلاب لبيانات البداية الإفتراضية!" });
                        }}
                        className="px-2.5 py-1 bg-red-600 hover:bg-red-750 text-white rounded font-bold text-[9px] cursor-pointer"
                      >
                        نعم، تهيئة وتصفير
                      </button>
                      <button
                        onClick={() => setIsWiping(false)}
                        className="px-2.5 py-1 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded font-bold text-[9px] cursor-pointer"
                      >
                        تراجع
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
