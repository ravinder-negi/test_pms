import { useState } from 'react';
import { Badge, Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { DocumentStyle } from '../../employees/view-employee/ViewEmployeeStyle';
import { FilterIconNew } from '../../../theme/SvgIcons';
import { checkPermission } from '../../../utils/common_functions';
import { FlexWrapper } from '../../../theme/common_style';
import SearchField from '../../../components/searchField/SearchField';
import SortByDropdown from '../../employees/view-employee/components/SortButton';
import TabNav from '../../employees/view-employee/components/TabNav';
import DocFilter from '../../employees/view-employee/components/DocFilter';
import Collections from '../../employees/view-employee/components/Collections';
import AllDocs from '../../employees/view-employee/components/AllDocs';
import { updateDocActiveTabPro } from '../../../redux/project/ProjectSlice';

const ProjectDocuments = () => {
  const dispatch = useDispatch();
  const [addModal, setAddModal] = useState(false);
  const { permissions } = useSelector((state) => state?.userInfo?.data);
  let permissionSection = 'Projects';
  const canCreate = checkPermission(permissionSection, 'create', permissions);

  const activeTab = useSelector((state) => state?.projectSlice?.docActiveTabPro);
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
    dispatch(updateDocActiveTabPro(val));
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
            <Badge
              count={Object?.values(filterData || {})?.reduce(
                (acc, item) =>
                  acc + (item ? (Array.isArray(item) ? (item?.length > 0 ? 1 : 0) : 1) : 0),
                0
              )}
              color="#7c71ff"
              offset={[-9, 4]}
              prefixCls="filterBadge">
              <Button prefixCls="custom-filter-btn" onClick={() => setFilterDrawer(true)}>
                <FilterIconNew /> Filter
              </Button>
            </Badge>
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
          apiPath="project"
        />
      ) : (
        <Collections
          search={search}
          addModal={addModal}
          setAddModal={setAddModal}
          sortField={sortField}
          sortOrder={sortOrder}
          apiPath="project"
          navigatePath="project/details"
        />
      )}
    </DocumentStyle>
  );
};

export default ProjectDocuments;
