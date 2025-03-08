import React, { useEffect, useState } from "react";
import "./TutorBookings.css";
import TutorNav from "../Nav/TutorNav";
import "./BookingsCard.jsx";
import BookingsCard from "./BookingsCard.jsx";
import AcceptedCard from "./AcceptedCard.jsx";
import { supabase } from "../../supabaseClient";

const TutorBookings = () => {
  const [acceptedBList, setAcceptedBList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Accepted Bookings:", acceptedBList);
    setLoading(false);
  }, [acceptedBList]);

  useEffect(() => {
    const fetchAcceptedBookings = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("bookings")
            .select(`
                *,
                profiles!tutee_id(first_name, last_name)
            `)
            .eq("status", "accepted");

        if (error) {
            console.error("Error fetching accepted bookings:", error);
        } else {
            console.log("Fetched accepted bookings.");
            const formattedData = data.map(booking => ({
                ...booking,
                firstName: booking.profiles?.first_name || "",
                lastName: booking.profiles?.last_name || "",
            }));
            setAcceptedBList(formattedData);
        }
        setLoading(false);
    };

    fetchAcceptedBookings();
}, []);

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
          {loading ? (
            <p>Loading...</p>
          ) : acceptedBList.length > 0 ? (
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
