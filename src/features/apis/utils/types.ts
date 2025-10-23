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

/** Upstream request type */
export type UpstreamRequest = {
    url: string;
    method: HttpMethod;
    queryParams: Record<string, string>;
    headers: Record<string, string>;
    body: Body;
    serializedCookieJar?: string;
};

/** Upstream response type */
export type UpstreamResponse = {
    statusCode: number;
    statusMessage: string;
    headers: Record<string, string>;
    body: { encoding: string; type: string; value: string };
    serializedCookieJar: string;
    timings: {
        wait: number;
        dns: number;
        tcp: number;
        tls: number;
        request: number;
        firstByte: number;
        download: number;
        total: number;
    };
    size: number;
};

/** Request node type */
export type RequestNode = {
    _id: string;
    name: string;
    type: "request";
    method: HttpMethod;
};

/** Folder node type */
export type FolderNode = {
    _id: string;
    name: string;
    type: "folder";
    children: RequestNode[];
};

/** Collection node type */
export type CollectionNode = {
    _id: string;
    name: string;
    type: "collection";
    children: (FolderNode | RequestNode)[];
};
