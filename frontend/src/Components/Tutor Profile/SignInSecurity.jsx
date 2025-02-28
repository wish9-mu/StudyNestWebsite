import React, { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";

const SignInSecurity = () => {
  const [securityInfo, setSecurityInfo] = useState({
    email: "",
    password: "",
    session_history: [],
  });

  useEffect(() => {
    const fetchSecurityData = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("email, session_history")
        .eq("id", supabase.auth.user()?.id)
        .single();

      if (error) console.error("Error fetching security info:", error);
      else setSecurityInfo({ ...data, password: "" });
    };

    fetchSecurityData();
  }, []);

  const handlePasswordReset = async () => {
    const { error } = await supabase.auth.resetPasswordForEmail(securityInfo.email);
    if (error) console.error("Error sending reset email:", error);
    else alert("Password reset link sent to your email.");
  };

  return (
    <div className="profile-section">
      <h2>Sign-In & Security</h2>
      <label>Email:</label>
      <input type="email" value={securityInfo.email} disabled />

      <button onClick={handlePasswordReset}>Reset Password</button>

      <h3>Session History:</h3>
      <ul>
        {securityInfo.session_history?.map((session, index) => (
          <li key={index}>{session}</li>
        ))}
      </ul>
    </div>
  );
};

export default SignInSecurity;
