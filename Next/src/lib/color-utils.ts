export function lightenColor(color: string, percent: number): string {
  const num = Number.parseInt(color.slice(1), 16);
  const r = (num >> 16) & 0xff;
  const g = (num >> 8) & 0xff;
  const b = num & 0xff;

  const newR = Math.min(255, Math.max(0, r + Math.round(2.55 * percent)));
  const newG = Math.min(255, Math.max(0, g + Math.round(2.55 * percent)));
  const newB = Math.min(255, Math.max(0, b + Math.round(2.55 * percent)));

  return (
    "#" + ((1 << 24) + (newR << 16) + (newG << 8) + newB).toString(16).slice(1)
  );
}

export function blendColor(hex1: string, hex2: string, weight: number): string {
  const n1 = Number.parseInt(hex1.slice(1), 16);
  const n2 = Number.parseInt(hex2.slice(1), 16);
  const r = Math.round(
    ((n1 >> 16) & 0xff) * (1 - weight) + ((n2 >> 16) & 0xff) * weight
  );
  const g = Math.round(
    ((n1 >> 8) & 0xff) * (1 - weight) + ((n2 >> 8) & 0xff) * weight
  );
  const b = Math.round(
    (n1 & 0xff) * (1 - weight) + (n2 & 0xff) * weight
  );
  return (
    "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
  );
}
