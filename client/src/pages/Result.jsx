import { useContext, useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router';
import GameContext from '../contexts/GameContext';
import { Button, Container } from 'react-bootstrap';

function Result() {
  const { gameResult } = useContext(GameContext);
  const navigate = useNavigate();

  const [showScore, setShowScore] = useState(false);
  const resTimeout = 1000 * (gameResult?.steps?.length + 1 || 0);

  useEffect(() => {
    if (!gameResult.valid) {
      setShowScore(true);
      return;
    }
    const timer = setTimeout(() => {
      setShowScore(true);
    }, resTimeout);

    return () => clearTimeout(timer);
  }, [gameResult.valid, resTimeout]);

  const handleClick = (path) => {
    navigate(path);
  };

  return (
    <Container className="p-2">
      {!gameResult.valid ? (
        <>
          <h2 style={{ color: '#f6c12c', transition: 'all 0.5s ease-in-out', marginTop: '150px' }}>
            Your Route is Invalid !
          </h2>
          <h2 style={{ color: '#b22a2a', transition: 'all 0.5s ease-in-out' }}>
            {gameResult.reason || 'Invalid Route'}
          </h2>
        </>
      ) : (
        <StationProgress steps={gameResult.steps} />
      )}
      {showScore && (
        <div className="mt-5" style={{ color: '#f6c12c', transition: 'all 0.5s ease-in-out' }}>
          Your final coins: <h1 style={{ color: '#b22a2a' }}>{gameResult.score}</h1>
        </div>
      )}
      {showScore && (
        <div className="mt-5">
          <Button variant="myBtn" onClick={()=>handleClick('/setup')}>
            New Game
          </Button>
          <Button variant="mySecBtn" className="ms-3" onClick={()=>handleClick('/')}>
            Home
          </Button>
        </div>
      )}
    </Container>
  );
}

function StationProgress({ steps }) {
  const { mapData } = useContext(GameContext);
  const allStations = mapData.stations;
  const [currentIndex, setCurrentIndex] = useState(0);

  const events = useMemo(() => {
    return steps.map(step => step.event);
  }, [steps]);

  const extractedStations = useMemo(() => {
    if (!steps || steps.length === 0) return [];

    const segments = steps.map(step => step.segment);

    const stations = [allStations.find(s => s.id === segments[0].from).name];

    segments.forEach(seg => {
      stations.push(allStations.find(s => s.id === seg.to).name);
    });

    return stations;
  }, [steps]);

  // Animation
  useEffect(() => {
    if (extractedStations.length === 0 || currentIndex >= extractedStations.length - 1) {
      return;
    }

    const timer = setTimeout(() => {
      setCurrentIndex(prev => prev + 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [currentIndex, extractedStations.length]);

  if (extractedStations.length === 0) {
    return <div className="text-muted text-center py-4">Page Fault</div>;
  }

  const progressPercentage = (currentIndex / (extractedStations.length - 1)) * 100;

  return (
    <div style={{ display: 'flex', padding: '40px 0' }}>
      <div
        style={{
          position: 'relative',
          width: '8px',
          height: `${(extractedStations.length - 1) * 100}px`,
          backgroundColor: '#e9ecef',
          borderRadius: '4px',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: `${progressPercentage}%`,
            backgroundColor: '#b22a2a',
            borderRadius: '4px',
            transition: 'height 0.5s ease-in-out',
          }}
        />
        {events.map((event, index) => {
          const show = index < currentIndex;
          const topPosition = (index / (extractedStations.length - 1)) * 100 + 8;
          if (!show) return null;
          return (
            <div
              key={`${event}-${index}`}
              style={{
                position: 'absolute',
                top: `${topPosition}%`,
                left: '50px',
                textWrap: 'nowrap',
                fontSize: '18px',
                fontWeight: 'bold',
                color: '#b22a2a',
                transition: 'all 0.5s ease-in-out',
              }}
            >
              {event}
            </div>
          );
        })}

        {/* Station Nodes */}
        {extractedStations.map((station, index) => {
          const isActive = index <= currentIndex;
          const topPosition = (index / (extractedStations.length - 1)) * 100;

          return (
            <div
              key={`${station}-${index}`}
              style={{
                position: 'absolute',
                top: `${topPosition}%`,
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 2,
              }}
            >
              <div
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  backgroundColor: isActive ? '#b22a2a' : '#fff',
                  border: `3px solid ${isActive ? '#b22a2a' : '#adb5bd'}`,
                  transition: 'all 0.5s ease-in-out',
                }}
              />
              <span
                style={{
                  position: 'absolute',
                  left: '35px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  color: '#f6c12c',
                  whiteSpace: 'nowrap',
                }}
              >
                Station {station}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Result;
