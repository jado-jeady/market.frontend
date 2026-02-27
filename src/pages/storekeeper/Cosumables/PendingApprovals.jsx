import { useState, useEffect } from 'react';

const PendingApprovals = () => {
  const [pendingBatches, setPendingBatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPending = async () => {
      try {
        // TODO: Replace with your actual API endpoint
        const response = await fetch('/api/cashier/pending-approvals');
        if (response.ok) {
          const data = await response.json();
          setPendingBatches(data);
        }
      } catch (error) {
        console.error('Error fetching pending approvals:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPending();
  }, []);

  const handleApprove = async (batchId) => {
    try {
      // TODO: Replace with your actual API endpoint
      const response = await fetch(`/api/cashier/approve-production/${batchId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        alert('Production approved! Items added to inventory.');
        // Refresh the list
        setPendingBatches(pendingBatches.filter(b => b.id !== batchId));
      }
    } catch (error) {
      console.error('Error approving production:', error);
    }
  };

  const handleReject = async (batchId) => {
    const reason = prompt('Please provide a reason for rejection:');
    if (!reason) return;

    try {
      // TODO: Replace with your actual API endpoint
      const response = await fetch(`/api/cashier/reject-production/${batchId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason })
      });

      if (response.ok) {
        alert('Production rejected.');
        // Refresh the list
        setPendingBatches(pendingBatches.filter(b => b.id !== batchId));
      }
    } catch (error) {
      console.error('Error rejecting production:', error);
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Mock data for demonstration
  const mockBatches = [
    {
      id: 1,
      batchNumber: 'BATCH-001',
      storekeeperName: 'John Doe',
      date: '2024-01-30',
      time: '08:30 AM',
      items: [
        { name: 'Sambusa', quantity: 50, icon: '🥟', unit: 'pieces' },
        { name: 'Mandazi', quantity: 30, icon: '🍩', unit: 'pieces' }
      ],
      notes: 'Morning batch - fresh production',
      totalItems: 80
    },
    {
      id: 2,
      batchNumber: 'BATCH-002',
      storekeeperName: 'Jane Smith',
      date: '2024-01-30',
      time: '10:00 AM',
      items: [
        { name: 'Chapati', quantity: 40, icon: '🫓', unit: 'pieces' },
        { name: 'Breads', quantity: 25, icon: '🍞', unit: 'loaves' }
      ],
      notes: '',
      totalItems: 65
    }
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Pending Approvals</h1>
        <p className="text-gray-600 mt-1">Review and approve storekeeper production batches</p>
      </div>

      {/* Alert Box */}
      {mockBatches.length > 0 && (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
          <div className="flex items-center">
            <svg className="w-6 h-6 text-blue-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="font-semibold text-blue-900">Action Required</p>
              <p className="text-sm text-blue-700">{mockBatches.length} production batch{mockBatches.length > 1 ? 'es' : ''} waiting for your approval</p>
            </div>
          </div>
        </div>
      )}

      {mockBatches.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">All Caught Up!</h3>
          <p className="text-gray-600">No pending production batches to review</p>
        </div>
      ) : (
        <div className="space-y-6">
          {mockBatches.map((batch) => (
            <div key={batch.id} className="bg-white rounded-lg shadow-md overflow-hidden border-l-4 border-orange-500">
              {/* Header */}
              <div className="bg-gradient-to-r from-orange-50 to-amber-50 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{batch.batchNumber}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Submitted by <strong>{batch.storekeeperName}</strong> on {batch.date} at {batch.time}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Total Items</p>
                    <p className="text-2xl font-bold text-orange-600">{batch.totalItems}</p>
                  </div>
                </div>
              </div>

              {/* Items Grid */}
              <div className="p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Production Items:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  {batch.items.map((item, idx) => (
                    <div key={idx} className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <span className="text-4xl">{item.icon}</span>
                      <div>
                        <p className="font-semibold text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-600">
                          <span className="font-bold text-lg text-orange-600">{item.quantity}</span> {item.unit}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Notes */}
                {batch.notes && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                    <p className="text-sm font-medium text-amber-900 mb-1">Production Notes:</p>
                    <p className="text-sm text-amber-800">{batch.notes}</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex space-x-4">
                  <button
                    onClick={() => handleApprove(batch.id)}
                    className="flex-1 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-semibold hover:from-green-700 hover:to-green-800 transition shadow-md flex items-center justify-center space-x-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Approve & Add to Inventory</span>
                  </button>
                  <button
                    onClick={() => handleReject(batch.id)}
                    className="flex-1 py-3 bg-white border-2 border-red-600 text-red-600 rounded-lg font-semibold hover:bg-red-50 transition flex items-center justify-center space-x-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Reject</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PendingApprovals;