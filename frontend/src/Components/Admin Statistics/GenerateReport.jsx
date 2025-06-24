import React, { useState, useEffect } from "react";
import { CSVLink } from "react-csv";
import { supabase } from "../../supabaseClient";
import "./AdminStat.css";
import jsPDF from "jspdf";
import "jspdf-autotable";

const GenerateReport = () => {
  const [loading, setLoading] = useState({
    profiles: false,
    bookings: false,
    bookings_history: false,
  });
  const [filename, setFilename] = useState("");
  const [csvData, setCsvData] = useState([]);
  const [csvHeaders, setCsvHeaders] = useState([]);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false); // 🔹 Modal state
  const [reportType, setReportType] = useState(""); // 🔹 Store Report Type

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
    setShowModal(false);

    try {
      let data, error;
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

      if (!data || data.length === 0) {
        setError(`No data available for that report.`);
        setTimeout(() => setError(""), 3000);
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
          let value = item[header.key];

          if (dateFields.includes(header.key) && value) {
            const date = new Date(value);
            if (!isNaN(date)) {
              filteredItem[header.key] = date.toLocaleDateString("en-US");
              return;
            }
          }

          filteredItem[header.key] =
            value === null || value === undefined ? "" : value;
        });

        return filteredItem;
      });

      setCsvData(filteredData);
      setReportType(type);
      setShowModal(true); // 🔹 Show Modal
      setFilename(`${type}_report_${new Date().toISOString().slice(0, 7)}.csv`);
    } catch (error) {
      console.error("Unexpected error:", error);
    } finally {
      setLoading((prev) => ({ ...prev, [type]: false }));
    }
  };

  // 🔹 Generate PDF
  const generatePDF = () => {
    const doc = new jsPDF();
  
    // Title
    doc.text("Bookings Report", 14, 15);
  
    // Define Table Headers
    const tableColumn = csvHeaders.map(header => header.label);
  
    // Define Table Rows (Map Data)
    const tableRows = csvData.map(row => csvHeaders.map(header => row[header.key]));
  
    // Generate Table
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 25,
    });
  
    // Save the PDF
    doc.save("bookings_report.pdf");
  };
  
  return (
    <div className="report-generation-section">
      <h2>Generate Report</h2>
      <small>Generate summarized reports below.</small>
      {error && <p style={{ color: "#e53e3e" }}>{error}</p>}
      
      <div className="horizontal-buttons-container">
        <button className="generate-report-button" onClick={() => generateReport("profiles")} disabled={loading.profiles}>
          {loading.profiles ? "Generating..." : "Generate Users Report"}
        </button>
        <button className="generate-report-button" onClick={() => generateReport("bookings")} disabled={loading.bookings}>
          {loading.bookings ? "Generating..." : "Generate Bookings Report"}
        </button>
        <button className="generate-report-button" onClick={() => generateReport("bookings_history")} disabled={loading.bookings_history}>
          {loading.bookings_history ? "Generating..." : "Generate Archived Bookings Report"}
        </button>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            {/* Close Button */}
            <button className="close-btn" onClick={() => setShowModal(false)}>✖</button>

            <h3>Preview: {reportType} Report</h3>
            
            {/* Table Preview */}
            <table className="preview-table">
              <thead>
                <tr>
                  {csvHeaders.map((header) => (
                    <th key={header.key}>{header.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {csvData.slice(0, 7).map((row, index) => (
                  <tr key={index}>
                    {csvHeaders.map((header) => (
                      <td key={header.key}>{row[header.key]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>

            <p>Showing first 7 rows...</p>

            {/* Footer Buttons */}
            <div className="modal-footer">
              <CSVLink
                data={csvData}
                headers={csvHeaders}
                filename={filename}
                className="download-csv-btn"
              >
                Download CSV
              </CSVLink>
              <button className="generate-pdf-btn" onClick={generatePDF}>
                Generate PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GenerateReport;
