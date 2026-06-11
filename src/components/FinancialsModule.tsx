/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Plus,
  CreditCard,
  Printer,
  FileText,
  Percent,
  Coins,
  ArrowUpRight,
  TrendingUp as SparkIcon,
  Download,
  Upload,
  FileSpreadsheet
} from 'lucide-react';
import { FinanceTransaction } from '../types';
import {
  exportFinancialsToExcel,
  downloadFinancialsTemplate,
  parseExcelFile,
  mapExcelToTransactions
} from '../utils/excelHelper';

interface FinancialsModuleProps {
  transactions: FinanceTransaction[];
  onAddTransaction: (tr: Omit<FinanceTransaction, 'id' | 'referenceNo' | 'status'>) => void;
  studentsList: { id: string; name: string; feesTotal: number; feesPaid: number }[];
  onPayStudentFees: (stuId: string, amount: number) => void;
  onImportTransactions?: (transactions: Omit<FinanceTransaction, 'id' | 'referenceNo' | 'status'>[]) => void;
}

export const FinancialsModule: React.FC<FinancialsModuleProps> = ({
  transactions,
  onAddTransaction,
  studentsList,
  onPayStudentFees,
  onImportTransactions
}) => {
  const [showAddTrModal, setShowAddTrModal] = useState(false);
  const [showPayFeesModal, setShowPayFeesModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<FinanceTransaction | null>(null);

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
        setImportStatus({ success: false, msg: 'المصنف فارغ أو غير منسق بتطابق.' });
        return;
      }
      const mapped = mapExcelToTransactions(rows);
      if (onImportTransactions) {
        onImportTransactions(mapped);
        setImportStatus({ success: true, msg: `تم استيراد عدد (${mapped.length}) قيود مالية ومستندات محاسبية بنجاح وتحديث الرصيد الاحتياطي!` });
      } else {
        setImportStatus({ success: false, msg: 'لم يكتمل الاستيراد، يرجى إعادة المحاولة.' });
      }
    } catch (err: any) {
      setImportStatus({ success: false, msg: `تنبيه: فشلت المعالجة المباشرة للمستند: ${err?.message || 'تأكد من عناوين الأعمدة بالنموذج.'}` });
    }
  };

  // States for general transaction
  const [trType, setTrType] = useState<'إيراد' | 'مصروف'>('إيراد');
  const [trCategory, setTrCategory] = useState('دعم موازنة الرواتب');
  const [trAmount, setTrAmount] = useState('');
  const [trMethod, setTrMethod] = useState<'نقدي' | 'مدى' | 'فيزا / ماستر كارد' | 'تحويل بنكي'>('مدى');
  const [trDesc, setTrDesc] = useState('');

  // States for student fee payment checkout sandbox (kept for interface/prop stability but unused in rendering)
  const [payStuId, setPayStuId] = useState(studentsList[0]?.id || '');
  const [payAmount, setPayAmount] = useState('3750');
  const [cardNumber, setCardNumber] = useState('4111 2222 3333 4444');
  const [cardHolder, setCardHolder] = useState('مجد عبد الله البشري');
  const [cardExpiry, setCardExpiry] = useState('09/29');
  const [cardCVV, setCardCVV] = useState('114');
  const [isProcessingPay, setIsProcessingPay] = useState(false);
  const [paySuccessMsg, setPaySuccessMsg] = useState(false);

  // Totals calculations
  const totalRevenues = transactions
    .filter(t => t.type === 'إيراد' && t.status === 'مكتمل')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'مصروف' && t.status === 'مكتمل')
    .reduce((sum, t) => sum + t.amount, 0);

  const netSavings = totalRevenues - totalExpenses;

  const handleGeneralSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = Number(trAmount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) return;

    onAddTransaction({
      type: trType,
      category: trCategory,
      amount: parsedAmount,
      date: new Date().toISOString().split('T')[0],
      paymentMethod: trMethod,
      description: trDesc || `${trType} - ${trCategory}`
    });

    // Reset
    setTrAmount('');
    setTrDesc('');
    setShowAddTrModal(false);
  };

  const handleSandboxPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payStuId || !payAmount) return;
    setIsProcessingPay(true);

    setTimeout(() => {
      // Simulate API and trigger callback
      onPayStudentFees(payStuId, Number(payAmount));
      
      onAddTransaction({
        type: 'إيراد',
        category: 'رسوم دراسية',
        amount: Number(payAmount),
        date: new Date().toISOString().split('T')[0],
        paymentMethod: 'فيزا / ماستر كارد',
        description: `قسط رسوم دراسية عبر البوابة الإلكترونية للطالب ${studentsList.find(s => s.id === payStuId)?.name}`
      });

      setIsProcessingPay(false);
      setPaySuccessMsg(true);

      setTimeout(() => {
        setPaySuccessMsg(false);
        setShowPayFeesModal(false);
      }, 2000);
    }, 1500); // 1.5s simulated secure delay
  };

  return (
    <div className="space-y-6" id="financials-module-container">
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-800 dark:text-white inline-flex items-center gap-2">
            <DollarSign className="w-7 h-7 text-[#E91E63]" />
            الحسابات والموازنة العامة للمدرسة
          </h1>
          <p className="text-xs text-gray-500 mt-1">توليد القيود وإيصالات الصرف والقبض، ومتابعة الرواتب وميزانية الكادر التعليمي والإداري</p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          <button
            onClick={() => setShowExcelSection(!showExcelSection)}
            className={`px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 text-xs transition cursor-pointer border ${
              showExcelSection 
                ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 border-emerald-200 dark:border-emerald-800' 
                : 'bg-white dark:bg-school-card-dark text-gray-700 dark:text-gray-300 border-gray-150 dark:border-gray-850 hover:border-[#E91E63]/30 hover:text-[#E91E63]'
            }`}
            id="btn-toggle-excel-financials"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
            عمليات إكسل Excel
          </button>

          <button
            onClick={() => setShowAddTrModal(true)}
            className="bg-gray-800 hover:bg-gray-950 text-white select-none px-4 py-2.5 rounded-xl font-bold flex items-center gap-1.5 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            قيد مالي (صرف / قبض)
          </button>
        </div>
      </div>

      {/* Excel Section Block */}
      {showExcelSection && (
        <div className="bg-white dark:bg-school-card-dark border border-dashed border-emerald-200 dark:border-emerald-950/40 p-5 rounded-2xl space-y-4 shadow-sm animate-fade-in" id="excel-financials-section">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3 border-b pb-3 border-gray-100 dark:border-gray-800/45">
            <div>
              <h3 className="text-sm font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5" />
                المحاسب الذكي - حركة الدخل والقيود المحاسبية عبر Excel
              </h3>
              <p className="text-[11px] text-gray-400 mt-0.5">يمكنك تصدير كشف الموازنة العامة والقيود المحاسبية الحالية فوراً، أو إلحاق معاملات وصرفيات جديدة بسحبها هنا</p>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <button
                onClick={downloadFinancialsTemplate}
                className="p-2 px-3.5 bg-gray-50 hover:bg-gray-100 dark:bg-black/10 dark:hover:bg-black/20 text-[11px] font-bold rounded-xl text-gray-650 dark:text-gray-350 flex items-center gap-1.5 transition border cursor-pointer border-gray-100 dark:border-gray-800"
              >
                <Download className="w-3.5 h-3.5 text-blue-500" />
                تحميل نموذج القيود المالي (.xlsx)
              </button>

              <button
                onClick={() => exportFinancialsToExcel(transactions)}
                className="p-2 px-3.5 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/10 dark:hover:bg-emerald-950/20 text-[11px] font-bold rounded-xl text-emerald-650 dark:text-emerald-400 flex items-center gap-1.5 transition border cursor-pointer border-emerald-100 dark:border-emerald-900/30"
              >
                <Download className="w-3.5 h-3.5 text-emerald-500" />
                تصدير القيود والموازنة إلى إكسل
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
              id="financials-excel-file"
              className="hidden"
              accept=".xlsx, .xls, .csv"
              onChange={handleFileSelect}
            />
            
            <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-950/20 rounded-full flex items-center justify-center text-emerald-500 mb-1">
              <Upload className="w-6 h-6 animate-bounce" />
            </div>

            <label htmlFor="financials-excel-file" className="cursor-pointer">
              <p className="text-xs font-black text-gray-700 dark:text-gray-250">
                اسحب وأفلت ملف البند المالي هنا، أو <span className="text-[#E91E63] underline hover:text-pink-600">انقر للتصفح والرفع</span>
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

      {/* Financial stats summary blocks */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="glass-panel p-5 rounded-2xl soft-shadow text-right border-r-4 border-emerald-500">
          <p className="text-xs text-gray-400 font-semibold">إجمالي المخصصات والدعم (الإيرادات)</p>
          <div className="flex justify-between items-center mt-2">
            <span className="text-2xl font-black text-emerald-600">{totalRevenues.toLocaleString()} ₪</span>
            <TrendingUp className="w-6 h-6 text-emerald-500" />
          </div>
          <span className="text-[10px] text-gray-400 block mt-1">تشمل دعم موازنة المدرسة بدعم خارجي وتبرعات مخصصة للرواتب</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl soft-shadow text-right border-r-4 border-amber-500">
          <p className="text-xs text-gray-400 font-semibold">إجمالي مصروفات الرواتب والأجور</p>
          <div className="flex justify-between items-center mt-2">
            <span className="text-2xl font-black text-amber-600">{totalExpenses.toLocaleString()} ₪</span>
            <TrendingDown className="w-6 h-6 text-amber-500" />
          </div>
          <span className="text-[10px] text-gray-400 block mt-1">تشمل رواتب المعلمين والمعلمات وموظفي الكادر الإداري المسددة</span>
        </div>

        <div className="bg-gradient-to-br from-[#E91E63]/5 to-[#FFF] dark:from-pink-950/10 dark:to-school-card-dark p-5 rounded-2xl border border-[#E91E63]/10 soft-shadow text-right">
          <p className="text-xs text-gray-400 font-semibold">صافي المتبقي من صندوق الرواتب والموازنة</p>
          <div className="flex justify-between items-center mt-2">
            <span className="text-2xl font-black text-[#E91E63]">{netSavings.toLocaleString()} ₪</span>
            <Coins className="w-6 h-6 text-[#E91E63]" />
          </div>
          <span className="text-[10px] text-gray-400 block mt-1">الرصيد الاحتياطي المتوفر لبند الرواتب والعمليات الأساسية المباشرة</span>
        </div>
      </div>

      {/* Transaction History Register */}
      <div className="glass-panel rounded-2xl p-5 border border-[#E91E63]/10 soft-shadow space-y-4">
        <div className="flex justify-between items-center pb-3 border-b border-gray-100 dark:border-gray-800">
          <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300">دفتر المعاملات والقيود المحاسبية</h3>
          <span className="text-[11px] font-mono text-gray-400">آخر التحديثات: {new Date().toISOString().split('T')[0]}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-right divide-y divide-gray-100 dark:divide-gray-800">
            <thead className="bg-pink-50/20 text-[#E91E63] font-bold">
              <tr>
                <th className="p-3">رقم المرجع القياسي</th>
                <th className="p-3">نوع الحركة</th>
                <th className="p-3">التصنيف المحاسبي</th>
                <th className="p-3">طريقة السداد</th>
                <th className="p-3">تاريخ القيد</th>
                <th className="p-3">المبلغ الصافي</th>
                <th className="p-3 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-gray-700 dark:text-gray-300">
              {transactions.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50/40 dark:hover:bg-black/10">
                  <td className="p-3 font-mono font-bold text-gray-500">{t.id}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      t.type === 'إيراد' ? 'bg-green-50 text-green-600 dark:bg-green-950/20' : 'bg-amber-50 text-amber-600 dark:bg-amber-950/10'
                    }`}>
                      {t.type}
                    </span>
                  </td>
                  <td className="p-3 font-bold">{t.category}</td>
                  <td className="p-3">{t.paymentMethod}</td>
                  <td className="p-3">{t.date}</td>
                  <td className="p-3 font-mono font-extrabold text-[#E91E63]">{t.amount.toLocaleString()} ₪</td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => setSelectedInvoice(t)}
                      className="px-2.5 py-1 rounded bg-[#E91E63]/5 hover:bg-[#E91E63] hover:text-white text-[#E91E63] font-bold text-[10px] transition cursor-pointer inline-flex items-center gap-1"
                      id={`btn-view-invoice-${t.id}`}
                    >
                      <Printer className="w-3 h-3" />
                      طباعة السند
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Model 1: Create General accounting transaction record */}
      {showAddTrModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-school-card-dark rounded-3xl p-6 max-w-md w-full soft-shadow relative text-right space-y-4">
            <h2 className="text-lg font-black text-[#E91E63] border-b pb-2">سند قيد مالي يدوي جديد</h2>
            
            <form onSubmit={handleGeneralSubmit} className="space-y-4 text-xs bg-transparent">
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">نوع الحركة</label>
                  <select
                    value={trType}
                    onChange={(e) => {
                      setTrType(e.target.value as 'إيراد' | 'مصروف');
                      // set default category based on type
                      setTrCategory(e.target.value === 'إيراد' ? 'دعم موازنة الرواتب' : 'رواتب مدرسين');
                    }}
                    className="w-full px-3 py-2 border rounded-xl"
                  >
                    <option value="إيراد">قيد تخصيص دعم مالي (إيراد الخزينة)</option>
                    <option value="مصروف">قيد صرف راتب/أجور (خارج من الخزينة)</option>
                  </select>
                </div>

                <div className="space-y-1 bg-transparent">
                  <label className="font-bold text-gray-700">التصنيف المحاسبي</label>
                  <select
                    value={trCategory}
                    onChange={(e) => setTrCategory(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl"
                  >
                    {trType === 'إيراد' ? (
                      ["دعم موازنة الرواتب", "تبرعات خارجية ومساهمات", "منحة دعم دورية"].map(o => (
                        <option key={o} value={o}>{o}</option>
                      ))
                    ) : (
                      ["رواتب مدرسين", "رواتب إداريين وموظفين"].map(o => (
                        <option key={o} value={o}>{o}</option>
                      ))
                    )}
                  </select>
                </div>
              </div>

              <div className="space-y-1 bg-transparent">
                <label className="font-bold text-gray-700">المبلغ الإجمالي الموثق بدفاتر المراجعة *</label>
                <input
                  type="number"
                  required
                  placeholder="شيكل جديد ₪"
                  value={trAmount}
                  onChange={(e) => setTrAmount(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl text-xs bg-transparent"
                />
              </div>

              <div className="space-y-1 bg-transparent">
                <label className="font-bold text-gray-700">طريقة السداد / التحصيل</label>
                <select
                  value={trMethod}
                  onChange={(e) => setTrMethod(e.target.value as any)}
                  className="w-full px-3 py-2 border rounded-xl"
                >
                  <option value="مدى">مدى (شبكة مبيعات)</option>
                  <option value="فيزا / ماستر كارد">فيزا / ماستر كارد</option>
                  <option value="تحويل بنكي">تحويل بنكي رسمي</option>
                  <option value="نقدي">نقدي (كاش بالصندوق الرئيسي)</option>
                </select>
              </div>

              <div className="space-y-1 bg-transparent">
                <label className="font-bold text-gray-700">الوصف أو التفاصيل</label>
                <textarea
                  value={trDesc}
                  onChange={(e) => setTrDesc(e.target.value)}
                  placeholder="مثال: شراء صابون ومقاعد دراسية ل غرف الحضانة والمستودع"
                  className="w-full px-3 py-2 border rounded-xl h-20"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t text-sm">
                <button
                  type="button"
                  onClick={() => setShowAddTrModal(false)}
                  className="px-4 py-2 border rounded-xl cursor-pointer"
                >
                  تراجع
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#E91E63] text-white font-bold rounded-xl cursor-pointer"
                >
                  توثيق القيد بالدفتر الإداري
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Model 2 deleted because the school is free */}

      {/* Model 3: Printable Voucher Slip viewer */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white text-black dark:text-black rounded-3xl p-6 max-w-md w-full soft-shadow relative text-right space-y-6">
            <button
              onClick={() => setSelectedInvoice(null)}
              className="absolute left-4 top-4 bg-gray-100 p-1.5 rounded-full text-gray-400 hover:text-gray-650 cursor-pointer"
            >
              x
            </button>

            <div className="text-center font-sans space-y-1">
              <h1 className="text-sm font-black text-gray-600">مَدْرَسَة حَبِيبَة التَّعْلِيمِيَّة</h1>
              <h2 className="text-xs text-gray-400 uppercase tracking-widest">سند مالي رسمي معتمد</h2>
              <p className="text-[10px] text-gray-400">التاريخ: {selectedInvoice.date}</p>
            </div>

            <div className="border-t border-b border-gray-150 py-4 space-y-2 text-xs">
              <p><span className="font-semibold text-gray-500">رقم السند المرجعي:</span> <span className="font-mono font-bold text-gray-900">{selectedInvoice.id}</span></p>
              <p><span className="font-semibold text-gray-500">طبيعة المعاملة المالية:</span> <span className="font-bold text-[#E91E63]">{selectedInvoice.type}</span></p>
              <p><span className="font-semibold text-gray-500">البيان / التصنيف:</span> <span className="font-bold">{selectedInvoice.category}</span></p>
              <p><span className="font-semibold text-gray-500">طريقة الدفع:</span> <span>{selectedInvoice.paymentMethod}</span></p>
              <p className="pt-2 border-t text-gray-600 leading-relaxed italic"><span className="font-semibold text-gray-500">الشرح وتفاصيل الصندوق:</span> "{selectedInvoice.description}"</p>
            </div>

            {/* Price Box */}
            <div className="bg-gray-50 p-4 rounded-xl flex justify-between items-center">
              <span className="font-bold text-gray-500 text-xs">المبلغ الإجمالي الكلي:</span>
              <span className="text-lg font-black text-[#E91E63] font-mono">{selectedInvoice.amount.toLocaleString()} ريال قطعي</span>
            </div>

            {/* Footer Signatures */}
            <div className="grid grid-cols-2 text-xs text-center text-gray-500 pt-4 border-t border-dashed">
              <div>
                <p className="font-semibold">توقيع المحاسب الرئيسي:</p>
                <p className="font-bold text-gray-800 underline mt-1">أبو بكر الصدّيق</p>
              </div>
              <div>
                <p className="font-semibold">توقيع الإدارة المالية:</p>
                <div className="w-16 h-8 bg-transparent mx-auto mt-1 flex items-center justify-center font-serif text-[10px] text-gray-300 italic">SIG..</div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  window.print();
                }}
                className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 rounded-xl text-xs cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                تحميل PDF وطباعة السند
              </button>
              <button
                type="button"
                onClick={() => setSelectedInvoice(null)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-350 text-gray-700 font-bold text-xs rounded-xl cursor-pointer"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
