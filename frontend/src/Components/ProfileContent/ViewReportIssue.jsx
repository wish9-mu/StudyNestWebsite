import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import "../Admin Statistics/ReportedIssues.css";

const ViewReportIssue = () => {
  const [userId, setUserId] = useState(null);
  const [reportIssues, setReportIssues] = useState([]);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [isIssueOpen, setIsIssueOpen] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const capitalizeWords = (str) =>
    str.replace(/\b\w/g, (char) => char.toUpperCase());

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        setUserId(session.user.id);
      } else {
        setStatusMessage("⚠️ You must be logged in to view your submitted issues.");
      }
    };

    getSession();
  }, []);

  useEffect(() => {
    if (!userId) return;

    const fetchIssues = async () => {
      const { data, error } = await supabase
        .from("reports")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error(error);
        setStatusMessage("❌ Error loading issues.");
      } else {
        setReportIssues(data);
      }
    };

    fetchIssues();
  }, [userId]);

  const openReportDetails = (issue) => {
    setSelectedIssue(issue);
    setIsIssueOpen(true);
  };

  const closeReportCard = () => {
    setIsIssueOpen(false);
    setSelectedIssue(null);
    setStatusMessage("");
  };

  return (
    <div className="report-cards">
        <h2>Resolved Issues</h2>
        {/* 🔹 PENDING ISSUES SECTION */}
        <div>
            {reportIssues.filter(issue => issue.status === "pending").length === 0 ? (
                <h2>No pending issues.</h2>
            ) : (
                reportIssues
                .filter(issue => issue.status === "pending")
                .map((issue) => (
                    <div className="report-card" key={issue.id}>
                    <h3>{capitalizeWords(issue.title)}</h3>
                    <p>
                        <strong>
                        {new Date(issue.created_at).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })}
                        </strong>
                        <br />
                        <strong>
                        {new Date(issue.created_at).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                        })}
                        </strong>
                    </p>
                    <h4>Status: {capitalizeWords(issue.status)}</h4>
                    <button onClick={() => openReportDetails(issue)}>View Details</button>
                    </div>
                ))
            )}
        </div>

        {/* 🔹 RESOLVED ISSUES SECTION */}
            <div className="resolved-section">
            <h2>Resolved Issues</h2>
            <div>
                {reportIssues.filter(issue => issue.status === "resolved").length === 0 ? (
                <h2>No resolved issues.</h2>
                ) : (
                reportIssues
                    .filter(issue => issue.status === "resolved")
                    .map((issue) => (
                    <div className="report-card" key={issue.id}>
                        <h3>{capitalizeWords(issue.title)}</h3>
                        <p>
                        <strong>
                            {new Date(issue.updated_at).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            })}
                        </strong>
                        <br />
                        <strong>
                            {new Date(issue.updated_at).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                            })}
                        </strong>
                        </p>
                        <h4>Status: {capitalizeWords(issue.status)}</h4>
                        <button onClick={() => openReportDetails(issue)}>View Details</button>
                    </div>
                    ))
                )}
            </div>
            </div>

            {/* 🔹 MODAL (unchanged) */}
            {isIssueOpen && selectedIssue && (
            <div className="modal-overlay">
                <div className="modal">
                <button className="close-btn" onClick={closeReportCard}>✖</button>
                <h2>{capitalizeWords(selectedIssue.title)}</h2>
                <div className="modal-content">
                    <div className="left-info">
                    <p>
                        <strong>Submitted at:</strong>
                        <br />
                        {new Date(selectedIssue.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        })}
                        <br />
                        {new Date(selectedIssue.created_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        })}
                    </p>
                    {selectedIssue.status === "resolved" && (
                        <p>
                        <strong>Resolved at:</strong>
                        <br />
                        {new Date(selectedIssue.updated_at).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })}
                        <br />
                        {new Date(selectedIssue.updated_at).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                        })}
                        </p>
                    )}
                    <h4>Status: {capitalizeWords(selectedIssue.status)}</h4>
                    </div>

                    <div className="right-description">
                    <h4>Issue Description</h4>
                    <p className="description-text">{selectedIssue.description}</p>
                    </div>
                </div>
            </div>
        </div>
        )}
    </div>
    );
};

export default ViewReportIssue;
