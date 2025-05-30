/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { DeleteIconBox, EditIconBox, FlexWrapper, PaginationBox } from '../../theme/common_style';
import SearchField from '../../components/searchField/SearchField';
import { Button, Pagination, Select, Table } from 'antd';
import AddClient from './AddClient';
import EmptyData from '../../components/common/EmptyData';
import {
  ClientEmptyIcon,
  DeleteIcon,
  EditIcon,
  TrashIconNew,
  ViewIconNew
} from '../../theme/SvgIcons';
import { useNavigate } from 'react-router-dom';
import AvatarImage from '../../components/common/AvatarImage';
import { checkPermission } from '../../utils/common_functions';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { deleteClientApi } from '../../services/api_collection';
import ConfirmationModal from '../../components/Modal/ConfirmationModal';
import Tag from '../../components/common/Tag';
import SortByDropdown from '../employees/view-employee/components/SortButton';
import { StickyBox } from '../../utils/style';

const getStatusTag = (status) => {
  const statusStyles = {
    Active: 'success',
    Inactive: 'danger'
  };
  const tagVariant = statusStyles[status] || 'default';
  const TagVariant = Tag[tagVariant];
  return <TagVariant>{status}</TagVariant>;
};

const ClientDetails = ({
  data,
  loading,
  setPage,
  page,
  limit,
  total,
  setSearch,
  handleGetList,
  sortOptions,
  sortField,
  sortOrder,
  setSortField,
  setSortOrder,
  setStatus,
  search,
  sort,
  setSort
}) => {
  const [addModal, setAddModal] = useState(false);
  const navigate = useNavigate();
  const [editData, setEditData] = useState(null);
  const { permissions } = useSelector((state) => state?.userInfo?.data);
  const canUpdate = checkPermission('Clients', 'update', permissions);
  const canDelete = checkPermission('Clients', 'del', permissions);
  const canCreate = checkPermission('Clients', 'create', permissions);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  const status = [
    {
      label: 'Active',
      value: true
    },
    {
      label: 'Inactive',
      value: false
    }
  ];

  const handleSorting = (val) => {
    setSortField(null);
    setSortOrder(null);
    if (val?.field) {
      let order = val?.order == 'ascend' ? 'asc' : 'desc';
      setSort({ sortBy: val?.field, orderBy: order, ...val });
    } else {
      setSort({});
    }
    setPage(page);
  };

  const handleDelete = async () => {
    try {
      setDeleteLoading(true);
      let res = await deleteClientApi(editData?.id);
      if (res?.statusCode === 200) {
        handleGetList();
        setDeleteModal(false);
      } else {
        toast.error(res?.message || 'Something went wrong');
      }
    } catch (err) {
      toast.error(err?.message || 'Something went wrong');
    } finally {
      setDeleteLoading(false);
    }
  };

  const columns = [
    {
      title: 'S.NO',
      dataIndex: 'key',
      key: 'key',
      render: (text) => <span>{(page - 1) * limit + text}.</span>
    },
    {
      title: 'Client Name',
      dataIndex: 'name',
      key: 'name',
      sorter: true,
      render: (name, user) => (
        <FlexWrapper justify={'start'} gap={'6px'} wrap={'unset'} cursor="default">
          <AvatarImage
            style={{
              height: '32px',
              width: '32px',
              minWidth: '32px',
              fontSize: '16px'
            }}
            image={process.env.REACT_APP_S3_BASE_URL + user?.profile_image}
            name={name}
          />
          <span style={{ whiteSpace: 'nowrap' }}>{name || '-'}</span>
        </FlexWrapper>
      )
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      sorter: true
    },
    {
      title: 'Contact',
      dataIndex: 'contact',
      key: 'contact',
      render: (contact, data) => (
        <span style={{ whiteSpace: 'nowrap' }}>
          +{data?.country_code} {contact || '-'}
        </span>
      )
    },
    {
      title: 'Country',
      dataIndex: 'country',
      key: 'country',
      sorter: true
    },
    {
      title: 'Status',
      dataIndex: 'client_status',
      render: (val) => getStatusTag(val ? 'Active' : 'Inactive')
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      className: 'action-column',
      render: (_, data) => {
        return (
          <FlexWrapper justify={'start'} gap={'6px'} cursor="default" wrap={'unset'}>
            <FlexWrapper
              onClick={() => {
                navigate(`/clients/info/${data.id}`, {
                  state: { client: data }
                });
              }}
              style={{
                backgroundColor: '#7C71FF',
                width: '30px',
                height: '30px',
                borderRadius: '50%'
              }}>
              <ViewIconNew />
            </FlexWrapper>
            {canUpdate && (
              <EditIconBox
                canUpdate={canUpdate}
                onClick={() => {
                  if (canUpdate) {
                    setAddModal(true);
                    setEditData(data);
                  }
                }}>
                <EditIcon />
              </EditIconBox>
            )}
            {canDelete && (
              <DeleteIconBox
                canDelete={canDelete}
                onClick={() => {
                  if (canDelete) {
                    setDeleteModal(true);
                    setEditData(data);
                  }
                }}>
                <DeleteIcon />
              </DeleteIconBox>
            )}
          </FlexWrapper>
        );
      }
    }
  ];

  const handlePageChange = (page, pageSize) => {
    console.log('Page:', page, 'Page Size:', pageSize);
    setPage(page);
  };
  return (
    <FlexWrapper width="100%" gap="20px" cursor="default">
      {deleteModal && (
        <ConfirmationModal
          open={deleteModal}
          onCancel={() => setDeleteModal(false)}
          title={'Delete Client'}
          onSubmit={handleDelete}
          buttonName={'Delete'}
          description={'Are you sure you want to delete this client?'}
          iconBG={'#FB4A49'}
          icon={<TrashIconNew />}
          loading={deleteLoading}
        />
      )}
      {addModal && (
        <AddClient
          open={addModal}
          onClose={() => setAddModal(false)}
          editDetails={editData}
          handleGetList={handleGetList}
        />
      )}
      <StickyBox>
        <FlexWrapper justify={canCreate ? 'space-between' : 'end'} width="100%" cursor="default">
          {canCreate && (
            <Button
              type="text"
              onClick={() => {
                setAddModal(true);
                setEditData(null);
              }}
              prefixCls="antCustomBtn">
              + Add New Client
            </Button>
          )}
          <FlexWrapper gap="10px">
            <Select
              prefixCls="custom-select"
              style={{ width: '135px' }}
              placeholder={`Select Status`}
              allowClear
              onChange={setStatus}>
              {status?.map((item, index) => (
                <Select.Option key={index} value={item.value}>
                  {item.label}
                </Select.Option>
              ))}
            </Select>
            <SortByDropdown
              sortField={sortField}
              setSortField={setSortField}
              sortOrder={sortOrder}
              setSortOrder={setSortOrder}
              sortOptions={sortOptions}
              allowClear={true}
              removeFilter={() => setSort({})}
            />
            <SearchField
              placeholder="Search by Name, Country..."
              style={{ width: '250px' }}
              onChange={setSearch}
              value={search}
            />
          </FlexWrapper>
        </FlexWrapper>
      </StickyBox>

      <FlexWrapper width="100%" cursor="default">
        {loading || data.length > 0 ? (
          <>
            <Table
              prefixCls="antCustomTable"
              columns={columns}
              dataSource={data}
              pagination={false}
              loading={loading}
              onChange={(_, e, sorter) => {
                handleSorting(sorter);
              }}
              defaultSortOrder={sort.order}
            />

            <PaginationBox>
              <Pagination
                current={page}
                prefixCls="custom-pagination"
                pageSize={limit}
                total={total}
                onChange={handlePageChange}
                showSizeChanger={false}
                hideOnSinglePage
              />
            </PaginationBox>
          </>
        ) : (
          <FlexWrapper direction="column" gap="10px" cursor="default">
            <EmptyData
              title={'No Data'}
              subTitle={'No clients created yet kindly create first client'}
              icon={<ClientEmptyIcon />}
              height={'40vh'}
            />
          </FlexWrapper>
        )}
      </FlexWrapper>
    </FlexWrapper>
  );
};

export default ClientDetails;
