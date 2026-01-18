/** Node type */
export type Node = {
    id: string;
    type: string;
    position: { x: number; y: number };
    parameters: any;
};

/** Connector type */
export type Connector = {
    id: string;
    source: string;
    sourcePort: string;
    target: string;
    targetPort: string;
};

/** Node props type */
export type NodeProps<T> = {
    parameters: T;
    setParameters: (parameters: T) => void;
};

/** Node context type */
export type NodeContext = {
    getNodeParameter: (name: string) => any;
    getInput: (name: string) => any;
};

/** Node specification type */
export type NodeSpec = {
    type: string;
    inputs: string[];
    outputs: string[];
    execute: (context: NodeContext) => Promise<Record<string, any>>;
};
