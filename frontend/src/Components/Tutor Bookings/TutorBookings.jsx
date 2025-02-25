import React, { useEffect, useState } from "react";
import "./TutorBookings.css";
import TutorNav from "../Nav/TutorNav";

const TutorBookings = () => {
  const [bookingsList, setBookingsList] = useState([]);

  useEffect(() => {
    //add fetch url here
    fetch()
      .then((response) => response.json())
      .then((data) => setBookingsList(data))
      .catch((error) => console.error("Error fetching bookings:", error));
  }, []);

  useEffect(() => {
    setBookingsList([
      {
        id: 1,
        name: "John Doe",
        course: "Math",
        date: "2025-02-25",
        time: "10:00 AM",
        message: "Looking forward!",
        status: "pending",
      },
    ]);
  }, []);

  const handleAccept = (id) => {
    setBookingsList((prevBookingsList) =>
      prevBookingsList.map((booking) =>
        booking.id === id ? { ...booking, status: "accepted" } : booking
      )
    );
  };

  const handleReject = (id) => {
    setBookingsList((prevBookingsList) =>
      prevBookingsList.map((booking) =>
        booking.id === id ? { ...booking, status: "rejected" } : booking
      )
    );
  };

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

        <div className="bookings-cards">
          {bookingsList.map((booking) => (
            <div key={booking.id} className={`booking-card ${booking.status}`}>
              <div className="profile-img"></div>
              <h3>{booking.name}</h3>
              <p>{booking.course}</p>
              <p>{booking.date}</p>
              <p>{booking.time}</p>
              <p>{booking.message}</p>
              {booking.status === "pending" ? (
                <>
                  <button
                    className="accept-button"
                    onClick={() => handleAccept(booking.id)}
                  >
                    Accept
                  </button>
                  <button
                    className="reject-button"
                    onClick={() => handleReject(booking.id)}
                  >
                    Reject
                  </button>
                </>
              ) : (
                <p className={`status ${booking.status}`}>
                  This booking has been {booking.status}.
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default TutorBookings;
