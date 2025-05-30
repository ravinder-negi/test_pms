import styled from '@emotion/styled';
import { Button, Checkbox, Drawer, Form, Select } from 'antd';
import React, { useEffect } from 'react';
import { DropdownIconNew } from '../../theme/SvgIcons';
import { HmsStatus } from '../../utils/constant';
import PropTypes from 'prop-types';
import useDepartmentOptions from '../../hooks/useDepartmentOptions';
import TableLoader from '../../components/loaders/TableLoader';

const HmsFilter = ({ open, onClose, filterData, setFilterData, activeTab }) => {
  const [form] = Form.useForm();
  const { loading, options: departmentOptions } = useDepartmentOptions();
  const deviceTypes = [
    { label: 'Desktop', value: 'Desktop' },
    { label: 'Mac', value: 'Mac' },
    { label: 'Laptop', value: 'Laptop' },
    { label: 'Tablet', value: 'Tablet' },
    { label: 'iPhone', value: 'iPhone' },
    { label: 'Android', value: 'Android' },
    { label: 'Keyboard', value: 'Keyboard' },
    { label: 'Mouse', value: 'Mouse' },
    { label: 'Monitor', value: 'Monitor' },
    { label: 'Headphones', value: 'Headphones' }
  ];

  // const departments = [
  //   { label: 'Android', value: 'Android' },
  //   { label: 'Backend', value: 'Backend' },
  //   { label: 'Business', value: 'Business' },
  //   { label: 'Frontend', value: 'Frontend' },
  //   { label: 'Graphic', value: 'Graphic' },
  //   { label: 'HR', value: 'HR' },
  //   { label: 'iOS', value: 'iOS' },
  //   { label: 'QA', value: 'QA' }
  // ];

  const onFinish = async (values) => {
    setFilterData(values);
    onClose();
  };

  const onReset = () => {
    setFilterData({});
    form.resetFields();
    onClose();
  };

  useEffect(() => {
    if (filterData) {
      form.setFieldsValue(filterData);
    }
  }, []);

  return (
    <Drawer
      width={490}
      title={<Title clear={onReset} />}
      placement="right"
      closable={false}
      prefixCls="activityCustomDrawer"
      onClose={onClose}
      open={open}
      key="right">
      <FilterWrapper>
        {!loading ? (
          <Form style={{ height: '100%' }} form={form} layout="vertical" onFinish={onFinish}>
            <div className="filter-flex">
              <div>
                <div className="section">
                  <h2>
                    {activeTab === 'Inventory'
                      ? 'Status'
                      : activeTab === 'Assignee' && 'Department'}
                  </h2>
                  <Form.Item name="status">
                    <VerticalCheckboxGroup>
                      {(activeTab === 'Inventory'
                        ? HmsStatus
                        : activeTab === 'Assignee'
                        ? departmentOptions
                        : []
                      )?.map((el) => (
                        <CustomCheckbox key={el?.value} value={el?.value}>
                          {el?.label}
                        </CustomCheckbox>
                      ))}
                    </VerticalCheckboxGroup>
                    {/* <Select
                    prefixCls="form-select"
                    suffixIcon={<DropdownIconNew />}
                    placeholder="--Select Option--"
                    options={
                      activeTab === 'Inventory'
                        ? HmsStatus
                        : activeTab === 'Assignee'
                        ? departmentOptions
                        : []
                    }
                    loading={false}
                  /> */}
                  </Form.Item>
                </div>
                <div className="section">
                  <h2>Device Type</h2>
                  <Form.Item name="device_type">
                    <Select
                      mode="multiple"
                      prefixCls="antMultipleSelector"
                      maxTagCount={4}
                      suffixIcon={<DropdownIconNew />}
                      placeholder="--Select Option--"
                      options={deviceTypes}
                      loading={false}
                    />
                  </Form.Item>
                </div>
              </div>
              <div>
                <ButtonWrapper>
                  <button className="reset" onClick={onClose}>
                    Close
                  </button>
                  <Button prefixCls="antCustomBtn" style={{ width: '100%' }} htmlType="submit">
                    Apply
                  </Button>
                </ButtonWrapper>
              </div>
            </div>
          </Form>
        ) : (
          <div
            className="loader"
            style={{
              height: '100%',
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
            <TableLoader size="30px" />
          </div>
        )}
      </FilterWrapper>
    </Drawer>
  );
};

HmsFilter.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  filterData: PropTypes.object,
  setFilterData: PropTypes.func,
  activeTab: PropTypes.string
};

export default HmsFilter;

const Title = ({ clear }) => {
  return (
    <ModalTitle>
      <h2>Filters</h2>
      <button onClick={clear}>Clear Filters</button>
    </ModalTitle>
  );
};

Title.propTypes = {
  clear: PropTypes.func
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
  flex-direction: column;
  gap: 5px;
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
