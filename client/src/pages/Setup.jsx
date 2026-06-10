import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router';
import { Container, Row, Col, Button, Spinner } from 'react-bootstrap';
import { getNetwork } from '../api/api';
import Map from '../components/Map';
import GameContext from '../contexts/GameContext';

function Setup() {
  const { setMapData } = useContext(GameContext);
  const navigate = useNavigate();
  const [network, setNetwork] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const networkData = await getNetwork();
      setNetwork(networkData);
      setLoading(false);
      setMapData({
        stations: networkData.stations,
        segments: networkData.segments,
      });
    };
    fetchData();
  }, []);

  const handleClick = () => {
    navigate('/game');
  };
  return (
    <Container>
      <Row className="justify-content-center">
        <h1 className="mt-5 mb-5 text-center" style={{color: '#b22a2a'}}>NETWORK</h1>
        {loading ? (
          <Spinner antimation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        ) : (
          <Map stations={network.stations} segments={network.segments}></Map>
        )}
        <div className="mt-5">
          <Button variant="myBtn" onClick={handleClick} className="me-5">
            Start
          </Button>
          <Button variant="mySecBtn" onClick={() => navigate('/')}>
            Back
          </Button>
        </div>
      </Row>
    </Container>
  );
}

export default Setup;
