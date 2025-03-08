import React, { act, useEffect, useState} from "react";
import "./TutorBookings.css";
import { supabase } from "../../supabaseClient";

const AcceptedCard = ({ acceptedBList, setAcceptedBList }) => {
    const [showModal, setShowModal] = useState("");

    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const formatTime = (timeStr) => {
        if (!timeStr) return "";
        const [hours, minutes] = timeStr.split(':');
        return `${hours}:${minutes}`;
    };

    const handleCancel = async (id) => {
            const { error } = await supabase
            .from("bookings")
            .update({ status: "cancelled" })
            .eq("id", id);
        
        if (!error) {
            setAcceptedBList((prevAcceptedBList) =>
                prevAcceptedBList.map((booking) =>
                    booking.id === id ? { ...booking, status: "cancelled" } : booking
                )
            );

            console.log(`Setting timeout to remove booking ${id} in Accepted Bookings Section`);
            setTimeout(() => {
                console.log(`Removing cancelled booking from list`);
                setAcceptedBList((prevAcceptedBList) =>
                    prevAcceptedBList.filter((booking) => {booking.id !== id})

                );
            }, 5000); 

        } else {
            console.error("Error updating booking:", error);
        }
        
    };

    return (
        <>
            {acceptedBList.map((acceptedBooking) => (
                <div key={acceptedBooking.id} className={`booking-card ${acceptedBooking.status}`}>
                    <div className="profile-img"></div>
                    <h3>{acceptedBooking.lastName}, {acceptedBooking.firstName}</h3>
                    <p>{acceptedBooking.course}</p>
                    <p>{formatDate(acceptedBooking.request_date)}</p>
                    <p>{formatTime(acceptedBooking.start_time)} - {formatTime(acceptedBooking.end_time)}</p>
                    <p>{acceptedBooking.message}</p>
                    {acceptedBooking.status === "accepted" ? (
                        <>
                        <button className="cancel-button" onClick={() => setShowModal("cancel")}>Cancel</button>

                        {showModal === "cancel" &&
                            <div className="modal-overlay">
                                <div className="modal-content">
                                    <h2>Are you sure you want to cancel this booking?</h2>
                                    <button className="accept-button" onClick={() => {
                                        handleCancel(acceptedBooking.id);
                                        setShowModal("");
                                    }}>Yes</button>
                                    <button className="reject-button" onClick={() => {
                                        setShowModal("");
                                    }}>No</button>
                                </div>
                            </div>
                        }
                        </>
                    ) : (
                        <p className={`status ${acceptedBooking.status}`}>
                            This booking has been {acceptedBooking.status}.
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