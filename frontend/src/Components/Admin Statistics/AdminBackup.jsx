import React, { useState, useEffect, useRef } from "react";
import { supabase } from "../../supabaseClient";
import { backupAllTables, backupSingleTable, recoverFromBackup } from "./backupUtils";
import { saveAs } from "file-saver";
import "./AdminBackup.css";

const AdminBackup = () => {
  const [tables, setTables] = useState([]);
  const [uploadFile, setUploadFile] = useState(null);
  const [logs, setLogs] = useState([]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchTables();
    fetchLogs();
    setupRealtimeLogUpdates();
  }, []);

  const fetchTables = async () => {
    const { data, error } = await supabase.rpc("get_user_tables");
    if (error) return console.error("❌ Error fetching tables:", error.message);
    setTables(data.map((t) => t.table_name));
  };

  const fetchLogs = async () => {
    const { data, error } = await supabase
      .from("backups")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) setLogs(data);
  };

  const setupRealtimeLogUpdates = () => {
    supabase.channel("backup-logs")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "backups" }, () => {
        fetchLogs();
      })
      .subscribe();
  };

  const handleSingleBackup = async (tableName) => {
    const success = await backupSingleTable(tableName);
    if (success) fetchLogs();
  };

  const handleFullBackup = async () => {
    const success = await backupAllTables(tables);
    if (success) fetchLogs();
  };

  const handleFileChange = (e) => {
    setUploadFile(e.target.files[0]);
  };

  const handleRecovery = async () => {
    if (!uploadFile) return alert("Please select a backup file.");

    if (!uploadFile.name.endsWith(".json") && !uploadFile.name.endsWith(".zip")) {
      return alert("Invalid file type. Must be .json or .zip");
    }

    try {
      await recoverFromBackup(uploadFile);
      fileInputRef.current.value = "";
      setUploadFile(null);
    } catch (err) {
      alert("Error recovering from backup: " + err.message);
      console.error(err);
    }
  };

  return (
    <div className="admin-backup-container">
  <h2>Backup & Recovery</h2>

  <div className="admin-backup-section">
    <h3>Backup Options</h3>
    <div className="backup-buttons">
      <button onClick={handleFullBackup}>Download Full Backup (ZIP)</button>
      {tables.map((table) => (
        <button key={table} onClick={() => handleSingleBackup(table)}>
          Backup {table}
        </button>
      ))}
    </div>
  </div>

  <div className="admin-backup-section">
    <h3>Restore From Backup</h3>
    <input
      className="restore-file-input"
      type="file"
      accept=".json,.zip"
      onChange={handleFileChange}
      ref={fileInputRef}
    />
    <div className="restore-buttons">
      <button onClick={handleRecovery}>Recover Table</button>
    </div>
  </div>

  <div className="admin-backup-section">
    <h3>Backup Logs</h3>
    <table className="backup-log-table">
      <thead>
        <tr>
          <th>Date</th>
          <th>File</th>
          <th>Type</th>
          <th>Tables</th>
          <th>Version</th>
        </tr>
      </thead>
      <tbody>
        {logs.map((log) => (
          <tr key={log.id}>
            <td>{new Date(log.created_at).toLocaleString()}</td>
            <td>{log.file_name}</td>
            <td>{log.backup_type}</td>
            <td>{log.tables.join(", ")}</td>
            <td>{log.version}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>

  );
};

export default AdminBackup;
