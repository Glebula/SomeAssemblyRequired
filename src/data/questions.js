export const QUESTIONS = [
  {
    id: "q1", type: "engineering",
    question: "Which sensor would be most useful for detecting a person buried under snow?",
    options: ["Pressure Sensors", "Thermal Camera", "Basic Camera", "Chemical Detector"],
    correctIndex: 1,
    bitsReward: 10,
    explanation: "Thermal cameras detect body heat through snow and debris."
  },
  {
    id: "q2", type: "engineering",
    question: "What's the biggest risk of using a Nuclear Micro-Reactor in a hospital?",
    options: ["It's too expensive", "It's banned in sterile environments", "It's too slow", "It uses too much data"],
    correctIndex: 1,
    bitsReward: 10,
    explanation: "Nuclear reactors are banned in sterile environments due to contamination risk."
  },
  {
    id: "q3", type: "engineering",
    question: "Why might a robot with Heavy Lift Claws be a poor choice for surgery?",
    options: ["Too expensive", "Too heavy", "No precision for delicate tasks", "Can't hold surgical tools"],
    correctIndex: 2,
    bitsReward: 10,
    explanation: "Heavy Lift Claws have -3 Precision — far too clumsy for surgical work."
  },
  {
    id: "q4", type: "engineering",
    question: "What advantage does LIDAR have over a regular camera?",
    options: ["It's cheaper", "It works in any lighting condition", "It can see colors better", "It uses less power"],
    correctIndex: 1,
    bitsReward: 10,
    explanation: "LIDAR uses laser mapping, which works regardless of lighting conditions."
  },
  {
    id: "q5", type: "engineering",
    question: "Which frame type would you choose for an underwater mission without a Waterproofing Kit?",
    options: ["Light Scout Frame", "Heavy Tank Frame", "Standard Frame", "Amphibious Frame"],
    correctIndex: 3,
    bitsReward: 10,
    explanation: "The Amphibious Frame has built-in waterproofing."
  },
  {
    id: "q6", type: "logic",
    question: "Robot decision tree: IF fire_detected = true AND human_nearby = true, THEN ___?",
    options: ["Ignore the fire", "Alert the human and begin suppression", "Shut down", "Continue normal patrol"],
    correctIndex: 1,
    bitsReward: 10,
    explanation: "When both fire and humans are present, the robot should prioritize alerting people and responding to the fire."
  },
  {
    id: "q7", type: "logic",
    question: "A sorting robot runs: WHILE items_remain DO scan → classify → sort. What happens if the scanner breaks?",
    options: ["It keeps sorting randomly", "Infinite loop — it can't classify", "It stops automatically", "It skips to the next item"],
    correctIndex: 1,
    bitsReward: 10,
    explanation: "Without the scanner, the classify step can never complete, creating an infinite loop."
  },
  {
    id: "q8", type: "logic",
    question: "IF battery < 10% AND mission_critical = false, THEN the robot should ___?",
    options: ["Continue at full power", "Return to charging station", "Switch to turbo mode", "Send an error report and shut down"],
    correctIndex: 1,
    bitsReward: 10,
    explanation: "Low battery + non-critical mission = return to charge."
  },
  {
    id: "q9", type: "logic",
    question: "A delivery robot encounters a locked door. What's the best decision tree logic?",
    options: [
      "Force the door open",
      "Wait indefinitely",
      "Try handle → if locked, notify recipient → wait 2 min → reroute",
      "Abandon delivery"
    ],
    correctIndex: 2,
    bitsReward: 10,
    explanation: "The best approach tries the handle first, then escalates through notification and waiting before alternatives."
  },
  {
    id: "q10", type: "logic",
    question: "Two robots approach the same narrow hallway from opposite sides. Best protocol?",
    options: [
      "Both stop and wait",
      "The faster robot goes first",
      "One yields based on priority/ID, the other proceeds",
      "Both reverse direction"
    ],
    correctIndex: 2,
    bitsReward: 10,
    explanation: "A priority-based yielding protocol prevents deadlocks while ensuring one robot always proceeds."
  },
  {
    id: "q11", type: "ethical",
    question: "Your medical bot detects a patient is in pain but the patient says they're fine. Should the robot:",
    options: [
      "Alert the doctor immediately",
      "Respect the patient's words",
      "Ask gentle follow-up questions",
      "Log it and monitor for changes"
    ],
    bitsReward: 8,
    statBonuses: [
      { perception: 2 },
      { social: 2 },
      { communication: 2 },
      { adaptability: 2 }
    ],
    explanation: "All valid approaches — each prioritizes a different value."
  },
  {
    id: "q12", type: "ethical",
    question: "A rescue robot can save 3 people or 1 trapped child. It only has time for one. It should:",
    options: [
      "Save the larger group (utilitarian)",
      "Save the child (vulnerability priority)",
      "Radio for backup and attempt both",
      "Let human rescuers make the call"
    ],
    bitsReward: 8,
    statBonuses: [
      { adaptability: 2 },
      { social: 2 },
      { communication: 2 },
      { perception: 2 }
    ],
    explanation: "No wrong answer — this is a genuine ethical dilemma in robotics."
  },
  {
    id: "q13", type: "ethical",
    question: "A tutoring bot notices a student is being bullied through messages on their screen. Should it:",
    options: [
      "Report it to the teacher immediately",
      "Talk to the student privately first",
      "Ignore it — not the robot's job",
      "Offer the student resources and let them decide"
    ],
    bitsReward: 8,
    statBonuses: [
      { communication: 2 },
      { social: 2 },
      { adaptability: 1 },
      { social: 1, adaptability: 1 }
    ],
    explanation: "Balancing student safety, trust, and autonomy is a real challenge in educational AI."
  },
  {
    id: "q14", type: "ethical",
    question: "An elderly care robot's patient wants to eat food their doctor has restricted. The robot should:",
    options: [
      "Prevent them from eating it",
      "Remind them of the restriction but respect their choice",
      "Secretly alert the doctor",
      "Offer a healthier alternative"
    ],
    bitsReward: 8,
    statBonuses: [
      { durability: 2 },
      { social: 2 },
      { communication: 2 },
      { adaptability: 2 }
    ],
    explanation: "Autonomy vs. safety — a core tension in care robotics."
  },
  {
    id: "q15", type: "tradeoff",
    question: "You have 15 Bits. Thermal Camera (8 Bits, +3 Perception in smoke) or Heat Shield (12 Bits, heat immunity). Building is on fire. What's smarter?",
    options: [
      "Thermal Camera — finding people is the #1 priority",
      "Heat Shield — surviving the heat is more important",
      "Neither — save the Bits",
      "Both — you can afford the camera but not the shield"
    ],
    correctIndex: 0,
    bitsReward: 10,
    explanation: "In a fire, finding survivors is the primary mission. Perception is the critical stat."
  },
  {
    id: "q16", type: "tradeoff",
    question: "Waiter bot: Speed Boosters (+4 Mobility, -2 Precision) or Companion Personality Module (+4 Social)?",
    options: [
      "Speed Boosters — fast service wins",
      "Companion Personality — charm matters more than speed",
      "Neither — both tradeoffs are too steep",
      "Depends on the restaurant's vibe"
    ],
    correctIndex: 1,
    bitsReward: 10,
    explanation: "Waiter bots need high Social scores. The Companion Personality Module directly addresses the most critical stat."
  },
  {
    id: "q17", type: "tradeoff",
    question: "Adaptive Learning Module: +4 Adaptability, +3 Social, 10% glitch risk. For bomb disposal — worth it?",
    options: [
      "Yes — the Adaptability is critical for unexpected situations",
      "No — 10% glitch risk on a bomb disposal is unacceptable",
      "Only if you also have a Repair Kit",
      "Only if you can't afford the Decision Engine instead"
    ],
    correctIndex: 1,
    bitsReward: 10,
    explanation: "On a mission where one mistake could be catastrophic, a 10% malfunction chance is too risky."
  },
  {
    id: "q18", type: "tradeoff",
    question: "Over weight limit by 10. Remove Reinforced Armor (25 weight, +4 Durability) or Extended Battery (18 weight)?",
    options: [
      "Remove the armor — the battery keeps everything running",
      "Remove the battery — durability keeps you alive",
      "Depends on whether the mission is physically dangerous",
      "Remove whichever has the lower stat impact for THIS mission"
    ],
    correctIndex: 3,
    bitsReward: 10,
    explanation: "The best choice always depends on the specific mission requirements."
  },
  {
    id: "q19", type: "engineering",
    question: "What is 'uncanny valley' in robotics?",
    options: [
      "A famous robotics lab in Japan",
      "When a robot looks almost human but something feels 'off' and creepy",
      "The gap between AI and human intelligence",
      "A programming bug that causes robots to behave strangely"
    ],
    correctIndex: 1,
    bitsReward: 10,
    explanation: "The uncanny valley is the unsettling feeling people get from robots that look almost — but not quite — human."
  },
  {
    id: "q20", type: "logic",
    question: "Search-and-rescue robot has 20% battery left and found 2 of 3 missing people. Should it:",
    options: [
      "Keep searching for the third person",
      "Return to base to recharge, then resume search",
      "Mark its current location and radio coordinates for the third person's likely area",
      "Shut down to preserve battery for emergency use"
    ],
    correctIndex: 2,
    bitsReward: 10,
    explanation: "Maximizing impact with limited resources — sharing intel helps the rescue team continue even if the robot can't."
  }
];
