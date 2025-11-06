export function getDisplayName(fullName: string, limit: number = 2): string {
  const parts = fullName.trim().split(' ');
  if (parts.length <= limit) return fullName;
  return `${parts.slice(0, limit).join(' ')}`;
}
