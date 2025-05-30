import { useEffect, useState } from 'react';
import { getEmployeeOptionsApi } from '../redux/project/apiRoute';
import { getFullName } from '../utils/common_functions';

const useEmployeeOptions = () => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmployee = async () => {
      setLoading(true);
      try {
        const response = await getEmployeeOptionsApi(); // Replace with your actual endpoint
        if (response?.statusCode === 200) {
          const clients = response?.data;
          const formattedOptions = (clients ?? []).map((dept) => ({
            label: getFullName(dept?.first_name, dept?.middle_name, dept?.last_name),
            value: dept.id
          }));

          setOptions(formattedOptions);
        } else {
          setError(response.message || 'Failed to fetch clients');
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch clients');
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, []);

  return { options, loading, error };
};

export default useEmployeeOptions;
