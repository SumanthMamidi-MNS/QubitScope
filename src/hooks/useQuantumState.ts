import { useState, useCallback } from 'react';
import type { StateVector, GateType } from '../types/quantum';
import {
  complex,
  applyGateToState,
  getBlochVector,
  getProbabilities,
  performMeasurement,
  normalizeStateVector,
} from '../engine/quantumEngine';

const INITIAL_STATEVECTOR: StateVector = [complex(1, 0), complex(0, 0)];

export const useQuantumState = () => {
  const [statevector, setStatevector] = useState<StateVector>(INITIAL_STATEVECTOR);
  const [history, setHistory] = useState<string[]>([]);
  
  const blochVector = getBlochVector(statevector);
  const { p0: prob0, p1: prob1 } = getProbabilities(statevector);

  const applyGate = useCallback((gateType: GateType, name: string, theta?: number) => {
    setStatevector((prev) => {
      const nextState = applyGateToState(prev, gateType, theta);
      return normalizeStateVector(nextState);
    });
    setHistory((prev) => {
      const gateLabel = theta !== undefined ? `${name}(${(theta * 180 / Math.PI).toFixed(0)}°)` : name;
      return [...prev, gateLabel];
    });
  }, []);

  const measure = useCallback(() => {
    let outcomeVal: 0 | 1 = 0;
    setStatevector((prev) => {
      const { outcome, collapsedState } = performMeasurement(prev);
      outcomeVal = outcome;
      return collapsedState;
    });
    setHistory((prev) => [...prev, `Measure: |${outcomeVal}⟩`]);
    return outcomeVal;
  }, []);

  const reset = useCallback(() => {
    setStatevector(INITIAL_STATEVECTOR);
    setHistory([]);
  }, []);

  return {
    statevector,
    blochVector,
    prob0,
    prob1,
    history,
    applyGate,
    measure,
    reset,
  };
};
export type UseQuantumStateReturn = ReturnType<typeof useQuantumState>;
