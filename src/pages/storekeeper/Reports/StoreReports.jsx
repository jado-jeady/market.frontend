

import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';


const StoreReports = () => {
  const [reports, setReports] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetchStoreReport(user?.id);
        setReports(response.data);
      } catch (error) {
        toast.error(error.message);
      }  
    };
    fetchReports();
  }, [user]);

  const columns = React.useMemo(
    () => [
      {
        Header: 'Date',
        accessor: 'date',
        Cell: ({ value }) => format(new Date(value), 'dd-MM-yyyy'),
      },
      {
        Header: 'Product Name',
        accessor: 'productName',
      },
      {
        Header: 'Quantity',
        accessor: 'quantity',
      },
    ],
    []
  );

}
export default StoreReports

