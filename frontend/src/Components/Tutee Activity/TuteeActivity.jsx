import React from "react";
import "./TuteeActivity.css";
import TuteeNav from "../Nav/TuteeNav";
import ActiveBookings from "../ActivityContent/ActiveBookings";
import BookingHistory from "../ActivityContent/BookingHistory";

const TuteeActivity = () => {
  return (
    <div className="page-container">
      <TuteeNav />
      <main className="content-wrap">
        <div className="tutee-activity">

          <div className="activity-content">
            {/* ActiveBookings component */}
            <ActiveBookings />
            <BookingHistory />
          </div>
          
        </div>
      </main>
      {/* Footer is rendered elsewhere in your app structure */}
    </div>
  );
};

export default TuteeActivity;
