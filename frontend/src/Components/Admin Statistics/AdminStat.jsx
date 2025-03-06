import React, { useState, useEffect } from "react";
import "./AdminStat.css";
import PerformanceCard from "./PerformanceCard";
// import GenerateReport from "./GenerateReport";
import { supabase } from "../../supabaseClient";
import AdminNav from "../Nav/AdminNav";

const AdminStat = () => {
  const [tutorList, setTutorList] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
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

    fetchBookings();
  }, []);

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
              In statistics, you can monitor activities, track performance
              metrics, and generate reports.
            </p>
          </div>
        </div>

        <div className="stat-content">
          <div className="box-placeholder">
            {/*<GenerateReport /> 
            will add generation of report here
            */}
          </div>
          <div className="tutors-display">
            <PerformanceCard tutorList={tutorList} />
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminStat;
