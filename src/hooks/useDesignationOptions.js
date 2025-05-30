import { getDesignationsApi } from '../redux/employee/apiRoute';

const useDesignationOptions = async (id) => {
  try {
    const response = await getDesignationsApi(id);
    if (response?.statusCode === 200) {
      return response?.data;
    } else {
      return [];
    }
  } catch (error) {
    console.log(error);
  }
};

export default useDesignationOptions;
