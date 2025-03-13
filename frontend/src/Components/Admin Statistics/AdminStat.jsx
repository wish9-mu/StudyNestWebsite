import React, { useState, useEffect } from "react";
import "./AdminStat.css";
import PerformanceCard from "./PerformanceCard";
import GenerateReport from "./GenerateReport";
import { supabase } from "../../supabaseClient";
import AdminNav from "../Nav/AdminNav";

const AdminStat = () => {
  const [tutorList, setTutorList] = useState([]);
  const [tuteeList, setTuteeList] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  // 📊 Statistics States
  const [totalTutors, setTotalTutors] = useState(0);
  const [totalTutees, setTotalTutees] = useState(0);
  const [totalBookings, setTotalBookings] = useState(0);
  const [totalPending, setTotalPending] = useState(0);
  const [totalAccepted, setTotalAccepted] = useState(0);
  const [totalCompleted, setTotalCompleted] = useState(0);
  const [totalCancelled, setTotalCancelled] = useState(0);
  const [totalRejected, setTotalRejected] = useState(0);
  const [topTutors, setTopTutors] = useState([]);
  const [topTutees, setTopTutees] = useState([]);

  // Fetch tutors from the database
  useEffect(() => {
    const fetchTutors = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("role", "tutor");

      if (error) {
        console.error("Error fetching tutors:", error);
      } else {
        setTutorList(data);
        setTotalTutors(data.length);
      }
    };

    fetchTutors();
  }, []);

  // Fetch tutees from the database
  useEffect(() => {
    const fetchTutees = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("role", "tutee");

      if (error) {
        console.error("Error fetching tutees:", error);
      } else {
        setTuteeList(data);
        setTotalTutees(data.length);
      }
    };

    fetchTutees();
  }, []);

  // 🔹 Fetch Booking Statistics
  useEffect(() => {
    const fetchBookingStats = async () => {
      console.log("📊 Fetching Booking Statistics...");

      try {
        const [
          totalBookingsData,
          pendingData,
          acceptedData,
          completedData,
          cancelledData,
          rejectedData,
        ] = await Promise.all([
          supabase.from("bookings").select("*"),
          supabase.from("bookings").select("*").eq("status", "pending"),
          supabase.from("bookings").select("*").eq("status", "accepted"),
          supabase
            .from("bookings_history")
            .select("*")
            .eq("status", "completed"),
          supabase
            .from("bookings_history")
            .select("*")
            .eq("status", "cancelled"),
          supabase
            .from("bookings_history")
            .select("*")
            .eq("status", "rejected"),
        ]);

        setTotalBookings(totalBookingsData.data.length);
        setTotalPending(pendingData.data.length);
        setTotalAccepted(acceptedData.data.length);
        setTotalCompleted(completedData.data.length);
        setTotalCancelled(cancelledData.data.length);
        setTotalRejected(rejectedData.data.length);
      } catch (error) {
        console.error("❌ Error fetching booking statistics:", error);
      }
    };

    fetchBookingStats();
  }, []);

  // 🔹 Fetch Top Active Tutors & Tutees
  useEffect(() => {
    const fetchTopUsers = async () => {
      console.log("📊 Fetching Top Tutors & Tutees...");

      try {
        // Fetch top tutors
        const { data: topTutorsData, error: tutorError } = await supabase.rpc(
          "get_top_tutors"
        );
        // Fetch top tutees
        const { data: topTuteesData, error: tuteeError } = await supabase.rpc(
          "get_top_tutees"
        );

        if (tutorError) {
          console.error("❌ Error fetching top tutors:", tutorError);
        } else {
          console.log("✅ Top Tutors Data:", topTutorsData);
          setTopTutors(topTutorsData);
        }

        if (tuteeError) {
          console.error("❌ Error fetching top tutees:", tuteeError);
        } else {
          console.log("✅ Top Tutees Data:", topTuteesData);
          setTopTutees(topTuteesData);
        }
      } catch (error) {
        console.error("❌ Error fetching top tutors & tutees:", error);
      }
    };

    fetchTopUsers();
  }, []);

  // Handle opening the PerformanceCard modal
  const handleCardClick = (user) => {
    console.log("Selected User:", user);
    setSelectedUser(user);
  };

  // Handle closing the PerformanceCard modal
  const closePerformanceCard = () => {
    setSelectedUser(null);
  };

  return (
    <>
      <AdminNav />
      <div className="admin-stat">
        <div className="header">
          <div className="header-text">
            <h1>Welcome to Statistics</h1>
          </div>
          <div className="header-info">
            <p>
              In Statistics, you can monitor activities, track performance
              metrics, and generate reports.
            </p>
          </div>
        </div>

        <div className="gen-report-content">
          <div className="box-placeholder">
            {
              <GenerateReport />
              //will add generation of report here
            }
          </div>
          {/* Section divider for visual separation */}

          <div className="tutors-display">
            <h1 className="">Instructors</h1>
            <PerformanceCard tutorList={tutorList} />
          </div>
        </div>

        <div className="statistics-summary">
          <div className="stat-card">
            <h3>Total Tutors</h3>
            <p>{totalTutors}</p>
          </div>
          <div className="stat-card">
            <h3>Total Tutees</h3>
            <p>{totalTutees}</p>
          </div>
          <div className="stat-card">
            <h3>Total Bookings</h3>
            <p>{totalBookings}</p>
          </div>
          <div className="stat-card">
            <h3>Pending Bookings</h3>
            <p>{totalPending}</p>
          </div>
          <div className="stat-card">
            <h3>Accepted Bookings</h3>
            <p>{totalAccepted}</p>
          </div>
          <div className="stat-card">
            <h3>Completed Bookings</h3>
            <p>{totalCompleted}</p>
          </div>
          <div className="stat-card">
            <h3>Cancelled Bookings</h3>
            <p>{totalCancelled}</p>
          </div>
          <div className="stat-card">
            <h3>Rejected Bookings</h3>
            <p>{totalRejected}</p>
          </div>
        </div>

        {/* 🔹 Top Active Users */}
        <div className="top-users">
          <h2>Top Active Tutors</h2>
          <p>Based on the number of completed bookings.</p>
          <ul>
            {topTutors.length > 0 ? (
              topTutors.map((tutor, index) => {
                // Find the tutor in the tutorList using tutor_id
                const tutorInfo = tutorList.find(
                  (t) => t.id === tutor.tutor_id
                );
                return (
                  <li key={index}>
                    {tutorInfo
                      ? `${tutorInfo.first_name} ${tutorInfo.last_name}`
                      : `Tutor ID: ${tutor.tutor_id}`}
                    - {tutor.total_bookings || tutor.count} Sessions
                  </li>
                );
              })
            ) : (
              <li>No active tutors found.</li>
            )}
          </ul>

          <h2>Top Active Tutees</h2>
          <p>Based on the number of completed bookings.</p>
          <ul>
            {topTutees.length > 0 ? (
              topTutees.map((tutee, index) => {
                // Find the tutee in the tuteeList using tutee_id
                const tuteeInfo = tuteeList.find(
                  (t) => t.id === tutee.tutee_id
                );
                return (
                  <li key={index}>
                    {tuteeInfo
                      ? `${tuteeInfo.first_name} ${tuteeInfo.last_name}`
                      : `Tutee ID: ${tutee.tutee_id}`}
                    - {tutee.total_bookings || tutee.count} Sessions
                  </li>
                );
              })
            ) : (
              <li>No active tutees found.</li>
            )}
          </ul>
        </div>

        <div className="">
          <div className="tutors-display">
            <h2>Tutors</h2>
            {tutorList.map((tutor) => (
              <div
                key={tutor.id}
                className="tutor-card"
                onClick={() => handleCardClick(tutor)}
              >
                <div className="profile-img">
                  <img
                    src={tutor.profile_picture || "/default-avatar.png"}
                    alt="Profile"
                    className="profile-img"
                  />
                </div>
                <h3>{tutor.first_name + " " + tutor.last_name}</h3>
                <p>{tutor.email}</p>
              </div>
            ))}
          </div>

          <div className="tutors-display">
            <h2>Tutees</h2>
            {tuteeList.map((tutee) => (
              <div
                key={tutee.id}
                className="tutor-card"
                onClick={() => handleCardClick(tutee)}
              >
                <div className="profile-img">
                  <img
                    src={tutee.profile_picture || "/default-avatar.png"}
                    alt="Profile"
                    className="profile-img"
                  />
                </div>
                <h3>{tutee.first_name + " " + tutee.last_name}</h3>
                <p>{tutee.email}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedUser && (
        <PerformanceCard user={selectedUser} onClose={closePerformanceCard} />
      )}
    </>
  );
};

export default AdminStat;
