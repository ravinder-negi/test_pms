import React, { useEffect, useState } from 'react';
import { Pagination, Skeleton } from 'antd';

import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { FlexWrapper, PaginationBox } from '../../theme/common_style';
import { ReportNotFoundIcon } from '../../theme/SvgIcons';
import ReportingCard from '../reporting/ReportingCard';
import EmptyData from '../../components/common/EmptyData';
import { getAllReports } from '../../services/api_collection';
import { useParams } from 'react-router-dom';
import { getFullName } from '../../utils/common_functions';

const ProjectReporting = () => {
  const { isEmployee } = useSelector((e) => e.userInfo);
  const [limit] = useState(10);
  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const { user_details } = useSelector((e) => e.userInfo?.data);
  const { id } = useParams();

  const handlePageChange = (page) => {
    setPage(page);
  };

  const handleGetList = async () => {
    try {
      setLoading(true);
      let params = new URLSearchParams();
      params.append('limit', limit);
      params.append('page', page);
      //   Object?.entries(appliedFilter || {}).forEach(([key, value]) => {
      //     if (value?.length > 0) {
      //       params.append(key, value?.toString());
      //     }
      //   });
      id && params.append('projectId', id);
      isEmployee && params.append('empId', user_details?.id);
      const res = await getAllReports(params);
      if (res?.statusCode === 200) {
        let array = (res?.data?.reportings || [])?.map((el, idx) => ({
          ...el,
          key: idx + 1
        }));
        setData(array || []);
        setTotal(res?.data?.pagination?.total);
      } else toast.error(res?.message || 'Something went wrong');
    } catch (err) {
      toast.error(err?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetList();
  }, [page]);

  return (
    <div>
      {/* {filtersModal && (
        <ReportingFilters open={filtersModal} onClose={() => setFiltersModal(false)} />
      )} */}
      {/* {deleteModal && (
        <ConfirmationModal
          open={deleteModal}
          onCancel={() => setDeleteModal(false)}
          title={'Delete Report'}
          onSubmit={handleDelete}
          buttonName={'Delete'}
          description={'Are you sure you want to delete this report?'}
          iconBG={'#FB4A49'}
          icon={<TrashIconNew />}
          loading={deleteLoading}
        />
      )} */}

      {data.length > 0 || loading ? (
        loading ? (
          <FlexWrapper direction="column" gap="24px" cursor="default">
            {[1, 2, 3]?.map((_, index) => (
              <div
                key={index}
                style={{
                  width: '100%',
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  padding: '16px'
                }}>
                <Skeleton active title={false} paragraph={{ rows: 8 }} />
              </div>
            ))}
          </FlexWrapper>
        ) : (
          <FlexWrapper direction="column" gap="24px" cursor="default">
            {data?.map((item, index) => {
              return (
                <ReportingCard
                  report={item}
                  key={index}
                  empName={getFullName(
                    item?.emp_reporting_id?.first_name,
                    item?.emp_reporting_id?.middle_name,
                    item?.emp_reporting_id?.last_name
                  )}
                  handleGetList={handleGetList}
                  showActions={false}
                />
              );
            })}
          </FlexWrapper>
        )
      ) : (
        <EmptyData
          height={'70vh'}
          icon={<ReportNotFoundIcon />}
          title={'No Report'}
          subTitle={'No Report Found'}
        />
      )}
      {total > 20 && (
        <PaginationBox>
          <Pagination
            current={page}
            prefixCls="custom-pagination"
            pageSize={limit}
            total={total}
            onChange={handlePageChange}
            showSizeChanger={false}
          />
        </PaginationBox>
      )}
    </div>
  );
};

export default ProjectReporting;
