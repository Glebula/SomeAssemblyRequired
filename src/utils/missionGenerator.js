export function generateRequirementsFromDescription(text) {
  const t = text.toLowerCase();
  const req = { precision: 2, strength: 2, perception: 2, mobility: 2, durability: 2, adaptability: 2, communication: 2, social: 2 };

  if (/fire|heat|burn|flame|rescue/.test(t)) {
    Object.assign(req, { perception: 5, durability: 5, mobility: 4, strength: 4, adaptability: 3 });
  } else if (/hospital|patient|medical|surgery|nurse|doctor|clinic/.test(t)) {
    Object.assign(req, { precision: 5, perception: 4, social: 4, communication: 4, adaptability: 3 });
  } else if (/underwater|ocean|deep|sea|marine|submarine/.test(t)) {
    Object.assign(req, { durability: 5, mobility: 4, perception: 4, adaptability: 4 });
  } else if (/customer|service|hotel|restaurant|retail|store|shop/.test(t)) {
    Object.assign(req, { social: 5, communication: 5, adaptability: 4, mobility: 3 });
  } else if (/factory|build|construct|assembly|weld|manufactur/.test(t)) {
    Object.assign(req, { strength: 5, precision: 4, durability: 4, adaptability: 2 });
  } else if (/rescue|disaster|emergency|avalanche|earthquake|hurricane/.test(t)) {
    Object.assign(req, { perception: 5, durability: 5, strength: 4, mobility: 4, adaptability: 4 });
  } else if (/bomb|explosive|defuse|disposal|mine/.test(t)) {
    Object.assign(req, { precision: 5, perception: 5, adaptability: 5, durability: 4 });
  } else if (/space|asteroid|planet|orbit|satellite/.test(t)) {
    Object.assign(req, { durability: 5, adaptability: 5, precision: 4, mobility: 3 });
  } else if (/teach|tutor|school|educat|student|learn/.test(t)) {
    Object.assign(req, { adaptability: 5, communication: 5, social: 4, perception: 3 });
  } else if (/care|elder|assist|companion|therapy|mental/.test(t)) {
    Object.assign(req, { social: 5, communication: 5, adaptability: 4, perception: 4 });
  } else if (/deliver|courier|transport|carry|supply/.test(t)) {
    Object.assign(req, { mobility: 5, durability: 3, adaptability: 3, precision: 2 });
  } else if (/farm|harvest|agricult|crop|soil/.test(t)) {
    Object.assign(req, { mobility: 4, durability: 4, precision: 3, strength: 3 });
  } else if (/secur|guard|patrol|police|surveil/.test(t)) {
    Object.assign(req, { perception: 5, mobility: 4, durability: 4, adaptability: 3, communication: 3 });
  }

  // Clamp all stats to 1–5
  for (const k of Object.keys(req)) req[k] = Math.max(1, Math.min(5, req[k]));
  return req;
}

export function generateTopStats(requirements) {
  return Object.entries(requirements)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([k]) => k);
}
