export function generateRequirementsFromDescription(description) {
  const text = description.toLowerCase();
  const reqs = { precision: 2, strength: 2, perception: 2, mobility: 2, durability: 2, adaptability: 2, communication: 2, social: 2 };

  const keywords = {
    precision: ['surgery', 'surgical', 'precise', 'precision', 'delicate', 'micro', 'nano', 'repair', 'calibrate', 'fiber', 'optic'],
    strength: ['lift', 'heavy', 'construction', 'build', 'carry', 'move', 'steel', 'beam', 'demolish', 'dig', 'excavate'],
    perception: ['detect', 'scan', 'sense', 'find', 'locate', 'search', 'vision', 'camera', 'thermal', 'survey', 'map', 'patrol', 'fire', 'smoke'],
    mobility: ['fast', 'speed', 'agile', 'navigate', 'underwater', 'swim', 'fly', 'climb', 'terrain', 'explore', 'patrol', 'delivery'],
    durability: ['fire', 'explosion', 'extreme', 'hostile', 'dangerous', 'hazard', 'radiation', 'heat', 'cold', 'pressure', 'deep', 'ocean', 'disaster'],
    adaptability: ['adapt', 'flexible', 'learn', 'dynamic', 'unpredictable', 'change', 'varying', 'multiple', 'diverse', 'unknown'],
    communication: ['communicate', 'report', 'signal', 'translate', 'language', 'broadcast', 'alert', 'notify', 'coordinate', 'team'],
    social: ['customer', 'service', 'people', 'patient', 'social', 'human', 'interaction', 'care', 'assist', 'help', 'friend', 'companion', 'therapy', 'teach', 'tutor']
  };

  const boostFactors = {
    'hospital': { precision: 2, social: 2, communication: 2 },
    'medical': { precision: 2, social: 1, communication: 1 },
    'underwater': { durability: 2, mobility: 2 },
    'ocean': { durability: 2, mobility: 1 },
    'deep sea': { durability: 3, mobility: 1 },
    'fire': { durability: 3, perception: 2 },
    'rescue': { durability: 2, perception: 2, mobility: 1 },
    'customer': { social: 3, communication: 3 },
    'elderly': { social: 3, communication: 2 },
    'child': { social: 2, communication: 2, adaptability: 1 },
    'bomb': { precision: 3, perception: 2, adaptability: 2 },
    'space': { durability: 2, adaptability: 2, communication: 1 },
    'military': { durability: 3, strength: 2, precision: 1 },
    'farm': { strength: 2, durability: 1, mobility: 2 },
    'warehouse': { strength: 2, mobility: 2, precision: 1 }
  };

  // Keyword matching
  Object.entries(keywords).forEach(([stat, words]) => {
    words.forEach(word => {
      if (text.includes(word)) {
        reqs[stat] = Math.min(5, reqs[stat] + 1);
      }
    });
  });

  // Context boosts
  Object.entries(boostFactors).forEach(([phrase, boosts]) => {
    if (text.includes(phrase)) {
      Object.entries(boosts).forEach(([stat, amount]) => {
        reqs[stat] = Math.min(5, reqs[stat] + amount);
      });
    }
  });

  // Normalize to 1-5 range
  Object.keys(reqs).forEach(stat => {
    reqs[stat] = Math.max(1, Math.min(5, reqs[stat]));
  });

  return reqs;
}
