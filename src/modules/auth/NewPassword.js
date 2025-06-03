import React from 'react';
import { Button, FormControl, Typography } from '@mui/material';
import CustomTextField from '../../components/form/CustomTextField';
import { useForm, Controller } from 'react-hook-form';
import { CardStyle } from './AuthLayout';

const NewPassword = () => {
  const { register, handleSubmit, control, getValues } = useForm();
  const onSubmit = async (data) => {
    console.log(data, 'data');
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
          Create a New Password
        </Typography>
        <Typography sx={{ fontSize: '16px' }} color="textSecondary">
          Enter a password unique to this account.
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
            rules={{
              required: 'New Password is required',
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
            rules={{
              required: 'Password is required',
              minLength: {
                value: 8,
                message: 'Password must be at least 8 characters'
              },
              pattern: {
                value: /^(?=.*[0-9])(?=.*[!@#$%^&*])/,
                message: 'Password contain number, special character and alphabets'
              },
              validate: (value) => value === getValues('newPassword') || 'Passwords do not match'
            }}
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
        <Button htmlType="submit" type="text" className="buttonStyle">
          Create Password
        </Button>
      </form>
    </CardStyle>
  );
};

export default NewPassword;
