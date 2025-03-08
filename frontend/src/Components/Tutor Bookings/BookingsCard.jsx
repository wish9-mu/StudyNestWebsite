import React, { useEffect, useState } from "react";
import "./TutorBookings.css";
import { supabase } from "../../supabaseClient";
import "../Modal/Modal.css"; 

const BookingsCard = ({setAcceptedBList}) => {
    const [bookingsList, setBookingsList] = useState([]);
    const [showModal, setShowModal] = useState("");

    useEffect(() => {
        const fetchBookings = async () => {
            const { data, error } = await supabase
                .from("bookings")
                .select(`
                    *,
                    profiles!tutee_id(first_name, last_name)
                `)
                .eq("status", "pending");
            
            if (error) {
                console.error("Error fetching bookings with tutee info:", error);
            } else {
                const formattedData = data.map(booking => ({
                    ...booking,
                    firstName: booking.profiles?.first_name || "",
                    lastName: booking.profiles?.last_name || "",
                }));
                
                setBookingsList(formattedData);
            }
        };

        fetchBookings();
    }, []);

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

    const handleAccept = async (id) => {
        const { error } = await supabase
        .from("bookings")
        .update({ status: "accepted" })
        .eq("id", id);
        
        if (!error) {
            console.log("Booking Accepted.");
            
            setBookingsList((prevBookingsList) =>
                prevBookingsList.map((booking) =>
                    booking.id === id ? { ...booking, status: "accepted" } : booking
                )
            );
            
            const bookingToAccept = bookingsList.find((booking) => booking.id === id);
            if (bookingToAccept) {
                setAcceptedBList((prevAcceptedBList) => [
                    ...prevAcceptedBList, 
                    { ...bookingToAccept, status: "accepted" }
                ]);
            }

            
            console.log(`Setting timeout to remove booking ${id} in Booking Section`);

            setTimeout(() => {
                console.log(`Removing accepted booking from list`);
                setBookingsList((prevBookingsList) =>
                    prevBookingsList.filter((booking) => {booking.id !== id})

                );
            }, 5000); 

        } else {
            console.error("Error updating booking:", error);
        }
    };

    const handleReject = async(id) => {
        const { error } = await supabase
        .from("bookings")
        .update({ status: "rejected" })
        .eq("id", id);
        

        if (!error) {
            console.log("Booking rejected.");
            setBookingsList((prevBookingsList) =>
                prevBookingsList.map((booking) =>
                    booking.id === id ? { ...booking, status: "rejected" } : booking
                )
            );

            console.log(`Setting timeout to remove booking ${id} in Booking Section`);
            setTimeout(() => {
                console.log(`Removing rejected booking  from list`);
                setBookingsList((prevBookingsList) =>
                    prevBookingsList.filter((booking) => {booking.id !== id})

                );
            }, 5000); 

        } else {
            console.error("Error updating booking:", error);
        }
    };

    return (
        <>
            {bookingsList.length > 0 ? (
                bookingsList.map((booking) => (
                    <div key={booking.id} className={`booking-card ${booking.status}`}>
                        <div className="profile-img"></div>
                        <h3>{booking.lastName}, {booking.firstName}</h3>
                        <p>{booking.course}</p>
                        <p>{formatDate(booking.request_date)}</p>
                        <p>{formatTime(booking.start_time)} - {formatTime(booking.end_time)}</p>
                        <p>{booking.message}</p>
                        {booking.status === "pending" ? (
                            <>
                            <button className="accept-button" onClick={() => {setShowModal("accept");}}>Accept</button>
                            <button className="reject-button" onClick={() => setShowModal("reject")}>Reject</button>

                            
                            {showModal === "accept" && 
                            <div className="modal-overlay">
                                <div className="modal-content">
                                    <h2>Are you sure you want to accept this booking?</h2>
                                    <button className="accept-button" onClick={() => {
                                        handleAccept(booking.id);
                                        setShowModal("");}}>Yes</button>
                                    <button className="reject-button" onClick={() => setShowModal("")}>No</button>
                                </div>
                            </div>
                            }

                            {showModal === "reject" && 
                            <div className="modal-overlay">
                                <div className="modal-content">
                                    <h2>Are you sure you want to reject this booking?</h2>
                                    <button className="accept-button" onClick={() => {
                                        handleReject(booking.id);
                                        setShowModal("");}}>Yes</button>
                                    <button className="reject-button" onClick={() => setShowModal("")}>No</button>
                                </div>
                            </div>
                            }

                            </>
                        ) : (
                            <p className={`status ${booking.status}`}>
                            This booking has been {booking.status}.
                            </p>
                        )}
                    </div>
                ))
            ) : (
                <p>No pending bookings available.</p>
            )
            }
        </>
    );
};

export default BookingsCard;