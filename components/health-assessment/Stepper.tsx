import React from 'react';

interface StepperProps {
  currentStep: number;
  totalSteps: number;
}

export default function Stepper({ currentStep, totalSteps }: StepperProps) {
  const percentage = ((currentStep - 1) / (totalSteps - 1)) * 100;

  const stages = [
    {
      i: 1,
      label: 'Basics',
      icon: (
        <svg viewBox="0 0 20 20">
          <circle cx="10" cy="10" r="3.4" />
        </svg>
      ),
    },
    {
      i: 2,
      label: 'Medical',
      icon: (
        <svg viewBox="0 0 20 20">
          <path d="M10 17V7M10 7C10 7 6 8 6 4M10 7c0 0 4 1 4-3" />
        </svg>
      ),
    },
    {
      i: 3,
      label: 'Lifestyle',
      icon: (
        <svg viewBox="0 0 20 20">
          <path d="M4 10c4-7 12-7 12 0-4 7-12 7-12 0z" />
        </svg>
      ),
    },
    {
      i: 4,
      label: 'Goals',
      icon: (
        <svg viewBox="0 0 20 20">
          <path d="M10 3c2 2 2 5 0 7-2-2-2-5 0-7zM10 10c3 0 5 2.5 5 5-3 0-5-2.5-5-5zM10 10c-3 0-5 2.5-5 5 3 0 5-2.5 5-5z" />
        </svg>
      ),
    },
    {
      i: 5,
      label: 'Review',
      icon: (
        <svg viewBox="0 0 20 20">
          <path d="M4 6l2 2 4-5M4 13l2 2 4-5" />
        </svg>
      ),
    },
  ];

  return (
    <div className="stepper" id="stepper">
      <div
        className="stepper-fill"
        id="stepperFill"
        style={{ width: `${percentage}%` }}
      />
      {stages.map((stage) => {
        let statusClass = '';
        if (stage.i < currentStep) {
          statusClass = 'done';
        } else if (stage.i === currentStep) {
          statusClass = 'active';
        }

        return (
          <div key={stage.i} className={`stage ${statusClass}`} data-i={stage.i}>
            <div className="dot">{stage.icon}</div>
            <div className="label">{stage.label}</div>
          </div>
        );
      })}
    </div>
  );
}
