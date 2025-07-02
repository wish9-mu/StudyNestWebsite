// TutorProfile.jsx
import React, { useState } from "react";
import TutorNav from "../Nav/TutorNav";
import AccountInformation from "../ProfileContent/AccountInformation";
import BookingPreferences from "../ProfileContent/BookingPreferences_Tutor";
import SignInSecurity from "../ProfileContent/SignInSecurity";
import AvailabilitySchedule from "../ProfileContent/AvailabilitySchedule";
import ClassSchedule from "../ProfileContent/ClassSchedule";
import ReportIssue from "../ProfileContent/ReportIssue";
import TutorSidebar from "./TutorSidebar";
import "./TutorProfile.css";

const TutorProfile = () => {
  const [activeTab, setActiveTab] = useState("account");

  return (
    <div className="tutor-profile-container">
      <TutorNav />

      <div className="profile-layout">
        <TutorSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="tutor-profile-content">
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
                <BookingPreferences />
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

export default TutorProfile;
