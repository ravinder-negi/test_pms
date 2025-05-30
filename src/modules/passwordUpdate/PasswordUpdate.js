import React, { memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, FormControl, Typography } from '@mui/material';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import CustomTextField from '../../components/form/CustomTextField';
import { yupResolver } from '@hookform/resolvers/yup';
import { SunfocusLogo } from '../../theme/SvgIcons';
import { updatePasswordApi } from '../../services/api_collection';
import styled from '@emotion/styled/macro';
import signBg from '../../assets/BACKGROUND.svg';
import {
  resetUserInfoSlice,
  setUpdateLoading,
  setUserInfo
} from '../../redux/sign-in/userInfoSlice';
import { Button } from 'antd';

const validationSchema = Yup.object({
  newPassword: Yup.string()
    .required('Password is required')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*[\]{}()?"\\,><':;|_~`=+-])[a-zA-Z\d!@#$%^&*[\]{}()?"\\,><':;|_~`=+-]{8,99}$/,
      'Must contain at least 8 Characters, Example - Abcd@123'
    ),
  confirmPassword: Yup.string().oneOf([Yup.ref('newPassword')], 'Passwords must match')
});

function UpdatePassword() {
  const { register, handleSubmit, control } = useForm({ resolver: yupResolver(validationSchema) });
  const { id } = useLocation()?.state || {};
  const { updateLoading } = useSelector((e) => e.userInfo);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onSubmit = async (e) => {
    const res = await updatePasswordApi(id, { password: e?.newPassword });
    dispatch(setUpdateLoading(true));
    if (res?.statusCode === 200) {
      dispatch(resetUserInfoSlice());
      dispatch(setUserInfo(null));
      toast.success('Password Updated Successfully');
      navigate('/');
    } else {
      dispatch(setUpdateLoading(false));
      toast.error(res?.message || 'Something went wrong');
    }
  };

  return (
    <Wrapper>
      <div className="left-section">
        <img src={signBg} alt="background" className="bgImage" />
      </div>
      <BoxWrapper>
        <div className="logo">
          <SunfocusLogo />
        </div>
        <CardStyle>
          <div>
            <Typography
              sx={{
                fontSize: { xs: '28px', sm: '48px' },
                lineHeight: { xs: '30px', sm: '50px' }
              }}
              fontWeight={500}>
              Update Password
            </Typography>
            <Typography sx={{ fontSize: '16px' }} color="textSecondary">
              Create a strong and secure password.
            </Typography>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl fullWidth margin="normal">
              <Typography sx={{ fontSize: '16px' }} fontWeight={400}>
                New Password
              </Typography>
              <Controller
                name="newPassword"
                control={control}
                rules={{ required: 'New Password is required' }}
                render={({ fieldState: { error }, field: { onChange } }) => (
                  <CustomTextField
                    register={{ ...register('newPassword') }}
                    label=""
                    error={!!error}
                    type="password"
                    onChange={onChange}
                    placeholder="Enter New Password"
                    helperText={error ? error.message : null}
                  />
                )}
              />
            </FormControl>
            <FormControl fullWidth margin="normal">
              <Typography sx={{ fontSize: '16px' }} fontWeight={400}>
                Confirm New Password
              </Typography>
              <Controller
                name="confirmPassword"
                control={control}
                rules={{ required: 'Enter Confirm Password' }}
                render={({ fieldState: { error }, field: { onChange } }) => (
                  <CustomTextField
                    register={{ ...register('confirmPassword') }}
                    label=""
                    error={!!error}
                    type="password"
                    onChange={onChange}
                    placeholder="Enter Confirm Password"
                    helperText={error ? error.message : null}
                  />
                )}
              />
            </FormControl>
            <Button htmlType="submit" type="text" loading={updateLoading} className="buttonStyle">
              Update Password
            </Button>
          </form>
        </CardStyle>
      </BoxWrapper>
    </Wrapper>
  );
}

export default memo(UpdatePassword);

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100vh;

  .left-section {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .bgImage {
    height: 100vh;
    @media (max-width: 1000px) {
      display: none !important;
    }
  }

  .logo {
    width: 100%;
    text-align: right;

    @media (max-width: 450px) {
      text-align: center;
    }
  }

  .buttonStyle {
    width: 100%;
    background-color: #7c71ff;
    color: #fff;
    text-transform: capitalize;
    height: 50px;
    margin-top: 20px;
    &:hover {
      background-color: rgb(149, 140, 250) !important;
    }
  }
`;

const BoxWrapper = styled(Box)`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 50px;
  align-items: center;
  padding: 2rem;
`;

export const CardStyle = styled(Box)`
  display: flex;
  flex-direction: column;
  width: 450px;
  padding: 2rem;
  gap: 20px;

  @media (max-width: 450px) {
    width: 400px;
  }

  @media (max-width: 350px) {
    width: 380px;
  }
`;
