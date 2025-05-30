import { useEffect, useState } from 'react';
import { getAllMembersProject } from '../redux/project/apiRoute';
import { getFullName } from '../utils/common_functions';

const useProjectMemberOptions = (projectId) => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!projectId) return; // skip fetch if no projectId

    const fetchEmployee = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getAllMembersProject(projectId); // pass projectId to API
        if (response?.statusCode === 200) {
          const employees = response?.data;
          const formattedOptions = (employees ?? []).map((emp) => ({
            label: getFullName(emp?.name, emp?.middleName, emp?.lastName),
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
  }, [projectId]); // re-run when projectId changes

  return { options, loading, error };
};

export default useProjectMemberOptions;
