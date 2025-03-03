import React from "react";
import "./TutorProfile.css";
import TutorNav from "../Nav/TutorNav";
import AccountInformation from "../ProfileContent/AccountInformation"; 
import PreferredCourses from "../ProfileContent/PreferredCourses";
import AvailabilitySchedule from "../ProfileContent/AvailabilitySchedule";
import SignInSecurity from "../ProfileContent/SignInSecurity"; 
import ClassSchedule from "../ProfileContent/ClassSchedule";

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
        <h2>Booking Preferences</h2>
          <PreferredCourses />
          <AvailabilitySchedule />
          <ClassSchedule />
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
