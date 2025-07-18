// TutorProfile.jsx
import React, { useState } from "react";
import TutorNav from "../Nav/TutorNav";
import AccountInformation from "../ProfileContent/AccountInformation";
import BookingPreferences from "../ProfileContent/BookingPreferencesTutor";
import SignInSecurity from "../ProfileContent/SignInSecurity";
import AvailabilitySchedule from "../ProfileContent/AvailabilitySchedule";
import ClassSchedule from "../ProfileContent/ClassSchedule";
import ReportIssue from "../ProfileContent/ReportIssue";
import ViewReportIssue from "../ProfileContent/ViewReportIssue";
import TutorSidebar from "./TutorSidebar";
import "./TutorProfile.css";

const TutorProfile = () => {
  const [activeTab, setActiveTab] = useState("account");

  return (
    <div>
      <TutorNav />

      <div className="profile-layout">
        <TutorSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <div>
          <div className="profile-sections">
            {activeTab === "account" && (
              <section>
                <h2 className="section-title">Account Information</h2>
                <AccountInformation />
              </section>
            )}

            {activeTab === "booking" && (
              <section>
                <h2 className="section-title">Booking Preferences</h2>
                <BookingPreferences />
                <ClassSchedule />
                <AvailabilitySchedule />
              </section>
            )}

            {activeTab === "security" && (
              <section>
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

            {activeTab === "viewreport" && (
              <section className="profile-section security-section">
                <h2 className="section-title">View Reported Issues</h2>
                <ViewReportIssue />
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorProfile;
