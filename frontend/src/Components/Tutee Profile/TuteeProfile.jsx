import React from "react";
import "./TuteeProfile.css";
import TuteeNav from "../Nav/TutorNav";
import AccountInformation from "../ProfileContent/AccountInformation"; 
import SignInSecurity from "../ProfileContent/SignInSecurity"; 
import AvailabilitySchedule from "../ProfileContent/AvailabilitySchedule";

const TuteeProfile = () => {
  return (
    <>
      <TuteeNav />
      <div className="tutor-profile">

        {/* ✅ Insert Account Information Component */}
        <section className="profile-section">
          <AccountInformation />
        </section>

        {/* ✅ Insert Booking Preferences Component */}
        <section className="profile-section">
        <h2>Booking Preferences</h2>
          <AvailabilitySchedule />
        </section>

        {/* ✅ Insert Sign-In & Security Component */}
        <section className="profile-section">
          <SignInSecurity />
        </section>
      </div>
    </>
  );
};

export default TuteeProfile;
