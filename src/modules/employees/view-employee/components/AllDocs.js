import { useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { TrashIconNew } from '../../../../theme/SvgIcons';
import AddCollections from '../modals/AddCollections';
import { debounce, downloadDocMedia, downloadImageMedia } from '../../../../utils/common_functions';
import {
  AddDocInCollection,
  deleteEmployeeeDocumentApi,
  getEmployeeDocumentApi,
  removeDocInCollectionApi
} from '../../../../redux/employee/apiRoute';
import { useParams } from 'react-router-dom';
import ConfirmationModal from '../../../../components/Modal/ConfirmationModal';
import { deleteMultipleS3Objects, deleteS3Object } from '../../../../utils/uploadS3Bucket';
import { toast } from 'react-toastify';
import AddDocument from '../modals/AddDocument';
import dayjs from 'dayjs';
import DocumentComp from './DocumentComp';
import { KeysObj } from '../../../../utils/constant';

const AllDocs = ({ search, addModal, setAddModal, filter, sortField, sortOrder, apiPath }) => {
  const { id, collectionId } = useParams();

  const [card, setCard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [selectedCheckbox, setSelectedCheckbox] = useState([]);
  const [openCollection, setOpenCollection] = useState(false);
  const [docColLoading, setDocColLoading] = useState(false);

  const docBaseUrl = process.env.REACT_APP_S3_BASE_URL;

  const handleCheckbox = (val) => {
    let findVal = selectedCheckbox.find((item) => item.id === val.id);

    if (findVal) {
      setSelectedCheckbox((prev) => prev.filter((item) => item.id !== val.id));
    } else {
      setSelectedCheckbox((prev) => [...prev, val]);
    }
  };

  const downloadFile = async (url, filename, type) => {
    if (type === 'Photo') {
      downloadImageMedia(url, filename);
      return;
    }
    downloadDocMedia(url, filename);
  };

  const handleDownload = (val) => {
    const buildUrl = (docPath) => `${docBaseUrl}${docPath}`;
    const extractFilename = (docPath) => docPath.split('/').pop() || 'download';

    if (Array.isArray(val)) {
      val.forEach((item, index) => {
        const url = buildUrl(item?.document);
        const filename = extractFilename(item?.document);

        setTimeout(() => {
          downloadFile(url, filename, item?.file_type);
        }, index * 300);
      });

      setSelectedCheckbox([]);
    } else if (val?.document) {
      const url = buildUrl(val.document);
      const filename = extractFilename(val.document);
      downloadFile(url, filename, val?.file_type);
    }
  };

  const handleDelete = async () => {
    let ids = [];
    let paths;

    if (selectedCheckbox?.length > 0) {
      ids = selectedCheckbox?.map((item) => item?.id);
      paths = selectedCheckbox?.map((item) => item?.document);
    } else {
      ids = [deleteModal?.id];
      paths = deleteModal?.document;
    }

    try {
      setDeleteLoading(true);
      let res;
      if (collectionId) {
        let payload = {
          doc_ids: ids,
          collection_id: collectionId
        };
        res = await removeDocInCollectionApi(apiPath, payload);
      } else {
        let params = new URLSearchParams();
        params.append('ids', ids);
        res = await deleteEmployeeeDocumentApi(apiPath, params);
      }
      if (res?.statusCode === 200) {
        toast.success(res?.message || 'Successfully deleted');
        if (!collectionId) {
          if (selectedCheckbox?.length > 0) {
            await deleteMultipleS3Objects(paths);
          } else {
            await deleteS3Object(paths);
          }
        }
        setSelectedCheckbox([]);
        setDeleteModal(null);
        handleGetDocument();
      } else {
        toast.error(res?.message || 'Something went wrong');
      }
    } catch (err) {
      toast.error(err?.message || 'Something went wrong');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleAddDocInCollection = async (collection_id, ids) => {
    setDocColLoading(true);
    try {
      let payload = {
        doc_ids: ids?.map((item) => item?.id),
        collection_id: collection_id
      };
      let res = await AddDocInCollection(apiPath, payload);

      if (res?.statusCode === 200) {
        toast.success(res?.message || 'Successfully added');
        setOpenCollection(false);
        setSelectedCheckbox([]);
        if (collectionId) {
          handleGetDocument();
        }
      } else {
        toast.error(res?.message || 'Something went wrong');
      }
    } catch (err) {
      console.log(err, 'errrrrrrr');
    } finally {
      setDocColLoading(false);
    }
  };

  const handleGetDocument = async (search) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      collectionId && params.append('collection_id', collectionId);
      params.append(KeysObj[apiPath], id);
      search && params.append('search_key', search);
      filter?.file_type?.length > 0 && params.append('file_type', filter?.file_type);
      filter?.file_extension?.length > 0 && params.append('file_extension', filter?.file_extension);
      filter?.uploaded_by?.length > 0 && params.append('uploaded_by', filter?.uploaded_by);

      filter?.start_date &&
        params.append('start_date', dayjs(filter?.start_date).format('YYYY-MM-DD'));
      filter?.end_date && params.append('end_date', dayjs(filter?.end_date).format('YYYY-MM-DD'));

      if (sortField && sortOrder) {
        params.append('sort_by', sortField);
        params.append('sort_type', sortOrder);
      }

      let res = await getEmployeeDocumentApi(apiPath, params);
      if (res?.statusCode === 200) {
        setCard(res?.data || []);
      } else {
        toast.error(res?.message || 'Something went wrong');
      }
    } catch (err) {
      toast.error(err?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const optimizedFn = useCallback(debounce(handleGetDocument), [filter, sortOrder, sortField]);

  useEffect(() => {
    if (search !== null) {
      optimizedFn(search);
    } else {
      handleGetDocument();
    }
  }, [search, filter, sortOrder, sortField]);

  return (
    <>
      {deleteModal && (
        <ConfirmationModal
          open={deleteModal}
          onCancel={() => setDeleteModal(null)}
          title={'Delete Document'}
          onSubmit={handleDelete}
          buttonName={'Delete'}
          description={`Are you sure you want to delete ${
            selectedCheckbox?.length > 0 ? 'these documents' : 'this document'
          }?`}
          iconBG={'#FB4A49'}
          icon={<TrashIconNew />}
          loading={deleteLoading}
        />
      )}
      {addModal && (
        <AddDocument
          open={addModal}
          onClose={() => setAddModal(false)}
          handleDocGet={handleGetDocument}
          collectionId={collectionId}
          apiPath={apiPath}
        />
      )}
      {openCollection && (
        <AddCollections
          open={openCollection}
          onClose={() => setOpenCollection(false)}
          handleAction={handleAddDocInCollection}
          data={selectedCheckbox?.length > 0 ? selectedCheckbox : [openCollection]}
          addloading={docColLoading}
          apiPath={apiPath}
        />
      )}

      <DocumentComp
        loading={loading}
        cardData={card}
        selectedCheckbox={selectedCheckbox}
        setSelectedCheckbox={setSelectedCheckbox}
        handleCheckbox={handleCheckbox}
        handleDownload={handleDownload}
        handleDelete={setDeleteModal}
        handleCollection={setOpenCollection}
      />
    </>
  );
};

export default AllDocs;

AllDocs.propTypes = {
  search: PropTypes.string,
  addModal: PropTypes.bool,
  setAddModal: PropTypes.func,
  filter: PropTypes.object,
  sortField: PropTypes.string,
  sortOrder: PropTypes.string,
  apiPath: PropTypes.string
};
