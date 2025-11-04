export function lastLineOf(value: string): string {
  const lastCR = value.lastIndexOf('\r')
  const lastLF = value.lastIndexOf('\n')
  const index = Math.max(lastCR, lastLF)
  return value.slice(index + 1)
}
