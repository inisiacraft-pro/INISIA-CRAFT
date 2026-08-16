/**
 * تقدير قياسات مبني على معايير دولية حقيقية — وليس نموذج تعلّم آلي "صندوق أسود".
 * المصدر: جدول المقاسات الدولية (ISO 8559-1 / ASTM D5585)، إضافة إلى نسب قياسية
 * معتمدة في رسم الأنماط (Pattern Drafting) لتقدير الكتف/الكم/الطول انطلاقًا من
 * الصدر والطول الكلي — نسب شائعة في صناعة الخياطة (وليست مطلقة لكل جسم).
 *
 * الشفافية الكاملة مقصودة: كل رقم هنا نتيجة معادلة واضحة قابلة للمراجعة يدويًا،
 * وليس نتيجة نموذج غير قابل للتفسير. هذا "تقدير رقمي" يُراجَع دائمًا من خياطة بشرية
 * قبل التفصيل النهائي.
 */

export type KnownMeasure =
  | { type: 'bust' | 'waist' | 'hips'; value: number }
  | { type: 'size'; value: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' };

export interface EstimateResult {
  matchedSize: string;
  bust: number;
  waist: number;
  hips: number;
  shoulder: number;
  sleeve_length: number;
  total_length: number;
}

const CHART = [
  { size: 'XS', bust: 79.5, waist: 61.5, hips: 86.5 },
  { size: 'S', bust: 83.5, waist: 65.5, hips: 90.5 },
  { size: 'M', bust: 88, waist: 70, hips: 95 },
  { size: 'L', bust: 93, waist: 75.5, hips: 100.5 },
  { size: 'XL', bust: 98.5, waist: 82, hips: 107 },
  { size: 'XXL', bust: 105, waist: 89.5, hips: 114.5 },
] as const;

function interpolate(axis: 'bust' | 'waist' | 'hips', value: number) {
  const sorted = CHART;
  if (value <= sorted[0][axis]) return sorted[0];
  if (value >= sorted[sorted.length - 1][axis]) return sorted[sorted.length - 1];

  for (let i = 0; i < sorted.length - 1; i++) {
    const a = sorted[i];
    const b = sorted[i + 1];
    if (value >= a[axis] && value <= b[axis]) {
      const t = (value - a[axis]) / (b[axis] - a[axis]);
      return {
        size: t < 0.5 ? a.size : b.size,
        bust: a.bust + t * (b.bust - a.bust),
        waist: a.waist + t * (b.waist - a.waist),
        hips: a.hips + t * (b.hips - a.hips),
      };
    }
  }
  return sorted[sorted.length - 1];
}

const round = (n: number) => Math.round(n * 2) / 2; // لأقرب نصف سنتيمتر

export function estimateMeasurements(heightCm: number, known: KnownMeasure): EstimateResult {
  let row: { size: string; bust: number; waist: number; hips: number };

  if (known.type === 'size') {
    row = CHART.find((c) => c.size === known.value) ?? CHART[2];
  } else {
    row = interpolate(known.type, known.value);
  }

  const shoulder = round(row.bust * 0.24);
  const sleeve_length = round(heightCm * 0.31);
  const total_length = round(heightCm * 0.86);

  return {
    matchedSize: row.size,
    bust: round(row.bust),
    waist: round(row.waist),
    hips: round(row.hips),
    shoulder,
    sleeve_length,
    total_length,
  };
}
