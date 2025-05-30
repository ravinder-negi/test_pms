import { useEffect, useState } from 'react';
import { getDepartmentApi } from '../redux/employee/apiRoute';

const useDepartmentOptions = () => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDepartments = async () => {
      setLoading(true);
      try {
        const response = await getDepartmentApi(); // Replace with your actual endpoint
        if (response?.statusCode === 200) {
          const departments = response?.data;
          const formattedOptions = (departments ?? []).map((dept) => ({
            label: dept.departments,
            value: dept.id
          }));

          setOptions(formattedOptions);
        } else {
          setError(response.message || 'Failed to fetch departments');
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch departments');
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  return { options, loading, error };
};

export default useDepartmentOptions;
