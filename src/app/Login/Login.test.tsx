import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import Login from './Login';

describe('Login Component', () => {
  test('renders all elements correctly', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>,
    );
    expect(
      screen.getByRole('heading', { name: /welcome back/i }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /don't have an account\? register/i }),
    ).toBeInTheDocument();
  });

  test('allows typing in username and password fields', async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>,
    );
    const user = userEvent.setup();

    const usernameInput = screen.getByLabelText(/username/i);
    const passwordInput = screen.getByLabelText(/password/i);

    await user.type(usernameInput, 'shelton');
    await user.type(passwordInput, '123456');

    expect(usernameInput).toHaveValue('shelton');
    expect(passwordInput).toHaveValue('123456');
  });
});
