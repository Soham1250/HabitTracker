export const QUANT_SYLLABUS = [
  {
    phase: "Phase 1: The Core Engine",
    description: "The foundational math required to decode Data Interpretation and execute ratio-based arithmetic.",
    topics: [
      { id: "quant-1-1", title: "Percentages" },
      { id: "quant-1-2", title: "Ratio & Proportion" },
      { id: "quant-1-3", title: "Average" },
    ]
  },
  {
    phase: "Phase 2: Commercial Math",
    description: "Direct applications of Phase 1.",
    topics: [
      { id: "quant-2-1", title: "Profit, Loss & Discount" },
      { id: "quant-2-2", title: "Simple & Compound Interest" },
      { id: "quant-2-3", title: "Ages" },
      { id: "quant-2-4", title: "Partnership" },
    ]
  },
  {
    phase: "Phase 3: The Heavy Lifters",
    description: "Standalone word problems. High scoring if formulas/ratios are locked in.",
    topics: [
      { id: "quant-3-1", title: "Time & Work" },
      { id: "quant-3-2", title: "Pipes & Cisterns" },
      { id: "quant-3-3", title: "Time, Speed & Distance" },
      { id: "quant-3-4", title: "Boats & Streams" },
    ]
  },
  {
    phase: "Phase 4: The Outliers",
    description: "Low-weightage topics to complete last.",
    topics: [
      { id: "quant-4-1", title: "Permutation, Combination & Probability" },
      { id: "quant-4-2", title: "Mensuration (2D & 3D)" },
    ]
  }
];

export const REASONING_SEQUENTIAL = [
  {
    phase: "Phase 1: The Speed Breakers",
    description: "Mechanical execution. Aiming for 100% accuracy with zero heavy reading.",
    topics: [
      { id: "reas-seq-1-1", title: "Inequalities" },
      { id: "reas-seq-1-2", title: "Syllogisms" },
      { id: "reas-seq-1-3", title: "Alphanumeric Series" },
    ]
  },
  {
    phase: "Phase 2: Logic & Linkage",
    description: "Diagram-heavy topics. Accuracy over sheer speed.",
    topics: [
      { id: "reas-seq-2-1", title: "Blood Relations" },
      { id: "reas-seq-2-2", title: "Direction Sense" },
      { id: "reas-seq-2-3", title: "Order & Ranking" },
    ]
  },
  {
    phase: "Phase 3: The Coding Traps",
    description: "Topics requiring high focus and pattern matching.",
    topics: [
      { id: "reas-seq-3-1", title: "Coding-Decoding" },
      { id: "reas-seq-3-2", title: "Machine Input Output" },
    ]
  }
];

export const REASONING_CONTINUOUS = [
  { id: "reas-cont-1", title: "Floor & Box Based Stacking" },
  { id: "reas-cont-2", title: "Month, Date & Year Scheduling" },
  { id: "reas-cont-3", title: "Linear Seating Arrangement" },
  { id: "reas-cont-4", title: "Circular/Square Seating Arrangement" },
  { id: "reas-cont-5", title: "Designation/Hierarchy Sequencing" },
];

export function getTotalSequentialTopics() {
  const quantTotal = QUANT_SYLLABUS.reduce((acc, phase) => acc + phase.topics.length, 0);
  const reasTotal = REASONING_SEQUENTIAL.reduce((acc, phase) => acc + phase.topics.length, 0);
  return quantTotal + reasTotal;
}
