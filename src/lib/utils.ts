/**
 * ユーティリティ関数集
 */

/**
 * クラス名を結合する関数
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}

/**
 * 文字列をケバブケースに変換
 */
export function toKebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .toLowerCase()
    .replace(/\s+/g, '-')
}

/**
 * 文字列をキャメルケースに変換
 */
export function toCamelCase(str: string): string {
  return str
    .replace(/-([a-z])/g, (g) => g[1].toUpperCase())
    .replace(/^([A-Z])/, (g) => g.toLowerCase())
}

/**
 * 配列をシャッフルする関数
 */
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

/**
 * 遅延実行関数
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}