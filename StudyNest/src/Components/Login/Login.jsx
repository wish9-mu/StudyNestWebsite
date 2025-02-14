import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Add this import
import "./Login.css";

const LoginPage = () => {
  const navigate = useNavigate(); // Add this hook
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

  //Mali to, dont mind this muna
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
    console.log("Login attempted with:", formData);

    // Add basic validation
    if (formData.email && formData.password) {
      // You would typically verify credentials here

      //Mali to, dont mind the links muna
      // After successful login, navigate to tutor-home
      navigate("/tutor-home");
    }
  };

  return (
    <div className="login-container">
      {/* Login Card */}
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
            <a href="/register" className="register-link">
              Not yet registered?
            </a>
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
