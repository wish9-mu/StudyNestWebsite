import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import "./ResetPassword.css";
import Nav from "../Nav/Nav";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    email: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!formData.email) {
      setError("Please enter your email.");
      return;
    }

    try {
      // Step 1: Request a password reset link
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        formData.email
      );

      if (resetError) {
        setError("Failed to send reset email. Please try again.");
        return;
      }

      setMessage("Password reset link sent to your email. Please check your inbox.");
      navigate("/login");

    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="reset-password-container">
      <Nav />
      <div className="reset-password-card">
        <h1>Forgot Your Password?</h1>

        {error && <p className="error-message">{error}</p>}
        {message && <p className="success-message">{message}</p>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Enter your email to receive a password reset link.</label>
            <input
              type="email"
              name="email"
              placeholder="Input your Mapua email..."
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="reset-button">
            Send Reset Link
          </button>
        </form>

        <div className="form-footer">
          <span className="back-to-login" onClick={() => navigate("/login")}>
            Back to Login
          </span>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
