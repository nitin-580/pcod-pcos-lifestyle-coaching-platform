import React from 'react';
import { HealthAssessmentData } from './types';

interface StepReviewProps {
  data: HealthAssessmentData;
}

export default function StepReview({ data }: StepReviewProps) {
  const row = (k: string, v: string | number) => (
    <>
      <div className="k">{k}</div>
      <div className="v">{v || '—'}</div>
    </>
  );

  return (
    <div className="step-panel active">
      <div className="section-title">Review Your Answers</div>
      <p className="section-desc">Take a quick look before you generate your plan.</p>

      <div id="reviewContent">
        <div className="review-block">
          <h3>Basic Information</h3>
          <div className="review-grid">
            {row('Name', data.name)}
            {row('Age', data.age)}
            {row('Height', data.height ? `${data.height} cm` : '')}
            {row('Weight', data.weight ? `${data.weight} kg` : '')}
            {row('City', data.city)}
            {row('Occupation', data.occupation)}
            {row('Work Schedule', data.workschedule)}
          </div>
        </div>
        <hr className="rline" />

        <div className="review-block">
          <h3>Medical History</h3>
          <div className="review-grid">
            {row('PCOS/PCOD', data.pcos)}
            {row('Cycle Pattern', data.cyclePattern.join(', '))}
            {row('Thyroid', data.thyroid)}
            {row('Diabetes', data.diabetes)}
            {row('Hypertension', data.htn)}
            {row('Fatty Liver', data.fattyliver)}
            <div className="k review-full">Medications</div>
            <div className="v review-full">{data.medications || '—'}</div>
            <div className="k review-full">Vitamin Deficiencies</div>
            <div className="v review-full">
              {data.vitamins.length > 0 ? data.vitamins.join(', ') : '—'}
            </div>
            <div className="k review-full">Other Conditions</div>
            <div className="v review-full">{data.otherConditions || '—'}</div>
          </div>
        </div>
        <hr className="rline" />

        <div className="review-block">
          <h3>Lifestyle</h3>
          <div className="review-grid">
            {row('Diet', data.diet)}
            {row('Wake-up', data.wakeTime)}
            {row('Bedtime', data.bedTime)}
            {row('Sleep (hrs)', data.sleepHours)}
            {row('Water (L)', data.waterIntake)}
            {row('Activity Level', data.activityLevel)}
            {row('Daily Steps', data.dailySteps)}
            {row('Stress Level', `${data.stressLevel}/10`)}
            <div className="k review-full">Allergies</div>
            <div className="v review-full">{data.allergies || '—'}</div>
            <div className="k review-full">Food Preferences</div>
            <div className="v review-full">{data.foodPrefs || '—'}</div>
            <div className="k review-full">Exercise Routine</div>
            <div className="v review-full">{data.exerciseRoutine || '—'}</div>
          </div>
        </div>
        <hr className="rline" />

        <div className="review-block">
          <h3>Health Goals</h3>
          <div className="review-grid">
            <div className="k review-full">Selected Goals</div>
            <div className="v review-full">
              {data.goals.length > 0 ? data.goals.join(', ') : '—'}
            </div>
          </div>
        </div>
      </div>

      <div className="privacy">
        <svg viewBox="0 0 20 20">
          <path d="M10 2l6 3v5c0 4.5-2.7 7.2-6 8-3.3-.8-6-3.5-6-8V5l6-3z" />
        </svg>
        <div>
          Your information is used only to personalize your health and nutrition
          recommendations, and is kept confidential. It is not shared with any
          third party.
        </div>
      </div>
    </div>
  );
}
