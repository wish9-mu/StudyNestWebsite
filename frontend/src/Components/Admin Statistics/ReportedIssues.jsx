import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import "./ReportedIssues.css";
import defaultAvatar from "../../assets/default-avatar.png";

const ReportedIssues = () => {

  /*Reports*/
  const [reportIssues, setReportIssues] = useState([]); 
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [isIssueOpen, setIsIssueOpen] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [isResolving, setIsResolving] = useState(false);
  const [resolvedIssues, setResolvedIssues] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      const [pendingRes, resolvedRes] = await Promise.all([
        supabase
          .from("reports")
          .select(`
            *,
            profiles (
              first_name,
              last_name,
              role
            )
          `)
          .eq("status", "pending"),
        supabase
          .from("reports")
          .select(`
            *,
            profiles (
              first_name,
              last_name,
              role
            )
          `)
          .eq("status", "resolved")
      ]);

      if (pendingRes.error || resolvedRes.error) {
        console.error("Error fetching reports:", pendingRes.error || resolvedRes.error);
      } else {
        console.log("Fetched pending:", pendingRes.data);
        console.log("Fetched resolved:", resolvedRes.data);
        setReportIssues(pendingRes.data);
        setResolvedIssues(resolvedRes.data);
      }
    };

    fetchReports();
  }, []);

  const resolveReport = async (reportId) => {
    console.log("Resolving report ID:", reportId);
    setIsResolving(true);

    const resolvedAt = new Date().toISOString();

    const { error } = await supabase
      .from("reports")
      .update({ status: "resolved", 
        updated_at: resolvedAt,
      })
      .eq("id", reportId);

    if (error) {
      console.error("Error resolving report:", error);
      setStatusMessage("❌ Failed to resolve the issue.");
      setIsResolving(false);
    } else {
      console.log("✅ Issue resolved at:", resolvedAt);
      setReportIssues(reportIssues.filter((issue) => issue.id !== reportId));
      
      const updatedIssue = reportIssues.find((issue) => issue.id === reportId);
      if (updatedIssue) {
        updatedIssue.status = "resolved";
        updatedIssue.updated_at = resolvedAt;
        setResolvedIssues([updatedIssue, ...resolvedIssues]);
      }


      setStatusMessage("✅ Issue successfully resolved.");
    
      // Clear the message after 3 seconds
      setTimeout(() => {
        console.log("Clearing status message...");
        setStatusMessage("");
      }, 3000);

      // ⏱️ Close modal after 5 seconds
      setTimeout(() => {
        console.log("Closing modal after issue resolved...");
        setIsIssueOpen(false);
        setIsResolving(false);
      }, 5000);

    }
  };

  const openReportDetails = (issue) => {
    setSelectedIssue(issue);
    setIsIssueOpen(true);
  };

  const closeReportCard = () => {
    setIsIssueOpen(false);
  };

  const formatTime = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const capitalizeWords = (str) =>
    str.replace(/\b\w/g, (char) => char.toUpperCase());

  return (
    <>
      <div className="report-cards">
        <div className="header">
          <div className="header-text">
            <h1>Reported Issues</h1>
          </div>
          <div className="header-info">
            <p>View all reported and pending issues here.</p>
          </div>
        </div>
        
        <div>
          {reportIssues.length === 0 ? (
            <h2>No reports available</h2>
          ) : (
            reportIssues.map((issue) => (
              <div className="report-card" key={issue.id}>
                <h3>{capitalizeWords(issue.title)}</h3>
                <p>
                  <strong>
                    {new Date(issue.created_at).toLocaleString([], {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    })}
                  </strong>
                  <br />  
                  <strong>
                    {new Date(issue.created_at).toLocaleString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    })}
                  </strong>
                </p>
                <p>
                  <strong>Reported by:</strong>
                  <br />
                  {issue.profiles
                    ? `${issue.profiles.first_name} ${issue.profiles.last_name}`
                    : "Unknown User"}
                  <br />
                  <i>{issue.profiles?.role ? `(${capitalizeWords(issue.profiles.role)})` : ""}</i>
                </p>
                <button onClick={() => openReportDetails(issue)}>View Details</button>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="resolved-section">
        <div className="header">
          <div className="header-text">
            <h1>Resolved Issues</h1>
          </div>
          <div className="header-info">
            <p>View all resolved issues here.</p>
          </div>
        </div>
      
        <div>
          {resolvedIssues.length === 0 ? (
            <p>No resolved issues yet.</p>
          ) : (
            <div className="report-cards">
              {resolvedIssues.map((issue) => (
                <div className="report-card" key={issue.id}>
                  <h3>{capitalizeWords(issue.title)}</h3>
                  <p>
                    <strong>
                      {new Date(issue.created_at).toLocaleString([], {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      })}
                    </strong>
                    <br />  
                    <strong>
                      {new Date(issue.created_at).toLocaleString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      })}
                    </strong>
                  </p>
                  <p>
                    <strong>Reported by:</strong>
                    <br />
                    {issue.profiles
                      ? `${issue.profiles.first_name} ${issue.profiles.last_name}`
                      : "Unknown User"}
                    <br />
                    <i>{issue.profiles?.role ? `(${capitalizeWords(issue.profiles.role)})` : ""}</i>
                  </p>
                  <button onClick={() => openReportDetails(issue)}>View Details</button>
                </div>
              ))}
            </div>
          )}
        </div>
    </div>


      {isIssueOpen && selectedIssue && (
        <div className="modal-overlay">
          <div className="modal">
            <button className="close-btn" onClick={closeReportCard}>✖</button>
            <h2>{capitalizeWords(selectedIssue.title)}</h2>
            <div className="modal-content">
              <div className="left-info">
                <p><strong>Reported by:</strong><br /> 
                  {selectedIssue.profiles
                    ? `${selectedIssue.profiles.first_name} ${selectedIssue.profiles.last_name}`
                    : "Unknown User"}
                    <br />
                    <i>{selectedIssue.profiles?.role ? `(${capitalizeWords(selectedIssue.profiles.role)})` : ""}</i>
                </p>
                <p><strong>Time:</strong><br /> 
                  {new Date(selectedIssue.created_at).toLocaleTimeString([], {
                    hour: "2-digit", minute: "2-digit"
                  })}
                </p>
                <p><strong>Date:</strong><br /> 
                  {new Date(selectedIssue.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>

              <div className="right-description">
                <h4>Issue Description</h4>
                <p className="description-text">{selectedIssue.description}</p>
              </div>
            </div>

            {statusMessage && (
              <div className="status-message">
                {statusMessage}
              </div>
            )}

            {selectedIssue.status === "pending" && (
              <div className="resolve-btn-container">
              <button className="resolve-btn" 
              onClick={() => resolveReport(selectedIssue.id)}
              disabled={isResolving || selectedIssue.status === "resolved"}>
                { selectedIssue.status === "resolved"
                ? "Already Resolved"
                : isResolving 
                ? "Resolving..." : "Issue Resolved"}
              </button>
            </div>
            )}
          </div>
        </div>
      )}

    </>
  );
};

export default ReportedIssues;
