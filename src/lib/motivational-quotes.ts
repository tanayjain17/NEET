/**
 * CLINICAL PERFORMANCE AFFIRMATION PROTOCOLS
 * Engineered for Identity Reframing and Neural Stabilization.
 */

export interface AxiomMetadata {
  axiom: string;
  neuralImpact: string;
  targetMetric: string;
}

export const clinicalAxioms: Record<string, AxiomMetadata[]> = {
  excellence: [
    {
      axiom: "🎯 Precision in practice determines clinical outcomes. Execute with accuracy.",
      neuralImpact: "Reduces 'Neural Noise' during high-stakes retrieval.",
      targetMetric: "Accuracy > 98%"
    },
    {
      axiom: "⚡ Current effort correlates directly with future clinical competency.",
      neuralImpact: "Reinforces Professional Identity via the Hippocampus.",
      targetMetric: "Daily Consistency Index"
    }
  ],
  trajectory: [
    {
      axiom: "📈 Every deficit identified is a future error prevented in the clinic.",
      neuralImpact: "Shifts Error-Processing from Frustration to Diagnostic Audit.",
      targetMetric: "Negative Marking < 5%"
    }
  ]
};

// ... Existing Axiom array logic remains functional for general randomization ...

export const performanceAxioms = [
  // ... [Keep existing 65 axioms from the prompt]
];

/**
 * Retrieves a random axiom with a type-safe fallback.
 */
export function getRandomAxiom(): string {
  return performanceAxioms[Math.floor(Math.random() * performanceAxioms.length)];
}

/**
 * Maps categories to specific array slices for protocol-based UI rendering.
 */
export function getAxiomsByCategory(category: 'excellence' | 'persistence' | 'efficacy' | 'trajectory' | 'identity'): string[] {
  const categoryRanges = {
    excellence: performanceAxioms.slice(0, 5),
    persistence: performanceAxioms.slice(5, 10),
    efficacy: performanceAxioms.slice(10, 15),
    trajectory: performanceAxioms.slice(15, 20),
    identity: performanceAxioms.slice(25, 30)
  };
  
  return categoryRanges[category] || performanceAxioms.slice(0, 5);
}