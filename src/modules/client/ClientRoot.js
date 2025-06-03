import React, { useCallback, useEffect, useState } from 'react';
import { CardContent, FlexWrapper } from '../../theme/common_style';
import ActivityDrawer from './ActivityDrawer';
import { Drawer } from 'antd';
import { ClientCardIcon1, ClientCardIcon2, ClientCardIcon3 } from '../../theme/SvgIcons';
import Title from 'antd/es/typography/Title';
import ProjectCard from '../../components/projects/ProjectCard';
import ClientDetails from './ClientDetails';
import { toast } from 'react-toastify';
import { getAllClients, getClientCountsApi } from '../../services/api_collection';
import { debounce } from '../../utils/common_functions';
import { useDispatch, useSelector } from 'react-redux';
import { updateActivityDrawer } from '../../redux/sidebar/SidebarSlice';
import CountUp from 'react-countup';

const ClientRoot = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [search, setSearch] = useState(null);
  const [clientCounts, setClientCounts] = useState(null);
  const [cardsLoading, setCardsLoading] = useState(false);
  const activityDrawer = useSelector((state) => state?.sidebar?.isActivityDrawer);
  const { user_details } = useSelector((state) => state?.userInfo?.data || {});
  const dispatch = useDispatch();

  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);
  const sortOptions = [
    { label: 'Name', value: 'name' },
    { label: 'Email', value: 'email' },
    { label: 'Contact', value: 'contact' },
    { label: 'Country', value: 'country' },
    { label: 'Created At', value: 'created_at' }
  ];
  const [status, setStatus] = useState(null);
  const [sort, setSort] = useState({});

  const attendanceStats = [
    {
      icon: <ClientCardIcon1 />,
      bg: '#DDF3FF',
      label: 'Total Clients',
      value: clientCounts?.totalClients || 0
    },
    {
      icon: <ClientCardIcon2 />,
      bg: '#FFE8A8',
      label: 'Active Clients',
      value: clientCounts?.activeClients || 0
    },
    {
      icon: <ClientCardIcon3 />,
      bg: '#D9D6FF',
      label: 'Active Projects',
      value: clientCounts?.activeProjects || 0
    }
  ];

  const getClientsCount = async () => {
    try {
      setCardsLoading(true);
      const res = await getClientCountsApi();
      if (res?.statusCode === 200) {
        setClientCounts(res?.data);
      } else {
        toast.error(res?.message || 'Something went wrong');
      }
    } catch (error) {
      toast.error(error?.message || 'Something went wrong');
    } finally {
      setCardsLoading(false);
    }
  };

  const handleGetList = async (search) => {
    try {
      setLoading(true);
      let params = new URLSearchParams();
      params.append('limit', limit);
      params.append('page', page);
      search && params.append('search', search);
      if ((sortField && sortOrder) || (sort?.sortBy && sort?.orderBy)) {
        params.append('sort_field', sortField || sort?.sortBy);
        params.append('sort_order', sortOrder || sort?.orderBy);
      }
      if (status != null || status != undefined) {
        params.append('client_status', status);
      }
      const res = await getAllClients(params);
      if (res?.statusCode === 200) {
        let array = (res?.data?.clients || [])?.map((el, idx) => ({
          ...el,
          key: idx + 1
        }));
        setData(array || []);
        setTotal(res?.data?.total_count);
      } else toast.error(res?.message || 'Something went wrong');
    } catch (err) {
      toast.error(err?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const optimizedFn = useCallback(debounce(handleGetList), [
    page,
    limit,
    sortOrder,
    status,
    sortField,
    sort
  ]);

  useEffect(() => {
    if (search !== null) {
      optimizedFn(search);
    } else {
      handleGetList();
    }
  }, [search, page, limit, sortOrder, sortField, status, sort]);

  useEffect(() => {
    getClientsCount();
  }, []);
  return (
    <FlexWrapper direction="column" gap="20px" cursor="default">
      {activityDrawer && (
        <Drawer
          width={490}
          title="Activity"
          placement="right"
          closable={true}
          prefixCls="activityCustomDrawer"
          onClose={() => dispatch(updateActivityDrawer(false))}
          open={activityDrawer}
          key="right">
          <ActivityDrawer clientId={user_details?.id} />
        </Drawer>
      )}
      <FlexWrapper
        width="100%"
        direction="column"
        cursor="default"
        gap="5px"
        justify="space-between"
        align="space-between">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,auto)', gap: '16px' }}>
          {attendanceStats.map((item, index) => (
            <div key={index}>
              <ProjectCard
                image={item.icon}
                bg={item.bg}
                loading={cardsLoading}
                content={
                  <div>
                    <CardContent>{item.label}</CardContent>
                    <Title style={{ margin: 0 }} level={2}>
                      <CountUp end={(item.value || 0)?.toString()?.padStart(2, '0')} />
                    </Title>
                  </div>
                }
              />
            </div>
          ))}
        </div>
      </FlexWrapper>

      <ClientDetails
        loading={loading}
        data={data}
        page={page}
        limit={limit}
        total={total}
        setPage={setPage}
        setLimit={setLimit}
        setSearch={setSearch}
        handleGetList={handleGetList}
        sortOptions={sortOptions}
        sortField={sortField}
        sortOrder={sortOrder}
        setSortField={setSortField}
        setSortOrder={setSortOrder}
        setStatus={setStatus}
        search={search}
        sort={sort}
        setSort={setSort}
      />
    </FlexWrapper>
  );
};

export default ClientRoot;
