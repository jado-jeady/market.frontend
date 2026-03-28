import { useState, useEffect } from "react";
import {
  getAllReturns,
  approveReturn,
  rejectReturn,
} from "../../../utils/sales.util";
import { toast } from "react-toastify";

const SalesClaim = () => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(false);
  // get admin user id
  const authData = JSON.parse(localStorage.getItem("user"));
  const userId = authData?.data?.user?.id;

  const fetchClaims = async () => {
    setLoading(true);
    try {
      const res = await getAllReturns();
      console.log("Fetched claims:", res);
      setClaims(res || []);
    } catch (err) {
      toast.error("Failed to load claims");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, []);

  const handleApprove = async (return_id, approved_by) => {
    try {
      await approveReturn(return_id, approved_by);
      toast.success("Return approved");
      fetchClaims();
    } catch {
      toast.error("Failed to approve return");
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectReturn(id);
      toast.success("Return rejected");
      fetchClaims();
    } catch {
      toast.error("Failed to reject return");
    }
  };

  return (
    <div className="p-4 text-gray-600">
      <h3 className="text-lg font-semibold mb-4">Sales Return Claims</h3>

      {loading ? (
        <p className="text-gray-500 text-sm">Loading claims...</p>
      ) : (
        <>
          {/* TABLE for desktop */}
          <div className="hidden md:block overflow-x-auto bg-white rounded shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-6 py-3 text-left">Invoice</th>
                  <th className="px-6 py-3 text-left">Product</th>
                  <th className="px-6 py-3 text-left">Qty</th>
                  <th className="px-6 py-3 text-left">Reason</th>
                  <th className="px-6 py-3 text-left">Requested By</th>
                  <th className="px-6 py-3 text-left">Status</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y text-gray-600">
                {claims.length > 0 ? (
                  claims.map((claim) => (
                    <tr key={claim.id}>
                      <td className="px-6 py-4">
                        {claim.Sale?.invoice_number}
                      </td>
                      <td className="px-6 py-4">
                        {claim?.SaleItem?.Product?.name}
                      </td>
                      <td className="px-6 py-4">{claim.quantity}</td>
                      <td className="px-6 py-4">{claim.reason || "-"}</td>
                      <td className="px-6 py-4">
                        {claim.Requester?.full_name}
                      </td>
                      <td className="px-6 py-4">{claim.status}</td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button
                          onClick={() => handleApprove(claim.id, userId)}
                          className="text-green-600 text-xs hover:underline"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => handleReject(claim.id)}
                          className="text-red-600 text-xs hover:underline"
                        >
                          Reject
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-6 py-6 text-center text-gray-500"
                    >
                      No claims available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* CARDS for mobile */}
          <div className="block md:hidden grid grid-cols-2 space-y-2">
            {claims.length > 0 ? (
              claims.map((claim) => (
                <div
                  key={claim.id}
                  className="p-4 border rounded-lg shadow-sm bg-white flex flex-col"
                >
                  <div className="text-sm font-semibold text-gray-800">
                    Invoice: {claim.Sale?.invoice_number}
                  </div>
                  <div className="text-xs text-gray-600">
                    Product: {claim.SaleItem?.Product?.name}
                  </div>
                  <div className="text-xs text-gray-600">
                    Qty: {claim.quantity}
                  </div>
                  <div className="text-xs text-gray-600">
                    Reason: {claim.reason || "-"}
                  </div>
                  <div className="text-xs text-gray-600">
                    Cashier: {claim.Requester?.full_name}
                  </div>
                  <div className="text-xs text-gray-600 mb-2">
                    Status: {claim.status}
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => handleApprove(claim.id, userId)}
                      className="text-green-600 text-xs hover:underline"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => handleReject(claim.id)}
                      className="text-red-600 text-xs hover:underline"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 text-xs py-4">
                No claims available
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default SalesClaim;
