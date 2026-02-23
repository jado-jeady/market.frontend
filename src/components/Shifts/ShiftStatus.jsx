import { useEffect, useState } from "react";
import { getActiveShift } from "../../utils/shift.util";
import CloseShift from "./CloseShift";

const ShiftStatus = () => {
  const [shift, setShift] = useState(null);

  useEffect(() => {
    const loadShift = async () => {
      const res = await getActiveShift();
      if (res.success) {
        setShift(res.data);
      }
    };
    loadShift();
  }, []);

  if (!shift) {
    return (
      <div className="bg-red-100 p-3 rounded">
        ❌ No active shift
      </div>
    );
  }

  return (
    <div className="bg-green-100 p-4 rounded flex justify-between items-center">
      <div>
        <h4 className="font-semibold">Active Shift</h4>
        <p>Opened at: {new Date(shift.opened_at).toLocaleTimeString()}</p>
        <p>Opening Cash: {shift.opening_cash} RWF</p>
      </div>

      <CloseShift shift={shift} />
    </div>
  );
};

export default ShiftStatus;
