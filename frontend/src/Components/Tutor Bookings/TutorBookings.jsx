import React, { useEffect, useState } from "react";
import "./TutorBookings.css";
import TutorNav from "../Nav/TutorNav";
import "./BookingsCard.jsx";
import BookingsCard from "./BookingsCard.jsx";
import AcceptedCard from "./AcceptedCard.jsx";

const TutorBookings = () => {
  const [acceptedBList, setAcceptedBList] = useState([]);

  return (
    <>
      <TutorNav />
      <div className="tutor-bookings">
        <div className="header">
          <div className="header-text">
            <h1>Manage Bookings</h1>
          </div>
          <div className="header-info">
            <p>
              In Manage Bookings, the tutor has the option to accept or reject
              bookings.
            </p>
          </div>
        </div>

        <div className="accepted-cards">
          {acceptedBList.length > 0 ? (
            <>
              <h2>Accepted Bookings</h2>
              <AcceptedCard
                acceptedBList={acceptedBList}
                setAcceptedBList={setAcceptedBList}
              />
            </>
          ) : (
            <p>&nbsp;</p>
          )}
        </div>

        <div className="bookings-cards">
          <h2>Bookings</h2>
          <BookingsCard setAcceptedBList={setAcceptedBList} />
        </div>
      </div>
    </>
  );
};

export default TutorBookings;
