import React, { useState, useEffect } from "react";
import { CSVLink } from "react-csv";
import { supabase } from "../../supabaseClient";
import "./AdminStat.css";

const GenerateReport = () => {
  const [loading, setLoading] = useState({
    profiles: false,
    bookings: false,
    bookings_history: false,
  });
  const [filename, setFilename] = useState("");
  const [csvData, setCsvData] = useState([]);
  const [triggerDownload, setTriggerDownload] = useState(false);
  const [csvHeaders, setCsvHeaders] = useState([]);
  const [error, setError] = useState("");

  const columnConfigs = {
    profiles: [
      { label: "First Name", key: "first_name" },
      { label: "Last Name", key: "last_name" },
      { label: "Student Number", key: "student_number" },
      { label: "Role", key: "role" },
      { label: "Email", key: "email" },
      { label: "Year", key: "year" },
      { label: "Program", key: "program" },
    ],

    bookings: [
      { label: "Course Code", key: "course_code" },
      { label: "Request Date", key: "request_date" },
      { label: "Session Date", key: "session_date" },
      { label: "Status", key: "status" },
      { label: "Tutor Name", key: "tutor_name" },
      { label: "Tutee Name", key: "tutee_name" },
      { label: "Start Time", key: "start_time" },
      { label: "End Time", key: "end_time" },
      { label: "Notes", key: "notes" },
    ],

    bookings_history: [
      { label: "Course Code", key: "course_code" },
      { label: "Request Date", key: "request_date" },
      { label: "Session Date", key: "session_date" },
      { label: "Status", key: "status" },
      { label: "Tutor Name", key: "tutor_name" },
      { label: "Tutee Name", key: "tutee_name" },
      { label: "Start Time", key: "start_time" },
      { label: "End Time", key: "end_time" },
      { label: "Date/Time Completed", key: "completed_at" },
    ],
  };

  const generateReport = async (type) => {
    setLoading((prev) => ({ ...prev, [type]: true }));

    console.log(`Attempting to generate ${type} report. `);

    try {
      let data;
      let error;

      if (type === "profiles") {
        const result = await supabase.from(type).select("*");

        data = result.data;
        error = result.error;
      } else {
        const result = await supabase.from(type).select(`
                    *,
                    tutor:profiles!tutor_id(first_name, last_name),
                    tutee:profiles!tutee_id(first_name, last_name)`);

        data = result.data;
        error = result.error;
      }

      if (error) {
        console.error(`Error fetching ${type}:`, error);
        setError(`Error fetching data: ${error.message}`);
        return;
      }

      console.log("Fetched data:", data);
      console.log("Tutor data:", data[0]?.tutor);

      if (!data || data.length === 0) {
        console.log(`No data available for ${type}.`);
        setError(`No data available for that report.`);

        setTimeout(() => {
          setError("");
        }, 3000);

        return;
      }

      const columnConfig = columnConfigs[type] || [];
      const dateFields = ["request_date", "session_date", "completed_at"];
      setCsvHeaders(columnConfig);

      const filteredData = data.map((item) => {
        const filteredItem = {};

        if (type === "bookings" || type === "bookings_history") {
          item.tutor_name = item.tutor
            ? `${item.tutor.first_name} ${item.tutor.last_name}`
            : "";
          item.tutee_name = item.tutee
            ? `${item.tutee.first_name} ${item.tutee.last_name}`
            : "";
        }

        columnConfig.forEach((header) => {
          const value = item[header.key];

          if (dateFields.includes(header.key) && value) {
            const date = new Date(value);
            if (!isNaN(date)) {
              filteredItem[header.key] = "'" + date.toISOString().split("T")[0];
              return;
            }
          }

          if (header.key === "student_number" && value) {
            filteredItem[header.key] = "'" + value;
            return;
          }

          if (typeof value === "number") {
            filteredItem[header.key] = "'" + value.toString();
          } else if (value === null || value === undefined) {
            filteredItem[header.key] = "";
          } else {
            filteredItem[header.key] = value;
          }
        });
        return filteredItem;
      });

      setCsvData(filteredData);
      setFilename(
        `${type}_report_${new Date().toISOString().slice(0, 10)}.csv`
      );

      setTriggerDownload(true);
    } catch (error) {
      console.error("Unexpected error:", error);
    } finally {
      setLoading((prev) => ({ ...prev, [type]: false }));
    }
  };

  useEffect(() => {
    if (triggerDownload && csvData.length > 0) {
      document.getElementById("csvDownloadLink").click();
      console.log("CSV download started!");
      setTriggerDownload(false);
    }
  }, [triggerDownload, csvData]);

  return (
    <div className="report-generation-section">
      <div>
        <h2>Generate Report</h2>
        <small>Generate summarized reports below.</small>
        {error && <p style={{ color: "#e53e3e" }}>{error}</p>}
      </div>
      <div className="horizontal-buttons-container">
        <button
          className="generate-report-button"
          onClick={() => generateReport("profiles")}
          disabled={loading.profiles}
        >
          {loading.profiles ? "Generating..." : "Generate Users Report"}
        </button>
        <button
          className="generate-report-button"
          onClick={() => generateReport("bookings")}
          disabled={loading.bookings}
        >
          {loading.bookings ? "Generating..." : "Generate Bookings Report"}
        </button>
        <button
          className="generate-report-button"
          onClick={() => generateReport("bookings_history")}
          disabled={loading.bookings_history}
        >
          {loading.bookings_history
            ? "Generating..."
            : "Generate Archived Bookings Report"}
        </button>
      </div>

      <CSVLink
        id="csvDownloadLink"
        data={csvData}
        headers={csvHeaders}
        filename={filename}
        className="hidden"
        target="_blank"
      />
    </div>
  );
};

export default GenerateReport;
