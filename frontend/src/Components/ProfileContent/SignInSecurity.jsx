import React, { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import "./SignInSecurity.css";

const SignInSecurity = () => {
  const [securityInfo, setSecurityInfo] = useState({
    email: "",
    password: "",
    session_history: [],
  });

  useEffect(() => {
    const fetchSecurityData = async () => {
      const { data: userData, error: userError } =
        await supabase.auth.getUser();
      if (userError || !userData?.user?.email) {
        console.error(
          "❌ Error fetching user email:",
          userError || "Email not found"
        );
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("session_history")
        .eq("id", userData.user?.id)
        .single();

      if (error) {
        console.error("❌ Error fetching session history:", error);
      }

      setSecurityInfo({
        email: userData.user.email,
        session_history: data?.session_history || [],
      });
    };

    fetchSecurityData();
  }, []);

  const handlePasswordReset = async () => {

    if (!securityInfo.email) {
      console.error("❌ Error: Email is missing.");
      alert("Error: No email found. Please log in again.");
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(
      securityInfo.email
    );

    if (error) {
      console.error("❌ Failed to send reset email:", error.message);
      alert("Failed to send password reset email. Please try again.");
    } else {
      console.log("✅ Password reset email sent to:");
      alert("Password reset link sent to your email.");
    }
  };

  return (
    <div className="profile-section">
      <h2>Sign-In & Security</h2>
      <button onClick={handlePasswordReset}>Reset Password</button>

      <h3>Session History:</h3>
      <ul>
        {securityInfo.session_history?.map((session, index) => (
          <li key={index}>
            <strong>Login Time:</strong>{" "}
            {new Date(session.login_time).toLocaleString()} <br />
            <strong>Device:</strong> {session.device}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SignInSecurity;
