import { Form, Modal } from 'antd';
import Title from 'antd/es/typography/Title';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { FieldBox, FlexWrapper, GreyText } from '../../../../theme/common_style';
import { CustomBtn } from '../../common';
import { changeDeviceStatus } from '../../../../services/api_collection';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const RetireHardware = ({ open, onClose }) => {
  const [form] = Form.useForm();
  const { id } = useParams();
  const [loader, setLoader] = useState(false);
  const [value, setValue] = useState();
  // const [deviceDetails, setDeviceDetails] = useState(null);
  const navigate = useNavigate();

  const handleChangeStatus = async (values) => {
    setLoader(true);
    let req = {
      deviceId: Number(id),
      status: 'retired',
      reason: values?.reason
    };
    let res = await changeDeviceStatus(req);
    if (res?.statusCode === 200) {
      setLoader(false);
      toast.success(res?.message);
      navigate('/hms');
      onClose();
    } else {
      setLoader(false);
      toast.error(
        res?.response?.data?.message || res?.error || res.message || 'Something went wrong'
      );
    }
  };

  // const handleGetDeviceDetails = async () => {
  //   if (id) {
  //     let res = await getDeviceDetails(id);
  //     if (res?.statusCode === 200) {
  //       setDeviceDetails(res?.data);
  //     } else {
  //       setDeviceDetails(null);
  //       toast.error(
  //         res?.response?.data?.message || res?.error || res?.message || 'Something went wrong'
  //       );
  //     }
  //   }
  // };

  // useEffect(() => {
  //   handleGetDeviceDetails();
  // }, [id]);

  return (
    <Modal
      open={open}
      onCancel={onClose}
      prefixCls="antCustomModal"
      width={700}
      centered
      footer={null}>
      <Title level={4} style={{ margin: 0, textAlign: 'center' }}>
        Retire Hardware
      </Title>

      <GreyText size="13px" style={{ textAlign: 'center', margin: '10px 0 24px' }}>
        Are you sure you want to decommission this Hardware?
      </GreyText>

      <Form form={form} onFinish={handleChangeStatus}>
        <FieldBox>
          <label>Reason for Decommissioning</label>
          <Form.Item name="reason">
            <ReactQuill
              value={value}
              onChange={setValue}
              style={{
                border: '1px solid #d9d9d9',
                borderRadius: '6px'
              }}
              modules={{
                toolbar: [
                  [{ header: [1, 2, 3, false] }],
                  ['bold', 'italic', 'underline', 'strike'],
                  [{ color: [] }, { background: [] }],
                  [{ list: 'ordered' }, { list: 'bullet' }],
                  ['clean']
                ]
              }}
              className="custom-quill"
            />
          </Form.Item>
        </FieldBox>
        <FlexWrapper justify="end" style={{ marginTop: '20px' }}>
          <CustomBtn type="submit" style={{ width: '140px' }}>
            {loader ? 'Loading...' : 'Retire'}
          </CustomBtn>
        </FlexWrapper>
      </Form>
    </Modal>
  );
};

RetireHardware.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func
};

export default RetireHardware;
