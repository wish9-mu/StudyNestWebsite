// TuteeProfile.jsx
import React, { useState } from "react";
import TuteeNav from "../Nav/TuteeNav";
import TuteeSidebar from "./TuteeSidebar";
import AccountInformation from "../ProfileContent/AccountInformation";
import ClassSchedule from "../ProfileContent/ClassSchedule";
import AvailabilitySchedule from "../ProfileContent/AvailabilitySchedule";
import SignInSecurity from "../ProfileContent/SignInSecurity";
import ReportIssue from "../ProfileContent/ReportIssue";
import ViewReportIssue from "../ProfileContent/ViewReportIssue";
import "../Tutor Profile/TutorProfile.css";

const TuteeProfile = () => {
  const [activeTab, setActiveTab] = useState("account");

  return (
    <div>
      <TuteeNav />

      <div className="profile-layout">
        <TuteeSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="tutee-profile-content">
          <div className="profile-sections">
            {activeTab === "account" && (
              <section>
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
              <section>
                <h2>Sign-in & Security</h2>
                <SignInSecurity />
              </section>
            )}

            {activeTab === "report" && (
              <section className="profile-section report-section">
                <h2 className="section-title">Report Issue</h2>
                <ReportIssue />
              </section>
            )}
            {activeTab === "viewreport" && (
              <section className="profile-section viewreport-section">
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

export default TuteeProfile;
