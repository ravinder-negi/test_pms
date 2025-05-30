import React, { useEffect, useState } from 'react';
import { OfficialIdsStyle, ProfileBox } from '../ViewEmployeeStyle';
import { DeleteIconBox, EditIconBox, FlexWrapper } from '../../../../theme/common_style';
import {
  DeleteIcon,
  EditIcon,
  HideDataIcon,
  TrashIconNew,
  VisibleDataIcon
} from '../../../../theme/SvgIcons';
import { Input, Table, Tooltip } from 'antd';
import { checkPermission, formatMobileNumber } from '../../../../utils/common_functions';
import { useSelector } from 'react-redux';
import AddOfficialIds from '../modals/AddOfficialIds';
import {
  deleteEmployeeCredentialApi,
  getEmployeeCredentialApi
} from '../../../../redux/employee/apiRoute';
import { useLocation, useParams } from 'react-router-dom';
import ConfirmationModal from '../../../../components/Modal/ConfirmationModal';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';

const OfficialIds = ({ handleList }) => {
  const [addModal, setAddModal] = useState(false);
  const { permissions } = useSelector((state) => state?.userInfo?.data);
  const [visible, setVisible] = useState(false);
  const location = useLocation();
  let permissionSection = location?.pathname?.includes('my-profile') ? 'my-profile' : 'Employee';
  const canCreate = checkPermission(permissionSection, 'create', permissions);
  const canDelete = checkPermission(permissionSection, 'del', permissions);
  const canUpdate = checkPermission(permissionSection, 'update', permissions);
  const [dataSource, setDataSource] = useState([]);
  const [editDetails, setEditDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  const columns = [
    {
      title: 'Service',
      dataIndex: 'service_type',
      key: 'service_type'
    },
    {
      title: 'Service URL',
      dataIndex: 'service_url',
      key: 'service_url',
      render: (text) =>
        text ? (
          <a
            href={text}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-block',
              maxWidth: '200px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              verticalAlign: 'bottom'
            }}
            title={text}>
            {text}
          </a>
        ) : (
          <div> N/A</div>
        )
    },
    {
      title: 'Email or Username',
      dataIndex: 'email_user_name',
      key: 'email_user_name'
    },
    {
      title: 'Password',
      dataIndex: 'password',
      key: 'password',
      render: (pass) => {
        return (
          <Input
            readOnly
            value={visible ? pass : '*'.repeat(pass.length)}
            type="text"
            style={{
              width: '150px',
              border: 'none',
              backgroundColor: 'transparent',
              boxShadow: 'none',
              cursor: 'default',
              padding: 0
            }}
            suffix={
              <span onClick={() => setVisible((prev) => !prev)} style={{ cursor: 'pointer' }}>
                {visible ? <VisibleDataIcon /> : <HideDataIcon />}
              </span>
            }
          />
        );
      }
    },
    {
      title: 'MFA',
      dataIndex: 'mfa_id',
      key: 'mfa_id',
      render: (val) => {
        let mfa = val ? (val?.includes('@') ? val : formatMobileNumber(val)) : 'N/A';
        return <div style={{ whiteSpace: 'nowrap' }}>{mfa}</div>;
      }
    },
    {
      title: 'Recovery',
      dataIndex: 'recovery_id',
      key: 'recovery_id',
      render: (val) => {
        let reacovery = val ? (val?.includes('@') ? val : formatMobileNumber(val)) : 'N/A';
        return <div style={{ whiteSpace: 'nowrap' }}>{reacovery}</div>;
      }
    },
    {
      title: 'Remark',
      dataIndex: 'remarks',
      key: 'remarks',
      render: (val) =>
        val?.trim() ? (
          <Tooltip title={val}>
            <p
              style={{
                maxWidth: '100px',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                overflow: 'hidden'
              }}>
              {val || '—'}
            </p>
          </Tooltip>
        ) : (
          '—'
        )
    },
    ...(canUpdate || canDelete
      ? [
          {
            title: 'Action',
            key: 'action',
            fixed: 'right',
            width: 100,
            render: (_, record) => (
              <FlexWrapper justify={'start'} gap={'6px'} wrap={'unset'}>
                {canUpdate && (
                  <EditIconBox
                    canUpdate={canUpdate}
                    onClick={() => {
                      if (canUpdate) {
                        setAddModal(true);
                        setEditDetails(record);
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
                        setEditDetails(record);
                      }
                    }}>
                    <DeleteIcon />
                  </DeleteIconBox>
                )}
              </FlexWrapper>
            )
          }
        ]
      : [])
  ];

  const handleDelete = async () => {
    try {
      setDeleteLoading(true);
      let res = await deleteEmployeeCredentialApi(editDetails?.id);
      if (res?.statusCode === 200) {
        toast.success(res?.message || 'Credential deleted successfully');
        setDeleteModal(false);
        handleGetIds();
        handleList();
      } else {
        toast.error(res?.message || 'Something went wrong');
      }
    } catch (error) {
      toast.error(error?.message || 'Something went wrong');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleGetIds = async () => {
    try {
      setLoading(true);
      let res = await getEmployeeCredentialApi(id);
      if (res?.statusCode === 200) {
        setDataSource(res?.data);
      } else {
        toast.error(res?.message || 'Something went wrong');
      }
    } catch (error) {
      toast.error(error?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetIds();
  }, []);

  return (
    <OfficialIdsStyle>
      {deleteModal && (
        <ConfirmationModal
          open={deleteModal}
          onCancel={() => setDeleteModal(false)}
          title={'Delete Credentials'}
          onSubmit={handleDelete}
          buttonName={'Delete'}
          description={'Are you sure you want to delete this credentials?'}
          iconBG={'#FB4A49'}
          icon={<TrashIconNew />}
          loading={deleteLoading}
        />
      )}
      {addModal && (
        <AddOfficialIds
          open={addModal}
          onClose={() => setAddModal(false)}
          editDetails={editDetails}
          handleList={handleGetIds}
          handleGetAllEmployees={handleList}
        />
      )}
      <div className="title">
        <h5>Office Essential IDs</h5>
        {canCreate && (
          <p
            onClick={() => {
              setEditDetails(null);
              setAddModal(true);
            }}>
            + Add ID{' '}
          </p>
        )}
      </div>
      <ProfileBox>
        <Table
          prefixCls="antCustomTable"
          className="official-ids-table"
          loading={loading}
          columns={columns}
          dataSource={dataSource}
          pagination={false}
        />
      </ProfileBox>
    </OfficialIdsStyle>
  );
};

OfficialIds.propTypes = {
  handleList: PropTypes.function
};

export default OfficialIds;
