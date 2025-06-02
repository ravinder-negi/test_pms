import React, { useEffect, useState } from 'react';
import { OfficialIdsStyle, ProfileBox } from '../ViewEmployeeStyle';
import { Table } from 'antd';
import { DeleteIconBox, EditIconBox, FlexWrapper } from '../../../../theme/common_style';
import { DeleteIcon, EditIcon, TrashIconNew } from '../../../../theme/SvgIcons';
import { checkPermission } from '../../../../utils/common_functions';
import { useSelector } from 'react-redux';
import AddWorkExperience from '../modals/AddWorkExperience';
import { deleteWorkExperienceApi, getWorkExperienceApi } from '../../../../redux/employee/apiRoute';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import ConfirmationModal from '../../../../components/Modal/ConfirmationModal';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';

const WorkExperience = ({ handleList }) => {
  const [addModal, setAddModal] = useState(false);
  const { permissions } = useSelector((state) => state?.userInfo?.data);
  let permissionSection = location?.pathname?.includes('my-profile') ? 'my-profile' : 'Employee';
  const canCreate = checkPermission(permissionSection, 'create', permissions);
  const canDelete = checkPermission(permissionSection, 'del', permissions);
  const canUpdate = checkPermission(permissionSection, 'update', permissions);
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const [editDetails, setEditDetails] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  function calculateWorkExperience(startDate, endDate) {
    const start = dayjs(startDate);
    const end = dayjs(endDate);

    let years = end.diff(start, 'year');
    let tmp = start.add(years, 'year');

    let months = end.diff(tmp, 'month');
    tmp = tmp.add(months, 'month');

    let days = end.diff(tmp, 'day');

    return { years, months, days };
  }

  const columns = [
    { title: 'Company', dataIndex: 'company_name', key: 'company_name' },
    { title: 'Job Title', dataIndex: 'job_title', key: 'job_title' },
    {
      title: 'From',
      dataIndex: 'start_date',
      key: 'start_date',
      render: (val) => (val ? moment(val).format('DD-MM-YYYY') : '—')
    },
    {
      title: 'To',
      dataIndex: 'end_date',
      key: 'end_date',
      render: (val) => (val ? moment(val).format('DD-MM-YYYY') : '—')
    },
    {
      title: 'Total Work Experience',
      key: 'total_work_experience',
      render: (_, record) => {
        if (!record?.start_date) return '—';

        const startDate = new Date(record.start_date);
        const endDate = record.end_date ? new Date(record.end_date) : new Date();

        const experience = calculateWorkExperience(startDate, endDate);
        return `${experience.years} Years ${experience.months} Months`;
      }
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
                    canUpdate={canUpdate && record?.end_date}
                    onClick={() => {
                      if (canUpdate && record?.end_date) {
                        setAddModal(true);
                        setEditDetails(record);
                      }
                    }}>
                    <EditIcon />
                  </EditIconBox>
                )}

                {canDelete && (
                  <DeleteIconBox
                    canDelete={canDelete && record?.end_date}
                    onClick={() => {
                      if (canDelete && record?.end_date) {
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

  const handleGetWorkExperience = async () => {
    try {
      setLoading(true);
      let res = await getWorkExperienceApi(id);
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

  const handleDelete = async () => {
    try {
      setDeleteLoading(true);
      let res = await deleteWorkExperienceApi(editDetails?.id);
      if (res?.statusCode === 200) {
        toast.success(res?.message || 'Credential deleted successfully');
        setDeleteModal(false);
        handleGetWorkExperience();
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

  useEffect(() => {
    handleGetWorkExperience();
  }, []);

  return (
    <OfficialIdsStyle>
      {deleteModal && (
        <ConfirmationModal
          open={deleteModal}
          onCancel={() => setDeleteModal(false)}
          title={'Delete Work Experience'}
          onSubmit={handleDelete}
          buttonName={'Delete'}
          description={'Are you sure you want to delete this work experience?'}
          iconBG={'#FB4A49'}
          icon={<TrashIconNew />}
          loading={deleteLoading}
        />
      )}
      {addModal && (
        <AddWorkExperience
          open={addModal}
          onClose={() => setAddModal(false)}
          editDetails={editDetails}
          handleList={handleGetWorkExperience}
          handleGetEmployeeDetails={handleList}
        />
      )}
      <div className="title">
        <h5>Work Experience</h5>
        {canCreate && (
          <p
            onClick={() => {
              setAddModal(true);
              setEditDetails(null);
            }}>
            + Add Work Experience
          </p>
        )}
      </div>
      <ProfileBox>
        <Table
          prefixCls="antCustomTable"
          className="official-ids-table"
          columns={columns}
          loading={loading}
          dataSource={dataSource}
          pagination={false}
        />
      </ProfileBox>
    </OfficialIdsStyle>
  );
};

WorkExperience.propTypes = {
  handleList: PropTypes.func
};

export default WorkExperience;
