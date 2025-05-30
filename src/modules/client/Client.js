import React, { useEffect, useState } from 'react';
import { PropagateLoader } from 'react-spinners';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { clientAddApi, clientShowApi, clientUpdateApi } from '../../services/api_collection';
import { Box, Button, InputAdornment } from '@mui/material';
import CreateClient from '../../components/projects/Client/AddClient';
import ClientList from '../../components/projects/Client/list';
import CustomDrawer from '../../components/form/CustomDrawer';
import DataNotFound from '../../components/NotFound';
import { CustomFlexBox } from '../../utils/common_functions';
import { ContainerStyle, FieldStyle, SpinnerStyle } from '../../components/projects/style';
import { SearchIcon } from '../../theme/SvgIcons';
import colors from '../../theme/colors';

const Client = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleClose = () => setOpen(false);
  const [list, setList] = useState();
  const [searchText, setSearchText] = useState('');
  const { accessList } = useSelector((e) => e.userInfo);

  const is_add_access = accessList.client?.create;

  useEffect(() => {
    getClientList();
  }, []);

  const clientDelApiFun = (id) => {
    const fList = list.filter((e) => e.id !== id);
    setList(fList);
  };

  const getClientList = async () => {
    setLoading(true);
    const res = await clientShowApi();
    if (res?.status === 200) {
      setList(res?.listingEmployee);
      setLoading(false);
    } else {
      toast.error(res?.message || 'Something went wrong');
      setLoading(false);
    }
  };

  const handleAddClient = async (data) => {
    const res = await clientAddApi(data);
    if (res?.status === 200) {
      toast.success(res?.message || 'Client added successfully');
      setOpen(false);
      setList([...list, res?.data]);
    } else {
      toast.error(res?.message || 'Something went wrong');
    }
  };

  const handleUpdateClient = async (data, clientData) => {
    const res = await clientUpdateApi(clientData.id, data);
    if (res?.status === 200) {
      setOpen(false);
      const filterData = list?.map((e) => {
        if (e?.id !== clientData.id) return e;
        else return res?.data;
      });
      setList(filterData);
      toast.success(res?.message || 'Client successfully Updated');
    } else {
      toast.error(res?.message || 'Something went wrong');
    }
  };
  const handleSearch = (event) => setSearchText(event.target.value);

  return (
    <ContainerStyle>
      {/* <Typography sx={{ ...labelStyle('#242424', '22px', 700), margin: '10px 0px 20px 0px' }}>
        {'Clients'}
      </Typography> */}
      <Box>
        <CustomFlexBox sx={{ marginBottom: '30px' }}>
          <FieldStyle
            placeholder="Search..."
            sx={{
              input: {
                '&::placeholder': { color: colors.grayLight }
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              )
            }}
            onChange={handleSearch}
          />
          {is_add_access && (
            <div style={{ marginLeft: '27px' }}>
              <Button
                onClick={() => setOpen(true)}
                sx={{
                  width: '150px',
                  height: '42px',
                  background: colors.darkSkyBlue,
                  color: 'white',
                  marginTop: '21px',
                  '&:hover': {
                    backgroundColor: colors.darkSkyBlue
                  }
                }}>
                {'+ add new'}
              </Button>
            </div>
          )}
        </CustomFlexBox>
        {loading ? (
          <SpinnerStyle>
            <PropagateLoader color="#36d7b7" size="15" />
          </SpinnerStyle>
        ) : list?.length > 0 ? (
          <ClientList
            list={list}
            handleUpdateClient={handleUpdateClient}
            searchText={searchText}
            clientDelApiFun={clientDelApiFun}
          />
        ) : (
          <DataNotFound
            label="add_new"
            path={() => setOpen(true)}
            text="Data Not Found"
            showButton={false}
          />
        )}
      </Box>
      {open && (
        <CustomDrawer open={open} setOpen={handleClose}>
          <CreateClient setOpen={handleClose} handleAddClient={handleAddClient} />
        </CustomDrawer>
      )}
    </ContainerStyle>
  );
};

export default Client;
