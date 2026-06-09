/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle,
  Truck,
  HeartPulse,
  Warehouse,
  FileText,
  ScanBarcode,
  MessageSquare,
  Send,
  Users,
  Search,
  Plus,
  AlertTriangle,
  Upload,
  Bot
} from 'lucide-react';
import {
  Student,
  Teacher,
  Employee,
  BookRecord,
  TransportRoute,
  MedicalLog,
  WarehouseItem,
  OCRDocument,
  Message
} from '../types';

interface OtherModulesProps {
  students: Student[];
  teachers: Teacher[];
  employees: Employee[];
  books: BookRecord[];
  routes: TransportRoute[];
  medicalLogs: MedicalLog[];
  warehouse: WarehouseItem[];
  ocrDocuments: OCRDocument[];
  messages: Message[];
  onAddOCRDocument: (doc: OCRDocument) => void;
  onSendMessage: (msg: Message) => void;
}

export const OtherModules: React.FC<OtherModulesProps> = ({
  students,
  teachers,
  employees,
  books,
  routes,
  medicalLogs,
  warehouse,
  ocrDocuments,
  messages,
  onAddOCRDocument,
  onSendMessage
}) => {
  const [panelTab, setPanelTab] = useState<'attendance' | 'library' | 'transport' | 'clinic' | 'warehouse' | 'dms' | 'comms'>('attendance');

  // Attendance tracker state
  const [attendanceRole, setAttendanceRole] = useState<'students' | 'teachers' | 'staff'>('students');
  const [tempAttendance, setTempAttendance] = useState<{ [id: string]: 'حاضر' | 'غائب' }>({});
  const [showSMSPreview, setShowSMSPreview] = useState<string | null>(null);

  // DMS Scanner State
  const [dmsSearch, setDmsSearch] = useState('');
  const [isScanningOCR, setIsScanningOCR] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<OCRDocument | null>(ocrDocuments[0]);

  // Library borrower popup state
  const [libSearch, setLibSearch] = useState('');

  // Comms State
  const [msgInput, setMsgInput] = useState('');
  const [msgChannel, setMsgChannel] = useState<'داخلي' | 'SMS' | 'WhatsApp'>('داخلي');
  const [msgReceiver, setMsgReceiver] = useState(students[0]?.parentPhone || '+966 50 123 4567');

  const handleSendMessageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!msgInput) return;

    onSendMessage({
      id: `MSG-${Math.floor(Math.random() * 90000 + 10000)}`,
      sender: "إدارة مدرسة حبيبة",
      receiver: msgReceiver,
      senderRole: "إدارة",
      text: msgInput,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      isRead: false,
      channel: msgChannel
    });

    setMsgInput('');
    alert(`تم إرسال الرسالة بنجاح عبر قناة: ${msgChannel}`);
  };

  // OCR Simulator
  const handleOCRFileSelect = () => {
    setIsScanningOCR(true);
    setTimeout(() => {
      onAddOCRDocument({
        id: `DOC-2026-0${ocrDocuments.length + 1}`,
        name: "تقرير فحص طبي مستجد مضاف.png",
        fileSize: "1.1 MB",
        uploadDate: new Date().toISOString().split('T')[0],
        digitalBarcode: `BARCODE-NEW-SCAN-${Math.floor(Math.random() * 9000 + 1000)}`,
        extractedText: "مستوصف مدرسة حبيبة الأكاديمي\nالبيان: فحص صحة المظهر والأسنان وسلامة العيون والمناعة\nالنتيجة العامة: الطالب بحالة سليمة تماماً ومؤهل للرحلات الخارجية الشديدة والأنشطة الرياضية.",
        isProcessed: true,
        category: "تقارير طيبة"
      });
      setIsScanningOCR(false);
      alert('✓ تم سحب الملف واستخراج النصوص بنجاح عبر محرك الذكاء الاصطناعي المدمج!');
    }, 2000); // 2s scanning laser simulation
  };

  return (
    <div className="space-y-6" id="other-modules-container">
      {/* Sub menu tabs in pink/white */}
      <div className="flex gap-2 pb-2 overflow-x-auto text-xs font-bold scrollbar-thin">
        {[
          { tabId: "attendance", label: "الحضور والغياب الموحد", icon: CheckCircle },
          { tabId: "library", label: "أمين المكتبة والاستعارات", icon: BookOpen },
          { tabId: "transport", label: "النقل والحافلات المدرسية", icon: Truck },
          { tabId: "clinic", label: "العيادة والصحة المدرسية", icon: HeartPulse },
          { tabId: "warehouse", label: "المستودع وجرد المواد", icon: Warehouse },
          { tabId: "dms", label: "أرشفة المستندات والـ OCR", icon: FileText },
          { tabId: "comms", label: "مركز اتصالات المدرسة", icon: MessageSquare },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.tabId}
              onClick={() => setPanelTab(item.tabId as any)}
              className={`px-4 py-3 rounded-xl border transition cursor-pointer flex items-center gap-1.5 shrink-0 select-none ${
                panelTab === item.tabId
                  ? 'border-[#E91E63] text-white bg-[#E91E63] glow-btn'
                  : 'border-gray-100 bg-white hover:bg-gray-50 text-gray-500 hover:text-gray-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* RENDER ACTIVE SUB PANEL */}

      {/* 1: ATTENDANCE Panel */}
      {panelTab === 'attendance' && (
        <div className="glass-panel p-5 rounded-2xl border border-pink-100 soft-shadow space-y-4" id="subview-attendance">
          <div className="flex justify-between items-center border-b pb-3 flex-wrap gap-2">
            <div>
              <h3 className="text-md font-bold text-gray-800">سجل الحضور والغياب اليومي الأوتوماتيكي</h3>
              <p className="text-xs text-gray-500">اختر الكادر لتسجيل حضور اليوم، سيتم تحديث نسب الحضور التراكمية فوراً.</p>
            </div>

            {/* Role switchers */}
            <div className="flex gap-1.5 text-xs">
              {[
                { r: 'students', label: 'الطلاب' },
                { r: 'teachers', label: 'المعلمين' },
                { r: 'staff', label: 'الموظفين والإدارة' },
              ].map((roleObj) => (
                <button
                  key={roleObj.r}
                  onClick={() => setAttendanceRole(roleObj.r as any)}
                  className={`px-3 py-1.5 rounded-lg font-bold border cursor-pointer select-none text-[11px] ${
                    attendanceRole === roleObj.r
                      ? 'bg-gray-800 text-white border-gray-800'
                      : 'border-gray-200 bg-white hover:bg-gray-50'
                  }`}
                >
                  {roleObj.label}
                </button>
              ))}
            </div>
          </div>

          {/* List layout and quick check toggle */}
          <div className="overflow-x-auto text-xs text-right">
            <table className="w-full border border-gray-100 divide-y divide-gray-100">
              <thead className="bg-pink-50/20 text-[#E91E63] font-bold">
                <tr>
                  <th className="p-3">صورة</th>
                  <th className="p-3">الاسم كامل</th>
                  <th className="p-3">الفوج / المادة</th>
                  <th className="p-3">معدل الانضباط الإجمالي</th>
                  <th className="p-3">تأكيد اليوم</th>
                  <th className="p-3 text-center">إشعار غياب تلقائي</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {attendanceRole === 'students' && students.map((stu) => {
                  const state = tempAttendance[stu.id] || 'حاضر';
                  return (
                    <tr key={stu.id} className="hover:bg-gray-50/30">
                      <td className="p-3"><img src={stu.avatar} className="w-8 h-8 rounded-full pointer-events-none object-cover" /></td>
                      <td className="p-3 font-semibold">{stu.name}</td>
                      <td className="p-3">{stu.classId}</td>
                      <td className="p-3 font-mono font-bold text-teal-600">{stu.attendanceRate}%</td>
                      <td className="p-3">
                        <button
                          onClick={() => setTempAttendance({ ...tempAttendance, [stu.id]: state === 'حاضر' ? 'غائب' : 'حاضر' })}
                          className={`px-3 py-1 rounded-lg font-bold select-none cursor-pointer ${
                            state === 'حاضر' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                          }`}
                        >
                          {state}
                        </button>
                      </td>
                      <td className="p-3 text-center">
                        {state === 'غائب' ? (
                          <button
                            onClick={() => setShowSMSPreview(`تذكير: تعلن إدار مدرسة حبيبة عن غياب ابنكم الحبيب ${stu.name} من حصة هذا اليوم. يرجى التواصل بقسم الرعاية للتوجيه.`)}
                            className="text-[10px] text-[#E91E63] hover:underline"
                          >
                            توليد رسالة ولي الأمر
                          </button>
                        ) : (
                          <span className="text-gray-300">-</span>
                        )}
                      </td>
                    </tr>
                  );
                })}

                {attendanceRole === 'teachers' && teachers.map((tch) => {
                  const state = tempAttendance[tch.id] || 'حاضر';
                  return (
                    <tr key={tch.id} className="hover:bg-gray-50/30">
                      <td className="p-3"><img src={tch.avatar} className="w-8 h-8 rounded-full pointer-events-none object-cover" /></td>
                      <td className="p-3 font-semibold">{tch.name}</td>
                      <td className="p-3">{tch.subject}</td>
                      <td className="p-3 font-mono font-bold text-teal-600">{tch.attendanceRate}%</td>
                      <td className="p-3">
                        <button
                          onClick={() => setTempAttendance({ ...tempAttendance, [tch.id]: state === 'حاضر' ? 'غائب' : 'حاضر' })}
                          className={`px-3 py-1 rounded-lg font-bold select-none cursor-pointer ${
                            state === 'حاضر' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                          }`}
                        >
                          {state}
                        </button>
                      </td>
                      <td className="p-3 text-center text-gray-400">-</td>
                    </tr>
                  );
                })}

                {attendanceRole === 'staff' && employees.map((emp) => {
                  const state = tempAttendance[emp.id] || 'حاضر';
                  return (
                    <tr key={emp.id} className="hover:bg-gray-50/30">
                      <td className="p-3"><img src={emp.avatar} className="w-8 h-8 rounded-full pointer-events-none object-cover" /></td>
                      <td className="p-3 font-semibold">{emp.name}</td>
                      <td className="p-3">{emp.role}</td>
                      <td className="p-3 font-mono font-bold text-teal-600">{emp.attendanceRate}%</td>
                      <td className="p-3">
                        <button
                          onClick={() => setTempAttendance({ ...tempAttendance, [emp.id]: state === 'حاضر' ? 'غائب' : 'حاضر' })}
                          className={`px-3 py-1 rounded-lg font-bold select-none cursor-pointer ${
                            state === 'حاضر' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                          }`}
                        >
                          {state}
                        </button>
                      </td>
                      <td className="p-3 text-center text-gray-400">-</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center pt-3 border-t">
            <span className="text-[10px] text-gray-400">تحقق دائماً من الغيابات، حيث يتم ربط النظام أوتوماتيكياً بجهاز قراءة المعالجة البيومترية.</span>
            <button
              onClick={() => alert('✓ تم أرشفة كشف الحضور والإنصراف وإيداعه بنظام حوكمة الأداء للوزارة.')}
              className="bg-gray-800 text-white font-bold px-4 py-2 rounded-xl text-xs hover:bg-gray-950 transition cursor-pointer"
            >
              اعتماد أرشفة الحضور اليومي
            </button>
          </div>

          {/* SMS absentee warning draft box */}
          {showSMSPreview && (
            <div className="bg-amber-50 text-amber-900 border border-amber-200 p-4 rounded-xl text-xs relative space-y-2 text-right">
              <span className="font-bold block text-sm">مسودة رسالة الـ SMS التلقائية لولي الأمر:</span>
              <p className="font-mono bg-white p-2.5 rounded border border-amber-100">{showSMSPreview}</p>
              <div className="flex gap-2 justify-end pt-1">
                <button
                  onClick={() => setShowSMSPreview(null)}
                  className="px-3 py-1 border rounded-lg hover:bg-white transition"
                >
                  إغلاق وتجاهل
                </button>
                <button
                  onClick={() => {
                    alert('✓ تم إرسال الرسالة القصيرة لهاتف الأب بنجاح عبر النظام المتكامل!');
                    setShowSMSPreview(null);
                  }}
                  className="px-4 py-1.5 bg-[#E91E63] text-white font-bold rounded-lg hover:bg-pink-650"
                >
                  إرسال SMS الآن
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2: LIBRARY Panel */}
      {panelTab === 'library' && (
        <div className="glass-panel p-5 rounded-2xl border border-pink-100 soft-shadow space-y-4" id="subview-library">
          <div className="flex justify-between items-center border-b pb-3 flex-wrap gap-2">
            <div>
              <h3 className="text-md font-bold text-gray-800">أمين المكتبة والكتب الرقمية</h3>
              <p className="text-xs text-gray-500">إعارة الكتب واسترجاع الطلاب بنقرة واحدة، مع روابط مطالعة لملفات PDF.</p>
            </div>

            <div className="relative text-xs">
              <input
                type="text"
                placeholder="ابحث بالاسم أو رمز الكتاب..."
                value={libSearch}
                onChange={(e) => setLibSearch(e.target.value)}
                className="pl-3 pr-10 py-1.5 border border-pink-100 rounded-xl focus:outline-none focus:border-[#E91E63]"
              />
              <Search className="w-4 h-4 text-gray-400 absolute right-3.5 top-2" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {books.filter(b => b.title.includes(libSearch) || b.id.includes(libSearch)).map((book) => (
              <div key={book.id} className="p-4 rounded-xl border border-gray-100 hover:border-pink-200 bg-white space-y-3 transition">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-mono text-[#E91E63] font-bold">{book.id} - {book.category}</span>
                    <h4 className="text-sm font-semibold text-gray-800">{book.title}</h4>
                    <p className="text-xs text-gray-500">للمؤلف: {book.author}</p>
                  </div>
                  <span className="text-xs font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded">
                    متوفر: {book.availableCopies} / {book.totalCopies}
                  </span>
                </div>

                <div className="border-t pt-2 space-y-1">
                  <p className="text-[11px] font-bold text-gray-500">قائمة المستعيرين النشطين والموعد:</p>
                  {book.borrowedBy.length > 0 ? (
                    book.borrowedBy.map((bRec, i) => (
                      <div key={i} className="flex justify-between text-xs text-gray-600 bg-gray-50 p-2 rounded-lg">
                        <span>{bRec.studentName}</span>
                        <span>حتى يوم {bRec.returnDate}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-[10px] text-gray-400">لا يوجد استعارات نشطة حالياً للنسخة الورقية.</p>
                  )}
                </div>

                <div className="flex gap-2 text-xs pt-1">
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      alert(`فتح معاينة كتاب: ${book.title}. الكتب الرقمية تم حمايتها بقفل تشفير مدرسة حبيبة.`);
                    }}
                    className="flex-1 text-center bg-[#E91E63]/5 text-[#E91E63] hover:bg-[#E91E63] hover:text-white transition py-2 rounded-xl font-bold cursor-pointer"
                  >
                    مطالعة نسخة الكتاب الرقمية
                  </a>
                  <button
                    onClick={() => {
                      alert('✓ تم تمديد الإعارة أسبوعين إضافيين مع إرسال تذكير بالبريد الإلكتروني.');
                    }}
                    className="border border-pink-100 text-pink-700 px-3 py-1.5 rounded-xl cursor-pointer hover:bg-pink-100 transition"
                  >
                    تمديد المدة
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3: TRANSPORT Panel */}
      {panelTab === 'transport' && (
        <div className="glass-panel p-5 rounded-2xl border border-pink-100 soft-shadow space-y-4" id="subview-transport">
          <div className="flex justify-between items-center border-b pb-3">
            <div>
              <h3 className="text-md font-bold text-gray-800">حافلات النقل وقنوات المسارات</h3>
              <p className="text-xs text-gray-500">متابعة السائقين، واللوحات الرسمية، والتعديل الفوري للمسار.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {routes.map((rt) => (
              <div key={rt.id} className="p-4 bg-white rounded-xl border border-gray-100 hover:border-pink-200 space-y-3 transition">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-black text-[#E91E63]">{rt.id} - {rt.routeName}</span>
                  <span className="text-[11px] bg-green-50 text-green-700 font-bold px-2 py-0.5 rounded-full">{rt.status}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                  <p><span className="font-semibold block text-gray-400">السائق:</span> {rt.driverName}</p>
                  <p><span className="font-semibold block text-gray-400">الهاتف:</span> {rt.driverPhone}</p>
                  <p><span className="font-semibold block text-gray-400">رقم اللوحة:</span> {rt.busNumber}</p>
                  <p><span className="font-semibold block text-gray-400">السعة والمقاعد:</span> {rt.occupied} / {rt.capacity} مقعد</p>
                </div>

                <div className="bg-pink-50/20 p-2.5 rounded-xl text-xs space-y-1">
                  <p className="font-bold text-[#E91E63]">محطات الوقوف المعتمدة بالترتيب:</p>
                  <div className="flex gap-2 flex-wrap pt-1 font-semibold text-gray-600">
                    {rt.stops.map((st, i) => (
                      <span key={i} className="bg-white px-2 py-0.5 rounded border border-gray-100">
                        {i + 1}. {st}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => alert(`محاكاة نظام GPS: حافلة مسار: ${rt.routeName} متواجدة حالياً على خط عرض 24.773 وخط طول 46.721 وتتحرك في الموعد.`)}
                  className="w-full text-center bg-gray-800 hover:bg-gray-950 text-white font-bold py-2 rounded-xl text-xs transition cursor-pointer"
                >
                  تتبع إشارة البث المباشر (GPS)
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4: CLINIC PANEL */}
      {panelTab === 'clinic' && (
        <div className="glass-panel p-5 rounded-2xl border border-pink-100 soft-shadow space-y-4" id="subview-clinic">
          <div className="flex justify-between items-center border-b pb-3">
            <div>
              <h3 className="text-md font-bold text-gray-800">جغرافيا الرعاية والصحة المدرسية</h3>
              <p className="text-xs text-gray-500">حصر ملفات وزيارات الحصانة الطبية والأدوية الطارئة ل ريان ويوسف وجولان ببراعة.</p>
            </div>
            <span className="text-xs text-red-500 bg-red-50 font-bold px-3 py-1 rounded-lg">طبيب المدرسة: د. عبد المجيد العلي</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Quick list of logs (Left 2 cols) */}
            <div className="lg:col-span-2 space-y-3">
              <h4 className="font-bold text-xs text-gray-600">آخر الفحوصات الطارئة بالوحدة</h4>
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {medicalLogs.map((log) => (
                  <div key={log.id} className="p-3.5 bg-white rounded-xl border border-gray-150 space-y-1">
                    <div className="flex justify-between">
                      <span className="font-bold text-gray-800">{log.studentName} ({log.className})</span>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                        log.severity === 'حرج' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        حالة {log.severity}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 font-semibold"><span className="text-[#E91E63]">التشخيص:</span> {log.diagnose}</p>
                    <p className="text-xs text-gray-500"><span className="text-[#E91E63]">العلاج المصروف:</span> {log.medication}</p>
                    <p className="text-[10px] text-gray-400 italic">"ملاحظة الممرض: {log.nurseNotes}"</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick alert box */}
            <div className="bg-red-50/20 rounded-2xl p-4 border border-dashed border-red-200 text-right space-y-3">
              <h4 className="text-xs font-black text-red-700 flex items-center gap-1">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                قائمة الفصائل والحالات الشائعة
              </h4>
              <p className="text-[11px] text-red-900 leading-relaxed">
                يرجى الانتباه إلى المعايير العلاجية لموسم الغبار القادم لمرضى الربو والحساسية المتواجدين بفصائل "+O" و "-A" بالمدرسة. تم حصر كافة أنابيب دواء الفولكودين المساعد.
              </p>
              <div className="divide-y text-[11px] font-mono">
                <div className="py-1.5 flex justify-between text-gray-700"><span>الأمراض المزمنة المسجلة:</span><span className="font-bold">2 طلاب</span></div>
                <div className="py-1.5 flex justify-between text-gray-700"><span>الحالات الموسمية الحالية:</span><span className="font-bold font-semibold text-amber-600">طالب واحد</span></div>
                <div className="py-1.5 flex justify-between text-gray-700"><span>مخزون الشاش والتعقيم:</span><span className="font-bold text-green-600">مكتمل</span></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5: WAREHOUSE PANEL */}
      {panelTab === 'warehouse' && (
        <div className="glass-panel p-5 rounded-2xl border border-pink-100 soft-shadow space-y-4" id="subview-warehouse">
          <div className="flex justify-between items-center border-b pb-3">
            <div>
              <h3 className="text-md font-bold text-gray-800">مستودع العتاد والمخزون الأكاديمي</h3>
              <p className="text-xs text-gray-500">جرد الأصناف، متابعة مستويات الأمان ومطابقة الموردون.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {warehouse.map((item) => {
              const lowStock = item.stock <= item.minStock;
              return (
                <div key={item.id} className="p-4 bg-white rounded-xl border border-gray-100 space-y-2 relative overflow-hidden">
                  {lowStock && (
                    <div className="absolute top-0 right-0 bg-amber-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-bl">
                      حد الأمان منخفض
                    </div>
                  )}

                  <span className="text-[10px] font-mono text-[#E91E63] font-bold">{item.sku} - {item.category}</span>
                  <h4 className="text-sm font-semibold text-gray-800">{item.name}</h4>

                  <div className="flex justify-between text-xs py-1 border-y border-dashed">
                    <div>
                      <span className="text-gray-400">الكمية المسجلة: </span>
                      <span className={`font-mono font-black ${lowStock ? 'text-amber-500' : 'text-gray-900'}`}>{item.stock} {item.unit}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">أقل سعة أمان: </span>
                      <span className="font-mono font-bold text-gray-500">{item.minStock} {item.unit}</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-gray-500"><span className="font-semibold block text-gray-400">المورد والموقع:</span> {item.supplierName} ({item.location})</p>

                  <button
                    onClick={() => {
                      alert(`✓ تم صياغة تذكرة أمر شراء وتأمين 100 وحدة إضافية من ${item.name} إلى ${item.supplierName}.`);
                    }}
                    className="w-full text-center bg-[#E91E63]/5 text-[#E91E63] hover:bg-[#E91E63] hover:text-white py-1.5 rounded-xl font-bold text-xs transition cursor-pointer"
                  >
                    أداء طلب تزويد وعقد توريد
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 6: DOCUMENTS DMS Panel with simulated Laser Scanner OCR */}
      {panelTab === 'dms' && (
        <div className="glass-panel p-5 rounded-2xl border border-pink-100 soft-shadow space-y-5" id="subview-dms">
          <div className="flex justify-between items-center border-b pb-3 flex-wrap gap-2">
            <div>
              <h3 className="text-md font-bold text-gray-800">أرشيف المستندات والـ OCR واستخراج النصوص</h3>
              <p className="text-xs text-gray-500">أرشفة رقمية متطورة مع باركود استحقاق واستخلاص المعطيات ذكياً.</p>
            </div>
            
            {/* mock uploader widget */}
            <div className="flex gap-2">
              <button
                onClick={handleOCRFileSelect}
                disabled={isScanningOCR}
                className="bg-[#E91E63] select-none text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50"
              >
                <Upload className="w-4 h-4" />
                {isScanningOCR ? 'جاري الفحص واستخلاص النصوص...' : 'رفع صورة لتصحيح الـ OCR'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* List left (5 cols) */}
            <div className="lg:col-span-4 space-y-2">
              <h4 className="font-bold text-xs text-gray-600">المستندات والفواتير السحابية المتوفرة</h4>
              <div className="space-y-2 max-h-[350px] overflow-y-auto">
                {ocrDocuments.map((doc) => (
                  <div
                    key={doc.id}
                    onClick={() => setSelectedDoc(doc)}
                    className={`p-3 rounded-xl border text-right transition cursor-pointer ${
                      selectedDoc?.id === doc.id ? 'border-[#E91E63] bg-pink-50/20' : 'border-gray-150 hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-[10px] font-semibold text-[#E91E63]">{doc.category}</span>
                    <h5 className="text-xs font-bold text-gray-800">{doc.name}</h5>
                    <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                      <span>{doc.uploadDate}</span>
                      <span>{doc.fileSize}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Read Panel right (8 cols) */}
            <div className="lg:col-span-8 p-5 rounded-2xl bg-gray-50 dark:bg-black/30 border space-y-4">
              {selectedDoc ? (
                <div className="space-y-4 text-right">
                  <div className="flex justify-between items-start border-b pb-3">
                    <div>
                      <span className="text-xs text-[#E91E63] font-bold bg-pink-100/50 px-2 py-0.5 rounded-full">معاينة استخراج المستند</span>
                      <h4 className="text-md font-bold text-gray-800 dark:text-white mt-1">{selectedDoc.name}</h4>
                    </div>

                    {/* Barcode representation */}
                    <div className="bg-white p-2 rounded border border-gray-100 flex flex-col items-center">
                      <div className="flex gap-[1px] h-6 items-stretch bg-gray-900 px-1 w-24">
                        {[1, 3, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3].map((w, index) => (
                          <div key={index} className="bg-white" style={{ flexGrow: w }} />
                        ))}
                      </div>
                      <span className="text-[7px] font-mono font-bold">{selectedDoc.digitalBarcode}</span>
                    </div>
                  </div>

                  {/* simulated animation reading scanner bar */}
                  {isScanningOCR ? (
                    <div className="h-40 bg-black/80 flex items-center justify-center text-center relative overflow-hidden rounded-xl border border-primary">
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-pink-500 animate-bounce" />
                      <span className="text-white text-xs font-bold font-mono">LASER OCR READING ENGINE ACTIVE...</span>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <h5 className="font-bold text-xs text-gray-500 uppercase flex items-center gap-1">
                        <Bot className="w-4 h-4 text-[#E91E63]" />
                        النص المستخلص من الصورة (OCR Text)
                      </h5>
                      <pre className="p-4 bg-white dark:bg-black/40 rounded-xl border text-xs font-sans text-gray-700 dark:text-gray-300 leading-relaxed max-h-56 overflow-y-auto whitespace-pre-wrap">
                        {selectedDoc.extractedText}
                      </pre>
                    </div>
                  )}

                  <div className="flex justify-between items-center text-xs text-gray-400">
                    <span>قوة استجرار النصوص: 98.4% دقة</span>
                    <button
                      onClick={() => alert(`تم نسخ النص المستخلص: ${selectedDoc.extractedText.slice(0, 50)}...`)}
                      className="text-xs text-[#E91E63] font-bold hover:underline"
                    >
                      نسخ النص بالكامل للحافظة
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-400 text-xs py-10">
                  يرجى تحديد مستند من اللوحة المجاورة لمعاينة تفاصيل الفواتير والتقارير الطبية
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 7: COMMS CENTER PANEL */}
      {panelTab === 'comms' && (
        <div className="glass-panel p-5 rounded-2xl border border-pink-100 soft-shadow space-y-4" id="subview-comms">
          <div className="border-b pb-3">
            <h3 className="text-md font-bold text-gray-800">مركز اتصالات المدرسة وبث التنبيهات</h3>
            <p className="text-xs text-gray-500">مراسلة ولي الأمر مباشرة، إرسال رسائل SMS وتوليد قنوات واتساب للأعمال.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 text-xs text-right">
            {/* Sender form (6 columns) */}
            <form onSubmit={handleSendMessageSubmit} className="md:col-span-7 space-y-4 bg-transparent">
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1 bg-transparent">
                  <label className="font-bold text-gray-700">قناة الإرسال الفورية</label>
                  <select
                    value={msgChannel}
                    onChange={(e) => setMsgChannel(e.target.value as any)}
                    className="w-full px-3 py-2 border rounded-xl bg-white"
                  >
                    <option value="داخلي">النظام الداخلي (بوابة ولي الأمر)</option>
                    <option value="SMS">الرسائل النصية التلقائية (SMS)</option>
                    <option value="WhatsApp">تطبيق واتساب للأعمال (WhatsApp)</option>
                  </select>
                </div>

                <div className="space-y-1 bg-transparent">
                  <label className="font-bold text-gray-700">رقم الهاتف أو اسم المستلم</label>
                  <input
                    type="text"
                    required
                    value={msgReceiver}
                    onChange={(e) => setMsgReceiver(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl text-left bg-white"
                  />
                </div>
              </div>

              <div className="space-y-1 bg-transparent">
                <label className="font-bold text-gray-700">محتوى الإشعار الصادر</label>
                <textarea
                  required
                  value={msgInput}
                  onChange={(e) => setMsgInput(e.target.value)}
                  placeholder="اكتب التذكير هنا.. مثال: أولياء الأمور الكرام، نلفت تذكيركم بموعد قيام الحافلات المدرسية لتفادي التأخر اليوم صباحاً."
                  className="w-full px-3 py-2 border rounded-xl h-24 bg-white"
                />
              </div>

              <button
                type="submit"
                className="glow-btn bg-[#E91E63] text-white font-bold px-6 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer hover:bg-pink-650"
              >
                <Send className="w-4 h-4" />
                إرسال الإشعار الفوري
              </button>
            </form>

            {/* Inbox stream right (5 columns) */}
            <div className="md:col-span-5 space-y-3">
              <h4 className="font-bold text-xs text-gray-650">سجل الإشعارات الصادرة مؤخراً بالمركز</h4>
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {messages.map((m) => (
                  <div key={m.id} className="p-3 bg-white rounded-xl border border-pink-50 text-right space-y-1">
                    <div className="flex justify-between text-[10px] text-gray-400 font-semibold mb-1">
                      <span className="text-[#E91E63] font-bold">{m.channel}</span>
                      <span>{m.timestamp}</span>
                    </div>
                    <p className="text-xs text-gray-800 leading-relaxed font-semibold">
                      <span className="text-gray-400 font-bold ml-1">إلى:</span> {m.receiver}
                    </p>
                    <p className="text-xs text-gray-600 italic">"{m.text}"</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
