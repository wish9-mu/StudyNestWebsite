import React, { useState, useEffect } from "react";
import "./AdminStat.css";
import PerformanceCard from "./PerformanceCard";
import GenerateReport from "./GenerateReport";
import ReportedIssues from "./ReportedIssues";
import AdminBackup from "./AdminBackup";
import { supabase } from "../../supabaseClient";
import AdminNav from "../Nav/AdminNav";
import AdminSidebar from "./AdminSideBar";
import "./AdminSideBar.css";
import defaultAvatar from "../../assets/default-avatar.png";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, PieChart, Pie, Legend, Cell } from 'recharts';


const AdminStat = () => {
  const [tutorList, setTutorList] = useState([]);
  const [tuteeList, setTuteeList] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [viewMode, setViewMode] = useState("list");
  const [activeTab, setActiveTab] = useState("studynest");

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

  const [webappBreakdown, setWebappBreakdown] = useState({});
  const [overallRating, setOverallRating] = useState(null);
  const webappLabels = {
    webapp1: "Ease of Navigation",
    webapp2: "Ease of Booking",
    webapp3: "Calendar & Availability Display",
    webapp4: "Timely Notifications",
    webapp5: "Convenient Rescheduling",
  };

  /*Charts*/
  const [bookingTimelineData, setBookingTimelineData] = useState([]);
  const [monthlyBookingStats, setMonthlyBookingStats] = useState([]);
  const toDate = new Date(); // now
  const fromDate = new Date();
  fromDate.setMonth(fromDate.getMonth() - 5);
  fromDate.setDate(1); // start of the 5-month window

  const pieData = [
    { status: "Accepted", value: totalAccepted },
    { status: "Pending", value: totalPending },
    { status: "Completed", value: totalCompleted },
    { status: "Cancelled", value: totalCancelled },
    { status: "Rejected", value: totalRejected },
  ];

  const bookingData = [
    {
      type: "Bookings",
      accepted: totalAccepted,
      pending: totalPending,
      completed: totalCompleted,
      cancelled: totalCancelled,
      rejected: totalRejected,
    },
  ];



  useEffect(() => {
    const fetchTutors = async () => {
      const { data, error } = await supabase.from("profiles").select("*").eq("role", "tutor");
      if (!error) {
        setTutorList(data);
        setTotalTutors(data.length);
      }
    };
    fetchTutors();
  }, []);

  useEffect(() => {
    const fetchTutees = async () => {
      const { data, error } = await supabase.from("profiles").select("*").eq("role", "tutee");
      if (!error) {
        setTuteeList(data);
        setTotalTutees(data.length);
      }
    };
    fetchTutees();
  }, []);

  useEffect(() => {
    const fetchBookingStats = async () => {
      const [total, pending, accepted, completed, cancelled, rejected] = await Promise.all([
        supabase.from("bookings").select("*"),
        supabase.from("bookings").select("*").eq("status", "pending"),
        supabase.from("bookings").select("*").eq("status", "accepted"),
        supabase.from("bookings_history").select("*").eq("status", "completed"),
        supabase.from("bookings_history").select("*").eq("status", "cancelled"),
        supabase.from("bookings_history").select("*").eq("status", "rejected"),
      ]);
      setTotalBookings(total.data.length);
      setTotalPending(pending.data.length);
      setTotalAccepted(accepted.data.length);
      setTotalCompleted(completed.data.length);
      setTotalCancelled(cancelled.data.length);
      setTotalRejected(rejected.data.length);
    };
    fetchBookingStats();
  }, []);


  useEffect(() => {
    const fetchTopUsers = async () => {
      const [topTutorsData, topTuteesData] = await Promise.all([
        supabase.rpc("get_top_tutors"),
        supabase.rpc("get_top_tutees"),
      ]);
      if (!topTutorsData.error) setTopTutors(topTutorsData.data);
      if (!topTuteesData.error) setTopTutees(topTuteesData.data);
    };
    fetchTopUsers();
  }, []);

  useEffect(() => {
    const fetchOverallRating = async () => {
      const { data: feedbacks } = await supabase.from("feedback").select("webapp_responses");
      const allScores = [];
      const breakdown = {};
      feedbacks.forEach((fb) => {
        let responses = typeof fb.webapp_responses === "string"
          ? JSON.parse(fb.webapp_responses)
          : fb.webapp_responses;
        for (const [key, value] of Object.entries(responses)) {
          const num = Number(value);
          if (!isNaN(num)) {
            allScores.push(num);
            if (!breakdown[key]) breakdown[key] = [];
            breakdown[key].push(num);
          }
        }
      });
      const avg = allScores.reduce((a, b) => a + b, 0) / allScores.length;
      setOverallRating(avg.toFixed(2));
      const avgBreakdown = {};
      for (const [key, values] of Object.entries(breakdown)) {
        avgBreakdown[key] = (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1);
      }
      setWebappBreakdown(avgBreakdown);
    };
    fetchOverallRating();
  }, []);

  useEffect(() => {
    const fetchMonthlyBookingStats = async () => {

      // ✅ Fetch from both tables
      const [historyRes, pendingRes, acceptedRes] = await Promise.all([
        supabase
          .from("bookings_history")
          .select("id, completed_at, status")
          .gte("completed_at", fromDate.toISOString())
          .lte("completed_at", toDate.toISOString()),

        supabase
          .from("bookings")
          .select("id, session_date, status")
          .eq("status", "pending")
          .gte("session_date", fromDate.toISOString())
          .lte("session_date", toDate.toISOString()),

        supabase
          .from("bookings")
          .select("id, session_date, status")
          .eq("status", "accepted")
          .gte("session_date", fromDate.toISOString())
          .lte("session_date", toDate.toISOString()),
      ]);

      console.log("📅 Fetching data from:", fromDate.toISOString(), "to", toDate.toISOString());

      if (historyRes.error || pendingRes.error) {
        console.error("❌ Error fetching booking history or pending:", historyRes.error || pendingRes.error);
        return;
      }

      const combined = [
        ...(historyRes.data || []),
        ...(pendingRes.data || []),
        ...(acceptedRes.data || []),
      ];

      const monthMap = {};

      combined.forEach(({ completed_at, session_date, status }) => {
        let date = null;

        if (status === "pending") {
          date = new Date(session_date);
        } else if (status === "accepted") {
          date = new Date(session_date); // <- use session_date for accepted too
        } else {
          date = new Date(completed_at);
        }

        const year = date.getFullYear();
        const monthNum = date.getMonth();
        const displayMonth = date.toLocaleString("default", {
          month: "long",
          year: "numeric",
        });
        const sortableMonth = `${year}-${String(monthNum + 1).padStart(2, "0")}`;

        if (!monthMap[sortableMonth]) {
          monthMap[sortableMonth] = {
            month: sortableMonth,
            displayMonth,
            accepted: 0,
            completed: 0,
            pending: 0,
            cancelled: 0,
          };
        }

        if (["completed", "pending", "cancelled", "accepted"].includes(status)) {
          monthMap[sortableMonth][status]++;
        }
      });

      const monthlyData = Object.values(monthMap).sort((a, b) =>
        new Date(`${a.month}-01`) - new Date(`${b.month}-01`)
      );
      setMonthlyBookingStats(monthlyData);

    };

    fetchMonthlyBookingStats();
  }, []);


  const renderStars = (average) => {
    if (!average || isNaN(average)) return "N/A";
    const rounded = Math.floor(Number(average));
    return Array.from({ length: 5 }, (_, i) => (i < rounded ? "⭐" : " ")).join(" ");
  };

  const handleCardClick = (user) => setSelectedUser(user);
  const closePerformanceCard = () => setSelectedUser(null);
  const closeReportCard = () => setSelectedUser(null);

  const chartData = Object.entries(webappBreakdown).map(([key, avg]) => ({
    category: webappLabels[key] || key,
    score: parseFloat(avg),
  }));

  const monthlyBookingsData = monthlyBookingStats.map(item => {
    const monthLabel = new Date(`${item.month}-01`).toLocaleString("default", {
      month: "short"
    });

    const totalBookings = item.completed + item.pending + item.cancelled;

    return {
      month: monthLabel,
      bookings: totalBookings
    };
  });

  console.log("🧭 Current active tab:", activeTab);
  return (
    <>
      <AdminNav />
      <div className="profile-layout">
        <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="tutee-profile-content">
          
          <div className="admin-stat">

            {activeTab === "studynest" && (
              <>
                <div className="overall-rating-card">
                  <h2>StudyNest Overall Rating</h2>
                  <div className="rating-value">
                    {renderStars(overallRating)}
                    <h2>{overallRating ? `${overallRating} / 5` : "No rating yet"}</h2>
                  </div>
                </div>

                <div className="rating-breakdown-section">
                  <div className="graph-view">
                    <h4>Graph View of WebApp Ratings</h4>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={chartData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" domain={[0, 5]} />
                        <YAxis dataKey="category" type="category" width={160} />
                        <Tooltip formatter={(value) => [`${value} / 5`, 'Score']} />
                        <Bar dataKey="score" fill="#e53e3e" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="score-list-view">
                    <h4>Score List</h4>
                    <ul className="breakdown-list">
                      {chartData.map(({ category, score }) => (
                        <li key={category} className="breakdown-item">
                          <span className="label">{category}</span>
                          <span className="score">{score} / 5</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

              </>
            )}

            {activeTab === "people" && (
              <div className="people-performance">
                  <div className="statistics-summary">
                    <div className="stat-card"><h3>Total Tutors</h3><p>{totalTutors}</p></div>
                    <div className="stat-card"><h3>Total Tutees</h3><p>{totalTutees}</p></div>
                    <div className="stat-card"><h3>Total Bookings</h3><p>{totalBookings}</p></div>
                    <div className="stat-card"><h3>Pending</h3><p>{totalPending}</p></div>
                    <div className="stat-card"><h3>Accepted</h3><p>{totalAccepted}</p></div>
                    <div className="stat-card"><h3>Completed</h3><p>{totalCompleted}</p></div>
                    <div className="stat-card"><h3>Cancelled</h3><p>{totalCancelled}</p></div>
                    <div className="stat-card"><h3>Rejected</h3><p>{totalRejected}</p></div>
                  </div>

                <div className="dual-graph-section">
                  {/* Bookings Timeline */}
                  <div className="graph-container">
                    <h4>Monthly Bookings Overview</h4>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={monthlyBookingStats}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="displayMonth" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="completed" fill="#3182ce" name="Completed" />
                        <Bar dataKey="pending" fill="#ecc94b" name="Pending" />
                        <Bar dataKey="cancelled" fill="#e53e3e" name="Cancelled" />
                        <Bar dataKey="accepted" fill="#63b3ed" name="Accepted" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Pie Chart */}
                  <div className="graph-container">
                    <h4>Booking Status Ratio</h4>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={pieData}
                          dataKey="value"
                          nameKey="status"
                          outerRadius={100}
                          label
                        >
                          <Cell fill="#38a169" />
                          <Cell fill="#ecc94b" />
                          <Cell fill="#3182ce" />
                          <Cell fill="#e53e3e" />
                          <Cell fill="#718096" />
                        </Pie>
                        <Tooltip formatter={(value) => [`${value}`, 'Count']} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <GenerateReport
                  monthlyStats={{
                    monthlyBookingsData: Array.isArray(monthlyBookingStats)
                      ? monthlyBookingStats.map(item => {
                          if (!item.month) console.warn("⚠️ Missing or invalid month in booking item:", item);
                          return {
                            month: item.month
                              ? new Date(`${item.month}-01`).toLocaleString("default", { month: "short" })
                              : "Invalid",
                            accepted: item.accepted || 0,
                            pending: item.pending || 0,
                            completed: item.completed || 0,
                            cancelled: item.cancelled || 0
                          };
                        })
                      : [],
                    bookingStatusData: [
                      { status: "Completed", value: totalCompleted },
                      { status: "Pending", value: totalPending },
                      { status: "Accepted", value: totalAccepted },
                      { status: "Cancelled", value: totalCancelled },
                      { status: "Rejected", value: totalRejected },
                    ],
                  }}
                />

                <h2>Tutors</h2>
                <div className="tutors-display">
                  {tutorList.map(tutor => (
                    <div key={tutor.id} className="tutor-card" onClick={() => handleCardClick(tutor)}>
                      <img src={tutor.profile_picture || defaultAvatar} alt="Tutor" className="profile-img" />
                      <h3>{tutor.first_name} {tutor.last_name}</h3>
                      <p>{tutor.email}</p>
                    </div>
                  ))}
                </div>

                <h2>Tutees</h2>
                <div className="tutors-display">
                  {tuteeList.map(tutee => (
                    <div key={tutee.id} className="tutor-card" onClick={() => handleCardClick(tutee)}>
                      <img src={tutee.profile_picture || defaultAvatar} alt="Tutee" className="profile-img" />
                      <h3>{tutee.first_name} {tutee.last_name}</h3>
                      <p>{tutee.email}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "reports" && (
              <ReportedIssues />
            )}

            {activeTab === "backup" && (
              <AdminBackup />
            )}
          </div>
        </div>
      </div>
      {selectedUser && <PerformanceCard user={selectedUser} onClose={closePerformanceCard} />}
    </>
  );
};

export default AdminStat;