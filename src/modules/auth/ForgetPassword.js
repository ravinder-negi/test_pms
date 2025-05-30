import React, { useState } from 'react';
import { FormControl, Typography } from '@mui/material';
import CustomTextField from '../../components/form/CustomTextField';
import { useForm, Controller } from 'react-hook-form';
import { CardStyle } from './AuthLayout';
import { toast } from 'react-toastify';
import { ForgetPasswordApi } from '../../services/api_collection';
import { Button } from 'antd';

const ForgetPassword = () => {
  const { register, handleSubmit, control } = useForm();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    console.log(data, 'data');
    setLoading(true);
    try {
      const payload = {
        email: data.confirmMail
      };
      const res = await ForgetPasswordApi(payload);
      if (res.statusCode === 200) {
        console.log(res, 'res');
        toast.success(res?.message);
      } else {
        toast.error(res?.message);
      }
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <CardStyle>
      <div>
        <Typography
          sx={{
            fontSize: { xs: '28px', sm: '48px' },
            lineHeight: { xs: '30px', sm: '50px' }
          }}
          fontWeight={500}>
          Forgot Your Password
        </Typography>
        <Typography sx={{ fontSize: '16px' }} color="textSecondary">
          We’ll send you a link to reset your password.
        </Typography>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl fullWidth margin="normal">
          <Typography sx={{ fontSize: '16px' }} fontWeight={400}>
            Email
          </Typography>
          <Controller
            name="confirmMail"
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
                register={{ ...register('confirmMail') }}
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
        <Button loading={loading} htmlType="submit" type="text" className="buttonStyle">
          Send Reset Instructions
        </Button>
      </form>
    </CardStyle>
  );
};

export default ForgetPassword;
