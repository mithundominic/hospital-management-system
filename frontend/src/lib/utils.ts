// Responsibility: Pure utility function to combine conditional CSS class names

export const cn = (
  ...classes: (string | number | boolean | undefined | null)[]
): string => {
  return classes.filter(Boolean).map(String).join(' ');
};
