import { useEffect, useState } from 'react';
import { getAllDesignationsApi } from '../redux/employee/apiRoute';

const useAllDesignation = () => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDesignations = async () => {
      setLoading(true);
      try {
        const response = await getAllDesignationsApi();
        if (response?.statusCode === 200) {
          const designation = response?.data;
          const formattedOptions = (designation ?? []).map((dept) => ({
            label: dept.designation,
            value: dept.id
          }));

          setOptions(formattedOptions);
        } else {
          setError(response.message || 'Failed to fetch designations');
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch designations');
      } finally {
        setLoading(false);
      }
    };

    fetchDesignations();
  }, []);

  return { options, loading, error };
};

export default useAllDesignation;
