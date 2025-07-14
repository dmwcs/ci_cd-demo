import { useState } from 'react';
import { Link } from 'react-router';
import { Alert, Button, Form, Spinner } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginFormSchema, type LoginFormData } from '../../utils/validation';
import { useAuth } from '../../hooks/useAuth';
import { mockFetchData } from '../../utils/mockDataFetch';

const Login = () => {
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema),
    mode: 'onChange',
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setError(null);

      const response = await mockFetchData('/login', {
        username: data.username,
        password: data.password,
      });

      if (!response?.token || !response?.user) {
        throw new Error('login in unsuccess');
      }

      const { token, user } = response;

      login({
        token,
        username: user,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'there is something wrong');
    }
  };

  return (
    <div className='d-flex justify-content-center align-items-center vh-100'>
      <Form
        className='d-flex flex-column gap-3'
        style={{ width: '400px' }}
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <h1 className='align-self-center fs-3 '>Welcome Back</h1>

        {error && (
          <Alert variant='danger' className='mx-3'>
            {error}
          </Alert>
        )}

        <Form.Group controlId='username' className='px-3 mb-1'>
          <Form.Label>Username</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter your username'
            {...register('username')}
            isInvalid={!!errors.username}
            disabled={isSubmitting}
          />
          <Form.Control.Feedback type='invalid'>
            {errors.username?.message}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId='password' className='px-3 mb-3'>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Enter your password'
            {...register('password')}
            isInvalid={!!errors.password}
            disabled={isSubmitting}
          />
          <Form.Control.Feedback type='invalid'>
            {errors.password?.message}
          </Form.Control.Feedback>
        </Form.Group>

        <Button
          type='submit'
          disabled={isSubmitting}
          className='d-flex align-items-center justify-content-center mx-3 mx-sm-0'
        >
          {isSubmitting ? (
            <>
              <Spinner size='sm' className='me-2' />
              Logging in...
            </>
          ) : (
            'Log in'
          )}
        </Button>

        <Link to='/register' className='align-self-center'>
          Don't have an account? Register
        </Link>
      </Form>
    </div>
  );
};

export default Login;
