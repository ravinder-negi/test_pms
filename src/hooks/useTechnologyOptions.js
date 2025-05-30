import { useEffect, useState } from 'react';
import { getTechnologiesApi } from '../redux/employee/apiRoute';

const useTechnologyOptions = () => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTechnologies = async () => {
      setLoading(true);
      try {
        const response = await getTechnologiesApi();
        if (response?.statusCode === 200) {
          const designation = response?.data;
          const formattedOptions = (designation ?? []).map((dept) => ({
            label: dept.technology,
            value: dept.id
          }));

          setOptions(formattedOptions);
        } else {
          setError(response.message || 'Failed to fetch technologies');
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch technologies');
      } finally {
        setLoading(false);
      }
    };

    fetchTechnologies();
  }, []);

  return { options, loading, error };
};

export default useTechnologyOptions;
