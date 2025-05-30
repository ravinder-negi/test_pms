import React from 'react';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { Controller, useForm } from 'react-hook-form';
import { Box, Button, FormControl, Typography } from '@mui/material';
import { yupResolver } from '@hookform/resolvers/yup';
import styled from '@emotion/styled';
import * as Yup from 'yup';
import CustomText from '../../components/form/CustomText';
import CustomTextField from '../../components/form/CustomTextField';
import colors from '../../theme/colors';
import { ErrorText } from '../../utils/common_functions';
import { subAdminPasswordApi } from '../../services/api_collection';

const validationSchema = Yup.object({
  password: Yup.string()
    .required('Password is required')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*[\]{}()?"\\,><':;|_~`=+-])[a-zA-Z\d!@#$%^&*[\]{}()?"\\,><':;|_~`=+-]{8,99}$/,
      'Must contain at least 8 Characters, Example - Abcd@123'
    ),
  confirmPassword: Yup.string().oneOf([Yup.ref('password')], 'Passwords must match')
});

function AdminPasswordUpdate() {
  const { user_details = {} } = useSelector((e) => e?.userInfo?.data || {});
  const { register, handleSubmit, control, reset } = useForm({
    resolver: yupResolver(validationSchema)
  });

  const onSubmit = async (e) => {
    const res = await subAdminPasswordApi(user_details[0]?.admin_table_id, {
      password: e?.password
    });
    if (res?.status === 200) {
      toast.success(res?.message || 'Password Update Successfully');
      reset();
    } else toast.error(res?.message || 'Something went wrong');
  };

  return (
    <FormStyle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box>
          <Typography sx={{ fontSize: '20px', fontWeight: 500 }}>{' Update Password'}</Typography>
          <FormControl fullWidth>
            <CustomText variant="title_2" sx={{ mt: '15px', mb: '5px' }}>
              Password
            </CustomText>
            <Controller
              name="password"
              control={control}
              rules={{
                required: 'Password is required'
              }}
              render={({ fieldState: { error }, field: { onChange } }) => (
                <CustomTextField
                  register={{ ...register('password') }}
                  label=""
                  error={!!error}
                  type="password"
                  onChange={onChange}
                  placeholder="Enter password"
                  helperText={error ? <ErrorText padding="0" message={error?.message} /> : null}
                />
              )}
            />
          </FormControl>
          <FormControl fullWidth>
            <CustomText variant="title_2" sx={{ mt: '25px', mb: '5px' }}>
              Confirm Password
            </CustomText>
            <Controller
              name="confirmPassword"
              control={control}
              rules={{
                required: 'Confirm Password is required'
              }}
              render={({ fieldState: { error }, field: { onChange } }) => (
                <CustomTextField
                  register={{ ...register('confirmPassword') }}
                  label=""
                  error={!!error}
                  type="password"
                  onChange={onChange}
                  placeholder="Enter confirm password"
                  helperText={error ? error.message : null}
                />
              )}
            />
          </FormControl>
        </Box>
        <Box className="button-wrapper">
          <Button className="button-style" type="submit" variant="contained">
            Update
          </Button>
        </Box>
      </form>
    </FormStyle>
  );
}

export default AdminPasswordUpdate;

const FormStyle = styled.div`
  width: 60%;
  height: 90%;
  margin: auto;
  padding: 30px;
  background: white;

  form {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
  }
  .button-wrapper {
    text-align: right;
  }
  @media (max-width: 900px) {
    width: 80%;
  }
  .button-style {
    background: ${colors.darkSkyBlue};
    width: 122px;
    height: 43px;
    color: ${colors.white};
  }
`;
