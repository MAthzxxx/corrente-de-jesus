export const PERIODS = [
  { id: "semana", label: "1 semana", days: 7 },
  { id: "mes", label: "1 mês", days: 30 },
  { id: "3meses", label: "3 meses", days: 90 },
  { id: "ano", label: "1 ano", days: 365 },
] as const;

/** 1 atividade de 10 minutos por dia. */
export function calcPeriod(days: number) {
  const minutes = days * 10;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  const hours = m === 0 ? `${h}h` : `${h}h${String(m).padStart(2, "0")}`;
  return { activities: days, hours, stories: days };
}
