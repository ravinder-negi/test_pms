import { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { TrashIconNew } from '../../../../theme/SvgIcons';
import CreateCollections from '../modals/CreateCollections';
import { checkPermission, currentModule, debounce } from '../../../../utils/common_functions';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { deleteCollectionApi, getCollectionApi } from '../../../../redux/employee/apiRoute';
import { toast } from 'react-toastify';
import ConfirmationModal from '../../../../components/Modal/ConfirmationModal';
import AddDocument from '../modals/AddDocument';
import CollectionComp from './CollectionComp';
import { KeysObj, navigationData } from '../../../../utils/constant';
import { FlexWrapper } from '../../../../theme/common_style';
import NoData from '../../../../components/common/NoData';
import { useSelector } from 'react-redux';

const Collections = ({
  search,
  addModal,
  setAddModal,
  sortField,
  sortOrder,
  apiPath,
  navigatePath,
  forProfile = false
}) => {
  const navigation = useNavigate();
  const location = useLocation();
  const { name } = location.state || {};
  const { id } = useParams();

  const { permissions } = useSelector((state) => state?.userInfo?.data);
  const permissionSection = currentModule();
  const canCreate = checkPermission(permissionSection, 'create', permissions);

  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  const handleDelete = async () => {
    try {
      setDeleteLoading(true);
      let res = await deleteCollectionApi(apiPath, deleteModal?.id);
      if (res?.statusCode === 200) {
        setDeleteModal(false);
        handleGetCollection();
        toast.success(res?.message || 'Successfully deleted');
      } else {
        toast.error(res?.message || 'Something went wrong');
      }
    } catch (err) {
      toast.error(err?.message || 'Something went wrong');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleGetCollection = async (search) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      params.append(KeysObj[apiPath], id);
      search && params.append('search_key', search);

      if (sortField && sortOrder) {
        params.append('sort_by', sortField);
        params.append('sort_type', sortOrder);
      }

      let res = await getCollectionApi(apiPath, params);
      if (res?.statusCode === 200) {
        setCollections(res?.data || []);
        setDeleteModal(false);
      } else {
        toast.error(res?.message || 'Something went wrong');
      }
    } catch (err) {
      toast.error(err?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const optimizedFn = useCallback(debounce(handleGetCollection), [sortOrder, sortField]);

  useEffect(() => {
    if (search !== null) {
      optimizedFn(search);
    } else {
      handleGetCollection();
    }
  }, [search, sortOrder, sortField]);

  const handAction = (val, type) => {
    if (type === 'delete') {
      setDeleteModal(val);
    } else {
      setOpenCreateModal(val);
    }
  };

  const handleNavigation = (val) => {
    navigation(`/${navigatePath}/${id}/collection/${val?.id}`, {
      state:
        apiPath === 'hms'
          ? {
              ...location.state,
              data: val,
              path: navigationData?.[apiPath],
              name: location.state.hms.device_id
            }
          : { data: val, path: navigationData?.[forProfile || apiPath], name: name }
    });
  };

  return (
    <>
      {openCreateModal && (
        <CreateCollections
          open={openCreateModal}
          onClose={() => setOpenCreateModal(false)}
          edit={openCreateModal?.id ? openCreateModal : null}
          handleListing={handleGetCollection}
          apiPath={apiPath}
        />
      )}
      {deleteModal && (
        <ConfirmationModal
          open={deleteModal}
          onCancel={() => setDeleteModal(null)}
          title={'Delete Collection'}
          onSubmit={handleDelete}
          buttonName={'Delete'}
          description={'Are you sure you want to delete this collection?'}
          iconBG={'#FB4A49'}
          icon={<TrashIconNew />}
          loading={deleteLoading}
        />
      )}
      {addModal && (
        <AddDocument open={addModal} onClose={() => setAddModal(false)} apiPath={apiPath} />
      )}

      {!loading && !canCreate && collections?.length === 0 && (
        <FlexWrapper justify={'center'} width={'100%'} align={'center'}>
          <NoData
            title="No Collection Created"
            subTitle="You have not created any collection"
            height={'350px'}
          />
        </FlexWrapper>
      )}

      <CollectionComp
        loading={loading}
        collections={collections}
        handleCreateModal={setOpenCreateModal}
        handleCardClick={handleNavigation}
        handAction={handAction}
      />
    </>
  );
};

export default Collections;

Collections.propTypes = {
  search: PropTypes.string,
  addModal: PropTypes.bool,
  setAddModal: PropTypes.func,
  sortField: PropTypes.string,
  sortOrder: PropTypes.string,
  apiPath: PropTypes.string,
  navigatePath: PropTypes.string,
  forProfile: PropTypes.any
};
