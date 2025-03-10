import React, { useState, useEffect } from "react";
import "./AdminStat.css";
import PerformanceCard from "./PerformanceCard";
import { supabase } from "../../supabaseClient";
import AdminNav from "../Nav/AdminNav";

const AdminStat = () => {
  const [tutorList, setTutorList] = useState([]);
  const [tuteeList, setTuteeList] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

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
      }
    };

    fetchTutees();
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

        <div className="stat-content">
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
