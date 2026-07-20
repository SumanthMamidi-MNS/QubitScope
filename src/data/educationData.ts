export interface GlossaryTerm {
  term: string;
  beginner: string;
  advanced: string;
}

export interface GateEncyclopediaEntry {
  type: string;
  name: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  readingTime: string;
  purpose: string;
  simpleExplanation: string;
  advancedExplanation: string;
  matrix: string;
  visualEffect: string;
  realWorldUse: string;
}

export interface Chapter {
  id: number;
  title: string;
  description: string;
  beginnerContent: string[];
  advancedContent: string[];
  takeaways: string[];
  // Interactive sandbox setup helper: preset gates to guide the user's experiment
  interactivePreset?: {
    label: string;
    description: string;
    gates: Array<{ type: string; name: string; theta?: number }>;
  };
}

export const GLOSSARY: GlossaryTerm[] = [
  {
    term: 'Qubit',
    beginner: 'A quantum bit. Unlike a classical computer bit which is strictly 0 or 1, a qubit can be in a superposition of both states at the same time until it is measured.',
    advanced: 'The fundamental unit of quantum information, represented mathematically as a vector in a two-dimensional complex vector space (Hilbert space). Its state $|\\psi\\rangle = \\alpha|0\\rangle + \\beta|1\\rangle$ satisfies the normalization condition $|\\alpha|^2 + |\\beta|^2 = 1$.'
  },
  {
    term: 'Superposition',
    beginner: 'A state where a qubit exists in a combination of both 0 and 1 states simultaneously. It is like a spinning coin that is neither heads nor tails until it stops.',
    advanced: 'A linear combination of basis states. For a single qubit, this is any state where both amplitudes $\\alpha$ and $\\beta$ are non-zero. Superposition allows quantum systems to process multi-dimensional data paths concurrently.'
  },
  {
    term: 'Phase',
    beginner: 'The relative timing or alignment of the quantum wave. While it does not change the probability of measuring 0 or 1 directly, phase controls how qubits interfere with each other.',
    advanced: 'The angular difference between the complex coefficients $\\alpha$ and $\\beta$. In $|\\psi\\rangle = \\cos(\\theta/2)|0\\rangle + e^{i\\phi}\\sin(\\theta/2)|1\\rangle$, the angle $\\phi$ is the relative phase, mapping to the longitude on the Bloch sphere.'
  },
  {
    term: 'Amplitude',
    beginner: 'A complex number associated with each state that determines its measurement probability. The higher the magnitude of the amplitude, the higher the chance of measuring that state.',
    advanced: 'The coefficients $\\alpha, \\beta \\in \\mathbb{C}$ of the state vector. The modulus squared of the amplitude ($|\\alpha|^2$ and $|\\beta|^2$) yields the probability of the state collapsing to $|0\\rangle$ or $|1\\rangle$ respectively, as per Born\'s rule.'
  },
  {
    term: 'Probability',
    beginner: 'The chance of getting a 0 or 1 when you observe the qubit. For example, a 50% probability means a measurement has a coin-flip chance of returning either result.',
    advanced: 'The probability distribution of measurement outcomes. Governed by $P(i) = |\\langle i | \\psi \\rangle|^2$. For standard computational basis measurements, $P(0) = |\\alpha|^2$ and $P(1) = |\\beta|^2$.'
  },
  {
    term: 'State Vector',
    beginner: 'A pair of numbers that mathematically describes everything about the qubit\'s current quantum state, representing its position on the Bloch sphere.',
    advanced: 'A unit vector in a Hilbert space. For a single qubit, it is a $2 \\times 1$ column vector containing complex numbers representing the probability amplitudes of the computational basis states.'
  },
  {
    term: 'Dirac Notation',
    beginner: 'A standard code notation used in quantum physics. The symbol |0⟩ represents the state 0, |1⟩ represents the state 1, and |ψ⟩ represents the overall qubit state.',
    advanced: 'Bra-ket notation introduced by Paul Dirac. Column vectors are written as kets ($|\\psi\\rangle$), and their conjugate transpose row vectors are written as bras ($\\langle\\psi|$). Outer products form operators, e.g., $|0\\rangle\\langle0|$.'
  },
  {
    term: 'Measurement',
    beginner: 'The act of observing the qubit. This collapses the qubit out of its superposition coin-spin, forcing it to choose a definite classical state of either 0 or 1.',
    advanced: 'A projection operator application. Measurement in the computational basis applies projection operators $M_0 = |0\\rangle\\langle0|$ and $M_1 = |1\\rangle\\langle1|$. The state collapses to the matching subspace, losing all phase details.'
  },
  {
    term: 'Bloch Sphere',
    beginner: 'A 3D sphere that maps quantum states. The North pole is 0, the South pole is 1, and the equator represents superpositions. The orange arrow shows the qubit\'s current state.',
    advanced: 'A geometrical representation of the pure state space of a single qubit. Points on the sphere map state vectors using polar angle $\\theta$ and azimuthal angle $\\phi$. Mixed states reside inside the sphere ($r < 1$).'
  },
  {
    term: 'Quantum Gate',
    beginner: 'A control operations that rotates the state vector of the qubit on the Bloch sphere. They are equivalent to classical logic gates but preserve superposition and phase.',
    advanced: 'A $2 \\times 2$ unitary operator ($U^\\dagger U = I$) that acts on the qubit vector. Unitary transforms preserve the vector length, ensuring the state remains normalized on the surface of the Bloch sphere.'
  }
];

export const GATE_ENCYCLOPEDIA: GateEncyclopediaEntry[] = [
  {
    type: 'X',
    name: 'Pauli-X (NOT Gate)',
    difficulty: 'Beginner',
    readingTime: '1 min',
    purpose: 'Flips the state of the qubit.',
    simpleExplanation: 'Equivalent to the classical NOT gate. It flips a 0 to a 1, and a 1 to a 0. Geometrically, it rotates the state vector 180 degrees around the X-axis of the Bloch sphere.',
    advancedExplanation: 'The Pauli-X operator swaps computational basis states: $X|0\\rangle = |1\\rangle$ and $X|1\\rangle = |0\\rangle$. It is a self-adjoint unitary matrix representing a $\\pi$ rotation around the X-axis of the Bloch sphere.',
    matrix: '[ [0, 1], [1, 0] ]',
    visualEffect: 'Rotates the state vector 180° around the horizontal X-axis, flipping the vector from the North pole to the South pole (or vice-versa).',
    realWorldUse: 'Used to initialize qubits, execute bit-flips in arithmetic algorithms, and construct controlled-NOT (CNOT) operations for multi-qubit entanglement.'
  },
  {
    type: 'Y',
    name: 'Pauli-Y Gate',
    difficulty: 'Intermediate',
    readingTime: '1.5 mins',
    purpose: 'Flips both state values and shifts phase.',
    simpleExplanation: 'Flips the qubit state (like the X gate) but also applies a phase shift. On the Bloch sphere, it rotates the state vector 180 degrees around the Y-axis.',
    advancedExplanation: 'The Pauli-Y operator maps basis states with a complex phase multiplier: $Y|0\\rangle = i|1\\rangle$ and $Y|1\\rangle = -i|0\\rangle$. It represents a $\\pi$ rotation around the Y-axis of the Bloch sphere.',
    matrix: '[ [0, -i], [i, 0] ]',
    visualEffect: 'Rotates the state vector 180° around the depth Y-axis. It swaps North and South poles while flipping the phase of the amplitudes.',
    realWorldUse: 'Used in quantum chemistry simulations, error correction syndromic mapping, and specialized spin-rotation sequences.'
  },
  {
    type: 'Z',
    name: 'Pauli-Z (Phase Flip Gate)',
    difficulty: 'Intermediate',
    readingTime: '1.5 mins',
    purpose: 'Flips the phase of state |1⟩ without changing probabilities.',
    simpleExplanation: 'Leaves the state 0 untouched, but flips the phase sign of state 1. It causes no change if the qubit is strictly 0 or 1, but shifts the relative phase of superposition states. It rotates the vector 180 degrees around the vertical Z-axis.',
    advancedExplanation: 'The Pauli-Z operator maps: $Z|0\\rangle = |0\\rangle$ and $Z|1\\rangle = -|1\\rangle$. On superposition states, it flips the sign of the $|1\\rangle$ coefficient. This represents a $\\pi$ rotation around the Z-axis.',
    matrix: '[ [1, 0], [0, -1] ]',
    visualEffect: 'Rotates the vector 180° around the vertical Z-axis. It shifts states on the equator (e.g. from $|+\\rangle$ on positive X to $|-\\rangle$ on negative X).',
    realWorldUse: 'Essential for phase estimation, quantum Fourier transforms, and building phase-kickback mechanics in quantum algorithms.'
  },
  {
    type: 'H',
    name: 'Hadamard (H Gate)',
    difficulty: 'Beginner',
    readingTime: '2 mins',
    purpose: 'Creates equal superposition states.',
    simpleExplanation: 'The most important gate for creating superpositions. It takes a definite 0 or 1 state and rotates it to the equator of the Bloch sphere, resulting in a perfect 50/50 superposition state.',
    advancedExplanation: 'The Hadamard gate maps basis states to diagonal superposition states: $H|0\\rangle = |+\\rangle$ and $H|1\\rangle = |-\\rangle$. It is unitary and symmetric, representing a $\\pi$ rotation around the diagonal X+Z axis.',
    matrix: '1/√2 * [ [1, 1], [1, -1] ]',
    visualEffect: 'Rotates the vector 180° around the X+Z diagonal axis. It tilts the vertical poles directly to the equator, making the state equal-probability.',
    realWorldUse: 'Used at the beginning of almost every quantum algorithm (Grover\'s search, Shor\'s factoring, QPE) to initialize parallel computing paths.'
  },
  {
    type: 'S',
    name: 'S Gate (Phase-90° Gate)',
    difficulty: 'Intermediate',
    readingTime: '2 mins',
    purpose: 'Applies a 90-degree phase rotation.',
    simpleExplanation: 'Equivalent to half of a Z gate. It leaves 0 untouched and rotates the phase of state 1 by 90 degrees (quarter turn). It rotates the Bloch vector 90 degrees around the vertical Z-axis.',
    advancedExplanation: 'The S gate (sometimes called the phase gate $S = T^2 = \\sqrt{Z}$) maps: $S|0\\rangle = |0\\rangle$ and $S|1\\rangle = i|1\\rangle$. It represents a $\\pi/2$ rotation around the Z-axis.',
    matrix: '[ [1, 0], [0, i] ]',
    visualEffect: 'Rotates the state vector 90° clockwise around the vertical Z-axis, moving a state from the X-axis to the Y-axis.',
    realWorldUse: 'Used in fault-tolerant quantum error correction, stabilizing Clifford group circuits, and phase-tuning quantum algorithms.'
  },
  {
    type: 'T',
    name: 'T Gate (Phase-45° Gate)',
    difficulty: 'Advanced',
    readingTime: '2 mins',
    purpose: 'Applies a 45-degree phase rotation.',
    simpleExplanation: 'Equivalent to half of an S gate. It leaves 0 untouched and rotates the phase of state 1 by 45 degrees (one-eighth turn). It rotates the vector 45 degrees around the vertical Z-axis.',
    advancedExplanation: 'The T gate ($T = \\sqrt{S} = \\sqrt[4]{Z}$) maps: $T|0\\rangle = |0\\rangle$ and $T|1\\rangle = e^{i\\pi/4}|1\\rangle$. It represents a $\\pi/4$ rotation around the Z-axis.',
    matrix: '[ [1, 0], [0, e^(iπ/4)] ]',
    visualEffect: 'Rotates the state vector 45° clockwise around the Z-axis, shifting equator states along the longitudinal circles.',
    realWorldUse: 'Crucial for universal quantum computing. Adding the T gate to Clifford gates allows the creation of any arbitrary quantum circuit.'
  },
  {
    type: 'Rx',
    name: 'Rx(θ) Rotation Gate',
    difficulty: 'Advanced',
    readingTime: '2 mins',
    purpose: 'Rotates the statevector by a custom angle around the X-axis.',
    simpleExplanation: 'Allows you to specify exactly how many degrees to rotate the qubit vector around the horizontal X-axis. Used to tune probability coefficients continuously.',
    advancedExplanation: 'An arbitrary rotation operator around the X-axis: $R_x(\\theta) = \\exp(-i\\theta X/2) = \\cos(\\theta/2)I - i\\sin(\\theta/2)X$.',
    matrix: '[ [cos(θ/2), -i·sin(θ/2)], [-i·sin(θ/2), cos(θ/2)] ]',
    visualEffect: 'Sweeps the state vector around the horizontal X-axis by the selected angle $\\theta$ in degrees or radians.',
    realWorldUse: 'Used in Variational Quantum Eigensolvers (VQE), quantum machine learning ansatzes, and physical laser pulse calibrations.'
  },
  {
    type: 'Ry',
    name: 'Ry(θ) Rotation Gate',
    difficulty: 'Advanced',
    readingTime: '2 mins',
    purpose: 'Rotates the statevector by a custom angle around the Y-axis.',
    simpleExplanation: 'Allows you to rotate the qubit vector around the depth Y-axis by a custom angle, letting you shift the state up or down the sphere surface.',
    advancedExplanation: 'An arbitrary rotation operator around the Y-axis: $R_y(\\theta) = \\exp(-i\\theta Y/2) = \\cos(\\theta/2)I - i\\sin(\\theta/2)Y$.',
    matrix: '[ [cos(θ/2), -sin(θ/2)], [sin(θ/2), cos(θ/2)] ]',
    visualEffect: 'Rotates the state vector around the Y-axis by the angle $\\theta$, allowing smooth progression of real-valued superposition amplitudes.',
    realWorldUse: 'Commonly used to create custom superpositions without complex phase elements, especially in optimization algorithms (QAOA).'
  },
  {
    type: 'Rz',
    name: 'Rz(θ) Rotation Gate',
    difficulty: 'Advanced',
    readingTime: '2 mins',
    purpose: 'Rotates the statevector phase by a custom angle around the Z-axis.',
    simpleExplanation: 'Allows you to apply a custom phase shift to the qubit by rotating its vector around the vertical Z-axis by any custom angle.',
    advancedExplanation: 'An arbitrary rotation operator around the Z-axis: $R_z(\\theta) = \\exp(-i\\theta Z/2) = \\operatorname{diag}(e^{-i\\theta/2}, e^{i\\theta/2})$.',
    matrix: '[ [e^(-iθ/2), 0], [0, e^(iθ/2)] ]',
    visualEffect: 'Rotates the state vector around the vertical Z-axis by the angle $\\theta$, altering the relative phase $\\phi$ directly.',
    realWorldUse: 'Used to configure phase gates in quantum Fourier transforms, spin echo calibrations, and compiling quantum circuits.'
  }
];

export const LEARN_CHAPTERS: Chapter[] = [
  {
    id: 1,
    title: '1. Classical Bit vs Qubit',
    description: 'Understand the transition from classical states (0 or 1) to multi-dimensional quantum states.',
    beginnerContent: [
      'A classical computer processes data using classical bits. Think of a classical bit like a standard light switch: it can be either completely OFF (0) or completely ON (1). there is no in-between.',
      'A quantum computer processes data using qubits. A qubit is like a sphere. While it can be in state 0 (North Pole) or state 1 (South Pole), it can also be anywhere else on the sphere surface. This is because a qubit can exist in a superposition of both 0 and 1 at the same time.',
      'To understand this, imagine a coin lying on a table. It is either showing Heads (0) or Tails (1) – this is classical. Now, spin the coin. While it is spinning, it is a blur of both Heads and Tails. This spinning state is quantum superposition.'
    ],
    advancedContent: [
      'A classical bit represents a binary state $b \\in \\{0, 1\\}$. A quantum bit is a vector $|\\psi\\rangle$ residing in a two-dimensional complex Vector Space (Hilbert space $\\mathcal{H} \\cong \\mathbb{C}^2$).',
      'The computational basis states $|0\\rangle$ and $|1\\rangle$ are orthogonal unit vectors: $|0\\rangle = \\begin{pmatrix} 1 \\\\ 0 \\end{pmatrix}$ and $|1\\rangle = \\begin{pmatrix} 0 \\\\ 1 \\end{pmatrix}$.',
      'Any state $|\\psi\\rangle$ is a linear combination of these basis vectors: $|\\psi\\rangle = \\alpha|0\\rangle + \\beta|1\\rangle$, where the coefficients $\\alpha, \\beta \\in \\mathbb{C}$ satisfy $|\\alpha|^2 + |\\beta|^2 = 1$. The complex coefficients allow qubits to experience wave-like constructive and destructive interference.'
    ],
    takeaways: [
      'Classical bits are strictly binary (0 or 1).',
      'Qubits can represent a blend of both states simultaneously.',
      'Superposition expands classical computational limits.'
    ],
    interactivePreset: {
      label: 'Interactive Sandbox Exercise: Initial Qubit State',
      description: 'The qubit is currently at state |0⟩. Observe how the probability of |0⟩ is 100% and Z coordinate is 1.000.',
      gates: []
    }
  },
  {
    id: 2,
    title: '2. Understanding the Bloch Sphere',
    description: 'Learn how we map complex quantum states onto a 3D unit sphere.',
    beginnerContent: [
      'The Bloch Sphere is a 3D map of a qubit\'s possible states. The orange arrow represents the qubit\'s current state vector.',
      'Under this mapping, the North Pole represents state |0⟩ and the South Pole represents state |1⟩. The equator represents states that are equal parts |0⟩ and |1⟩.',
      'You can rotate the sphere to look at it from different angles. Notice that moving from the North Pole to the South Pole corresponds to changing the measurement probability, while rotating around the equator changes the relative phase (timing) of the state.'
    ],
    advancedContent: [
      'The state vector of a qubit, up to a global phase, can be parameterized by two angles: polar angle $\\theta \\in [0, \\pi]$ and azimuthal angle $\\phi \\in [0, 2\\pi]$: $|\\psi\\rangle = \\cos(\\theta/2)|0\\rangle + e^{i\\phi}\\sin(\\theta/2)|1\\rangle$.',
      'The Bloch vector components are given by the expectation values of the Pauli operators: $x = \\langle\\psi|X|\\psi\\rangle = \\sin\\theta\\cos\\phi$, $y = \\langle\\psi|Y|\\psi\\rangle = \\sin\\theta\\sin\\phi$, and $z = \\langle\\psi|Z|\\psi\\rangle = \\cos\\theta$.',
      'The length of the Bloch vector for any pure state is always $r = \\sqrt{x^2 + y^2 + z^2} = 1$. Mixed states, which represent statistical ensembles (e.g. thermal state mixtures), lie inside the sphere ($r < 1$).'
    ],
    takeaways: [
      'North pole is |0⟩; South pole is |1⟩.',
      'Equator lines correspond to 50/50 superpositions.',
      'Latitude governs probability; longitude governs relative phase.'
    ],
    interactivePreset: {
      label: 'Interactive Exercise: The Superposition Equator',
      description: 'Apply the Hadamard (H) gate to move the state vector to the equator. Watch the Z coordinate become 0.000.',
      gates: [{ type: 'H', name: 'H' }]
    }
  },
  {
    id: 3,
    title: '3. Quantum Gates',
    description: 'Learn how unitary operators rotate the state vector on the Bloch sphere.',
    beginnerContent: [
      'Quantum gates are like instructions for the qubit. They are the counterpart to classical logic gates (like AND, OR, NOT) but they preserve quantum superposition.',
      'Applying a gate rotates the state vector along a specific path on the sphere. For example, applying the X gate rotates the qubit 180 degrees around the X-axis, flipping it from 0 to 1.',
      'Applying the Hadamard (H) gate tilts the qubit, converting a definite state into a 50/50 superposition state. Explore other gates to see how they rotate the vector.'
    ],
    advancedContent: [
      'Quantum gates are represented by $2 \\times 2$ unitary operators $U$ acting on the state: $|\\psi\'\\rangle = U|\\psi\\rangle$. Unitary matrices satisfy $U^\\dagger U = I$, which guarantees they preserve the vector norm (probability normalization).',
      'Geometrically, unitary operators correspond to rotations in the 3D Bloch space. For example, a rotation around axis $\\vec{n}$ by angle $\\theta$ is represented by $R_{\\vec{n}}(\\theta) = \\exp(-i\\theta \\vec{n} \\cdot \\vec{\\sigma}/2)$, where $\\vec{\\sigma} = (X, Y, Z)$ are the Pauli matrices.',
      'Because they represent rotations, all quantum gates are reversible: applying the inverse unitary gate $U^\\dagger$ returns the qubit to its original state.'
    ],
    takeaways: [
      'Quantum gates rotate the state vector on the Bloch sphere.',
      'Gates are represented by unitary matrices.',
      'All quantum operations are reversible.'
    ],
    interactivePreset: {
      label: 'Interactive Exercise: Reversibility test',
      description: 'Apply Hadamard (H) twice. Observe how the second H reverses the first, returning the vector to |0⟩.',
      gates: [{ type: 'H', name: 'H' }, { type: 'H', name: 'H' }]
    }
  },
  {
    id: 4,
    title: '4. Superposition',
    description: 'Explore the state of superposition and how it behaves.',
    beginnerContent: [
      'Superposition is the core mechanic of quantum computing speed. It allows a qubit to represent multiple possibilities at once.',
      'A 50/50 superposition state is located on the equator of the Bloch sphere. At this position, there is a exactly equal probability (50% |0⟩ and 50% |1⟩) of the qubit collapsing to either state upon measurement.',
      'Although the probabilities are 50/50, these states are not identical. They can have different relative phases (longitudes on the sphere). The state |+⟩ (on positive X) and |i+⟩ (on positive Y) are both superpositions, but represent different phases.'
    ],
    advancedContent: [
      'The states $|+\rangle = \\frac{|0\\rangle + |1\\rangle}{\\sqrt{2}}$ and $|-\\rangle = \\frac{|0\\rangle - |1\\rangle}{\\sqrt{2}}$ are the eigenstates of the Pauli-X operator, corresponding to Bloch vectors $(1, 0, 0)$ and $(-1, 0, 0)$.',
      'The states $|i+\rangle = \\frac{|0\\rangle + i|1\\rangle}{\\sqrt{2}}$ and $|i-\\rangle = \\frac{|0\\rangle - i|1\\rangle}{\\sqrt{2}}$ are the eigenstates of the Pauli-Y operator, corresponding to Bloch vectors $(0, 1, 0)$ and $(0, -1, 0)$.',
      'Superposition is not a random mixture. In a random mixture (mixed state), relative phase details are lost. In a superposition (pure state), the phase coefficients allow the qubit to participate in interference, which is key to quantum speedups.'
    ],
    takeaways: [
      'Superposition represents coexisting computation paths.',
      'Superposition states are pure states, maintaining phase details.',
      'Varying phases on the equator enable quantum interference.'
    ],
    interactivePreset: {
      label: 'Interactive Exercise: Phase Superpositions',
      description: 'Apply Hadamard (H) and then S to create the phase state |i+⟩. Observe how the vector points along the positive Y-axis.',
      gates: [{ type: 'H', name: 'H' }, { type: 'S', name: 'S' }]
    }
  },
  {
    id: 5,
    title: '5. Measurement',
    description: 'Discover how observation collapses superposition into classical information.',
    beginnerContent: [
      'A qubit inside a quantum computer can stay in a superposition blur as long as it is isolated. However, to read the result of our calculation, we must measure the qubit.',
      'Measuring a qubit forces it to make a choice. It instantly collapses out of superposition, aligning itself with either the North Pole (|0⟩) or the South Pole (|1⟩) based on the current probabilities.',
      'Once a qubit is measured and collapses, its original superposition and relative phase are destroyed. It becomes a classical bit.'
    ],
    advancedContent: [
      'According to the projection postulate, measuring a qubit in the computational basis $\\{|0\\rangle, |1\\rangle\\}$ applies projection operators $P_0 = |0\\rangle\\langle0|$ and $P_1 = |1\\rangle\\langle1|$.',
      'The probability of outcome $i \\in \\{0, 1\\}$ is $P(i) = \\langle\\psi|P_i|\\psi\\rangle$. If outcome $i$ is observed, the state collapses to $|\\psi\'\\rangle = \\frac{P_i|\\psi\\rangle}{\\sqrt{P(i)}}$.',
      'This collapse is non-unitary and irreversible. It destroys relative phase details ($\\phi$), converting quantum information into classical data bits.'
    ],
    takeaways: [
      'Measurement forces a superposition state to collapse.',
      'Collapse probability is proportional to amplitude squared.',
      'Measurement is irreversible and destroys phase information.'
    ],
    interactivePreset: {
      label: 'Interactive Exercise: Test State Collapse',
      description: 'Apply H to create a 50/50 superposition, then simulate measurement. Watch the state vector collapse to either |0⟩ or |1⟩.',
      gates: [{ type: 'H', name: 'H' }]
    }
  },
  {
    id: 6,
    title: '6. Experiment Yourself',
    description: 'Launch the simulator and experiment with complex sequences.',
    beginnerContent: [
      'Now that you understand qubits, the Bloch sphere, gates, superposition, and measurement, you are ready to experiment!',
      'Use the Workspace simulator to build custom sequences. Try to rotate the vector to a specific location, or test custom gate combinations.',
      'Press the button below to launch the Workspace and start your quantum sandbox journey.'
    ],
    advancedContent: [
      'You are now equipped to verify quantum transforms in the laboratory sandbox.',
      'Try constructing arbitrary rotations using Euler sequences, such as combining $R_z(\\phi) R_y(\\theta) R_z(\\lambda)$ to reach any arbitrary point on the sphere surface.',
      'Press the button below to launch the Workspace and begin your engineering sandbox tests.'
    ],
    takeaways: [
      'Unitary transformations preserve the Bloch vector length ($r=1$).',
      'Any single-qubit gate sequence can be mapped as a single combined rotation.',
      'Practice builds intuition for phase-tuning and state rotation.'
    ]
  }
];
export default LEARN_CHAPTERS;
