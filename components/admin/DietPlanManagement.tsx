'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { API_BASE, getPublicApiBase } from '@/lib/api-config';
import { 
  Plus, 
  Trash2, 
  Edit2, 
  Save, 
  Search, 
  Check, 
  AlertCircle, 
  Sparkles,
  ChevronRight,
  User,
  Coffee,
  X,
  Copy,
  Upload,
  Loader2,
  FileText,
  BarChart2,
  Calendar,
  Activity,
  ShieldAlert,
  Clock,
  ExternalLink
} from 'lucide-react';

interface FoodItem {
  name: string;
  quantity: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

interface Meal {
  name: string;
  time: string;
  foodItems: FoodItem[];
  instructions?: string;
}

interface DayDietPlan {
  day: number;
  meals: Meal[];
  totalCalories: number;
}

interface DailyTarget {
  name: string;
  value: string;
}

interface DietPlan {
  id?: string;
  name: string;
  description: string;
  patientAge: string;
  patientHeight: string;
  patientWeight: string;
  patientGoal: string;
  patientDiet: string;
  dietData: DayDietPlan[];
  foodsToAvoid: string[];
  dailyTargets: DailyTarget[];
  userIds: string[];
  pdfUrl?: string;
  created_at?: string;
  updated_at?: string;
}

interface DietPlanManagementProps {
  apiKey: string;
  registrations: any[];
}

export default function DietPlanManagement({ apiKey, registrations }: DietPlanManagementProps) {
  const [dietPlans, setDietPlans] = useState<DietPlan[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form states
  const [selectedPlan, setSelectedPlan] = useState<DietPlan | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [searchUserQuery, setSearchUserQuery] = useState('');
  const [activeDayTab, setActiveDayTab] = useState<number>(1);

  // Form Fields
  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formAge, setFormAge] = useState('');
  const [formHeight, setFormHeight] = useState('');
  const [formWeight, setFormWeight] = useState('');
  const [formGoal, setFormGoal] = useState('');
  const [formDiet, setFormDiet] = useState('Vegetarian');
  const [formDietData, setFormDietData] = useState<DayDietPlan[]>([]);
  const [formFoodsToAvoid, setFormFoodsToAvoid] = useState<string[]>([]);
  const [newAvoidFood, setNewAvoidFood] = useState('');
  const [formDailyTargets, setFormDailyTargets] = useState<DailyTarget[]>([
    { name: 'Water', value: '3 Liters' },
    { name: 'Sleep', value: '8 Hours' },
    { name: 'Yoga', value: '30 Mins' },
    { name: 'Walking', value: '6000 Steps' }
  ]);
  const [assignedUserIds, setAssignedUserIds] = useState<string[]>([]);
  const [formPdfUrl, setFormPdfUrl] = useState<string>('');

  // Autocomplete search states
  const [activeSearchIndex, setActiveSearchIndex] = useState<{ mealIndex: number; foodIndex: number } | null>(null);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [uploadingPdf, setUploadingPdf] = useState(false);

  // User Nutrition Analytics states
  const [analyticsUser, setAnalyticsUser] = useState<any | null>(null);
  const [analyticsReport, setAnalyticsReport] = useState<any | null>(null);
  const [analyticsHistory, setAnalyticsHistory] = useState<any[]>([]);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);

  // Filter registrations to show only those containing 'user' role
  const filteredRegistrations = useMemo(() => {
    return registrations.filter(r => r.role === 'user');
  }, [registrations]);

  useEffect(() => {
    fetchDietPlans();
  }, []);

  const fetchDietPlans = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/diet-plans`, {
        headers: {
          'x-admin-api-key': apiKey
        }
      });
      const data = await res.json();
      if (data.success) {
        setDietPlans(data.data || []);
      } else {
        setError(data.message || 'Failed to fetch diet plans');
      }
    } catch (err) {
      console.error(err);
      setError('Connection failed');
    } finally {
      setLoading(false);
    }
  };

  const calculateDayCalories = (dayPlan: DayDietPlan): number => {
    return dayPlan.meals.reduce((sum, meal) => {
      const mealCalories = (meal.foodItems || []).reduce((mSum, item) => mSum + Number(item.calories || 0), 0);
      return sum + mealCalories;
    }, 0);
  };

  const handleSelectPlan = (plan: DietPlan) => {
    setSelectedPlan(plan);
    setIsCreatingNew(false);
    setError(null);
    setSuccess(null);

    setFormName(plan.name);
    setFormDescription(plan.description);
    setFormAge(plan.patientAge);
    setFormHeight(plan.patientHeight);
    setFormWeight(plan.patientWeight);
    setFormGoal(plan.patientGoal);
    setFormDiet(plan.patientDiet);
    setFormDietData(plan.dietData);
    setFormFoodsToAvoid(plan.foodsToAvoid || []);
    setFormDailyTargets(plan.dailyTargets || [
      { name: 'Water', value: '3 Liters' },
      { name: 'Sleep', value: '8 Hours' },
      { name: 'Yoga', value: '30 Mins' },
      { name: 'Walking', value: '6000 Steps' }
    ]);
    setAssignedUserIds(plan.userIds || []);
    setFormPdfUrl(plan.pdfUrl || '');
    setActiveDayTab(1);
    setActiveSearchIndex(null);
    setSearchResults([]);
  };

  const initEmptyDietData = (): DayDietPlan[] => {
    return Array.from({ length: 7 }, (_, i) => ({
      day: i + 1,
      totalCalories: 0,
      meals: [
        { name: 'Breakfast', time: '08:30 AM', foodItems: [] },
        { name: 'Lunch', time: '01:30 PM', foodItems: [] },
        { name: 'Snack', time: '04:30 PM', foodItems: [] },
        { name: 'Dinner', time: '08:00 PM', foodItems: [] }
      ]
    }));
  };

  const handleCreateNewClick = () => {
    setSelectedPlan(null);
    setIsCreatingNew(true);
    setError(null);
    setSuccess(null);

    setFormName('');
    setFormDescription('');
    setFormAge('28 Years');
    setFormHeight('165 cm');
    setFormWeight('65 kg');
    setFormGoal('PCOS Management & Weight Loss');
    setFormDiet('Vegetarian');
    setFormDietData(initEmptyDietData());
    setFormFoodsToAvoid([]);
    setFormDailyTargets([
      { name: 'Water', value: '3 Liters' },
      { name: 'Sleep', value: '8 Hours' },
      { name: 'Yoga', value: '30 Mins' },
      { name: 'Walking', value: '6000 Steps' }
    ]);
    setAssignedUserIds([]);
    setFormPdfUrl('');
    setActiveDayTab(1);
    setActiveSearchIndex(null);
    setSearchResults([]);
  };

  // Duplicate active plan
  const handleDuplicatePlan = () => {
    setSelectedPlan(null);
    setIsCreatingNew(true);
    setFormName(`${formName} (Copy)`);
    setSuccess('Plan details duplicated! Click "Save Diet Plan" at the top to save this new plan.');
  };

  // PDF Upload handler
  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPdf(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData();
    formData.append('pdf', file);

    try {
      const res = await fetch(`${API_BASE}/diet-plans/upload-pdf`, {
        method: 'POST',
        headers: {
          'x-admin-api-key': apiKey
        },
        body: formData
      });
      const result = await res.json();
      if (result.success && result.data?.url) {
        setFormPdfUrl(result.data.url);
        setSuccess('PDF chart uploaded successfully!');
      } else {
        setError(result.message || 'Failed to upload PDF');
      }
    } catch (err) {
      console.error(err);
      setError('Connection failed to upload PDF chart');
    } finally {
      setUploadingPdf(false);
    }
  };

  // Autocomplete searches
  const handleFoodInputSearch = async (mealIndex: number, foodIndex: number, query: string) => {
    const updated = [...formDietData];
    const dayIndex = updated.findIndex(d => d.day === activeDayTab);
    if (dayIndex > -1) {
      updated[dayIndex].meals[mealIndex].foodItems[foodIndex].name = query;
      setFormDietData(updated);
    }

    if (!query.trim()) {
      setSearchResults([]);
      setActiveSearchIndex(null);
      return;
    }

    try {
      const res = await fetch(`${getPublicApiBase()}/diet-plans/foods?query=${encodeURIComponent(query)}`);
      const result = await res.json();
      if (result.success) {
        setSearchResults(result.data || []);
        setActiveSearchIndex({ mealIndex, foodIndex });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSelectFoodItem = (mealIndex: number, foodIndex: number, selectedFood: any) => {
    const updated = [...formDietData];
    const dayIndex = updated.findIndex(d => d.day === activeDayTab);
    if (dayIndex > -1) {
      const item = updated[dayIndex].meals[mealIndex].foodItems[foodIndex];
      item.name = selectedFood.name;
      item.calories = selectedFood.calories || 0;
      item.protein = selectedFood.protein || 0;
      item.carbs = selectedFood.carbs || 0;
      item.fats = selectedFood.fats || 0;

      updated[dayIndex].totalCalories = calculateDayCalories(updated[dayIndex]);
      setFormDietData(updated);
    }
    setActiveSearchIndex(null);
    setSearchResults([]);
  };

  // Add Meal
  const handleAddMeal = () => {
    const updated = [...formDietData];
    const dayIndex = updated.findIndex(d => d.day === activeDayTab);
    if (dayIndex > -1) {
      updated[dayIndex].meals.push({
        name: 'New Snack/Meal',
        time: '04:00 PM',
        foodItems: []
      });
      setFormDietData(updated);
    }
  };

  const handleUpdateMealMeta = (mealIndex: number, field: 'name' | 'time' | 'instructions', val: string) => {
    const updated = [...formDietData];
    const dayIndex = updated.findIndex(d => d.day === activeDayTab);
    if (dayIndex > -1) {
      (updated[dayIndex].meals[mealIndex] as any)[field] = val;
      setFormDietData(updated);
    }
  };

  const handleRemoveMeal = (mealIndex: number) => {
    const updated = [...formDietData];
    const dayIndex = updated.findIndex(d => d.day === activeDayTab);
    if (dayIndex > -1) {
      updated[dayIndex].meals.splice(mealIndex, 1);
      updated[dayIndex].totalCalories = calculateDayCalories(updated[dayIndex]);
      setFormDietData(updated);
    }
  };

  // Food items helpers inside meal
  const handleAddFoodItem = (mealIndex: number) => {
    const updated = [...formDietData];
    const dayIndex = updated.findIndex(d => d.day === activeDayTab);
    if (dayIndex > -1) {
      updated[dayIndex].meals[mealIndex].foodItems.push({
        name: '',
        quantity: '1 portion',
        calories: 0,
        protein: 0,
        carbs: 0,
        fats: 0
      });
      setFormDietData(updated);
    }
  };

  const handleUpdateFoodField = (mealIndex: number, foodIndex: number, field: keyof FoodItem, val: string | number) => {
    const updated = [...formDietData];
    const dayIndex = updated.findIndex(d => d.day === activeDayTab);
    if (dayIndex > -1) {
      const item = updated[dayIndex].meals[mealIndex].foodItems[foodIndex];
      if (field === 'name' || field === 'quantity') {
        (item as any)[field] = val;
      } else {
        (item as any)[field] = Number(val) || 0;
      }
      updated[dayIndex].totalCalories = calculateDayCalories(updated[dayIndex]);
      setFormDietData(updated);
    }
  };

  const handleRemoveFoodItem = (mealIndex: number, foodIndex: number) => {
    const updated = [...formDietData];
    const dayIndex = updated.findIndex(d => d.day === activeDayTab);
    if (dayIndex > -1) {
      updated[dayIndex].meals[mealIndex].foodItems.splice(foodIndex, 1);
      updated[dayIndex].totalCalories = calculateDayCalories(updated[dayIndex]);
      setFormDietData(updated);
    }
  };

  // Avoid foods helpers
  const handleAddAvoidFood = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAvoidFood.trim()) return;
    if (!formFoodsToAvoid.includes(newAvoidFood.trim())) {
      setFormFoodsToAvoid([...formFoodsToAvoid, newAvoidFood.trim()]);
    }
    setNewAvoidFood('');
  };

  const handleRemoveAvoidFood = (food: string) => {
    setFormFoodsToAvoid(formFoodsToAvoid.filter(f => f !== food));
  };

  // Daily target helper
  const handleUpdateTargetValue = (targetName: string, val: string) => {
    setFormDailyTargets(formDailyTargets.map(t => t.name === targetName ? { ...t, value: val } : t));
  };

  // User assignment helper
  const toggleUserAssignment = (userId: string) => {
    if (assignedUserIds.includes(userId)) {
      setAssignedUserIds(assignedUserIds.filter(id => id !== userId));
    } else {
      setAssignedUserIds([...assignedUserIds, userId]);
    }
  };

  // Submit plan
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      setError('Diet Plan Name is required');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    const payload = {
      name: formName,
      description: formDescription,
      patientAge: formAge,
      patientHeight: formHeight,
      patientWeight: formWeight,
      patientGoal: formGoal,
      patientDiet: formDiet,
      dietData: formDietData,
      foodsToAvoid: formFoodsToAvoid,
      dailyTargets: formDailyTargets,
      userIds: assignedUserIds,
      pdfUrl: formPdfUrl
    };

    try {
      let url = `${API_BASE}/diet-plans`;
      let method = 'POST';

      if (selectedPlan) {
        url = `${API_BASE}/diet-plans/${selectedPlan.id}`;
        method = 'PATCH';
      }

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'x-admin-api-key': apiKey
        },
        body: JSON.stringify(payload)
      });

      const result = await res.json();
      if (result.success) {
        setSuccess(selectedPlan ? 'Diet plan updated successfully!' : 'Diet plan created successfully!');
        if (!selectedPlan) {
          setIsCreatingNew(false);
        }
        setSelectedPlan(result.data);
        fetchDietPlans();
      } else {
        setError(result.message || 'Failed to save diet plan');
      }
    } catch (err) {
      console.error(err);
      setError('Connection failed to save diet plan');
    } finally {
      setLoading(false);
    }
  };

  // Delete plan
  const handleDeletePlan = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this diet plan?')) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch(`${API_BASE}/diet-plans/${id}`, {
        method: 'DELETE',
        headers: {
          'x-admin-api-key': apiKey
        }
      });
      const result = await res.json();
      if (result.success) {
        setSuccess('Diet plan deleted successfully!');
        if (selectedPlan?.id === id) {
          setSelectedPlan(null);
        }
        fetchDietPlans();
      } else {
        setError(result.message || 'Failed to delete diet plan');
      }
    } catch (err) {
      console.error(err);
      setError('Connection failed to delete diet plan');
    } finally {
      setLoading(false);
    }
  };

  // User Search matching
  const searchedUsers = useMemo(() => {
    const q = searchUserQuery.toLowerCase();
    return filteredRegistrations.filter(u => 
      (u.name || u.fullName || '').toLowerCase().includes(q) ||
      (u.email || '').toLowerCase().includes(q)
    );
  }, [filteredRegistrations, searchUserQuery]);

  // Load User Nutrition Analytics
  const handleViewUserAnalytics = async (user: any) => {
    setAnalyticsUser(user);
    setLoadingAnalytics(true);
    setAnalyticsReport(null);
    setAnalyticsHistory([]);
    try {
      const token = localStorage.getItem('userToken'); // fallback check or use API proxy
      const today = new Date();
      const todayStr = today.toISOString().split('T')[0];
      
      const start = new Date(today);
      start.setDate(today.getDate() - 6);
      const startStr = start.toISOString().split('T')[0];

      // Call public proxy via proxy endpoints
      const [reportRes, historyRes] = await Promise.all([
        fetch(`${getPublicApiBase()}/diet-plans/user/${user.id}/reports?endDate=${todayStr}`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(`${getPublicApiBase()}/diet-plans/user/${user.id}/history?startDate=${startStr}&endDate=${todayStr}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      const reportData = await reportRes.json();
      const historyData = await historyRes.json();

      if (reportData.success) setAnalyticsReport(reportData.data);
      if (historyData.success) setAnalyticsHistory(historyData.data || []);

    } catch (err) {
      console.error('Error fetching user analytics:', err);
    } finally {
      setLoadingAnalytics(false);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Title Header */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Clinical Diet Planner</h1>
          <p className="text-slate-500 text-xs mt-1">Design, duplicate, and assign nutrition plans. Track real-time patient compliance.</p>
        </div>
        
        {analyticsUser && (
          <button 
            onClick={() => setAnalyticsUser(null)} 
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold uppercase rounded-xl transition"
          >
            ← Back to Planner
          </button>
        )}
      </div>

      {analyticsUser ? (
        /* =========================================================
           USER NUTRITION PROFILE ANALYTICS
           ========================================================= */
        <div className="bg-white rounded-[2rem] border border-slate-100 p-6 md:p-8 shadow-sm space-y-8">
          <div className="flex justify-between items-center border-b border-slate-100 pb-4">
            <div>
              <span className="text-[10px] font-bold text-pink-500 uppercase tracking-widest block font-mono">Patient Analytics Dashboard</span>
              <h2 className="text-2xl font-black text-slate-900">{analyticsUser.name || analyticsUser.fullName}</h2>
              <p className="text-slate-500 text-xs mt-0.5">{analyticsUser.email}</p>
            </div>
            <button
              onClick={() => setAnalyticsUser(null)}
              className="p-2 bg-slate-50 border border-slate-200 text-slate-500 hover:text-slate-700 rounded-xl transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {loadingAnalytics ? (
            <div className="h-96 flex items-center justify-center">
              <div className="flex flex-col items-center gap-2.5">
                <Loader2 className="w-10 h-10 text-pink-500 animate-spin" />
                <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Compiling diet logs...</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Stats & Weekly Aggregations */}
              <div className="lg:col-span-4 space-y-6">
                <div className="bg-slate-50 border border-slate-100 rounded-[2rem] p-6 space-y-6">
                  <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2 border-b border-slate-200 pb-3">
                    <BarChart2 className="w-4 h-4 text-pink-500" /> Compliance Metrics
                  </h3>

                  <div className="space-y-4">
                    {/* Diet Adherence */}
                    <div className="flex justify-between items-center p-3.5 bg-white border border-slate-100 rounded-2xl shadow-sm">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Diet Adherence</span>
                        <span className="text-xl font-black text-slate-800">{analyticsReport?.overallDietAdherence || 0}%</span>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-pink-50 text-pink-500 flex items-center justify-center font-bold text-sm">
                        AD
                      </div>
                    </div>

                    {/* Consistency */}
                    <div className="flex justify-between items-center p-3.5 bg-white border border-slate-100 rounded-2xl shadow-sm">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">On-Time Consistency</span>
                        <span className="text-xl font-black text-slate-800">{analyticsReport?.consistencyPercentage || 0}%</span>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-500 flex items-center justify-center font-bold text-sm">
                        CS
                      </div>
                    </div>

                    {/* Completed Meals count */}
                    <div className="flex justify-between items-center p-3.5 bg-white border border-slate-100 rounded-2xl shadow-sm">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Completed Meals</span>
                        <span className="text-xl font-black text-slate-800">{analyticsReport?.totalMealsCompleted || 0}</span>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-green-50 text-green-500 flex items-center justify-center">
                        <Check className="w-5 h-5 text-green-600" />
                      </div>
                    </div>

                    {/* Skipped count */}
                    <div className="flex justify-between items-center p-3.5 bg-white border border-slate-100 rounded-2xl shadow-sm">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Skipped Meals</span>
                        <span className="text-xl font-black text-rose-600">{analyticsReport?.skippedMeals || 0}</span>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center">
                        <ShieldAlert className="w-5 h-5 text-rose-600" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Precise Timestamp Timeline Log */}
              <div className="lg:col-span-8 bg-white border border-slate-100 rounded-[2.5rem] p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2 mb-6 border-b border-slate-100 pb-3">
                    <Clock className="w-4 h-4 text-purple-500" /> Exact Timestamp Log History
                  </h3>

                  {analyticsHistory.length === 0 ? (
                    <div className="text-center py-20 text-slate-300">
                      <Calendar className="w-12 h-12 mx-auto mb-4 text-slate-200" />
                      <p className="text-sm font-extrabold uppercase tracking-wider">No logged history</p>
                      <p className="text-xs text-slate-400 mt-1">This user has not tracked any meals in the last 7 days.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-100 font-bold text-slate-500">
                            <th className="p-3">Date</th>
                            <th className="p-3">Day</th>
                            <th className="p-3">Meal Name</th>
                            <th className="p-3">Status</th>
                            <th className="p-3 text-right">Logged Time</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {analyticsHistory.map((log: any, idx: number) => (
                            <tr key={idx} className="hover:bg-slate-50/50">
                              <td className="p-3 font-semibold text-slate-700">{log.date}</td>
                              <td className="p-3 text-slate-400">Day {log.day}</td>
                              <td className="p-3 font-bold text-slate-800">{log.mealName}</td>
                              <td className="p-3">
                                <span className={`px-2.5 py-0.5 rounded-full font-extrabold text-[9px] uppercase tracking-wider inline-block ${
                                  log.status === 'completed' 
                                    ? 'bg-green-50 text-green-700 border border-green-100' 
                                    : log.status === 'delayed' 
                                      ? 'bg-amber-50 text-amber-700 border border-amber-100' 
                                      : 'bg-rose-50 text-rose-700 border border-rose-100'
                                }`}>
                                  {log.status === 'completed' ? 'On Time' : log.status === 'delayed' ? 'Late' : 'Skipped'}
                                </span>
                              </td>
                              <td className="p-3 text-right font-mono text-slate-500">
                                {log.status === 'skipped' ? 'N/A' : new Date(log.completionTime).toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>

            </div>
          )}
        </div>
      ) : (
        /* =========================================================
           DIET PLAN MANAGEMENT LIST & CREATE FORM
           ========================================================= */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: List of existing plans */}
          <div className="lg:col-span-4 bg-white rounded-[2rem] border border-slate-100 p-6 shadow-sm space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-800">Diet Plans</h2>
              <button
                onClick={handleCreateNewClick}
                type="button"
                className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" /> Create
              </button>
            </div>

            {dietPlans.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <Sparkles className="w-10 h-10 mx-auto mb-3 text-slate-200" />
                <p className="text-xs font-semibold uppercase tracking-wider">No diet plans created</p>
                <p className="text-[10px] text-slate-400 mt-1">Click Create to get started.</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
                {dietPlans.map((plan) => {
                  const isSelected = selectedPlan?.id === plan.id;
                  return (
                    <div
                      key={plan.id}
                      onClick={() => handleSelectPlan(plan)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex justify-between items-start gap-4 ${
                        isSelected 
                          ? 'border-purple-500 bg-purple-50/20 shadow-sm'
                          : 'border-slate-100 hover:border-slate-200 bg-[#FCFDFB]'
                      }`}
                    >
                      <div className="space-y-1">
                        <h3 className="font-bold text-slate-900 text-sm line-clamp-1">{plan.name}</h3>
                        <p className="text-xs text-slate-500 line-clamp-2">{plan.description}</p>
                        <div className="flex gap-2 mt-2">
                          <span className="bg-slate-100 text-slate-600 text-[9px] font-bold px-2 py-0.5 rounded uppercase">
                            {plan.patientDiet}
                          </span>
                          <span className="bg-purple-100 text-purple-700 text-[9px] font-bold px-2 py-0.5 rounded uppercase">
                            {plan.userIds?.length || 0} Users
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => handleDeletePlan(plan.id!, e)}
                        className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Column: Create/Edit Form */}
          <div className="lg:col-span-8 bg-white rounded-[2rem] border border-slate-100 p-6 md:p-8 shadow-sm">
            {error && (
              <div className="mb-6 p-4 bg-rose-50 border border-rose-100 text-rose-600 text-sm rounded-2xl flex items-center gap-2 animate-pulse">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-100 text-green-600 text-sm rounded-2xl flex items-center gap-2 shadow-sm">
                <Check className="w-5 h-5 shrink-0" />
                <span>{success}</span>
              </div>
            )}

            {!isCreatingNew && !selectedPlan ? (
              <div className="text-center py-24 text-slate-400">
                <Sparkles className="w-16 h-16 mx-auto mb-4 text-purple-200" />
                <h3 className="text-xl font-bold text-slate-800">Diet Plan Management</h3>
                <p className="text-slate-500 text-sm max-w-sm mx-auto mt-2">
                  Select a diet plan from the left panel to edit its details, assign users, or click "Create" to design a new clinical diet chart.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-100 pb-4 gap-4">
                  <div>
                    <span className="text-[10px] font-bold text-purple-600 uppercase tracking-widest block">Diet Plan Editor</span>
                    <h2 className="text-2xl font-black text-slate-800">
                      {selectedPlan ? `Edit: ${formName}` : 'Create New Diet Plan'}
                    </h2>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {selectedPlan && (
                      <button
                        type="button"
                        onClick={handleDuplicatePlan}
                        className="flex items-center gap-2 px-4 py-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-2xl text-xs font-bold uppercase tracking-wider transition shadow-sm"
                      >
                        <Copy className="w-4 h-4" /> Duplicate
                      </button>
                    )}

                    <button
                      type="submit"
                      className="flex items-center gap-2 px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs font-bold uppercase tracking-wider transition shadow"
                    >
                      <Save className="w-4 h-4" /> Save Diet Plan
                    </button>
                  </div>
                </div>

                {/* General Metadata */}
                <div className="space-y-4">
                  <h3 className="text-sm font-black uppercase text-slate-400 tracking-wider">General Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600 uppercase">Plan Name</label>
                      <input
                        type="text"
                        required
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        placeholder="e.g. Personalized PCOS Anti-Inflammatory Diet"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-slate-800 text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600 uppercase">Short Description</label>
                      <input
                        type="text"
                        value={formDescription}
                        onChange={(e) => setFormDescription(e.target.value)}
                        placeholder="e.g. Hormonal Balance • Gut Healing • Healthy Weight Gain"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-slate-800 text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Target Patient Stats */}
                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <h3 className="text-sm font-black uppercase text-slate-400 tracking-wider">Patient Metrics</h3>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Age</label>
                      <input
                        type="text"
                        value={formAge}
                        onChange={(e) => setFormAge(e.target.value)}
                        placeholder="28 Years"
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-800 text-xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Height</label>
                      <input
                        type="text"
                        value={formHeight}
                        onChange={(e) => setFormHeight(e.target.value)}
                        placeholder="165 cm"
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-800 text-xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Weight</label>
                      <input
                        type="text"
                        value={formWeight}
                        onChange={(e) => setFormWeight(e.target.value)}
                        placeholder="65 kg"
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-800 text-xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Goal</label>
                      <input
                        type="text"
                        value={formGoal}
                        onChange={(e) => setFormGoal(e.target.value)}
                        placeholder="Weight Loss"
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-800 text-xs"
                      />
                    </div>
                    <div className="space-y-1.5 col-span-2 md:col-span-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Diet Type</label>
                      <select
                        value={formDiet}
                        onChange={(e) => setFormDiet(e.target.value)}
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-800 text-xs"
                      >
                        <option value="Vegetarian">Vegetarian</option>
                        <option value="Non-Vegetarian">Non-Vegetarian</option>
                        <option value="Vegan">Vegan</option>
                        <option value="Eggetarian">Eggetarian</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* PDF Chart Upload */}
                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <h3 className="text-sm font-black uppercase text-slate-400 tracking-wider">Clinical PDF Document</h3>
                  <div className="bg-slate-50 border border-slate-100 rounded-[2rem] p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-pink-50 rounded-2xl flex items-center justify-center text-pink-600">
                        <FileText className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-800">Attach Official PDF Chart</h4>
                        <p className="text-slate-400 text-xs mt-0.5">Attach a detailed medical chart. Allowed: PDF only.</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto">
                      {formPdfUrl && (
                        <a 
                          href={formPdfUrl} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-800 transition flex items-center gap-1.5"
                        >
                          <ExternalLink className="w-3.5 h-3.5" /> View PDF
                        </a>
                      )}
                      
                      <label className="flex-1 md:flex-none cursor-pointer px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition shadow-sm flex items-center justify-center gap-2">
                        {uploadingPdf ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" /> Uploading...
                          </>
                        ) : (
                          <>
                            <Upload className="w-3.5 h-3.5" /> Upload File
                          </>
                        )}
                        <input
                          type="file"
                          accept=".pdf"
                          onChange={handlePdfUpload}
                          disabled={uploadingPdf}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {/* 7 Day Schedule Editor */}
                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-black uppercase text-slate-400 tracking-wider">7-Day Meal Schedule</h3>
                    <span className="text-xs font-bold text-purple-700 bg-purple-50 border border-purple-100 rounded-xl px-3 py-1">
                      Day {activeDayTab} Total: {formDietData.find(d => d.day === activeDayTab)?.totalCalories || 0} kcal
                    </span>
                  </div>

                  {/* Day Tabs selector */}
                  <div className="flex gap-1.5 p-1 bg-slate-50 border border-slate-100 rounded-2xl overflow-x-auto">
                    {Array.from({ length: 7 }, (_, i) => i + 1).map((dayNum) => (
                      <button
                        key={dayNum}
                        type="button"
                        onClick={() => setActiveDayTab(dayNum)}
                        className={`px-4 py-2 text-xs font-bold uppercase rounded-xl transition flex-1 shrink-0 ${
                          activeDayTab === dayNum 
                            ? 'bg-purple-600 text-white shadow' 
                            : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                        }`}
                      >
                        Day {dayNum}
                      </button>
                    ))}
                  </div>

                  {/* Meals list for the active day */}
                  {(() => {
                    const activeDayData = formDietData.find(d => d.day === activeDayTab);
                    const meals = activeDayData?.meals || [];
                    return (
                      <div className="space-y-4 bg-[#FAF8FC]/45 border border-purple-100/30 rounded-3xl p-5">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs font-bold text-slate-700 uppercase flex items-center gap-1.5">
                            <Coffee className="w-4 h-4 text-purple-400" />
                            Day {activeDayTab} Meals
                          </span>
                          <button
                            type="button"
                            onClick={handleAddMeal}
                            className="flex items-center gap-1 px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-600 text-[10px] font-bold uppercase rounded-lg border border-purple-200/50 transition"
                          >
                            <Plus className="w-3.5 h-3.5" /> Add Meal
                          </button>
                        </div>

                        {meals.length === 0 ? (
                          <div className="text-center py-10 text-slate-400 border border-dashed border-purple-100 rounded-2xl bg-white">
                            <p className="text-xs font-semibold">No meals defined for Day {activeDayTab}.</p>
                          </div>
                        ) : (
                          <div className="space-y-6">
                            {meals.map((meal, mIdx) => (
                              <div key={mIdx} className="bg-white p-5 border border-slate-100 rounded-3xl space-y-4 relative shadow-sm hover:shadow-md transition-shadow">
                                
                                {/* Meal details (Name, Time, Instructions) */}
                                <div className="grid grid-cols-12 gap-3 items-center">
                                  <div className="col-span-3">
                                    <input
                                      type="text"
                                      value={meal.name}
                                      onChange={(e) => handleUpdateMealMeta(mIdx, 'name', e.target.value)}
                                      placeholder="Breakfast"
                                      className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg outline-none text-xs font-bold text-slate-800"
                                    />
                                  </div>
                                  <div className="col-span-2">
                                    <input
                                      type="text"
                                      value={meal.time}
                                      onChange={(e) => handleUpdateMealMeta(mIdx, 'time', e.target.value)}
                                      placeholder="08:30 AM"
                                      className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg outline-none text-xs font-bold text-slate-500 text-center"
                                    />
                                  </div>
                                  <div className="col-span-6">
                                    <input
                                      type="text"
                                      value={meal.instructions || ''}
                                      onChange={(e) => handleUpdateMealMeta(mIdx, 'instructions', e.target.value)}
                                      placeholder="Meal instructions (optional)"
                                      className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg outline-none text-xs text-slate-600"
                                    />
                                  </div>
                                  <div className="col-span-1 text-right">
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveMeal(mIdx)}
                                      className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg transition"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>

                                {/* Food Items inside this meal */}
                                <div className="space-y-3 pl-4 border-l-2 border-purple-100">
                                  <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Food Items & Calories</span>
                                    <button
                                      type="button"
                                      onClick={() => handleAddFoodItem(mIdx)}
                                      className="text-[10px] font-bold text-purple-600 hover:text-purple-800 flex items-center gap-0.5"
                                    >
                                      + Add Food Item
                                    </button>
                                  </div>

                                  {(meal.foodItems || []).length === 0 ? (
                                    <p className="text-[11px] text-slate-400 italic">No food items added. Click Add Food Item above.</p>
                                  ) : (
                                    <div className="space-y-2">
                                      {(meal.foodItems || []).map((foodItem, fIdx) => (
                                        <div key={fIdx} className="grid grid-cols-12 gap-2 items-center relative">
                                          
                                          {/* Food name autocomplete search input */}
                                          <div className="col-span-4 relative">
                                            <input
                                              type="text"
                                              value={foodItem.name}
                                              onChange={(e) => handleFoodInputSearch(mIdx, fIdx, e.target.value)}
                                              placeholder="Oatmeal, Salmon, etc."
                                              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg outline-none text-xs text-slate-800"
                                            />
                                            {/* Autocomplete suggestions dropdown */}
                                            {activeSearchIndex?.mealIndex === mIdx && activeSearchIndex?.foodIndex === fIdx && searchResults.length > 0 && (
                                              <div className="absolute left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-[80] max-h-48 overflow-y-auto divide-y divide-slate-100">
                                                {searchResults.map((resFood) => (
                                                  <div
                                                    key={resFood.id}
                                                    onClick={() => handleSelectFoodItem(mIdx, fIdx, resFood)}
                                                    className="p-2 text-xs hover:bg-slate-50 cursor-pointer flex justify-between items-center"
                                                  >
                                                    <span className="font-bold text-slate-800">{resFood.name}</span>
                                                    <span className="text-[10px] text-slate-400 font-bold">{resFood.calories} kcal</span>
                                                  </div>
                                                ))}
                                              </div>
                                            )}
                                          </div>

                                          {/* Quantity */}
                                          <div className="col-span-2">
                                            <input
                                              type="text"
                                              value={foodItem.quantity}
                                              onChange={(e) => handleUpdateFoodField(mIdx, fIdx, 'quantity', e.target.value)}
                                              placeholder="1 portion"
                                              className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg outline-none text-xs text-slate-700"
                                            />
                                          </div>

                                          {/* Calories */}
                                          <div className="col-span-1.5 flex items-center gap-1.5">
                                            <input
                                              type="number"
                                              value={foodItem.calories || ''}
                                              onChange={(e) => handleUpdateFoodField(mIdx, fIdx, 'calories', e.target.value)}
                                              placeholder="Cal"
                                              className="w-full px-1 py-1.5 bg-slate-50 border border-slate-200 rounded-lg outline-none text-xs text-slate-800 text-center font-bold"
                                            />
                                          </div>

                                          {/* Protein */}
                                          <div className="col-span-1 flex items-center gap-1">
                                            <input
                                              type="number"
                                              value={foodItem.protein || ''}
                                              onChange={(e) => handleUpdateFoodField(mIdx, fIdx, 'protein', e.target.value)}
                                              placeholder="P"
                                              className="w-full px-1 py-1.5 bg-slate-50 border border-slate-200 rounded-lg outline-none text-xs text-slate-800 text-center"
                                            />
                                          </div>

                                          {/* Carbs */}
                                          <div className="col-span-1 flex items-center gap-1">
                                            <input
                                              type="number"
                                              value={foodItem.carbs || ''}
                                              onChange={(e) => handleUpdateFoodField(mIdx, fIdx, 'carbs', e.target.value)}
                                              placeholder="C"
                                              className="w-full px-1 py-1.5 bg-slate-50 border border-slate-200 rounded-lg outline-none text-xs text-slate-800 text-center"
                                            />
                                          </div>

                                          {/* Fats */}
                                          <div className="col-span-1 flex items-center gap-1">
                                            <input
                                              type="number"
                                              value={foodItem.fats || ''}
                                              onChange={(e) => handleUpdateFoodField(mIdx, fIdx, 'fats', e.target.value)}
                                              placeholder="F"
                                              className="w-full px-1 py-1.5 bg-slate-50 border border-slate-200 rounded-lg outline-none text-xs text-slate-800 text-center"
                                            />
                                          </div>

                                          <div className="col-span-1.5 text-right">
                                            <button
                                              type="button"
                                              onClick={() => handleRemoveFoodItem(mIdx, fIdx)}
                                              className="p-1 text-slate-400 hover:text-rose-500 rounded-lg transition"
                                            >
                                              <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>

                {/* Daily Targets & Avoided Foods */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-slate-100">
                  
                  {/* Daily Targets */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-black uppercase text-slate-400 tracking-wider">Daily Targets</h3>
                    <div className="space-y-3 bg-[#FAF8FC]/30 border border-slate-100 rounded-3xl p-5">
                      {formDailyTargets.map((target) => (
                        <div key={target.name} className="flex items-center justify-between gap-4">
                          <span className="text-xs font-extrabold text-slate-705">{target.name}</span>
                          <input
                            type="text"
                            value={target.value}
                            onChange={(e) => handleUpdateTargetValue(target.name, e.target.value)}
                            placeholder="e.g. 8 glasses"
                            className="w-48 px-3 py-1.5 bg-white border border-slate-200 rounded-xl outline-none text-xs text-slate-800"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Foods To Avoid */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-black uppercase text-slate-400 tracking-wider">Foods To Avoid</h3>
                    <div className="space-y-3 bg-[#FAF8FC]/30 border border-slate-100 rounded-3xl p-5 flex flex-col justify-between min-h-[160px]">
                      <div className="flex flex-wrap gap-2">
                        {formFoodsToAvoid.length === 0 ? (
                          <span className="text-xs text-slate-400 italic">No foods restricted yet.</span>
                        ) : (
                          formFoodsToAvoid.map((food) => (
                            <span 
                              key={food} 
                              className="bg-rose-50 text-rose-600 border border-rose-100 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm"
                            >
                              {food}
                              <button 
                                type="button" 
                                onClick={() => handleRemoveAvoidFood(food)}
                                className="hover:text-rose-800 font-bold ml-1"
                              >
                                <X className="w-2.5 h-2.5" />
                              </button>
                            </span>
                          ))
                        )}
                      </div>

                      <div className="flex gap-2 mt-4">
                        <input
                          type="text"
                          placeholder="Add food restriction..."
                          value={newAvoidFood}
                          onChange={(e) => setNewAvoidFood(e.target.value)}
                          className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl outline-none text-xs text-slate-800"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              if (newAvoidFood.trim()) {
                                if (!formFoodsToAvoid.includes(newAvoidFood.trim())) {
                                  setFormFoodsToAvoid([...formFoodsToAvoid, newAvoidFood.trim()]);
                                }
                                setNewAvoidFood('');
                              }
                            }
                          }}
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            if (newAvoidFood.trim()) {
                              if (!formFoodsToAvoid.includes(newAvoidFood.trim())) {
                                setFormFoodsToAvoid([...formFoodsToAvoid, newAvoidFood.trim()]);
                              }
                              setNewAvoidFood('');
                            }
                          }}
                          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Select Users to Show Diet Chart */}
                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <h3 className="text-sm font-black uppercase text-slate-400 tracking-wider">Assign Specific Users</h3>
                  
                  <div className="space-y-3 bg-[#FCFDFB] border border-slate-100 rounded-3xl p-5">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search users by name or email..."
                        value={searchUserQuery}
                        onChange={(e) => setSearchUserQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-xs text-slate-800"
                      />
                      <Search className="absolute left-3.5 top-3 w-3.5 h-3.5 text-slate-400" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-56 overflow-y-auto pr-1">
                      {searchedUsers.length === 0 ? (
                        <p className="col-span-2 text-center py-6 text-xs text-slate-400">No users found.</p>
                      ) : (
                        searchedUsers.map((user) => {
                          const isAssigned = assignedUserIds.includes(user.id);
                          return (
                            <div 
                              key={user.id}
                              className={`flex items-center justify-between p-3 rounded-2xl border transition ${
                                isAssigned 
                                  ? 'border-purple-200 bg-purple-50/10' 
                                  : 'border-slate-50 hover:bg-slate-50/60 bg-white'
                              }`}
                            >
                              <div 
                                onClick={() => toggleUserAssignment(user.id)}
                                className="flex items-center gap-2.5 flex-1 cursor-pointer"
                              >
                                <div className="w-8 h-8 rounded-lg bg-pink-50 text-pink-600 flex items-center justify-center font-bold text-xs uppercase">
                                  {(user.name || user.fullName || 'U').charAt(0)}
                                </div>
                                <div>
                                  <p className="text-xs font-bold text-slate-800 line-clamp-1">{user.name || user.fullName || 'WombCare User'}</p>
                                  <p className="text-[9px] text-slate-400 line-clamp-1">{user.email}</p>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-3">
                                {/* Analytics icon button */}
                                <button
                                  type="button"
                                  title="View User Nutrition Logs"
                                  onClick={() => handleViewUserAnalytics(user)}
                                  className="p-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-500 rounded-xl transition"
                                >
                                  <BarChart2 className="w-3.5 h-3.5" />
                                </button>

                                <div 
                                  onClick={() => toggleUserAssignment(user.id)}
                                  className={`w-5 h-5 rounded-md border flex items-center justify-center cursor-pointer transition ${
                                    isAssigned 
                                      ? 'bg-purple-600 border-purple-600 text-white' 
                                      : 'border-slate-200 bg-white'
                                  }`}
                                >
                                  {isAssigned && <Check className="w-3 h-3 stroke-[3px]" />}
                                </div>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>

              </form>
            )}
          </div>

        </div>
      )}

    </div>
  );
}
