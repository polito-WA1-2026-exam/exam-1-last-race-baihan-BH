import { ListGroup, Badge, Container, Row, Col, Button, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import { getRank } from '../api/api';

function Rank() {
  const [rank, setRank] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const rankData = await getRank();
      setRank(rankData);
      setLoading(false);
    };
    fetchData();
  }, []);

  const navigate = useNavigate();
  const handleBack = () => {
    navigate(-1);
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col xs={12} md={6}>
          <h1 className="mt-5 text-center" style={{color: '#f6c12c'}}>Rank</h1>

          {loading ? (
            <Spinner antimation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          ) : (
            <ListGroup as="ol" className="mb-3">
              {rank.map((record, index) => (
                <ListGroup.Item
                  as="li"
                  key={record.id}
                  className="d-flex justify-content-between align-items-start rank-list-item"
                >
                  {index === 0 && '🥇 '}
                  {index === 1 && '🥈 '}
                  {index === 2 && '🥉 '}
                  {index >= 3 && `${index + 1}. `}
                  <RankItem record={record} />
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}

          <Button variant="mySecBtn" onClick={handleBack}>
            Back
          </Button>
        </Col>
      </Row>
    </Container>
  );
}

function RankItem({ record }) {
  return (
    <>
      <div className="ms-2 me-auto fw-bold" style={{color: '#000'}}>{record.username}</div>
      <div>{record.score}</div>
    </>
  );
}

export default Rank;
