import { useEffect, useState } from "react";
import { getAllShifts } from "../../utils/shift.util";

const ShiftReport = () => {
  const [shifts, setShifts] = useState([]);

  useEffect(() => {
    const loadShifts = async () => {
      const res = await getAllShifts();
      console.log(res)
      if (res.success) {
        setShifts(res.data);
      }
    };
    loadShifts();
  }, []);

  return (
    <div className="p-6 text-gray-700">
      <h2 className="text-2xl font-bold mb-4">Shift Reports</h2>

      <table className="w-full border">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th>Cashier</th>
            <th>Opened</th>
            <th>Closed</th>
            <th>Total Sales</th>
            <th>Difference</th>
          </tr>
        </thead>

        <tbody className="text-gray-700">
          {shifts.map((shift) => (
            <tr key={shift.id} className="border-t">
              <td>{shift.User?.full_name}</td>
              <td>{new Date(shift.opened_at).toLocaleString()}</td>
              <td>
                {shift.closed_at
                  ? new Date(shift.closed_at).toLocaleString()
                  : "OPEN"}
              </td>
              <td>{shift.total_sales}</td>
              <td
                className={
                  shift.difference !== 0
                    ? "text-red-600 font-bold"
                    : ""
                }
              >
                {shift.difference}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ShiftReport;
