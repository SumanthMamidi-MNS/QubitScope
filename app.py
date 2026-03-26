# =============================================================================
# QubitScope – Interactive Quantum State Visual Simulator
# =============================================================================
# Stack: Python | Streamlit | Qiskit | Plotly | NumPy
# Run with: streamlit run app.py
# =============================================================================

import numpy as np
import streamlit as st
import plotly.graph_objects as go
from qiskit.quantum_info import Statevector, Operator

# =============================================================================
# PAGE CONFIGURATION
# =============================================================================
st.set_page_config(
    page_title="QubitScope – Quantum Visual Simulator",
    page_icon="⚛️",
    layout="wide",
)

# =============================================================================
# SESSION STATE INITIALISATION
# Streamlit reruns the script on every interaction, so we use st.session_state
# to persist our quantum state and gate history across reruns.
# =============================================================================
if "statevector" not in st.session_state:
    # |0⟩ state = [1, 0] as a column vector
    st.session_state.statevector = Statevector([1, 0])

if "gate_history" not in st.session_state:
    st.session_state.gate_history = []   # list of gate name strings

# =============================================================================
# QUANTUM GATE DEFINITIONS (as 2×2 unitary matrices)
# =============================================================================
# Pauli-X (NOT gate) – flips |0⟩ ↔ |1⟩
X_MATRIX = np.array([[0, 1],
                      [1, 0]], dtype=complex)

# Hadamard gate – creates superposition from |0⟩ or |1⟩
H_MATRIX = (1 / np.sqrt(2)) * np.array([[1,  1],
                                          [1, -1]], dtype=complex)

# Pauli-Z gate – applies a phase flip: |1⟩ → -|1⟩
Z_MATRIX = np.array([[1,  0],
                      [0, -1]], dtype=complex)

# =============================================================================
# HELPER FUNCTIONS
# =============================================================================

def apply_gate(matrix: np.ndarray, gate_name: str) -> None:
    """Apply a quantum gate to the current statevector and record it."""
    op = Operator(matrix)
    st.session_state.statevector = st.session_state.statevector.evolve(op)
    st.session_state.gate_history.append(gate_name)


def reset_state() -> None:
    """Reset the qubit back to the ground state |0⟩."""
    st.session_state.statevector = Statevector([1, 0])
    st.session_state.gate_history = []


def get_amplitudes():
    """Return complex amplitudes α (for |0⟩) and β (for |1⟩)."""
    data = st.session_state.statevector.data   # numpy array [α, β]
    alpha = data[0]
    beta  = data[1]
    return alpha, beta


def get_bloch_vector(alpha: complex, beta: complex) -> tuple:
    """
    Convert statevector amplitudes to Bloch sphere (x, y, z) coordinates.

    The Bloch vector components are:
        x = 2 · Re(α · β*)
        y = 2 · Im(α · β*)   ← note: Im(α·β*) not Im(α*·β)
        z = |α|² − |β|²
    """
    x = 2 * np.real(alpha * np.conj(beta))
    y = 2 * np.imag(alpha * np.conj(beta))
    z = (np.abs(alpha) ** 2) - (np.abs(beta) ** 2)
    return float(x), float(y), float(z)


def build_bloch_sphere(bx: float, by: float, bz: float) -> go.Figure:
    """
    Build and return a Plotly 3D figure showing the Bloch sphere and
    the current state vector.
    """
    # ── Sphere surface ────────────────────────────────────────────────────────
    theta = np.linspace(0, np.pi,   40)   # polar angle
    phi   = np.linspace(0, 2*np.pi, 40)   # azimuthal angle
    THETA, PHI = np.meshgrid(theta, phi)

    SX = np.sin(THETA) * np.cos(PHI)
    SY = np.sin(THETA) * np.sin(PHI)
    SZ = np.cos(THETA)

    sphere = go.Surface(
        x=SX, y=SY, z=SZ,
        opacity=0.12,
        colorscale=[[0, "#4FC3F7"], [1, "#4FC3F7"]],
        showscale=False,
        hoverinfo="skip",
        name="Bloch Sphere",
    )

    # ── Wireframe circles (equator + two meridians) ───────────────────────────
    circle_t = np.linspace(0, 2 * np.pi, 100)
    wire_kwargs = dict(mode="lines", line=dict(color="#78909C", width=1),
                       showlegend=False, hoverinfo="skip")

    equator   = go.Scatter3d(x=np.cos(circle_t), y=np.sin(circle_t),
                              z=np.zeros_like(circle_t), **wire_kwargs)
    meridian1 = go.Scatter3d(x=np.cos(circle_t), y=np.zeros_like(circle_t),
                              z=np.sin(circle_t), **wire_kwargs)
    meridian2 = go.Scatter3d(x=np.zeros_like(circle_t), y=np.cos(circle_t),
                              z=np.sin(circle_t), **wire_kwargs)

    # ── Axes (X, Y, Z) ────────────────────────────────────────────────────────
    axis_len = 1.35
    def make_axis(x0, y0, z0, x1, y1, z1, color, label, lx, ly, lz):
        line = go.Scatter3d(
            x=[x0, x1], y=[y0, y1], z=[z0, z1],
            mode="lines",
            line=dict(color=color, width=4),
            showlegend=False, hoverinfo="skip",
        )
        tip = go.Scatter3d(
            x=[lx], y=[ly], z=[lz],
            mode="text",
            text=[label],
            textfont=dict(size=14, color=color),
            showlegend=False, hoverinfo="skip",
        )
        return line, tip

    x_line, x_tip = make_axis(-axis_len, 0, 0,  axis_len, 0, 0,
                               "#EF5350", "X",  axis_len + 0.07, 0, 0)
    y_line, y_tip = make_axis(0, -axis_len, 0,  0,  axis_len, 0,
                               "#66BB6A", "Y",  0,  axis_len + 0.07, 0)
    z_line, z_tip = make_axis(0, 0, -axis_len,  0,  0,  axis_len,
                               "#42A5F5", "Z",  0,  0,  axis_len + 0.1)

    # Pole labels
    pole_labels = go.Scatter3d(
        x=[0, 0], y=[0, 0], z=[1.15, -1.15],
        mode="text",
        text=["|0⟩", "|1⟩"],
        textfont=dict(size=13, color="#B0BEC5"),
        showlegend=False, hoverinfo="skip",
    )

    # ── State vector arrow ────────────────────────────────────────────────────
    # Cone at the tip of the vector to mimic an arrowhead
    vector_line = go.Scatter3d(
        x=[0, bx], y=[0, by], z=[0, bz],
        mode="lines",
        line=dict(color="#FF6F00", width=6),
        name="State |ψ⟩",
    )

    cone = go.Cone(
        x=[bx], y=[by], z=[bz],
        u=[bx * 0.25], v=[by * 0.25], w=[bz * 0.25],
        sizemode="absolute",
        sizeref=0.18,
        colorscale=[[0, "#FF6F00"], [1, "#FF6F00"]],
        showscale=False,
        hovertemplate=(
            f"<b>Bloch Vector</b><br>"
            f"x = {bx:.3f}<br>y = {by:.3f}<br>z = {bz:.3f}<extra></extra>"
        ),
        name="State arrow",
    )

    # ── Assemble figure ───────────────────────────────────────────────────────
    fig = go.Figure(data=[
        sphere,
        equator, meridian1, meridian2,
        x_line, x_tip,
        y_line, y_tip,
        z_line, z_tip,
        pole_labels,
        vector_line, cone,
    ])

    fig.update_layout(
        title=dict(
            text="Bloch Sphere",
            x=0.5,
            font=dict(size=18, color="#E0E0E0"),
        ),
        paper_bgcolor="#0E1117",
        plot_bgcolor="#0E1117",
        scene=dict(
            bgcolor="#0E1117",
            xaxis=dict(showbackground=False, showticklabels=False,
                       zeroline=False, title=""),
            yaxis=dict(showbackground=False, showticklabels=False,
                       zeroline=False, title=""),
            zaxis=dict(showbackground=False, showticklabels=False,
                       zeroline=False, title=""),
            aspectmode="cube",
            camera=dict(eye=dict(x=1.4, y=1.4, z=0.8)),
        ),
        margin=dict(l=0, r=0, t=40, b=0),
        height=520,
        showlegend=False,
    )

    return fig


# =============================================================================
# MAIN UI
# =============================================================================

# ── Title ─────────────────────────────────────────────────────────────────────
st.markdown(
    "<h1 style='text-align:center; color:#4FC3F7;'>⚛️ QubitScope</h1>"
    "<h3 style='text-align:center; color:#B0BEC5; margin-top:-12px;'>"
    "Interactive Quantum State Visual Simulator</h3>",
    unsafe_allow_html=True,
)
st.markdown("---")

# ── Sidebar – gate controls ───────────────────────────────────────────────────
with st.sidebar:
    st.markdown("## 🎛️ Quantum Gate Controls")
    st.markdown(
        "Apply gates to transform the qubit state. "
        "The Bloch sphere updates instantly."
    )
    st.markdown("---")

    if st.button("⚡ Apply X Gate  (Pauli-X / NOT)", use_container_width=True):
        apply_gate(X_MATRIX, "X")

    st.markdown(
        "<small style='color:#90A4AE;'>Flips |0⟩ ↔ |1⟩ (quantum NOT gate)</small>",
        unsafe_allow_html=True,
    )
    st.markdown(" ")

    if st.button("🌀 Apply Hadamard Gate", use_container_width=True):
        apply_gate(H_MATRIX, "H")

    st.markdown(
        "<small style='color:#90A4AE;'>Creates equal superposition of |0⟩ and |1⟩</small>",
        unsafe_allow_html=True,
    )
    st.markdown(" ")

    if st.button("🔄 Apply Z Gate  (Pauli-Z)", use_container_width=True):
        apply_gate(Z_MATRIX, "Z")

    st.markdown(
        "<small style='color:#90A4AE;'>Phase flip: |1⟩ → −|1⟩ (no visible change on |0⟩)</small>",
        unsafe_allow_html=True,
    )
    st.markdown("---")

    if st.button("🔁 Reset to |0⟩", use_container_width=True, type="primary"):
        reset_state()

    st.markdown("---")
    st.markdown("### 📖 Quick Legend")
    st.markdown(
        "- **North pole** = |0⟩\n"
        "- **South pole** = |1⟩\n"
        "- **Equator**    = superposition\n"
        "- **Orange arrow** = current state"
    )

# ── Compute current state info ────────────────────────────────────────────────
alpha, beta = get_amplitudes()
bx, by, bz  = get_bloch_vector(alpha, beta)

prob_0 = float(np.abs(alpha) ** 2)   # probability of measuring |0⟩
prob_1 = float(np.abs(beta)  ** 2)   # probability of measuring |1⟩

# ── Layout: two columns (Bloch sphere | state info) ───────────────────────────
col_bloch, col_info = st.columns([3, 2], gap="large")

# ── LEFT: Bloch Sphere ────────────────────────────────────────────────────────
with col_bloch:
    fig = build_bloch_sphere(bx, by, bz)
    st.plotly_chart(fig, use_container_width=True, config={"displayModeBar": False})

# ── RIGHT: State info ─────────────────────────────────────────────────────────
with col_info:

    # ── Dirac notation ────────────────────────────────────────────────────────
    st.markdown("### 🧮 Current Quantum State")

    # Round for display (keeping 3 significant figures)
    def fmt(c: complex) -> str:
        """Format a complex number nicely for display."""
        r, i = round(c.real, 3), round(c.imag, 3)
        if i == 0:
            return str(r)
        sign = "+" if i >= 0 else "-"
        return f"{r} {sign} {abs(i)}i"

    alpha_str = fmt(alpha)
    beta_str  = fmt(beta)

    st.markdown(
        f"<div style='"
        f"background:#1E2A3A; border-radius:10px; padding:16px 20px;"
        f"border-left:4px solid #4FC3F7; margin-bottom:16px;'>"
        f"<p style='font-size:22px; color:#E0E0E0; margin:0;'>"
        f"|ψ⟩ = <span style='color:#4FC3F7;'>{alpha_str}</span>|0⟩ "
        f"+ <span style='color:#FF8A65;'>{beta_str}</span>|1⟩</p>"
        f"<p style='font-size:12px; color:#78909C; margin:6px 0 0 0;'>"
        f"α = {alpha_str} &nbsp;&nbsp; β = {beta_str}</p>"
        f"</div>",
        unsafe_allow_html=True,
    )

    # ── Measurement probabilities ─────────────────────────────────────────────
    st.markdown("### 📊 Measurement Probabilities")

    col_p0, col_p1 = st.columns(2)
    with col_p0:
        st.metric(label="P( |0⟩ )", value=f"{prob_0 * 100:.1f}%")
    with col_p1:
        st.metric(label="P( |1⟩ )", value=f"{prob_1 * 100:.1f}%")

    # Progress bars as visual aid
    st.markdown(
        f"<div style='margin-top:6px;'>"
        f"<p style='color:#B0BEC5; margin-bottom:2px; font-size:13px;'>|0⟩</p>",
        unsafe_allow_html=True,
    )
    st.progress(prob_0)
    st.markdown(
        "<p style='color:#B0BEC5; margin-bottom:2px; font-size:13px;'>|1⟩</p>",
        unsafe_allow_html=True,
    )
    st.progress(prob_1)

    # ── Bloch vector coordinates ──────────────────────────────────────────────
    st.markdown("### 📍 Bloch Vector")
    cv1, cv2, cv3 = st.columns(3)
    cv1.metric("x", f"{bx:.3f}")
    cv2.metric("y", f"{by:.3f}")
    cv3.metric("z", f"{bz:.3f}")

    # ── Gate history ──────────────────────────────────────────────────────────
    st.markdown("### 🕐 Gate History")
    if st.session_state.gate_history:
        history_str = " → ".join(st.session_state.gate_history)
        st.markdown(
            f"<div style='"
            f"background:#1E2A3A; border-radius:8px; padding:12px 16px;"
            f"border-left:4px solid #66BB6A;'>"
            f"<p style='color:#A5D6A7; font-size:15px; margin:0; "
            f"word-break:break-word;'>{history_str}</p>"
            f"</div>",
            unsafe_allow_html=True,
        )
        st.markdown(
            f"<p style='color:#78909C; font-size:12px; margin-top:6px;'>"
            f"Total gates applied: {len(st.session_state.gate_history)}</p>",
            unsafe_allow_html=True,
        )
    else:
        st.markdown(
            "<div style='background:#1E2A3A; border-radius:8px; "
            "padding:12px 16px; border-left:4px solid #546E7A;'>"
            "<p style='color:#78909C; margin:0;'>No gates applied yet.</p>"
            "</div>",
            unsafe_allow_html=True,
        )

# ── Footer ─────────────────────────────────────────────────────────────────────
st.markdown("---")
st.markdown(
    "<p style='text-align:center; color:#546E7A; font-size:13px;'>"
    "QubitScope · Built with Streamlit · Qiskit · Plotly &nbsp;|&nbsp; "
    "Quantum states are simulated using exact statevector evolution"
    "</p>",
    unsafe_allow_html=True,
)