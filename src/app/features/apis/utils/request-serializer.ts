/** Imported modules */
import type { Request, UpstreamRequest } from "./types.ts";

/** Serialize the request */
const serializeRequest = (request: Request, serializedCookieJar?: string): UpstreamRequest => {
    // Serialize the query params
    const queryParams = request.queryParams.reduce(
        (acc, { enabled, key, value }) => {
            if (enabled) acc[key] = value;
            return acc;
        },
        {} as Record<string, string>
    );

    // Serialize the headers
    const headers = request.headers.reduce(
        (acc, { enabled, key, value }) => {
            if (enabled) acc[key] = value;
            return acc;
        },
        {} as Record<string, string>
    );

    return {
        url: request.url,
        method: request.method,
        queryParams,
        headers,
        body: request.body,
        serializedCookieJar
    };
};

export { serializeRequest };
