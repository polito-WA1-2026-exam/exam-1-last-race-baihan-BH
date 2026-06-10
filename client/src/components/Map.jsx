function Map({ stations, segments }) {
  const getStationCoords = id => {
    const station = stations.find(s => s.id === id);
    return station ? { x: station.position.x, y: station.position.y } : { x: 0, y: 0 };
  };

  return (
    <div
      style={{
        width: '600px',
        height: '400px',
        border: '1px solid #f6c12c',
        borderRadius: '8px',
        backgroundColor: '#f0debf',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <svg viewBox="0 0 800 650" style={{ width: '100%', height: '100%' }}>
        {segments?.map((segment, index) => {
          const start = getStationCoords(segment.source);
          const end = getStationCoords(segment.target);
          const color = segment.lineName?.split(' ')[0];

          return (
            <line
              key={`${start}-${end}-${index}`}
              x1={start.x}
              y1={start.y}
              x2={end.x}
              y2={end.y}
              stroke={color}
              strokeWidth="6"
              strokeLinecap="round"
            />
          );
        })}

        {stations?.map(station => {
          return (
            <g key={station.id} style={{ cursor: 'pointer' }}>
              {/* 车站圆点 */}
              <circle
                cx={station.position.x}
                cy={station.position.y}
                r="10"
                fill={'#f0debf'}
                stroke={'#b22a2a'}
                strokeWidth="4"
              />

              {/* 车站名称文字 */}
              <text
                x={station.position.x}
                y={station.position.y + 30}
                textAnchor="middle"
                fill="#333"
                fontSize="16"
                paintOrder="stroke"
                stroke="f0debf"
                strokeWidth="4"
              >
                {station.name}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export default Map;
