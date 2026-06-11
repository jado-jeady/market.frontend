import { PrinterIcon, X } from "lucide-react";
import { sendShiftToPrinter } from "../../utils/shift.util";
import { useState } from "react";

const ShiftSummaryModal = ({ isOpen, onClose, shiftData }) => {
  if (!isOpen || !shiftData) return null;

  const difference = Number(shiftData.difference);
  const profitOrLoss = difference >= 0 ? "Profit" : "Loss";
  const [loading, setLoading] = useState(false);

  // get the users info from the local storage to send to the printer along with the shift summary data for better contextualization of the printout
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser)?.data?.user : null;

  const handlePrintSummary = async (data) => {
    try {
      setLoading(true);

      // 1. Compile data to be sent to printer - this can be further enhanced to include more detailed metrics as needed
      // 2. Map and structurally format every specific metrics requirement
      const printPayload = {
        shift_id: data.id || data.shift_id,
        cashier_name: user?.full_name || "N/A",
        business_date: data.business_date,
        opened_at: data.opened_at,
        closed_at: data.closed_at,
        opening_balance: Number(data.opening_balance || 0),
        closing_balance: Number(data.closing_balance || 0),
        cash_in_hand: Number(data.cash_in_hand || 0),
        petty_cash: Number(data.petty_cash || 0),
        total_sales: Number(data.total_sales || 0),
        expected_balance: Number(data.expected_balance || 0),
        difference: Number(data.difference || 0),
        shop_name: data.shop_name,
      };

      // 3. Dispatch data directly to the local hardware integration API
      const printResponse = await sendShiftToPrinter(printPayload);
      if (!printResponse.success) {
        throw new Error(
          printResponse.message || "Failed to send data to printer",
        );
      } else {
        alert("Shift summary sent to printer successfully!");
      }
    } catch (error) {
      console.error("Failed to compile or print shift data summary:", error);
      alert("Could not complete print job. Please check printer connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center ml-30 justify-center bg-black/50 z-50 p-2">
      <div className="bg-white rounded-xl shadow-xl w-[90%] max-full-lg">
        {/* Header */}
        <div className="flex justify-between items-center p-3 border-b">
          <h2 className="text-base font-bold text-gray-800">Shift Summary</h2>
          <button onClick={onClose} className="p-1 rounded hover:bg-gray-100">
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 text-sm text-gray-700 max-h-[80vh] overflow-y-auto">
          {/* Top section: all info */}
          <div className="space-y-4">
            {/* General Info */}
            <div className="grid grid-cols-5 gap-2">
              <p>
                <span className="font-medium">Shop:</span> {shiftData.shop_name}
              </p>
              <p>
                <span className="font-medium">Cashier Name:</span>{" "}
                {user?.full_name || "N/A"}
              </p>
              <p>
                <span className="font-medium">Business Date:</span>{" "}
                {shiftData.business_date}
              </p>
              <p>
                <span className="font-medium">Opened At:</span>{" "}
                {new Date(shiftData.opened_at).toLocaleString()}
              </p>
              <p>
                <span className="font-medium ">Closed At:</span>{" "}
                {new Date(shiftData.closed_at).toLocaleString()}
              </p>
            </div>

            {/* Balances */}
            <div className="grid grid-cols-7 gap-2 bg-gray-50 p-2 rounded">
              <div>
                <p className="font-medium  truncate">Opening Momo Balance:</p>
                <p className="font-bold">
                  {Number(shiftData.opening_balance).toLocaleString()} RWF
                </p>
              </div>
              <div>
                <p className="font-medium truncate ">Closing Momo Balance:</p>
                <p className="font-bold ">
                  {Number(shiftData.closing_balance).toLocaleString()} RWF
                </p>
              </div>
              <div>
                <p className="font-medium truncate  ">Cash in Hand:</p>
                <p className="font-bold">
                  {Number(shiftData.cash_in_hand).toLocaleString()} RWF
                </p>
              </div>
              <div>
                <p className="font-medium">Petty Cash:</p>
                <p className="font-bold">
                  {Number(shiftData.petty_cash).toLocaleString()} RWF
                </p>
              </div>

              <div>
                <p className="font-medium">Total Sales:</p>
                <p className="font-bold">
                  {Number(shiftData.total_sales).toLocaleString()} RWF
                </p>
              </div>
              <div>
                <p className="font-medium">Expected Balance:</p>
                <p className="font-bold">
                  {Number(shiftData.expected_balance).toLocaleString()} RWF
                </p>
              </div>
              <div className="col-span">
                <p className="font-medium">Difference:</p>
                <p
                  className={
                    difference >= 0
                      ? "text-green-600 font-bold"
                      : "text-red-600 font-bold"
                  }
                >
                  {difference.toLocaleString()} RWF ({profitOrLoss})
                </p>
              </div>
            </div>

            {/* Closing Note */}
            {shiftData.closing_note && (
              <div>
                <p className="font-medium">Closing Note:</p>
                <p>{shiftData.closing_note}</p>
              </div>
            )}
          </div>

          {/* Bottom section: consumables */}
          <div className="mt-4">
            <p className="font-medium mb-2">Consumables Snapshot:</p>
            <div className="grid grid-cols-4 md:grid-cols-5 overflow-x-auto min-h-[20px] lg:grid-cols-6 gap-2">
              {Object.entries(shiftData.consumables_snapshot || {}).map(
                ([name, qty]) => (
                  <div
                    key={name}
                    className="flex justify-between border rounded px-2 py-1 text-xs"
                  >
                    <span className="truncate">{name}</span>
                    <span className="font-medium">{qty}</span>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-3 border-t">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700"
          >
            Close
          </button>
          {/* button to print the shift summary with lucide icons */}
          <button
            onClick={() => handlePrintSummary(shiftData)}
            className="ml-2 px-3 py-1.5 text-sm font-medium text-white bg-gray-600 rounded hover:bg-gray-700"
          >
            {loading ? (
              <span className="animate-pulse">Printing...</span>
            ) : (
              <>
                <span className="hidden sm:inline">Print Summary</span>
                <PrinterIcon className="w-4 h-4 inline-block" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShiftSummaryModal;
