export function first<T>(value?: T | T[]): T | undefined {
  if (value === undefined) return undefined;
  if (!Array.isArray(value)) value = [value];
  return value[0];
}

export function throwExpression(error: unknown): never {
  throw error;
}

export function trucateAddress(s: string): string {
  let result = ''
  if (s && s.length > 0) {
    result = s.substring(0, 5) + '.....' + s.substring(s.length - 6, s.length)
  }

  return result
}
