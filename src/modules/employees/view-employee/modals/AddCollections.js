/* eslint-disable react/prop-types */
import { Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import { ModalCloseBox } from '../../EmployeesStyle';
import { CollectionFolder, DocFolderIcon, ModalCloseIcon } from '../../../../theme/SvgIcons';
import styled from '@emotion/styled';
import moment from 'moment';
import { useParams } from 'react-router-dom';
import { getCollectionApi } from '../../../../redux/employee/apiRoute';
import CreateCollections from './CreateCollections';
import { FlexWrapper } from '../../../../theme/common_style';
import TableLoader from '../../../../components/loaders/TableLoader';
import { KeysObj } from '../../../../utils/constant';
import NoData from '../../../../components/common/NoData';
import { checkPermission, currentModule } from '../../../../utils/common_functions';
import { useSelector } from 'react-redux';

const AddCollections = ({ open, onClose, handleAction, data, addloading, apiPath }) => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [collections, setCollections] = useState([]);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const { permissions } = useSelector((state) => state?.userInfo?.data);
  const path = currentModule();
  const canCreate = checkPermission(path, 'create', permissions);

  const handleGetCollection = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      params.append(KeysObj?.[apiPath], id);

      let res = await getCollectionApi(apiPath, params);
      if (res?.statusCode === 200) {
        setCollections(res?.data || []);
      } else {
        toast.error(res?.message || 'Something went wrong');
      }
    } catch (err) {
      toast.error(err?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetCollection();
  }, []);

  return (
    <Modal
      open={open}
      onCancel={onClose}
      prefixCls="create-employees"
      width={422}
      centered
      closeIcon={false}
      footer={null}>
      {openCreateModal && (
        <CreateCollections
          open={openCreateModal}
          onClose={() => setOpenCreateModal(false)}
          handleListing={handleGetCollection}
          apiPath={apiPath}
        />
      )}
      <ModalCloseBox onClick={onClose}>
        <ModalCloseIcon />
      </ModalCloseBox>
      <ContentBox>
        <h4>Add to Collection</h4>
        {loading ? (
          <FlexWrapper justify="center" align="center" style={{ height: '390px' }}>
            <TableLoader size="30px" />
          </FlexWrapper>
        ) : (
          <>
            <div className="collection">
              {collections?.length === 0 ? (
                <NoData
                  title="No Collection Found"
                  subTitle="Create a new collection and add documents to it."
                  height={'350px'}
                />
              ) : (
                collections?.map((val, idx) => (
                  <CollectionBox key={idx}>
                    <div className="left-part">
                      <div className="img-wrap">
                        {open ? <CollectionFolder /> : <img src="" alt="" />}
                      </div>
                      <div>
                        <div className="text">{val?.collection_name}</div>
                        <div className="date">
                          {val?.documentCount} Files
                          <div className="dot" />
                          {moment().format('DD MMM YYYY')}
                        </div>
                      </div>
                    </div>
                    <div
                      className="right-part"
                      onClick={() => !addloading && handleAction(val?.id, data)}>
                      <div className="icon">
                        <DocFolderIcon size={18} />
                      </div>
                      <div className="text">Add</div>
                    </div>
                  </CollectionBox>
                ))
              )}
            </div>
            {addloading ? (
              <CreateCollection>
                <TableLoader size="20px" />
              </CreateCollection>
            ) : (
              canCreate && (
                <CreateCollection onClick={() => !addloading && setOpenCreateModal(true)}>
                  Create Collection
                </CreateCollection>
              )
            )}
          </>
        )}
      </ContentBox>
    </Modal>
  );
};

export default AddCollections;

const ContentBox = styled.div`
  width: 100%;
  padding: 24px;

  h4 {
    font-family: 'Plus Jakarta Sans';
    font-weight: 700;
    font-size: 24px;
    color: #0e0e0e;
    margin: 0;
    text-align: center;
    margin-bottom: 32px;
  }

  .collection {
    width: 100%;
    max-height: 400px;
    overflow: auto;
    padding-right: 8px;
    margin-bottom: 24px;

    ::-webkit-scrollbar {
      width: 2px;
    }

    ::-webkit-scrollbar-thumb {
      background: #7c71ff;
      border-radius: 10px;
    }

    ::-webkit-scrollbar-track {
      background: #f1f1f1;
    }

    ::-webkit-scrollbar-thumb:hover {
      background: #f1f4ff;
    }
  }
`;

const CollectionBox = styled.div`
  width: 100%;
  height: fit-content;
  background: #ffffff;
  padding: 8px;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;

  :hover {
    background: #f2f3ff;
  }

  .left-part {
    display: flex;
    align-items: center;
    gap: 8px;

    .img-wrap {
      width: 36px;
      height: 36px;
      background-color: #f1f4ff;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid white;
      img {
        width: 100%;
        height: 100%;
        border-radius: 6px;
        object-fit: cover;
      }
    }

    .text {
      font-family: 'Plus Jakarta Sans';
      font-weight: 500;
      font-size: 12px;
      line-height: 140%;
    }

    .date {
      display: flex;
      align-items: center;
      color: #818b9a;
      font-size: 12px;
      font-family: 'Plus Jakarta Sans';
      font-weight: 400;
      line-height: 140%;

      .dot {
        width: 4px;
        height: 4px;
        background: #c9c9d1;
        border-radius: 50%;
        margin: 0px 8px;
      }
    }
  }

  .right-part {
    display: flex;
    align-items: center;
    gap: 6px;
    cursor: pointer;

    .icon {
      color: #7b7f91;
      height: 16px;
    }

    .text {
      font-family: 'Plus Jakarta Sans';
      font-weight: 500;
      font-size: 12px;
      line-height: 140%;
      margin-top: 6px;
    }
  }
`;

const CreateCollection = styled.div`
  width: 100%;
  height: 40px;
  border-radius: 10px;
  padding: 10px 24px;
  border: 1px solid #7c71ff;
  font-family: 'Plus Jakarta Sans';
  font-weight: 500;
  font-size: 14px;
  line-height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #7c71ff;
  cursor: pointer;
`;
