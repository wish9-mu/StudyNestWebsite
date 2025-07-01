import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import "./ReportIssue.css";

const ReportIssue = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [userId, setUserId] = useState(null);

  // 🔹 Get current user's ID (tutee_id)
  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        setUserId(session.user.id);
      } else {
        setStatusMessage("⚠️ You must be logged in to report an issue.");
      }
    };

    getSession();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description) {
      setStatusMessage("Please fill in all fields.");
      return;
    }

    const { error } = await supabase.from("issue_reports").insert([
      {
        tutee_id: userId,
        title,
        description,
        status: "pending", // optional since it has default, but good for clarity
      },
    ]);

    if (error) {
      console.error("❌ Error submitting report:", error);
      setStatusMessage("❌ Failed to submit issue. Please try again.");
    } else {
      setStatusMessage("✅ Your issue has been submitted.");
      setTitle("");
      setDescription("");
    }
  };

  return (
    <div className="report-issue-container">
      <h2>Report an Issue</h2>
      <form onSubmit={handleSubmit} className="report-form">
        <label>
          Issue Title:
          <input
            type="text"
            placeholder="e.g. Can't book a session"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </label>

        <label>
          Description:
          <textarea
            placeholder="Describe the issue in detail..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </label>

        <button type="submit" disabled={!userId}>
          Submit Issue
        </button>

        {statusMessage && <p className="status-message">{statusMessage}</p>}
      </form>
    </div>
  );
};

export default ReportIssue;
