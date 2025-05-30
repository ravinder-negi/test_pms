import React, { useEffect, useState } from 'react';
import { Box, FormControl, Typography, Checkbox, FormControlLabel } from '@mui/material';
import CustomTextField from '../../components/form/CustomTextField';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import { Button } from 'antd';
import { CardStyle } from './AuthLayout';
import { signInUrl } from '../../redux/sign-in/apiRoute';
import { userIsEmployee } from '../../utils/constant';
import { setLoginInRole, setToken, setUserInfo } from '../../redux/sign-in/userInfoSlice';
import { toast } from 'react-toastify';

const SignIn = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, control, setValue } = useForm();

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const payload = { ...data, email: data?.email.trim(), moduleType: 'admin' };

      const response = await signInUrl(payload);

      if (response.status === 200) {
        setLoading(false);
        let loggedUserType = response?.accountData;
        let role = response?.role;
        let isEmployee = loggedUserType?.system_role === userIsEmployee;

        dispatch(setLoginInRole({ isEmployee, loggedUserType, role }));
        dispatch(setToken(response?.access_token));
        dispatch(
          setUserInfo({
            user_details: response?.user_details || {},
            permissions: response?.permissions
          })
        );
        navigate('/dashboard');

        toast.success(response?.message || 'Login Successfully');

        if (data.rememberMe) {
          localStorage.setItem('pmsEmail', data.email);
          localStorage.setItem('pmsPassword', data.password);
        } else {
          localStorage.removeItem('pmsEmail');
          localStorage.removeItem('pmsPassword');
        }
      } else {
        toast.error(response?.message || 'Unauthorized user');
      }
    } catch (error) {
      console.error('Error during sign-in:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const rememberedEmail = localStorage.getItem('pmsEmail');
    const rememberedPassword = localStorage.getItem('pmsPassword');

    if (rememberedEmail && rememberedPassword) {
      setValue('email', rememberedEmail);
      setValue('password', rememberedPassword);
      setValue('rememberMe', true);
    }
  }, []);

  return (
    <CardStyle>
      <div>
        <Typography
          sx={{
            fontSize: { xs: '28px', sm: '48px' },
            lineHeight: { xs: '30px', sm: '50px' }
          }}
          fontWeight={500}>
          Login
        </Typography>
        <Typography sx={{ fontSize: '16px', margin: '5px 0' }} color="textSecondary">
          Please fill your details to access your account.
        </Typography>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl fullWidth margin="normal">
          <Typography sx={{ fontSize: '16px' }} fontWeight={400}>
            Email
          </Typography>
          <Controller
            name="email"
            control={control}
            rules={{
              required: 'Email is required',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Enter a valid email address'
              }
            }}
            render={({ fieldState: { error }, field: { onChange } }) => (
              <CustomTextField
                register={{ ...register('email') }}
                variant="outlined"
                fullWidth
                placeholder="Enter email"
                error={!!error}
                helperText={error ? error.message : null}
                onChange={onChange}
              />
            )}
          />
        </FormControl>
        <FormControl fullWidth margin="normal">
          <Typography sx={{ fontSize: '16px' }} fontWeight={400}>
            Password
          </Typography>
          <Controller
            name="password"
            control={control}
            rules={{
              required: 'Password is required',
              minLength: {
                value: 8,
                message: 'Password must be at least 8 characters'
              },
              pattern: {
                value: /^(?=.*[0-9])(?=.*[!@#$%^&*])/,
                message: 'Password contain number, special character and alphabets'
              }
            }}
            render={({ fieldState: { error }, field: { onChange } }) => (
              <CustomTextField
                register={{ ...register('password') }}
                label=""
                error={!!error}
                type="password"
                onChange={onChange}
                placeholder="Enter password"
                helperText={error ? error.message : null}
              />
            )}
          />
        </FormControl>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            mt: 1
          }}>
          <Controller
            name="rememberMe"
            control={control}
            defaultValue={false}
            render={({ field: { onChange, value } }) => (
              <FormControlLabel
                control={<Checkbox checked={value} onChange={onChange} />}
                label="Remember me"
              />
            )}
          />

          <Typography
            variant="body2"
            color="primary"
            sx={{ cursor: 'pointer' }}
            onClick={() => navigate('/forget-password')}>
            Forgot Password?
          </Typography>
        </Box>
        <Button htmlType="submit" type="text" loading={loading} className="buttonStyle">
          Login
        </Button>
      </form>
    </CardStyle>
  );
};

export default SignIn;
