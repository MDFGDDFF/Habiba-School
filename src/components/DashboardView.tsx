/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Users,
  GraduationCap,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  School,
  ArrowUpRight,
  TrendingUp as SparkIcon
} from 'lucide-react';
import { Student, Teacher, FinanceTransaction } from '../types';
import { educationalEvents } from '../data/mockData';

interface DashboardViewProps {
  students: Student[];
  teachers: Teacher[];
  transactions: FinanceTransaction[];
  onNavigate: (tab: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  students,
  teachers,
  transactions,
  onNavigate
}) => {
  // Statistics calculators
  const activeStudents = students.filter(s => s.status === 'نشط');
  const totalInvoiced = students.reduce((sum, s) => sum + s.feesTotal, 0);
  const totalPaid = students.reduce((sum, s) => sum + s.feesPaid, 0);
  const totalDebt = totalInvoiced - totalPaid;
  
  const totalExpenses = transactions
    .filter(t => t.type === 'مصروف' && t.status === 'مكتمل')
    .reduce((sum, t) => sum + t.amount, 0);

  const averageAttendance = Math.round(
    students.reduce((sum, s) => sum + s.attendanceRate, 0) / (students.length || 1)
  );

  const averageBehavior = Math.round(
    students.reduce((sum, s) => sum + s.behaviorScore, 0) / (students.length || 1)
  );

  return (
    <div className="space-y-6" id="dashboard-main-view">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-primary via-[#F06292] to-primary p-6 rounded-3xl text-white soft-shadow flex flex-col md:flex-row justify-between items-center relative overflow-hidden">
        <div className="absolute inset-0 bg-white/5 backdrop-blur-[1px] pointer-events-none" />
        <div className="z-10 text-right space-y-2">
          <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md">
            <School className="w-4 h-4 text-pink-200" />
            <span>نظام الإدارة الرقمية المطور</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">مرحباً بك في لوحة تحكّم رئيسية مدرسة حبيبة</h1>
          <p className="text-pink-100 max-w-xl text-sm leading-relaxed">
            يمنحك النظام نظرة عامة متميزة وسهلة حول أداء الفصول التعليمية، الحضور اليومي، الرواتب والعمليات المالية الجارية لحظة بلحظة.
          </p>
        </div>
        <div className="z-10 mt-4 md:mt-0 flex gap-3 text-sm flex-wrap justify-center">
          <button
            onClick={() => onNavigate('students')}
            className="bg-white text-primary font-bold px-4 py-2.5 rounded-xl hover:bg-pink-50 transition cursor-pointer soft-shadow"
            id="btn-register-student-shortcut"
          >
            تسجيل طالب جديد
          </button>
          <button
            onClick={() => onNavigate('academics')}
            className="bg-primary-dark/40 border border-white/20 text-white font-bold px-4 py-2.5 rounded-xl hover:bg-white/10 transition cursor-pointer"
            id="btn-exam-center-shortcut"
          >
            مركز الاختبارات والخطط
          </button>
        </div>
      </div>

      {/* Executive KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Active Students */}
        <div className="glass-panel p-5 rounded-2xl soft-shadow flex items-center justify-between transition hover:-translate-y-1 hover:shadow-lg duration-300">
          <div className="space-y-2">
            <p className="text-gray-400 dark:text-gray-400 text-sm font-medium">الطلاب المنتسبين</p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-[#E91E63]">{activeStudents.length}</span>
              <span className="text-xs text-green-500 font-bold">نشط</span>
            </div>
            <p className="text-xs text-gray-500">متوسط السلوك والمظهر: {averageBehavior}%</p>
          </div>
          <div className="bg-[#E91E63]/10 p-3 rounded-2xl">
            <GraduationCap className="w-7 h-7 text-[#E91E63]" />
          </div>
        </div>

        {/* KPI 2: Overall Attendance */}
        <div className="glass-panel p-5 rounded-2xl soft-shadow flex items-center justify-between transition hover:-translate-y-1 hover:shadow-lg duration-300">
          <div className="space-y-2">
            <p className="text-gray-400 dark:text-gray-400 text-sm font-medium">نسبة الحضور العام</p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-[#E91E63]">{averageAttendance}%</span>
              <span className="text-xs text-green-500 font-bold">مستقر</span>
            </div>
            <p className="text-xs text-gray-500">تم تحديث الحضور اليوم</p>
          </div>
          <div className="bg-[#E91E63]/10 p-3 rounded-2xl">
            <Users className="w-7 h-7 text-[#E91E63]" />
          </div>
        </div>

        {/* KPI 3: Total Collections */}
        <div className="glass-panel p-5 rounded-2xl soft-shadow flex items-center justify-between transition hover:-translate-y-1 hover:shadow-lg duration-300">
          <div className="space-y-2">
            <p className="text-gray-400 dark:text-gray-400 text-sm font-medium">الرسوم المحصلة</p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-[#E91E63]">{totalPaid.toLocaleString()} ₪</span>
              <span className="text-xs text-[#E91E63] font-bold">من {totalInvoiced.toLocaleString()}</span>
            </div>
            <p className="text-xs text-red-500 font-medium">الذمم المعلقة: {totalDebt.toLocaleString()} ₪</p>
          </div>
          <div className="bg-emerald-500/10 p-3 rounded-2xl">
            <TrendingUp className="w-7 h-7 text-emerald-500" />
          </div>
        </div>

        {/* KPI 4: Outgoing School Expenses */}
        <div className="glass-panel p-5 rounded-2xl soft-shadow flex items-center justify-between transition hover:-translate-y-1 hover:shadow-lg duration-300">
          <div className="space-y-2">
            <p className="text-gray-400 dark:text-gray-400 text-sm font-medium">المصروفات والمشتريات</p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-amber-500">{totalExpenses.toLocaleString()} ₪</span>
              <span className="text-xs text-amber-500 font-bold">مايو-يونيو</span>
            </div>
            <p className="text-xs text-gray-500">تشمل التوريد وصيانة المعامل وعقود الحافلات</p>
          </div>
          <div className="bg-amber-500/10 p-3 rounded-2xl">
            <TrendingDown className="w-7 h-7 text-amber-500" />
          </div>
        </div>
      </div>

      {/* Main Core Visual Charts & Analytical Graphs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Statistics Chart */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl soft-shadow space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold">مقارنة التدفق المالي والأقساط</h2>
              <p className="text-xs text-gray-500">تحليل المبيعات والرسوم المحصلة مقارنة بالمصروفات التشغيلية للمدرسة</p>
            </div>
            <span className="text-xs font-semibold px-2 px-3 py-1 bg-pink-100 text-[#E91E63] rounded-full inline-flex items-center gap-1">
              <SparkIcon className="w-3.5 h-3.5" />
              تحديث فوري
            </span>
          </div>

          {/* Interactive SVG Chart representation */}
          <div className="h-64 relative w-full pt-4">
            <div className="absolute right-0 top-0 text-xs text-gray-400 space-y-8 h-full flex flex-col justify-between">
              <span>20K ₪</span>
              <span>15K ₪</span>
              <span>10K ₪</span>
              <span>5K ₪</span>
              <span>0</span>
            </div>
            
            {/* Grid & curves */}
            <div className="h-4/5 mr-16 border-b border-r border-[#E91E63]/10 relative flex items-end justify-around">
              {/* Grid Lines */}
              <div className="absolute left-0 right-0 top-1/4 border-t border-dashed border-gray-100 dark:border-gray-800 -z-0" />
              <div className="absolute left-0 right-0 top-2/4 border-t border-dashed border-gray-100 dark:border-gray-800 -z-0" />
              <div className="absolute left-0 right-0 top-3/4 border-t border-dashed border-gray-100 dark:border-gray-800 -z-0" />

              {/* Bar 1: January */}
              <div className="flex flex-col items-center gap-1 z-10 w-12">
                <div className="w-full flex gap-1 justify-center">
                  <div className="w-4 bg-gradient-to-t from-[#E91E63] to-pink-400 rounded-t-md hover:opacity-90 transition duration-150 cursor-pointer" style={{ height: '55%' }} title="رسوم محصلة: 11K" />
                  <div className="w-4 bg-amber-500/80 rounded-t-md cursor-pointer" style={{ height: '30%' }} title="مصروفات: 6K" />
                </div>
                <span className="text-xs text-gray-500 mt-1">يناير</span>
              </div>

              {/* Bar 2: February */}
              <div className="flex flex-col items-center gap-1 z-10 w-12">
                <div className="w-full flex gap-1 justify-center">
                  <div className="w-4 bg-gradient-to-t from-[#E91E63] to-pink-400 rounded-t-md hover:opacity-90 transition duration-150 cursor-pointer" style={{ height: '70%' }} title="رسوم محصلة: 14K" />
                  <div className="w-4 bg-amber-500/80 rounded-t-md cursor-pointer" style={{ height: '35%' }} title="مصروفات: 7K" />
                </div>
                <span className="text-xs text-gray-500 mt-1">فبراير</span>
              </div>

              {/* Bar 3: March */}
              <div className="flex flex-col items-center gap-1 z-10 w-12">
                <div className="w-full flex gap-1 justify-center">
                  <div className="w-4 bg-gradient-to-t from-[#E91E63] to-pink-400 rounded-t-md hover:opacity-90 transition duration-150 cursor-pointer" style={{ height: '85%' }} title="رسوم محصلة: 17K" />
                  <div className="w-4 bg-amber-500/80 rounded-t-md cursor-pointer" style={{ height: '40%' }} title="مصروفات: 8K" />
                </div>
                <span className="text-xs text-gray-500 mt-1">مارس</span>
              </div>

              {/* Bar 4: April */}
              <div className="flex flex-col items-center gap-1 z-10 w-12">
                <div className="w-full flex gap-1 justify-center">
                  <div className="w-4 bg-gradient-to-t from-[#E91E63] to-pink-400 rounded-t-md hover:opacity-90 transition duration-150 cursor-pointer" style={{ height: '60%' }} title="رسوم محصلة: 12K" />
                  <div className="w-4 bg-amber-500/80 rounded-t-md cursor-pointer" style={{ height: '45%' }} title="مصروفات: 9K" />
                </div>
                <span className="text-xs text-gray-500 mt-1">أبريل</span>
              </div>

              {/* Bar 5: May */}
              <div className="flex flex-col items-center gap-1 z-10 w-12">
                <div className="w-full flex gap-1 justify-center">
                  <div className="w-4 bg-gradient-to-t from-[#E91E63] to-pink-400 rounded-t-md hover:opacity-90 transition duration-150 cursor-pointer" style={{ height: '95%' }} title="رسوم محصلة: 19K" />
                  <div className="w-4 bg-amber-500/80 rounded-t-md cursor-pointer" style={{ height: '25%' }} title="مصروفات: 5K" />
                </div>
                <span className="text-xs text-gray-500 mt-1">مايو</span>
              </div>

              {/* Bar 6: June */}
              <div className="flex flex-col items-center gap-1 z-10 w-12">
                <div className="w-full flex gap-1 justify-center">
                  <div className="w-4 bg-gradient-to-t from-[#E91E63] to-pink-400 rounded-t-md hover:opacity-90 transition duration-150 cursor-pointer" style={{ height: '80%' }} title="رسوم محصلة: 16K" />
                  <div className="w-4 bg-amber-500/80 rounded-t-md cursor-pointer" style={{ height: '20%' }} title="مصروفات: 4K" />
                </div>
                <span className="text-xs text-gray-500 mt-1">يونيو</span>
              </div>
            </div>
          </div>

          {/* Chart Legends */}
          <div className="flex justify-center gap-6 pt-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-full bg-gradient-to-r from-[#E91E63] to-pink-400" />
              <span className="text-gray-600 dark:text-gray-300">الإيرادات المحصلة (أقساط ورسوم)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-full bg-amber-500" />
              <span className="text-gray-600 dark:text-gray-300">المصروفات التشغيلية والرواتب</span>
            </div>
          </div>
        </div>

        {/* Calendar Events & Upcoming events list */}
        <div className="glass-panel p-6 rounded-2xl soft-shadow space-y-4">
          <div className="flex justify-between items-center border-b border-pink-50 pb-3 dark:border-gray-800">
            <h2 className="text-lg font-bold flex items-center gap-2 text-[#E91E63]">
              <Calendar className="w-5 h-5" />
              أحداث وفعاليات قادمة
            </h2>
            <button
              onClick={() => onNavigate('activities')}
              className="text-xs text-[#E91E63] hover:underline"
            >
              عرض الكل
            </button>
          </div>

          <div className="space-y-3 max-h-60 overflow-y-auto">
            {educationalEvents.map((ev, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-pink-50/40 dark:bg-pink-950/20 border-r-4 border-[#E91E63] space-y-1 hover:bg-pink-50 dark:hover:bg-pink-900/10 transition duration-150">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-[#E91E63] bg-pink-100 dark:bg-pink-900/40 px-2 py-0.5 rounded">
                    {ev.type}
                  </span>
                  <div className="text-xs text-gray-400 inline-flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{ev.time}</span>
                  </div>
                </div>
                <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200">{ev.title}</h4>
                <div className="text-xs text-gray-500">
                  <span>الموقع: </span>
                  <span className="font-semibold text-gray-700 dark:text-gray-300">{ev.location}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/10 border border-amber-200 p-3.5 rounded-xl flex gap-3">
              <AlertTriangle className="w-6 h-6 text-amber-500 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h5 className="text-xs font-bold text-amber-800 dark:text-amber-200">صيانة طارئة لوحدات الباصات</h5>
                <p className="text-xs text-amber-700 dark:text-amber-300 leading-relaxed">
                  سيتم فحص دوري يوم السبت لجميع باصات مسارات قرطبة واليرموك لزيادة معدلات السلامة وصلاحية المكابح بالتعاون مع جهات التوطين والبلدية.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Access Tiles & Core Actions */}
      <div className="space-y-3">
        <h3 className="text-md font-bold text-gray-700 dark:text-gray-300">الوصول السريع لغرف العمليات</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {[
            { label: "سجل الحضور", tab: "attendance", color: "bg-teal-50 text-teal-600 hover:bg-teal-100", icon: CheckCircle },
            { label: "أمين المكتبة", tab: "library", color: "bg-sky-50 text-sky-600 hover:bg-sky-100", icon: Users },
            { label: "العيادة الطبية", tab: "clinic", color: "bg-red-50 text-red-600 hover:bg-red-100", icon: Clock },
            { label: "حافلات النقل", tab: "transport", color: "bg-amber-50 text-amber-600 hover:bg-amber-100", icon: School },
            { label: "الخزينة والمالية", tab: "financials", color: "bg-emerald-50 text-emerald-600 hover:bg-emerald-100", icon: DollarSign },
            { label: "الذكاء الاصطناعي", tab: "ai_consultant", color: "bg-pink-50 text-[#E91E63] hover:bg-pink-100", icon: SparkIcon },
          ].map((tile, i) => {
            const Icon = tile.icon;
            return (
              <button
                key={i}
                onClick={() => onNavigate(tile.tab)}
                className={`p-4 rounded-2xl ${tile.color} font-bold text-sm flex flex-col items-center gap-2 justify-center transition hover:-translate-y-1 cursor-pointer shadow-xs`}
              >
                <Icon className="w-6 h-6" />
                <span>{tile.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
