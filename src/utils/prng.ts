/**
 * Deterministic 32-bit PRNG (Mulberry32) returning values in [0, 1).
 */
export function createMulberry32(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * 2D Rastrigin benchmark function on [-5.12, 5.12]^2.
 * Global minimum is 0 at (0, 0).
 */
export function rastrigin2D(x: number, y: number): number {
  return (
    20 +
    x * x +
    y * y -
    10 * (Math.cos(2 * Math.PI * x) + Math.cos(2 * Math.PI * y))
  );
}

/**
 * Converts a non-negative integer in binary representation to reflected Gray code.
 */
export function binaryToGray(n: number): number {
  const value = Math.max(0, Math.floor(n));
  return value ^ (value >> 1);
}

/**
 * Computes the Hamming distance (popcount of XOR) between two integers.
 */
export function hammingDistance(a: number, b: number): number {
  let diff = (a ^ b) >>> 0;
  let count = 0;
  while (diff !== 0) {
    count += diff & 1;
    diff >>>= 1;
  }
  return count;
}

/**
 * Formats an integer as a fixed-width binary bitstring.
 */
export function formatBits(n: number, bits = 4): string {
  const value = Math.max(0, Math.floor(n));
  return value.toString(2).padStart(bits, '0');
}
