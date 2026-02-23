import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

const ShiftContext = createContext(null);

export const ShiftProvider = ({ children }) => {
  const { user } = useAuth();
  // Start with undefined to mean "not yet loaded"
  const [activeShift, setActiveShift] = useState(undefined);
  const [loading, setLoading] = useState(true);

  const loadShift = async () => {
    if (!user) {
      setActiveShift(null);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        import.meta.env.VITE_API_URL + "/api/shift/current",
        {
          headers: {
            Authorization: `Bearer ${user?.data?.token}`,
          },
        }
      );

      if (!response.ok) {
        setActiveShift(null); // explicitly no shift
        return;
      }

      const shift = await response.json();
      setActiveShift(shift.data || null); // valid object or null
    } catch (err) {
      console.error(err);
      setActiveShift(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadShift();
  }, [user]);

  return (
    <ShiftContext.Provider
      value={{ activeShift, loading, reloadShift: loadShift }}
    >
      {children}
    </ShiftContext.Provider>
  );
};

export const useShift = () => useContext(ShiftContext);