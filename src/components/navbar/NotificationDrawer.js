import styled from '@emotion/styled';
import React, { useEffect, useState, useMemo } from 'react';
import TableLoader from '../../components/loaders/TableLoader';
import { Divider, List } from 'antd';
import { FlexWrapper } from '../../theme/common_style';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { ReceivedNotificationApi } from '../../redux/notification/apiRoute';
import { ClampedDescription, getFullName, getTimeAgo } from '../../utils/common_functions';
import AvatarImage from '../common/AvatarImage';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const NotificationDrawer = ({ close }) => {
  const [notificationData, setNotificationData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { data } = useSelector((state) => state.userInfo);
  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    const userId = data?.user_details?.id;

    try {
      const response = await ReceivedNotificationApi(userId);
      if (response.statusCode === 200) {
        setNotificationData(response?.data ?? []);
      } else {
        toast.warning(response?.message ?? 'Failed to fetch notifications');
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const formattedData = useMemo(() => {
    return notificationData?.reduce((acc, item) => {
      const timeAgo = getTimeAgo(item?.created_at);
      if (['hour', 'minute', 'second'].some((str) => timeAgo?.includes(str))) {
        acc.Today = acc.Today ?? [];
        acc.Today.push(item);
      } else {
        acc['This Month'] = acc['This Month'] ?? [];
        acc['This Month'].push(item);
      }
      return acc;
    }, {});
  }, [notificationData]);

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <DrawerStyle>
      {loading ? (
        <FlexWrapper justify="center" align="center" style={{ height: '100vh' }}>
          <TableLoader size="30px" />
        </FlexWrapper>
      ) : (
        <div>
          {formattedData &&
            Object.keys(formattedData).map((category, index) => (
              <div key={index}>
                <p className="heading">{category}</p>
                <List
                  itemLayout="horizontal"
                  dataSource={formattedData[category] ?? []}
                  renderItem={(item, idx) => {
                    const fullName =
                      getFullName(
                        item?.created_by?.first_name,
                        item?.created_by?.middle_name,
                        item?.created_by?.last_name
                      ) || item?.created_by;

                    return (
                      <List.Item key={idx}>
                        <List.Item.Meta
                          avatar={
                            <AvatarImage
                              style={{ height: '40px', width: '40px', fontSize: '18px' }}
                              image={`${process.env.REACT_APP_S3_BASE_URL}employee/profileImg/${item?.created_by?.id}.jpg`}
                              name={fullName}
                            />
                          }
                          title={
                            <span>
                              {fullName} —{' '}
                              <span
                                className="purpleText"
                                onClick={() => {
                                  navigate('/notification');
                                  close();
                                }}>
                                &quot;{item?.title}&quot;
                              </span>
                            </span>
                          }
                          description={
                            <div
                              style={{ cursor: 'pointer' }}
                              onClick={() => {
                                navigate('/notification');
                                close();
                              }}>
                              <div className="description">
                                <ClampedDescription htmlString={item?.description} />
                              </div>
                              <p className="time">{getTimeAgo(item?.created_at)} ago</p>
                            </div>
                          }
                        />
                      </List.Item>
                    );
                  }}
                />
                {index < Object.keys(formattedData).length - 1 && <CustomDivider />}
              </div>
            ))}
        </div>
      )}
    </DrawerStyle>
  );
};

NotificationDrawer.propTypes = {
  close: PropTypes.func.isRequired
};

const DrawerStyle = styled.div`
  padding: 15px 35px;
  height: 100%;
  overflow-y: auto;

  .title {
    font-size: 14px;
    color: #0e0e0e;
    font-family: Plus Jakarta Sans;
    font-weight: 500;
    margin: 0;
  }

  .description {
    font-size: 14px;
    font-weight: 400;
    margin: 0;
    color: #0e0e0e;

    * {
      font-size: 14px;
      font-weight: 400;
      margin: 0;
      color: #0e0e0e;

      b {
        font-weight: 600;
      }
    }
  }

  .time {
    color: #767676;
    font-size: 14px;
    font-family: Plus Jakarta Sans;
    font-weight: 500;
    margin: 0;
    margin-top: 4px;
  }

  .purpleText {
    color: #7c71ff;
    font-weight: 600;
    font-family: Plus Jakarta Sans;
    cursor: pointer;
  }

  li {
    padding: 10px 0;
    border: none;
    margin: 0;
  }

  .heading {
    font-family: 'Plus Jakarta Sans';
    font-weight: 700;
    margin: 0 0 8px;
    font-size: 15px;
    color: #0e0e0e;
  }
`;

const CustomDivider = styled(Divider)`
  border-color: #c8c8c8;
  margin: 8px 0 20px;
`;

export default NotificationDrawer;
