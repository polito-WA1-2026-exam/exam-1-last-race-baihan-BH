import { useState, useContext } from 'react';
import { useNavigate } from 'react-router';
import { Button, Modal, Container } from 'react-bootstrap';
import UserContext from '../contexts/UserContext';
import LoginForm from '../components/LoginForm';
import { logout } from '../api/auth';

function Home() {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const handleClick = path => {
    if (user && user.id) {
      navigate(path);
    } else {
      setShowModal(true);
    }
  };

  const handleLogout = async () => {
    await logout();
    setUser({ id: undefined, name: undefined });
  };

  return (
    <Container className="p-1 mt-5 mb-5">
      <h1 style={{color: '#b22a2a'}}>INSTRUCTIONS</h1>
      <p className='text-start mt-3' style={{color: '#f6c12c'}}>Each game starts with 20 coins.</p>
      <p className='text-start' style={{color: '#f6c12c'}}>1. You will see the network map with all stations, their connections, and the lines.</p>
      <p className='text-start' style={{color: '#f6c12c'}}>
        2. You will see three elements on the page: the network map, showing only the stations ; a
        starting station and a destination station; the list of all segments.
        <br />
        From the beginning of this phase, you has 90 seconds to scroll through the list of pairs,
        mentally reconstruct the network, and build their route by selecting the segments in
        sequence. <br />A route is valid when it starts and ends at the assigned stations and each
        segment is reachable through one of the lines, with line changes possible only at
        interchange stations.
      </p>
      <p className='text-start' style={{color: '#f6c12c'}}>
        3. In each step from one station to the next, an event will happen, which effect to your
        total number of coins.
        <br />
        If the submitted route is invalid or incomplete, you will lose all 20 coins.
      </p>

      <Button variant="myBtn" onClick={() => handleClick('/setup')} className="me-5 mt-5">
        Start
      </Button>
      <Button variant="myBtn" onClick={() => handleClick('/rank')} className="mt-5">
        Rank
      </Button>
      {user && user.id ? (
        <Button
          variant="mySecBtn"
          onClick={() => handleLogout()}
          className="ms-2"
          style={{ position: 'absolute', right: '40px', top: '20px' }}
        >
          Log out
        </Button>
      ) : null}

      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
        contentClassName="login-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title centered="true">Login</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <LoginForm onReport={() => setShowModal(false)} />
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default Home;
