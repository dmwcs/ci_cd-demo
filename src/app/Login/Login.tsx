import { Link } from 'react-router';
import { Button, Form, Spinner } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginFormSchema, type LoginFormData } from '../../utils/validation';

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema),
    mode: 'onChange',
  });

  const onSubmit = async (data: LoginFormData) => {
    console.log('表单数据:', data);

    await new Promise(resolve => setTimeout(resolve, 1000));
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

        <Form.Group controlId='username' className='px-3 mb-1'>
          <Form.Label>Username</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter your username'
            {...register('username')}
            isInvalid={!!errors.username}
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
          />
          <Form.Control.Feedback type='invalid'>
            {errors.password?.message}
          </Form.Control.Feedback>
        </Form.Group>

        <Button
          type='submit'
          disabled={isSubmitting}
          className='d-flex align-items-center justify-content-center mx-3 mx-sm-0'
          // style={{ width: '400px' }}
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
