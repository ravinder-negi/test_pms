import { Button, Form, Modal } from 'antd';
import Title from 'antd/es/typography/Title';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { DarkText, FlexWrapper } from '../../../theme/common_style';
import useEmployeeOptions from '../../../hooks/useEmployeeOptions';
import { useParams } from 'react-router-dom';
import {
  updateProjectInchargeApi,
  updateProjectManagerApi,
  updateProjectTeamApi
} from '../../../redux/project/apiRoute';
import { toast } from 'react-toastify';
import { AvatarMultiSelect } from '../../../components/common/AvatarSelect';

const AddMemeberModal = ({ type, size = '30px', selectedUser, handleListing, filterOption }) => {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const { loading: employeeLoading, options: employeeOption } = useEmployeeOptions();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);

  const close = () => {
    setOpen(false);
    form.resetFields();
  };

  useEffect(() => {
    if (selectedUser) {
      let ids = selectedUser?.map((el) => el?.employee);

      form.setFieldsValue({
        memberIds: ids
      });
    }
  }, [selectedUser, form, open]);

  const handleFinish = async (values) => {
    try {
      setLoading(true);
      let res;
      if (type === 'Project Incharge') {
        res = await updateProjectInchargeApi(values, id);
      } else if (type === 'Project Manager') {
        res = await updateProjectManagerApi(values, id);
      } else {
        res = await updateProjectTeamApi(values, id);
      }
      if (res?.statusCode === 200) {
        toast.success(res?.message || 'Successfully updated');
        close();
        handleListing();
      } else {
        toast.error(res?.message || 'Something went wrong');
      }
    } catch (err) {
      toast.error(err?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <FlexWrapper
        style={{
          borderRadius: '50%',
          border: '1px dashed #0E0E0E',
          height: size,
          width: size,
          fontSize: '20px'
        }}
        onClick={() => setOpen(true)}
        cursor="pointer">
        +
      </FlexWrapper>
      <Modal
        open={open}
        onCancel={close}
        centered
        prefixCls="antCustomModal"
        width={400}
        footer={null}>
        <Title style={{ margin: 0, textAlign: 'center' }} level={4}>
          Update {type}
        </Title>
        <Form autoComplete="off" form={form} onFinish={handleFinish}>
          <FlexWrapper direction="column" gap="10px" margin="25px 0 6px" width="100%" align="start">
            <DarkText weight="400">{type}</DarkText>
            <Form.Item
              name="memberIds"
              rules={[{ required: true, message: `Please select ${type}` }]}
              style={{ width: '100%' }}>
              <AvatarMultiSelect
                options={
                  filterOption?.length > 0
                    ? employeeOption?.filter(
                        (item) => !filterOption?.find((el) => el?.emp_id?.id == item?.value)
                      )
                    : employeeOption
                }
                placeholder={`Select ${type}`}
                loading={employeeLoading}
                maxCount={type === 'Project Manager' ? 1 : undefined}
                isEmp={true}
              />
            </Form.Item>
          </FlexWrapper>
          <FlexWrapper justify="end">
            <Button
              loading={loading}
              style={{ width: '140px' }}
              prefixCls="antCustomBtn"
              onClick={form.submit}>
              Add
            </Button>
          </FlexWrapper>
        </Form>
      </Modal>
    </>
  );
};

AddMemeberModal.propTypes = {
  type: PropTypes.string.isRequired,
  size: PropTypes.string,
  selectedUser: PropTypes.any,
  handleListing: PropTypes.func,
  filterOption: PropTypes.array
};

export default AddMemeberModal;
