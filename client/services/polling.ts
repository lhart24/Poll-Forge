export interface MonitoredEndpoint {
    id: string;
    url: string;
    intervalKey: string;
    results: PollResult[]
    isActive: boolean
}   




export interface PollResult {
    success: boolean;
    status: number;
    statusText: string;
    responseTime: number;
    headers: Record<string, string>;
    body: unknown;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

export async function handleInput(input: string): Promise<PollResult> {
    const res = await fetch(`${API_URL}/api/submit`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input }),
    });

    return await res.json();
}

const INTERVALS: Record<string, number> = {
    '30s': 30_000,
    '1m': 60_000,
    '2m': 120_000,
    '5m': 300_000,
};


const activeIntervals = new Map<string, ReturnType<typeof setInterval>>();

export function startPolling(
    id: string,
    input: string,
    intervalKey: string,

    onResult: (result: PollResult) => void
): void {
    stopPolling(id)



    const ms = INTERVALS[intervalKey] ?? 30_000;

    const poll = async (): Promise<void> => {
        try {
            const result = await handleInput(input);
            onResult(result);
        } catch (err) {
            onResult({
                success: false,
                status: 500,
                statusText: 'Polling Error',
                responseTime: 0,
                headers: {},
                body: err instanceof Error ? err.message : 'Unknown error',
            });
        }
    };

    // Run immediately
    void poll();

    // Continue polling
    activeIntervals.set(id, setInterval(() => {
        void poll();
    }, ms));
}

export function stopPolling( id: string): void {
    const interval = activeIntervals.get(id)

    if (interval) {
        clearInterval(interval);
        activeIntervals.delete(id)
    }
}