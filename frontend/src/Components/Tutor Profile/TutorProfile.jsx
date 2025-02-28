import React from "react";
import "./TutorProfile.css";
import TutorNav from "../Nav/TutorNav";
import AccountInformation from "./AccountInformation"; 
import BookingPreferences from "./BookingPreferences"; 
import SignInSecurity from "./SignInSecurity"; 

const TutorProfile = () => {
  return (
    <>
      <TutorNav />
      <div className="tutor-profile">

        {/* ✅ Insert Account Information Component */}
        <section className="profile-section">
          <AccountInformation />
        </section>

        {/* ✅ Insert Booking Preferences Component */}
        <section className="profile-section">
          <BookingPreferences />
        </section>

        {/* ✅ Insert Sign-In & Security Component */}
        <section className="profile-section">
          <SignInSecurity />
        </section>
      </div>
    </>
  );
};

export default TutorProfile;
