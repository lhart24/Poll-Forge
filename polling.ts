// handle input
export async function handleInput(input: string): Promise<string> {
    const res = await fetch('http://localhost:5001/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input }),
    });
    const data = await res.json();
    return data.message;
}

// button intervals
const INTERVALS: Record <string, number>  = {
    '30s': 30_000,
    '1m': 60_000,
    '2m': 120_000,
    '5m': 300_000,
}

// set active interval if one is active, if not set as null
let activeInterval: ReturnType<typeof setInterval> | null = null;


export function startPolling(input: string, intervalKey: string, onResult: (result: string) => void): void {
    if (activeInterval) {
        clearInterval(activeInterval);
    }

    const ms = INTERVALS[intervalKey] ?? 30_000;

    // call immediately on submit
    handleInput(input).then(onResult);

    // then repeat on the interval
    activeInterval = setInterval(async () => {
        const result = await handleInput(input);
        onResult(result);
    }, ms);
}


export function stopPolling(): void {
    if (activeInterval) {
        clearInterval(activeInterval);
        activeInterval = null;
    }
}

