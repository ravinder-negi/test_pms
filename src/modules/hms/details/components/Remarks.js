import React, { useEffect, useState } from 'react';
import RemarkCard from './RemarkCard';
import { FlexWrapper, GridBox } from '../../../../theme/common_style';
import Title from 'antd/es/typography/Title';
import { Button, Skeleton } from 'antd';
import AddRemark from '../modals/AddRemark';
import { getDeviceRemark } from '../../../../services/api_collection';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import EmptyData from '../../../../components/common/EmptyData';
import { NoLeaveIcon } from '../../../../theme/SvgIcons';
import { RemarkGrid } from '../../../employees/view-employee/ViewEmployeeStyle';
import { useSelector } from 'react-redux';
import { checkPermission } from '../../../../utils/common_functions';

const Remarks = () => {
  const { id } = useParams();
  const [remarkListing, setRemarkListing] = useState([]);
  console.group(remarkListing, 'remarkListing');
  const [addModal, setAddModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const { permissions } = useSelector((state) => state?.userInfo?.data);
  let permissionSection = 'HMS';
  const canCreate = checkPermission(permissionSection, 'create', permissions);
  const canUpdate = checkPermission(permissionSection, 'update', permissions);
  const canDelete = checkPermission(permissionSection, 'del', permissions);

  const handleGetRemarkListing = async () => {
    setLoading(true);
    if (id) {
      let res = await getDeviceRemark(id);
      if (res?.statusCode === 200) {
        setRemarkListing(res?.data);
        setLoading(false);
      } else {
        toast.error(
          res?.response?.data?.message || res?.error || res?.message || 'Something went wrong'
        );
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    handleGetRemarkListing();
  }, [id]);
  return (
    <div>
      {addModal && (
        <AddRemark
          open={addModal}
          onClose={() => setAddModal(false)}
          handleGetRemarkListing={handleGetRemarkListing}
        />
      )}
      <FlexWrapper justify="space-between" gap="10px" margin="8px 0 12px">
        <Title level={4} style={{ margin: 0, textAlign: 'left' }}>
          Remarks
        </Title>
        {canCreate && (
          <Button prefixCls="antCustomBtn" onClick={() => setAddModal(true)}>
            + Add Remark
          </Button>
        )}
      </FlexWrapper>
      {loading || remarkListing?.length > 0 ? (
        loading ? (
          <RemarkGrid>
            <div className="card">
              <Skeleton active title={false} paragraph={{ rows: 5 }} />
            </div>
            <div className="card">
              <Skeleton active title={false} paragraph={{ rows: 5 }} />
            </div>
            <div className="card">
              <Skeleton active title={false} paragraph={{ rows: 5 }} />
            </div>
          </RemarkGrid>
        ) : (
          <GridBox cols={3}>
            {remarkListing?.map((val) => (
              <RemarkCard
                key={val.id}
                title={val.title}
                remarks={val.remarks}
                createdAt={val.created_at}
                handleGetRemarkListing={handleGetRemarkListing}
                deletId={val?.id}
                val={val}
                canUpdate={canUpdate}
                canDelete={canDelete}
              />
            ))}
          </GridBox>
        )
      ) : (
        <EmptyData
          height={'40vh'}
          icon={<NoLeaveIcon />}
          title={'No Remarks'}
          subTitle={'There are no Remarks.'}
        />
      )}
    </div>
  );
};

export default Remarks;
