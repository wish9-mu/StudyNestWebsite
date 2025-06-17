//Registration successful msg put to modal if possible.

import React, { useState } from "react";
import "./Register.css";
import "../Modal/Modal.css";
import { supabase } from "../../supabaseClient";
import Nav from "../Nav/Nav";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    studentNumber: "",
    mobileNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [hasDuplicate, setHasDuplicate] = useState(false);
  const [showModal, setShowModal] = useState("");
  const [isChecked, setChecked] = useState(false);
  const [showPrivacyModal, setPrivacyModal] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";

    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";

    if (!formData.studentNumber.trim()) {
      newErrors.studentNumber = "Student number is required";
    } else if (!/^(2\d{9})$/.test(formData.studentNumber)) {
      newErrors.studentNumber = "Enter a valid student number";
    }

    if (!formData.mobileNumber.trim()) {
      newErrors.mobileNumber = "Mobile number is required";
    } else if (!/^(9\d{9})$/.test(formData.mobileNumber)) {
      newErrors.mobileNumber = "Enter a valid 10-digit PH mobile number";
    }

    // if (!formData.email.trim()) {
    //   newErrors.email = "Email is required";
    // } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    //   newErrors.email = "Please enter a valid email";
    // }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[a-zA-Z0-9._%+-]+@mymail\.mapua\.edu\.ph$/.test(formData.email)) {
      newErrors.email = "Please enter a valid Mapua email (@mymail.mapua.edu.ph)";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.role) newErrors.role = "Please select a role";

    if (!isChecked)
      newErrors.dpa = "You have not agreed to the Data Privacy statement.";

    return newErrors;
  };

  const handleDuplicate = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length === 0) {
      try {
        //Double checks if email & student number is in use
        const { data: existingUsers, error: fetchError } = await supabase
          .from("profiles")
          .select("email, student_number")
          .or(
            `email.eq.${formData.email},student_number.eq.${formData.studentNumber}`
          );

        if (fetchError) {
          console.error("Error checking existing users:", fetchError.message);
          setMessage("Something went wrong. Please try again.");
          return;
        }

        if (existingUsers.length > 0) {
          setHasDuplicate(true);
          setShowModal("duplicate");
          return;
        }

        setHasDuplicate(false);
        handleSubmit(e);
      } catch (error) {
        console.error("Unexpected registration error:", error);
        setMessage("Something went wrong. Please try again.");
      }
    } else {
      setErrors(newErrors);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length === 0) {
      try {
        console.log("Attempting to register user...");

        // Register user with Supabase
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
        });

        console.log("Supabase response:", { data, error }); // Debugging

        if (error) {
          console.error("Registration error:", error.message);
          setErrors({ email: error.message });
          return;
        }

        if (data.user) {
          console.log("User created successfully:", data.user);

          // Insert additional user data into Supabase database
          const { error: dbError } = await supabase.from("profiles").insert([
            {
              id: data.user.id,
              first_name: formData.firstName,
              last_name: formData.lastName,
              student_number: formData.studentNumber,
              mobile_number: "0" + formData.mobileNumber,
              role: formData.role,
              email: formData.email,
            },
          ]);

          if (dbError) {
            console.error("Database insert error:", dbError.message);
            setErrors({ database: dbError.message });
            return;
          }

          setMessage(
            "Registration successful! Check your email to verify your account."
          );
          setTimeout(() => {
            navigate("/login");
          }, 3000);
        }
      } catch (error) {
        console.error("Unexpected registration error:", error);
        setMessage("Something went wrong. Please try again.");
      }
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <>
      <Nav />
      <div className="register">
        <div className="signup-container">
          <div className="signup-card">
            <h1 className="h1">Be part of the nest.</h1>

            {message && <p className="success">{message}</p>}

            {/* Pasok sa loob ng handleDuplicate yung handleSubmit*/}
            <form onSubmit={handleDuplicate}>
              <div className="form-row">
                <div className="form-group">
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                  {errors.firstName && (
                    <p className="error">{errors.firstName}</p>
                  )}
                </div>

                <div className="form-group">
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                  {errors.lastName && (
                    <p className="error">{errors.lastName}</p>
                  )}
                </div>
              </div>

              <div className="form-group">
                <input
                  type="text"
                  name="studentNumber"
                  placeholder="Student Number"
                  value={formData.studentNumber.replace(/\D/g, "").slice(0, 10)}
                  onChange={handleChange}
                />
                {errors.studentNumber && (
                  <p className="error">{errors.studentNumber}</p>
                )}
              </div>

              <div className="form-group">
                <div className="mobile-con">
                  <span className="mobile-prefix">+63</span>
                  <input
                    type="text"
                    name="mobileNumber"
                    placeholder="Mobile Number"
                    value={formData.mobileNumber
                      .replace(/\D/g, "")
                      .slice(0, 10)}
                    onChange={handleChange}
                    maxLength="10"
                  />
                </div>
                {errors.mobileNumber && (
                  <p className="error">{errors.mobileNumber}</p>
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
                  <label className="label-radial">
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
                {errors.role && <p className="error">{errors.role}</p>}
              </div>

              <div className="form-group">
                <div className="checkbox-container">
                  <input
                    type="checkbox"
                    name="dpa"
                    checked={isChecked}
                    onChange={() => setChecked(!isChecked)}
                  />
                  <small>
                    I acknowledge that I have read and understood the
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setShowModal("dpa");
                      }}
                      style={{ color: "#dc2626" }}
                    >
                      {" "}
                      Data Privacy Agreement{" "}
                    </a>
                    and consent to the collection and use of my information as
                    described.
                  </small>
                </div>
                {errors.dpa && <p className="error">{errors.dpa}</p>}
              </div>

              <button type="submit">Register</button>
            </form>
          </div>
        </div>

        {showModal === "dpa" && (
          <div className="modal-overlay">
            <div className={`modal-content ${showModal}`}>
              <section>
                <h2>Data Privacy Agreement</h2>
              </section>
              <section>
                <h3>Collection and Use of Personal Information</h3>
                <p>
                  By registering for our tutor scheduling service, you consent
                  to the collection and processing of your personal information
                  including your name, email address, phone number, academic
                  interests, and scheduling preferences. This information is
                  used to:
                </p>
                <ul>
                  <li>Create and manage your user account</li>
                  <li>Match you with appropriate tutors</li>
                  <li>Facilitate scheduling and communication</li>
                  <li>Send service notifications and updates</li>
                  <li>Improve our services through anonymized analytics</li>
                </ul>
              </section>

              <section>
                <h3>Data Protection and Security</h3>
                <p>
                  We implement industry-standard security measures to protect
                  your personal information from unauthorized access,
                  alteration, or disclosure. Your data is stored on secure
                  servers with encrypted transmission.
                </p>
              </section>

              <section>
                <h3>Data Sharing</h3>
                <p>Your personal information may be shared with:</p>
                <ul>
                  <li>Tutors you schedule sessions with</li>
                  <li>Service providers who assist in website operation</li>
                  <li>Legal authorities when required by law</li>
                </ul>
                <p>
                  We will never sell your personal information to third parties
                  or use it for marketing purposes without your explicit
                  consent.
                </p>
              </section>

              <section>
                <h3>Your Rights</h3>
                <p>You have the right to:</p>
                <ul>
                  <li>Access your personal information</li>
                  <li>Request corrections to inaccurate data</li>
                  <li>Download a copy of your data</li>
                  <li>Delete your account and associated data</li>
                  <li>Opt out of non-essential communications</li>
                </ul>
              </section>

              <section>
                <h3>Cookie Policy</h3>
                <p>
                  We use cookies to enhance your browsing experience, remember
                  your preferences, and analyze website traffic. You can manage
                  cookie settings through your browser.
                </p>
              </section>

              <section>
                <h3>Changes to Privacy Policy</h3>
                <p>
                  We may update this privacy policy periodically. Significant
                  changes will be communicated via email or website
                  notification.
                </p>
              </section>

              <div className="modal-buttons">
                <button
                  onClick={() => {
                    setShowModal("");
                  }}
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}

        {showModal === "duplicate" && (
          <div className="modal-overlay">
            <div className={`modal-content ${showModal}`}>
              <h2>Duplicate found.</h2>
              <p>
                An account with this email or student number already exists.
                Would you like to login instead?
              </p>
              <div className="modal-buttons">
                <button
                  onClick={() => {
                    setShowModal("");
                    navigate("/login");
                  }}
                >
                  Proceed to Login
                </button>
                <button
                  onClick={() => {
                    setShowModal("");
                    setHasDuplicate(false);
                  }}
                >
                  Use a Different Email/Student Number
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Register;
