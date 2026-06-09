/**
 * Calculates the visual influence for morph targets based on progress.
 * @param {number} currentWeight 
 * @param {number} startWeight 
 * @param {number} goalWeight 
 * @param {number} k - Power factor (default 1.5)
 * @returns {number} Influence (0.0 to 1.0)
 */
export function calculateVisualInfluence(currentWeight: number, startWeight: number, goalWeight: number, k: number = 1.5): number {
  const progress = (startWeight - currentWeight) / (startWeight - goalWeight);
  const clampedProgress = Math.max(0, Math.min(1, progress));
  return Math.pow(clampedProgress, k);
}

/**
 * Determines frame size based on height and wrist.
 */
export function getFrameSize(heightCm: number, wristCm: number, gender: 'male' | 'female'): 'SMALL' | 'MEDIUM' | 'LARGE' {
  const r = heightCm / wristCm;
  if (gender === 'male') {
    if (r > 10.4) return 'SMALL';
    if (r >= 9.6) return 'MEDIUM';
    return 'LARGE';
  } else {
    if (r > 11.0) return 'SMALL';
    if (r >= 10.1) return 'MEDIUM';
    return 'LARGE';
  }
}

/**
 * Calculates the "Ideal Soft Cap" weight in kg.
 */
export function calculateSoftCap(heightCm: number, wristCm: number, gender: 'male' | 'female'): number {
  const heightInches = heightCm / 2.54;
  const inchesOver5Feet = Math.max(0, heightInches - 60);
  
  let ibw = (gender === 'male') 
    ? 56.2 + (1.41 * inchesOver5Feet)
    : 53.1 + (1.36 * inchesOver5Feet);
    
  const frame = getFrameSize(heightCm, wristCm, gender);
  if (frame === 'SMALL') ibw *= 0.9;
  if (frame === 'LARGE') ibw *= 1.1;
  
  return ibw;
}

/**
 * Converts kg to lbs.
 */
export function kgToLbs(kg: number): number {
  return kg * 2.20462;
}

/**
 * Converts lbs to kg.
 */
export function lbsToKg(lbs: number): number {
  return lbs / 2.20462;
}
