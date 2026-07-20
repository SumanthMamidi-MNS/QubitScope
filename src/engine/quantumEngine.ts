import type { Complex, StateVector, BlochVector, GateType } from '../types/quantum';

// =============================================================================
// COMPLEX NUMBER UTILITIES
// =============================================================================

export const complex = (re: number, im = 0): Complex => ({ re, im });

export const c_add = (c1: Complex, c2: Complex): Complex => ({
  re: c1.re + c2.re,
  im: c1.im + c2.im,
});

export const c_sub = (c1: Complex, c2: Complex): Complex => ({
  re: c1.re - c2.re,
  im: c1.im - c2.im,
});

export const c_mul = (c1: Complex, c2: Complex): Complex => ({
  re: c1.re * c2.re - c1.im * c2.im,
  im: c1.re * c2.im + c1.im * c2.re,
});

export const c_scale = (c: Complex, s: number): Complex => ({
  re: c.re * s,
  im: c.im * s,
});

export const c_conj = (c: Complex): Complex => ({
  re: c.re,
  im: -c.im,
});

export const c_mag2 = (c: Complex): number => c.re * c.re + c.im * c.im;

export const c_mag = (c: Complex): number => Math.sqrt(c_mag2(c));

export const c_phase = (c: Complex): number => Math.atan2(c.im, c.re);

export const c_exp = (phi: number): Complex => ({
  re: Math.cos(phi),
  im: Math.sin(phi),
});

// Format complex numbers nicely for display
export const formatComplex = (c: Complex, precision = 3): string => {
  const r = parseFloat(c.re.toFixed(precision));
  const i = parseFloat(c.im.toFixed(precision));

  if (Math.abs(i) === 0) return `${r}`;
  if (Math.abs(r) === 0) {
    if (i === 1) return 'i';
    if (i === -1) return '-i';
    return `${i}i`;
  }
  
  const sign = i >= 0 ? '+' : '-';
  const absI = Math.abs(i);
  const iStr = absI === 1 ? 'i' : `${absI}i`;
  return `${r} ${sign} ${iStr}`;
};

// =============================================================================
// MATRIX OPERATIONS
// =============================================================================

type Matrix2x2 = [[Complex, Complex], [Complex, Complex]];

export const multiplyMatrixVector = (
  m: Matrix2x2,
  v: StateVector
): StateVector => {
  return [
    c_add(c_mul(m[0][0], v[0]), c_mul(m[0][1], v[1])),
    c_add(c_mul(m[1][0], v[0]), c_mul(m[1][1], v[1])),
  ];
};

// =============================================================================
// QUANTUM GATES DEFINITIONS
// =============================================================================

const ONE = complex(1, 0);
const ZERO = complex(0, 0);
const I = complex(0, 1);
const MINUS_I = complex(0, -1);
const INV_SQRT2 = complex(1 / Math.sqrt(2), 0);

export const GATES: Record<string, (theta?: number) => Matrix2x2> = {
  X: () => [
    [ZERO, ONE],
    [ONE, ZERO],
  ],
  Y: () => [
    [ZERO, MINUS_I],
    [I, ZERO],
  ],
  Z: () => [
    [ONE, ZERO],
    [ZERO, complex(-1, 0)],
  ],
  H: () => [
    [INV_SQRT2, INV_SQRT2],
    [INV_SQRT2, c_scale(INV_SQRT2, -1)],
  ],
  S: () => [
    [ONE, ZERO],
    [ZERO, I],
  ],
  T: () => [
    [ONE, ZERO],
    [ZERO, c_exp(Math.PI / 4)],
  ],
  Rx: (theta = 0) => {
    const halfTheta = theta / 2;
    const c = complex(Math.cos(halfTheta), 0);
    const s = complex(0, -Math.sin(halfTheta));
    return [
      [c, s],
      [s, c],
    ];
  },
  Ry: (theta = 0) => {
    const halfTheta = theta / 2;
    const c = complex(Math.cos(halfTheta), 0);
    const s = complex(Math.sin(halfTheta), 0);
    return [
      [c, c_scale(s, -1)],
      [s, c],
    ];
  },
  Rz: (theta = 0) => {
    const halfTheta = theta / 2;
    return [
      [c_exp(-halfTheta), ZERO],
      [ZERO, c_exp(halfTheta)],
    ];
  },
};

// =============================================================================
// SIMULATION OPERATIONS
// =============================================================================

export const applyGateToState = (
  statevector: StateVector,
  gateType: GateType,
  theta?: number
): StateVector => {
  const gateConstructor = GATES[gateType];
  if (!gateConstructor) {
    throw new Error(`Gate type ${gateType} is not supported.`);
  }
  const matrix = gateConstructor(theta);
  return multiplyMatrixVector(matrix, statevector);
};

export const getBlochVector = (statevector: StateVector): BlochVector => {
  const [alpha, beta] = statevector;

  // Let alpha = a + ib, beta = c + id
  // x = 2 * Re(alpha * conj(beta)) = 2 * (a*c + b*d)
  // y = 2 * Im(alpha_conj * beta) = 2 * (a*d - b*c)
  // z = |alpha|^2 - |beta|^2
  const a = alpha.re;
  const b = alpha.im;
  const c = beta.re;
  const d = beta.im;

  const x = 2 * (a * c + b * d);
  const y = 2 * (a * d - b * c);
  const z = (a * a + b * b) - (c * c + d * d);

  return { x, y, z };
};

export const getProbabilities = (statevector: StateVector): { p0: number; p1: number } => {
  const p0 = c_mag2(statevector[0]);
  const p1 = c_mag2(statevector[1]);
  // Re-normalize to prevent floating point drift issues
  const sum = p0 + p1;
  if (sum === 0) return { p0: 1, p1: 0 };
  return { p0: p0 / sum, p1: p1 / sum };
};

export const performMeasurement = (
  statevector: StateVector
): { outcome: 0 | 1; collapsedState: StateVector } => {
  const { p0 } = getProbabilities(statevector);
  const rand = Math.random();
  const outcome = rand < p0 ? 0 : 1;

  const collapsedState: StateVector =
    outcome === 0
      ? [complex(1, 0), complex(0, 0)]
      : [complex(0, 0), complex(1, 0)];

  return { outcome, collapsedState };
};

// Normalize a state vector to ensure sum of magnitudes squared is exactly 1
export const normalizeStateVector = (statevector: StateVector): StateVector => {
  const mag0 = c_mag(statevector[0]);
  const mag1 = c_mag(statevector[1]);
  const mag = Math.sqrt(mag0 * mag0 + mag1 * mag1);
  if (mag === 0) return [complex(1, 0), complex(0, 0)];
  return [c_scale(statevector[0], 1 / mag), c_scale(statevector[1], 1 / mag)];
};
