import React, { useState } from "react";
import axios from "axios";
import moment from "moment";
import { useGetEmployeeQuery } from "../../../redux/services/EmployeeMasterService";
import { getCommonParams } from "../../../Utils/helper";

const Attendance = () => {
  const [punches, setPunches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const params = getCommonParams();

  // ✅ RTK Query for employee list
  const { data: allData, isLoading: empLoading } = useGetEmployeeQuery({ params });
  const employeeData = allData?.data || [];

  // ✅ Fetch punches based on date range
  const fetchPunches = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:3000/api/punches?fromDate=${moment(fromDate).format(
          "DD-MM-YYYY"
        )}&toDate=${moment(toDate).format("DD-MM-YYYY")}`
      );

      const punchesData = res.data.data || [];

      // ✅ Map punches with employee names from employeeData
      const updatedPunches = punchesData.map((p) => {
        const matchedEmp = employeeData.find(
          (emp) => emp.mIdCard?.toString() === p.mIdCard?.toString()
        );
        return {
          ...p,
          employeeName: matchedEmp ? matchedEmp.firstName : "Unknown",
        };
      });

      setPunches(updatedPunches);
    } catch (err) {
      console.error(err);
      setPunches([]);
    }
    setLoading(false);
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">ESSL Attendance</h1>

      <div className="flex flex-wrap items-center gap-4 mb-6">
        <label className="flex flex-col">
          <span className="text-gray-700 mb-1 font-medium">From Date:</span>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>
        <label className="flex flex-col">
          <span className="text-gray-700 mb-1 font-medium">To Date:</span>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>
        <button
          onClick={fetchPunches}
          className="bg-blue-500 text-white px-4 py-2 mt-5 rounded hover:bg-blue-600 transition"
          disabled={empLoading || loading}
        >
          {loading ? "Fetching..." : "Fetch"}
        </button>
      </div>

      {loading || empLoading ? (
        <p className="text-gray-500">Loading...</p>
      ) : punches.length === 0 ? (
        <p className="text-gray-500">No data found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-blue-500 text-white">
              <tr>
                <th className="px-4 py-2 text-left">S.No</th>
                <th className="px-4 py-2 text-left">Employee ID</th>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-left">Time</th>
              </tr>
            </thead>
            <tbody>
              {punches.map((p, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                >
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">{p.mIdCard}</td>
                  <td className="px-4 py-2">{p.employeeName}</td>
                  <td className="px-4 py-2">{p.date}</td>
                  <td className="px-4 py-2">{p.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Attendance;
