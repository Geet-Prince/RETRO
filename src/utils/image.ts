export const saavnImg = (url: string | undefined, size: number = 50): string => {
  if (!url) return '';
  return url.replace(/\d+x\d+/, `${size}x${size}`);
};
