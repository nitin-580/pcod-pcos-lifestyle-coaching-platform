import React from 'react';
import { HealthAssessmentData } from './types';

interface StepGoalsProps {
  data: HealthAssessmentData;
  onChange: (key: keyof HealthAssessmentData, value: any) => void;
}

export default function StepGoals({ data, onChange }: StepGoalsProps) {
  const availableGoals = [
    'Weight Loss',
    'Weight Gain',
    'Hormonal Balance',
    'Fertility Support',
    'Better Skin',
    'Acne Reduction',
    'Hair Fall Reduction',
    'Improved Energy Levels',
  ];

  const toggleGoal = (goal: string) => {
    const list = [...data.goals];
    const index = list.indexOf(goal);
    if (index > -1) {
      list.splice(index, 1);
    } else {
      list.push(goal);
    }
    onChange('goals', list);
  };

  return (
    <div className="step-panel active">
      <div className="section-title">Health Goals</div>
      <p className="section-desc">Select everything that applies — this drives what we prioritize first.</p>

      <div className="check-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
        {availableGoals.map((goal) => {
          const isChecked = data.goals.includes(goal);
          return (
            <label
              key={goal}
              className={`check-item ${isChecked ? 'checked' : ''}`}
            >
              <input
                type="checkbox"
                name="goals"
                value={goal}
                checked={isChecked}
                onChange={() => toggleGoal(goal)}
              />
              <span>{goal}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
