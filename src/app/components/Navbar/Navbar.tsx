import { Button, Form, InputGroup, Dropdown } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import BootstrapNavbar from 'react-bootstrap/Navbar';
import { Outlet, useNavigate } from 'react-router';
import { PiBellBold } from 'react-icons/pi';
import { TbZoom } from 'react-icons/tb';
import { PiStarFourFill } from 'react-icons/pi';
import { useAuth } from '../../../hooks/useAuth';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div>
      <BootstrapNavbar
        expand='md'
        className='border-bottom fixed-top bg-white'
        style={{ zIndex: 9999 }}
      >
        <Container fluid className='px-5 d-flex gap-1'>
          <BootstrapNavbar.Brand href='/'>
            <PiStarFourFill size={10} /> PumpMaster
          </BootstrapNavbar.Brand>
          <BootstrapNavbar.Toggle aria-controls='navbarScroll' />
          <BootstrapNavbar.Collapse id='navbarScroll'>
            <Nav className='my-lg-0' navbarScroll>
              <Nav.Link>Dashboard</Nav.Link>
              <Nav.Link className='text-dark fw-bold'>Pumps</Nav.Link>
              <Nav.Link>Reports</Nav.Link>
              <Nav.Link>Alerts</Nav.Link>
            </Nav>
          </BootstrapNavbar.Collapse>

          <div className='d-flex gap-4 d-none d-md-flex align-items-center'>
            {isAuthenticated && (
              <>
                <InputGroup className='bg-light rounded w-auto d-none d-lg-flex'>
                  <InputGroup.Text className='bg-light border-0'>
                    <TbZoom className='text-secondary' size={20} />
                  </InputGroup.Text>
                  <Form.Control
                    type='text'
                    placeholder='Search'
                    className='border-0 bg-light pl-1'
                  />
                </InputGroup>
                <Button className='text-center bg-light border-0'>
                  <PiBellBold color='black' size={18} />
                </Button>
              </>
            )}

            {isAuthenticated && user && (
              <Dropdown align='end'>
                <Dropdown.Toggle
                  as='div'
                  className='d-flex align-items-center user-select-none'
                  role='button'
                >
                  <img
                    src='https://i.pravatar.cc/40?img=2'
                    alt='User Avatar'
                    className='rounded-circle me-2'
                    width='40'
                    height='40'
                  />
                  <span className='text-dark'>{user.username}</span>
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item disabled>
                    <small>Logged in as: {user.username}</small>
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item href='#profile'>Profile</Dropdown.Item>
                  <Dropdown.Item href='#settings'>Settings</Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={handleLogout} className='text-danger'>
                    Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            )}
          </div>
        </Container>
      </BootstrapNavbar>
      <main className='pt-5 mt-2'>
        <Outlet />
      </main>
    </div>
  );
};

export default Navbar;
