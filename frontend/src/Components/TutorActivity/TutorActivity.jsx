import React from "react";
import "../ActivityContent/TuteeWaitlist.css";
import TutorNav from "../Nav/TutorNav";
import ActiveBookings from "../ActivityContent/ActiveBookings";
import BookingHistory from "../ActivityContent/BookingHistory";
import Pending_ForTutor from "../ActivityContent/Pending_ForTutor";

const TutorActivity = () => {
  return (
    <div className="page-container">
      <TutorNav />
      <main className="content-wrap">
        <div className="tutee-activity">

          <div className="activity-content">
            {/* ActiveBookings component */}
            <ActiveBookings />
            <BookingHistory />
          </div>
          
        </div>
      </main>
    </div>
  );
};

export default TutorActivity;
