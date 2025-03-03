import React from "react";
import "./TuteeProfile.css";
import TuteeNav from "../Nav/TutorNav";
import AccountInformation from "../ProfileContent/AccountInformation"; 
import SignInSecurity from "../ProfileContent/SignInSecurity"; 

const TuteeProfile = () => {
  return (
    <>
      <TuteeNav />
      <div className="tutor-profile">

        {/* ✅ Insert Account Information Component */}
        <section className="profile-section">
          <AccountInformation />
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
