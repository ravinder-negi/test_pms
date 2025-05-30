import { useEffect, useState } from 'react';
import { getProjectOptionsApi } from '../redux/project/apiRoute';

const useProjectOptions = (employeeId) => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  console.log(employeeId, 'employeeId');

  useEffect(() => {
    const fetchEmployee = async () => {
      setLoading(true);
      setError(null);
      try {
        let params = new URLSearchParams();
        employeeId && params.append('emp_id', employeeId);
        const response = await getProjectOptionsApi(params); // pass employeeId to API
        if (response?.statusCode === 200) {
          const employees = response?.data;
          const formattedOptions = (employees ?? []).map((emp) => ({
            label: emp?.name,
            value: emp.id
          }));
          setOptions(formattedOptions);
        } else {
          setError(response.message || 'Failed to fetch employees');
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch employees');
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [employeeId]); // re-run when projectId changes

  return { options, loading, error };
};

export default useProjectOptions;
