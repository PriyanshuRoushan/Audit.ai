import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Client");
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  // ✅ IMPORTANT: backend URL from env
  const API = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post(
        `${API}/api/auth/register`,
        {
          name,
          email,
          password,
          role,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // save auth data
      login(res.data.token, res.data.user);

      // redirect after success
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.error || "Registration failed. Try again."
      );
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#0f172a",
        color: "#f8fafc",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "400px",
          padding: "40px",
          backgroundColor: "#1e293b",
          borderRadius: "16px",
        }}
      >
        <h1 style={{ textAlign: "center", color: "#8b5cf6" }}>
          Audit.ai
        </h1>

        <p style={{ textAlign: "center", color: "#94a3b8" }}>
          Create your account
        </p>

        {error && (
          <div
            style={{
              background: "#7f1d1d",
              color: "#fca5a5",
              padding: "10px",
              borderRadius: "8px",
              marginTop: "10px",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={inputStyle}
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={inputStyle}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={inputStyle}
          />

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            style={inputStyle}
          >
            <option value="Client">Client</option>
            <option value="Auditor">Auditor</option>
            <option value="Admin">Admin</option>
          </select>

          <button type="submit" style={buttonStyle}>
            Register
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "15px" }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "#8b5cf6" }}>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

// reusable styles
const inputStyle = {
  width: "100%",
  padding: "12px",
  marginTop: "10px",
  borderRadius: "8px",
  border: "1px solid #334155",
  background: "#0f172a",
  color: "white",
};

const buttonStyle = {
  width: "100%",
  padding: "12px",
  marginTop: "15px",
  background: "#8b5cf6",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
};