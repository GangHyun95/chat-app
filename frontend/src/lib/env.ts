declare global {
    interface Window {
        __ENV__: {
            GOOGLE_CLIENT_ID: string;
        };
    }
}

export const env = window.__ENV__ ?? {};