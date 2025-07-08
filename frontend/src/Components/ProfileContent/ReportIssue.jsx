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

    // Ensure userId is valid before submitting
    if (!userId) {
      setStatusMessage("⚠️ User not logged in.");
      return;
    }

    const { error } = await supabase.from("reports").insert([
      {
        user_id: userId,
        title,
        description,
        status: "pending", // optional since it has default, but good for clarity
      },
    ]);

    if (error) {
      console.error("❌ Error submitting report:", error);
      setStatusMessage("❌ Failed to submit issue. Please try again.");
    } else {
      console.log("✅ Report submitted:", { title, description });
      setStatusMessage("✅ Your issue has been submitted.");
      setTitle("");
      setDescription("");
    }

    // ⏱️ Clear message after 3 seconds
    setTimeout(() => {
      console.log("⏳ Clearing status message...");
      setStatusMessage("");
    }, 3000);
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="report-form">
        <label>
          Issue:
          <input
            type="text"
            placeholder="e.g. Can't book a session"
            value={title || ""} // Ensure the value is never undefined
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </label>

        <label>
          Description:
          <textarea
            placeholder="Describe the issue in detail..."
            value={description || ""} // Ensure the value is never undefined
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
