import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { supabase } from "../../client";
import "./Login.css";

const LoginPage = () => {
  const navigate = useNavigate(); 

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
    console.log("Login attempted with:", formData);

    // Authenticate user
    const { data: authData, error: authError } = supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    });

    if (authError) {
      alert("Login failed:" + authError.message);
      return;
    }

    // Fetch user's role from Supabase profiles table
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("email", formData.email)
      .single();

    if (profileError || !profileData) {
      alert("Error fetching user profile:" + profileError.message);
      return;
    }

    // Redirect user based on role
    const userRole = profileData.role;

    if (userRole === "admin") {
      navigate("/adminhome");
    } else if (userRole === "tutor") {
      navigate("/tutorhome");
    } else if (userRole === "tutee") {
      navigate("/tuteehome");
    } else {
      alert("Invalid role. Contact support.");
    }
    
  };

  const handleRegisterClick = () => {
    navigate("/register");
  };

  return (
    <div className="login-container">
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

          <button type="submit" className="login-button">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
