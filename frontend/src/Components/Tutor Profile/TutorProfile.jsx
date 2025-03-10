import React, { useState } from "react";
import "./TutorProfile.css";
import TutorNav from "../Nav/TutorNav";
import AccountInformation from "../ProfileContent/AccountInformation";
import BookingPreferences from "../ProfileContent/BookingPreferences_Tutor";
import SignInSecurity from "../ProfileContent/SignInSecurity";
import AvailabilitySchedule from "../ProfileContent/AvailabilitySchedule";
import ClassSchedule from "../ProfileContent/ClassSchedule";

const TutorProfile = () => {
  const [activeTab, setActiveTab] = useState("account");

  return (
    <>
      <TutorNav />
      <div className="tutor-profile">
        <div className="profile-tabs">
          <button
            className={`tab-button ${activeTab === "account" ? "active" : ""}`}
            onClick={() => setActiveTab("account")}
          >
            Account Information
          </button>
          <button
            className={`tab-button ${activeTab === "booking" ? "active" : ""}`}
            onClick={() => setActiveTab("booking")}
          >
            Booking Preferences
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

          {activeTab === "booking" && (
            <section className="profile-section booking-section">
              <BookingPreferences />
              <ClassSchedule />
              <AvailabilitySchedule />
            </section>
          )}

          {activeTab === "security" && (
            <section className="profile-section security-section">
              <SignInSecurity />
            </section>
          )}
        </div>
      </div>
    </>
  );
};

export default TutorProfile;
