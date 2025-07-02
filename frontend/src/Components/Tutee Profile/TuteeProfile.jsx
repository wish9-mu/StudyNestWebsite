// TuteeProfile.jsx
import React, { useState } from "react";
import TuteeNav from "../Nav/TuteeNav";
import AccountInformation from "../ProfileContent/AccountInformation";
import SignInSecurity from "../ProfileContent/SignInSecurity";
import ClassSchedule from "../ProfileContent/ClassSchedule";
import AvailabilitySchedule from "../ProfileContent/AvailabilitySchedule";
import ReportIssue from "../ProfileContent/ReportIssue";
import Sidebar from "./TuteeSidebar";
import "./TuteeProfile.css";

const TuteeProfile = () => {
  const [activeTab, setActiveTab] = useState("account");

  return (
    <div>
      <TuteeNav />

      <div className="profile-layout">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="tutee-profile-content">
          <div className="profile-sections">
            {activeTab === "account" && (
              <section className="profile-section account-section">
                <h2 className="section-title">Account Information</h2>
                <AccountInformation />
              </section>
            )}

            {activeTab === "booking" && (
              <section className="profile-section booking-section">
                <h2 className="section-title">Booking Preferences</h2>
                <ClassSchedule />
                <AvailabilitySchedule />
              </section>
            )}

            {activeTab === "security" && (
              <section className="profile-section security-section">
                <h2 className="section-title">Sign-In & Security</h2>
                <SignInSecurity />
              </section>
            )}

            {activeTab === "report" && (
              <section className="profile-section security-section">
                <h2 className="section-title">Report Issue</h2>
                <ReportIssue />
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TuteeProfile;
