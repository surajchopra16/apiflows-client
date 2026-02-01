/** Environment configuration */
export const env = {
    ENVIRONMENT: import.meta.env.VITE_ENVIRONMENT as "production" | "development",
    HOST_URL: import.meta.env.VITE_HOST_URL as string
};
