import React, { useState, useEffect } from "react";
import "./AdminStat.css";
import PerformanceCard from "./PerformanceCard";
import { supabase } from "../../supabaseClient";
import AdminNav from "../Nav/AdminNav";

const AdminStat = () => {
   const [tutorList, setTutorList] = useState([]);
  
    useEffect(() => {
        const fetchBookings = async () => {
            const {data, error} = await supabase
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

  const generateReport = () => {
    //pls help
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
          <p>In statistics, you can monitor activities, track performance metrics, and generate reports.</p>
        </div>
      </div>

      <div className="stat-content">
        <div className="box-placeholder">
            <div>
                <h2>Instructors</h2>
                <small>Click a tutor to access their Performance Metrics</small>
            </div>
            <div>
                <button className="generate-report-button" onClick={generateReport}>Generate Report</button>
                <small>Click to generate performance rating report.</small>
            </div>
        </div>
        <div className="tutors-display">
            <PerformanceCard tutorList={tutorList}/>
        </div>
      </div>
    </div>
    </>
  );
};

export default AdminStat;

//generate csv file
//add onClick to per card
