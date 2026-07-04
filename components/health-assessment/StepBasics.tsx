import React from 'react';
import { HealthAssessmentData } from './types';

interface StepBasicsProps {
  data: HealthAssessmentData;
  errors: Record<string, boolean>;
  onChange: (key: keyof HealthAssessmentData, value: any) => void;
}

export default function StepBasics({ data, errors, onChange }: StepBasicsProps) {
  return (
    <div className="step-panel active">
      <div className="section-title">Basic Information</div>
      <p className="section-desc">Let's start with the essentials.</p>

      <div className={`field ${errors.name ? 'invalid' : ''}`} id="f-name">
        <label htmlFor="name">
          Full Name <span className="req">*</span>
        </label>
        <input
          type="text"
          id="name"
          placeholder="e.g. Ananya Sharma"
          value={data.name}
          onChange={(e) => onChange('name', e.target.value)}
          required
        />
        <div className="err">Please enter your full name.</div>
      </div>

      <div className="row2">
        <div className={`field ${errors.age ? 'invalid' : ''}`} id="f-age">
          <label htmlFor="age">
            Age <span className="req">*</span>
          </label>
          <input
            type="number"
            id="age"
            min="10"
            max="80"
            placeholder="Years"
            value={data.age}
            onChange={(e) => onChange('age', e.target.value)}
            required
          />
          <div className="err">Enter a valid age (10–80).</div>
        </div>
        <div className="field" id="f-city">
          <label htmlFor="city">City</label>
          <input
            type="text"
            id="city"
            placeholder="e.g. Prayagraj"
            value={data.city}
            onChange={(e) => onChange('city', e.target.value)}
          />
        </div>
      </div>

      <div className="row2">
        <div className={`field ${errors.height ? 'invalid' : ''}`} id="f-height">
          <label htmlFor="height">
            Height (cm) <span className="req">*</span>
          </label>
          <input
            type="number"
            id="height"
            min="100"
            max="220"
            placeholder="e.g. 160"
            value={data.height}
            onChange={(e) => onChange('height', e.target.value)}
            required
          />
          <div className="err">Enter a valid height in cm.</div>
        </div>
        <div className={`field ${errors.weight ? 'invalid' : ''}`} id="f-weight">
          <label htmlFor="weight">
            Weight (kg) <span className="req">*</span>
          </label>
          <input
            type="number"
            id="weight"
            min="30"
            max="200"
            placeholder="e.g. 60"
            value={data.weight}
            onChange={(e) => onChange('weight', e.target.value)}
            required
          />
          <div className="err">Enter a valid weight in kg.</div>
        </div>
      </div>

      <div className="row2">
        <div className="field" id="f-occupation">
          <label htmlFor="occupation">Occupation</label>
          <input
            type="text"
            id="occupation"
            placeholder="e.g. Software Engineer"
            value={data.occupation}
            onChange={(e) => onChange('occupation', e.target.value)}
          />
        </div>
        <div className="field" id="f-workschedule">
          <label htmlFor="workschedule">Work Schedule</label>
          <select
            id="workschedule"
            value={data.workschedule}
            onChange={(e) => onChange('workschedule', e.target.value)}
          >
            <option value="">Select…</option>
            <option value="Student">Student</option>
            <option value="Homemaker">Homemaker</option>
            <option value="9–5 Job">9–5 Job</option>
            <option value="Night Shift">Night Shift</option>
            <option value="Rotational Shift">Rotational Shift</option>
            <option value="Freelancer">Freelancer</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>
    </div>
  );
}
