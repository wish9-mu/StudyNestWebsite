// TuteeProfile.jsx
import React, { useState } from "react";
import TuteeNav from "../Nav/TuteeNav";
import AccountInformation from "../ProfileContent/AccountInformation";
import SignInSecurity from "../ProfileContent/SignInSecurity";
import "./TuteeProfile.css";

const TuteeProfile = () => {
  const [activeTab, setActiveTab] = useState("account");

  return (
    <div className="tutee-profile-container">
      <TuteeNav />
      <div className="tutee-profile-content">
        <div className="profile-tabs">
          <button
            className={`tab-button ${activeTab === "account" ? "active" : ""}`}
            onClick={() => setActiveTab("account")}
          >
            Account Information
          </button>
          <button
            className={`tab-button ${activeTab === "security" ? "active" : ""}`}
            onClick={() => setActiveTab("security")}
          >
            Sign-In & Security
          </button>
        </div>

        <div className="profile-sections">
          {activeTab === "account" && (
            <section className="profile-section account-section">
              <AccountInformation />
            </section>
          )}

          {activeTab === "security" && (
            <section className="profile-section security-section">
              <SignInSecurity />
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default TuteeProfile;
