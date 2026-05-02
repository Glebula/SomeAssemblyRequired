export function getTraitText(part) {
  if (part.id === 1) return '⚠️ Unique: max 5 total modules';
  if (part.specialRules?.powerBudget) return `⚡ Powers robot (+${part.specialRules.powerBudget} budget)`;
  if (part.specialRules?.waterproof) return '🌊 Amphibious: works underwater';
  if (part.specialRules?.glitchRisk) return `🎲 ${Math.round(part.specialRules.glitchRisk * 100)}% glitch risk`;
  if (part.specialRules?.heatImmune) return '🔥 Heat-shielded for extreme temps';
  if ((part.conflictsWith || []).length > 0) return `⚠️ May conflict with ${(part.conflictsWith || []).length} part${part.conflictsWith.length > 1 ? 's' : ''}`;

  const topBenefit = Object.entries(part.benefits || {})
    .filter(([, v]) => v > 0)
    .sort(([, a], [, b]) => b - a)[0];

  if (topBenefit) {
    const [stat, value] = topBenefit;
    return `+${value} ${stat.charAt(0).toUpperCase() + stat.slice(1)}`;
  }

  return 'Balanced module';
}

export default function PartTraitLine({ part }) {
  return (
    <div style={{ marginTop: 6, minHeight: 34 }}>
      <div style={{
        fontSize: 10,
        color: '#cbd5e1',
        fontFamily: 'Space Grotesk, sans-serif',
        lineHeight: 1.2,
        textAlign: 'center'
      }}>
        {getTraitText(part)}
      </div>
    </div>
  );
}
