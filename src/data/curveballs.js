export const CURVEBALLS = [
  {
    id: "budget-cut",
    name: "Budget Cut!",
    icon: "💸",
    description: "Corporate just slashed your funding. You lose 15 Bits worth of parts.",
    options: [
      { text: "Remove a part to free up Bits", action: "removePart" },
      { text: "Keep everything, take the hit", action: "scorePenalty", penalty: -10 }
    ]
  },
  {
    id: "power-surge",
    name: "Power Surge!",
    icon: "⚡",
    description: "A power spike has fried one of your electrical components! One random powered part is disabled.",
    options: [
      { text: "Swap it for a cheaper alternative", action: "swapPart" },
      { text: "Go without it", action: "removePart" }
    ]
  },
  {
    id: "client-change",
    name: "Client Change!",
    icon: "📋",
    description: "The client just called — the job now ALSO requires strong Communication skills. Adapt your build!",
    options: [
      { text: "Add a Communication part (if you have Bits)", action: "openWorkbench" },
      { text: "Ignore the change (Communication requirement +2)", action: "requirementIncrease", stat: "communication", amount: 2 }
    ]
  },
  {
    id: "bonus-part",
    name: "Bonus Part!",
    icon: "🎁",
    description: "A donor just funded an extra component! Add one part for FREE — but it must be from a category you haven't used yet.",
    options: [
      { text: "Choose a free part", action: "freePart" }
    ]
  },
  {
    id: "weight-limit",
    name: "Weight Restriction!",
    icon: "⚖️",
    description: "New safety regulations just dropped. Your robot's maximum weight limit has been reduced by 20%.",
    options: [
      { text: "Remove heavy parts to comply", action: "openWorkbench" },
      { text: "Exceed the limit (-2 Mobility penalty)", action: "statPenalty", stat: "mobility", amount: -2 }
    ]
  },
  {
    id: "environmental-shift",
    name: "Environmental Shift!",
    icon: "🌪️",
    description: "Weather report just came in — conditions are changing! A new environment modifier has been added to your mission.",
    options: [
      { text: "Adapt your build", action: "openWorkbench" },
      { text: "Push through anyway", action: "acceptNewEnvironment" }
    ]
  },
  {
    id: "part-recall",
    name: "Part Recall!",
    icon: "🚨",
    description: "Breaking news: one of your parts has been recalled for safety defects! It must be removed immediately.",
    options: [
      { text: "Remove it and find a replacement", action: "forceRemoveAndReplace" },
      { text: "Remove it and go without", action: "forceRemove" }
    ]
  },
  {
    id: "lucky-break",
    name: "Lucky Break!",
    icon: "🍀",
    description: "A robotics company just sponsored your project! You've received 15 bonus Bits.",
    options: [
      { text: "Spend them now on upgrades!", action: "addBits", amount: 15 }
    ]
  }
];
