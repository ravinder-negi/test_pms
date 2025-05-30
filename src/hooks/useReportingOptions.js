import { useEffect, useState } from 'react';
import { GetReportingDetails } from '../redux/lms/apiRoute';

const useReportingOptions = (id) => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReporting = async () => {
      setLoading(true);
      try {
        const response = await GetReportingDetails(id);
        if (response?.statusCode === 200) {
          const reporting = (response.data || []).reduce((acc, project) => {
            const incharges = project.incharges || [];
            const managers = project.managers || [];
            return acc.concat(incharges, managers);
          }, []);

          const seen = new Set();
          const uniqueReporting = reporting.filter((item) => {
            if (seen.has(item.id)) return false;
            seen.add(item.id);
            return true;
          });
          setOptions(uniqueReporting);
        } else {
          setError(response.message || 'Failed to fetch departments');
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch departments');
      } finally {
        setLoading(false);
      }
    };

    fetchReporting();
  }, []);

  return { options, loading, error };
};

export default useReportingOptions;
