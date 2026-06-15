'use client';

import React, { useState, useEffect } from 'react';
import { API_BASE } from '@/lib/api-config';
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
  X
} from 'lucide-react';

interface Meal {
  time: string;
  food: string;
  calories: number;
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
  const [formDiet, setFormDiet] = useState('');
  const [formDietData, setFormDietData] = useState<DayDietPlan[]>([]);
  const [formFoodsToAvoid, setFormFoodsToAvoid] = useState<string[]>([]);
  const [newAvoidFood, setNewAvoidFood] = useState('');
  const [formDailyTargets, setFormDailyTargets] = useState<DailyTarget[]>([
    { name: 'Water', value: '8-10 glasses' },
    { name: 'Sleep', value: '8 hours' },
    { name: 'Yoga', value: '30 mins' },
    { name: 'Walking', value: '5000 steps' }
  ]);
  const [assignedUserIds, setAssignedUserIds] = useState<string[]>([]);

  useEffect(() => {
    fetchDietPlans();
  }, []);

  const fetchDietPlans = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/diet-plans/admin`, {
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
      { name: 'Water', value: '8-10 glasses' },
      { name: 'Sleep', value: '8 hours' },
      { name: 'Yoga', value: '30 mins' },
      { name: 'Walking', value: '5000 steps' }
    ]);
    setAssignedUserIds(plan.userIds || []);
    setActiveDayTab(1);
  };

  const initEmptyDietData = (): DayDietPlan[] => {
    return Array.from({ length: 7 }, (_, i) => ({
      day: i + 1,
      totalCalories: 0,
      meals: []
    }));
  };

  const handleCreateNewClick = () => {
    setSelectedPlan(null);
    setIsCreatingNew(true);
    setError(null);
    setSuccess(null);

    setFormName('');
    setFormDescription('');
    setFormAge('31 Years');
    setFormHeight('162 cm');
    setFormWeight('50 kg');
    setFormGoal('Healthy Weight Gain (+3-5 kg)');
    setFormDiet('Vegetarian');
    setFormDietData(initEmptyDietData());
    setFormFoodsToAvoid([]);
    setFormDailyTargets([
      { name: 'Water', value: '8-10 glasses' },
      { name: 'Sleep', value: '8 hours' },
      { name: 'Yoga', value: '30 mins' },
      { name: 'Walking', value: '5000 steps' }
    ]);
    setAssignedUserIds([]);
    setActiveDayTab(1);
  };

  // Meal management helpers
  const handleAddMeal = () => {
    const updated = [...formDietData];
    const dayIndex = updated.findIndex(d => d.day === activeDayTab);
    if (dayIndex > -1) {
      updated[dayIndex].meals.push({
        time: '8:00 AM',
        food: 'New Meal Item',
        calories: 0
      });
      // Recalculate total calories
      updated[dayIndex].totalCalories = updated[dayIndex].meals.reduce((sum, m) => sum + Number(m.calories || 0), 0);
      setFormDietData(updated);
    }
  };

  const handleUpdateMeal = (mealIndex: number, field: keyof Meal, val: string | number) => {
    const updated = [...formDietData];
    const dayIndex = updated.findIndex(d => d.day === activeDayTab);
    if (dayIndex > -1) {
      const meal = updated[dayIndex].meals[mealIndex];
      if (field === 'calories') {
        meal.calories = Number(val) || 0;
      } else {
        (meal[field] as any) = val;
      }
      updated[dayIndex].totalCalories = updated[dayIndex].meals.reduce((sum, m) => sum + Number(m.calories || 0), 0);
      setFormDietData(updated);
    }
  };

  const handleRemoveMeal = (mealIndex: number) => {
    const updated = [...formDietData];
    const dayIndex = updated.findIndex(d => d.day === activeDayTab);
    if (dayIndex > -1) {
      updated[dayIndex].meals.splice(mealIndex, 1);
      updated[dayIndex].totalCalories = updated[dayIndex].meals.reduce((sum, m) => sum + Number(m.calories || 0), 0);
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
      userIds: assignedUserIds
    };

    try {
      let url = `${API_BASE}/diet-plans/admin`;
      let method = 'POST';

      if (selectedPlan) {
        url = `${API_BASE}/diet-plans/admin/${selectedPlan.id}`;
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
          setSelectedPlan(result.data);
        }
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
      const res = await fetch(`${API_BASE}/diet-plans/admin/${id}`, {
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

  const filteredUsers = registrations.filter(u => {
    const q = searchUserQuery.toLowerCase();
    return (
      (u.name || u.fullName || '').toLowerCase().includes(q) ||
      (u.email || '').toLowerCase().includes(q)
    );
  });

  return (
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
          <div className="mb-6 p-4 bg-rose-50 border border-rose-100 text-rose-600 text-sm rounded-2xl flex items-center gap-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-100 text-green-600 text-sm rounded-2xl flex items-center gap-2">
            <Check className="w-5 h-5 shrink-0 animate-bounce" />
            <span>{success}</span>
          </div>
        )}

        {!isCreatingNew && !selectedPlan ? (
          <div className="text-center py-24 text-slate-400">
            <Sparkles className="w-16 h-16 mx-auto mb-4 text-purple-200" />
            <h3 className="text-xl font-bold text-slate-800">Diet Plan Management</h3>
            <p className="text-slate-500 text-sm max-w-sm mx-auto mt-2">
              Select a diet plan from the left panel to edit its details and assign users, or click "Create" to design a new clinical diet chart.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-bold text-purple-600 uppercase tracking-widest block">Diet Plan Editor</span>
                <h2 className="text-2xl font-black text-slate-800">
                  {selectedPlan ? `Edit: ${formName}` : 'Create New Diet Plan'}
                </h2>
              </div>
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs font-bold uppercase tracking-wider transition shadow"
              >
                <Save className="w-4 h-4" /> Save Diet Plan
              </button>
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
                    placeholder="e.g. PCOD + Ulcerative Colitis (UC) Diet"
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
                    placeholder="31 Years"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-800 text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Height</label>
                  <input
                    type="text"
                    value={formHeight}
                    onChange={(e) => setFormHeight(e.target.value)}
                    placeholder="162 cm"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-800 text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Weight</label>
                  <input
                    type="text"
                    value={formWeight}
                    onChange={(e) => setFormWeight(e.target.value)}
                    placeholder="50 kg"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-800 text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Goal</label>
                  <input
                    type="text"
                    value={formGoal}
                    onChange={(e) => setFormGoal(e.target.value)}
                    placeholder="Healthy Weight Gain"
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
                  <div className="space-y-3 bg-[#FAF8FC]/50 border border-purple-100/30 rounded-3xl p-5">
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
                        <button
                          type="button"
                          onClick={handleAddMeal}
                          className="mt-2 text-xs text-purple-600 font-bold hover:underline"
                        >
                          Add a meal item
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {meals.map((meal, idx) => (
                          <div key={idx} className="grid grid-cols-12 gap-3 items-center bg-white p-3.5 border border-slate-100 rounded-2xl relative shadow-sm">
                            <div className="col-span-3">
                              <input
                                type="text"
                                value={meal.time}
                                onChange={(e) => handleUpdateMeal(idx, 'time', e.target.value)}
                                placeholder="8:00 AM"
                                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg outline-none text-xs font-semibold text-slate-700"
                              />
                            </div>
                            <div className="col-span-6">
                              <input
                                type="text"
                                value={meal.food}
                                onChange={(e) => handleUpdateMeal(idx, 'food', e.target.value)}
                                placeholder="Food item description"
                                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg outline-none text-xs text-slate-800"
                              />
                            </div>
                            <div className="col-span-2 flex items-center gap-1.5">
                              <input
                                type="number"
                                value={meal.calories || ''}
                                onChange={(e) => handleUpdateMeal(idx, 'calories', e.target.value)}
                                placeholder="0"
                                className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg outline-none text-xs text-slate-800 text-center font-bold"
                              />
                              <span className="text-[10px] text-slate-400 font-bold">kcal</span>
                            </div>
                            <div className="col-span-1 text-right">
                              <button
                                type="button"
                                onClick={() => handleRemoveMeal(idx)}
                                className="p-1 text-slate-400 hover:text-rose-500 rounded-lg transition"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
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
                      <span className="text-xs font-extrabold text-slate-750">{target.name}</span>
                      <input
                        type="text"
                        value={target.value}
                        onChange={(e) => handleUpdateTargetValue(target.name, e.target.value)}
                        placeholder="e.g. 8 glasses / 8 hours"
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
                      <span className="text-xs text-slate-400 italic">No foods explicitly restricted yet.</span>
                    ) : (
                      formFoodsToAvoid.map((food) => (
                        <span 
                          key={food} 
                          className="bg-rose-50 text-rose-600 border border-rose-100 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm animate-fade-in"
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
                      placeholder="Add food to restrict..."
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

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {filteredUsers.length === 0 ? (
                    <p className="text-center py-6 text-xs text-slate-400">No users found.</p>
                  ) : (
                    filteredUsers.map((user) => {
                      const isAssigned = assignedUserIds.includes(user.id);
                      return (
                        <div 
                          key={user.id}
                          onClick={() => toggleUserAssignment(user.id)}
                          className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition ${
                            isAssigned 
                              ? 'border-purple-200 bg-purple-50/20' 
                              : 'border-slate-50 hover:bg-slate-50/80 bg-white'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-pink-50 text-pink-600 flex items-center justify-center font-bold text-xs uppercase">
                              {(user.fullName || user.name || 'U').charAt(0)}
                            </div>
                            <div>
                              <p className="text-xs font-bold text-slate-800 line-clamp-1">{user.fullName || user.name || 'WombCare User'}</p>
                              <p className="text-[10px] text-slate-400 line-clamp-1">{user.email}</p>
                            </div>
                          </div>
                          
                          <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition ${
                            isAssigned 
                              ? 'bg-purple-600 border-purple-600 text-white' 
                              : 'border-slate-200 bg-white'
                          }`}>
                            {isAssigned && <Check className="w-3 h-3 stroke-[3px]" />}
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
  );
}
