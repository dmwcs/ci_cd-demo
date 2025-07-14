import { Link } from 'react-router';
import { Button, Form } from 'react-bootstrap';
import { useState } from 'react';

interface FormData {
  username: string;
  password: string;
}

const Login = () => {
  const [formData, setFormData] = useState<FormData>({
    username: '',
    password: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    //axios.post
  };

  return (
    <div className='d-flex justify-content-center align-items-center vh-100'>
      <Form
        className='d-flex flex-column gap-3'
        style={{ width: '400px' }}
        onSubmit={handleSubmit}
      >
        <h1 className='align-self-center fs-3 '>Welcome Back</h1>

        <Form.Group controlId='username' className='px-3 mb-1'>
          <Form.Label>Username</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter your email'
            value={formData.username}
            onChange={e =>
              setFormData({ ...formData, username: e.target.value })
            }
          />
        </Form.Group>
        <Form.Group controlId='password' className='px-3 mb-3'>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Enter your password'
            value={formData.password}
            onChange={e =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
        </Form.Group>
        <Button type='submit'>Log in</Button>
        <Link to='/register' className='align-self-center'>
          Don't have an account? Register
        </Link>
      </Form>
    </div>
  );
};

export default Login;
