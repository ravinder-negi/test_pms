import styled from '@emotion/styled';
import React, { useEffect, useState } from 'react';
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
  const { data } = useSelector((e) => e.userInfo);
  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);

    const id = data?.user_details?.id;

    try {
      let res = await ReceivedNotificationApi(id);
      if (res.statusCode === 200) {
        setNotificationData(res?.data);
        console.log(res?.data);
      } else {
        toast.warning(res?.message);
      }
    } catch (errorInfo) {
      console.log(errorInfo);
    } finally {
      setLoading(false);
    }
  };

  const formattedData = notificationData?.reduce((acc, item) => {
    if (['hour', 'minute', 'second']?.some((str) => getTimeAgo(item?.created_at)?.includes(str))) {
      !acc.Today ? (acc.Today = [item]) : acc.Today.push(item);
    } else {
      !acc['This Month'] ? (acc['This Month'] = [item]) : acc['This Month'].push(item);
    }
    return acc;
  }, {});

  console.log(formattedData, 'formattedData');

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
          {/* <div>
            <FlexWrapper justify="space-between">
              <p className="heading">New</p>
              <PurpleText>Mark as read</PurpleText>
            </FlexWrapper>
            <List
              itemLayout="horizontal"
              dataSource={newNotifications?.slice(0, 2)}
              renderItem={(item, index) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Badge dot color="#7C71FF">
                        <Avatar src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`} />
                      </Badge>
                    }
                    title={item?.title}
                    description={item?.description}
                  />
                </List.Item>
              )}
            />
          </div>
          <CustomDivider /> */}
          {formattedData &&
            Object.keys(formattedData)?.map((item, i) => (
              <div key={i}>
                <div>
                  <p className="heading">{item}</p>
                  <List
                    itemLayout="horizontal"
                    dataSource={formattedData?.[item] || []}
                    renderItem={(data, index) => (
                      <List.Item key={index}>
                        <List.Item.Meta
                          prefixCls="notificationList"
                          avatar={
                            <AvatarImage
                              style={{ height: '40px', width: '40px', fontSize: '18px' }}
                              image={
                                process.env.REACT_APP_S3_BASE_URL +
                                'employee/profileImg/' +
                                data?.created_by?.id +
                                '.jpg'
                              }
                              name={
                                getFullName(
                                  data?.created_by?.first_name,
                                  data?.created_by?.middle_name,
                                  data?.created_by?.last_name
                                ) || data?.created_by
                              }
                            />
                          }
                          title={
                            <span>
                              {getFullName(
                                data?.created_by?.first_name,
                                data?.created_by?.middle_name,
                                data?.created_by?.last_name
                              ) || data?.created_by}{' '}
                              —{' '}
                              <span
                                className="purpleText"
                                onClick={() => {
                                  navigate('/notification');
                                  close();
                                }}>
                                &quot;{data?.title}&quot;
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
                                <ClampedDescription htmlString={data?.description} />
                              </div>
                              <p className="time">{getTimeAgo(data?.created_at)} ago</p>
                            </div>
                          }
                        />
                      </List.Item>
                    )}
                  />
                </div>
                {i < Object.keys(formattedData)?.length - 1 && <CustomDivider />}
              </div>
            ))}
        </div>
      )}
    </DrawerStyle>
  );
};

export default NotificationDrawer;

NotificationDrawer.propTypes = {
  close: PropTypes.func
};

const DrawerStyle = styled.div`
  padding: 15px 35px;
  height: 100%;
  overflow-y: auto;

  .title {
    font-size: 14px !important;
    color: #0e0e0e !important;
    font-family: Plus Jakarta Sans !important;
    font-weight: 500 !important;
    margin: 0 !important;
  }

  .description {
    font-size: 14px;
    font-weight: 400;
    margin: 0px !important;
    color: #0e0e0e;

    * {
      font-size: 14px;
      font-weight: 400;
      margin: 0px !important;
      color: #0e0e0e;

      b {
        font-weight: 600 !important;
      }
    }
  }

  .time {
    color: #767676 !important;
    font-size: 14px !important;
    font-family: Plus Jakarta Sans !important;
    font-weight: 500 !important;
    margin: 0 !important;
    margin-top: 4px !important;
  }

  .purpleText {
    color: #7c71ff !important;
    font-weight: 600 !important;
    font-family: Plus Jakarta Sans !important;
    cursor: pointer !important;
  }

  li {
    padding: 10px 0 !important;
    border: none !important;
    margin: 0 !important;
  }

  .heading {
    font-family: 'Plus Jakarta Sans';
    font-weight: 700;
    margin: 0 0 8px !important;
    font-size: 15px;
    color: #0e0e0e;
  }
`;

const CustomDivider = styled(Divider)`
  border-color: #c8c8c8 !important;
  margin: 8px 0 20px !important;
`;
