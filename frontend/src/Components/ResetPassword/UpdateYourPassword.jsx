import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import "./ResetPassword.css";
import PasswordNav from "../Nav/PasswordNav";

const UpdateYourPassword = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
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

  const validateForm = () => {
    const { email, password } = formData;

    // if (!email.endsWith("@mymapua.edu.ph")) {
    //   setError("Email must be a valid @mymapua.edu.ph address.");
    //   return false;
    // }
    if (!email) {
      setError("Please enter your email.");
      return false;
    } 

    if (!email.endsWith("@gmail.com")) {
      setError("Email must be a valid @gmail.com address.");
      return false;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!validateForm()) return;

    try {
      // Updating user's password
      const { error: updateError } = await supabase.auth.updateUser({
        password: formData.password,
      });

      if (updateError) {
        setError("Failed to update password. Please try again.");
      } else {
        alert("Password successfully updated!");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="reset-password-container">
      <PasswordNav />
      <div className="reset-password-card">
        <h1>Enter Your New Password</h1>
        <p>Update your email or your password.</p>

        {error && <p className="error-message">{error}</p>}
        {message && <p className="success-message">{message}</p>}

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
            <label>New Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter new password..."
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="reset-button">
            Submit
          </button>
        </form>

      </div>
    </div>
  );
};

export default UpdateYourPassword;
