import React, { useCallback, useEffect, useState } from 'react';
import ProjectCard from '../../components/projects/ProjectCard';
import {
  ActiveIcon,
  CancelProjectIcon,
  DeliveredIcon,
  DropdownIconNew,
  EditIcon,
  NoData,
  ProjectNewIcon,
  SearchIconNew,
  TrashIconNew,
  ViewIconNew
} from '../../theme/SvgIcons';
import styled from '@emotion/styled/macro';
import { Button, Drawer, Input, Pagination, Select, Table } from 'antd';
import {
  DarkText,
  EditIconBox,
  FlexWrapper,
  PaginationBox,
  ViewIconBox
} from '../../theme/common_style';
import { useNavigate } from 'react-router-dom';
import Title from 'antd/es/typography/Title';
import { useDispatch, useSelector } from 'react-redux';
import ProjectsGraph from './ProjectsGraph';
import AddProject from './AddProject';
import {
  deleteProjectApi,
  getProjectGraphApi,
  getProjectsList
} from '../../redux/project/apiRoute';
import { toast } from 'react-toastify';
import moment from 'moment';
import { projectStatusOption } from '../../utils/constant';
import {
  activeStatusTag,
  checkPermission,
  debounce,
  generateEmployeeImgUrl,
  getFullName
} from '../../utils/common_functions';
import ConfirmationModal from '../../components/Modal/ConfirmationModal';
import ProjectActivity from './ProjectActivity';
import ProjectFilters from './ProjectFilters';
import { updateActivityDrawer } from '../../redux/sidebar/SidebarSlice';
import { AvatarGroup } from '../../components/common/AvatarGroup';
import useTechnologyOptions from '../../hooks/useTechnologyOptions';
import { StickyBox } from '../../utils/style';
import FilterButton from '../../components/common/FilterButton';

function Projects() {
  const [addProject, setAddProject] = useState(false);
  const navigate = useNavigate();
  const { isEmployee } = useSelector((e) => e.userInfo);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [editDetails, setEditDetails] = useState(null);
  const [search, setSearch] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [graphData, setGraphData] = useState(null);
  const [filterDrawer, setFilterDrawer] = useState(false);
  const appliedFilter = useSelector((e) => e?.projectSlice?.filterData);
  const { permissions, user_details } = useSelector((state) => state?.userInfo?.data);
  let permissionSection = 'Projects';
  const canCreate = checkPermission(permissionSection, 'create', permissions);
  const canUpdate = checkPermission(permissionSection, 'update', permissions);
  const [filter, setFilter] = useState(null);
  const [graphLoading, setGraphLoading] = useState(false);
  const activityDrawer = useSelector((state) => state?.sidebar?.isActivityDrawer);
  const dispatch = useDispatch();
  const [sort, setSort] = useState({});
  const { loading: platformsLoading, options: technologyOptions } = useTechnologyOptions();
  const [selectPlatform, setSelectPlatform] = useState(null);

  const handlePageChange = (page) => {
    setPage(page);
    setLimit(20);
  };

  const handleSorting = (val) => {
    if (val?.field) {
      let order = val?.order == 'ascend' ? 'ASC' : 'DESC';
      setSort({ sortBy: val?.field, orderBy: order, ...val });
    } else {
      setSort({});
    }
    setPage(page);
    setLimit(20);
  };

  const columns = [
    {
      title: 'S.NO',
      dataIndex: 'key',
      key: 'key',
      width: 80,
      render: (text) => <span>{(page - 1) * limit + text}.</span>
    },
    {
      title: 'Project Name',
      dataIndex: 'name',
      key: 'name',
      sorter: true
    },
    {
      title: 'Start  Date',
      dataIndex: 'start_date',
      key: 'start_date',
      sorter: true,
      render: (val) => (
        <div style={{ width: '100px' }}>{val ? moment(val).format('DD MMM, YYYY') : 'N/A'}</div>
      )
    },
    {
      title: 'Deadline',
      dataIndex: 'deadline',
      key: 'deadline',
      sorter: true,
      render: (val) => (
        <div style={{ width: '100px' }}>{val ? moment(val).format('DD MMM, YYYY') : 'N/A'}</div>
      )
    },
    {
      title: 'Client',
      dataIndex: 'client',
      key: 'client',
      render: (val) => {
        let data = [
          {
            name: val?.name,
            src: process.env.REACT_APP_S3_BASE_URL + val?.profile_image,
            id: val?.id
          } || {}
        ];
        return (
          <FlexWrapper wrap="no-wrap" justify={'start'} gap={'6px'}>
            <AvatarGroup avatars={data} />
            <p style={{ fontSize: '14px', margin: 0 }}>{val?.name}</p>
          </FlexWrapper>
        );
      }
    },
    {
      title: 'Project Manager',
      dataIndex: 'project_Assignee',
      key: 'project_Assignee',
      render: (record) => {
        let projectManager =
          record
            ?.filter((el) => el?.role === 'Project Manager')
            ?.map((val) => {
              let fullName = getFullName(
                val?.emp_id?.first_name,
                val?.emp_id?.middle_name,
                val?.emp_id?.last_name
              );
              return {
                name: fullName,
                src: generateEmployeeImgUrl(val?.emp_id?.id),
                id: val?.emp_id?.id
              };
            }) || [];
        return (
          <FlexWrapper wrap="no-wrap" justify={'start'} gap={'6px'}>
            <AvatarGroup avatars={projectManager} />
            <p style={{ fontSize: '14px', margin: 0 }}>{projectManager?.[0]?.name || 'N/A'}</p>
          </FlexWrapper>
        );
      }
    },
    {
      title: 'Project Incharge',
      dataIndex: 'project_Assignee',
      key: 'project_Assignee',
      render: (incharge) => {
        let projectIncharge =
          incharge
            ?.filter((el) => el?.role === 'Project Incharge')
            ?.map((val) => {
              let fullName = getFullName(
                val?.emp_id?.first_name,
                val?.emp_id?.middle_name,
                val?.emp_id?.last_name
              );

              return {
                name: fullName,
                src: generateEmployeeImgUrl(val?.emp_id?.id),
                id: val?.emp_id?.id
              };
            }) || [];
        return (
          <FlexWrapper justify={'start'} gap={'6px'}>
            <AvatarGroup avatars={projectIncharge} />
            {!projectIncharge?.[0]?.name && 'N/A'}
          </FlexWrapper>
        );
      }
    },
    {
      title: 'Team',
      dataIndex: 'project_Assignee',
      key: 'project_Assignee',
      render: (record) => {
        let projectTeam =
          record
            ?.filter((el) => el?.role === 'Developer')
            ?.map((val) => {
              let fullName = getFullName(
                val?.emp_id?.first_name,
                val?.emp_id?.middle_name,
                val?.emp_id?.last_name
              );
              return {
                name: fullName,
                src: generateEmployeeImgUrl(val?.emp_id?.id),
                id: val?.emp_id?.id
              };
            }) || [];
        return (
          <FlexWrapper justify={'start'} gap={'6px'}>
            <AvatarGroup avatars={projectTeam} />
            {!projectTeam?.[0]?.name && 'N/A'}
          </FlexWrapper>
        );
      }
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => activeStatusTag(projectStatusOption, 'value', status)
    },
    {
      title: 'Action',
      dataIndex: 'action',
      fixed: 'right',
      key: 'action',
      className: 'action-column',
      render: (_, data) => {
        return (
          <FlexWrapper justify={'start'} gap={'6px'} wrap={'unset'} cursor="pointer">
            <ViewIconBox
              onClick={() => {
                navigate(`/project/details/${data?.id}`, {
                  state: { project: data, name: data?.name }
                });
              }}>
              <ViewIconNew />
            </ViewIconBox>
            {canUpdate && (
              <EditIconBox
                canUpdate={canUpdate}
                onClick={() => {
                  if (canUpdate) {
                    setAddProject(true);
                    setEditDetails(data);
                  }
                }}>
                <EditIcon />
              </EditIconBox>
            )}
          </FlexWrapper>
        );
      }
    }
  ];

  const handleGetGraphData = async () => {
    try {
      setGraphLoading(true);
      let params = new URLSearchParams();
      filter && params.append('startDate', filter);
      if (isEmployee) {
        params.append('employeeId', user_details?.id);
      }
      let res = await getProjectGraphApi(params);
      if (res?.statusCode === 200) {
        const data = Object?.entries(res?.data || {})?.map(([key, value]) => ({
          name: key.charAt(0).toUpperCase() + key.slice(1),
          count: value
        }));
        setGraphData(isEmployee ? res?.data : data);
      } else {
        toast.error(res?.message || 'Something went wrong');
      }
    } catch (error) {
      toast.error(error?.message || 'Something went wrong');
    } finally {
      setGraphLoading(false);
    }
  };

  const handleAddProject = () => {
    setAddProject(true);
    setEditDetails(null);
  };

  const handleProjectList = async (search) => {
    try {
      setLoading(true);
      let params = new URLSearchParams();
      params.append('page', page);
      params.append('limit', limit);
      search && params.append('search', search);
      sort?.sortBy && params.append('sortBy', sort?.sortBy);
      sort?.orderBy && params.append('sortType', sort?.orderBy);
      selectPlatform && params.append('platformId', selectPlatform);
      if (!isEmployee) {
        Object?.entries(appliedFilter || {}).forEach(([key, value]) => {
          if (value) {
            params.append(key, value?.toString());
          }
        });
      }
      if (isEmployee) {
        params.append('employeeIds', user_details?.id);
      }
      let res = await getProjectsList(params);
      if (res?.statusCode === 200) {
        let array = (res?.data?.projects || [])?.map((el, idx) => ({
          ...el,
          key: idx + 1
        }));

        setData(array);
        setTotal(res?.data?.totalCount);
      } else {
        toast.error(res?.message || 'Something went wrong');
      }
    } catch (error) {
      toast.error(error?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleteLoading(true);
      let res = await deleteProjectApi(editDetails?.id);
      if (res?.statusCode === 200) {
        handleProjectList();
        setDeleteModal(false);
      } else {
        toast.error(res?.message || 'Something went wrong');
      }
    } catch (err) {
      toast.error(err?.message || 'Something went wrong');
    } finally {
      setDeleteLoading(false);
    }
  };

  const cardData = [
    {
      img: <ProjectNewIcon styles={{ fill: '#7C71FF' }} />,
      bg: '#C3BEFF',
      title: 'Total Projects',
      count: total || 0
    },
    {
      img: <ActiveIcon />,
      bg: '#FFF3DB',
      title: 'Active Projects',
      count: graphData?.active || 0
    },
    {
      img: <DeliveredIcon />,
      bg: '#E1E7FF',
      title: 'Delivered Projects',
      count: graphData?.delivered || 0
    },
    {
      img: <CancelProjectIcon styles={{ fill: '#7C71FF' }} />,
      bg: '#FFCCC8',
      title: 'Cancelled Projects',
      count: graphData?.cancelled || 0
    }
  ];

  const optimizedFn = useCallback(debounce(handleProjectList), [
    page,
    limit,
    appliedFilter,
    sort,
    selectPlatform
  ]);

  useEffect(() => {
    if (search !== null) {
      optimizedFn(search);
    } else {
      handleProjectList();
    }
  }, [page, limit, search, appliedFilter, sort, selectPlatform]);

  useEffect(() => {
    handleGetGraphData();
  }, [filter]);

  return (
    <div style={{ background: '#f3f6fc' }}>
      {filterDrawer && (
        <ProjectFilters open={filterDrawer} onClose={() => setFilterDrawer(false)} />
      )}
      {deleteModal && (
        <ConfirmationModal
          open={deleteModal}
          onCancel={() => setDeleteModal(false)}
          title={'Delete Project'}
          onSubmit={handleDelete}
          buttonName={'Delete'}
          description={'Are you sure you want to delete this project?'}
          iconBG={'#FB4A49'}
          icon={<TrashIconNew />}
          loading={deleteLoading}
        />
      )}
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
          <ProjectActivity />
        </Drawer>
      )}

      {isEmployee ? (
        cardData && (
          <FlexWrapper wrap="no-wrap" gap="10px">
            {cardData?.map((data, index) => (
              <ProjectCard
                key={index}
                image={data?.img}
                bg={data?.bg}
                loading={graphLoading}
                content={
                  <div>
                    <CardContent>{data?.title}</CardContent>
                    <Title style={{ margin: 0 }} level={2}>
                      {data?.count}
                    </Title>
                  </div>
                }
              />
            ))}
          </FlexWrapper>
        )
      ) : (
        <ProjectsGraph data={graphData} total={total} setFilter={setFilter} />
      )}

      <StickyBox>
        <FlexWrapper justify="space-between" gap="10px">
          {canCreate ? (
            <Button prefixCls="antCustomBtn" onClick={handleAddProject}>
              + Add New Project
            </Button>
          ) : (
            <Title level={4} style={{ margin: 0 }}>
              Projects
            </Title>
          )}
          <FlexWrapper direction="row" wrap="no-wrap" gap="10px">
            <Input
              prefixCls="antCustomInput"
              placeholder="Search by Project Name..."
              prefix={<SearchIconNew />}
              style={{ width: '240px' }}
              onChange={(e) => setSearch(e?.target?.value.trim())}
              allowClear
            />
            {!isEmployee && (
              <Select
                prefixCls="custom-select"
                value={selectPlatform || null}
                allowClear
                style={{ marginBottom: '10px', width: '200px' }}
                suffixIcon={<DropdownIconNew />}
                loading={platformsLoading}
                filterOption={(input, option) =>
                  (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                }
                onChange={setSelectPlatform}
                placeholder="Project Platform"
                options={technologyOptions}
              />
            )}

            {!isEmployee && (
              <FilterButton handleClick={setFilterDrawer} appliedFilter={appliedFilter} />
            )}
          </FlexWrapper>
        </FlexWrapper>
      </StickyBox>
      {search || loading || data.length > 0 ? (
        <Table
          loading={loading}
          prefixCls="antCustomTable"
          columns={columns}
          dataSource={data}
          pagination={false}
          onChange={(newPagination, filters, sorter) => {
            handleSorting(sorter);
          }}
          defaultSortOrder={sort.order}
        />
      ) : (
        <FlexWrapper margin="60px 20px">
          <FlexWrapper direction="column">
            <NoData />
            <Title level={5} style={{ margin: '10px 0 0' }}>
              No Project
            </Title>
            <DarkText weight="400">No project created yet</DarkText>
            {canCreate && (
              <Button
                onClick={handleAddProject}
                prefixCls="antCustomBtn"
                style={{ margin: '10px 0' }}>
                + Add New Project
              </Button>
            )}
          </FlexWrapper>
        </FlexWrapper>
      )}

      <PaginationBox>
        <Pagination
          current={page}
          prefixCls="custom-pagination"
          pageSize={limit}
          total={total}
          onChange={handlePageChange}
          showSizeChanger={false}
          hideOnSinglePage
        />
      </PaginationBox>

      {addProject && (
        <AddProject
          open={addProject}
          close={() => setAddProject(false)}
          handleProjectList={handleProjectList}
          editDetails={editDetails}
        />
      )}
    </div>
  );
}
export default Projects;

const CardContent = styled.div`
  font-size: 12px;
  margin: 0px !important;
  color: '#7A7B7A';
`;
