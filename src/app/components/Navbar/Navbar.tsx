import { Button, Form, InputGroup, Dropdown } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import BootstrapNavbar from 'react-bootstrap/Navbar';
import { Outlet, useNavigate, Link } from 'react-router';
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
      <BootstrapNavbar expand='md' className='border-bottom'>
        <Container
          fluid
          style={{ display: 'flex', columnGap: '6px' }}
          className='px-5'
        >
          <BootstrapNavbar.Brand href='#home'>
            <PiStarFourFill size={10} /> PumpMaster
          </BootstrapNavbar.Brand>
          <BootstrapNavbar.Toggle aria-controls='navbarScroll' />
          <BootstrapNavbar.Collapse id='navbarScroll'>
            <Nav className='my-lg-0' navbarScroll>
              <Nav.Link as={Link} to='/pump'>
                Pumps
              </Nav.Link>
            </Nav>
          </BootstrapNavbar.Collapse>

          <div className='d-flex gap-4 d-none d-md-flex align-items-center'>
            <InputGroup
              className='bg-light rounded'
              style={{ maxWidth: '250px' }}
            >
              <InputGroup.Text className='bg-light border-0'>
                <TbZoom className='text-secondary' size={20} />
              </InputGroup.Text>
              <Form.Control
                type='text'
                placeholder='Search'
                className='border-0 bg-light px-0'
              />
            </InputGroup>
            <Button className='text-center bg-light border-0'>
              <PiBellBold color='black' size={18} />
            </Button>

            {/* 用户信息和退出功能 */}
            {isAuthenticated && user && (
              <Dropdown align='end'>
                <Dropdown.Toggle
                  as='div'
                  className='d-flex align-items-center'
                  style={{ cursor: 'pointer' }}
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
                    <small className='text-muted'>
                      Logged in as: {user.username}
                    </small>
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
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Navbar;
