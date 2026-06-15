export interface Meal {
  time: string;
  food: string | string[];
  calories: number;
}

export interface DayDietPlan {
  day: number;
  meals: Meal[];
  totalCalories: number;
}

export interface DailyTarget {
  name: string;
  value: string;
}

export interface DietPlan {
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
  userIds?: string[];
  pdfUrl?: string;
}
