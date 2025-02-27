import React, { useState } from "react";
import "./Register.css";
import { supabase } from "../../client";

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    studentNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "", 
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
  
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }
  
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }
  
    if (!formData.studentNumber.trim()) {
      newErrors.studentNumber = "Student number is required";
    }
  
    // if (!formData.email.trim()) {
    //   newErrors.email = "Email is required";
    // } else if (!/^[a-zA-Z0-9._%+-]+@mymail\.mapua\.edu\.ph$/.test(formData.email)) {
    //   newErrors.email = "Please enter a valid Mapua email (@mymail.mapua.edu.ph)";
    // }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
  
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
  
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
 
    if (!formData.role) {
      newErrors.role = "Please select a role";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
  
    if (Object.keys(newErrors).length === 0) {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });
  
      if (error) {
        if (error.message.includes("duplicate key value violates unique constraint")) {
          setErrors({ email: "Email is already registered" });
          return;
        } else {
          setErrors({ email: error.message });
          return;
        }
      }

      const { user } = data;
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .insert([
          {
            id: user.id,
            first_name: formData.firstName,
            last_name: formData.lastName,
            student_number: formData.studentNumber,
            role: formData.role,
            email: formData.email,
          },
        ]);
      
      if (profileError) {
        console.error("Error creating profile:", profileError.message);
        return;
      }

      alert("Registration successful! Please check your email to verify your account.");
      window.location.href = "/login";

    } else {
      setErrors(newErrors);
    }
  };
  

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h1>Be part of the nest.</h1>

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
              />
              {errors.firstName && <p className="error">{errors.firstName}</p>}
            </div>

            <div className="form-group">
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
              />
              {errors.lastName && <p className="error">{errors.lastName}</p>}
            </div>
          </div>

          <div className="form-group">
            <input
              type="text"
              name="studentNumber"
              placeholder="Student Number"
              value={formData.studentNumber}
              onChange={handleChange}
            />
            {errors.studentNumber && (
              <p className="error">{errors.studentNumber}</p>
            )}
          </div>

          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <p className="error">{errors.email}</p>}
          </div>

          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && <p className="error">{errors.password}</p>}
          </div>

          <div className="form-group">
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            {errors.confirmPassword && (
              <p className="error">{errors.confirmPassword}</p>
            )}
          </div>

          <div className="form-group">
            <label>Role:</label>
            <div className="role-options">
              <label>
                <input
                  type="radio"
                  name="role"
                  value="tutee"
                  checked={formData.role === "tutee"}
                  onChange={handleChange}
                />
                Tutee
              </label>
              <label>
                <input
                  type="radio"
                  name="role"
                  value="tutor"
                  checked={formData.role === "tutor"}
                  onChange={handleChange}
                />
                Tutor
              </label>
            </div>
          </div>

          <button type="submit">Register</button>
        </form>
      </div>
    </div>
  );
};

export default Register;
