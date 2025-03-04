import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import "./Login.css";
import Nav from "../Nav/Nav";
import { useAuth } from "./AuthContext";

const LoginPage = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [error, setError] = useState("");
  const [errorLayout, setErrorLayout] = useState("");

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

    setErrorLayout("");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Authenticate user
    try {
      console.log("Login attempted with:", formData);

      // Sign in with email and password
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (authData.user && !authData.user.email_confirmed_at) {
        setError("Please confirm your email before logging in. Check your inbox for the confirmation link.");
        console.log("Auth response:", { data: authData, error: authError });
        return;
      }
      else if (!authData.user || !authData) {
        setError("Login failed: Invalid credentials");
        console.log("Auth response:", { data: authData, error: authError });
        return;
      } else if (authError) {
        setError("Login failed: " + (authError?.message || "Authentication error"));
        console.log("Auth response:", { data: authData, error: authError });
        return;
      } else {
        console.log("Login successful:", authData.user);  
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
        setError("Error fetching user profile: " + (profileError?.message || "Profile not found"));
        return;
      } else {
        console.log("Profile data:", profileData);
      }

      // Redirect user based on role
      const userRole = profileData.role;

      // Save user session
      setUser({ id: userId, email: formData.email, role: userRole });

      if (userRole === "admin") {
        navigate("/adminhome");
      } else if (userRole === "tutor") {
        navigate("/tutorhome");
      } else if (userRole === "tutee") {
        navigate("/tuteehome");
      } else {
        alert("Invalid role. Contact support.");
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
  
  useEffect(() => {
    if (error) {
      setErrorLayout("error");
    }
  }, [error]);

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
              className={`input ${errorLayout}`}
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
              className={`input ${errorLayout}`}
            />
            </div>
          

          {error && <p className="login-feedback">{error}</p>}

          <div className="form-footer">
            <span className="register-link" onClick={handleRegisterClick}>
              Not yet registered?
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
