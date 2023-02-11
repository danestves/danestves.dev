/**
 * Simple object check.
 */
export function isObject(item: any) {
  return item && typeof item === "object" && !Array.isArray(item)
}

/**
 * Deep merge two objects.
 * @param target
 * @param ...sources
 */
export function deepMerge<T, U>(target: T, source: U): T & U {
  for (const key in source) {
    if (source[key] instanceof Object && target[key as unknown as keyof T] instanceof Object) {
      Object.assign(
        // @ts-expect-error - this is a hack to get around the fact that we're using a string as a key
        target[key as keyof T],
        deepMerge(target[key as unknown as keyof T], source[key]),
      )
    } else {
      Object.assign(target as any, { [key]: source[key] })
    }
  }
  return target as T & U
}
