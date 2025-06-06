import styled from '@emotion/styled';
import { Timeline } from 'antd';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { toast } from 'react-toastify';
import moment from 'moment/moment';
import TableLoader from '../../components/loaders/TableLoader';
import AvatarImage from '../../components/common/AvatarImage';
import { ToogleSidebarIcon } from '../../theme/SvgIcons';
import PropTypes from 'prop-types';
import { GetAdminLogs } from '../../redux/sub-admin/apiRoute';

const ActivityEmployee = ({ employeeId }) => {
  const [events, setEvents] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const containerRef = useRef(null);

  const getLogs = async (pageNum) => {
    if (loading) return;
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('limit', 20);
      params.append('page', pageNum);
      employeeId && params.append('employeeId', employeeId);
      let res = await GetAdminLogs(params);
      if (res?.statusCode === 200) {
        setTotal(res?.data?.totalLogs);
        const arr = res?.data?.logs?.map((el) => ({
          date: moment(el?.created_at).format('DD MMM, YYYY'),
          role: el?.actor_role,
          action: el?.action_details,
          actor_profile: el?.actor?.profile_image,
          user: el?.actor_account?.email,
          time: moment(el?.created_at).format('hh:mm A'),
          actorId: el?.actor?.id,
          target_account: el?.target_account?.email
        }));
        setEvents((prev) => [...prev, ...arr]);
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
    setHasMore(events?.length < total);
  }, [events]);

  useEffect(() => {
    getLogs(page);
  }, [page]);

  const handleScroll = useCallback(() => {
    if (containerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      if (scrollTop + clientHeight >= scrollHeight - 10 && hasMore && !loading) {
        setPage(page + 1);
      }
    }
  }, [hasMore, loading]);

  useEffect(() => {
    const handleScrollDebounced = () => {
      if (containerRef.current) {
        handleScroll();
      }
    };

    const scrollListener = () => {
      handleScrollDebounced();
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', scrollListener);
    }

    return () => {
      if (container) {
        container.removeEventListener('scroll', scrollListener);
      }
    };
  }, [handleScroll]);

  return (
    <DrawerStyle ref={containerRef}>
      {loading && page === 1 ? (
        <div className="loader">
          <TableLoader size="30px" />
        </div>
      ) : (
        <Timeline
          items={events?.map((event) => ({
            color: event.isDelete ? 'red' : '#7C71FF',
            dot: (
              <div className="dotIcon">
                <ToogleSidebarIcon />
              </div>
            ),
            children: (
              <div className="custom-content">
                <div className="flexbox">
                  <p className="date">{event.date}</p>
                  <p style={{ fontSize: '12px', color: '#aaa' }}>{event.time}</p>
                </div>
                <div className="profile-flex">
                  <AvatarImage
                    style={{
                      backgroundColor: '#7c71ff',
                      height: '18px',
                      width: '18px',
                      fontSize: '10px',
                      fontWeight: 400
                    }}
                    image={`${
                      process.env.REACT_APP_S3_BASE_URL + 'employee/profileImg/' + event.actorId
                    }.jpg`}
                    name={event.user || 'N/A'}
                  />
                  <p>{event.user || 'N/A'}</p>
                </div>
                <p className="action">
                  <span className="title">Action</span>
                  <br />
                  <span
                    style={{
                      fontWeight: 'normal',
                      color: event.isDelete ? 'red' : '#7C71FF',
                      textTransform: 'capitalize'
                    }}>
                    {event.action || 'N/A'}:{' '}
                  </span>
                  {event.target_account || 'N/A'}
                </p>
              </div>
            )
          }))}
        />
      )}
      {loading && page !== 1 && (
        <div className="page-loader">
          <TableLoader size="20px" />
        </div>
      )}
      {events?.length === 0 && !loading && (
        <div className="loader">
          <p>No logs found</p>
        </div>
      )}
    </DrawerStyle>
  );
};

export default ActivityEmployee;

ActivityEmployee.propTypes = {
  employeeId: PropTypes.string
};

const DrawerStyle = styled.div`
  padding: 35px;
  height: 100%;
  overflow-y: auto;

  .loader {
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .page-loader {
    height: 70px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  p {
    margin: 0;
  }
  .flexbox {
    display: flex;
    justify-content: space-between;

    .date {
      font-family: 'Plus Jakarta Sans';
      font-weight: 700;
      font-size: 16px;
      color: #0e0e0e;
    }
  }
  .custom-content {
    padding-bottom: 20px;
  }
  .action {
    font-size: 16px;

    .title {
      color: #000000;
      font-family: Poppins;
      font-weight: 600;
      font-size: 14px;
    }
  }
  .dotIcon {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #7c71ff;
    rotate: -90deg;
  }
  .profile-flex {
    display: flex;
    align-items: center;
    gap: 5px;
    margin-top: 2px;
    margin-bottom: 8px;

    img {
      width: 16px;
      height: 16px;
      border-radius: 50%;
    }
  }
`;
