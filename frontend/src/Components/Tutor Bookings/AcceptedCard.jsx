import React, { useEffect, useState} from "react";
import "./TutorBookings.css";

const AcceptedCard = ({ acceptedBList, setAcceptedBList }) => {

    useEffect(() => {
        //for backend

        const fetchBookings = async () => {
            const { data, error } = await supabase
            .from("table_name") //table name for bookings
            .select("*"); //for filter
        
            if (error) {
                console.error("Error fetching bookings:", error);
            } else {
                setBookingsList(data);
            }
        };

        fetchBookings();
    }, []);

    const handleCancel = (id) => {
        /*
            const { error } = await supabase
            .from("table_name")
            .update({ status: "canceled" })
            .eq("id", id);
        */
        //if (!error) {
            setAcceptedBList((prevAcceptedBList) =>
                prevAcceptedBList.filter((booking) => booking.id === id)    
            );

            setAcceptedBList((prevAcceptedBList) =>
                prevAcceptedBList.map((booking) =>
                    booking.id === id ? { ...booking, status: "canceled" } : booking
                )
            );

        /*} else {
            console.error("Error updating booking:", error);
        }
        */
    };

    return (
        <>
            {acceptedBList.map((booking) => (
                <div key={booking.id} className={`booking-card ${booking.status}`}>
                    <div className="profile-img"></div>
                    <h3>{booking.lastName}, {booking.firstName}</h3>
                    <p>{booking.course}</p>
                    <p>{booking.date}</p>
                    <p>{booking.time}</p>
                    <p>{booking.message}</p>
                    {booking.status === "accepted" ? (
                        <>
                        <button className="cancel-button" onClick={() => handleCancel(booking.id)}>Cancel</button>
                        </>
                    ) : (
                        <p className={`status ${booking.status}`}>
                            This booking has been {booking.status}.
                        </p>
                    )
                    }
                </div>
            ))
            
            }
        </>
    );
};

export default AcceptedCard;