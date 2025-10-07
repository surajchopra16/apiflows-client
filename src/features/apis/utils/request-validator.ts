/** Imported modules */
import type { Request } from "../store/RequestStore.ts";

/** Validates the URL */
const validateURL = (url: string) => {
    if (!url || url.trim() === "") return false;

    try {
        const parsed = new URL(url);
        return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch {
        return false;
    }
};

/** Validates the query parameters */
const validateQueryParams = (queryParams: Request["queryParams"]) => {
    const errors: string[] = [];

    queryParams.forEach((param, index) => {
        if (!param.enabled) return;

        if (!param.key || param.key.trim() === "")
            errors.push(`QueryParams[${index}]: Query parameter key is required`);

        if (!param.value || param.value.trim() === "")
            errors.push(`QueryParams[${index}]: Query parameter value is required`);
    });

    return errors;
};

/** Validates the headers */
const validateHeaders = (headers: Request["headers"]) => {
    const errors: string[] = [];

    headers.forEach((header, index) => {
        if (!header.enabled) return;

        if (!header.key || header.key.trim() === "")
            errors.push(`Headers[${index}]: Header key is required`);

        if (!header.value || header.value.trim() === "")
            errors.push(`Headers[${index}]: Header value is required`);
    });

    return errors;
};

/** Validates the body */
const validateBody = (body: Request["body"]) => {
    const errors: string[] = [];

    if (body.type === "none") return errors;

    if (!body.value || body.value.trim() === "") errors.push(`Body: Body value is required`);

    if (body.type === "raw:json") {
        try {
            JSON.parse(body.value);
        } catch {
            errors.push(`Body: Body value is not valid JSON`);
        }
    }

    return errors;
};

/** Validates the request */
const validateRequest = (request: Request) => {
    const errors: string[] = [];

    // Validate URL
    if (!validateURL(request.url)) errors.push(`URL: Invalid URL`);

    // Validate query params, headers, and body
    errors.push(...validateQueryParams(request.queryParams));
    errors.push(...validateHeaders(request.headers));
    errors.push(...validateBody(request.body));

    if (errors.length === 0) return { valid: true, error: null } as const;
    return { valid: false, error: errors.length === 1 ? errors[0] : errors.join("\n") } as const;
};

export { validateRequest };
