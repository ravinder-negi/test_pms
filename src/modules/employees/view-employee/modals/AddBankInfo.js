/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/prop-types */
import { Button, Form, Input, Modal, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import { ModalCloseBox } from '../../EmployeesStyle';
import { DropdownIconNew, ModalCloseIcon } from '../../../../theme/SvgIcons';
import styled from '@emotion/styled';
import { FieldBox, FlexWrapper } from '../../../../theme/common_style';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import { addEmployeeBank } from '../../../../services/api_collection';
import { bankOptions } from '../../../../utils/constant';

const { Option } = Select;

const AddBankInfo = ({ open, onClose, editDetails, handleList }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  let checkBranch = editDetails?.branch_name
    ? !bankOptions.some((item) => item.value === editDetails?.branch_name)
    : false;
  const [branchName, setBranchName] = useState(checkBranch);

  const handleAddOrUpdate = async (values) => {
    try {
      setLoading(true);
      let res;
      res = await addEmployeeBank(values, id);

      if (res?.statusCode === 200) {
        toast.success(res?.message || 'Successfully saved');
        onClose();
        handleList();
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
    if (editDetails) {
      const { bank_account, branch_name, ifsc_code } = editDetails;
      form.setFieldsValue({
        bank_account,
        branch_name,
        ifsc_code
      });
    }
  }, [editDetails]);

  return (
    <Modal
      open={open}
      onCancel={onClose}
      prefixCls="create-employees"
      width={376}
      centered
      closeIcon={false}
      footer={null}>
      <ModalCloseBox onClick={onClose}>
        <ModalCloseIcon />
      </ModalCloseBox>
      <ContentBox>
        <h4>Bank Info</h4>

        <Form form={form} onFinish={handleAddOrUpdate}>
          <>
            <FieldBox>
              <label htmlFor="bank_account">
                Bank Account no. <span>*</span>
              </label>
              <Form.Item
                name="bank_account"
                validateFirst
                rules={[
                  { required: true, message: 'Bank Account no. is required' },
                  {
                    pattern: /^\d{9,18}$/,
                    message: 'Bank Account no. must be 9 to 18 digits (numbers only)'
                  }
                ]}
                normalize={(value) => value.replace(/[^\d]/g, '')} // removes non-digits
              >
                <Input prefixCls="form-input" placeholder="Enter Bank Account no." />
              </Form.Item>
            </FieldBox>

            <FieldBox>
              <div className="addition-div">
                <label htmlFor="branch_name">
                  Bank Name <span>*</span>
                </label>
                <p
                  onClick={() => {
                    setBranchName(!branchName);
                  }}>
                  {branchName ? '- Remove' : '+ Add'}
                </p>
              </div>
              <Form.Item
                name="branch_name"
                rules={[
                  { required: true, message: 'Bank Name is required' },
                  {
                    min: 3,
                    max: 40,
                    message: 'Bank Name must be between 3 and 40 characters'
                  }
                ]}
                normalize={(value) => {
                  if (!value) return '';
                  const cleaned = value.replace(/[^A-Za-z\s.-]/g, '');
                  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
                }}>
                {branchName ? (
                  <Input prefixCls="form-input" placeholder="Enter Bank Name" />
                ) : (
                  <Select
                    showSearch
                    prefixCls="form-select"
                    suffixIcon={<DropdownIconNew />}
                    placeholder="--Select Option--"
                    filterOption={(input, option) =>
                      (option?.children ?? '').toLowerCase().includes(input.toLowerCase())
                    }>
                    {bankOptions?.map((option) => (
                      <Option key={option.value} value={option.value}>
                        {option.label}
                      </Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </FieldBox>

            <FieldBox>
              <label htmlFor="ifsc_code">
                IFSC <span>*</span>
              </label>
              <Form.Item
                name="ifsc_code"
                rules={[
                  { required: true, message: 'IFSC is required' },
                  {
                    pattern: /^[A-Z]{4}0[A-Z0-9]{6}$/,
                    message: 'Enter a valid IFSC (e.g. SBIN0001234)'
                  }
                ]}
                normalize={(value) => value.toUpperCase().replace(/[^A-Z0-9]/g, '')}>
                <Input prefixCls="form-input" placeholder="Enter IFSC" />
              </Form.Item>
            </FieldBox>

            <FlexWrapper justify="end" style={{ marginTop: 20 }}>
              <Button
                onClick={() => form.submit()}
                loading={loading}
                style={{ width: 140 }}
                prefixCls="antCustomBtn">
                Save
              </Button>
            </FlexWrapper>
          </>
        </Form>
      </ContentBox>
    </Modal>
  );
};

export default AddBankInfo;

const ContentBox = styled.div`
  width: 100%;
  padding: 24px;

  h4 {
    font-family: 'Plus Jakarta Sans';
    font-weight: 700;
    font-size: 24px;
    color: #0e0e0e;
    margin: 0;
    text-align: center;
  }
`;
