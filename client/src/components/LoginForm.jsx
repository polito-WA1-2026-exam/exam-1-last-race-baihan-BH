import { useState, useContext } from 'react';
import { Button, Form } from 'react-bootstrap';
import { login } from '../api/auth';
import UserContext from '../contexts/UserContext';

function LoginForm(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const { setUser } = useContext(UserContext);
  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const result = await login(username, password);
      if (result.user_id) {
        setUsername('');
        setPassword('');
        setUser({
          id: result.user_id,
          name: result.username,
        });
        props.onReport();
      }
    } catch (error) {
      setError(error.message);
    }
  };
  return (
    <>
      {error !== '' && (
        <div className="mb-2" style={{ color: 'red', fontWeight: 'bold' }}>
          ! {error}, please check the username and password.{' '}
        </div>
      )}
      <Form.Group className="mb-3">
        <Form.Label>Username</Form.Label>
        <Form.Control
          className="rank-list-item"
          type="text"
          placeholder="Enter username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Password</Form.Label>
        <Form.Control
          className="rank-list-item"
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
      </Form.Group>
      <div className="d-flex justify-content-center mt-4">
        <Button variant="myBtn" type="submit" onClick={handleSubmit} className="me-3">
          Login
        </Button>
        <Button variant="mySecBtn" onClick={props.onReport}>
          Cancel
        </Button>
      </div>
    </>
  );
}

export default LoginForm;
