import React, { useEffect, useState } from 'react';
import { OfficialIdsStyle, ProfileBox } from '../ViewEmployeeStyle';
import { Table } from 'antd';
import { DeleteIconBox, EditIconBox, FlexWrapper } from '../../../../theme/common_style';
import { DeleteIcon, EditIcon, TrashIconNew } from '../../../../theme/SvgIcons';
import { checkPermission } from '../../../../utils/common_functions';
import { useSelector } from 'react-redux';
import {
  deleteEmployeeEducationApi,
  getEmployeeEducationApi
} from '../../../../redux/employee/apiRoute';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import AddEducation from '../modals/AddEducation';
import ConfirmationModal from '../../../../components/Modal/ConfirmationModal';
import moment from 'moment';
import PropTypes from 'prop-types';

const Education = ({ handleList }) => {
  const { permissions } = useSelector((state) => state?.userInfo?.data);
  let permissionSection = location?.pathname?.includes('my-profile') ? 'my-profile' : 'Employee';
  const canCreate = checkPermission(permissionSection, 'create', permissions);
  const canDelete = checkPermission(permissionSection, 'del', permissions);
  const canUpdate = checkPermission(permissionSection, 'update', permissions);
  const { id } = useParams();
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [editDetails, setEditDetails] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  const columns = [
    {
      title: 'Qualification',
      dataIndex: 'qualification',
      key: 'qualification',
      render: (val) => <span style={{ textTransform: 'capitalize' }}>{val || '—'}</span>
    },
    {
      title: 'Completion Year',
      dataIndex: 'completion_year',
      key: 'completion_year',
      render: (val) => moment(val).format('YYYY')
    },
    { title: 'Type', dataIndex: 'education_type', key: 'education_type' },
    {
      title: 'Percentage (%)',
      dataIndex: 'result',
      key: 'result',
      render: (val) => (val ? `${val}%` : '—')
    },
    ...(canUpdate || canDelete
      ? [
          {
            title: 'Action',
            key: 'action',
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
      let res = await deleteEmployeeEducationApi(editDetails?.id);
      if (res?.statusCode === 200) {
        toast.success(res?.message || 'Education deleted successfully');
        handleGetEducations();
        setDeleteModal(false);
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

  const handleGetEducations = async () => {
    try {
      setLoading(true);
      let res = await getEmployeeEducationApi(id);
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
    handleGetEducations();
  }, []);
  return (
    <OfficialIdsStyle>
      {deleteModal && (
        <ConfirmationModal
          open={deleteModal}
          onCancel={() => setDeleteModal(false)}
          title={'Delete Education'}
          onSubmit={handleDelete}
          buttonName={'Delete'}
          description={'Are you sure you want to delete this education?'}
          iconBG={'#FB4A49'}
          icon={<TrashIconNew />}
          loading={deleteLoading}
        />
      )}
      {addModal && (
        <AddEducation
          open={addModal}
          onClose={() => setAddModal(false)}
          editDetails={editDetails}
          handleList={handleGetEducations}
          handleGetEmployeeDetails={handleList}
        />
      )}
      <div className="title">
        <h5>Education</h5>
        {canCreate && (
          <p
            onClick={() => {
              setAddModal(true);
              setEditDetails(null);
            }}>
            + Add Education
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

Education.propTypes = {
  handleList: PropTypes.func
};

export default Education;
