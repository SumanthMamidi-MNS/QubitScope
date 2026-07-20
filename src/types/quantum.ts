export interface Complex {
  re: number;
  im: number;
}

export type StateVector = [Complex, Complex];

export interface BlochVector {
  x: number;
  y: number;
  z: number;
}

export type GateType = 'X' | 'Y' | 'Z' | 'H' | 'S' | 'T' | 'Rx' | 'Ry' | 'Rz';

export interface Gate {
  id: string;
  name: string;
  type: GateType;
  params?: {
    theta?: number;
  };
}

export interface SimulationState {
  statevector: StateVector;
  blochVector: BlochVector;
  history: string[];
  prob0: number;
  prob1: number;
}
