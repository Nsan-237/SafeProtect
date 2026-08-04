export const generateCaseNumber = (count: number) => {
  const year = new Date().getFullYear();
  const paddedCount = (count + 1).toString().padStart(5, '0');
  return `SPC-${year}-${paddedCount}`;
};
