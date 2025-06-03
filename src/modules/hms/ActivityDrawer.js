import { Timeline } from 'antd';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { toast } from 'react-toastify';
import moment from 'moment/moment';
import TableLoader from '../../components/loaders/TableLoader';
import { ToogleSidebarIcon } from '../../theme/SvgIcons';
import AvatarImage from '../../components/common/AvatarImage';
import { getFullName } from '../../utils/common_functions';
import { getHmsLogs } from '../../services/api_collection';
import { DrawerStyle } from '../../theme/common_style';
import PropTypes from 'prop-types';

const ActivityDrawer = ({ id }) => {
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
      id && params.append('hms_id', id);
      let res = await getHmsLogs(params);
      if (res?.statusCode === 200) {
        setTotal(res?.data?.totalLogs);
        const arr = res?.data?.logs?.map((el) => ({
          date: moment(el?.created_at).format('DD MMM, YYYY'),
          role: el?.actor_role,
          action: el?.action_details,
          actor_profile: el?.actor_account?.profile_image,
          user:
            getFullName(el?.actor?.first_name, el?.actor?.middle_name, el?.actor?.last_name) ||
            el?.actor_account?.email,
          time: moment(el?.created_at).format('hh:mm A'),
          actorId: el?.actor_account?.id ?? el?.actor?.id,
          target_employee: el?.target_hms?.device_id
        }));
        arr && setEvents((prev) => [...prev, ...arr]);
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
                <p className="action" style={{ textTransform: 'capitalize' }}>
                  <span className="title">Action</span>
                  <br />
                  <span
                    style={{
                      fontWeight: 'normal',
                      color: event.isDelete ? 'red' : '#7C71FF'
                    }}>
                    {event.action || 'N/A'}:{' '}
                  </span>
                  {event?.target_employee || event.role || 'N/A'}
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

export default ActivityDrawer;

ActivityDrawer.propTypes = {
  id: PropTypes.string.isRequired
};
