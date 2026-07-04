import React from 'react';
import { HealthAssessmentData } from './types';

interface StepSuccessProps {
  data: HealthAssessmentData;
}

export default function StepSuccess({ data }: StepSuccessProps) {
  const downloadResponses = () => {
    const lines = [
      "WOMEN'S HEALTH ASSESSMENT — " + (data.name || 'Unnamed'),
      "Generated: " + new Date().toLocaleString(),
      "",
      "SECTION 1: BASIC INFORMATION",
      "Full Name: " + data.name,
      "Age: " + data.age,
      "Height (cm): " + data.height,
      "Weight (kg): " + data.weight,
      "City: " + data.city,
      "Occupation: " + data.occupation,
      "Work Schedule: " + data.workschedule,
      "",
      "SECTION 2: MEDICAL HISTORY",
      "PCOS/PCOD Diagnosis: " + data.pcos,
      "Menstrual Cycle Pattern: " + data.cyclePattern.join(', '),
      "Current Medications: " + data.medications,
      "Thyroid Disorder: " + data.thyroid,
      "Diabetes/Prediabetes: " + data.diabetes,
      "Hypertension: " + data.htn,
      "Fatty Liver: " + data.fattyliver,
      "Vitamin Deficiencies: " + data.vitamins.join(', '),
      "Other Medical Conditions: " + data.otherConditions,
      "",
      "SECTION 3: LIFESTYLE",
      "Diet Preference: " + data.diet,
      "Food Allergies: " + data.allergies,
      "Food Preferences: " + data.foodPrefs,
      "Wake-up Time: " + data.wakeTime,
      "Bedtime: " + data.bedTime,
      "Sleep Duration (hrs): " + data.sleepHours,
      "Daily Water Intake (L): " + data.waterIntake,
      "Physical Activity Level: " + data.activityLevel,
      "Average Daily Steps: " + data.dailySteps,
      "Exercise Routine: " + data.exerciseRoutine,
      "Stress Level (1-10): " + data.stressLevel,
      "",
      "SECTION 4: HEALTH GOALS",
      "Selected Goals: " + data.goals.join(', '),
      "",
      "This information is confidential and used only to personalize health recommendations."
    ];

    const blob = new Blob([lines.join("\n")], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = (data.name ? data.name.replace(/\s+/g, '_') : 'patient') + '_health_assessment.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="step-panel active">
      <div className="success">
        <svg className="bloom" viewBox="0 0 20 20" fill="none" stroke="#C97B84" stroke-width="1.4">
          <path d="M10 3c2 2 2 5 0 7-2-2-2-5 0-7zM10 10c3 0 5 2.5 5 5-3 0-5-2.5-5-5zM10 10c-3 0-5 2.5-5 5 3 0 5-2.5 5-5zM10 10c0-3-2.5-5-5-5 0 3 2.5 5 5 5zM10 10c0-3-2.5-5 5-5 0 3-2.5 5-5 5z" />
        </svg>
        <h2>Thank you, your assessment is in.</h2>
        <p>
          We've recorded your answers. You can download a copy for your records
          below — your practitioner will use this to shape your personalized
          wellness plan.
        </p>
        <button
          type="button"
          className="btn btn-primary"
          onClick={downloadResponses}
        >
          Download My Responses
        </button>
      </div>
    </div>
  );
}
