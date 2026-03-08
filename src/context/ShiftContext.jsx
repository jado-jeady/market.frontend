// ShiftContext.js
import { createContext, useContext, useState, useEffect } from "react";
import { getCurrentShift } from "../utils/shift.util";
const ShiftContext = createContext();

export const ShiftProvider = ({ children }) => {
  const [shift, setShift] = useState(null);
  const isShiftOpen = !!shift;

  const refreshShift = async () => {
    const response = await getCurrentShift();
    setShift(response.success ? response.data : null);
  };

  useEffect(() => {
    refreshShift();
  }, []);

  return (
    <ShiftContext.Provider value={{ shift, isShiftOpen, refreshShift }}>
      {children}
    </ShiftContext.Provider>
  );
};

export const useShift = () => useContext(ShiftContext);