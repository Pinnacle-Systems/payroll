import React, { useState } from "react";
import { useGetEmployeeQuery } from "../../../redux/services/EmployeeMasterService";
import { getCommonParams } from "../../../Utils/helper";
function FetchLogs() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [logs, setLogs] = useState([]);
  const [page, setPage] = useState(1);
  const [perPage] = useState(100);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  // ✅ RTK Query for employee list
  const params = getCommonParams();
  const { data: allData, isLoading: empLoading } = useGetEmployeeQuery({
    params,
  });
  const employeeData = allData?.data || [];

  const fetchLogs = async () => {
    
    if (!from || !to) {
      alert("Please select both dates.");
      return;
    }

    setLoading(true);
    setError("");
    setLogs([]);

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/fetch-logs?from_date=${from}&to_date=${to}`
      );

      const data = await res.json();

      if (!data?.success) throw new Error(data?.error || "Unknown error");
      const mergedLogs = data?.data?.map((log) => {
        const matchedEmp = employeeData?.find(
          (emp) => emp?.mIdCard === log?.mIdCard
        );
        return {
          ...log,
          firstName: matchedEmp ? matchedEmp.firstName : "Unknown", // Default if not found
        };
      });

      setLogs(mergedLogs);
      setPage(1);
    } catch (err) {
      setError(err?.message);
      console.error("Error fetching logs:", err);
    } finally {
      setLoading(false);
    }
  };

  // pagination
  const totalPages = Math.ceil(logs?.length / perPage);
  const paginatedLogs = logs?.slice((page - 1) * perPage, page * perPage);

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h2>📅 Fetch Attendance Logs</h2>

      <div style={{ marginBottom: 10 }}>
        <input
          type="date"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
        />
        {" to "}
        <input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
        <button
          onClick={fetchLogs}
          disabled={!from || !to || loading}
          style={{
            marginLeft: 10,
            padding: "6px 10px",
            background: "#2563eb",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
          }}
        >
          {loading ? "Fetching..." : "Fetch Logs"}
        </button>
      </div>

      {error && <p style={{ color: "red" }}>❌ {error}</p>}

      <p>Total Logs: {logs?.length || 0}</p>

      {paginatedLogs?.length > 0 && (
        <>
          <table
            border="1"
            cellPadding="5"
            style={{
              borderCollapse: "collapse",
              width: "100%",
              marginTop: 10,
            }}
          >
            <thead>
              <tr style={{ background: "#f1f5f9" }}>
                <th>S.No</th>

                <th>User ID</th>
                <th>Employee name</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {paginatedLogs?.map((log, i) => (
                <tr key={i}>
                  <td>{(page - 1) * perPage + i + 1}</td>
                  <td>{log.mIdCard}</td>
                  <td>{log.firstName}</td>

                  <td>{log.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ marginTop: 10 }}>
            <button
              onClick={() => setPage((p) => p - 1)}
              disabled={page === 1}
              style={{ marginRight: 10 }}
            >
              Prev
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page === totalPages}
              style={{ marginLeft: 10 }}
            >
              Next
            </button>
          </div>
        </>
      )}

      {!loading && logs?.length === 0 && (
        <p style={{ color: "#666" }}>No logs available.</p>
      )}
    </div>
  );
}

export default FetchLogs;
