/* eslint-disable react/prop-types */
import styled from '@emotion/styled';
import { Button, Checkbox, DatePicker, Drawer, Form, Select } from 'antd';
import React, { useEffect } from 'react';
import { DropdownIconNew } from '../../../../theme/SvgIcons';
import { extensionTypes, FileType } from '../../../../utils/constant';
import { FlexWrapper } from '../../../../theme/common_style';

const DocFilter = ({ open, onClose, filterData, setFilterData }) => {
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    setFilterData(values);
    onClose();
  };

  const onReset = () => {
    setFilterData({});
    form.resetFields();
  };

  useEffect(() => {
    if (filterData) {
      form.setFieldsValue(filterData);
    }
  }, []);

  return (
    <Drawer
      width={390}
      title={<Title clear={onReset} />}
      placement="right"
      closable={false}
      prefixCls="activityCustomDrawer"
      onClose={onClose}
      open={open}
      key="right">
      <FilterWrapper>
        <Form style={{ height: '100%' }} form={form} layout="vertical" onFinish={onFinish}>
          <div className="filter-flex">
            <div>
              <div className="section">
                <h2>File Type</h2>
                <Form.Item name="file_type">
                  <VerticalCheckboxGroup>
                    {FileType?.map((el) => (
                      <CustomCheckbox key={el?.value} value={el?.value}>
                        {el?.label}
                      </CustomCheckbox>
                    ))}
                  </VerticalCheckboxGroup>
                </Form.Item>
              </div>
              <div className="section">
                <h2>File Extension</h2>
                <Form.Item name="file_extension">
                  <Select
                    mode="multiple"
                    maxTagCount={4}
                    prefixCls="antMultipleSelector"
                    suffixIcon={<DropdownIconNew />}
                    placeholder="--Select Option--"
                    options={extensionTypes}
                    loading={false}
                  />
                </Form.Item>
              </div>

              <div className="section">
                <h2>Uploaded Date</h2>
                <Form.Item shouldUpdate noStyle>
                  {({ getFieldValue }) => {
                    const startDate = getFieldValue('start_date');
                    const endDate = getFieldValue('end_date');

                    return (
                      <FlexWrapper wrap="unset" gap="10px" align="start">
                        <Form.Item
                          name="start_date"
                          style={{ marginBottom: 0, width: '100%' }}
                          rules={[
                            {
                              validator(_, value) {
                                if (!value && endDate) {
                                  return Promise.reject(
                                    new Error('Start date is required if end date is selected')
                                  );
                                }
                                return Promise.resolve();
                              }
                            }
                          ]}>
                          <DatePicker
                            format="DD/MM/YYYY"
                            style={{ width: '100%' }}
                            placeholder="From"
                            prefixCls="form-datepicker"
                          />
                        </Form.Item>

                        <Form.Item
                          name="end_date"
                          style={{ marginBottom: 0, width: '100%' }}
                          rules={[
                            {
                              validator(_, value) {
                                if (!value && startDate) {
                                  return Promise.reject(
                                    new Error('End date is required if start date is selected')
                                  );
                                }
                                return Promise.resolve();
                              }
                            }
                          ]}>
                          <DatePicker
                            format="DD/MM/YYYY"
                            style={{ width: '100%' }}
                            placeholder="To"
                            prefixCls="form-datepicker"
                          />
                        </Form.Item>
                      </FlexWrapper>
                    );
                  }}
                </Form.Item>
              </div>
            </div>
            <div>
              <ButtonWrapper>
                <button className="reset" onClick={onClose}>
                  close
                </button>
                <Button prefixCls="antCustomBtn" style={{ width: '100%' }} htmlType="submit">
                  Apply
                </Button>
              </ButtonWrapper>
            </div>
          </div>
        </Form>
      </FilterWrapper>
    </Drawer>
  );
};

export default DocFilter;

const Title = ({ clear }) => {
  return (
    <ModalTitle>
      <h2>Filters</h2>
      <button onClick={clear}>Clear Filters</button>
    </ModalTitle>
  );
};

const ModalTitle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  h2 {
    margin: 0;
    font-family: 'Plus Jakarta Sans';
    font-weight: 700;
    font-size: 24px;
    line-height: 120%;
    color: #242424;
  }
  button {
    font-family: 'Plus Jakarta Sans';
    font-weight: 600;
    font-size: 14px;
    line-height: 120%;
    text-decoration: underline;
    color: #fb4a49;
    background-color: transparent;
    padding: 0;
    margin: 0;
    border: none;
    cursor: pointer;
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  padding-top: 24px;
  justify-content: end;
  border-top: 1px solid #c8c8c8;

  button {
    width: 150px !important;
  }

  .reset {
    width: 100px;
    border-radius: 10px;
    border: transparent;
    color: #0e0e0e;
    background: transparent;
    cursor: pointer;
    font-family: 'Plus Jakarta Sans';
    font-weight: 500;
    font-size: 14px;
  }
`;

const FilterWrapper = styled.div`
  width: 100%;
  padding: 34px;
  height: 100%;
  position: relative;

  .filter-flex {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
    margin-bottom: 20px;
  }

  .section {
    width: 100%;

    .singleCheck {
      font-family: 'Plus Jakarta Sans';
      font-weight: 400;
      font-size: 14px;
      line-height: 150%;
      display: flex;
      align-items: center;
      color: #0e0e0e;
      gap: 6px;
      margin: 0;
    }

    h2 {
      color: #818b9a;
      font-family: 'Plus Jakarta Sans';
      font-weight: 500;
      font-size: 12px;
      line-height: 140%;
      margin: 0 0 6px 0;
    }
  }
`;

const VerticalCheckboxGroup = styled(Checkbox.Group)`
  display: flex;
  gap: 16px;
`;

const CustomCheckbox = styled(Checkbox)`
  text-transform: capitalize !important;
  &.ant-checkbox-wrapper .ant-checkbox-checked .ant-checkbox-inner {
    background-color: #7c71ff !important; /* Ant Design Primary Blue */
    border-color: #ffffff !important;
  }
  &.ant-checkbox-wrapper-disabled .ant-checkbox-checked .ant-checkbox-inner {
    background-color: #7c71ff !important;
    border-color: #ffffff !important;
    opacity: 1 !important; /* Prevents the disabled fade effect */
  }
  &.ant-checkbox-wrapper-disabled .ant-checkbox-checked .ant-checkbox-inner:after {
    border-color: #ffffff !important;
  }
`;
