export const COMBOS = [
  {
    name: "Surgeon Suite",
    parts: [6, 32],
    bonus: { precision: 3 },
    description: "+3 Precision bonus on medical missions",
    applicableTo: ["medical", "physical", "social-interaction"]
  },
  {
    name: "Empathy Engine",
    parts: [17, 23],
    bonus: { social: 3 },
    description: "+3 Social bonus on social missions",
    applicableTo: ["social-interaction", "social-daily"]
  },
  {
    name: "All-Seeing",
    parts: [11, 12],
    bonus: { perception: 2 },
    description: "+2 Perception in any condition (overrides visibility penalties)",
    applicableTo: "all"
  },
  {
    name: "Extraction Kit",
    parts: [7, 33],
    bonus: { strength: 3 },
    description: "+3 Strength bonus on rescue missions",
    applicableTo: ["environmental"]
  }
];
