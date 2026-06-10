import { useState, useEffect, useContext, use } from 'react';
import { useNavigate } from 'react-router';
import { Container, Row, Col, Button, Spinner, ListGroup, Badge } from 'react-bootstrap';
import Map from '../components/Map.jsx';
import GameContext from '../contexts/GameContext';
import { getRequest, submitRoute } from '../api/api';

function Plan() {
  const { mapData, setGameResult } = useContext(GameContext);
  const navigate = useNavigate();

  const stations = mapData.stations;
  const segments = mapData.segments.map(segment => {
    return {
      ...segment,
      from: stations.find(station => station.id === segment.source).name,
      to: stations.find(station => station.id === segment.target).name,
    };
  });
  const [route, setRoute] = useState([]);
  const [request, setRquest] = useState();
  const [timeLeft, setTimeLeft] = useState();
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    const init = async () => {
      const res = await getRequest();
      setRquest(res);
      setTimeLeft(90);
      setStatus('running');
    };
    init();
  }, []);

  useEffect(() => {
    if (status !== 'running') return;
    const timer = setInterval(() => {
      setTimeLeft(time => {
        if (time <= 0) {
          clearInterval(timer);
          setStatus('end');
          return 0;
        }
        return time - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [status]);

  useEffect(() => {
    const submit = async () => {
      const res = route.map(seg => {
        return {
          from: seg.source,
          to: seg.target,
        };
      });
      const subRes = await submitRoute(res);
      setGameResult(subRes);
      navigate('/result');
    };
    if (status === 'end') {
      submit();
    }
  }, [status, route]);

  const insertSelected = segment => {
    const selected = route.some(
      seg => seg.source === segment.source && seg.target === segment.target
    );
    if (selected) return;
    setRoute([...route, segment]);
  };
  const removeSelected = index => {
    setRoute(route.filter((item, i) => i !== index));
  };

  return (
    <Container className="p-1 mt-3">
      <Row className="justify-content-center mb-3">
        <Col>
          <Map stations={stations} segments={route}></Map>
        </Col>
        <Col className="d-flex flex-column justify-content-center align-items-center">
          <div className="mb-3" style={{ color: '#f6c12c' }}>
            ⏱️ Left Time:
            <span
              style={{ fontSize: '40px', fontWeight: 'bold', margin: '0 16px', color: '#b22a2a' }}
            >
              {timeLeft}
            </span>
            s
          </div>
          <Row className="d-flex flex-column align-items-start">
            <div style={{ color: '#f6c12c' }}>
              start Station:
              <span
                style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  marginLeft: '16px',
                  color: '#b22a2a',
                }}
              >
                {request?.startStation.station_name}
              </span>
            </div>
            <div style={{ color: '#f6c12c' }}>
              Destination:
              <span
                style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  marginLeft: '16px',
                  color: '#b22a2a',
                }}
              >
                {request?.destStation.station_name}
              </span>
            </div>
          </Row>
          <Button variant="myBtn" className="mt-5 w-25" onClick={() => setStatus('end')}>
            Submit
          </Button>
        </Col>
      </Row>
      <Row>
        <Col className='text-start'>
          <span style={{ color: '#f6c12c', fontWeight: 'bold' }}>Choose the segments:</span>
          <ListGroup className="mb-3">
            {segments.map((segment, index) => {
              const isSelected = route.some(
                s => s.source === segment.source && s.target === segment.target
              );
              return (
                <ListGroup.Item
                  className="custom-list-item"
                  as="li"
                  key={index}
                  onClick={() => insertSelected(segment)}
                  disabled={isSelected}
                >
                  {segment.from} - {segment.to}
                </ListGroup.Item>
              );
            })}
          </ListGroup>
        </Col>
        <Col className='text-start'>
          <span style={{ color: '#f6c12c', fontWeight: 'bold' }}>Your route:</span>
          <ListGroup>
            {route.map((segment, index) => (
              <ListGroup.Item
                className="custom-list-item"
                as="li"
                key={index}
                onClick={() => removeSelected(index)}
              >
                {segment.from} - {segment.to}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>
      </Row>
    </Container>
  );
}

export default Plan;
