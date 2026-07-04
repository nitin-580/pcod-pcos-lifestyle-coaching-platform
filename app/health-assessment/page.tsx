'use client';

import React, { useState } from 'react';
import FloatingNavbar from '@/components/FloatingNavbar';
import Footer from '@/components/Footer';
import Stepper from '@/components/health-assessment/Stepper';
import StepBasics from '@/components/health-assessment/StepBasics';
import StepMedical from '@/components/health-assessment/StepMedical';
import StepLifestyle from '@/components/health-assessment/StepLifestyle';
import StepGoals from '@/components/health-assessment/StepGoals';
import StepReview from '@/components/health-assessment/StepReview';
import StepSuccess from '@/components/health-assessment/StepSuccess';
import { HealthAssessmentData } from '@/components/health-assessment/types';

import './styles.css';

const totalSteps = 5;

export default function HealthAssessmentPage() {
  const [currentStep, setCurrentStep] = useState<number | 'success'>(1);
  const [formData, setFormData] = useState<HealthAssessmentData>({
    name: '',
    age: '',
    city: '',
    height: '',
    weight: '',
    occupation: '',
    workschedule: '',
    pcos: '',
    cyclePattern: [],
    medications: '',
    thyroid: '',
    diabetes: '',
    htn: '',
    fattyliver: '',
    vitamins: [],
    otherConditions: '',
    diet: '',
    allergies: '',
    foodPrefs: '',
    wakeTime: '',
    bedTime: '',
    sleepHours: '',
    waterIntake: '',
    activityLevel: '',
    dailySteps: '',
    exerciseRoutine: '',
    stressLevel: 5,
    goals: [],
  });

  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleFieldChange = (key: keyof HealthAssessmentData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
    // Clear error for the field once user starts typing/editing
    if (errors[key as string]) {
      setErrors((prev) => ({
        ...prev,
        [key as string]: false,
      }));
    }
  };

  const validateStep = (step: number): boolean => {
    const stepErrors: Record<string, boolean> = {};
    let isValid = true;

    if (step === 1) {
      // Validate Basics
      if (!formData.name.trim()) {
        stepErrors.name = true;
        isValid = false;
      }
      const ageVal = parseFloat(formData.age);
      if (isNaN(ageVal) || ageVal < 10 || ageVal > 80) {
        stepErrors.age = true;
        isValid = false;
      }
      const heightVal = parseFloat(formData.height);
      if (isNaN(heightVal) || heightVal < 100 || heightVal > 220) {
        stepErrors.height = true;
        isValid = false;
      }
      const weightVal = parseFloat(formData.weight);
      if (isNaN(weightVal) || weightVal < 30 || weightVal > 200) {
        stepErrors.weight = true;
        isValid = false;
      }
    } else if (step === 2) {
      // Validate Medical Required fields
      if (!formData.pcos) {
        stepErrors.pcos = true;
        isValid = false;
      }
      if (formData.cyclePattern.length === 0) {
        stepErrors.cyclePattern = true;
        isValid = false;
      }
    } else if (step === 3) {
      // Validate Lifestyle numeric fields (only if filled)
      if (formData.sleepHours.trim() !== '') {
        const val = parseFloat(formData.sleepHours);
        if (isNaN(val) || val < 0 || val > 24) {
          stepErrors.sleepHours = true;
          isValid = false;
        }
      }
      if (formData.waterIntake.trim() !== '') {
        const val = parseFloat(formData.waterIntake);
        if (isNaN(val) || val < 0 || val > 10) {
          stepErrors.waterIntake = true;
          isValid = false;
        }
      }
      if (formData.dailySteps.trim() !== '') {
        const val = parseFloat(formData.dailySteps);
        if (isNaN(val) || val < 0 || val > 50000) {
          stepErrors.dailySteps = true;
          isValid = false;
        }
      }
    }

    setErrors(stepErrors);
    return isValid;
  };

  const submitAssessment = async () => {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch('/api/health-assessments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.message || 'Failed to submit health assessment');
      }
      setCurrentStep('success');
    } catch (err: any) {
      console.error('Submit assessment error:', err);
      setSubmitError(err.message || 'Something went wrong while saving your assessment.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleNext = () => {
    if (typeof currentStep === 'number') {
      if (!validateStep(currentStep)) {
        // Scroll to the first invalid field
        setTimeout(() => {
          const invalidEl = document.querySelector('.invalid');
          invalidEl?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
        return;
      }

      if (currentStep === totalSteps) {
        submitAssessment();
      } else {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handleBack = () => {
    if (typeof currentStep === 'number' && currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <main className="assessment-container">
      <FloatingNavbar />

      <div className="wrap pt-24">
        <div className="masthead">
          <div className="eyebrow">Personalized Care Intake</div>
          <h1>Women's Health Assessment</h1>
          <p className="subtitle">
            A few minutes of questions so we can build a wellness plan around your
            cycle, lifestyle, and goals — not a generic template.
          </p>
        </div>

        {/* Stepper only visible during steps 1 to 5 */}
        {typeof currentStep === 'number' && (
          <Stepper currentStep={currentStep} totalSteps={totalSteps} />
        )}

        <form id="healthForm" noValidate onSubmit={(e) => e.preventDefault()}>
          <div className="card">
            {submitError && (
              <div className="p-4 mb-4 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-sm">
                {submitError}
              </div>
            )}

            {currentStep === 1 && (
              <StepBasics
                data={formData}
                errors={errors}
                onChange={handleFieldChange}
              />
            )}

            {currentStep === 2 && (
              <StepMedical
                data={formData}
                errors={errors}
                onChange={handleFieldChange}
              />
            )}

            {currentStep === 3 && (
              <StepLifestyle
                data={formData}
                errors={errors}
                onChange={handleFieldChange}
              />
            )}

            {currentStep === 4 && (
              <StepGoals data={formData} onChange={handleFieldChange} />
            )}

            {currentStep === 5 && <StepReview data={formData} />}

            {currentStep === 'success' && <StepSuccess data={formData} />}

            {currentStep !== 'success' && (
              <div className="nav-row" id="navRow">
                <button
                  type="button"
                  className="btn btn-ghost"
                  id="prevBtn"
                  onClick={handleBack}
                  style={{ visibility: currentStep === 1 ? 'hidden' : 'visible' }}
                  disabled={submitting}
                >
                  Back
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  id="nextBtn"
                  onClick={handleNext}
                  disabled={submitting}
                >
                  {submitting ? (
                    'Saving...'
                  ) : currentStep === totalSteps ? (
                    'Generate My Personalized Wellness Plan'
                  ) : (
                    'Continue'
                  )}
                </button>
              </div>
            )}
          </div>
        </form>

        <p className="footnote">
          🌿 Answers can be edited any time before you generate your plan · Nothing
          is shared without your consent
        </p>
      </div>
    </main>
  );
}
