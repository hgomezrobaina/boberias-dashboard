export const years = [
  { label: "Todos", value: "-1" },
  ...[2024, 2025, 2026, 2027, 2028].map((y) => {
    return { label: y.toString(), value: y.toString() };
  }),
];
