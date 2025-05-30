import React, { useState } from 'react';
import { DocumentStyle } from '../ViewEmployeeStyle';
import { useDispatch, useSelector } from 'react-redux';
import { checkPermission, currentModule } from '../../../../utils/common_functions';
import TabNav from './TabNav';
import AllDocs from './AllDocs';
import Collections from './Collections';
import { FlexWrapper } from '../../../../theme/common_style';
import SearchField from '../../../../components/searchField/SearchField';
import { Button } from 'antd';
import DocFilter from './DocFilter';
import { updateDocActiveTab } from '../../../../redux/employee/EmployeeSlice';
import SortByDropdown from './SortButton';
import FilterButton from '../../../../components/common/FilterButton';
import { useLocation } from 'react-router-dom';

const EmployeeDocuments = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const [addModal, setAddModal] = useState(false);
  const { permissions } = useSelector((state) => state?.userInfo?.data);
  let permissionSection = currentModule();
  const canCreate = checkPermission(permissionSection, 'create', permissions);

  const { docActiveTab: activeTab } = useSelector((state) => state?.employeeSlice);

  const [filterDrawer, setFilterDrawer] = useState(false);
  const [search, setSearch] = useState('');
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
    <DocumentStyle>
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
        style={{ marginBottom: '16px' }}>
        <div className="title">
          <h5>Document</h5>
        </div>
        <FlexWrapper justify={'end'} gap="6px">
          <SearchField
            placeholder="Search..."
            style={{ width: '250px' }}
            onChange={setSearch}
            value={search}
          />
          <SortByDropdown
            sortField={sortField}
            setSortField={setSortField}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            sortOptions={activeTab === 1 ? sortOptions : sortOptionsColl}
          />
          {activeTab === 1 && (
            <FilterButton appliedFilter={filterData} handleClick={() => setFilterDrawer(true)} />
          )}
          {canCreate && (
            <Button prefixCls="antCustomBtn" onClick={() => setAddModal(true)}>
              + Upload
            </Button>
          )}
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
          apiPath="employee"
        />
      ) : (
        <Collections
          search={search}
          addModal={addModal}
          setAddModal={setAddModal}
          sortField={sortField}
          sortOrder={sortOrder}
          apiPath="employee"
          navigatePath={location?.pathname?.includes('my-profile') ? 'my-profile' : 'view-employee'}
          forProfile={location?.pathname?.includes('my-profile') && 'profile'}
        />
      )}
    </DocumentStyle>
  );
};

export default EmployeeDocuments;
