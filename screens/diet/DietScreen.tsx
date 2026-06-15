import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'next/navigation';
import { 
  Flame, Clock, Check, AlertTriangle, Play, ChevronRight, FileText, 
  Download, ArrowLeft, RefreshCw, BarChart2, Calendar, Target,
  CheckCircle, ArrowRight, ShieldAlert, Award, Smile, Undo
} from 'lucide-react';
import { getPublicApiBase } from '@/lib/api-config';
import DietCard from '../../components/diet/DietCard';
import AvoidFoodCard from '../../components/diet/AvoidFoodCard';
import { DietPlan, DayDietPlan, Meal, DailyTarget } from '@/types/diet';

interface DietScreenProps {
  dietPlan: DietPlan;
  onBack?: () => void;
}

export const DietScreen: React.FC<DietScreenProps> = ({ dietPlan, onBack }) => {
  const params = useParams();
  const userId = params.id as string;

  // Track state for selected day (1 to 7)
  // Default to today's day number: Monday=1, Sunday=7
  const getTodayDayNumber = () => {
    const today = new Date();
    const day = today.getDay(); // 0 is Sunday, 1 is Monday ...
    return day === 0 ? 7 : day;
  };

  const [selectedDay, setSelectedDay] = useState<number>(getTodayDayNumber());
  const [mealLogs, setMealLogs] = useState<any[]>([]);
  const [weeklyReport, setWeeklyReport] = useState<any>(null);
  const [loadingLogs, setLoadingLogs] = useState(true);
  const [loadingReport, setLoadingReport] = useState(true);
  const [trackingInProgress, setTrackingInProgress] = useState<number | null>(null);

  // Calculate week dates (Monday to Sunday) for current week
  const weekDates = useMemo(() => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 is Sunday, 1 is Monday ...
    const monday = new Date(today);
    const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    monday.setDate(diff);

    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      dates.push(date);
    }
    return dates;
  }, []);

  const selectedDateStr = useMemo(() => {
    const d = weekDates[selectedDay - 1];
    if (!d) return new Date().toISOString().split('T')[0];
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const date = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${date}`;
  }, [weekDates, selectedDay]);

  // Fetch meal logs for selected date
  const fetchMealLogs = useCallback(async () => {
    try {
      setLoadingLogs(true);
      const token = localStorage.getItem('userToken');
      const res = await fetch(
        `${getPublicApiBase()}/diet-plans/user/${userId}/history?startDate=${selectedDateStr}&endDate=${selectedDateStr}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      const data = await res.json();
      if (data.success) {
        setMealLogs(data.data || []);
      }
    } catch (err) {
      console.error('Error fetching meal logs:', err);
    } finally {
      setLoadingLogs(false);
    }
  }, [userId, selectedDateStr]);

  // Fetch weekly report
  const fetchWeeklyReport = useCallback(async () => {
    try {
      setLoadingReport(true);
      const token = localStorage.getItem('userToken');
      const todayStr = new Date().toISOString().split('T')[0];
      const res = await fetch(
        `${getPublicApiBase()}/diet-plans/user/${userId}/reports?endDate=${todayStr}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      const data = await res.json();
      if (data.success) {
        setWeeklyReport(data.data);
      }
    } catch (err) {
      console.error('Error fetching weekly report:', err);
    } finally {
      setLoadingReport(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchMealLogs();
  }, [fetchMealLogs]);

  useEffect(() => {
    fetchWeeklyReport();
  }, [fetchWeeklyReport]);

  // Track meal action
  const handleTrackMeal = async (mealIndex: number, mealName: string, status: 'completed' | 'delayed' | 'skipped' | 'untracked') => {
    if (trackingInProgress !== null) return;
    setTrackingInProgress(mealIndex);
    try {
      const token = localStorage.getItem('userToken');
      const res = await fetch(`${getPublicApiBase()}/diet-plans/user/${userId}/track`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          date: selectedDateStr,
          day: selectedDay,
          mealIndex,
          mealName,
          status,
          completionTime: (status === 'skipped' || status === 'untracked') ? undefined : new Date().toISOString()
        })
      });
      const data = await res.json();
      if (data.success) {
        await Promise.all([fetchMealLogs(), fetchWeeklyReport()]);
      }
    } catch (err) {
      console.error('Error tracking meal:', err);
    } finally {
      setTrackingInProgress(null);
    }
  };

  // Get active day diet details
  const activeDayPlan = useMemo(() => {
    return dietPlan.dietData.find((d: DayDietPlan) => d.day === selectedDay) || dietPlan.dietData[0];
  }, [dietPlan, selectedDay]);

  // Find tracked log for a meal index
  const getTrackedLog = (mealIndex: number) => {
    return mealLogs.find(l => l.mealIndex === mealIndex);
  };

  const dailyCompletionPercentage = useMemo(() => {
    if (mealLogs.length === 0) return 0;
    return mealLogs[0]?.dailyCompletionPercentage || 0;
  }, [mealLogs]);

  // Format date helper
  const formatTime = (isoString?: string) => {
    if (!isoString) return '';
    try {
      const d = new Date(isoString);
      return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return '';
    }
  };

  return (
    <div className="bg-[#FCFDFB] min-h-screen pb-16 font-sans">
      
      {/* Title Header */}
      <div className="bg-gradient-to-r from-pink-500/5 to-purple-500/5 px-6 py-8 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {onBack && (
            <button onClick={onBack} className="p-2 bg-white rounded-xl border border-slate-100 hover:bg-slate-50 transition shadow-sm">
              <ArrowLeft className="w-4 h-4 text-slate-700" />
            </button>
          )}
          <div>
            <h1 className="text-2xl font-black text-slate-900 leading-tight">Nutrition & Diet Hub</h1>
            <p className="text-slate-500 text-xs font-medium mt-1">Manage, track, and complete your personalized diet schedule.</p>
          </div>
        </div>
        
        <button 
          onClick={() => Promise.all([fetchMealLogs(), fetchWeeklyReport()])} 
          className="p-2 bg-white hover:bg-slate-50 border border-slate-100 rounded-xl transition shadow-sm"
        >
          <RefreshCw className="w-4 h-4 text-slate-500 hover:text-slate-700" />
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 space-y-8">
        
        {/* Horizontal Calendar Day Selection Row */}
        <div className="bg-white rounded-3xl border border-slate-100 p-4 shadow-sm flex justify-between items-center overflow-x-auto gap-2 no-scrollbar">
          {weekDates.map((date, idx) => {
            const dayNum = idx + 1;
            const isSelected = selectedDay === dayNum;
            const isToday = new Date().toDateString() === date.toDateString();
            
            const dayAbbrev = date.toLocaleDateString('en-US', { weekday: 'short' });
            const dateNum = date.getDate();

            return (
              <button
                key={idx}
                onClick={() => setSelectedDay(dayNum)}
                className={`flex-1 py-3 px-2 rounded-2xl flex flex-col items-center gap-1.5 transition-all duration-300 min-w-[56px] relative ${
                  isSelected 
                    ? 'bg-gradient-to-br from-pink-500 to-purple-600 text-white shadow-md shadow-pink-100'
                    : 'bg-slate-50/60 hover:bg-slate-50 text-slate-600 border border-transparent'
                }`}
              >
                <span className={`text-[10px] font-bold uppercase tracking-wider ${isSelected ? 'text-pink-100' : 'text-slate-400'}`}>
                  {dayAbbrev}
                </span>
                <span className="text-base font-extrabold tracking-tight">
                  {dateNum}
                </span>
                
                {isToday && (
                  <span className={`w-1.5 h-1.5 rounded-full absolute top-1 right-2 ${isSelected ? 'bg-white' : 'bg-pink-500'}`} />
                )}
              </button>
            );
          })}
        </div>

        {/* Analytics Summary & Today's completion ring */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
          
          {/* Daily Completion Percentage Ring */}
          <div className="md:col-span-5 bg-white border border-slate-100 rounded-[32px] p-6 md:p-8 shadow-sm flex flex-col items-center justify-center text-center">
            <span className="text-[10px] font-bold text-pink-500 uppercase tracking-widest mb-4 block">Day {selectedDay} Target</span>
            
            <div className="relative w-44 h-44 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {/* Background Track circle */}
                <circle 
                  cx="50" cy="50" r="42" 
                  className="stroke-slate-100" 
                  strokeWidth="8" fill="transparent" 
                />
                {/* Foreground completion progress circle */}
                <motion.circle 
                  cx="50" cy="50" r="42" 
                  className="stroke-pink-500" 
                  strokeWidth="8" fill="transparent"
                  strokeDasharray={2 * Math.PI * 42}
                  initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 42 * (1 - dailyCompletionPercentage / 100) }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  strokeLinecap="round"
                />
              </svg>
              
              <div className="absolute flex flex-col items-center">
                <span className="text-3xl font-black text-slate-800 tracking-tighter">{dailyCompletionPercentage}%</span>
                <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider mt-0.5">Completed</span>
              </div>
            </div>

            <p className="text-slate-500 text-xs font-semibold mt-6 leading-relaxed max-w-xs">
              {dailyCompletionPercentage === 100 
                ? "Perfect adherence! You've checked in all scheduled meals for today. 🌟"
                : dailyCompletionPercentage > 0
                  ? "Good progress! Keep tracking your meals to maintain your hormonal balance."
                  : "Start logging your meals today to track your nutritional compliance."}
            </p>
          </div>

          {/* Weekly Report Panel */}
          <div className="md:col-span-7 bg-white border border-slate-100 rounded-[32px] p-6 md:p-8 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-purple-600 mb-2">
                <BarChart2 className="w-5 h-5" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Weekly Performance</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900">7-Day Adherence Analytics</h3>
              <p className="text-slate-500 text-xs mt-1">Consistency report generated dynamically based on meal logs.</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 my-6">
              {/* Adherence Rate */}
              <div className="bg-slate-50/60 border border-slate-100 rounded-2xl p-4 flex flex-col justify-between min-h-[92px]">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Diet Adherence</span>
                <div className="mt-2.5 flex items-baseline gap-1">
                  <span className="text-2xl font-black text-slate-800">{weeklyReport?.overallDietAdherence || 0}%</span>
                </div>
              </div>

              {/* Consistency Rate */}
              <div className="bg-slate-50/60 border border-slate-100 rounded-2xl p-4 flex flex-col justify-between min-h-[92px]">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Consistency</span>
                <div className="mt-2.5 flex items-baseline gap-1">
                  <span className="text-2xl font-black text-slate-800">{weeklyReport?.consistencyPercentage || 0}%</span>
                </div>
              </div>

              {/* Total Completed */}
              <div className="col-span-2 md:col-span-1 bg-slate-50/60 border border-slate-100 rounded-2xl p-4 flex flex-col justify-between min-h-[92px]">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">On-Time Eats</span>
                <div className="mt-2.5 flex items-baseline gap-1">
                  <span className="text-2xl font-black text-slate-800">{weeklyReport?.mealsEatenOnTime || 0}</span>
                  <span className="text-xs font-bold text-slate-400">meals</span>
                </div>
              </div>

              {/* Completed Meals count */}
              <div className="bg-slate-50/60 border border-slate-100 rounded-2xl p-4 flex flex-col justify-between min-h-[92px]">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Eaten</span>
                <div className="mt-2.5 flex items-baseline gap-1">
                  <span className="text-2xl font-black text-slate-800">{weeklyReport?.totalMealsCompleted || 0}</span>
                  <span className="text-xs font-bold text-slate-400">meals</span>
                </div>
              </div>

              {/* Skipped count */}
              <div className="bg-slate-50/60 border border-slate-100 rounded-2xl p-4 flex flex-col justify-between min-h-[92px]">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Skipped Meals</span>
                <div className="mt-2.5 flex items-baseline gap-1">
                  <span className="text-2xl font-black text-rose-600">{weeklyReport?.skippedMeals || 0}</span>
                  <span className="text-xs font-bold text-slate-400">meals</span>
                </div>
              </div>

              {/* Score Badging */}
              <div className="bg-pink-50/30 border border-pink-100/30 rounded-2xl p-4 flex flex-col justify-center items-center text-center">
                <Award className="w-5 h-5 text-pink-500 mb-1" />
                <span className="text-[9px] font-extrabold text-pink-600 uppercase tracking-widest">Weekly Grade</span>
                <span className="text-base font-black text-slate-800 mt-0.5">
                  {(weeklyReport?.overallDietAdherence || 0) >= 80 ? 'Excellent' : (weeklyReport?.overallDietAdherence || 0) >= 50 ? 'Moderate' : 'Needs Action'}
                </span>
              </div>
            </div>
            
            <p className="text-[10px] text-slate-400 font-semibold italic">
              * The consistency score reflects meals eaten on time. Adherence counts all meals completed.
            </p>
          </div>
        </div>

        {/* Patient Info Card */}
        <DietCard
          age={dietPlan.patientAge}
          height={dietPlan.patientHeight}
          weight={dietPlan.patientWeight}
          goal={dietPlan.patientGoal}
          diet={dietPlan.patientDiet}
        />

        {/* Diet Schedule Tracker */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-purple-100/40 pb-3">
            <h3 className="text-slate-800 font-extrabold text-lg flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-pink-500 rounded-full inline-block animate-pulse"></span>
              Daily Meal Tracker
            </h3>
            <span className="bg-purple-100 text-purple-700 font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wider">
              Day {selectedDay} Schedule
            </span>
          </div>

          {loadingLogs ? (
            <div className="h-64 flex items-center justify-center bg-white rounded-3xl border border-slate-100 shadow-sm">
              <div className="flex flex-col items-center gap-2.5">
                <div className="w-8 h-8 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin" />
                <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Retrieving logs...</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {activeDayPlan?.meals.map((meal: any, idx: number) => {
                const log = getTrackedLog(idx);
                const isLogged = !!log;

                const normalizedFoodItems = meal.foodItems && meal.foodItems.length > 0
                  ? meal.foodItems
                  : (() => {
                      const foods = Array.isArray(meal.food)
                        ? meal.food
                        : typeof meal.food === 'string' && meal.food
                          ? meal.food.split('+').map((item: string) => item.trim()).filter(Boolean)
                          : [];
                      return foods.map((f: string, fIdx: number) => ({
                        name: f,
                        quantity: '1 portion',
                        calories: fIdx === 0 ? (meal.calories || 0) : 0
                      }));
                    })();

                const mealTotalCalories = normalizedFoodItems.reduce((sum: number, f: any) => sum + (f.calories || 0), 0);

                return (
                  <div 
                    key={idx} 
                    className="bg-white rounded-3xl border border-slate-100 p-6 flex flex-col md:flex-row justify-between gap-6 shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex items-start gap-4 flex-1">
                      <div className="flex-shrink-0 w-11 h-11 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
                        <Clock className="w-5 h-5" />
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <h4 className="text-slate-800 font-black text-sm uppercase tracking-wide flex items-center gap-2">
                            {meal.name}
                            <span className="text-slate-400 text-xs font-semibold lowercase">at {meal.time}</span>
                          </h4>
                          {meal.instructions && (
                            <p className="text-[10px] text-pink-600 font-semibold mt-0.5 bg-pink-50/50 px-2 py-0.5 rounded-md inline-block">
                              Instructions: {meal.instructions}
                            </p>
                          )}
                        </div>

                        {/* Food Items */}
                        <ul className="space-y-1.5">
                          {normalizedFoodItems.map((foodItem: any, fIdx: number) => (
                            <li key={fIdx} className="text-slate-600 text-sm font-medium flex items-center gap-2">
                              <span className="w-1.5 h-1.5 bg-pink-400 rounded-full inline-block"></span>
                              <span className="font-bold text-slate-800">{foodItem.name}</span>
                              <span className="text-slate-400">({foodItem.quantity || '1 portion'})</span>
                              <span className="text-[10px] bg-slate-50 border border-slate-100 text-slate-400 px-1.5 py-0.5 rounded font-black uppercase">
                                {foodItem.calories} kcal
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Right side: status check-in buttons or logged badge */}
                    <div className="flex flex-col md:items-end justify-center min-w-[200px] border-t md:border-t-0 pt-4 md:pt-0 border-slate-100">
                      {isLogged ? (
                        <div className="space-y-2 w-full md:w-auto text-right">
                          {log.status === 'completed' && (
                            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-2xl text-xs font-extrabold flex items-center justify-center md:justify-end gap-1.5">
                              <CheckCircle className="w-4 h-4 text-green-600" />
                              <span>Eaten on time ({formatTime(log.completionTime)})</span>
                            </div>
                          )}
                          {log.status === 'delayed' && (
                            <div className="bg-amber-50 border border-amber-200 text-amber-700 px-4 py-2 rounded-2xl text-xs font-extrabold flex items-center justify-center md:justify-end gap-1.5">
                              <Clock className="w-4 h-4 text-amber-600" />
                              <span>Eaten late ({formatTime(log.completionTime)})</span>
                            </div>
                          )}
                          {log.status === 'skipped' && (
                            <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-2 rounded-2xl text-xs font-extrabold flex items-center justify-center md:justify-end gap-1.5">
                              <ShieldAlert className="w-4 h-4 text-rose-600" />
                              <span>Meal Skipped</span>
                            </div>
                          )}

                          <button
                            onClick={() => handleTrackMeal(idx, meal.name, 'untracked')}
                            className="text-[10px] font-bold text-slate-400 hover:text-slate-600 underline flex items-center justify-center md:justify-end gap-1 ml-auto"
                          >
                            <Undo className="w-3 h-3" /> Change Log
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-2 w-full">
                          <button
                            disabled={trackingInProgress !== null}
                            onClick={() => handleTrackMeal(idx, meal.name, 'completed')}
                            className="flex-1 md:flex-none py-2 px-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-extrabold text-[10px] uppercase tracking-wider rounded-xl shadow-md shadow-green-100 hover:scale-[1.02] active:scale-100 transition"
                          >
                            Ate 🍽️
                          </button>
                          
                          <button
                            disabled={trackingInProgress !== null}
                            onClick={() => handleTrackMeal(idx, meal.name, 'delayed')}
                            className="flex-1 md:flex-none py-2 px-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-extrabold text-[10px] uppercase tracking-wider rounded-xl shadow-md shadow-amber-100 hover:scale-[1.02] active:scale-100 transition"
                          >
                            Late ⏰
                          </button>

                          <button
                            disabled={trackingInProgress !== null}
                            onClick={() => handleTrackMeal(idx, meal.name, 'skipped')}
                            className="flex-1 md:flex-none py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-500 font-extrabold text-[10px] uppercase tracking-wider rounded-xl transition"
                          >
                            Skip 🚫
                          </button>
                        </div>
                      )}

                      {/* Total Calories for this meal */}
                      <div className="mt-3 text-[10px] text-slate-400 font-bold tracking-tight text-right w-full">
                        Meal Total: <span className="text-slate-700">
                          {mealTotalCalories} kcal
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* PDF View download card */}
        {dietPlan.pdfUrl && (
          <div className="bg-white border border-slate-100 rounded-[32px] p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/5 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-pink-50 rounded-2xl flex items-center justify-center text-pink-600">
                <FileText className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Custom Clinical PDF Chart</h3>
                <p className="text-slate-500 text-xs mt-0.5">Your coach has uploaded a structured PDF version of this diet chart.</p>
              </div>
            </div>

            <div className="flex gap-4 w-full md:w-auto">
              <a 
                href={dietPlan.pdfUrl} 
                target="_blank" 
                rel="noreferrer" 
                className="flex-1 md:flex-none px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs uppercase tracking-wider rounded-2xl shadow-md text-center transition"
              >
                View PDF 📄
              </a>
              <a 
                href={dietPlan.pdfUrl} 
                download 
                target="_blank" 
                rel="noreferrer"
                className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-extrabold text-xs uppercase tracking-wider rounded-2xl flex items-center justify-center gap-1.5 transition"
              >
                <Download className="w-4 h-4" /> Download
              </a>
            </div>
          </div>
        )}

        {/* Foods to Avoid */}
        <AvoidFoodCard foods={dietPlan.foodsToAvoid} />

      </div>
    </div>
  );
};

export default DietScreen;
