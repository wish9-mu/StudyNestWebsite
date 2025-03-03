import React, { useEffect, useState } from "react";
import "./TutorBookings.css";
import { supabase } from "../../supabaseClient";

const BookingsCard = ( {setAcceptedBList}) => {
    const [bookingsList, setBookingsList] = useState([]);

    useEffect(() => {
        //for backend
        const fetchBookings = async () => {
            const { data, error } = await supabase
            .from("bookings") 
            .select("*")
            .eq("status", "pending"); //for filter
        
            if (error) {
                console.error("Error fetching bookings:", error);
            } else {
                setBookingsList(data);
            }
        };

        fetchBookings();
    }, []);

    useEffect(() => {
        setBookingsList([
        {
            id: 1,
            firstName: "John",
            lastName: "Doe",
            course: "Math",
            date: "2025-02-25",
            time: "10:00 AM",
            message: "Looking forward!",
            status: "pending",
        },
        ]);
    }, []);

    const handleAccept = async (id) => {
        /*
            const { error } = await supabase
            .from("bookings")
            .update({ status: "accepted" })
            .eq("id", id);
        */
        //if (!error) {
            setBookingsList((prevBookingsList) =>
                prevBookingsList.map((booking) =>
                    booking.id === id ? { ...booking, status: "accepted" } : booking
                )
            );
            
            setAcceptedBList((prevAcceptedBList) => [
                ...prevAcceptedBList, bookingsList.find((booking) => booking.id == id)
                ]
            );

            setAcceptedBList((prevAcceptedBList) =>
                prevAcceptedBList.map((booking) =>
                    booking.id === id ? { ...booking, status: "accepted" } : booking
                )
            );
        /*} else {
            console.error("Error updating booking:", error);
        }*/
    };

    const handleReject = async(id) => {
        /*
            const { error } = await supabase
            .from("bookings")
            .update({ status: "rejected" })
            .eq("id", id);
        */

       // if (!error) {
            setBookingsList((prevBookingsList) =>
                prevBookingsList.map((booking) =>
                    booking.id === id ? { ...booking, status: "rejected" } : booking
                )
            );
        /*} else {
            console.error("Error updating booking:", error);
        }*/
    };

    return (
        <>
            {bookingsList.length > 0 ? (
                bookingsList.map((booking) => (
                    <div key={booking.id} className={`booking-card ${booking.status}`}>
                        <div className="profile-img"></div>
                        <h3>{booking.lastName}, {booking.firstName}</h3>
                        <p>{booking.course}</p>
                        <p>{booking.date}</p>
                        <p>{booking.time}</p>
                        <p>{booking.message}</p>
                        {booking.status === "pending" ? (
                            <>
                            <button className="accept-button" onClick={() => handleAccept(booking.id)}>Accept</button>
                            <button className="reject-button" onClick={() => handleReject(booking.id)}>Reject</button>
                            </>
                        ) : (
                            <p className={`status ${booking.status}`}>
                            This booking has been {booking.status}.
                            </p>
                        )}
                    </div>
                ))
            ) : (
                <p>No bookings available.</p>
            )
            }
        </>
    );
};

export default BookingsCard;