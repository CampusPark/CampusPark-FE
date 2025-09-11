export function parseChoice(text: string): number | null {
  // "1번", "일번", "하나", "1"
  const t = text.replace(/\s/g, "");
  if (/[1-9]/.test(t)) return Number(t.match(/[1-9]/)![0]);
  if (/일?번|하나/.test(t)) return 1;
  if (/이번|둘|두/.test(t)) return 2;
  if (/삼?번|셋/.test(t)) return 3;
  return null;
}

export function parseTimeRange(
  text: string
): { startHour: number; hours: number } | null {
  // "20시부터 2시간", "18시 20시", "저녁 8시부터 두 시간"
  const hh = text.match(/([01]?\d|2[0-3])\s*시/);
  const dur = text.match(/(\d+)\s*시간/);
  if (hh && dur) {
    return { startHour: Number(hh[1]), hours: Number(dur[1]) };
  }
  // "18시20시" 형태
  const hh2 = text.match(/([01]?\d|2[0-3])\s*시?\s*([01]?\d|2[0-3])\s*시?/);
  if (hh2) {
    const a = Number(hh2[1]),
      b = Number(hh2[2]);
    return { startHour: a, hours: Math.max(1, b - a) };
  }
  return null;
}
