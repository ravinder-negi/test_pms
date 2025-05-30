import { Timeline, Card } from 'antd';
import { HmsFilterHistoryIcon } from '../../theme/SvgIcons';
import styled from '@emotion/styled';
import { FlexWrapper } from '../../theme/common_style';
import { getAssignHistory } from '../../services/api_collection';
import { toast } from 'react-toastify';
import { useEffect, useState, useRef, useCallback } from 'react';
import dayjs from 'dayjs';
import { getFullName } from '../../utils/common_functions';
import AvatarImage from '../../components/common/AvatarImage';
import PropTypes from 'prop-types';
import TableLoader from '../../components/loaders/TableLoader';

const HistoryDrawer = ({ id }) => {
  const [detail, setDetail] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);
  const containerRef = useRef(null);

  const handleGetHistoryDrawer = async (pageNum) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('pageNumber', pageNum);
      params.append('limit', 4);
      params.append('device_id', id);
      const res = await getAssignHistory(params);
      if (res?.statusCode === 200) {
        setTotal(res?.count || 0);
        const newItems = res?.data || [];
        newItems && setDetail((prev) => [...prev, ...newItems]);
      } else {
        toast.error(
          res?.response?.data?.message || res?.error || res?.message || 'Something went wrong'
        );
      }
    } catch (error) {
      toast.error(error?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setHasMore(detail.length < total);
  }, [detail, total]);

  useEffect(() => {
    handleGetHistoryDrawer(page);
  }, [page]);

  const handleScroll = useCallback(() => {
    if (containerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      if (scrollTop + clientHeight >= scrollHeight - 10 && hasMore && !loading) {
        setPage((prev) => prev + 1);
      }
    }
  }, [hasMore, loading]);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, [handleScroll]);

  return (
    <DrawerStyle ref={containerRef}>
      {!loading ? (
        detail?.map((item) => (
          <Card
            key={item?.id}
            style={{
              backgroundColor: item?.is_returned ? '#F7F6FF' : '#F1F2F4',
              borderRadius: '12px',
              width: '430px',
              height: '160px',
              display: 'flex'
            }}>
            <Timeline
              mode="left"
              items={[
                {
                  label: (
                    <span style={labelStyle}>
                      {item?.assign_date
                        ? dayjs(Number(item.assign_date)).format('DD MMM, YYYY')
                        : ''}
                    </span>
                  ),
                  dot: <span style={dotStyle} />,
                  color: 'gray',
                  children: <div style={{ ...titleStyle, paddingBottom: '25px' }}>Assignee</div>
                },
                {
                  dot: (
                    <FlexWrapper
                      style={{ backgroundColor: '#F1F2F4', height: '20px' }}
                      width="20px">
                      <HmsFilterHistoryIcon />
                    </FlexWrapper>
                  ),
                  color: 'gray',
                  children: (
                    <div style={userCardStyle}>
                      <AvatarImage
                        style={{ width: '36px', height: '36px' }}
                        image={
                          process.env.REACT_APP_S3_BASE_URL +
                          'employee/profileImg/' +
                          item?.employee?.id +
                          '.jpg'
                        }
                        name={getFullName(item?.employee?.first_name + item?.employee?.last_name)}
                      />
                      <div>
                        <div style={{ fontWeight: 600 }}>
                          {item?.employee?.first_name +
                            (item?.employee?.last_name ? ' ' + item.employee.last_name : '')}
                        </div>
                        <div style={{ fontSize: '12px', color: '#999' }}>
                          {item?.employee?.role_id?.role}
                        </div>
                      </div>
                    </div>
                  )
                },
                {
                  label: (
                    <span style={labelStyle}>
                      {item?.return_date
                        ? dayjs(Number(item.return_date)).format('DD MMM, YYYY')
                        : ''}
                    </span>
                  ),
                  dot: <span style={dotStyle} />,
                  color: 'gray',
                  children: <div style={titleStyle}>Return</div>
                }
              ]}
            />
          </Card>
        ))
      ) : (
        <div className="page-loader">
          <TableLoader size="20px" />
        </div>
      )}
      {detail?.length === 0 && !loading && (
        <div className="loader">
          <p>History Not found</p>
        </div>
      )}
    </DrawerStyle>
  );
};

export default HistoryDrawer;

HistoryDrawer.propTypes = {
  id: PropTypes.string.isRequired
};

const DrawerStyle = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 12px;
  padding: 20px 0;
  align-items: center;
  overflow-y: auto;

  .ant-timeline-item-tail {
    border: 1px dashed #818b9a !important;
  }
  .ant-timeline-item-head {
    background-color: transparent !important;
  }
  .ant-timeline-item-last > .ant-timeline-item-content {
    min-height: 20px !important;
  }
  .ant-card-body {
    padding: 24px 0 !important;
  }
  .ant-timeline-item-content {
    margin-inline-start: 0 !important;
    margin: 0 24px !important;
  }
  .loader,
  .page-loader {
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

const dotStyle = {
  width: 10,
  height: 10,
  backgroundColor: '#818b9a',
  borderRadius: '50%',
  display: 'inline-block'
};

const titleStyle = {
  fontWeight: 700,
  fontSize: '14px',
  fontFamily: 'Plus Jakarta Sans',
  lineHeight: '150%'
};

const labelStyle = {
  fontFamily: 'Plus Jakarta Sans',
  fontSize: '12px',
  fontWeight: '400',
  lineHeight: '140%'
};

const userCardStyle = {
  position: 'relative',
  bottom: '15px',
  display: 'flex',
  alignItems: 'center',
  width: '190px',
  gap: '12px',
  backgroundColor: '#fff',
  borderRadius: '12px',
  padding: '10px'
};
