import React, { useState } from 'react';
import { FlexWrapper } from '../../../../theme/common_style';
import Title from 'antd/es/typography/Title';
import SearchField from '../../../../components/searchField/SearchField';
import { Button } from 'antd';
import { FilterIconNew } from '../../../../theme/SvgIcons';
import TabNav from '../../../employees/view-employee/components/TabNav';
import { updateDocActiveTab } from '../../../../redux/employee/EmployeeSlice';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import AllDocs from '../../../../modules/employees/view-employee/components/AllDocs';
import Collections from '../../../../modules/employees/view-employee/components/Collections';
import SortByDropdown from '../../../employees/view-employee/components/SortButton';
import DocFilter from '../../../employees/view-employee/components/DocFilter';

const Documents = () => {
  const [filterDrawer, setFilterDrawer] = useState(false);
  const hmsActiveTab = useSelector((state) => state?.HmsSlice?.HmsTab);
  const [search, setSearch] = useState('');
  const [addModal, setAddModal] = useState(false);

  const dispatch = useDispatch();
  const { docActiveTab: activeTab } = useSelector((state) => state?.employeeSlice);
  const [filterData, setFilterData] = useState({});

  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);
  const sortOptions = [
    { label: 'Name', value: 'document' },
    { label: 'Created At', value: 'created_at' }
  ];
  const sortOptionsColl = [{ label: 'Name', value: 'collection_name' }];

  const TabList = [
    {
      name: 'All'
    },
    {
      name: 'Collection'
    }
  ];

  const handleActiveTabs = (val) => {
    setSearch('');
    setSortField(null);
    setSortOrder(null);
    dispatch(updateDocActiveTab(val));
  };

  return (
    <div>
      {filterDrawer && (
        <DocFilter
          open={filterDrawer}
          onClose={() => setFilterDrawer(false)}
          filterData={filterData}
          setFilterData={setFilterData}
        />
      )}
      <FlexWrapper
        width={'100%'}
        justify={'space-between'}
        gap="16px"
        cursor="default"
        margin="12px 0"
        style={{ marginBottom: '16px' }}>
        <Title level={4} style={{ margin: 0 }}>
          {hmsActiveTab === 'Inventory'
            ? 'Documents'
            : hmsActiveTab === 'Assignee'
            ? 'Device Photos'
            : 'Documents'}
        </Title>
        <FlexWrapper justify={'end'} gap="6px" cursor="default">
          <SearchField
            placeholder="Search by Name..."
            style={{ width: '250px' }}
            value={search}
            onChange={setSearch}
          />
          <SortByDropdown
            sortField={sortField}
            setSortField={setSortField}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            sortOptions={activeTab === 1 ? sortOptions : sortOptionsColl}
          />
          <Button prefixCls="custom-filter-btn" onClick={() => setFilterDrawer(true)}>
            <FilterIconNew /> Filter
          </Button>
          <Button type="text" onClick={() => setAddModal(true)} prefixCls="antCustomBtn">
            + Upload
          </Button>
        </FlexWrapper>
      </FlexWrapper>

      <TabNav list={TabList} activeTab={activeTab} setActiveTab={handleActiveTabs} />

      {activeTab === 1 ? (
        <AllDocs
          search={search}
          addModal={addModal}
          setAddModal={setAddModal}
          filter={filterData}
          sortField={sortField}
          sortOrder={sortOrder}
          apiPath="hms"
        />
      ) : (
        <Collections
          search={search}
          addModal={addModal}
          setAddModal={setAddModal}
          sortField={sortField}
          sortOrder={sortOrder}
          apiPath="hms"
          navigatePath="hms/details"
        />
      )}
    </div>
  );
};

Documents.propTypes = {
  hmsActiveTab: PropTypes.string
};

export default Documents;
