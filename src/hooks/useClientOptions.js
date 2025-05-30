import { useEffect, useState } from 'react';
import { getClientOptionsApi } from '../redux/project/apiRoute';

const useClientOptions = () => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClients = async () => {
      setLoading(true);
      try {
        const response = await getClientOptionsApi(); // Replace with your actual endpoint
        if (response?.statusCode === 200) {
          const clients = response?.data;
          const formattedOptions = (clients ?? []).map((dept) => ({
            label: dept.name,
            value: dept.id,
            imgUrl: dept?.profile_image
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

    fetchClients();
  }, []);

  return { options, loading, error };
};

export default useClientOptions;
