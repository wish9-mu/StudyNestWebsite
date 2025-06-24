  import React, { useState } from "react";
import { data, useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import "./Login.css";
import Nav from "../Nav/Nav";

const LoginPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
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

    // Authenticate user
    try {

      // Sign in with email and password
      const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

      if (authError || !authData.user) {
        setError(
          "Login failed: " + (authError?.message || "Invalid credentials")
        );
        return;
      } else {
        console.log("Login successful");
      }

      const userId = authData.user.id;
      await trackUserSession(userId);

      // Fetch user's role from Supabase profiles table
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("email", formData.email)
        .single();

      if (profileError || !profileData) {
        setError(
          "Error fetching user profile: " +
            (profileError?.message || "Profile not found")
        );
        return;
      } 
      
    } catch (error) {
      console.error("Unexpected error:", error);
      setError("An unexpected error occurred. Please try again.");
    }
  };

  const handleRegisterClick = () => {
    navigate("/register");
  };

  const trackUserSession = async (userId) => {
    const timestamp = new Date().toISOString();

    // Fetch current session history
    const { data, error } = await supabase
      .from("profiles")
      .select("session_history")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("❌ Error fetching session history:", error);
      return;
    }

    const currentHistory = data?.session_history || [];

    // Add new session entry
    const updatedHistory = [
      ...currentHistory,
      { login_time: timestamp, device: "Web App" },
    ];

    // Update session history in Supabase
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ session_history: updatedHistory })
      .eq("id", userId);

    if (updateError) {
      console.error("❌ Error updating session history:", updateError);
    } else {
      console.log("✅ Session history updated successfully!");
    }
  };

  return (
    <div className="login-container">
      <Nav />
      <div className="login-card">
        <h1>Share. Learn. Grow</h1>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Input your Mapua email..."
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Password..."
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-footer">
            <span className="register-link" onClick={handleRegisterClick}>
              Not yet registered?
            </span>
          </div>

          <div className="form-footer">
            <span className="register-link" onClick={() => navigate("/forgotpassword")}>
              Forgot your password?
            </span>
          </div>

          <button type="submit" className="login-button">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
