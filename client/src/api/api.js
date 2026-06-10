async function getRank() {
    try {
        const response = await fetch('http://localhost:3001/api/games/records', {
            credentials: 'include'
        })

        if (response.ok) {
            const list_of_records = await response.json()
            return list_of_records
        } else {
            // 4xx or 5xx status code
            throw new Error('HTTP error in getRank, code=' + response.status)
        }
    } catch (error) {
        throw error
    }
}

async function getNetwork() { 
    try {
        const response = await fetch('http://localhost:3001/api/network', {
            credentials: 'include'
        })

        if (response.ok) {
            const network_info = await response.json()
            return network_info
        } else {
            // 4xx or 5xx status code
            throw new Error('HTTP error in getNetwork, code=' + response.status)
        }
    } catch (error) {
        throw error
    }
}


async function getRequest() { 
    try {
        const response = await fetch('http://localhost:3001/api/games/setup', {
            credentials: 'include'
        })

        if (response.ok) {
            const request_info = await response.json()
            return request_info
        } else {
            // 4xx or 5xx status code
            throw new Error('HTTP error in getRequest, code=' + response.status)
        }
    } catch (error) {
        throw error
    }
}

async function submitRoute(segments) {
    try {
        const response = await fetch('http://localhost:3001/api/games/submit', {
            method: 'POST',
            body: JSON.stringify({ segments: segments }),
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        })

        if (response.ok) {
            const res = await response.json()
            return res
        } else {
            // 4xx or 5xx status code
            throw new Error('HTTP error in submitRoute, code=' + response.status)
        }
    }
    catch (error) {
        throw error
    }
}

export { getRank, getNetwork, getRequest, submitRoute }