// polling.ts

export interface PollResult {
    success: boolean;
    status: number;
    statusText: string;
    responseTime: number,
    headers: Record<string, string>;
    body: unknown;
}

export async function handleInput(input: string): Promise<PollResult> {
    const res = await fetch('http://localhost:5001/api/submit', {
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

let activeInterval: ReturnType<typeof setInterval> | null = null;

export function startPolling(
    input: string,
    intervalKey: string,
    onResult: (result: PollResult) => void
): void {
    if (activeInterval) {
        clearInterval(activeInterval);
    }

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
    activeInterval = setInterval(() => {
        void poll();
    }, ms);
}

export function stopPolling(): void {
    if (activeInterval) {
        clearInterval(activeInterval);
        activeInterval = null;
    }
}