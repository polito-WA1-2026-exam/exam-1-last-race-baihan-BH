import { getGraph } from "./graph.js"
import { buildEvents, getEvents } from "./events.js";

const validateResult = (para) => {
    return new Promise((resolve, reject) => {

    const graph = getGraph();
    const segments = para.segments
    const submitStart = parseInt(segments[0].from);
    const submitDest = parseInt(segments[segments.length - 1].to);
    if (submitStart !== para.startStationId || submitDest !== para.destStationId) {
        return {valid: false, reason: "route does not match"};
    }
    let segmentSet = new Set();
    for (let i = 0; i < segments.length; i++) {
        let { from, to } = segments[i];
        from = parseInt(from);
        to = parseInt(to);
        if (graph[from].indexOf(to) === -1)
            return resolve({valid: false, reason: "invalid route"});
        if (i < segments.length - 1) {
            const nextFrom = parseInt(segments[i + 1].from);
            if (to !== nextFrom)
                return resolve({ valid: false, reason: "route does not match" });
        }
        const min = Math.min(from, to);
        const max = Math.max(from, to);
        const newSeg = `${min} - ${max}`
        if (segmentSet.has(newSeg)) {
            return resolve({valid: false, reason: "route overlaps"})
        };
        segmentSet.add(newSeg)
    }
        return resolve({valid: true});
    })
}

export const generateRecord = (para) => {
    return new Promise(async (resolve, reject) => { 
        let result = {
            score: 20,
            steps: []
        }
        const validateRes = await validateResult(para)
        result.valid = validateRes.valid
        if (!result.valid) {
            result.score = 0;
            result.reason = validateRes.reason;
            resolve(result)
            return;
        }
        buildEvents().then(() => {
            const allEvents = getEvents()
            para.segments.forEach((segment) => {
                const curEvent = allEvents[Math.floor(Math.random() * allEvents.length)]
                result.score += curEvent.effect
                result.steps.push({
                    segment: segment,
                    event: curEvent.description
                })
            })
            resolve(result)
        }, () => {
            reject("get events failed")
        })
    })
}