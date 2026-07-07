export function jsonSafeParse<T>(raw: string, fallback: T): T {
  try {
    const parsed = JSON.parse(raw);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

export function isValidResponseShape<T extends object>(
  data: unknown,
  requiredKeys: (keyof T)[]
): data is T {
  if (!data || typeof data !== 'object') return false;
  return requiredKeys.every((key) => key in (data as object));
}