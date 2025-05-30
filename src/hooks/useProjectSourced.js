import { useEffect, useState } from 'react';
import { getProjectSourcesApi } from '../redux/project/apiRoute';

const useProjectSourced = ({ type }) => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjectPlatforms = async () => {
      setLoading(true);
      try {
        let params = new URLSearchParams();
        params.append('type', type);
        params.append('limit', 100);
        params.append('page', 1);
        const response = await getProjectSourcesApi(params);
        if (response?.statusCode === 200) {
          const projectType = response?.data?.results;
          const formattedOptions = (projectType ?? []).map((dept) => ({
            label: dept.name,
            value: dept.id
          }));
          setOptions(formattedOptions);
        } else {
          setError(response.message || 'Failed to fetch Project Condition');
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch Project Condition');
      } finally {
        setLoading(false);
      }
    };

    if (type) {
      fetchProjectPlatforms();
    }
  }, [type]);

  return { options, loading, error };
};

export default useProjectSourced;
