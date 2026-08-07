export function getPredictionSignals(recent7DaysCount: number, shallowCount: number, strongestMagnitude: number, nearbyCount: number) {
  const score = Math.round(Math.min(100, Math.min(40, recent7DaysCount * 2) + Math.min(20, shallowCount * 4) + Math.min(25, strongestMagnitude * 4)));

  return {
    score,
    outlook: score >= 75 ? 'Elevated' : score >= 50 ? 'Above Normal' : score >= 25 ? 'Normal' : 'Low',
    confidence: nearbyCount >= 30 ? 'Medium' : nearbyCount >= 10 ? 'Low-Medium' : 'Low'
  };
}