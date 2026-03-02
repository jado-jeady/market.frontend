import { useState, useEffect } from 'react';

const CashierApproval = () => {
  const [pendingProductions, setPendingProductions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBatch, setSelectedBatch] = useState(null);

  useEffect(() => {
    fetchPendingProductions();
  }, []);

  const fetchPendingProductions = async () => {
    try {
      // TODO: Replace with your actual API endpoint
      const response = await fetch('/api/cashier/pending-productions');
      if (response.ok) {
        const data = await response.json();
        setPendingProductions(data);
      }
    } catch (error) {
      console.error('Error fetching pending productions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (batchId) => {
    try {
      const response = await fetch(`/api/cashier/approve-production/${batchId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          approvedBy: 'Cashier', // Replace with actual user
          approvedAt: new Date().toISOString(),
          status: 'approved',
        }),
      });

      if (response.ok) {
        alert('Production approved successfully!');
        fetchPendingProductions();
        setSelectedBatch(null);
      }
    } catch (error) {
      console.error('Error approving production:', error);
      alert('Failed to approve production');
    }
  };

  const handleReject = async (batchId, reason) => {
    try {
      const response = await fetch(`/api/cashier/reject-production/${batchId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rejectedBy: 'Cashier',
          rejectedAt: new Date().toISOString(),
          status: 'rejected',
          reason: reason,
        }),
      });

      if (response.ok) {
        alert('Production rejected');
        fetchPendingProductions();
        setSelectedBatch(null);
      }
    } catch (error) {
      console.error('Error rejecting production:', error);
      alert('Failed to reject production');
    }
  };

  // Mock data for demonstration
  const mockBatches = [
    {
      id: 1,
      batchId: 'BATCH-1001',
      submittedBy: 'John (Storekeeper)',
      submittedAt: '2024-01-30 08:00',
      items: [
        { name: 'Sambusa', icon: '🥟', quantity: 50, unit: 'pieces', shelfLife: '8 hours' },
        { name: 'Mandazi', icon: '🍩', quantity: 30, unit: 'pieces', shelfLife: '12 hours' },
      ],
      notes: 'Fresh batch, good quality',
      totalItems: 80,
    },
    {
      id: 2,
      batchId: 'BATCH-1002',
      submittedBy: 'Mary (Storekeeper)',
      submittedAt: '2024-01-30 09:30',
      items: [
        { name: 'Chapati', icon: '🫓', quantity: 40, unit: 'pieces', shelfLife: '10 hours' },
        { name: 'Breads', icon: '🍞', quantity: 15, unit: 'loaves', shelfLife: '24 hours' },
      ],
      notes: '',
      totalItems: 55,
    },
    {
      id: 3,
      batchId: 'BATCH-1003',
      submittedBy: 'John (Storekeeper)',
      submittedAt: '2024-01-30 10:15',
      items: [
        { name: 'Sausages', icon: '🌭', quantity: 25, unit: 'pieces', shelfLife: '6 hours' },
      ],
      notes: 'Need to sell quickly - short shelf life',
      totalItems: 25,
    },
  ];

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Approve Productions</h1>
        <p className="text-gray-600 mt-1">Review and approve consumables added by storekeepers</p>
      </div>

      {/* Alert Banner */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
        <div className="flex">
          <svg className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="text-sm text-blue-700 font-medium">Pending Approvals</p>
            <p className="text-sm text-blue-600 mt-1">
              You have <strong>{mockBatches.length} production batches</strong> waiting for your approval. 
              Please review the quantities and quality before approving.
            </p>
          </div>
        </div>
      </div>

      {/* Pending Productions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {mockBatches.map((batch) => (
          <div key={batch.id} className="bg-white rounded-lg shadow-md overflow-hidden border-l-4 border-yellow-500">
            {/* Header */}
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 border-b border-yellow-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-gray-900">{batch.batchId}</h3>
                <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                  Pending Review
                </span>
              </div>
              <div className="text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>{batch.submittedBy}</span>
                </div>
                <div className="flex items-center space-x-2 mt-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{batch.submittedAt}</span>
                </div>
              </div>
            </div>

            {/* Items List */}
            <div className="p-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Items in this batch:</h4>
              <div className="space-y-2 mb-4">
                {batch.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{item.icon}</span>
                      <div>
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-xs text-gray-500">Shelf life: {item.shelfLife}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">{item.quantity}</p>
                      <p className="text-xs text-gray-500">{item.unit}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="bg-blue-50 rounded-lg p-3 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Total Items:</span>
                  <span className="text-lg font-bold text-blue-600">{batch.totalItems}</span>
                </div>
              </div>

              {/* Notes */}
              {batch.notes && (
                <div className="bg-yellow-50 border-l-2 border-yellow-400 p-3 mb-4">
                  <p className="text-xs font-semibold text-gray-700 mb-1">📝 Storekeeper Notes:</p>
                  <p className="text-sm text-gray-600">{batch.notes}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={() => handleApprove(batch.id)}
                  className="flex-1 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition font-semibold shadow-md flex items-center justify-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Approve
                </button>
                <button
                  onClick={() => {
                    const reason = prompt('Reason for rejection:');
                    if (reason) handleReject(batch.id, reason);
                  }}
                  className="flex-1 py-3 bg-white border-2 border-red-500 text-red-600 rounded-lg hover:bg-red-50 transition font-semibold flex items-center justify-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Reject
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {mockBatches.length === 0 && (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <svg className="w-20 h-20 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Pending Approvals</h3>
          <p className="text-gray-600">All production batches have been reviewed!</p>
        </div>
      )}
    </div>
  );
};

export default CashierApproval;