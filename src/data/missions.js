export const MISSIONS = {
  "MSN-1001": {
    title: "Customer Service Bot",
    category: "social-interaction",
    tier: "standard",
    environment: "crowded-public",
    description: "A busy electronics store during holiday season. Customers are frustrated, lines are long, and the staff is overwhelmed. Your robot needs to greet customers, answer product questions, handle complaints calmly, and direct people to the right department — all while surrounded by noise and chaos.",
    objectives: [
      "How will your robot understand what a frustrated customer actually needs?",
      "What happens when two customers need help at the same time?",
      "How does your robot stay calm when a customer is yelling?"
    ],
    requirements: { precision: 1, strength: 1, perception: 3, mobility: 2, durability: 1, adaptability: 4, communication: 5, social: 5 }
  },
  "MSN-1002": {
    title: "Medical Assistant (Nurse Bot)",
    category: "social-interaction",
    tier: "advanced",
    environment: "sterile",
    description: "A hospital ward during a night shift. Your robot assists nurses by monitoring patient vitals, administering routine medication, comforting anxious patients, and alerting doctors when something is wrong. The environment is sterile — no dirty, heavy, or fuel-powered parts allowed.",
    objectives: [
      "How does your robot read a patient's vitals AND notice if they're emotionally distressed?",
      "What should it do if a patient refuses medication?",
      "How does it communicate urgency to a doctor without alarming the patient?"
    ],
    requirements: { precision: 3, strength: 1, perception: 4, mobility: 2, durability: 1, adaptability: 3, communication: 4, social: 4 }
  },
  "MSN-1003": {
    title: "Waiter/Waitress Bot",
    category: "social-interaction",
    tier: "standard",
    environment: "crowded-public",
    description: "A packed downtown restaurant on a Friday night. Your robot takes orders, carries trays of food through tight spaces, handles special dietary requests, and deals with the occasional difficult table. Speed and charm are everything.",
    objectives: [
      "How does your robot navigate a crowded dining room without spilling anything?",
      "What if a customer has an allergy that wasn't on the menu?",
      "How does it handle a table that's unhappy with their food?"
    ],
    requirements: { precision: 2, strength: 2, perception: 3, mobility: 4, durability: 2, adaptability: 4, communication: 4, social: 5 }
  },
  "MSN-1004": {
    title: "Therapy Companion Bot",
    category: "social-interaction",
    tier: "advanced",
    environment: "remote-no-signal",
    description: "A rural mental health clinic with no reliable internet or cell service. Your robot provides companionship and guided therapeutic exercises to patients between sessions with their human therapist. It must work completely offline and be deeply attuned to human emotions.",
    objectives: [
      "How does your robot detect when someone is sad, anxious, or shutting down?",
      "Without internet, how does it adapt its approach to different patients?",
      "How do you make a robot feel safe and trustworthy to a vulnerable person?"
    ],
    requirements: { precision: 1, strength: 1, perception: 4, mobility: 1, durability: 2, adaptability: 5, communication: 5, social: 5 }
  },
  "MSN-1005": {
    title: "Hotel Concierge Bot",
    category: "social-interaction",
    tier: "standard",
    environment: "crowded-public",
    description: "A luxury hotel lobby bustling with international guests. Your robot greets arrivals, gives directions, makes restaurant reservations, handles luggage logistics, and resolves complaints — all while representing the hotel's five-star reputation. Guests speak many languages.",
    objectives: [
      "How does your robot handle guests who speak different languages?",
      "What if a VIP guest has a complaint that your robot can't solve alone?",
      "How does it balance helping one guest while others are waiting?"
    ],
    requirements: { precision: 1, strength: 2, perception: 3, mobility: 3, durability: 1, adaptability: 4, communication: 5, social: 5 }
  },
  "MSN-1006": {
    title: "Personal Assistant Bot",
    category: "social-daily",
    tier: "standard",
    environment: "normal",
    description: "You're building a robot for a busy working parent. It manages their calendar, reminds them of tasks, helps organize the home, answers the door, and learns the family's routines over time. It needs to feel helpful, not intrusive.",
    objectives: [
      "How does your robot learn the owner's daily habits and preferences?",
      "What if the owner's schedule changes suddenly — can it adapt?",
      "How does it interact with kids vs. adults in the household?"
    ],
    requirements: { precision: 2, strength: 1, perception: 3, mobility: 3, durability: 1, adaptability: 5, communication: 4, social: 4 }
  },
  "MSN-1007": {
    title: "Elderly Care Bot",
    category: "social-daily",
    tier: "advanced",
    environment: "normal",
    description: "An 82-year-old woman lives alone. Your robot helps her with daily tasks — cooking reminders, medication schedules, fall detection, and light physical assistance. Most importantly, it provides companionship. She's sharp but physically frail, and she doesn't trust technology easily.",
    objectives: [
      "How does your robot earn the trust of someone who's skeptical of technology?",
      "What should it do if it detects the person has fallen?",
      "How does it balance helping with daily tasks without making the person feel dependent?"
    ],
    requirements: { precision: 2, strength: 2, perception: 4, mobility: 3, durability: 2, adaptability: 4, communication: 4, social: 5 }
  },
  "MSN-1008": {
    title: "Tutoring Bot",
    category: "social-daily",
    tier: "standard",
    environment: "normal",
    description: "A middle school classroom where students have wildly different learning levels. Your robot works one-on-one with students, explaining math and science concepts, adjusting its teaching style to each kid, and keeping them engaged. Some students are advanced, some are struggling, and some just don't want to be there.",
    objectives: [
      "How does your robot figure out a student's learning style?",
      "What if a student is frustrated and wants to give up?",
      "How does it make learning feel fun rather than like a chore?"
    ],
    requirements: { precision: 1, strength: 1, perception: 3, mobility: 1, durability: 1, adaptability: 5, communication: 5, social: 4 }
  },
  "MSN-1009": {
    title: "Firefighter Bot",
    category: "environmental",
    tier: "extreme",
    environment: "extreme-heat-low-visibility",
    description: "A five-story apartment building is on fire. Smoke is blinding, floors are collapsing, and there are reports of people trapped on the third floor. Your robot must enter the building, locate survivors, clear a path, and get them out — all while enduring temperatures that would destroy most electronics.",
    objectives: [
      "How will your robot see through thick smoke to find survivors?",
      "What if the floor collapses — can your robot survive the fall and keep going?",
      "How does it communicate the location of trapped people back to the fire crew outside?"
    ],
    requirements: { precision: 1, strength: 4, perception: 5, mobility: 4, durability: 5, adaptability: 3, communication: 3, social: 1 }
  },
  "MSN-1010": {
    title: "Disaster Relief Bot (Hurricane)",
    category: "environmental",
    tier: "advanced",
    environment: "unstable-terrain",
    description: "A coastal town has been devastated by a Category 4 hurricane. Roads are flooded, buildings have collapsed, and emergency services can't reach the hardest-hit neighborhoods. Your robot must navigate debris fields, deliver emergency supplies, and locate survivors under rubble.",
    objectives: [
      "How does your robot move through flooded streets and piles of debris?",
      "What if it finds a survivor who is injured and can't move?",
      "How does it prioritize which areas to search first?"
    ],
    requirements: { precision: 1, strength: 4, perception: 4, mobility: 4, durability: 5, adaptability: 4, communication: 2, social: 1 }
  },
  "MSN-1011": {
    title: "Avalanche Search & Rescue Bot",
    category: "environmental",
    tier: "extreme",
    environment: "extreme-cold-low-visibility",
    description: "A massive avalanche has buried a ski resort access road. At least six people are unaccounted for, buried under meters of snow and ice. Temperatures are -20°F, visibility is near zero, and aftershock avalanches are possible. Your robot must detect body heat through deep snow, dig efficiently, and work fast before hypothermia sets in.",
    objectives: [
      "How will your robot detect a person buried under several meters of snow?",
      "What if conditions worsen and a second avalanche is imminent — does your robot retreat or keep digging?",
      "How does it communicate findings back to the rescue base when there's no cell signal?"
    ],
    requirements: { precision: 1, strength: 3, perception: 5, mobility: 4, durability: 4, adaptability: 3, communication: 2, social: 1 }
  },
  "MSN-1012": {
    title: "Ocean Cleanup Bot",
    category: "environmental",
    tier: "advanced",
    environment: "underwater",
    description: "The Great Pacific Garbage Patch. Your robot operates beneath the ocean surface, collecting plastic waste, sorting recyclable materials, and avoiding marine wildlife. Currents are unpredictable, visibility shifts constantly, and the robot must work for extended periods without surfacing.",
    objectives: [
      "How does your robot tell the difference between trash and marine life?",
      "What if strong ocean currents push your robot off course?",
      "How does it handle running low on power when it's deep underwater?"
    ],
    requirements: { precision: 2, strength: 3, perception: 4, mobility: 4, durability: 4, adaptability: 4, communication: 1, social: 1 }
  },
  "MSN-1013": {
    title: "Wildfire Detection Bot",
    category: "environmental",
    tier: "advanced",
    environment: "extreme-heat-remote",
    description: "Thousands of acres of national forest, bone-dry and high risk for wildfire. Your robot patrols remote areas with no cell towers or internet, scanning for early signs of fire — rising temperatures, smoke traces, dry lightning strikes. If it detects a fire, it must respond autonomously since it can't call for help.",
    objectives: [
      "How does your robot detect a fire before it's visible to the human eye?",
      "With no signal, how does it decide whether to fight a small fire or retreat and flag the area?",
      "How does it cover large areas efficiently with limited power?"
    ],
    requirements: { precision: 1, strength: 2, perception: 5, mobility: 5, durability: 4, adaptability: 4, communication: 1, social: 1 }
  },
  "MSN-1014": {
    title: "Robot Surgeon",
    category: "physical",
    tier: "extreme",
    environment: "sterile",
    description: "A cutting-edge surgical theater. Your robot performs a delicate spinal surgery — millimeter-level precision, zero margin for error. It must interpret real-time imaging, communicate with the surgical team, and adapt instantly if complications arise. The environment is strictly sterile: no heavy, dirty, or fuel-based parts allowed.",
    objectives: [
      "How does your robot achieve the sub-millimeter precision needed for spinal surgery?",
      "What if something unexpected happens mid-surgery — a bleed, an anomaly on the scan?",
      "How does it communicate with the human surgeon without being distracting?"
    ],
    requirements: { precision: 5, strength: 1, perception: 5, mobility: 1, durability: 1, adaptability: 4, communication: 3, social: 2 }
  },
  "MSN-1015": {
    title: "Factory Worker Bot",
    category: "physical",
    tier: "standard",
    environment: "normal",
    description: "An automotive assembly line. Your robot works an 18-hour shift assembling car doors — welding, bolting, quality-checking, and passing completed units down the line. Speed and consistency matter. The factory is loud, hot near the welding stations, and the robot must work alongside human workers safely.",
    objectives: [
      "How does your robot maintain the same quality on unit #500 as it did on unit #1?",
      "What if it detects a defective part in the supply chain?",
      "How does it work safely near human workers without slowing down?"
    ],
    requirements: { precision: 4, strength: 4, perception: 3, mobility: 2, durability: 4, adaptability: 2, communication: 1, social: 2 }
  },
  "MSN-1016": {
    title: "Construction Bot",
    category: "physical",
    tier: "advanced",
    environment: "unstable-terrain",
    description: "A half-built skyscraper, 30 floors up. High winds, unfinished floors with exposed edges, and heavy materials that need to be moved precisely into place. Your robot handles steel beam placement, concrete pouring, and structural inspection — all on a surface that sways in the wind.",
    objectives: [
      "How does your robot maintain precision when the building is swaying in the wind?",
      "What if it detects a structural weakness in the building mid-construction?",
      "How does it move heavy steel beams without endangering human workers below?"
    ],
    requirements: { precision: 3, strength: 5, perception: 3, mobility: 3, durability: 5, adaptability: 3, communication: 1, social: 1 }
  },
  "MSN-1017": {
    title: "Bomb Disposal Bot",
    category: "physical",
    tier: "extreme",
    environment: "low-visibility",
    description: "A suspicious package has been found in a subway station. The station is dark — power has been cut for safety. Your robot must approach the device, scan it, identify the mechanism, and disarm or safely detonate it. One wrong move could be catastrophic. Visibility is near zero.",
    objectives: [
      "How does your robot examine a device it can barely see?",
      "What if the bomb has a motion sensor — how does your robot approach without triggering it?",
      "Should your robot attempt to disarm, or is controlled detonation safer? How does it decide?"
    ],
    requirements: { precision: 5, strength: 1, perception: 5, mobility: 3, durability: 4, adaptability: 5, communication: 2, social: 1 }
  },
  "MSN-1018": {
    title: "Deep Sea Repair Bot",
    category: "physical",
    tier: "extreme",
    environment: "underwater-remote",
    description: "An undersea fiber optic cable has been severed 3,000 meters below the surface. Total darkness, crushing pressure, freezing temperatures, and zero communication with the surface. Your robot must locate the break, perform precision repairs on delicate fiber optic strands, and do it all autonomously.",
    objectives: [
      "How does your robot find the exact break point in miles of cable on the ocean floor?",
      "At 3,000 meters depth, how does it handle the extreme pressure and cold?",
      "With no signal to the surface, how does it make decisions about the repair on its own?"
    ],
    requirements: { precision: 5, strength: 2, perception: 4, mobility: 3, durability: 5, adaptability: 5, communication: 1, social: 1 }
  },
  "MSN-1019": {
    title: "Mystery Mission",
    category: "wild",
    tier: "random",
    environment: "random",
    description: "You don't know what job your robot needs to do until halfway through building. Build a versatile robot, then adapt when the real mission is revealed at 1:30 on the clock.",
    objectives: [
      "Without knowing the job, what kind of robot is the safest all-rounder to build?",
      "When the real mission is revealed, what's the fastest way to adapt your build?",
      "Is it better to specialize and gamble, or stay balanced and safe?"
    ],
    requirements: null,
    specialRule: "At 1:30 remaining in build phase, a random mission from the other 18 is revealed. Its requirements become the scoring requirements."
  },
  "MSN-1020": {
    title: "Player's Choice",
    category: "wild",
    tier: "random",
    environment: "random",
    description: "You choose the job. Type in any real-world robot job you can imagine — the app will generate requirements based on keywords in your description.",
    objectives: [
      "What real-world problem do you want a robot to solve?",
      "What's the most dangerous or challenging part of this job for a robot?",
      "What would make humans trust this robot to do this job?"
    ],
    requirements: null,
    specialRule: "Player types a job description. App scans for keywords and generates a requirement profile."
  }
};
