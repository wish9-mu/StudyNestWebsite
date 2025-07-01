// ✅ UPDATED GenerateReport.jsx with conditional chart rendering and titles
import React, { useState, useEffect } from "react";
import { CSVLink } from "react-csv";
import { supabase } from "../../supabaseClient";
import "./AdminStat.css";
import jsPDF from "jspdf";
import "jspdf-autotable";
import html2canvas from "html2canvas";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LabelList,
  Legend
} from "recharts";
import logo from "../../assets/SNHome.png";

const GenerateReport = ({ monthlyStats }) => {
  const [loading, setLoading] = useState({
    profiles: false,
    bookings: false,
    bookings_history: false,
  });
  const [filename, setFilename] = useState("");
  const [csvData, setCsvData] = useState([]);
  const [csvHeaders, setCsvHeaders] = useState([]);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [reportType, setReportType] = useState("");

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
      if (error) return setError(error.message);
      if (!data || data.length === 0) return setError("No data found.");

      const columnConfig = columnConfigs[type] || [];
      const dateFields = ["request_date", "session_date", "completed_at"];
      setCsvHeaders(columnConfig);

      const filteredData = data.map((item) => {
        const filteredItem = {};
        if (type.includes("bookings")) {
          item.tutor_name = item.tutor ? `${item.tutor.first_name} ${item.tutor.last_name}` : "";
          item.tutee_name = item.tutee ? `${item.tutee.first_name} ${item.tutee.last_name}` : "";
        }
        columnConfig.forEach((header) => {
          let value = item[header.key];
          if (dateFields.includes(header.key) && value) {
            const date = new Date(value);
            filteredItem[header.key] = !isNaN(date) ? date.toLocaleDateString("en-US") : value;
          } else {
            filteredItem[header.key] = value ?? "";
          }
        });
        return filteredItem;
      });

      setCsvData(filteredData);
      setReportType(type);
      setFilename(`${type}_report_${new Date().toISOString().slice(0, 7)}.csv`);
      setShowModal(true);
    } catch (err) {
      setError("Unexpected error generating report.");
    } finally {
      setLoading((prev) => ({ ...prev, [type]: false }));
    }
  };

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28EFF"];

  const MonthlyBookingsChart = ({ data }) => (
    <div id="monthly-bookings-chart" style={{ position: "absolute", left: "-9999px", width: 600, height: 300 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="accepted" fill="#63b3ed">
            <LabelList dataKey="accepted" position="top" />
          </Bar>
          <Bar dataKey="pending" fill="#ecc94b">
            <LabelList dataKey="pending" position="top" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );

  const ArchivedBookingsChart = ({ data }) => (
    <div id="archived-bookings-chart" style={{ position: "absolute", left: "-9999px", width: 600, height: 300 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="completed" fill="#38a169">
            <LabelList dataKey="completed" position="top" />
          </Bar>
          <Bar dataKey="cancelled" fill="#e53e3e">
            <LabelList dataKey="cancelled" position="top" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );

  const BookingStatusRatioChart = ({ data }) => (
    <div id="booking-status-ratio-chart" style={{ position: "absolute", left: "-9999px", width: 600, height: 300 }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="status"
            outerRadius={100}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [`${value}`, "Count"]} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );

  const getBase64FromImage = (imgPath) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "Anonymous"; // Needed for local assets
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        const dataURL = canvas.toDataURL("image/png");
        resolve(dataURL);
      };
      img.onerror = reject;
      img.src = imgPath;
    });
  };

  const generatePDF = async () => {
    const doc = new jsPDF();
    const titleMap = {
      profiles: "User Report",
      bookings: "Bookings Report",
      bookings_history: "Archived Bookings Report",
    };

    const title = titleMap[reportType] || "Report";
    const dateStr = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    const fileName = `${dateStr}_${title}.pdf`;

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // 📷 Load logo as base64
    const logoBase64 = await getBase64FromImage(logo);

    // 🔴 Red header background
    doc.setFillColor("#e53e3e");
    doc.rect(0, 0, pageWidth, 25, "F");

    // 🖼 Expanded logo (wider)
    doc.addImage(logoBase64, "PNG", 10, 6, 60, 15); // Wider, thinner


    // 📘 Report title (right-aligned)
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor("#ffffff");
    const titleWidth = doc.getTextWidth(title);
    doc.text(title, pageWidth - titleWidth - 10, 14);

    let currentY = 40; // Ensure space below header

    // 📊 Insert charts if available
    const insertChart = async (elementId) => {
      const chart = document.getElementById(elementId);
      if (chart) {
        const canvas = await html2canvas(chart);
        doc.addImage(canvas.toDataURL("image/png"), "PNG", 15, currentY, 160, 80);
        currentY += 90;
      }
    };

    if (monthlyStats && reportType === "bookings") await insertChart("monthly-bookings-chart");
    if (monthlyStats && reportType === "bookings_history") await insertChart("archived-bookings-chart");
    if (monthlyStats && reportType !== "profiles") await insertChart("booking-status-ratio-chart");

    // 🧾 Table
    const tableColumn = csvHeaders.map((h) => h.label);
    const tableRows = csvData.map((row) => csvHeaders.map((h) => row[h.key]));

    if (currentY < 40) currentY = 40;
    currentY += 5;

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: currentY,
      margin: { top: 35, bottom: 20 },
      didDrawPage: () => {
        const page = doc.internal.getCurrentPageInfo().pageNumber;
        const totalPages = doc.internal.getNumberOfPages();

        // 🔴 Red header background
        doc.setFillColor("#e53e3e");
        doc.rect(0, 0, pageWidth, 25, "F");

        // 🖼 Expanded logo
        doc.addImage(logoBase64, "PNG", 10, 6, 50, 12);

        // 📘 Report title (right-aligned)
        doc.setFont("helvetica", "normal");
        doc.setFontSize(12);
        doc.setTextColor("#ffffff");
        const titleWidth = doc.getTextWidth(title);
        doc.text(title, pageWidth - titleWidth - 10, 14);

        // 🦶 Footer
        doc.setFontSize(9);
        doc.setTextColor("#666666");
        const footerText = `Generated on ${dateStr} | Page ${page} of ${totalPages}`;
        const footerWidth = doc.getTextWidth(footerText);
        doc.text(footerText, (pageWidth - footerWidth) / 2, pageHeight - 10);
      },
    });

    // 💾 Save the file
    doc.save(fileName);
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
            <button className="close-btn" onClick={() => setShowModal(false)}>✖</button>
            <h3>Preview: {reportType} Report</h3>
            <table className="preview-table">
              <thead>
                <tr>{csvHeaders.map((h) => (<th key={h.key}>{h.label}</th>))}</tr>
              </thead>
              <tbody>
                {csvData.slice(0, 7).map((row, i) => (
                  <tr key={i}>{csvHeaders.map((h) => (<td key={h.key}>{row[h.key]}</td>))}</tr>
                ))}
              </tbody>
            </table>
            <p>Showing first 7 rows...</p>
            <div className="modal-footer">
              <CSVLink data={csvData} headers={csvHeaders} filename={filename} className="download-csv-btn">
                Download CSV
              </CSVLink>
              <button className="generate-pdf-btn" onClick={generatePDF}>Generate PDF</button>
            </div>
          </div>
        </div>
      )}
      {/* 🔒 Hidden Charts for PDF */}
      {monthlyStats && reportType === "bookings" && <MonthlyBookingsChart data={monthlyStats.monthlyBookingsData} 
        style={{ position: "absolute", left: "-9999px", width: 600, height: 300 }}
        />}
      {monthlyStats && reportType === "bookings_history" && <ArchivedBookingsChart data={monthlyStats.monthlyBookingsData} 
        style={{ position: "absolute", left: "-9999px", width: 600, height: 300 }}
        />}
      {monthlyStats && reportType !== "profiles" && <BookingStatusRatioChart data={monthlyStats.bookingStatusData} />}
    </div>
  );
};

export default GenerateReport;
