import { Button, Form, Input, Modal } from 'antd';
import Title from 'antd/es/typography/Title';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { FieldBox, FlexWrapper } from '../../../../theme/common_style';
import TextArea from 'antd/es/input/TextArea';
import { addDeviceRemark, updateDeviceRemarks } from '../../../../services/api_collection';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';

const AddRemark = ({ open, onClose, handleGetRemarkListing, val, editId }) => {
  const [form] = Form.useForm();
  const { id } = useParams();
  const [loader, setLoader] = useState(false);

  const handleAddRemark = async (values) => {
    setLoader(true);
    let req = {
      remarks: values?.remarks,
      title: values?.title
    };
    let res = val ? await updateDeviceRemarks(editId, req) : await addDeviceRemark(id, req);
    if (res?.statusCode === 200) {
      setLoader(false);
      toast.success(res?.message);
      onClose();
      handleGetRemarkListing();
    } else {
      setLoader(false);
      toast.error(
        res?.response?.data?.message || res?.error || res?.message || 'Something went wrong'
      );
    }
  };

  useEffect(() => {
    if (val) {
      form.setFieldsValue({
        title: val?.title,
        remarks: val?.remarks
      });
    }
  }, [val]);

  return (
    <Modal
      open={open}
      onCancel={onClose}
      prefixCls="antCustomModal"
      width={450}
      centered
      footer={null}>
      <Title level={4} style={{ margin: 0, textAlign: 'center' }}>
        Add Remark
      </Title>

      <Form form={form} onFinish={handleAddRemark}>
        <FieldBox>
          <label>
            Title <span>*</span>
          </label>
          <Form.Item
            name="title"
            type="text"
            validateFirst
            rules={[{ required: true, message: 'Title is required' }]}>
            <Input prefixCls="form-input" placeholder="Enter Title" />
          </Form.Item>
        </FieldBox>
        <FieldBox>
          <label>
            Remarks <span>*</span>
          </label>
          <Form.Item name="remarks" rules={[{ required: true, message: 'Remarks is required' }]}>
            <TextArea rows={5} maxLength={1000} placeholder="Write Remarks here" />
          </Form.Item>
        </FieldBox>
        <FlexWrapper justify="end" style={{ marginTop: '20px' }}>
          <Button
            onClick={() => form.submit()}
            style={{ width: '140px' }}
            prefixCls="antCustomBtn"
            loading={loader}>
            Save
          </Button>
        </FlexWrapper>
      </Form>
    </Modal>
  );
};

AddRemark.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  handleGetRemarkListing: PropTypes.func,
  val: PropTypes.any,
  editId: PropTypes.string
};

export default AddRemark;
