/** HTTP method type */
export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "HEAD" | "OPTIONS";

/** Query param type */
export type QueryParam = {
    enabled: boolean;
    key: string;
    value: string;
    description: string;
};

/** Header type */
export type Header = {
    enabled: boolean;
    key: string;
    value: string;
    description: string;
    auto: boolean;
};

/** Body type */
export type Body = {
    type: "none" | "raw:text" | "raw:json";
    value: string;
};

/** Request type */
export type Request = {
    _id: string;
    name: string;
    method: HttpMethod;
    url: string;
    queryParams: QueryParam[];
    headers: Header[];
    body: Body;
};

/** Serialized request type */
export type SerializedRequest = {
    url: string;
    method: HttpMethod;
    queryParams: Record<string, string>;
    headers: Record<string, string>;
    body: Body;
    serializedCookieJar?: string;
};

/** Tab type */
export type Tab = { _id: string; name: string; method: HttpMethod };
