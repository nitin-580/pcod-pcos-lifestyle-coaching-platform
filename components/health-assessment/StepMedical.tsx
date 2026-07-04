import React from 'react';
import { HealthAssessmentData } from './types';

interface StepMedicalProps {
  data: HealthAssessmentData;
  errors: Record<string, boolean>;
  onChange: (key: keyof HealthAssessmentData, value: any) => void;
}

export default function StepMedical({ data, errors, onChange }: StepMedicalProps) {
  const toggleVitamin = (value: string) => {
    const list = [...data.vitamins];
    const index = list.indexOf(value);
    if (index > -1) {
      list.splice(index, 1);
    } else {
      list.push(value);
    }
    onChange('vitamins', list);
  };

  const toggleCyclePattern = (value: string) => {
    const list = [...data.cyclePattern];
    const index = list.indexOf(value);
    if (index > -1) {
      list.splice(index, 1);
    } else {
      list.push(value);
    }
    onChange('cyclePattern', list);
  };

  const cycleOptions = [
    'Regular',
    'Irregular',
    'Missed Periods',
    'Heavy Flow',
    'Light Flow',
    'Painful Periods',
    'Other',
  ];

  const vitaminOptions = [
    'Vitamin D',
    'Vitamin B12',
    'Iron',
    'Calcium',
    'Folate',
    "Don't Know",
    'Other',
  ];

  return (
    <div className="step-panel active">
      <div className="section-title">Medical History</div>
      <p className="section-desc">This helps us flag anything we should design around carefully.</p>

      <div className={`field ${errors.pcos ? 'invalid' : ''}`}>
        <label>
          Diagnosed with PCOS/PCOD? <span className="req">*</span>
        </label>
        <div className="toggle-group">
          <label className={`opt ${data.pcos === 'Yes' ? 'checked' : ''}`}>
            <input
              type="radio"
              name="pcos"
              value="Yes"
              checked={data.pcos === 'Yes'}
              onChange={() => onChange('pcos', 'Yes')}
            />
            <span>Yes</span>
          </label>
          <label className={`opt ${data.pcos === 'No' ? 'checked' : ''}`}>
            <input
              type="radio"
              name="pcos"
              value="No"
              checked={data.pcos === 'No'}
              onChange={() => onChange('pcos', 'No')}
            />
            <span>No</span>
          </label>
        </div>
        <div className="err">Please select Yes or No.</div>
      </div>

      <div className={`field ${errors.cyclePattern ? 'invalid' : ''}`}>
        <label>
          Menstrual Cycle Pattern <span className="req">*</span>
        </label>
        <div className="check-grid">
          {cycleOptions.map((pattern) => {
            const isChecked = data.cyclePattern.includes(pattern);
            return (
              <label
                key={pattern}
                className={`check-item ${isChecked ? 'checked' : ''}`}
              >
                <input
                  type="checkbox"
                  name="cyclePattern"
                  value={pattern}
                  checked={isChecked}
                  onChange={() => toggleCyclePattern(pattern)}
                />
                <span>{pattern}</span>
              </label>
            );
          })}
        </div>
        <div className="err">Please select at least one cycle pattern.</div>
      </div>

      <div className="field">
        <label htmlFor="medications">Current Medications</label>
        <textarea
          id="medications"
          placeholder="List any medications you're currently taking (Write 'No' or 'None' if not applicable)"
          value={data.medications}
          onChange={(e) => onChange('medications', e.target.value)}
        />
        <div className="hint">Write 'No' or 'None' if not applicable.</div>
      </div>

      <div className="row2">
        <div className="field">
          <label htmlFor="thyroid">Thyroid Disorder</label>
          <select
            id="thyroid"
            value={data.thyroid}
            onChange={(e) => onChange('thyroid', e.target.value)}
          >
            <option value="">Select…</option>
            <option value="None">None</option>
            <option value="Hypothyroidism">Hypothyroidism</option>
            <option value="Hyperthyroidism">Hyperthyroidism</option>
            <option value="Don't Know">Don't Know</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="diabetes">Diabetes / Prediabetes</label>
          <select
            id="diabetes"
            value={data.diabetes}
            onChange={(e) => onChange('diabetes', e.target.value)}
          >
            <option value="">Select…</option>
            <option value="No">No</option>
            <option value="Prediabetes">Prediabetes</option>
            <option value="Type 1 Diabetes">Type 1 Diabetes</option>
            <option value="Type 2 Diabetes">Type 2 Diabetes</option>
          </select>
        </div>
      </div>

      <div className="field">
        <label>Hypertension</label>
        <div className="toggle-group">
          <label className={`opt ${data.htn === 'Yes' ? 'checked' : ''}`}>
            <input
              type="radio"
              name="htn"
              value="Yes"
              checked={data.htn === 'Yes'}
              onChange={() => onChange('htn', 'Yes')}
            />
            <span>Yes</span>
          </label>
          <label className={`opt ${data.htn === 'No' ? 'checked' : ''}`}>
            <input
              type="radio"
              name="htn"
              value="No"
              checked={data.htn === 'No'}
              onChange={() => onChange('htn', 'No')}
            />
            <span>No</span>
          </label>
        </div>
      </div>

      <div className="field">
        <label>Fatty Liver</label>
        <div className="toggle-group">
          <label className={`opt ${data.fattyliver === 'Yes' ? 'checked' : ''}`}>
            <input
              type="radio"
              name="fattyliver"
              value="Yes"
              checked={data.fattyliver === 'Yes'}
              onChange={() => onChange('fattyliver', 'Yes')}
            />
            <span>Yes</span>
          </label>
          <label className={`opt ${data.fattyliver === 'No' ? 'checked' : ''}`}>
            <input
              type="radio"
              name="fattyliver"
              value="No"
              checked={data.fattyliver === 'No'}
              onChange={() => onChange('fattyliver', 'No')}
            />
            <span>No</span>
          </label>
          <label className={`opt ${data.fattyliver === "Don't Know" ? 'checked' : ''}`}>
            <input
              type="radio"
              name="fattyliver"
              value="Don't Know"
              checked={data.fattyliver === "Don't Know"}
              onChange={() => onChange('fattyliver', "Don't Know")}
            />
            <span>Don't Know</span>
          </label>
        </div>
      </div>

      <div className="field">
        <label>Vitamin Deficiencies</label>
        <div className="check-grid">
          {vitaminOptions.map((vit) => {
            const isChecked = data.vitamins.includes(vit);
            return (
              <label
                key={vit}
                className={`check-item ${isChecked ? 'checked' : ''}`}
              >
                <input
                  type="checkbox"
                  name="vitamins"
                  value={vit}
                  checked={isChecked}
                  onChange={() => toggleVitamin(vit)}
                />
                <span>{vit}</span>
              </label>
            );
          })}
        </div>
      </div>

      <div className="field">
        <label htmlFor="otherConditions">Other Medical Conditions</label>
        <textarea
          id="otherConditions"
          placeholder="Anything else we should know (Write 'No' or 'None' if not applicable)"
          value={data.otherConditions}
          onChange={(e) => onChange('otherConditions', e.target.value)}
        />
        <div className="hint">Write 'No' or 'None' if not applicable.</div>
      </div>
    </div>
  );
}
