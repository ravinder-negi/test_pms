import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { FilterIconNew } from '../../../../theme/SvgIcons';
import { FlexWrapper } from '../../../../theme/common_style';
import SearchField from '../../../../components/searchField/SearchField';
import { Badge, Breadcrumb, Button } from 'antd';
import styled from '@emotion/styled';
import AllDocs from './AllDocs';
import DocFilter from './DocFilter';
import { checkPermission } from '../../../../utils/common_functions';
import { useSelector } from 'react-redux';
import SortByDropdown from './SortButton';

const EmployeeCollections = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const { data, name, path } = location.state || {};
  const wrapperRef = useRef(null);

  const { permissions } = useSelector((state) => state?.userInfo?.data);
  let permissionSection = location?.pathname?.includes('my-profile') ? 'my-profile' : 'Employee';
  const canCreate = checkPermission(permissionSection, 'create', permissions);

  const [addModal, setAddModal] = useState(false);
  const [filterDrawer, setFilterDrawer] = useState(false);
  const [filterData, setFilterData] = useState({});
  const [search, setSearch] = useState('');

  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);
  const sortOptions = [
    { label: 'Name', value: 'document' },
    { label: 'Created At', value: 'created_at' }
  ];

  const { hms, activeTab } = location.state;
  const filteredLocationStateForHMS = { hms, activeTab };

  useEffect(() => {
    wrapperRef.current?.scrollIntoView();
  }, []);

  return (
    <EmployeeCollectionsStyle ref={wrapperRef}>
      {filterDrawer && (
        <DocFilter
          open={filterDrawer}
          onClose={() => setFilterDrawer(false)}
          filterData={filterData}
          setFilterData={setFilterData}
        />
      )}
      <FlexWrapper justify="space-between">
        <Breadcrumb
          items={[
            { title: <Link to={name ? path?.route : `${path?.route}/${id}`}>{path?.name}</Link> },
            ...(name
              ? [
                  {
                    title: (
                      <span
                        onClick={() =>
                          navigate(`/${path?.middleRoute}/${id}`, {
                            state: path?.middleRoute.includes('hms')
                              ? filteredLocationStateForHMS
                              : { name: name }
                          })
                        }>
                        {name}
                      </span>
                    )
                  }
                ]
              : []),
            { title: data?.collection_name }
          ]}
        />
      </FlexWrapper>
      <FlexWrapper
        width={'100%'}
        justify={'space-between'}
        gap="16px"
        style={{ margin: '24px 0 16px' }}>
        <div className="title">
          <h5>New Collection ({data?.collection_name})</h5>
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
            sortOptions={sortOptions}
          />
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
          {canCreate && (
            <Button prefixCls="antCustomBtn" onClick={() => setAddModal(true)}>
              + Upload
            </Button>
          )}
        </FlexWrapper>
      </FlexWrapper>
      <AllDocs
        search={search}
        addModal={addModal}
        setAddModal={setAddModal}
        filter={filterData}
        sortField={sortField}
        sortOrder={sortOrder}
        apiPath={path?.apiPath}
      />
    </EmployeeCollectionsStyle>
  );
};

export default EmployeeCollections;

const EmployeeCollectionsStyle = styled.div`
  .title {
    font-family: 'Plus Jakarta Sans';
    font-weight: 700;
    font-size: 20px;
    line-height: 120%;
    color: #0e0e0e;

    h5 {
      margin: 0;
    }
  }
`;
