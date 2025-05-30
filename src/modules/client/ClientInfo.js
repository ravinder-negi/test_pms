import React, { useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { FlexWrapper } from '../../theme/common_style';
import ActivityDrawer from './ActivityDrawer';
import { Breadcrumb, Drawer } from 'antd';
import { HistoryIcon } from '../../theme/SvgIcons';
import colors from '../../theme/colors';
import AvatarImage from '../../components/common/AvatarImage';

const ClientInfo = () => {
  const location = useLocation();
  const { client } = location.state || {};
  const [activityDrawer, setActivityDrawer] = useState(false);
  const { id } = useParams();

  console.log(client, 'client');

  return (
    <FlexWrapper gap="20px" cursor="default">
      {activityDrawer && (
        <Drawer
          width={490}
          title="Activity"
          placement="right"
          closable={true}
          prefixCls="activityCustomDrawer"
          onClose={() => setActivityDrawer(false)}
          open={activityDrawer}
          key="right">
          <ActivityDrawer clientId={id} />
        </Drawer>
      )}
      <FlexWrapper justify="space-between" width="100%" cursor="default">
        <Breadcrumb
          items={[{ title: <Link to="/clients">Client</Link> }, { title: client?.name }]}
        />
        <FlexWrapper
          gap="6px"
          cursor="default"
          justify="end"
          style={{ cursor: 'pointer' }}
          onClick={() => setActivityDrawer(true)}>
          <HistoryIcon color={colors.darkSkyBlue} />
          <p style={{ color: colors.darkSkyBlue, margin: 0 }}>Activity</p>
        </FlexWrapper>
      </FlexWrapper>
      <FlexWrapper
        width="100%"
        justify="space-between"
        cursor="default"
        style={{ height: '100%', alignItems: 'unset' }}>
        <FlexWrapper
          direction="column"
          width="30%"
          gap="12px"
          cursor="default"
          style={{
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '12px',
            alignItems: 'center'
          }}>
          <div style={{ position: 'relative' }}>
            <AvatarImage
              style={{
                width: '160px',
                height: '160px',
                minWidth: '96px',
                borderRadius: '50%',
                backgroundColor: '#7c71ff',
                fontSize: '44px'
              }}
              image={process.env.REACT_APP_S3_BASE_URL + client?.profile_image}
              name={client?.name}
            />
          </div>
          <FlexWrapper direction="column" align="center" cursor="default">
            <div style={{ fontWeight: '700', fontSize: '18px', fontFamily: 'Plus Jakarta Sans' }}>
              {client.name}
            </div>
            <div style={{ fontWeight: '400', fontSize: '14px', fontFamily: 'Plus Jakarta Sans' }}>
              Client
            </div>
          </FlexWrapper>
        </FlexWrapper>

        <FlexWrapper
          width="68%"
          align="flex-start"
          cursor="default"
          style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '12px',
            height: '100%'
          }}
          gap="10px">
          <FlexWrapper justify="space-between" width="100%" cursor="default">
            <FlexWrapper
              cursor="default"
              style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '24px', fontWeight: '700' }}>
              Client Info
            </FlexWrapper>
          </FlexWrapper>
          <FlexWrapper direction="column" width="100%" gap="10px" cursor="default">
            <div
              style={{
                width: '100%',
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '20px'
              }}>
              <FlexWrapper align="flex-start" direction="column" gap="2px" cursor="default">
                <div
                  style={{
                    fontFamily: 'Plus Jakarta Sans',
                    fontSize: '14px',
                    fontWeight: '400',
                    color: '#9F9F9F'
                  }}>
                  Email
                </div>
                <div
                  style={{
                    fontFamily: 'Plus Jakarta Sans',
                    fontSize: '16px',
                    fontWeight: '500',
                    color: '#0E0E0E',
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    maxWidth: '95%'
                  }}>
                  {client.email || 'N/A'}
                </div>
              </FlexWrapper>
              <FlexWrapper align="flex-start" direction="column" gap="2px" cursor="default">
                <div
                  style={{
                    fontFamily: 'Plus Jakarta Sans',
                    fontSize: '14px',
                    fontWeight: '400',
                    color: '#9F9F9F'
                  }}>
                  Contact Number
                </div>
                <div
                  style={{
                    fontFamily: 'Plus Jakarta Sans',
                    fontSize: '16px',
                    fontWeight: '500',
                    color: '#0E0E0E'
                  }}>
                  +{client?.country_code} {client.contact}
                </div>
              </FlexWrapper>
            </div>
            <div
              style={{
                width: '100%',
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '16px'
              }}>
              <FlexWrapper align="flex-start" direction="column" gap="2px" cursor="default">
                <div
                  style={{
                    fontFamily: 'Plus Jakarta Sans',
                    fontSize: '14px',
                    fontWeight: '400',
                    color: '#9F9F9F'
                  }}>
                  Country
                </div>
                <div
                  style={{
                    fontFamily: 'Plus Jakarta Sans',
                    fontSize: '16px',
                    fontWeight: '500',
                    color: '#0E0E0E'
                  }}>
                  {client.country}
                </div>
              </FlexWrapper>
              <FlexWrapper align="flex-start" direction="column" gap="2px" cursor="default">
                <div
                  style={{
                    fontFamily: 'Plus Jakarta Sans',
                    fontSize: '14px',
                    fontWeight: '400',
                    color: '#9F9F9F'
                  }}>
                  City
                </div>
                <div
                  style={{
                    fontFamily: 'Plus Jakarta Sans',
                    fontSize: '16px',
                    fontWeight: '500',
                    color: '#0E0E0E'
                  }}>
                  {client.city || 'N/A'}
                </div>
              </FlexWrapper>
              <FlexWrapper align="flex-start" direction="column" gap="2px" cursor="default">
                <div
                  style={{
                    fontFamily: 'Plus Jakarta Sans',
                    fontSize: '14px',
                    fontWeight: '400',
                    color: '#9F9F9F'
                  }}>
                  State
                </div>
                <div
                  style={{
                    fontFamily: 'Plus Jakarta Sans',
                    fontSize: '16px',
                    fontWeight: '500',
                    color: '#0E0E0E'
                  }}>
                  {client.state || 'N/A'}
                </div>
              </FlexWrapper>
            </div>
            <div
              style={{
                width: '100%',
                display: 'grid',
                gridTemplateColumns: 'repeat(1, 1fr)',
                gap: '16px'
              }}>
              <FlexWrapper align="flex-start" direction="column" gap="2px" cursor="default">
                <div
                  style={{
                    fontFamily: 'Plus Jakarta Sans',
                    fontSize: '14px',
                    fontWeight: '400',
                    color: '#9F9F9F'
                  }}>
                  Address
                </div>
                <div
                  style={{
                    fontFamily: 'Plus Jakarta Sans',
                    fontSize: '16px',
                    fontWeight: '500',
                    color: '#0E0E0E',
                    textAlign: 'left'
                  }}>
                  {client.address || 'N/A'}
                </div>
              </FlexWrapper>
            </div>
            <div
              style={{
                width: '100%',
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '16px'
              }}>
              <FlexWrapper align="flex-start" direction="column" gap="2px" cursor="default">
                <div
                  style={{
                    fontFamily: 'Plus Jakarta Sans',
                    fontSize: '14px',
                    fontWeight: '400',
                    color: '#9F9F9F'
                  }}>
                  Skype Id
                </div>
                <div
                  style={{
                    fontFamily: 'Plus Jakarta Sans',
                    fontSize: '16px',
                    fontWeight: '500',
                    color: '#0E0E0E'
                  }}>
                  {client.skype_id || 'N/A'}
                </div>
              </FlexWrapper>
              <FlexWrapper align="flex-start" direction="column" gap="2px" cursor="default">
                <div
                  style={{
                    fontFamily: 'Plus Jakarta Sans',
                    fontSize: '14px',
                    fontWeight: '400',
                    color: '#9F9F9F'
                  }}>
                  Slack Id
                </div>
                <div
                  style={{
                    fontFamily: 'Plus Jakarta Sans',
                    fontSize: '16px',
                    fontWeight: '500',
                    color: '#0E0E0E'
                  }}>
                  {client.slack_id || 'N/A'}
                </div>
              </FlexWrapper>
            </div>
          </FlexWrapper>
        </FlexWrapper>
      </FlexWrapper>
    </FlexWrapper>
  );
};

export default ClientInfo;
