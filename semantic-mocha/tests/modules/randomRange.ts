export const randomRange = (lower: number, upper: number): number => {
  const range = upper + 1 - lower;

  return Math.floor(lower + Math.random() * range);
};
