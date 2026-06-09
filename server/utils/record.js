import { getGraph } from './graph.js';
import { buildEvents, getEvents } from './events.js';

const validateResult = para => {
  return new Promise((resolve, reject) => {
    const graph = getGraph();
    const segments = para.segments;
    let segmentSet = new Set();
    let curStation = para.startStationId;

    let orderedSegments = [];

    for (let i = 0; i < segments.length; i++) {
      let { from, to } = segments[i];
      from = parseInt(from);
      to = parseInt(to);
      if (graph[from].indexOf(to) === -1) return resolve({ valid: false, reason: 'invalid route' });

      const min = Math.min(from, to);
      const max = Math.max(from, to);
      const newSeg = `${min} - ${max}`;
      if (segmentSet.has(newSeg)) {
        return resolve({ valid: false, reason: 'route overlaps' });
      }
      segmentSet.add(newSeg);

      const seg = segments[i];
      if (seg.from === curStation) {
        curStation = seg.to;
        orderedSegments.push(seg)
      } else if (seg.to === curStation) {
        curStation = seg.from;
        orderedSegments.push({
          from: seg.to,
          to: seg.from,
        })
      } else {
        return resolve({ valid: false, reason: 'route does not match' });
      }
    }
    if (curStation !== para.destStationId) {
      return resolve({ valid: false, reason: 'route does not match' });
    }
    return resolve({ valid: true, segments: orderedSegments });
  });
};

export const generateRecord = para => {
  return new Promise(async (resolve, reject) => {
    let result = {
      score: 20,
      steps: [],
    };
    const validateRes = await validateResult(para);
    result.valid = validateRes.valid;
    if (!result.valid) {
      result.score = 0;
      result.reason = validateRes.reason;
      resolve(result);
      return;
    }
    buildEvents().then(
      () => {
        const allEvents = getEvents();
        validateRes.segments.forEach(segment => {
          const curEvent = allEvents[Math.floor(Math.random() * allEvents.length)];
          result.score += curEvent.effect;
          if(result.score < 0) result.score = 0;
          result.steps.push({
            segment: segment,
            event: curEvent.description,
          });
        });
        resolve(result);
      },
      () => {
        reject('get events failed');
      }
    );
  });
};
