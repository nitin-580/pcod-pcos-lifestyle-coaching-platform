export type RiskLevel = 'Low' | 'Moderate' | 'High';

export function calculatePCODRisk(score: number): { level: RiskLevel; explanation: string } {
  if (score < 5) {
    return {
      level: 'Low',
      explanation: 'Your risk for PCOD symptoms appears low. Keep monitoring your cycle for any changes and maintain a healthy lifestyle.',
    };
  } else if (score < 10) {
    return {
      level: 'Moderate',
      explanation: 'You are showing some signs related to PCOD. Consider tracking your symptoms closely and consulting with our AI lifestyle coach for tailored advice.',
    };
  } else {
    return {
      level: 'High',
      explanation: 'Your symptoms suggest a higher risk for PCOD. We recommend speaking to a healthcare professional, while our coach can help support your daily lifestyle choices.',
    };
  }
}

export type HormoneProfile = 'Cortisol Dominant' | 'Insulin Sensitive' | 'Estrogen Imbalance';

export function determineHormoneProfile(answers: Record<string, string>): { profile: HormoneProfile; description: string } {
  // Simple heuristic based on common quiz answers
  const stressCount = (answers.stress === 'high' ? 1 : 0) + (answers.sleep === 'poor' ? 1 : 0);
  const metabolicCount = (answers.sugarCravings === 'frequent' ? 1 : 0) + (answers.exercise === 'low' ? 1 : 0);
  
  if (stressCount >= 2 || answers.stress === 'high') {
    return {
      profile: 'Cortisol Dominant',
      description: 'Your body may be prioritizing the stress response over reproductive health. Managing stress and improving sleep hygiene are key focuses.',
    };
  } else if (metabolicCount >= 2 || answers.sugarCravings === 'frequent') {
    return {
      profile: 'Insulin Sensitive',
      description: 'Your symptoms suggest your body could benefit from blood sugar balancing. Focus on balanced meals and regular, moderate activity.',
    };
  } else {
    return {
      profile: 'Estrogen Imbalance',
      description: 'You might be experiencing fluctuations in estrogen levels relative to progesterone. Cycle-syncing your lifestyle can be highly beneficial.',
    };
  }
}
