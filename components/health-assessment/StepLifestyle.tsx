import React from 'react';
import { HealthAssessmentData } from './types';

interface StepLifestyleProps {
  data: HealthAssessmentData;
  errors: Record<string, boolean>;
  onChange: (key: keyof HealthAssessmentData, value: any) => void;
}

export default function StepLifestyle({ data, errors, onChange }: StepLifestyleProps) {
  const diets = ['Vegetarian', 'Eggetarian', 'Non-Vegetarian', 'Vegan'];

  return (
    <div className="step-panel active">
      <div className="section-title">Lifestyle</div>
      <p className="section-desc">Your daily rhythm shapes the plan more than anything else.</p>

      <div className="field">
        <label>Diet Preference</label>
        <div className="radio-grid">
          {diets.map((d) => {
            const isChecked = data.diet === d;
            return (
              <label
                key={d}
                className={`radio-item ${isChecked ? 'checked' : ''}`}
              >
                <input
                  type="radio"
                  name="diet"
                  value={d}
                  checked={isChecked}
                  onChange={() => onChange('diet', d)}
                />
                <span>{d}</span>
              </label>
            );
          })}
        </div>
      </div>

      <div className="field">
        <label htmlFor="allergies">Food Allergies</label>
        <textarea
          id="allergies"
          placeholder="e.g. peanuts, dairy, gluten (Write 'No' or 'None' if not applicable)"
          value={data.allergies}
          onChange={(e) => onChange('allergies', e.target.value)}
        />
        <div className="hint">Write 'No' or 'None' if not applicable.</div>
      </div>

      <div className="field">
        <label htmlFor="foodPrefs">Food Preferences / Restrictions</label>
        <textarea
          id="foodPrefs"
          placeholder="e.g. no onion-garlic, low oil, regional cuisine (Write 'No' or 'None' if not applicable)"
          value={data.foodPrefs}
          onChange={(e) => onChange('foodPrefs', e.target.value)}
        />
        <div className="hint">Write 'No' or 'None' if not applicable.</div>
      </div>

      <div className="row2">
        <div className="field">
          <label htmlFor="wakeTime">Wake-up Time</label>
          <input
            type="time"
            id="wakeTime"
            value={data.wakeTime}
            onChange={(e) => onChange('wakeTime', e.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="bedTime">Bedtime</label>
          <input
            type="time"
            id="bedTime"
            value={data.bedTime}
            onChange={(e) => onChange('bedTime', e.target.value)}
          />
        </div>
      </div>

      <div className="row2">
        <div className={`field ${errors.sleepHours ? 'invalid' : ''}`} id="f-sleep">
          <label htmlFor="sleepHours">Average Sleep Duration (hrs)</label>
          <input
            type="number"
            id="sleepHours"
            min="0"
            max="24"
            step="0.5"
            placeholder="e.g. 7"
            value={data.sleepHours}
            onChange={(e) => onChange('sleepHours', e.target.value)}
          />
          <div className="err">Enter hours between 0–24.</div>
        </div>
        <div className={`field ${errors.waterIntake ? 'invalid' : ''}`} id="f-water">
          <label htmlFor="waterIntake">Daily Water Intake (litres)</label>
          <input
            type="number"
            id="waterIntake"
            min="0"
            max="10"
            step="0.25"
            placeholder="e.g. 2.5"
            value={data.waterIntake}
            onChange={(e) => onChange('waterIntake', e.target.value)}
          />
          <div className="err">Enter a value between 0–10.</div>
        </div>
      </div>

      <div className="row2">
        <div className="field">
          <label htmlFor="activityLevel">Physical Activity Level</label>
          <select
            id="activityLevel"
            value={data.activityLevel}
            onChange={(e) => onChange('activityLevel', e.target.value)}
          >
            <option value="">Select…</option>
            <option value="Sedentary">Sedentary</option>
            <option value="Lightly Active">Lightly Active</option>
            <option value="Moderately Active">Moderately Active</option>
            <option value="Very Active">Very Active</option>
          </select>
        </div>
        <div className={`field ${errors.dailySteps ? 'invalid' : ''}`} id="f-steps">
          <label htmlFor="dailySteps">Average Daily Steps</label>
          <input
            type="number"
            id="dailySteps"
            min="0"
            max="50000"
            placeholder="e.g. 5000"
            value={data.dailySteps}
            onChange={(e) => onChange('dailySteps', e.target.value)}
          />
          <div className="err">Enter a valid step count.</div>
        </div>
      </div>

      <div className="field">
        <label htmlFor="exerciseRoutine">Exercise Routine</label>
        <textarea
          id="exerciseRoutine"
          placeholder="What does movement look like for you in a typical week? (Write 'No' or 'None' if not applicable)"
          value={data.exerciseRoutine}
          onChange={(e) => onChange('exerciseRoutine', e.target.value)}
        />
        <div className="hint">Write 'No' or 'None' if not applicable.</div>
      </div>

      <div className="field">
        <div className="slider-top">
          <label style={{ marginBottom: 0 }}>Stress Level</label>
          <span className="slider-value" id="stressVal">
            {data.stressLevel}
          </span>
        </div>
        <div className="slider-wrap">
          <input
            type="range"
            id="stressLevel"
            min="1"
            max="10"
            value={data.stressLevel}
            onChange={(e) => onChange('stressLevel', parseInt(e.target.value, 10))}
          />
          <div className="slider-scale">
            <span>1 · Calm</span>
            <span>10 · Overwhelmed</span>
          </div>
        </div>
      </div>
    </div>
  );
}
