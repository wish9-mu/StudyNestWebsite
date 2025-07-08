import { supabase } from "../../supabaseClient";
import JSZip from "jszip";

// 🔁 Backup all tables and generate a ZIP file
export async function backupAllTables() {
  const zip = new JSZip();
  const tables = await getTableNames();
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const filename = `supabase_backup_${timestamp}.zip`;

  const includedTables = [];

  for (const table of tables) {
    const { data, error } = await supabase.from(table).select("*");
    if (!error && data) {
      zip.file(`${table}.json`, JSON.stringify(data, null, 2));
      includedTables.push(table);
    }
  }

  const blob = await zip.generateAsync({ type: "blob" });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();

  // Get latest version for full backups
  const { data: latestFull, error: versionError } = await supabase
    .from("backups")
    .select("version")
    .eq("backup_type", "full")
    .order("version", { ascending: false })
    .limit(1)
    .single();

  const nextVersion = versionError || !latestFull ? 1 : latestFull.version + 1;

  await supabase.from("backups").insert({
    file_name: filename,
    backup_type: "full",
    tables: includedTables,
    version: nextVersion,
  });

  return filename;
}

// 🔁 Backup a single table to a JSON file
export async function backupSingleTable(table) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const filename = `${table}_backup_${timestamp}.json`;

  const { data, error } = await supabase.from(table).select("*");
  if (error || !data) return console.error(error);

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();

  // Get latest version for this specific table
  const { data: latestTable, error: tableError } = await supabase
    .from("backups")
    .select("version")
    .eq("backup_type", "table")
    .contains("tables", [table])  // match array
    .order("version", { ascending: false })
    .limit(1)
    .single();

  const nextTableVersion = tableError || !latestTable ? 1 : latestTable.version + 1;

  await supabase.from("backups").insert({
    file_name: filename,
    backup_type: "table",
    tables: [table],
    version: nextTableVersion,
  });

}

// 🔁 Recover from backup file (single .json or full .zip)
export async function recoverFromBackup(file) {
  const fileName = file.name;
  const text = await file.text();

  if (fileName.endsWith(".json")) {
    const tableName = fileName.split("_backup_")[0];
    const rows = JSON.parse(text);

    await supabase.rpc("truncate_table", { table_name: tableName });

    for (const row of rows) {
      await supabase.from(tableName).upsert(row);
    }

    alert(`Recovery of ${tableName} completed.`);
  }

  else if (fileName.endsWith(".zip")) {
    const zip = await JSZip.loadAsync(file);
    const files = Object.keys(zip.files);

    for (const f of files) {
      const table = f.replace(".json", "");
      const content = await zip.file(f).async("string");
      const data = JSON.parse(content);

      await supabase.from(table).delete().neq("id", null);
      for (const row of data) {
        await supabase.from(table).insert(row);
      }
    }

    alert("Full database recovery completed.");
  }
}

// 🔁 Get all table names via RPC
async function getTableNames() {
  const { data, error } = await supabase.rpc("get_all_table_names");
  if (error) {
    console.error("Error fetching table names:", error);
    return [];
  }
  return data;
}
