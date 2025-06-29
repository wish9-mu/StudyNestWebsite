import React from "react";
import "./TuteeActivity.css";
import TuteeNav from "../Nav/TuteeNav";
import ActiveBookings from "../ActivityContent/ActiveBookings";
import BookingHistory from "../ActivityContent/BookingHistory";
import Waitlist_ForTutee from "../ActivityContent/Waitlist_ForTutee";
import FeedbackHistory from "../ActivityContent/FeedbackHistory";

const TuteeActivity = () => {
  return (
    <div className="page-container">
      <TuteeNav />
      <main className="content-wrap">
        <div className="tutee-activity">
          <div className="activity-content">
            {/* ActiveBookings component */}
            <div className="activity-section">
              <ActiveBookings feedbackBool={false} />
            </div>

            {/* Optional visual separator */}
            <div className="component-separator"></div>

            {/* Waitlist component */}
            <div className="activity-section">
              <Waitlist_ForTutee />
            </div>

            {/* Optional visual separator */}
            <div className="component-separator"></div>

            {/* Booking History component */}
            <div className="activity-section">
              <BookingHistory />
            </div>

            {/* Optional visual separator */}
            <div className="component-separator"></div>

            {/* Feedback History component */}
            <div className="activity-section">
              <FeedbackHistory />
            </div>
          </div>
        </div>
      </main>
      {/* Footer is rendered elsewhere in your app structure */}
    </div>
  );
};

export default TuteeActivity;
